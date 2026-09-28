# -*- coding: utf-8 -*-
"""Token FBI 独立新站构建器（浅海蓝 #9EC7D8 + 奶霜白 #F5F1E8）。

产物输出到 dist/：
  - index.html          首页（Hero / 赞助位 / 全部情报卡片 / 完整情报表 CTA / 下架名单 / FAQ / 页脚）
                        注：完整情报表不在首页渲染，仅保留 `.datacta` CTA 入口
  - table/index.html    完整情报表独立页（CollectionPage + ItemList JSON-LD，名称内链到详情页）
  - sponsor/index.html  合作赞助 / 广告位刊例页（WebPage + Offer JSON-LD；首页「合作赞助 →」的落地页）
  - intel/item-NNN/index.html 每卡详情页（带 Article + BreadcrumbList JSON-LD，GEO 高 ROI）
  - robots.txt          全量 AI 爬虫放行（含 Bytespider/Baiduspider）
  - sitemap.xml         首页 + 详情页 + 开放数据
  - llms.txt/llms-full.txt  AI 可读站点地图
  - data.json           公开结构化数据（Dataset 下载源）

本脚本不依赖网络、不推送任何仓库——产出自包含于 dist/，供后续"直接覆盖"旧站。
"""
import json, html, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "data.json")
DIST = os.path.join(HERE, "dist")
INTEL = os.path.join(DIST, "intel")
ASSETS = os.path.join(HERE, "assets")   # 本地图片素材（海报等）→ 原样复制到 dist/img/
IMG_OUT = os.path.join(DIST, "img")
SITE = "https://token-fbi.com"
# 付费社群入口（小报童「AI 笔记」，带作者 refer 参数）
PAID_GROUP_URL = "https://xiaobot.net/p/ainote01?refer=06461113-647f-4f7c-895b-24864027dadd"
# 重建前清空旧 intel（旧版为 .html 平铺，现改为目录式 index.html，避免 404 残留）
shutil.rmtree(INTEL, ignore_errors=True)
os.makedirs(INTEL, exist_ok=True)
# 本地图片素材（assets/*）整目录复制到 dist/img/，页面上以 /img/xxx 引用
shutil.rmtree(IMG_OUT, ignore_errors=True)
if os.path.isdir(ASSETS):
    shutil.copytree(ASSETS, IMG_OUT)
# favicon.ico 额外在站点根再放一份：浏览器与部分爬虫会直接盲猜 /favicon.ico
_fav_ico = os.path.join(ASSETS, "favicon.ico")
if os.path.exists(_fav_ico):
    shutil.copyfile(_fav_ico, os.path.join(DIST, "favicon.ico"))

# ---------- 站点根静态文件（原样落到 dist/ 根，供页面以绝对路径外链） ----------
# 豆包拉新海报：data.json 的 poster_url 指向 https://token-fbi.com/poster-doubao-laxin.jpg，
# 必须放在 dist 根目录才会被 Cloudflare Pages 发布，否则详情页海报会 404。
ROOT_STATIC = ("poster-doubao-laxin.jpg",)
for _name in ROOT_STATIC:
    _p = os.path.join(HERE, _name)
    if os.path.exists(_p):
        shutil.copyfile(_p, os.path.join(DIST, _name))

d = json.load(open(SRC, encoding="utf-8"))
items = d.get("items", [])
# 已下架 / 已停收的平台（保留官网链接 + 下架原因，首页「下架名单」区块渲染）
retired = d.get("retired", [])
anchored = d.get("last_updated") or max((it.get("last_verified", "") for it in items), default="")

CAT_LABEL = {"model": "大模型", "tool": "工具", "event": "限时活动"}
FREE_LABEL = {"长期免费": "长期免费", "注册赠送": "注册赠送",
              "限时活动": "限时活动", "开源自部署": "开源自部署"}

def esc(x): return html.escape(str(x or ""), quote=True)

# ---------- 分享图 / 站点标识（由 gen_og_images.py 生成到 assets/，构建时复制进 dist/img/） ----------
OG_DIR = os.path.join(ASSETS, "og")
OG_IMAGE_DEFAULT = f"{SITE}/img/og/default.jpg"
OG_LOGO = f"{SITE}/img/logo.png" if os.path.exists(os.path.join(ASSETS, "logo.png")) else None

def og_image_for(idx):
    """详情页专属分享图；素材缺失时回落站点默认图，保证全站 og:image 不落空。"""
    if os.path.exists(os.path.join(OG_DIR, f"item-{idx:03d}.jpg")):
        return f"{SITE}/img/og/item-{idx:03d}.jpg"
    return OG_IMAGE_DEFAULT

def _favicon_tags():
    """favicon / 站点图标声明；对应素材不存在时不输出，避免指向 404 的 link。"""
    tags = []
    if os.path.exists(os.path.join(ASSETS, "favicon.ico")):
        tags.append('<link rel="icon" href="/favicon.ico" sizes="any">')
    for s in (32, 16):
        if os.path.exists(os.path.join(ASSETS, f"favicon-{s}x{s}.png")):
            tags.append(f'<link rel="icon" type="image/png" sizes="{s}x{s}" '
                        f'href="/img/favicon-{s}x{s}.png">')
    if os.path.exists(os.path.join(ASSETS, "apple-touch-icon.png")):
        tags.append('<link rel="apple-touch-icon" sizes="180x180" '
                    'href="/img/apple-touch-icon.png">')
    return "\n".join(tags)

FAVICON_BLOCK = _favicon_tags()

def host_of(u):
    """取 URL 的域名（去掉 www.），用于「下架名单」里展示官网域名。"""
    try:
        from urllib.parse import urlparse
        h = urlparse(str(u or "")).netloc
        return h[4:] if h.startswith("www.") else h
    except Exception:
        return ""
def freebadge_cls(free):
    return " " + free if free in ("限时活动", "长期免费", "注册赠送") else ""

def og_block(title, desc, url, image=None, ogtype="website"):
    """Open Graph + Twitter Card 元标签块（社交分享与社交流量信号）。

    image 缺省用站点默认分享图；详情页传入专属图并把 og:type 设为 article。
    """
    t = esc(title); d = esc(desc); u = esc(url)
    img = esc(image or OG_IMAGE_DEFAULT)
    return (f'<meta property="og:type" content="{ogtype}">\n'
            f'<meta property="og:site_name" content="Token FBI（Token 情报局）">\n'
            f'<meta property="og:title" content="{t}">\n'
            f'<meta property="og:description" content="{d}">\n'
            f'<meta property="og:url" content="{u}">\n'
            f'<meta property="og:image" content="{img}">\n'
            f'<meta property="og:image:width" content="1200">\n'
            f'<meta property="og:image:height" content="630">\n'
            f'<meta property="og:image:alt" content="{t}">\n'
            f'<meta name="twitter:card" content="summary_large_image">\n'
            f'<meta name="twitter:title" content="{t}">\n'
            f'<meta name="twitter:description" content="{d}">\n'
            f'<meta name="twitter:image" content="{img}">')

def slug(i, name):
    base = re.sub(r"[^\w\u4e00-\u9fa5]+", "-", name).strip("-").lower()
    base = base or f"item"
    return f"item-{i:03d}-{base}"

# 内部详情页链接映射（用于首页/推荐/赞助位内部链接 + GEO 发现）
# 纯广告位（ad_only）不生成详情页，故不进入映射，避免内链 404
hrefs = {i: f"/intel/{slug(i, it.get('name',''))}/" for i, it in enumerate(items)}
name2href = {it.get("name"): hrefs[i] for i, it in enumerate(items) if not it.get("ad_only")}

# ---------- 卡片渲染 ----------
def render_card(it, recommended=False, sponsor=False, href="#"):
    cat = it.get("category", "")
    free = it.get("free_type", "")
    name = esc(it.get("name", ""))
    vendor = esc(it.get("vendor", ""))
    modality = esc(it.get("modality", ""))
    sub = vendor or modality
    quota = esc(it.get("quota", "")).replace("\n", "<br>")
    gates = it.get("gates", []) or []
    sponsored = it.get("sponsored", False)
    entry = esc(it.get("entry_url", "#"))
    intel = esc(it.get("intel_url", "#"))
    catlabel = CAT_LABEL.get(cat, cat)
    freetag = FREE_LABEL.get(free, free)
    is_limited = (free == "限时活动") or (cat == "event")
    gate_chips = "".join(f'<span class="chip">{esc(g)}</span>' for g in gates)
    spon = '<span class="chip spon">赞助</span>' if (sponsor or sponsored) else ""
    reco = '<span class="chip reco">⭐ 站长推荐</span>' if recommended else ""
    # 备注：仅当该条目显式提供时渲染（默认全站无备注）
    note_block = f'<div class="c-note">{esc(it.get("note","")).strip()}</div>' if (it.get("note") or "").strip() else ""
    return f'''
    <article class="card{' reco-card' if recommended else ''}{' sponsor-card' if sponsor else ''}" data-cat="{cat}" data-limited="{"1" if is_limited else "0"}">
      <div class="c-top">
        <span class="cat-tag cat-{cat}">{catlabel}</span>
        <span class="free-tag{freebadge_cls(free)}">{freetag}</span>
        {reco}{spon}
      </div>
      <h3 class="c-name"><a class="c-link" href="{href}">{name}</a></h3>
      <div class="c-vendor">{sub}</div>
      <div class="c-quota">{quota}</div>
      {note_block}
      <div class="chips">{gate_chips}</div>
      <div class="c-actions">
        <a class="btn sm ghost" href="{href}" rel="bookmark">查看详情</a>
        <a class="btn sm primary" href="{entry}" target="_blank" rel="noopener">点击领取 →</a>
      </div>
    </article>'''

# ---------- 赞助位 = 广告位（独立排版，不复用情报卡字段）----------
def render_ad(it):
    """广告卡：品牌 + 卖点钩子 + 说明 + 行动按钮。不走情报卡的分类/标签/门槛结构。"""
    brand = esc(it.get("ad_brand") or it.get("name", ""))
    hook = esc(it.get("ad_hook", ""))
    desc = esc(it.get("ad_desc", ""))
    cta = esc(it.get("ad_cta", "") or "了解更多")
    url = (it.get("entry_url", "") or "").strip()
    detail = name2href.get(it.get("name"), "")
    featured = " featured" if it.get("ad_featured") else ""
    if url and url != "#":
        main_cta = (f'<a class="btn sm ad-cta" href="{esc(url)}" target="_blank" '
                    f'rel="noopener nofollow sponsored">{cta} →</a>')
        more = (f'<a class="ad-more" href="{detail}">查看详情</a>'
                if detail and detail != "#" else "")
    elif detail and detail != "#":
        main_cta = f'<a class="btn sm ad-cta" href="{detail}">{cta} →</a>'
        more = ""
    else:
        main_cta, more = "", ""
    hook_html = f'<div class="ad-hook">{hook}</div>' if hook else ""
    desc_html = f'<div class="ad-desc">{desc}</div>' if desc else ""
    # 角标文案：默认标注「赞助」（真赞助方）；条目可设 ad_badge=false 关闭
    badge_txt = it.get("ad_badge", "赞助")
    badge_html = f'<span class="ad-badge">{esc(badge_txt)}</span>' if badge_txt else ""
    return f'''<article class="ad-tile{featured}">
  {badge_html}
  <div class="ad-brand">{brand}</div>
  {hook_html}
  {desc_html}
  <div class="ad-foot">{main_cta}{more}</div>
</article>'''

# ---------- 站长推荐（仅作标识，不再单列板块）----------
RECO_NAMES = ["阶跃星辰 StepFun", "美团 longcat 大模型"]
RECO_SET = set(RECO_NAMES)

# 编辑列表口径：赞助条目只出现在赞助位，不进入「全部情报」与情报表
editorial = [it for it in items if not it.get("sponsored")]
cards_html = [render_card(it, recommended=(it.get("name") in RECO_SET), href=name2href.get(it.get("name"), "#")) for it in editorial]

# ---------- 赞助位（广告位）----------
sponsor_items = [it for it in items if it.get("sponsored")]
# 主赞助位排最前，其余按数据顺序
sponsor_items.sort(key=lambda it: 0 if it.get("ad_featured") else 1)
sponsor_cards = "\n".join(render_ad(it) for it in sponsor_items)
sponsor_html = f'''
<section class="sponsor-wrap"><div class="wrap">
  <div class="ad-head">
    <span class="sponsor-tag">广告位</span>
    <span class="ad-note">广告内容单独标注，不参与情报排序与收录判断。</span>
    <a class="ad-inquiry" href="/sponsor/">合作赞助 →</a>
  </div>
  <div class="ad-row">
    {sponsor_cards}
  </div>
</div></section>'''

# ---------- 下架名单 ----------
# 来自 data.json 的 retired 数组：保留官网入口 + 写明下架原因
retired_rows = []
for r in retired:
    ru = (r.get("url") or "").strip()
    retired_rows.append(
        f'<li><div class="r-top"><span class="r-name">{esc(r.get("name", ""))}</span>'
        f'<a class="r-url" href="{esc(ru)}" target="_blank" rel="noopener nofollow">'
        f'{esc(host_of(ru))} ↗</a></div>'
        f'<p class="r-why"><b>下架原因</b>{esc(r.get("reason", ""))}</p></li>')

retired_html = f'''
<section class="section" id="retired"><div class="wrap">
  <h2 class="sec-title">下架名单</h2>
  <p class="sec-sub">这些平台已不再收录，保留官网入口并写明下架原因。</p>
  <ul class="retired">
    {chr(10).join("    " + x for x in retired_rows)}
  </ul>
</div></section>'''

# ---------- 全部资料：完整情报表 ----------
data_rows = []
for it in editorial:
    nm = esc(it.get("name", ""))
    catlabel = CAT_LABEL.get(it.get("category", ""), it.get("category", ""))
    freetag = FREE_LABEL.get(it.get("free_type", ""), it.get("free_type", ""))
    quota = esc(it.get("quota", "")).replace("\n", "<br>")
    region = esc(it.get("region", ""))
    valid = esc(it.get("validity", "")) or "长期（以平台为准）"
    entry = esc(it.get("entry_url", "#"))
    inner = name2href.get(it.get("name"), "")
    nm_html = (f'<a class="dt-name" href="{inner}">{nm}</a>' if inner and inner != "#" else nm)
    data_rows.append(
        f'<tr><td class="dn">{nm_html}</td><td>{catlabel}</td><td>{freetag}</td>'
        f'<td class="dq">{quota}</td><td>{region}</td><td>{valid}</td>'
        f'<td><a class="dt-link" href="{entry}" target="_blank" rel="noopener">点击领取 →</a></td></tr>')
data_table_html = "\n".join(data_rows)

# ---------- JSON-LD（首页） ----------
itemlist = [{"@type": "ListItem", "position": p + 1,
             "name": it.get("name"), "url": f"{SITE}{name2href.get(it.get('name'), '/')}"}
            for p, it in enumerate(editorial)]
org_ld = {"@type": "Organization", "@id": f"{SITE}#org", "name": "Token FBI（Token 情报局）",
          "url": SITE, "description": "开源、免费的 AI token 情报站，汇总当前仍可领取的免费大模型 API 与工具额度。",
          "image": OG_IMAGE_DEFAULT,
          "sameAs": ["https://github.com/hope0719/token-fbi"]}
if OG_LOGO:
    org_ld["logo"] = {"@type": "ImageObject", "url": OG_LOGO, "width": 512, "height": 512}

graph = {
    "@context": "https://schema.org",
    "@graph": [
        org_ld,
        {"@type": "WebSite", "@id": f"{SITE}#website", "url": SITE, "name": "Token FBI",
         "publisher": {"@id": f"{SITE}#org"}},
        {"@type": "CollectionPage", "@id": f"{SITE}#webpage", "url": SITE, "name": "Token FBI 免费 AI 额度情报库",
         "description": f"收录 {len(editorial)} 条免费大模型/工具 API 额度情报。",
         "image": OG_IMAGE_DEFAULT,
         "mainEntity": {"@type": "ItemList", "numberOfItems": len(editorial), "itemListElement": itemlist},
         "publisher": {"@id": f"{SITE}#org"}},
        {"@type": "Dataset", "@id": f"{SITE}#dataset", "name": "Token FBI 免费 AI 额度情报数据集",
         "dateModified": anchored,
         "description": f"当前收录的 {len(editorial)} 条免费大模型/工具 API 额度情报。",
         "url": f"{SITE}/data.json",
         "image": OG_IMAGE_DEFAULT,
         "distribution": [{"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": f"{SITE}/data.json"}],
         "variableMeasured": [
             {"@type": "PropertyValue", "name": "收录情报总数", "value": len(editorial)}],
         "publisher": {"@id": f"{SITE}#org"}},
        {"@type": "FAQPage", "@id": f"{SITE}#faq",
         "mainEntity": [
             {"@type": "Question", "name": "Token FBI 要钱吗？需要注册吗？",
              "acceptedAnswer": {"@type": "Answer", "text": "不要钱，也不需要注册。站点是无登录的纯静态站，不收集个人信息。所有领取操作都跳转到平台官方页面完成。"}},
             {"@type": "Question", "name": "你们的收录标准是什么？",
              "acceptedAnswer": {"@type": "Answer", "text": "优先收录能直接调用前沿模型的平台；多模态或聚合价值高的作为保留。只挂冷门自研/旧代际模型的平台会被下架。"}},
             {"@type": "Question", "name": "信息更新频率怎么样？免费额度会一直有效吗？",
              "acceptedAnswer": {"@type": "Answer", "text": "数据每日更新。免费额度本身有时效，平台可能随时调整或取消，请以各平台官方页面为准。"}},
             {"@type": "Question", "name": "我领不到 / 链接失效 / 额度过期了怎么办？",
              "acceptedAnswer": {"@type": "Answer", "text": "去 GitHub 仓库提 Issue 反馈，我们会复核并修正；或加微信群直接反馈。"}},
             {"@type": "Question", "name": "能帮我接入 API、写代码吗？",
              "acceptedAnswer": {"@type": "Answer", "text": "不会。这是情报站，不是代写代跑服务。我们只告诉你哪家免费、怎么领，不替你接入。"}}]}
    ]
}
jsonld = json.dumps(graph, ensure_ascii=False, indent=2)

n_model = sum(1 for i in editorial if i.get("category") == "model")
n_tool = sum(1 for i in editorial if i.get("category") == "tool")
# 「限时活动」按 free_type 统计（与 category 正交：这些条目同时归入大模型/工具）
n_event = sum(1 for i in editorial if i.get("free_type") == "限时活动")

# ---------- 首页模板 ----------
TEMPLATE = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Token FBI · 免费 AI 额度情报站</title>
<meta name="description" content="开源、免费的 AI token 情报站，汇总当前仍可领取的免费大模型 API 与工具额度。无需注册、无需绑卡，浏览器打开即用。">
<meta name="author" content="Token FBI（Token 情报局）">
<link rel="canonical" href="https://token-fbi.com/">
{OG}
<script type="application/ld+json">{JSONLD}</script>
<style>
:root{
  --bg:#F5F1E8; --bg2:#FFFFFF; --bg3:#EFE8DA; --bg4:#E6DDC9;
  --line:rgba(34,52,58,.12); --line2:rgba(34,52,58,.26);
  --text:#1F2A2E; --text2:#4C5A5E; --text3:#849094;
  --accent:#9EC7D8; --accent-deep:#2F6F82; --accent-2:#7FB3C8;
  --accent-soft:rgba(158,199,216,.22); --accent-ink:#0E2A33;
  --ok:#3F8F6B; --ok-soft:rgba(63,143,107,.12);
  --warn:#C08A2E; --warn-soft:rgba(192,138,46,.14);
  --danger:#C2543F; --danger-soft:rgba(194,84,63,.12);
  --r:16px; --r-sm:10px;
  --shadow:0 10px 30px rgba(34,52,58,.10);
  --nav-bg:rgba(245,241,232,.86);
  --sans:-apple-system,BlinkMacSystemFont,"PingFang SC","HarmonyOS Sans SC","Noto Sans SC","Microsoft YaHei",sans-serif;
  --mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%}
.wrap{max-width:1180px;margin:0 auto;padding:0 22px}
.nav{position:sticky;top:0;z-index:50;background:var(--nav-bg);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;align-items:center;gap:18px;height:62px;flex-wrap:nowrap}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;letter-spacing:.02em;white-space:nowrap;flex-shrink:0}
.brand .dot{width:11px;height:11px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--accent-soft);flex-shrink:0}
.nav-links{display:flex;gap:22px;margin-left:8px;font-size:14.5px;color:var(--text2);white-space:nowrap}
.nav-links a{white-space:nowrap}
.nav-links a:hover{color:var(--accent-deep)}
.nav-right{margin-left:auto;display:flex;gap:10px;align-items:center;flex-shrink:0}
.nav-right .btn{padding:9px 18px;font-size:14px;white-space:nowrap}
.btn{display:inline-flex;align-items:center;gap:7px;font-weight:700;border-radius:99px;transition:.18s;cursor:pointer;border:1px solid transparent;font-size:14.5px;white-space:nowrap}
.btn.sm{padding:9px 16px;font-size:13.5px}
.btn.primary{background:var(--accent);color:var(--accent-ink);box-shadow:0 6px 18px var(--accent-soft)}
.btn.primary:hover{background:var(--accent-2);transform:translateY(-1px)}
.btn.ghost{background:var(--bg2);color:var(--text);border-color:var(--line2)}
.btn.ghost:hover{border-color:var(--accent-deep);color:var(--accent-deep)}
.btn.line{background:transparent;color:var(--text2);border-color:var(--line2)}
.btn.line:hover{color:var(--accent-deep);border-color:var(--accent-deep)}
.hero{padding:34px 0 18px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(760px 280px at 50% -14%,var(--accent-soft),transparent 70%);pointer-events:none}
.hero-top{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.badge-dot{display:inline-block;font-family:var(--mono);font-size:11.5px;color:var(--accent-deep);background:var(--accent-soft);border:1px solid var(--accent);padding:3px 11px;border-radius:99px}
.hero-link{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:750;color:var(--accent-deep);background:var(--bg2);border:1px solid var(--accent);padding:3px 12px;border-radius:99px;transition:.18s;white-space:nowrap}
.hero-link:hover{background:var(--accent-soft);border-color:var(--accent-deep)}
.hero h1{font-size:clamp(25px,4.1vw,38px);line-height:1.14;font-weight:850;letter-spacing:-.01em}
.hero h1 .hl{color:var(--accent-deep)}
.hero .sub{max-width:900px;margin:11px auto 0;color:var(--text2);font-size:14.5px;line-height:1.5}
.hero .sub b{color:var(--text)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0 4px}
.stat{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;text-align:center;box-shadow:var(--shadow)}
.stat .sv{font-size:24px;font-weight:850;color:var(--accent-deep);font-family:var(--mono)}
.stat .sl{display:block;margin-top:3px;color:var(--text2);font-size:12.5px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-bottom:30px}
.card{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:18px;display:flex;flex-direction:column;gap:9px;transition:.18s;box-shadow:var(--shadow);position:relative;overflow:hidden}
.card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent);opacity:.0;transition:.18s}
.card:hover{transform:translateY(-3px);border-color:var(--accent)}
.card:hover::before{opacity:1}
.c-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.cat-tag{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:7px;background:var(--bg3);color:var(--text2)}
.cat-model{background:var(--accent-soft);color:var(--accent-deep)}
.free-tag{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:7px;background:var(--bg3);color:var(--text2)}
.free-限时活动{background:var(--warn-soft);color:var(--warn)}
.free-长期免费{background:var(--ok-soft);color:var(--ok)}
.free-注册赠送{background:var(--accent-soft);color:var(--accent-deep)}
.c-name{font-size:17px;font-weight:800;line-height:1.25}
.c-name a{color:inherit;text-decoration:none}
.c-name a:hover{color:var(--accent-deep)}
.c-vendor{font-size:13px;color:var(--text3);display:flex;align-items:center;gap:7px}
.c-quota{font-size:13.5px;color:var(--text2);line-height:1.5}
.c-note{background:var(--warn-soft);color:var(--warn);border-radius:9px;padding:9px 11px;font-size:13px;font-weight:750;line-height:1.55}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px}
.chip{font-size:11px;padding:2px 8px;border-radius:6px;background:var(--accent-soft);color:var(--accent-deep);border:1px solid var(--accent)}
.chip.spon{background:transparent;color:var(--text3);border-color:var(--line2)}
.c-actions{display:flex;gap:8px;margin-top:auto;padding-top:8px}
.section{padding:46px 0}
.sec-title{font-size:26px;font-weight:850;text-align:center;margin-bottom:8px}
.sec-sub{text-align:center;color:var(--text2);margin-bottom:26px}
.faq{max-width:820px;margin:0 auto;display:grid;gap:12px}
.faq-item{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:16px 20px}
.faq-item h4{font-size:15.5px;font-weight:750;display:flex;gap:9px;align-items:baseline}
.faq-item h4 .q{color:var(--accent-deep);font-family:var(--mono);font-size:14px}
.faq-item p{margin-top:7px;color:var(--text2);font-size:14px}
.footer{background:var(--bg3);border-top:1px solid var(--line);padding:38px 0 30px;margin-top:30px}
.footer-in{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:26px}
.footer h5{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:12px}
.footer a{display:block;color:var(--text2);font-size:14px;padding:3px 0}
.footer a:hover{color:var(--accent-deep)}
.footer .disc{font-size:12.5px;color:var(--text3);line-height:1.6;margin-top:14px}
.foot-bottom{text-align:center;color:var(--text3);font-size:12.5px;margin-top:26px;padding-top:18px;border-top:1px solid var(--line)}
.sponsor-wrap{margin-top:24px}
.ad-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.sponsor-tag{font-size:12px;font-weight:800;letter-spacing:.06em;color:#fff;background:var(--accent-deep);padding:4px 11px;border-radius:8px;flex-shrink:0}
.ad-note{font-size:13px;color:var(--text3)}
.ad-inquiry{margin-left:auto;font-size:13px;font-weight:700;color:var(--accent-deep);white-space:nowrap}
.ad-inquiry:hover{text-decoration:underline}
.ad-row{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:16px}
.ad-tile{position:relative;display:flex;flex-direction:column;gap:9px;background:var(--bg2);border:1px solid var(--line2);border-radius:var(--r);padding:20px;overflow:hidden;transition:.18s;box-shadow:var(--shadow)}
.ad-tile::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent);opacity:.9}
.ad-tile:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(34,52,58,.16)}
.ad-badge{position:absolute;top:0;right:0;font-size:10.5px;font-weight:800;letter-spacing:.1em;color:var(--text3);background:rgba(34,52,58,.06);padding:5px 11px;border-radius:0 var(--r) 0 10px}
.ad-brand{font-size:13px;font-weight:800;letter-spacing:.06em;color:var(--accent-deep);text-transform:uppercase;padding-right:52px}
.ad-hook{font-size:19.5px;font-weight:850;line-height:1.3;letter-spacing:-.01em;color:var(--text)}
.ad-desc{font-size:13.5px;color:var(--text2);line-height:1.6}
.ad-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:auto;padding-top:14px}
.ad-cta{background:var(--accent-deep);color:#fff;padding:9px 18px;font-size:13.5px}
.ad-cta:hover{background:#27606f;transform:translateY(-1px)}
.ad-more{font-size:13px;font-weight:700;color:var(--text2)}
.ad-more:hover{color:var(--accent-deep)}
/* 主赞助位：加深底色，让付费位真正被看到 */
.ad-tile.featured{background:linear-gradient(150deg,#3D8399 0%,#2F6F82 62%,#2A6273 100%);border-color:transparent}
.ad-tile.featured::before{display:none}
.ad-tile.featured .ad-badge{background:rgba(255,255,255,.18);color:rgba(255,255,255,.92)}
.ad-tile.featured .ad-brand{color:rgba(255,255,255,.8)}
.ad-tile.featured .ad-hook{color:#fff}
.ad-tile.featured .ad-desc{color:rgba(255,255,255,.82)}
.ad-tile.featured .ad-cta{background:#fff;color:var(--accent-deep)}
.ad-tile.featured .ad-cta:hover{background:#EAF3F7}
.ad-tile.featured .ad-more{color:rgba(255,255,255,.82)}
.ad-tile.featured .ad-more:hover{color:#fff}
.reco-card{border-color:var(--accent)}
.reco-card::before{opacity:1}
.chip.reco{background:var(--accent-deep);color:#fff;border-color:var(--accent-deep)}
.datacta{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;box-shadow:var(--shadow)}
.datacta-main{display:flex;flex-direction:column;gap:4px;min-width:220px;flex:1}
.datacta-main strong{font-size:17px;font-weight:800;color:var(--text)}
.datacta-main span{font-size:13.5px;color:var(--text2)}
.retired{list-style:none;display:grid;gap:10px}
.retired li{background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.r-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.r-name{font-size:14.5px;font-weight:800;color:var(--text2)}
.r-url{font-family:var(--mono);font-size:12px;color:var(--text3)}
.r-url:hover{color:var(--accent-deep);text-decoration:underline}
.r-why{margin-top:6px;font-size:13px;color:var(--text2);line-height:1.65}
.r-why b{display:inline-block;margin-right:7px;font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--warn);background:var(--warn-soft);border-radius:6px;padding:2px 7px}
.contact-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.contact-card{display:flex;flex-direction:column;gap:8px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:20px;box-shadow:var(--shadow);transition:.18s}
.contact-card:hover{border-color:var(--accent);transform:translateY(-2px)}
.ct-tag{align-self:flex-start;font-size:11.5px;font-weight:800;letter-spacing:.06em;color:var(--accent-deep);background:var(--accent-soft);border-radius:7px;padding:3px 10px}
.ct-main{font-size:17px;font-weight:850;color:var(--text);word-break:break-all;line-height:1.35}
.ct-main a{color:var(--accent-deep)}
.ct-main a:hover{text-decoration:underline}
.ct-code{font-family:var(--mono);font-size:16px;letter-spacing:.02em;background:var(--accent-soft);color:var(--accent-deep);padding:2px 10px;border-radius:7px}
.ct-desc{font-size:13.5px;color:var(--text2);line-height:1.6}
.contact-card .btn{align-self:flex-start;margin-top:2px}
@media(max-width:1080px){.nav-right .btn.line{display:none}}
@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}.ad-row{grid-template-columns:repeat(2,1fr)}.contact-row{grid-template-columns:repeat(2,1fr)}.stats{grid-template-columns:repeat(2,1fr)}.footer-in{grid-template-columns:1fr}}
@media(max-width:820px){.nav-in{gap:14px}.nav-links{gap:14px;margin-left:0;font-size:13px}}
@media(max-width:700px){.nav-links{display:none}}
@media(max-width:600px){.grid{grid-template-columns:1fr}.ad-row{grid-template-columns:1fr}.contact-row{grid-template-columns:1fr}.nav-right .btn{padding:8px 14px;font-size:13px}}
@media(max-width:420px){.brand{font-size:16px}.brand .dot{width:10px;height:10px}}
</style>
</head>
<body>
<nav class="nav"><div class="wrap nav-in">
  <div class="brand"><span class="dot"></span>Token FBI</div>
  <div class="nav-links"><a href="#list">情报列表</a><a href="/table/">完整情报表</a><a href="#faq">常见问题</a><a href="/about/">关于</a></div>
  <div class="nav-right">
    <a class="btn primary" href="#list">查看免费额度 →</a>
    <a class="btn line" href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">在 GitHub 上查看</a>
  </div>
</div></nav>

<header class="hero"><div class="wrap">
  <div class="hero-top">
    <span class="badge-dot">连续投稿 · 全网免费 AI token 情报</span>
    <a class="hero-link" href="https://hope0719.github.io/ai-pick/" target="_blank" rel="noopener">活动雷达 →</a>
  </div>
  <h1>把值得领取的 <span class="hl">AI 额度</span>放在一处。</h1>
  <p class="sub">额度、模型、领取方式一次查清，每条都标注<b>免费类型、门槛与截止时间，不靠猜。</b></p>
  <div class="stats">
    <div class="stat"><span class="sv">{N_TOTAL}</span><span class="sl">情报总数</span></div>
    <div class="stat"><span class="sv">{N_MODEL}</span><span class="sl">大模型</span></div>
    <div class="stat"><span class="sv">{N_TOOL}</span><span class="sl">工具</span></div>
    <div class="stat" title="按「免费类型＝限时活动」统计，与上方分类维度交叉"><span class="sv">{N_EVENT}</span><span class="sl">限时活动</span></div>
  </div>
</div></header>

{SPONSOR}

<main class="wrap" id="list">
  <h2 class="sec-title" style="text-align:left;font-size:23px;margin-bottom:20px">全部情报</h2>
  <div class="grid" id="grid">
    {CARDS}
  </div>
</main>

<section class="section"><div class="wrap">
  <div class="datacta">
    <div class="datacta-main">
      <strong>完整情报表（{N_TOTAL} 条）</strong>
      <span>逐条列出免费类型、额度摘要、适用地区与截止时间，附直达平台入口。</span>
    </div>
    <a class="btn primary sm" href="/table/">查看完整情报表 →</a>
  </div>
</div></section>

{OFFICIAL}

<section class="section" id="faq"><div class="wrap">
  <h2 class="sec-title">常见问题</h2>
  <p class="sec-sub">关于收录、更新与使用的核心问题</p>
  <div class="faq">
    <div class="faq-item"><h4><span class="q">Q1</span>Token FBI 要钱吗？需要注册吗？</h4><p>不要钱，也不需要注册。站点是无登录的纯静态站，不收集个人信息。所有领取操作都跳转到平台官方页面完成。</p></div>
    <div class="faq-item"><h4><span class="q">Q2</span>你们的收录标准是什么？</h4><p>优先收录能直接调用前沿模型的平台；多模态或聚合价值高的作为保留。只挂冷门自研/旧代际模型的平台会被下架。</p></div>
    <div class="faq-item"><h4><span class="q">Q3</span>信息更新频率怎么样？免费额度会一直有效吗？</h4><p>数据每日更新。免费额度本身有时效，平台可能随时调整或取消，请以各平台官方页面为准。</p></div>
    <div class="faq-item"><h4><span class="q">Q4</span>我领不到 / 链接失效 / 额度过期了怎么办？</h4><p>去 GitHub 仓库提 Issue 反馈，我们会复核并修正；或加微信群直接反馈。</p></div>
    <div class="faq-item"><h4><span class="q">Q5</span>能帮我接入 API、写代码吗？</h4><p>不会。这是情报站，不是代写代跑服务。我们只告诉你哪家免费、怎么领，不替你接入。</p></div>
  </div>
</div></section>

<section class="section" id="contact"><div class="wrap">
  <h2 class="sec-title">联系方式</h2>
  <p class="sec-sub">加群 · 提交情报 · 进一步学习</p>
  <div class="contact-row">
    <div class="contact-card">
      <span class="ct-tag">免费微信群</span>
      <span class="ct-main">微信 <span class="ct-code">lmfh2022</span></span>
      <span class="ct-desc">添加我的微信，加入「Token 情报局」免费微信群。</span>
    </div>
    <div class="contact-card">
      <span class="ct-tag">提交情报</span>
      <span class="ct-main"><a href="mailto:1821522570@qq.com">1821522570@qq.com</a></span>
      <span class="ct-desc">如果你有有效的价值信息想要提交，也可以发送邮件给我。</span>
    </div>
    <div class="contact-card">
      <span class="ct-tag">付费社群</span>
      <span class="ct-main">99 元 / 年</span>
      <span class="ct-desc">想要进一步学习，也可以加入作者付费社群。</span>
      <a class="btn primary sm" href="{PAID_GROUP_URL}" target="_blank" rel="noopener">立即加入 →</a>
    </div>
  </div>
</div></section>

<footer class="footer" id="about"><div class="wrap">
  <div class="footer-in">
    <div>
      <div class="brand" style="margin-bottom:12px"><span class="dot"></span>Token FBI</div>
      <p class="disc">开源、免费的 AI token 情报站。业余维护、零软文；广告位明码标价、单独标注，不参与任何核验与收录判断。所有链接直达平台官方页面。</p>
    </div>
    <div>
      <h5>资源</h5>
      <a href="/table/">完整情报表</a>
      <a href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">GitHub 仓库</a>
      <a href="/data.json" target="_blank" rel="noopener">开放数据 data.json</a>
      <a href="/llms.txt" target="_blank" rel="noopener">llms.txt</a>
      <a href="/robots.txt" target="_blank" rel="noopener">robots.txt</a>
    </div>
    <div>
      <h5>参与</h5>
      <a href="/about/">关于本站</a>
      <a href="/sponsor/">合作赞助</a>
      <a href="https://github.com/hope0719/token-fbi/issues" target="_blank" rel="noopener">提交情报（Issue）</a>
      <a href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">提 PR 修正</a>
      <a href="#list">回到列表</a>
    </div>
  </div>
  <div class="foot-bottom">© 2026 Token FBI（Token 情报局）· 本站不替代各平台官方政策</div>
</div></footer>

</body>
</html>'''

og_home = og_block(
    "Token FBI · 免费 AI 额度情报站",
    "开源、免费的 AI token 情报站，汇总当前仍可领取的免费大模型 API 与工具额度。无需注册、无需绑卡，浏览器打开即用。",
    SITE + "/")

index_html = (TEMPLATE
       .replace("{JSONLD}", jsonld)
       .replace("{OG}", og_home)
       .replace("{CARDS}", "\n".join(cards_html))
       .replace("{SPONSOR}", sponsor_html)
       .replace("{OFFICIAL}", retired_html)
       .replace("{DATA_TABLE}", data_table_html)
       .replace("{N_TOTAL}", str(len(editorial)))
       .replace("{N_MODEL}", str(n_model))
       .replace("{N_TOOL}", str(n_tool))
       .replace("{N_EVENT}", str(n_event))
       .replace("{PAID_GROUP_URL}", PAID_GROUP_URL)
       .replace("{ANCHOR}", anchored))

# ---------- 每卡详情页 ----------
DETAIL = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{NAME} 免费额度与活动详情｜Token FBI</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="{CANON}">
{OG}
<script type="application/ld+json">{LD}</script>
<script type="application/ld+json">{BREAD}</script>
<style>
:root{--bg:#F5F1E8;--bg2:#fff;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--accent-soft:rgba(158,199,216,.22);--warn:#C08A2E;--warn-soft:rgba(192,138,46,.14);--mono:"JetBrains Mono",ui-monospace,Menlo,monospace;--r:16px;--shadow:0 10px 30px rgba(34,52,58,.08);--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.7;padding:40px 22px}
.wrap{max-width:820px;margin:0 auto}
a{color:var(--accent-deep);text-decoration:none;font-weight:700}
.back{display:block;margin-bottom:14px;color:var(--text2);font-weight:600;font-size:14px}
.back:hover{color:var(--accent-deep)}
h1{font-size:clamp(23px,4.4vw,30px);line-height:1.24;letter-spacing:-.01em;margin-bottom:6px}
.kicker{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.05em;color:#fff;background:var(--accent-deep);padding:4px 11px;border-radius:8px;margin-bottom:14px}
.lead{color:var(--text2);margin:12px 0 26px;font-size:16px}
.fact{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:22px 0}
.fact div{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;min-width:0}
.fact dt{font-size:12px;color:var(--text2);letter-spacing:.04em}
.fact dd{font-size:15px;font-weight:700;margin-top:3px;word-break:break-word}
section{margin:24px 0}
section h2{font-size:18px;color:var(--accent-deep);margin-bottom:8px}
section p{color:var(--text2);font-size:15px}
.cta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:30px 0 0;padding-top:24px;border-top:1px solid var(--line)}
.btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:12px 22px;background:var(--accent);color:#0E2A33;box-shadow:0 6px 18px var(--accent-soft);transition:.18s}
.btn.line{background:var(--bg2);color:var(--accent-deep);border:1px solid var(--accent);box-shadow:none}
.btn.line:hover{background:var(--accent-soft)}
.disc{font-size:13px;color:var(--text2);margin-top:18px}
.note-warn{background:var(--warn-soft);color:var(--warn);border-radius:var(--r);padding:14px 16px;margin:20px 0;font-weight:750;font-size:15px;line-height:1.6}
.invite{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:16px 18px}
.invite a{color:var(--accent-deep);word-break:break-all}
.invite code{font-family:var(--mono);background:var(--accent-soft);color:var(--accent-deep);padding:2px 9px;border-radius:6px;font-weight:800;font-size:14.5px;letter-spacing:.05em}
.poster-box{display:flex;justify-content:center;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:16px;box-shadow:var(--shadow)}
.poster-box img{display:block;width:100%;max-width:420px;height:auto;border-radius:10px}
.poster-cap{text-align:center;font-size:13px;color:var(--text2);margin-top:10px}
@media(min-width:601px){.fact>div:last-child:nth-child(odd){grid-column:1/-1}}
@media(max-width:600px){.fact{grid-template-columns:1fr}.poster-box{padding:10px}}
</style>
</head>
<body><div class="wrap">
<a class="back" href="/">← 返回 Token FBI 全部情报</a>
<span class="kicker">{CAT}</span>
<h1>{NAME} 免费额度与活动详情</h1>
{LEAD}
<dl class="fact">
  <div><dt>免费类型</dt><dd>{FREE}</dd></div>
  <div><dt>适用地区</dt><dd>{REGION}</dd></div>
  <div><dt>截止时间</dt><dd>{VALIDITY_TXT}</dd></div>
  <div><dt>支持模型 / 能力</dt><dd>{MODALITY}</dd></div>
</dl>
{POSTER_SEC}
<section><h2>免费额度与活动口径</h2><p>{QUOTA}</p></section>
{NOTE_SEC}
{EFFECT_SEC}
<section><h2>核验说明</h2><p>本页由 Token 情报局根据公开页面与实际入口进行人工整理。额度、模型和活动时间可能变化，请在领取前再次查看平台页面。</p></section>
{INVITE_SEC}
<div class="cta">{ENTRY_BTN}<a class="btn line" href="/">查看全部情报</a></div>
<p class="disc">部分平台入口可能包含邀请参数；这不会改变本站对免费额度与使用限制的编辑判断。本站不替代各平台官方政策。</p>
</div></body></html>'''

def clip_desc(text, limit=150):
    """按句读边界截断描述，避免 meta / JSON-LD 里出现半句话。"""
    t = (text or "").strip()
    if len(t) <= limit:
        return t
    window = t[:limit]
    for mark in ("。", "；", "！", "？", "!"):
        idx = window.rfind(mark)
        if idx >= 40:
            return window[:idx + 1]
    idx = window.rfind("，")
    if idx >= 40:
        return window[:idx + 1]
    return window


detail_written = 0
for i, it in enumerate(items):
    if it.get("ad_only"):
        continue  # 纯广告位不生成详情页
    s = slug(i, it.get("name", ""))
    name = esc(it.get("name", ""))
    raw_name = it.get("name", "")
    cat = CAT_LABEL.get(it.get("category", ""), it.get("category", ""))
    free = FREE_LABEL.get(it.get("free_type", ""), it.get("free_type", ""))
    quota = esc(it.get("quota", "")).replace("\n", "<br>")
    effect = esc(it.get("effect", ""))
    modality = esc(it.get("modality", "")) or esc(it.get("vendor", ""))
    last = esc(it.get("last_verified", ""))
    region = esc(it.get("region", "")) or "不限"
    validity_txt = esc(it.get("validity", "")) or "长期（以平台为准）"
    entry = esc(it.get("entry_url", "#"))
    canon = f"{SITE}/intel/{s}/"
    desc = clip_desc((it.get("quota", "") or "").replace("\n", " "))
    og_img = og_image_for(i)
    ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": f"{raw_name} 免费额度与活动详情｜Token FBI",
        "description": desc,
        "mainEntityOfPage": {"@type": "WebPage", "@id": canon},
        "dateModified": last,
        "datePublished": last,
        "inLanguage": "zh-CN",
        "image": {"@type": "ImageObject", "url": og_img, "width": 1200, "height": 630},
        "author": {"@type": "Organization", "name": "Token FBI（Token 情报局）"},
        "publisher": {"@type": "Organization", "name": "Token FBI（Token 情报局）", "url": SITE}
    }, ensure_ascii=False)
    breadcrumb_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Token FBI 免费 AI 额度情报站", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": raw_name, "item": canon}
        ]
    }, ensure_ascii=False)
    og_detail = og_block(
        f"{raw_name} 免费额度与活动详情｜Token FBI",
        desc,
        canon,
        image=og_img,
        ogtype="article")
    # 空字段不渲染：没有内容就不输出对应小块，避免空标题/空段落
    lead_html = f'<p class="lead">{effect}</p>' if effect else ""
    effect_sec_html = (f'<section><h2>使用判断与限制</h2><p>{effect}</p></section>'
                       if effect else "")
    # 备注（仅当条目显式提供时渲染）
    note_txt = esc(it.get("note", "")).strip()
    note_sec_html = f'<p class="note-warn">{note_txt}</p>' if note_txt else ""
    # 专属邀请（仅详情页渲染；卡片/领取入口不出现邀请码）
    invite_text = esc(it.get("invite_text", ""))
    invite_url = esc(it.get("invite_url", ""))
    invite_code = esc(it.get("invite_code", ""))
    if invite_text and invite_url:
        invite_lines = f'<p>{invite_text}</p>'
        invite_lines += (f'<p>立即体验：<a href="{invite_url}" target="_blank" '
                         f'rel="noopener nofollow">{invite_url}</a></p>')
        if invite_code:
            invite_lines += f'<p>邀请码：<code>{invite_code}</code></p>'
        invite_sec_html = f'<section class="invite"><h2>专属邀请</h2>{invite_lines}</section>'
    else:
        invite_sec_html = ""
    # 海报（仅当条目显式提供 poster_url 时渲染；用于拉新/推广类赞助条目的落地海报）
    poster_url = (it.get("poster_url") or "").strip()
    if poster_url:
        poster_alt = esc(it.get("poster_alt") or f"{raw_name} 活动海报")
        poster_cap = esc((it.get("poster_caption") or "").strip())
        poster_link = (it.get("poster_link") or "").strip()
        poster_img = (f'<img src="{esc(poster_url)}" alt="{poster_alt}" loading="lazy" '
                      f'decoding="async">')
        if poster_link:
            poster_img = (f'<a href="{esc(poster_link)}" target="_blank" '
                          f'rel="noopener nofollow sponsored">{poster_img}</a>')
        poster_cap_html = f'<p class="poster-cap">{poster_cap}</p>' if poster_cap else ""
        poster_sec_html = (f'<section class="poster"><h2>活动海报</h2>'
                           f'<div class="poster-box">{poster_img}</div>{poster_cap_html}</section>')
    else:
        poster_sec_html = ""
    html_doc = (DETAIL
        .replace("{NAME}", name).replace("{CAT}", cat).replace("{FREE}", free)
        .replace("{LAST}", last).replace("{MODALITY}", modality).replace("{QUOTA}", quota)
        .replace("{REGION}", region).replace("{VALIDITY_TXT}", validity_txt)
        .replace("{LEAD}", lead_html).replace("{EFFECT_SEC}", effect_sec_html)
        .replace("{INVITE_SEC}", invite_sec_html).replace("{NOTE_SEC}", note_sec_html)
        .replace("{POSTER_SEC}", poster_sec_html)
        # 注意：详情页不展示官网链接（用户明确要求），事实卡不放官网入口
        # entry_url 缺失 / 为 "#"（如纯海报类条目）时不渲染「前往平台入口」按钮，避免死链
        .replace("{ENTRY_BTN}", (f'<a class="btn" href="{entry}" target="_blank" rel="noopener">'
                                 f'前往平台入口 →</a>') if entry and entry != "#" else "")
        .replace("{ENTRY}", entry).replace("{CANON}", canon)
        .replace("{LD}", ld).replace("{BREAD}", breadcrumb_ld).replace("{OG}", og_detail)
        .replace("{DESC}", esc(desc)))
    os.makedirs(os.path.join(INTEL, s), exist_ok=True)
    with open(os.path.join(INTEL, s, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)
    detail_written += 1

with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

# ---------- robots.txt（复制已含全量放行的版本） ----------
with open(os.path.join(HERE, "robots.txt"), encoding="utf-8") as f:
    robotxt = f.read()
with open(os.path.join(DIST, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robotxt)

# ---------- sitemap.xml ----------
urls = [f"{SITE}/", f"{SITE}/table/", f"{SITE}/about/", f"{SITE}/sponsor/", f"{SITE}/data.json", f"{SITE}/llms.txt", f"{SITE}/llms-full.txt"]
urls += [f"{SITE}/intel/{slug(i, it.get('name',''))}/" for i, it in enumerate(items) if not it.get("ad_only")]
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for u in urls:
    sitemap += f'  <url><loc>{esc(u)}</loc><lastmod>{anchored}</lastmod></url>\n'
sitemap += '</urlset>\n'
with open(os.path.join(DIST, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap)

# ---------- llms.txt / llms-full.txt ----------
llms = f"# Token 情报局\n\n> 面向中文用户的免费 AI Token、模型额度与开发工具情报目录。本站只整理、核验并链接到平台入口，不代跑、不镜像。\n\n## 核心页面\n\n- [首页]({SITE}/): 最新免费额度、工具与观望名单。\n- [完整情报表]({SITE}/table/): 逐条列出免费类型、额度摘要、适用地区与截止时间。\n- [关于与核验方法论]({SITE}/about/): 运营主体、核验流程、收录标准与数据开放说明。\n- [合作赞助]({SITE}/sponsor/): 首页广告位刊例价（99 元/月）、投稿邮箱与合作流程。\n- [完整机器可读目录]({SITE}/llms-full.txt): 当前全部有效条目。\n- [开放数据]({SITE}/data.json): 全量结构化 JSON。\n\n## 使用边界\n\n- 额度、价格、模型和截止时间会变化，以平台最新页面为准。\n- 推广内容单独标注，不参与排序与收录判断。\n"
llms_full = f"# Token 情报局完整目录\n\n最后更新：{anchored}\n\n## 当前有效情报（{len(editorial)} 条）\n\n"
for it in editorial:
    u = f"{SITE}{name2href.get(it.get('name'), '/')}"
    qt = (it.get('quota', '') or '').replace("\n", " ")
    llms_full += f"- [{it.get('name','')}]({u}): {qt}\n"
# 已下架名单：让 AI 引擎能直接回答「XX 还能免费领吗」，避免引用过期情报
if retired:
    llms_full += (f"\n## 已下架（{len(retired)} 条）\n\n"
                  "下列平台此前被本站收录，现已下架。如需使用请以平台官方页面为准；"
                  "本站不再推荐，也不保证其免费额度仍然有效。\n\n")
    for r in retired:
        rn = re.sub(r"\s+", " ", str(r.get("reason") or "")).strip()
        llms_full += f"- [{r.get('name','')}]({r.get('url','')}): {rn}\n"
with open(os.path.join(DIST, "llms.txt"), "w", encoding="utf-8") as f:
    f.write(llms)
with open(os.path.join(DIST, "llms-full.txt"), "w", encoding="utf-8") as f:
    f.write(llms_full)

# ---------- 公开 data.json（仅开放编辑收录的情报；赞助条目不进入数据集）----------
pub = dict(d)
# 开放数据集只保留编辑字段，剔除专属邀请等推广字段
PROMO_FIELDS = ("invite_text", "invite_url", "invite_code")
pub["items"] = [{k: v for k, v in it.items() if k not in PROMO_FIELDS} for it in editorial]
with open(os.path.join(DIST, "data.json"), "w", encoding="utf-8") as f:
    json.dump(pub, f, ensure_ascii=False, indent=2)

# ---------- IndexNow 密钥文件（即时重索引，新鲜度信号） ----------
INDEXNOW_KEY = "f0a9c2e7b4d18a3f5c6e9b0d2a1f4c7e"
with open(os.path.join(DIST, INDEXNOW_KEY + ".txt"), "w", encoding="utf-8") as f:
    f.write(INDEXNOW_KEY)

# ---------- 部署版本文件（供 CI 判断线上是否已发布当前提交） ----------
# Cloudflare Pages 构建时注入 CF_PAGES_COMMIT_SHA；GitHub Actions 注入 GITHUB_SHA；
# 本地构建兜底 local-build。.github/workflows/indexnow.yml 会轮询线上 /_version.txt
# 与本提交 SHA 比对，一致后才推送 IndexNow。
_deploy_sha = (os.environ.get("CF_PAGES_COMMIT_SHA")
               or os.environ.get("GITHUB_SHA")
               or "local-build")
with open(os.path.join(DIST, "_version.txt"), "w", encoding="utf-8") as f:
    f.write(_deploy_sha + "\n")

# ---------- 关于 / 核验方法论页（E-E-A-T 权威信号） ----------
about_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "关于 Token FBI（Token 情报局）",
    "url": f"{SITE}/about/",
    "description": "运营主体、情报核验方法论、更新频率、收录标准、赞助透明机制与开放数据授权说明。",
    "mainEntity": {"@type": "Organization", "name": "Token FBI（Token 情报局）",
                   "url": SITE, "sameAs": ["https://github.com/hope0719/token-fbi"]}
}, ensure_ascii=False)
og_about = og_block(
    "关于 Token FBI · 核验方法论与数据开放",
    "开源、免费的 AI token 情报站。说明运营主体、情报核验方法论、更新频率、收录标准、赞助透明机制与开放数据授权。",
    SITE + "/about/")
ABOUT = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>关于 Token FBI · 核验方法论与数据开放</title>
<meta name="description" content="Token FBI 是开源、免费的 AI token 情报站。本页说明运营主体、情报核验方法论、更新频率、收录标准、赞助透明机制与开放数据授权。">
<link rel="canonical" href="https://token-fbi.com/about/">
{OG}
<script type="application/ld+json">{LD}</script>
<style>
:root{--bg:#F5F1E8;--bg2:#fff;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--accent-soft:rgba(158,199,216,.22);--r:16px;--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.7;padding:40px 22px}
.wrap{max-width:840px;margin:0 auto}
a{color:var(--accent-deep);text-decoration:none;font-weight:700}
.back{display:inline-block;margin-bottom:22px;color:var(--text2);font-weight:600}
h1{font-size:30px;line-height:1.2;margin-bottom:8px}
.lead{color:var(--text2);font-size:16px;margin:12px 0 28px}
.kicker{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.05em;color:#fff;background:var(--accent-deep);padding:4px 11px;border-radius:8px;margin-bottom:14px}
.card{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;margin:16px 0;box-shadow:0 10px 30px rgba(34,52,58,.08)}
.card h2{font-size:19px;color:var(--accent-deep);margin-bottom:10px}
.card p,.card li{color:var(--text2);font-size:15px}
.card ul{margin:8px 0 0 20px}
.card li{margin:5px 0}
.tag{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:7px;background:var(--accent-soft);color:var(--accent-deep);margin:3px 4px 3px 0}
.cta{display:inline-flex;gap:10px;flex-wrap:wrap;margin:24px 0}
.btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:12px 22px;background:var(--accent);color:#0E2A33;text-decoration:none}
.disc{font-size:13px;color:var(--text2);border-top:1px solid var(--line);padding-top:16px;margin-top:24px}
</style>
</head>
<body><div class="wrap">
<a class="back" href="/">← 返回 Token FBI 全部情报</a>
<span class="kicker">关于本站</span>
<h1>关于 Token FBI（Token 情报局）</h1>
<p class="lead">一个开源、免费的 AI token 情报站。我们只做一件事：把当前<b>仍可领取</b>的免费大模型 API 与工具额度，整理清楚、标好门槛与有效期，并直达平台官方入口。</p>

<div class="card">
  <h2>我们是谁</h2>
  <p>Token FBI 是一个由个人与开源社区业余维护的情报项目，<b>零软文；广告位明码标价、单独标注，不参与任何核验与收录判断</b>。所有链接均直达平台官方页面，不经过任何第三方中转。我们相信「免费额度」这类信息应当被透明、可审计地汇总。</p>
</div>

<div class="card">
  <h2>我们怎么运作</h2>
  <p>本站内容由 <b>AI 与人工协作</b>完成，流程只有三步：</p>
  <ul>
    <li><b>搜集整理</b>：由 AI 与人工全网检索免费 AI 额度信息，汇总候选来源；</li>
    <li><b>人工核验</b>：以平台官网 / 开发者文档 / 官方公告为唯一事实来源，逐条核实有哪些免费模型、额度口径、门槛（绑卡 / 实名 / 邀请）与有效期限；</li>
    <li><b>决定上架</b>：由人工判断是否入库——只保留<b>当前真实可用</b>的免费入口或明确限时活动，核验通过才上架。</li>
  </ul>
  <p style="margin-top:10px">免费额度本身随时可能调整或取消，<b>以各平台官方页面为准</b>。我们只做事实核验与信息汇总，<b>不对平台评分、不做主观点评</b>。</p>
</div>

<div class="card">
  <h2>更新频率</h2>
  <p>数据每日自动化更新，并定期人工复核。限时活动类情报会在截止前单独提醒复核。</p>
</div>

<div class="card">
  <h2>收录标准</h2>
  <p>优先收录能<b>直接调用前沿模型</b>的平台；多模态或聚合价值高的作为保留。以下情况会被下架：</p>
  <ul>
    <li>只挂冷门自研 / 旧代际模型、缺乏实际可用的免费入口；</li>
    <li>免费档实质为「试用后强制付费」且门槛不透明；</li>
    <li>长期失活、链接失效且无法核实。</li>
  </ul>
</div>

<div class="card">
  <h2>赞助透明机制</h2>
  <p>本站首页开放广告位（刊例价与流程见 <a href="/sponsor/">合作赞助</a>），但严格遵守：<b>赞助内容会明确标注「赞助」标识</b>，绝不混入自然情报列表，也不参与排序与收录判断。赞助不影响我们对任何平台的核验结果。</p>
</div>

<div class="card">
  <h2>数据开放与引用</h2>
  <p>全量结构化数据以 <a href="/data.json">/data.json</a> 开放，机器可读目录见 <a href="/llms-full.txt">llms-full.txt</a>。欢迎开发者、研究者与 AI 引擎在注明来源的前提下引用、复用本站情报。</p>
</div>

<div class="card">
  <h2>参与与纠错</h2>
  <p>发现问题（链接失效、额度过期、信息有误）可在 <a href="https://github.com/hope0719/token-fbi/issues" target="_blank" rel="noopener">GitHub 仓库提交 Issue</a> 或提 PR 修正。社区反馈是我们保持数据新鲜度的主要来源。</p>
</div>

<div class="cta"><a class="btn" href="/">查看全部免费额度 →</a><a href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">GitHub 仓库</a></div>
<p class="disc">免责声明：本站仅作情报汇总，不替代各平台官方政策；所有免费额度、价格、模型与活动时间以平台最新页面为准。本站不对因使用第三方服务产生的任何结果负责。</p>
</div></body></html>'''
about_html = (ABOUT
    .replace("{OG}", og_about).replace("{LD}", about_ld)
    .replace("{ANCHOR}", anchored))
os.makedirs(os.path.join(DIST, "about"), exist_ok=True)
with open(os.path.join(DIST, "about", "index.html"), "w", encoding="utf-8") as f:
    f.write(about_html)

# ---------- 合作赞助 / 广告位刊例页（首页「合作赞助 →」的落地页） ----------
SPONSOR_PRICE = "99"
SPONSOR_MAIL = "1821522570@qq.com"
sponsor_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "合作赞助 · Token FBI 广告位刊例与流程",
    "url": f"{SITE}/sponsor/",
    "description": f"Token FBI 首页广告位合作赞助说明：刊例价 {SPONSOR_PRICE} 元/月、投稿邮箱 {SPONSOR_MAIL}、审核流程与不接受的内容范围。",
    "isPartOf": {"@id": f"{SITE}#website"},
    "mainEntity": {
        "@type": "Offer",
        "name": "首页广告位（赞助展示）",
        "price": SPONSOR_PRICE,
        "priceCurrency": "CNY",
        "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": SPONSOR_PRICE, "priceCurrency": "CNY",
            "referenceQuantity": {"@type": "QuantitativeValue", "value": 1, "unitCode": "MON"}},
        "availability": "https://schema.org/InStock",
        "seller": {"@type": "Organization", "name": "Token FBI（Token 情报局）", "url": SITE}
    }
}, ensure_ascii=False)
og_sponsor = og_block(
    "合作赞助 · Token FBI 广告位刊例与流程",
    f"首页广告位合作赞助说明：刊例价 {SPONSOR_PRICE} 元/月，先发邮件到 {SPONSOR_MAIL}，审核通过后再协商赞助事宜。",
    SITE + "/sponsor/")
SPONSOR = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>合作赞助 · 广告位刊例与流程｜Token FBI</title>
<meta name="description" content="Token FBI 首页广告位合作赞助说明：刊例价 99 元/月，先发送邮件说明，经审核后再协商赞助事宜。">
<link rel="canonical" href="https://token-fbi.com/sponsor/">
{OG}
<script type="application/ld+json">{LD}</script>
<style>
:root{--bg:#F5F1E8;--bg2:#fff;--bg3:#EFEAE0;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--accent-soft:rgba(158,199,216,.22);--r:16px;--shadow:0 10px 30px rgba(34,52,58,.08);--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.7}
a{color:var(--accent-deep);text-decoration:none;font-weight:700}
.wrap{max-width:900px;margin:0 auto;padding:0 22px}
.nav{position:sticky;top:0;z-index:20;background:rgba(245,241,232,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0}
.brand{display:flex;align-items:center;gap:9px;font-weight:850;font-size:17px;white-space:nowrap;flex-shrink:0}
.dot{width:12px;height:12px;border-radius:50%;background:var(--accent);display:inline-block;flex-shrink:0}
.nav-links{display:flex;gap:20px;font-size:14px;font-weight:700;white-space:nowrap}
.nav-links a{color:var(--text2);white-space:nowrap}
.nav-links a:hover{color:var(--accent-deep)}
.nav-right{flex-shrink:0}
.nav-right .btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:9px 18px;background:var(--accent);color:#0E2A33;white-space:nowrap}
.hd{padding:44px 0 8px}
.kicker{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.05em;color:#fff;background:var(--accent-deep);padding:4px 11px;border-radius:8px;margin-bottom:14px}
h1{font-size:clamp(26px,4vw,36px);line-height:1.22;font-weight:850}
.lead{color:var(--text2);font-size:16px;margin:14px 0 0}
.card{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:22px;margin:16px 0;box-shadow:var(--shadow)}
.card h2{font-size:19px;color:var(--accent-deep);margin-bottom:12px}
.card p,.card li{color:var(--text2);font-size:15px}
.card ul{margin:8px 0 0 20px}
.card li{margin:6px 0}
.price{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.price .num{font-size:44px;font-weight:850;color:var(--accent-deep);line-height:1}
.price .unit{font-size:15px;color:var(--text2);font-weight:700}
.price-note{font-size:13.5px;color:var(--text2);margin-top:10px}
.steps{counter-reset:s;list-style:none;margin:6px 0 0}
.steps li{counter-increment:s;position:relative;padding-left:40px;margin:14px 0}
.steps li::before{content:counter(s);position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:var(--accent-soft);border:1px solid var(--accent);color:var(--accent-deep);font-weight:850;font-size:13.5px;display:flex;align-items:center;justify-content:center}
.steps b{color:var(--text)}
.mail{display:inline-flex;align-items:center;gap:8px;font-weight:800;border-radius:99px;padding:12px 24px;background:var(--accent);color:#0E2A33}
.mail:hover{transform:translateY(-1px)}
.cta{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0 0}
.cta a{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:12px 22px;color:var(--text2);border:1px solid var(--line);background:var(--bg2)}
.cta a:hover{color:var(--accent-deep);border-color:var(--accent-deep)}
.disc{font-size:13px;color:var(--text2);border-top:1px solid var(--line);padding:18px 0 42px;margin-top:26px}
@media(max-width:820px){.nav-in{gap:14px}.nav-links{gap:14px}}
@media(max-width:700px){.nav-links{display:none}}
@media(max-width:600px){.nav-right .btn{padding:8px 14px}}
</style>
</head>
<body>
<nav class="nav"><div class="wrap nav-in">
  <div class="brand"><span class="dot"></span>Token FBI</div>
  <div class="nav-links"><a href="/">情报列表</a><a href="/table/">完整情报表</a><a href="/about/">关于</a></div>
  <div class="nav-right"><a class="btn" href="/">← 返回情报列表</a></div>
</div></nav>

<div class="wrap hd">
  <span class="kicker">合作赞助</span>
  <h1>广告位合作与赞助</h1>
  <p class="lead">本站首页开放广告位，用于产品与服务曝光。合作方式是<b>先发邮件说明 → 我们审核 → 审核通过后再协商赞助事宜</b>；未提前沟通的投放我们不会上线。</p>
</div>

<main><div class="wrap">

  <div class="card">
    <h2>刊例价格</h2>
    <div class="price"><span class="num">99</span><span class="unit">元 / 月</span></div>
    <p class="price-note">对应的就是首页当前展示的那种赞助位（一行三格，含右上角「赞助」标注）。按月计费，连续投放或多期打包可在协商时另议。</p>
  </div>

  <div class="card">
    <h2>合作流程（三步）</h2>
    <ol class="steps">
      <li><b>发邮件说明</b>：把你想要投放的内容发送到下方邮箱，邮件里写清产品、链接与期望档期。</li>
      <li><b>我们审核</b>：核对品类是否与 AI、开发者、工具、云服务相关，以及内容是否合规、链接是否直达官方页面。</li>
      <li><b>协商赞助事宜</b>：审核通过后，我们再确认档期、文案、素材、链接与结算方式，然后上线。</li>
    </ol>
  </div>

  <div class="card">
    <h2>邮件里请写明这些</h2>
    <ul>
      <li>产品 / 品牌名称与官网地址；</li>
      <li>计划投放的落地页链接（不接受短链跳转到非官方页面）；</li>
      <li>一句话卖点（建议不超过 40 字）与一张主视觉素材；</li>
      <li>期望投放档期与时长（按月计）；</li>
      <li>你的联系方式（微信号或手机号），便于审核通过后沟通。</li>
    </ul>
  </div>

  <div class="card">
    <h2>我们不接的内容</h2>
    <ul>
      <li>与 AI、开发者、工具、云服务无关的品类；</li>
      <li>博彩、金融荐股、擦边、灰产与违规代理类；</li>
      <li>要求伪装成自然收录，或要求不标注「赞助」标识的内容；</li>
      <li>要求改写核验结论、删除已收录平台差评或影响编辑判断的内容。</li>
    </ul>
  </div>

  <div class="card">
    <h2>透明说明</h2>
    <p>赞助内容一律带「<b>赞助</b>」标识，与编辑内容严格分离：不进「全部情报」列表、不进完整情报表、不进入开放数据集，也不参与任何核验与收录判断。本站对情报的事实核验结论不因赞助而改变。</p>
  </div>

  <div class="cta">
    <a class="mail" href="mailto:{SPONSOR_MAIL}?subject=合作赞助咨询">邮件联系 {SPONSOR_MAIL} →</a>
    <a href="/">返回情报列表</a>
    <a href="/about/">关于本站</a>
  </div>

  <p class="disc">说明：广告位刊例价与开放档期可能调整，以本页最新内容为准；本页不构成任何形式的投放承诺，具体以双方协商结果为准。</p>
</div></main>
</body></html>'''
sponsor_html = (SPONSOR
    .replace("{OG}", og_sponsor).replace("{LD}", sponsor_ld)
    .replace("{SPONSOR_MAIL}", SPONSOR_MAIL))
os.makedirs(os.path.join(DIST, "sponsor"), exist_ok=True)
with open(os.path.join(DIST, "sponsor", "index.html"), "w", encoding="utf-8") as f:
    f.write(sponsor_html)

# ---------- 完整情报表（独立页面，首页仅留入口） ----------
table_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Token FBI 完整情报表",
    "url": f"{SITE}/table/",
    "description": f"逐条列出当前收录的 {len(editorial)} 条免费 AI 额度情报：免费类型、额度摘要、适用地区与截止时间，附直达平台入口。",
    "isPartOf": {"@id": f"{SITE}#website"},
    "mainEntity": {"@type": "ItemList", "numberOfItems": len(editorial),
                   "itemListElement": itemlist},
    "dataset": {"@id": f"{SITE}#dataset"},
    "publisher": {"@id": f"{SITE}#org"}
}, ensure_ascii=False)
og_table = og_block(
    "完整情报表 · Token FBI 免费 AI 额度情报",
    f"当前收录的 {len(editorial)} 条免费 AI 额度情报一览：免费类型、额度摘要、适用地区与截止时间，附直达平台入口。",
    SITE + "/table/")
TABLE = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>完整情报表 · 免费 AI 额度一览｜Token FBI</title>
<meta name="description" content="当前收录的免费 AI 额度情报一览表：免费类型、额度摘要、适用地区与截止时间，附直达平台入口。">
<link rel="canonical" href="https://token-fbi.com/table/">
{OG}
<script type="application/ld+json">{LD}</script>
<style>
:root{--bg:#F5F1E8;--bg2:#fff;--bg3:#EFEAE0;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--accent-soft:rgba(158,199,216,.22);--r:16px;--shadow:0 10px 30px rgba(34,52,58,.08);--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.7}
.wrap{max-width:1180px;margin:0 auto;padding:0 22px}
a{color:var(--accent-deep);text-decoration:none;font-weight:700}
.nav{position:sticky;top:0;z-index:20;background:rgba(245,241,232,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0}
.brand{display:flex;align-items:center;gap:9px;font-weight:850;font-size:17px;white-space:nowrap;flex-shrink:0}
.dot{width:12px;height:12px;border-radius:50%;background:var(--accent);display:inline-block;flex-shrink:0}
.nav-links{display:flex;gap:20px;font-size:14px;font-weight:700;white-space:nowrap}
.nav-links a{color:var(--text2);white-space:nowrap}
.nav-links a:hover{color:var(--accent-deep)}
.nav-right{flex-shrink:0}
.nav-right .btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:9px 18px;background:var(--accent);color:#0E2A33;white-space:nowrap}
.hd{padding:44px 0 26px}
.kicker{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.05em;color:#fff;background:var(--accent-deep);padding:4px 11px;border-radius:8px;margin-bottom:14px}
h1{font-size:clamp(24px,3.6vw,34px);line-height:1.25;font-weight:850}
.lead{color:var(--text2);font-size:15.5px;margin:12px 0 0;max-width:820px}
.stats{display:flex;gap:26px;flex-wrap:wrap;margin-top:20px}
.stat{display:flex;flex-direction:column;gap:2px}
.stat .sv{font-size:26px;font-weight:850;color:var(--accent-deep);line-height:1}
.stat .sl{font-size:12.5px;color:var(--text2)}
main{padding:6px 0 50px}
.table-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r);background:var(--bg2);box-shadow:var(--shadow)}
.data-table{width:100%;border-collapse:collapse;font-size:13px;min-width:860px}
.data-table th{text-align:left;padding:13px 14px;color:var(--accent-deep);font-weight:700;border-bottom:2px solid var(--accent);white-space:nowrap;background:var(--bg3)}
.data-table td{padding:12px 14px;border-bottom:1px solid var(--line);color:var(--text2);vertical-align:top}
.data-table tr:last-child td{border-bottom:none}
.data-table .dn{font-weight:700}
.dt-name{color:var(--text);font-weight:700}
.dt-name:hover{color:var(--accent-deep)}
.data-table .dq{color:var(--text2);max-width:340px}
.dt-link{color:var(--accent-deep);font-weight:700;white-space:nowrap}
.foot{margin-top:34px;padding:26px 0 40px;border-top:1px solid var(--line);color:var(--text2);font-size:13.5px}
.cta{display:inline-flex;gap:10px;flex-wrap:wrap;margin:20px 0 0}
.btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:12px 22px;background:var(--accent);color:#0E2A33}
@media(max-width:820px){.nav-in{gap:14px}.nav-links{gap:14px}}
@media(max-width:700px){.nav-links{display:none}}
@media(max-width:600px){.nav-right .btn{padding:8px 14px}}
</style>
</head>
<body>
<nav class="nav"><div class="wrap nav-in">
  <div class="brand"><span class="dot"></span>Token FBI</div>
  <div class="nav-links"><a href="/">情报列表</a><a href="/table/">完整情报表</a><a href="/about/">关于</a></div>
  <div class="nav-right"><a class="btn" href="/">← 返回情报列表</a></div>
</div></nav>

<div class="wrap hd">
  <span class="kicker">全部资料</span>
  <h1>完整情报表</h1>
  <p class="lead">当前收录的免费 AI 额度情报一览：免费类型、额度摘要、适用地区与截止时间，并附直达平台官方入口。名称可点进对应情报详情页。</p>
  <div class="stats">
    <div class="stat"><span class="sv">{N_TOTAL}</span><span class="sl">情报总数</span></div>
    <div class="stat"><span class="sv">{N_MODEL}</span><span class="sl">大模型</span></div>
    <div class="stat"><span class="sv">{N_TOOL}</span><span class="sl">工具</span></div>
    <div class="stat" title="按「免费类型＝限时活动」统计，与上方分类维度交叉"><span class="sv">{N_EVENT}</span><span class="sl">限时活动</span></div>
  </div>
</div>

<main><div class="wrap">
  <div class="table-scroll">
    <table class="data-table">
      <thead><tr><th>名称</th><th>类型</th><th>免费类型</th><th>额度摘要</th><th>地区</th><th>截止时间</th><th>入口</th></tr></thead>
      <tbody>{DATA_TABLE}</tbody>
    </table>
  </div>
  <div class="foot">
    <p>本表与首页情报卡同步生成，为同一份数据的完整视图。免费额度本身有时效，平台可能随时调整或取消，<b>以各平台官方页面为准</b>。</p>
    <div class="cta"><a class="btn" href="/">← 返回 Token FBI 情报列表</a><a href="/data.json">下载 data.json</a></div>
  </div>
</div></main>
</body></html>'''
table_html = (TABLE
    .replace("{OG}", og_table).replace("{LD}", table_ld)
    .replace("{DATA_TABLE}", data_table_html)
    .replace("{N_TOTAL}", str(len(editorial)))
    .replace("{N_MODEL}", str(n_model))
    .replace("{N_TOOL}", str(n_tool))
    .replace("{N_EVENT}", str(n_event)))
os.makedirs(os.path.join(DIST, "table"), exist_ok=True)
with open(os.path.join(DIST, "table", "index.html"), "w", encoding="utf-8") as f:
    f.write(table_html)

# ---------- 404 兜底页 ----------
og_404 = og_block(
    "页面未找到 · Token FBI",
    "你访问的页面不存在或已被移动。回到 Token FBI 首页查看最新免费的 AI 大模型与工具额度情报。",
    f"{SITE}/404.html")
ld_404 = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "页面未找到 · Token FBI",
    "url": f"{SITE}/404.html",
    "inLanguage": "zh-CN",
    "isPartOf": {"@type": "WebSite", "name": "Token FBI", "url": SITE + "/"}
}, ensure_ascii=False)

NOTFOUND = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>页面未找到 · Token FBI</title>
<meta name="description" content="你访问的页面不存在或已被移动。回到 Token FBI 首页查看最新免费的 AI 大模型与工具额度情报。">
<meta name="robots" content="noindex, follow">
{OG404}
<script type="application/ld+json">{LD404}</script>
<style>
:root{--bg:#F5F1E8;--accent:#9EC7D8;--accent-deep:#2F6F82;--text:#1F2A2E;--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.wrap{max-width:460px}
.dot{width:14px;height:14px;border-radius:50%;background:var(--accent);display:inline-block;margin-bottom:18px}
h1{font-size:64px;color:var(--accent-deep);font-weight:850;line-height:1}
p{color:#4C5A5E;margin:14px 0 26px;font-size:16px}
.btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:13px 26px;background:var(--accent);color:#0E2A33;text-decoration:none}
</style>
</head>
<body><div class="wrap">
<span class="dot"></span>
<h1>404</h1>
<p>这个页面不存在或已被移动。回到首页查看最新免费 AI 额度情报。</p>
<a class="btn" href="/">← 返回 Token FBI 首页</a>
</div></body></html>'''
with open(os.path.join(DIST, "404.html"), "w", encoding="utf-8") as f:
    f.write(NOTFOUND.replace("{OG404}", og_404).replace("{LD404}", ld_404))

# ---------- 统一注入 favicon 声明（全部 HTML 一处收口，新增页面自动覆盖） ----------
_fav_patched = 0
if FAVICON_BLOCK:
    for _root, _dirs, _files in os.walk(DIST):
        for _fn in _files:
            if not _fn.endswith(".html"):
                continue
            _fp = os.path.join(_root, _fn)
            _txt = open(_fp, encoding="utf-8").read()
            if 'rel="icon"' in _txt:
                continue
            if '<link rel="canonical"' in _txt:
                _txt = _txt.replace('<link rel="canonical"',
                                    FAVICON_BLOCK + '\n<link rel="canonical"', 1)
            elif "</title>" in _txt:
                _txt = _txt.replace("</title>", "</title>\n" + FAVICON_BLOCK, 1)
            else:
                continue
            with open(_fp, "w", encoding="utf-8") as f:
                f.write(_txt)
            _fav_patched += 1

print(f"built: index + {detail_written} detail pages + table/sponsor/about/404 + robots/sitemap/llms/data.json/indexnow | items={len(items)} anchor={anchored} | favicon={_fav_patched} pages")
