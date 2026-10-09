# -*- coding: utf-8 -*-
"""Token FBI 独立新站构建器（浅海蓝 #9EC7D8 + 奶霜白 #F5F1E8）。

产物输出到 dist/：
  - index.html          首页（Hero / 赞助位 / 全部情报卡片 / 完整情报表 CTA / 下架名单 / FAQ / 页脚）
                        注：完整情报表不在首页渲染，仅保留 `.datacta` CTA 入口
  - table/index.html    完整情报表独立页（CollectionPage + ItemList JSON-LD，名称内链到详情页）
  - sponsor/index.html  合作赞助 / 广告位刊例页（WebPage + AggregateOffer JSON-LD；首页「合作赞助 →」的落地页）
                        档位与价格集中在文件顶部 AD_TIERS，改价只改一处，页面/JSON-LD/meta/llms.txt 全部同步
  - subscribe/index.html 订阅页（免费微信群 / 邮件 / 付费社群三个通道，用于把脉冲流量沉淀进私域）
  - traffic/index.html  流量透明页（数据源 traffic.json：第一方访问快照 + 统计口径 + 「第三方工具为何显示 0」的机制说明）
                        另见文件顶部 GA4_ID / CF_BEACON_TOKEN 两个统计开关（默认留空＝不注入任何脚本）
  - go/<slug>/index.html 推广外链中转页 + dist/_redirects（Cloudflare 原生 302）
                        条目带 promo_url 时全站 CTA 自动改走 /go/<slug>/；robots 允许抓取；中转页 noindex
  - intel/item-NNN/index.html 每卡详情页（带 Article + BreadcrumbList JSON-LD，GEO 高 ROI）
  - robots.txt          全量 AI 爬虫放行（含 Bytespider/Baiduspider）
  - sitemap.xml         首页 + 详情页 + 开放数据
  - llms.txt/llms-full.txt  AI 可读站点地图
  - data.json           公开结构化数据（Dataset 下载源）

本脚本不依赖网络、不推送任何仓库——产出自包含于 dist/，供后续"直接覆盖"旧站。
"""
import json, html, os, re, shutil
from datetime import date, datetime, time, timedelta, timezone
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "data.json")
DIST = os.path.join(HERE, "dist")
INTEL = os.path.join(DIST, "intel")
ASSETS = os.path.join(HERE, "assets")   # 本地图片素材（海报等）→ 原样复制到 dist/img/
IMG_OUT = os.path.join(DIST, "img")
SITE = "https://token-fbi.com"
# 付费社群入口（小报童「AI 笔记」，带作者 refer 参数）
PAID_GROUP_URL = "https://xiaobot.net/p/ainote01?refer=06461113-647f-4f7c-895b-24864027dadd"
# 联系方式（首页「联系方式」区块 / 「订阅」页 / 刊例页共用同一组，改这里即可全站同步）
WECHAT_ID = "lmfh2022"          # 免费微信群：加这个微信号，备注「情报」
CONTACT_MAIL = "1821522570@qq.com"
SPONSOR_MAIL = CONTACT_MAIL     # 合作赞助咨询邮箱

# ---------- 访问统计（默认关闭：两项都留空时，全站不注入任何统计脚本，站点维持隐私优先） ----------
# GA4_ID：Google Analytics 4 的衡量 ID（形如 G-XXXXXXXXXX）。
#   填上后重跑 build.py，全站页面自动挂 gtag。
#   挂 GA4 的**唯一目的**是可以在 similarweb.com「Claim Your Website → Connect Google Analytics」
#   里**公开接入**，让 SimilarWeb / AITDK 这类第三方工具显示你的真实访问数（带「已验证」徽章）。
GA4_ID = "G-D06YK62XCD"
# AdSense 发布商 ID；清空可停用广告脚本与 ads.txt 输出。
ADSENSE_ID = "ca-pub-8898409337979578"
ADSENSE_BLOCK = (
    f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_ID}" crossorigin="anonymous"></script>'
    if ADSENSE_ID else ""
)
# CF_BEACON_TOKEN：Cloudflare Web Analytics 的 beacon token（CF 后台 → Web Analytics 获取）。
#   无 Cookie、不写本地存储，中国大陆可正常统计 —— 作为**你自己的真实数字**（Media Kit / 招商用），
#   不用来喂第三方估算工具。
#
# ⚠️ 本站**不要填这个值**：站点托管在 Cloudflare Pages，且已在「项目 → Metrics → Web Analytics」
#    开启了**项目级**自动注入 —— CF 会在每次**部署时**自动往 </body> 前插入同一段 beacon 脚本
#    （形如 <!-- Cloudflare Pages Analytics --><script defer src='.../beacon.min.js' data-cf-beacon=...>）。
#    这里若再手填一次，beacon 会被加载两遍 → **访问数/浏览量重复计数**。
#    该开关仅保留给「非 CF Pages 托管」的场景。验收脚本会检查 beacon 是否恰好 1 份。
CF_BEACON_TOKEN = ""


def _analytics_block():
    """按配置生成统计脚本片段；两个开关都没开时返回空串（页面输出完全不变）。"""
    parts = []
    if GA4_ID:
        parts.append(
            '<!-- Google Analytics 4：仅用于基础访问统计，并公开接入 SimilarWeb 以验证流量 -->\n'
            f'<script async src="https://www.googletagmanager.com/gtag/js?id={GA4_ID}"></script>\n'
            "<script>window.dataLayer=window.dataLayer||[];"
            "function gtag(){dataLayer.push(arguments);}"
            "gtag('js',new Date());"
            f"gtag('config','{GA4_ID}');</script>"
        )
    if CF_BEACON_TOKEN:
        parts.append(
            '<!-- Cloudflare Web Analytics：无 Cookie 的访问统计 -->\n'
            '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" '
            f"data-cf-beacon='{{\"token\":\"{CF_BEACON_TOKEN}\"}}'></script>"
        )
    return "\n".join(parts)


ANALYTICS_BLOCK = _analytics_block()
# 判断「是否已经注入过」用的特征串
_ANALYTICS_MARK = "googletagmanager" if GA4_ID else ("cloudflareinsights" if CF_BEACON_TOKEN else "")

# ---------- 广告位档位与价格（集中配置：改价只改这里，页面 / JSON-LD / meta / llms 全部同步） ----------
# 折扣口径：季付≈月价×2.4（约 8 折）、年付≈月价×8（约 6.7 折）。
# 页面上的「省 X%」由 _save_pct() 现算，不手写，改价后自动跟着变。
AD_TIERS = [
    {"code": "A", "name": "首屏主位", "month": 499, "quarter": 1199, "year": 3999,
     "stock": "1 个 / 期",
     "desc": "广告位第一格，深青底反白设计、面积约为常规位 1.25 倍，进页第一眼即见，适合发布期与新品首发。"},
    {"code": "B", "name": "常规位", "month": 299, "quarter": 699, "year": 2399,
     "stock": "2 个 / 期",
     "desc": "广告位第二、三格，与主位同屏展示，单价最低，适合做长期品牌曝光与新客持续获取。"},
    {"code": "C", "name": "专题冠名", "month": 899, "quarter": 2199, "year": 7499,
     "stock": "按需定制",
     "desc": "为你的品类单独制作一页比价／选购专题（如算力租赁、API 中转、编程工具），首页与合作页各挂一处入口。"},
]
AD_PRICE_FROM = min(t["month"] for t in AD_TIERS)
AD_PRICE_TO = max(t["month"] for t in AD_TIERS)

def _yuan(n):
    """人民币千分位。"""
    return f"{int(n):,}"

def _save_pct(paid, full):
    """相对月付一次买满的省钱幅度（取整到 10%）。"""
    if full <= 0:
        return 0
    return max(0, int(round((1 - paid / full) * 100 / 10) * 10))
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
# 观望区：暂时从首页撤下、持续观察是否恢复免费额度的平台
watchlist = d.get("watchlist", [])
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

# 所有条目固定使用 8 位 ASCII 标识；新条目先分配 ID，禁止回退到列表序号。
all_detail_entries = items + watchlist + retired
DETAIL_BY_NAME = {it["name"]: it for it in all_detail_entries}
_detail_ids = [it.get("detail_slug", "") for it in all_detail_entries]
if any(not re.fullmatch(r"[0-9]{4}[a-z]{4}", value) for value in _detail_ids):
    raise ValueError("详情页 ID 必须为 4 位数字 + 4 位小写字母；请运行 python3 scripts/assign_detail_ids.py")
if len(_detail_ids) != len(set(_detail_ids)):
    raise ValueError("详情页 ID 重复")

def slug(i, name):
    return DETAIL_BY_NAME[name]["detail_slug"]

# ---------- 外链出口层 /go/<slug>/（推广/返佣链接的统一改造点） ----------
# 存在的意义：
#   ① 换链不动页面 —— 注册联盟拿到专属链接后，只改 data.json 的 promo_url，全站 CTA 自动切换；
#   ② 与内容页彻底分离 —— /go/ 允许抓取，使用 302 与 noindex 中转页避免进入索引；
#   ③ 归因与叠加参数只改一处 —— 后续要加 UTM / 渠道码，改这里即可。
# 条目只要带 promo_url，全站所有「点击领取 / 前往平台入口 / 广告 CTA」都会自动走中转。
GO_NAME = "go"
go_map = {}          # {go_slug: 目标真实链接}，用于生成中转页与 _redirects

def go_slug(name):
    """中转路径名：与详情页 slug 同源但不带序号，便于人工读写与手工投放。"""
    base = re.sub(r"[^\w\u4e00-\u9fa5]+", "-", str(name or "")).strip("-").lower()
    return base or "link"

def out_link(it):
    """统一外链出口，返回 (href, sponsored)。

    - 条目带 `promo_url`（联盟 / 邀请 / 返佣链接）→ 走站内中转 `/<GO_NAME>/<slug>/`，sponsored=True
    - 否则直连 `entry_url`，sponsored=False
    sponsored 只用于决定 rel 标注，不影响链接可点击性。
    """
    promo = (it.get("promo_url") or "").strip()
    if promo:
        gs = go_slug(it.get("name"))
        go_map[gs] = {"url": promo,
                      "name": str(it.get("name") or "").strip(),
                      "net": str(it.get("promo_net") or "").strip()}
        return f"/{GO_NAME}/{gs}/", True
    return ((it.get("entry_url") or "").strip() or "#"), False

# 内部详情页链接映射（用于首页/推荐/赞助位内部链接 + GEO 发现）
# 纯广告位（ad_only）不生成详情页，故不进入映射，避免内链 404
hrefs = {i: f"/intel/{slug(i, it.get('name',''))}/" for i, it in enumerate(items)}
name2href = {it.get("name"): hrefs[i] for i, it in enumerate(items) if not it.get("ad_only")}

# ---------- 「新增」五角星（卡片右上角，收录后保留 3 天）----------
# 口径：条目在 data.json 里带 `added`（首次收录日期，YYYY-MM-DD）且距今不足 NEW_DAYS 天时，
#       首页卡片右上角渲染一枚五角星；到期后星标消失。
#   · 星标由页面脚本按 `data-exp`（到期时间戳）自行摘除 —— 因为静态站只在 push 时重建，
#     若只靠构建期判断，超过 3 天后未重新部署的页面会把星标一直挂着。
#   · `added` 由 scripts/assign_detail_ids.py 在分配详情 ID 时自动写入，无需手工维护。
#   · 页面不显示任何日期，"3 天" 只是星标的存活窗口。
#   · 【必须按北京时间判定】构建机时区不可控（本机 CST / Cloudflare 构建机 UTC），
#     若用本地时间会出现两个偏差：① 到期时刻随构建机漂移 8 小时；
#     ② 北京时间 00:00–08:00 之间构建时 UTC 仍停在前一天，导致当天新条目不出星。
#     故统一显式锚定 UTC+8。
NEW_DAYS = 3
_TZ = timezone(timedelta(hours=8))
_BUILD_DATE = datetime.now(_TZ).date()


def added_on(it):
    """条目首次收录日期；字段缺失或格式非法一律返回 None（视为非新增）。"""
    raw = str(it.get("added") or "").strip()[:10]
    if not raw:
        return None
    try:
        return date.fromisoformat(raw)
    except ValueError:
        return None


def is_new(it):
    """是否处于「新增」窗口内：收录当天算第 1 天，共 NEW_DAYS 天。"""
    d0 = added_on(it)
    return bool(d0) and 0 <= (_BUILD_DATE - d0).days < NEW_DAYS


def new_star_expiry(it):
    """星标失效时刻（Unix 秒）：收录日 + NEW_DAYS 天的北京时间 00:00。

    显式带 tzinfo，保证与本机 / CI（UTC）构建结果完全一致，不随时区漂移。
    """
    d0 = added_on(it)
    if not d0:
        return 0
    end = datetime.combine(d0 + timedelta(days=NEW_DAYS), time.min, tzinfo=_TZ)
    return int(end.timestamp())


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
    entry_raw, entry_spon = out_link(it)
    entry = esc(entry_raw)
    entry_rel = "noopener nofollow sponsored" if entry_spon else "noopener"
    intel = esc(it.get("intel_url", "#"))
    catlabel = CAT_LABEL.get(cat, cat)
    freetag = FREE_LABEL.get(free, free)
    is_limited = (free == "限时活动") or (cat == "event")
    gate_chips = "".join(f'<span class="chip">{esc(g)}</span>' for g in gates)
    spon = '<span class="chip spon">赞助</span>' if (sponsor or sponsored) else ""
    reco = '<span class="chip reco">⭐ 站长推荐</span>' if recommended else ""
    # 备注：仅当该条目显式提供时渲染（默认全站无备注）
    note_block = f'<div class="c-note">{esc(it.get("note","")).strip()}</div>' if (it.get("note") or "").strip() else ""
    # 新增星标：收录 3 天内在卡片右上角固定显示（不占文档流，不遮挡标签与按钮）
    star = ""
    if is_new(it):
        star = (f'<span class="new-star" data-exp="{new_star_expiry(it)}" '
                f'title="新增" aria-label="新增">★</span>')
    return f'''
    <article class="card{' reco-card' if recommended else ''}{' sponsor-card' if sponsor else ''}{' has-new' if star else ''}" data-cat="{cat}" data-limited="{"1" if is_limited else "0"}">
      {star}
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
        <a class="btn sm primary" href="{entry}" target="_blank" rel="{entry_rel}">点击领取 →</a>
      </div>
    </article>'''

# ---------- 赞助位 = 广告位（独立排版，不复用情报卡字段）----------
def render_ad(it):
    """广告卡：品牌 + 卖点钩子 + 说明 + 行动按钮。不走情报卡的分类/标签/门槛结构。"""
    brand = esc(it.get("ad_brand") or it.get("name", ""))
    hook = esc(it.get("ad_hook", ""))
    desc = esc(it.get("ad_desc", ""))
    cta = esc(it.get("ad_cta", "") or "了解更多")
    url, _ = out_link(it)
    url = url.strip()
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
RECO_NAMES = ["WorkBuddy 国际版"]
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

# ---------- 观望区 ----------
# 来自 data.json 的 watchlist 数组：暂时从首页撤下、持续观察是否恢复免费额度
watchlist_rows = []
for w in watchlist:
    wu = (w.get("url") or "").strip()
    watchlist_rows.append(
        f'<li><div class="r-top"><span class="r-name">{esc(w.get("name", ""))}</span>'
        f'<a class="r-url" href="{esc(wu)}" target="_blank" rel="noopener nofollow">'
        f'{esc(host_of(wu))} ↗</a></div>'
        f'<p class="r-why"><b>观望原因</b>{esc(w.get("reason", ""))}</p></li>')

watchlist_html = f'''
<section class="section" id="watchlist"><div class="wrap">
  <h2 class="sec-title">观望区</h2>
  <p class="sec-sub">以下 {len(watchlist)} 个平台暂从首页撤下，持续观察其免费额度是否恢复或政策是否明朗；保留官网入口。</p>
  <ul class="retired">
    {chr(10).join("    " + x for x in watchlist_rows)}
  </ul>
</div></section>''' if watchlist else ""

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
  <p class="sec-sub">以下 {len(retired)} 个平台已不再提供或已收紧免费额度，本站不再收录；每条附下架原因与官网入口。</p>
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
    entry_raw, entry_spon = out_link(it)
    entry = esc(entry_raw)
    entry_rel = "noopener nofollow sponsored" if entry_spon else "noopener"
    inner = name2href.get(it.get("name"), "")
    nm_html = (f'<a class="dt-name" href="{inner}">{nm}</a>' if inner and inner != "#" else nm)
    data_rows.append(
        f'<tr><td class="dn">{nm_html}</td><td>{catlabel}</td><td>{freetag}</td>'
        f'<td class="dq">{quota}</td><td>{region}</td><td>{valid}</td>'
        f'<td><a class="dt-link" href="{entry}" target="_blank" rel="{entry_rel}">点击领取 →</a></td></tr>')
data_table_html = "\n".join(data_rows)

# ---------- JSON-LD（首页） ----------
itemlist = [{"@type": "ListItem", "position": p + 1,
             "name": it.get("name"), "url": f"{SITE}{name2href.get(it.get('name'), '/')}"}
            for p, it in enumerate(editorial)]
# 作者实体（Person）：结构化数据中的署名信号，须与页面署名保持一致
AUTHOR_LD = {"@type": "Person", "name": "刘同学", "alternateName": "liu classmates",
             "url": f"{SITE}/about/", "sameAs": ["https://github.com/hope0719"]}

org_ld = {"@type": "Organization", "@id": f"{SITE}#org", "name": "Token FBI（Token 情报局）",
          "url": SITE, "description": "开源、免费的 AI token 情报站，汇总当前仍可领取的免费大模型 API 与工具额度。",
          "image": OG_IMAGE_DEFAULT,
          "founder": AUTHOR_LD,
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
<title>Token FBI · 免费 AI 额度情报站｜免费大模型 API 汇总</title>
<meta name="description" content="Token FBI（Token 情报局）是开源、免费的 AI 大模型与工具额度情报站，人工核验并汇总当前仍可领取的免费 API、限时活动与长期免费渠道。无需注册、无需绑卡，浏览器打开即用，并提供开放数据集与结构化情报表。">
<meta name="author" content="刘同学">
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
.sec-lead{color:var(--text2);font-size:14.5px;line-height:1.65;margin:-6px 0 18px;max-width:760px}
.faq{max-width:820px;margin:0 auto;display:grid;gap:12px}
.faq-item{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:16px 20px}
.faq-item h3{font-size:15.5px;font-weight:750;display:flex;gap:9px;align-items:baseline}
.faq-item h3 .q{color:var(--accent-deep);font-family:var(--mono);font-size:14px}
.faq-item p{margin-top:7px;color:var(--text2);font-size:14px}
.footer{background:var(--bg3);border-top:1px solid var(--line);padding:38px 0 30px;margin-top:30px}
.footer-in{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:26px}
.footer h2{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:12px}
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
/* 新增五角星：条目收录后 3 天内在卡片右上角显示，到期由页面脚本自动摘除 */
.new-star{position:absolute;top:0;right:0;z-index:3;display:flex;align-items:center;justify-content:center;width:38px;height:32px;font-size:16px;line-height:1;color:#fff;background:linear-gradient(135deg,#E6B04C,#C08A2E);border-radius:0 var(--r) 0 13px;box-shadow:0 4px 12px rgba(192,138,46,.28);pointer-events:none}
.card.has-new .c-top{padding-right:34px}
.datacta{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;box-shadow:var(--shadow)}
.subbar{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;background:linear-gradient(135deg,rgba(158,199,216,.30),rgba(158,199,216,.10));border:1px solid var(--accent);border-radius:var(--r);padding:20px 22px}
.subbar-main{display:flex;flex-direction:column;gap:3px}
.subbar-main strong{font-size:17px;font-weight:850}
.subbar-main span{font-size:14px;color:var(--text2)}
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
  <p class="sec-lead">以下 {N_TOTAL} 个渠道当前均可免费领取大模型或工具额度，无需付费、无需绑卡；限时活动已标注截止时间。</p>
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

<section class="section"><div class="wrap">
  <div class="subbar">
    <div class="subbar-main">
      <strong>新额度提醒</strong>
      <span>新上架情报、额度临时变更、限时活动截止 —— 第一时间发到微信群与邮箱。</span>
    </div>
    <a class="btn primary sm" href="/subscribe/">订阅提醒 →</a>
  </div>
</div></section>

{WATCHLIST}

{OFFICIAL}

<section class="section" id="faq"><div class="wrap">
  <h2 class="sec-title">常见问题</h2>
  <p class="sec-lead" style="text-align:center;max-width:820px;margin:0 auto 22px">Token FBI 完全免费、无需注册、不设广告追踪；收录只保留当前真实可用的免费额度。下面是关于收录、更新与使用的直接答案。</p>
  <div class="faq">
    <div class="faq-item"><h3><span class="q">Q1</span>Token FBI 要钱吗？需要注册吗？</h3><p>不要钱，也不需要注册。站点是无登录的纯静态站，不收集个人信息。所有领取操作都跳转到平台官方页面完成。</p></div>
    <div class="faq-item"><h3><span class="q">Q2</span>你们的收录标准是什么？</h3><p>优先收录能直接调用前沿模型的平台；多模态或聚合价值高的作为保留。只挂冷门自研/旧代际模型的平台会被下架。</p></div>
    <div class="faq-item"><h3><span class="q">Q3</span>信息更新频率怎么样？免费额度会一直有效吗？</h3><p>数据每日更新。免费额度本身有时效，平台可能随时调整或取消，请以各平台官方页面为准。</p></div>
    <div class="faq-item"><h3><span class="q">Q4</span>我领不到 / 链接失效 / 额度过期了怎么办？</h3><p>去 GitHub 仓库提 Issue 反馈，我们会复核并修正；或加微信群直接反馈。</p></div>
    <div class="faq-item"><h3><span class="q">Q5</span>能帮我接入 API、写代码吗？</h3><p>不会。这是情报站，不是代写代跑服务。我们只告诉你哪家免费、怎么领，不替你接入。</p></div>
  </div>
</div></section>

<section class="section" id="contact"><div class="wrap">
  <h2 class="sec-title">联系方式</h2>
  <p class="sec-lead" style="text-align:center;max-width:820px;margin:0 auto 22px">想加群交流、提交情报或系统学习，可以直接联系站长：微信 <b>{WECHAT_ID}</b>、邮箱 <b>{CONTACT_MAIL}</b>；付费社群 99 元/年。</p>
  <div class="contact-row">
    <div class="contact-card">
      <span class="ct-tag">免费微信群</span>
      <span class="ct-main">微信 <span class="ct-code">{WECHAT_ID}</span></span>
      <span class="ct-desc">添加我的微信，加入「Token 情报局」免费微信群。</span>
    </div>
    <div class="contact-card">
      <span class="ct-tag">提交情报</span>
      <span class="ct-main"><a href="mailto:{CONTACT_MAIL}">{CONTACT_MAIL}</a></span>
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
      <h2>资源</h2>
      <a href="/table/">完整情报表</a>
      <a href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">GitHub 仓库</a>
      <a href="/data.json" target="_blank" rel="noopener">开放数据 data.json</a>
      <a href="/llms.txt" target="_blank" rel="noopener">llms.txt</a>
      <a href="/robots.txt" target="_blank" rel="noopener">robots.txt</a>
      <h2 style="margin-top:20px">友情链接</h2>
      <a href="https://jikemax.com/" target="_blank" rel="noopener">极客 max</a>
      <a href="https://token-fbi.com/" target="_blank" rel="noopener">Token FBI</a>
    </div>
    <div>
      <h2>参与</h2>
      <a href="/subscribe/">订阅新额度提醒</a>
      <a href="/about/">关于本站</a>
      <a href="/privacy/">隐私政策</a>
      <a href="/terms/">服务条款</a>
      <a href="/sponsor/">合作赞助</a>
      <a href="/traffic/">流量数据公开说明</a>
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
    "Token FBI · 免费 AI 额度情报站｜免费大模型 API 汇总",
    "Token FBI（Token 情报局）是开源、免费的 AI 大模型与工具额度情报站，人工核验并汇总当前仍可领取的免费 API、限时活动与长期免费渠道。无需注册、无需绑卡，浏览器打开即用，并提供开放数据集与结构化情报表。",
    SITE + "/")

index_html = (TEMPLATE
       .replace("{JSONLD}", jsonld)
       .replace("{OG}", og_home)
       .replace("{CARDS}", "\n".join(cards_html))
       .replace("{SPONSOR}", sponsor_html)
       .replace("{WATCHLIST}", watchlist_html)
       .replace("{OFFICIAL}", retired_html)
       .replace("{DATA_TABLE}", data_table_html)
       .replace("{N_TOTAL}", str(len(editorial)))
       .replace("{N_MODEL}", str(n_model))
       .replace("{N_TOOL}", str(n_tool))
       .replace("{N_EVENT}", str(n_event))
       .replace("{PAID_GROUP_URL}", PAID_GROUP_URL)
       .replace("{WECHAT_ID}", WECHAT_ID)
       .replace("{CONTACT_MAIL}", CONTACT_MAIL)
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
{ACTIVITY_RULES}
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


def meta_desc_for(it):
    """详情页 meta description：组合「名称 + 免费口径 + 免费类型 + 用途指引」。

    对齐中文站的元描述长度口径：工具建议的 140-160 英文字符 ≈ 80-115 汉字
    （中文单字宽度约为英文的 2 倍），既填满搜索结果摘要位，又不会被截断。
    """
    name = (it.get("name") or "").strip()
    q = (it.get("quota") or "").replace("\n", " ").strip().rstrip("。；; ")
    free = FREE_LABEL.get(it.get("free_type", ""), it.get("free_type", "")) or "免费"
    region = (it.get("region") or "").strip() or "不限"
    head = f"{name} 免费额度与领取入口：{q}。" if q else f"{name} 免费额度与领取入口。"
    tail = (f"适用地区{region}，类型为{free}；附平台直达入口、使用限制与核验说明，"
            "信息按平台官方页面整理。")
    return clip_desc(head + tail, 120)


detail_written = 0
# 观望/下架条目也保留说明页，旧分享链接有明确归宿。
archive_details = [dict(it, entry_url=it.get("url", it.get("entry_url", "")),
                        free_type="观望" if it in watchlist else "已下架",
                        quota="该条目目前不在有效推荐列表，请以官网最新政策为准。",
                        validity="观望中" if it in watchlist else "已下架",
                        note=it.get("reason", ""), effect="", activity_rules=[],
                        invite_text="", invite_url="", poster_url="", promo_url="")
                   for it in watchlist + retired]
for i, it in enumerate(items + archive_details):
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
    entry, entry_spon = out_link(it)
    entry_rel = "noopener nofollow sponsored" if entry_spon else "noopener"
    canon = f"{SITE}/intel/{s}/"
    desc = meta_desc_for(it)
    og_img = og_image_for(i) if i < len(items) else OG_IMAGE_DEFAULT
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
        "author": AUTHOR_LD,
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
    rules = it.get("activity_rules") or []
    activity_rules_html = ("<section><h2>活动规则与领取方式</h2><ul>" +
                           "".join(f"<li>{esc(rule)}</li>" for rule in rules) +
                           "</ul></section>") if rules else ""
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
        .replace("{ACTIVITY_RULES}", activity_rules_html)
        .replace("{POSTER_SEC}", poster_sec_html)
        # 注意：详情页不展示官网链接（用户明确要求），事实卡不放官网入口
        # entry_url 缺失 / 为 "#"（如纯海报类条目）时不渲染「前往平台入口」按钮，避免死链
        .replace("{ENTRY_BTN}", (f'<a class="btn" href="{esc(entry)}" target="_blank" rel="{entry_rel}">'
                                 f'前往平台入口 →</a>') if entry and entry != "#" else "")
        .replace("{ENTRY}", esc(entry)).replace("{CANON}", canon)
        .replace("{LD}", ld).replace("{BREAD}", breadcrumb_ld).replace("{OG}", og_detail)
        .replace("{DESC}", esc(desc)))
    os.makedirs(os.path.join(INTEL, s), exist_ok=True)
    with open(os.path.join(INTEL, s, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)
    detail_written += 1

with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

# ---------- /go/<slug>/ 外链中转层 + Cloudflare _redirects ----------
# 目的：把「站内 CTA → 推广/返佣链接」抽成独立的一跳，换链无需改动任何内容页。
# 双保险实现：
#   ① _redirects  —— Cloudflare Pages 原生 302（真实 HTTP 跳转，最快、无闪白）
#   ② index.html  —— 本地预览 / 非 CF 环境的兜底（meta refresh + 手动链接）
# /go/ 允许抓取；原生 302 跳转，兜底页通过 meta 与 X-Robots-Tag 声明 noindex。
# 先清掉上一轮产物：某条 promo_url 被取消后，旧的跳转页与 _redirects 必须同步下线。
shutil.rmtree(os.path.join(DIST, GO_NAME), ignore_errors=True)
_redir_path = os.path.join(DIST, "_redirects")
if os.path.exists(_redir_path):
    os.remove(_redir_path)
if go_map:
    go_root = os.path.join(DIST, GO_NAME)
    os.makedirs(go_root, exist_ok=True)
    redirect_lines = [
        "# 推广 / 返佣外链中转层（由 build.py 自动生成，勿手工编辑）",
        "# data.json 里给条目加 promo_url 后，全站 CTA 自动改走 /go/<slug>/",
        "",
    ]
    for _gs in sorted(go_map):
        _info = go_map[_gs]
        _url = _info["url"]
        redirect_lines.append(f"/{GO_NAME}/{_gs}/ {_url} 302")
        _dir = os.path.join(go_root, _gs)
        os.makedirs(_dir, exist_ok=True)
        _net = f'<p class="net">合作渠道：{esc(_info["net"])}</p>' if _info["net"] else ""
        _page = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>正在前往 {esc(_info["name"])}｜Token FBI</title>
<meta http-equiv="refresh" content="0;url={esc(_url)}">
<style>
:root{{--bg:#F5F1E8;--bg2:#fff;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--r:16px;--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.7;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:22px}}
.box{{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:26px 24px;max-width:440px;width:100%;text-align:center;box-shadow:0 10px 30px rgba(34,52,58,.08)}}
h1{{font-size:18px;margin-bottom:10px}}
p{{color:var(--text2);font-size:14px;margin:6px 0}}
.net{{font-size:12.5px;color:var(--text2)}}
a{{display:inline-block;margin-top:16px;font-weight:800;color:#0E2A33;background:var(--accent);border-radius:99px;padding:10px 22px;text-decoration:none}}
.back{{display:block;margin-top:12px;font-size:13px;color:var(--text2);text-decoration:none}}
</style>
</head>
<body>
<div class="box">
  <h1>正在前往 {esc(_info["name"])}</h1>
  <p>本链接为站内推广跳转，内容与额度以平台官方页面为准。</p>
  {_net}
  <a href="{esc(_url)}" rel="noopener nofollow sponsored">没有自动跳转？点这里继续 →</a>
  <a class="back" href="/">← 返回 Token FBI 情报列表</a>
</div>
</body>
</html>'''
        with open(os.path.join(_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(_page)
    with open(os.path.join(DIST, "_redirects"), "w", encoding="utf-8") as f:
        f.write("\n".join(redirect_lines) + "\n")

# 历史详情地址一跳 301 到固定 ID（不按序号猜目标，也不跳首页）。
_detail_redirects = {}
for it in all_detail_entries:
    if it.get("ad_only"):
        continue
    target = f"/intel/{it['detail_slug']}/"
    for source in it.get("legacy_detail_paths", []):
        if not source.startswith("/intel/") or any(c in source for c in "?#\n\r"):
            raise ValueError(f"非法旧详情路径：{source}")
        source = quote(source, safe="/%")
        if source in _detail_redirects and _detail_redirects[source] != target:
            raise ValueError(f"旧路径映射冲突：{source}")
        _detail_redirects[source] = target
        # 兼容省略末尾斜杠的旧分享地址。
        _detail_redirects[source.rstrip("/")] = target
_existing_redirects = open(_redir_path, encoding="utf-8").read() if os.path.exists(_redir_path) else ""
with open(_redir_path, "w", encoding="utf-8") as f:
    f.write("# 历史详情地址到固定 ID\n")
    for source, target in sorted(_detail_redirects.items()):
        f.write(f"{source} {target} 301\n")
    f.write(_existing_redirects)

# ---------- robots.txt（复制已含全量放行的版本） ----------
with open(os.path.join(HERE, "robots.txt"), encoding="utf-8") as f:
    robotxt = f.read()
with open(os.path.join(DIST, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robotxt)

# /go/ 的静态兜底页允许爬虫访问，但不进入索引。
# Pages 的 _headers 不作用于 _redirects 生成的 302；302 由目标 URL 承接，
# HTML 兜底页另有 meta robots noindex，不把 /go/ 写入 sitemap。
with open(os.path.join(DIST, "_headers"), "w", encoding="utf-8") as f:
    f.write("/go/*\n  X-Robots-Tag: noindex\n")

# ---------- sitemap.xml ----------
urls = [f"{SITE}/", f"{SITE}/table/", f"{SITE}/about/", f"{SITE}/sponsor/", f"{SITE}/subscribe/", f"{SITE}/traffic/", f"{SITE}/privacy/", f"{SITE}/terms/", f"{SITE}/data.json", f"{SITE}/llms.txt", f"{SITE}/llms-full.txt"]
urls += [f"{SITE}/intel/{slug(i, it.get('name',''))}/" for i, it in enumerate(items) if not it.get("ad_only")]
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for u in urls:
    sitemap += f'  <url><loc>{esc(quote(u, safe=":/?#[]@!$&'()*+,;=%"))}</loc><lastmod>{anchored}</lastmod></url>\n'
sitemap += '</urlset>\n'
with open(os.path.join(DIST, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap)

# ---------- llms.txt / llms-full.txt ----------
llms = f"# Token 情报局\n\n> 面向中文用户的免费 AI Token、模型额度与开发工具情报目录。本站只整理、核验并链接到平台入口，不代跑、不镜像。\n\n## 核心页面\n\n- [首页]({SITE}/): 最新免费额度、工具与下架名单。\n- [完整情报表]({SITE}/table/): 逐条列出免费类型、额度摘要、适用地区与截止时间。\n- [关于与核验方法论]({SITE}/about/): 运营主体、核验流程、收录标准与数据开放说明。\n- [合作赞助]({SITE}/sponsor/): 首页广告位刊例价 ¥{AD_PRICE_FROM} / 月起（首屏主位 / 常规位 / 专题冠名三档，季付约 8 折、年付约 6.7 折）、投稿邮箱与合作流程。\n- [订阅新额度提醒]({SITE}/subscribe/): 免费微信群、邮件订阅与作者付费社群三种触达方式，用于接收新上架额度与活动变更提醒。\n- [流量透明]({SITE}/traffic/): 本站访问数据的统计方式、统计区间与当前数值，以及 AITDK / SimilarWeb 等第三方工具为何显示 0 的机制说明（面板样本偏差与 5,000 次展示门槛）。\n- [隐私政策]({SITE}/privacy/): 数据处理与免责说明（无登录、不收集个人信息，仅做匿名访问统计）。\n- [服务条款]({SITE}/terms/): 使用规则、知识产权、第三方链接、广告位标注、免责与责任限制。\n- [完整机器可读目录]({SITE}/llms-full.txt): 当前全部有效条目。\n- [开放数据]({SITE}/data.json): 全量结构化 JSON。\n\n## 使用边界\n\n- 额度、价格、模型和截止时间会变化，以平台最新页面为准。\n- 推广内容单独标注，不参与排序与收录判断。\n"
llms_full = f"# Token 情报局完整目录\n\n最后更新：{anchored}\n\n## 当前有效情报（{len(editorial)} 条）\n\n"
for it in editorial:
    u = f"{SITE}{name2href.get(it.get('name'), '/')}"
    qt = (it.get('quota', '') or '').replace("\n", " ")
    llms_full += f"- [{it.get('name','')}]({u}): {qt}\n"
    for rule in it.get("activity_rules") or []:
        llms_full += f"  - {rule}\n"
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
# 开放数据集只保留编辑字段，剔除专属邀请与推广/返佣字段（不属于公开情报口径）
PROMO_FIELDS = ("invite_text", "invite_url", "invite_code", "promo_url", "promo_net")
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
    "description": "Token FBI 的运营主体与作者、情报核验方法论、信息来源、更新频率、收录标准、赞助透明机制与开放数据授权说明，以及提交情报与纠错的方式。",
    "mainEntity": {"@type": "Organization", "name": "Token FBI（Token 情报局）",
                   "url": SITE, "sameAs": ["https://github.com/hope0719/token-fbi"]}
}, ensure_ascii=False)
og_about = og_block(
    "关于 Token FBI · 核验方法论、收录标准与数据开放",
    "Token FBI（Token 情报局）是开源、免费的 AI token 情报站。本页说明运营主体与作者、情报核验方法论、信息来源、更新频率、收录标准、赞助透明机制与开放数据授权，以及如何提交情报或纠错。",
    SITE + "/about/")
ABOUT = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>关于 Token FBI · 核验方法论、收录标准与数据开放</title>
<meta name="description" content="Token FBI（Token 情报局）是开源、免费的 AI token 情报站。本页说明运营主体与作者、情报核验方法论、信息来源、更新频率、收录标准、赞助透明机制与开放数据授权，以及如何提交情报或纠错。">
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
  <p style="margin-top:10px">本站由 <b>刘同学</b>（liu classmates）发起并维护，构建脚本与全量数据在 <a href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">GitHub 开源</a>，任何人可逐条复核。</p>
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
  <h2>信息来源与核验方法</h2>
  <p>本站所有额度口径均以<b>平台官方页面</b>为唯一事实来源，不采用二手转述、截图或自媒体说法。核验时主要查阅以下公开来源：</p>
  <ul>
    <li><b>官方定价与额度页</b>：如 <a href="https://platform.openai.com/docs/pricing" target="_blank" rel="noopener">OpenAI Pricing</a>、<a href="https://api-docs.deepseek.com/quick_start/pricing" target="_blank" rel="noopener">DeepSeek 开放平台价格文档</a>、<a href="https://help.aliyun.com/zh/model-studio/models" target="_blank" rel="noopener">阿里云百炼模型文档</a>；</li>
    <li><b>官方开发者文档</b>：各平台 API 文档中的免费额度（Free Tier / Quota）说明章节；</li>
    <li><b>官方活动公告</b>：限时活动的规则页与公告原文，用于核对起止时间与领取门槛。</li>
  </ul>
  <p style="margin-top:10px">引用第三方数据时我们会注明来源；开放数据中保留可复核的原始入口。任何与官方页面冲突的信息，<b>一律以官方为准</b>。</p>
</div>

<div class="card">
  <h2>更新频率</h2>
  <p>数据每日自动化更新，并定期人工复核。限时活动类情报会在截止前单独提醒复核。</p>
</div>

<div class="card">
  <h2>收录标准</h2>
  <p>收录的唯一硬标准是：平台必须提供<b>当前真实可用</b>的免费入口，且能直接调用主流模型；多模态或聚合价值高的平台作为保留项。以下情况会被下架：</p>
  <ul>
    <li>只挂冷门自研 / 旧代际模型、缺乏实际可用的免费入口；</li>
    <li>免费档实质为「试用后强制付费」且门槛不透明；</li>
    <li>长期失活、链接失效且无法核实。</li>
  </ul>
</div>

<div class="card">
  <h2>赞助透明机制</h2>
  <p><b>赞助不会影响我们对任何平台的核验结论，也不参与收录与排序判断。</b>本站首页开放广告位（刊例价与流程见 <a href="/sponsor/">合作赞助</a>），但严格遵守：赞助内容一律明确标注「赞助」标识，绝不混入自然情报列表。</p>
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
<p class="disc">免责声明：本站仅作情报汇总，不替代各平台官方政策；所有免费额度、价格、模型与活动时间以平台最新页面为准。本站不对因使用第三方服务产生的任何结果负责。关于本站如何处理数据与隐私，见 <a href="/privacy/">隐私政策</a>；使用本站的规则与免责范围见 <a href="/terms/">服务条款</a>。</p>
</div></body></html>'''
about_html = (ABOUT
    .replace("{OG}", og_about).replace("{LD}", about_ld)
    .replace("{ANCHOR}", anchored))
os.makedirs(os.path.join(DIST, "about"), exist_ok=True)
with open(os.path.join(DIST, "about", "index.html"), "w", encoding="utf-8") as f:
    f.write(about_html)

# ---------- 隐私政策页（信任信号：SEO/GEO 审计明确要求的合规入口） ----------
privacy_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "隐私政策 · Token FBI",
    "url": f"{SITE}/privacy/",
    "description": "Token FBI 隐私政策：本站为无登录、无账号的纯静态站，不收集个人信息。本页说明访问统计方式（含基于 Cloudflare 边缘日志的匿名统计与用于公开验证流量的 GA4）、Cookie 与跟踪、托管日志、外部链接与跳转层、广告位标注、邮件与微信的使用范围及联系方式。",
    "isPartOf": {"@id": f"{SITE}#website"},
    "publisher": {"@id": f"{SITE}#org"},
    "dateModified": anchored,
    "inLanguage": "zh-CN"
}, ensure_ascii=False)
og_privacy = og_block(
    "隐私政策 · Token FBI 数据处理、Cookie 与免责说明",
    "Token FBI 隐私政策：本站为无登录、无账号的纯静态站，不收集个人信息。本页说明访问统计方式（含基于 Cloudflare 边缘日志的匿名统计与用于公开验证流量的 GA4）、Cookie 与跟踪、托管日志、外部链接与跳转层、广告位标注、邮件与微信的使用范围及联系方式。",
    SITE + "/privacy/")
PRIVACY = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>隐私政策 · Token FBI 数据处理、Cookie 与免责说明</title>
<meta name="description" content="Token FBI 隐私政策：本站为无登录、无账号的纯静态站，不收集个人信息。本页说明访问统计方式（含基于 Cloudflare 边缘日志的匿名统计与用于公开验证流量的 GA4）、Cookie 与跟踪、托管日志、外部链接与跳转层、广告位标注、邮件与微信的使用范围及联系方式。">
<link rel="canonical" href="https://token-fbi.com/privacy/">
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
.disc{font-size:13px;color:var(--text2);border-top:1px solid var(--line);padding-top:16px;margin-top:24px}
</style>
</head>
<body><div class="wrap">
<a class="back" href="/">← 返回 Token FBI 全部情报</a>
<span class="kicker">隐私政策</span>
<h1>隐私政策与数据处理说明</h1>
<p class="lead">一句话结论：<b>本站不收集你的个人信息</b>。这是一个无登录、无账号、无表单的纯静态站，浏览它不需要提交任何数据。</p>

<div class="card">
  <h2>我们收集什么</h2>
  <p><b>不收集任何可识别到你个人的信息。</b>本站没有注册、登录、评论或表单提交功能，不要求你提供姓名、手机号、邮箱或任何身份信息，也不建立用户画像。全站页面均为预生成的静态 HTML，不存在数据库与用户账户体系。</p>
  <p style="margin-top:10px">本站还使用访问统计与 Google AdSense 广告服务（见下节）。第三方可能处理 Cookie、IP 地址及设备信息，本站不将这些信息与用户账户关联。</p>
</div>

<div class="card">
  <h2>Cookie 与跟踪</h2>
  <p>本站已接入 <b>Google AdSense</b> 广告代码，用于网站验证及审核通过后的广告展示。Google 及其合作伙伴可能设置和读取 Cookie、使用网络信标，并处理 IP 地址及设备信息，用于广告投放、衡量和防止无效流量。</p>
  <p style="margin-top:10px"><b>访问统计：</b>本站的访问数据来自托管商 <b>Cloudflare</b> 的统计服务（基于边缘节点的逐请求计数）。这类统计不设置 Cookie、不使用 localStorage、不做设备指纹，也不做跨站跟踪；只产出聚合的访问数、来源与地区，仅用于本站自身的流量判断，不用于广告。</p>
  <p style="margin-top:10px"><b>流量公开验证：</b>为便于合作方核实本站流量的真实性，本站另行启用 <b>Google Analytics 4</b>，并将其数据以<b>「公开验证」</b>的方式关联至第三方流量平台（SimilarWeb）—— 也就是说，任何人（包括广告主）都能在该平台看到本站的真实访问数，而不是只能看估算值。GA4 会在你的浏览器写入一枚用于区分会话的 Cookie（<b>_ga</b> 系列），<b>仅用于统计</b>，不用于广告投放或跨站追踪，本站也不会把它与任何身份信息关联。</p>
  <p style="margin-top:10px">你可以在浏览器中清除或拦截 Cookie，并通过 <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google 我的广告中心</a>管理个性化广告设置。第三方如何处理数据详见 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google 合作伙伴网站数据说明</a>。本站核心情报浏览功能不依赖登录或广告 Cookie。</p>
  <p style="margin-top:10px">本站托管于 Cloudflare Pages。作为 CDN 与安全防护的一部分，托管商可能按行业惯例处理基础访问日志（如 IP、User-Agent、请求时间），用于安全防护与流量统计。这部分由 Cloudflare 依其自身隐私政策处理，本站不单独留存，也不用于识别个人身份。</p>
</div>

<div class="card">
  <h2>外部链接</h2>
  <p>本站所有「点击领取 / 前往」按钮最终都指向<b>平台官方页面</b>；其中标注为推广合作的部分，会先经由站内的 <b>/go/ 跳转层</b>中转一次再到达官方页面，以便区分合作来源、并在链接失效时及时更换。</p>
  <p>该跳转层<b>不设置 Cookie、不注入任何脚本</b>，也不会记录你的个人身份信息。<b>点击后你即离开本站</b>，此后你的访问行为适用<b>该平台自己的隐私政策与用户协议</b>，本站无法控制、也不承担其数据处理责任。请在第三方平台提交任何信息前，自行阅读其条款。</p>
</div>

<div class="card">
  <h2>广告位与赞助</h2>
  <p>本站首页设有明码标价的广告位（刊例与流程见 <a href="/sponsor/">合作赞助</a>）。<b>所有赞助内容均单独标注</b>，不混入自然情报列表，也不参与收录与排序判断。直接赞助位仅做图文展示与跳转，不向赞助方提供个人数据。另行接入的 Google AdSense 自动广告由 Google 提供与管理，其数据处理方式见上述说明。</p>
</div>

<div class="card">
  <h2>邮件与微信</h2>
  <p>你可以自愿通过邮箱或微信联系我们提交情报、反馈错误。你主动提供的内容（邮箱地址、微信 ID、你发送的信息）<b>仅用于回复你本人与核实信息</b>，不用于营销推送，不出售、不转让给任何第三方。</p>
  <p style="margin-top:10px">加入免费微信群或付费社群时，你在群内的发言由你自行决定；社群平台（腾讯）依其自身政策处理相关数据。</p>
</div>

<div class="card">
  <h2>开放数据</h2>
  <p>本站情报以 <a href="/data.json">/data.json</a> 与 <a href="/llms-full.txt">llms-full.txt</a> 完全开放，内容均为公开的平台额度信息，<b>不含任何个人信息</b>。欢迎在注明来源的前提下引用与复用。</p>
</div>

<div class="card">
  <h2>未成年人</h2>
  <p>本站面向开发者与 AI 工具使用者，不针对未成年人设计，也不会有意收集未成年人的任何信息。</p>
</div>

<div class="card">
  <h2>政策更新与联系方式</h2>
  <p>本政策如发生实质性变更，会在本页更新。任何隐私相关疑问、数据删除请求或合作咨询，可邮件至 <a href="mailto:1821522570@qq.com">1821522570@qq.com</a>。</p>
</div>

<p class="disc">本政策适用于 token-fbi.com 及其所有子页面。本站为开源、业余维护的情报汇总项目，不替代任何平台官方的隐私政策与用户协议。使用本站的规则与免责范围见 <a href="/terms/">服务条款</a>。</p>
</div></body></html>'''
privacy_html = PRIVACY.replace("{OG}", og_privacy).replace("{LD}", privacy_ld)
os.makedirs(os.path.join(DIST, "privacy"), exist_ok=True)
with open(os.path.join(DIST, "privacy", "index.html"), "w", encoding="utf-8") as f:
    f.write(privacy_html)

# ---------- 服务条款页（信任信号：与隐私政策成对，SEO/GEO 审计要求的第二个合规入口） ----------
TERMS_DESC = ("Token FBI 服务条款：本站免费提供 AI 额度情报汇总，信息仅供参考，以各平台官方页面为准。"
              "本页说明服务内容、使用许可与知识产权、第三方链接、广告位、禁止行为、免责与责任限制及条款变更。")
terms_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "服务条款 · Token FBI",
    "url": f"{SITE}/terms/",
    "description": TERMS_DESC,
    "isPartOf": {"@id": f"{SITE}#website"},
    "publisher": {"@id": f"{SITE}#org"},
    "dateModified": anchored,
    "inLanguage": "zh-CN"
}, ensure_ascii=False)
og_terms = og_block(
    "服务条款 · Token FBI 使用规则、知识产权与免责范围",
    TERMS_DESC,
    SITE + "/terms/")
TERMS = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>服务条款 · Token FBI 使用规则、知识产权与免责范围</title>
<meta name="description" content="Token FBI 服务条款：本站免费提供 AI 额度情报汇总，信息仅供参考，以各平台官方页面为准。本页说明服务内容、使用许可与知识产权、第三方链接、广告位、禁止行为、免责与责任限制及条款变更。">
<link rel="canonical" href="https://token-fbi.com/terms/">
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
.disc{font-size:13px;color:var(--text2);border-top:1px solid var(--line);padding-top:16px;margin-top:24px}
</style>
</head>
<body><div class="wrap">
<a class="back" href="/">← 返回 Token FBI 全部情报</a>
<span class="kicker">服务条款</span>
<h1>服务条款与使用规则</h1>
<p class="lead">一句话结论：<b>本站免费提供 AI 额度情报汇总，信息仅供参考，最终以各平台官方页面为准</b>。继续访问或使用本站，即表示你已阅读并同意以下条款。</p>

<div class="card">
  <h2>一、服务内容</h2>
  <p>本站提供的是<b>公开 AI 额度情报的汇总与平台入口索引</b>：整理哪些平台当前可免费领取、额度口径与门槛，并链接到平台官方页面。本站<b>不提供</b> API 代理、代注册、代跑服务或任何平台账号，也不承诺任何额度的持续可用性。</p>
</div>

<div class="card">
  <h2>二、信息准确性与时效</h2>
  <p>本站已尽合理努力核验每条情报，但免费额度、价格、模型与活动时间均由平台方单方面决定，<b>可能随时调整或取消</b>。所有信息仅供参考，不构成任何形式的承诺或要约；<b>领取前请以平台官方页面为准</b>。</p>
</div>

<div class="card">
  <h2>三、使用许可与知识产权</h2>
  <p>本站自有的页面结构、文案与构建脚本以开源方式提供（见 <a href="https://github.com/hope0719/token-fbi" target="_blank" rel="noopener">GitHub 仓库</a>）。开放数据 <a href="/data.json">/data.json</a> 与 <a href="/llms-full.txt">llms-full.txt</a> 可在<b>注明来源（Token FBI，token-fbi.com）</b>的前提下自由引用、转载与复用。各平台的名称、商标与内容归其各自所有。</p>
</div>

<div class="card">
  <h2>四、第三方链接与平台服务</h2>
  <p>本站所有「点击领取 / 前往」入口均直达<b>第三方平台官方页面</b>。你与第三方平台之间的注册、付费与使用行为，适用该平台自身的服务条款与隐私政策，本站不参与其中，也不承担相应责任。</p>
</div>

<div class="card">
  <h2>五、广告位与赞助</h2>
  <p>本站首页广告位为明码标价的商业展示，<b>一律标注「赞助」标识</b>，不进编辑情报列表、不参与排序与收录判断。广告内容由赞助方自行负责，<b>不代表本站的推荐或背书</b>。详见 <a href="/sponsor/">合作赞助</a>。</p>
</div>

<div class="card">
  <h2>六、禁止行为</h2>
  <ul>
    <li>不得以本站名义从事收费代领、收费培训或任何形式的诈骗活动；</li>
    <li>不得批量抓取本站数据后冒充自有内容，且不注明来源；</li>
    <li>不得利用本站信息从事任何违法、侵权或损害第三方权益的行为。</li>
  </ul>
</div>

<div class="card">
  <h2>七、免责与责任限制</h2>
  <p>本站按「<b>现状</b>」提供，不对信息的完整性、准确性或适用性作出保证。在法律允许的最大范围内，本站不对因使用或无法使用本站信息而导致的任何直接或间接损失负责，包括但不限于因平台额度变更、服务中断或第三方行为造成的损失。</p>
</div>

<div class="card">
  <h2>八、条款变更与联系方式</h2>
  <p>本条款可能随站点调整而更新，更新后在本页生效，继续使用即视为接受。任何条款相关疑问，可邮件至 <a href="mailto:1821522570@qq.com">1821522570@qq.com</a>。</p>
</div>

<p class="disc">本条款适用于 token-fbi.com 及其所有子页面，与 <a href="/privacy/">隐私政策</a> 共同构成你与本站之间的完整约定。如有冲突，以本页最新内容为准。</p>
</div></body></html>'''
terms_html = TERMS.replace("{OG}", og_terms).replace("{LD}", terms_ld)
os.makedirs(os.path.join(DIST, "terms"), exist_ok=True)
with open(os.path.join(DIST, "terms", "index.html"), "w", encoding="utf-8") as f:
    f.write(terms_html)

# ---------- 合作赞助 / 广告位刊例页（首页「合作赞助 →」的落地页） ----------
# ---------- 广告位档位渲染（档位数据在文件顶部 AD_TIERS 配置） ----------
_ad_cards = []
for _t in AD_TIERS:
    _q = _save_pct(_t["quarter"], _t["month"] * 3)
    _y = _save_pct(_t["year"], _t["month"] * 12)
    _ad_cards.append(f'''    <div class="tier">
      <div class="t-head"><span class="t-code">{_t["code"]}</span><span class="t-name">{_t["name"]}</span><span class="t-stock">档期 {_t["stock"]}</span></div>
      <div class="t-price"><span class="num">{_yuan(_t["month"])}</span><span class="unit">元 / 月</span></div>
      <p class="t-desc">{esc(_t["desc"])}</p>
      <ul class="t-opt">
        <li><span>月付</span><b>¥{_yuan(_t["month"])}</b></li>
        <li><span>季付 · 省 {_q}%</span><b>¥{_yuan(_t["quarter"])}</b></li>
        <li><span>年付 · 省 {_y}%</span><b>¥{_yuan(_t["year"])}</b></li>
      </ul>
    </div>''')
AD_TIERS_HTML = "\n".join(_ad_cards)
AD_OFFERS_LD = [
    {"@type": "Offer", "name": f'{t["name"]}（{t["code"]} 档）', "price": str(t["month"]),
     "priceCurrency": "CNY",
     "priceSpecification": {"@type": "UnitPriceSpecification", "price": str(t["month"]),
                            "priceCurrency": "CNY",
                            "referenceQuantity": {"@type": "QuantitativeValue", "value": 1, "unitCode": "MON"}},
     "availability": "https://schema.org/InStock"}
    for t in AD_TIERS
]
SPONSOR_LD_DESC = (f"Token FBI 首页广告位合作赞助说明：刊例价 ¥{AD_PRICE_FROM}–{AD_PRICE_TO} / 月，"
                   f"分首屏主位、常规位、专题冠名三档，季付约 8 折、年付约 6.7 折。"
                   f"合作方式是先发邮件说明需求，经审核通过后再协商档期；广告位单独标注，不参与情报排序与收录判断。")
sponsor_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "合作赞助 · Token FBI 广告位刊例与投放流程",
    "url": f"{SITE}/sponsor/",
    "description": SPONSOR_LD_DESC,
    "isPartOf": {"@id": f"{SITE}#website"},
    "mainEntity": {
        "@type": "AggregateOffer",
        "name": "Token FBI 首页广告位",
        "priceCurrency": "CNY",
        "lowPrice": str(AD_PRICE_FROM),
        "highPrice": str(AD_PRICE_TO),
        "offerCount": len(AD_TIERS),
        "availability": "https://schema.org/InStock",
        "seller": {"@type": "Organization", "name": "Token FBI（Token 情报局）", "url": SITE},
        "offers": AD_OFFERS_LD
    }
}, ensure_ascii=False)
og_sponsor = og_block(
    "合作赞助 · Token FBI 首页广告位刊例与投放流程",
    SPONSOR_LD_DESC,
    SITE + "/sponsor/")
SPONSOR = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>合作赞助 · Token FBI 首页广告位刊例与投放流程</title>
<meta name="description" content="{SPONSOR_DESC}">
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
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
.tier{background:var(--bg3);border:1px solid var(--line);border-radius:14px;padding:16px}
.t-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.t-code{font-size:12px;font-weight:850;color:#fff;background:var(--accent-deep);width:20px;height:20px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.t-name{font-weight:850;font-size:15px;color:var(--text)}
.t-stock{margin-left:auto;font-size:11.5px;color:var(--accent-deep);background:var(--accent-soft);border-radius:99px;padding:2px 9px;white-space:nowrap}
.t-price{display:flex;align-items:baseline;gap:6px}
.t-price .num{font-size:32px;font-weight:850;color:var(--accent-deep);line-height:1}
.t-price .unit{font-size:13px;color:var(--text2);font-weight:700}
.t-desc{font-size:13px;color:var(--text2);margin:9px 0 0}
.t-opt{list-style:none;margin:12px 0 0;padding:0}
.t-opt li{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--text2);padding:6px 0;border-top:1px dashed var(--line)}
.t-opt li b{color:var(--text);font-weight:800;white-space:nowrap}
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}
.fact-i{background:var(--bg3);border:1px solid var(--line);border-radius:12px;padding:13px 14px}
.fact-i .fv{font-size:22px;font-weight:850;color:var(--accent-deep);line-height:1.1}
.fact-i .fl{font-size:12.5px;color:var(--text2);margin-top:4px}
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
@media(max-width:820px){.nav-in{gap:14px}.nav-links{gap:14px}.tiers{grid-template-columns:1fr}.facts{grid-template-columns:repeat(2,1fr)}}
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
    <h2>刊例与档期</h2>
    <p class="price-note">位置不同、价格不同；同一档位一次买满一期更便宜 —— 季付约 8 折、年付约 6.7 折，优惠已直接算进下表。</p>
    <div class="tiers">
{AD_TIERS}
    </div>
    <p class="price-note">价格为人民币含税刊例，含一次文案排版与上线；<b>不做文案代写、不承诺效果</b>。多档位打包或连续投放两期以上，可在协商时另议。</p>
  </div>

  <div class="card">
    <h2>这些位子被谁看到</h2>
    <p>本站只做一件事：把「现在还能领取的 AI 额度」整理成一张随时可查的表。来访者带着明确的领取意图，不是泛流量。</p>
    <div class="facts">
      <div class="fact-i"><div class="fv">{N_EDIT}</div><div class="fl">在架收录渠道</div></div>
      <div class="fact-i"><div class="fv">{N_PAGES}</div><div class="fl">静态页面</div></div>
      <div class="fact-i"><div class="fv">14+</div><div class="fl">放行的 AI 引擎爬虫</div></div>
      <div class="fact-i"><div class="fv">3</div><div class="fl">机器可读数据出口</div></div>
    </div>
    <ul>
      <li><b>受众</b>：AI 应用开发者、独立开发者与创业者、高校科研人员、正在做技术选型的企业工程师。</li>
      <li><b>流量属性</b>：为「领取免费额度」而来，注册与试用意向强，适合按新客转化衡量的产品。</li>
      <li><b>流量数据</b>：访问数与统计口径公开在 <a href="/traffic/">流量透明页</a>，并已接入 GA4 用于向第三方平台公开验证流量 —— 验证生效后可在 SimilarWeb 上直接核对，不必依赖其估算。</li>
      <li><b>GEO 结构</b>：全站结构化数据 + llms.txt / llms-full.txt + 开放 data.json，内容可被 AI 引擎直接引证。</li>
      <li><b>内容沉淀</b>：每条情报有独立详情页，长期可被搜索与 AI 答案引用，曝光不随档期结束而消失。</li>
    </ul>
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
      <li>期望档位（A 首屏主位 / B 常规位 / C 专题冠名）与投放时长（月 / 季 / 年）；</li>
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
    <a href="/traffic/">我们的流量数据 →</a>
    <a href="/subscribe/">订阅新额度提醒</a>
    <a href="/">返回情报列表</a>
    <a href="/about/">关于本站</a>
  </div>

  <p class="disc">说明：广告位刊例价与开放档期可能调整，以本页最新内容为准；本页不构成任何形式的投放承诺，具体以双方协商结果为准。</p>
</div></main>
</body></html>'''
sponsor_html = (SPONSOR
    .replace("{OG}", og_sponsor).replace("{LD}", sponsor_ld)
    .replace("{SPONSOR_DESC}", esc(SPONSOR_LD_DESC))
    .replace("{AD_TIERS}", AD_TIERS_HTML)
    .replace("{N_EDIT}", str(len(editorial)))
    .replace("{N_PAGES}", str(8 + len(name2href)))
    .replace("{SPONSOR_MAIL}", SPONSOR_MAIL))
os.makedirs(os.path.join(DIST, "sponsor"), exist_ok=True)
with open(os.path.join(DIST, "sponsor", "index.html"), "w", encoding="utf-8") as f:
    f.write(sponsor_html)

# ---------- 订阅页（把脉冲流量沉淀进私域：微信群 / 邮件 / 付费社群） ----------
# 为什么需要它：情报站天然是「脉冲流量」——一条情报被转发，48 小时内涌进来一批人，
# 之后归零。只有把这一批人接进可持续触达的通道（群 / 邮箱），流量才不是一次性的。
SUB_DESC = ("Token FBI 新额度提醒订阅：新上架情报、额度临时变更、限时活动截止第一时间推送。"
            "提供免费微信群、邮件订阅与作者付费社群三种方式，本站无账号体系、不收集个人信息，随时可退出。")
subscribe_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "订阅新额度提醒 · Token FBI",
    "url": f"{SITE}/subscribe/",
    "description": SUB_DESC,
    "isPartOf": {"@id": f"{SITE}#website"},
    "publisher": {"@id": f"{SITE}#org"}
}, ensure_ascii=False)
og_subscribe = og_block("订阅新额度提醒 · Token FBI", SUB_DESC, SITE + "/subscribe/")
SUBSCRIBE = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>订阅新额度提醒 · Token FBI</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="https://token-fbi.com/subscribe/">
{OG}
<script type="application/ld+json">{LD}</script>
<style>
:root{--bg:#F5F1E8;--bg2:#fff;--bg3:#EFEAE0;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--accent-soft:rgba(158,199,216,.22);--mono:"JetBrains Mono",ui-monospace,Menlo,monospace;--r:16px;--shadow:0 10px 30px rgba(34,52,58,.08);--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
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
.code{font-family:var(--mono);font-size:19px;font-weight:800;letter-spacing:.02em;background:var(--accent-soft);color:var(--accent-deep);padding:6px 14px;border-radius:9px;display:inline-block}
.code-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:12px 0 4px}
.copy-btn{font-family:var(--sans);font-size:13.5px;font-weight:800;border:1px solid var(--accent-deep);background:var(--bg2);color:var(--accent-deep);border-radius:99px;padding:8px 16px;cursor:pointer}
.copy-btn:hover{background:var(--accent-soft)}
.mail{display:inline-flex;align-items:center;gap:8px;font-weight:800;border-radius:99px;padding:12px 24px;background:var(--accent);color:#0E2A33;margin-top:10px}
.email{font-family:var(--mono);background:var(--accent-soft);color:var(--accent-deep);padding:2px 8px;border-radius:6px}
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
  <span class="kicker">订阅</span>
  <h1>新额度提醒</h1>
  <p class="lead">情报站的内容更新是脉冲式的：一条额度被转发，人会集中涌进来一批。想要不错过，就把它接进一个能持续触达你的通道。</p>
</div>

<main><div class="wrap">

  <div class="card">
    <h2>① 免费微信群（最快）</h2>
    <p>加站长微信，备注「情报」，我拉你进「Token 情报局」免费微信群。群里发得比站内快：额度临时变更、活动提前结束、刚上线的限时活动，都是先在群里说。</p>
    <div class="code-row">
      <span class="code" id="wx">{WECHAT_ID}</span>
      <button class="copy-btn" data-copy="{WECHAT_ID}" type="button">复制微信号</button>
    </div>
    <p style="font-size:13.5px">已在微信里？直接在「添加朋友」搜索这串字符即可。</p>
  </div>

  <div class="card">
    <h2>② 邮件订阅（不占手机）</h2>
    <p>不想加群可以走邮箱。点下面的按钮，会打开你的邮件客户端并自动填好标题，直接发送即可；我只用它发情报更新，不发广告、不外借、随时可退。</p>
    <a class="mail" href="mailto:{CONTACT_MAIL}?subject=%E8%AE%A2%E9%98%85%20Token%20FBI%20%E9%A2%9D%E5%BA%A6%E6%8F%90%E9%86%92&amp;body=%E6%88%91%E6%83%B3%E8%AE%A2%E9%98%85%E6%96%B0%E9%A2%9D%E5%BA%A6%E6%8F%90%E9%86%92%EF%BC%8C%E8%AF%B7%E6%8A%8A%E6%88%91%E5%8A%A0%E8%BF%9B%E5%88%97%E8%A1%A8%EF%BC%9A">邮件订阅 <span class="email">{CONTACT_MAIL}</span></a>
    <p style="font-size:13.5px;margin-top:10px">也可以把邮箱直接发给这个地址，标题写「订阅」两个字就行。</p>
  </div>

  <div class="card">
    <h2>③ 付费社群（进一步学习）</h2>
    <p>免费群只发情报。如果你想学的是「怎么把这些额度变成自己的产出」——工作流、Agent、变现路径，可以加入作者付费社群。</p>
    <p style="margin-top:8px"><b>99 元 / 年</b>，内容与免费群完全分开，不重复。</p>
    <a class="mail" href="{PAID_GROUP_URL}" target="_blank" rel="noopener">了解付费社群 →</a>
  </div>

  <div class="card">
    <h2>我会发什么，不会发什么</h2>
    <ul>
      <li><b>会发</b>：新上架的可白嫖额度、额度或价格临时变更、活动截止倒计时、下架提醒。</li>
      <li><b>会发</b>：发现某条情报写错了、链接失效了，在群里同步更正。</li>
      <li><b>不发</b>：与 AI 额度无关的广告、拉人头返利、需要你先付钱才能"领取"的东西。</li>
      <li><b>不发</b>：打扰式轰炸。只在真有情报时出现，一周没东西就一周不出现。</li>
    </ul>
    <p style="margin-top:10px;font-size:13.5px">关于数据处理方式，见 <a href="/privacy/">隐私政策</a>：本站不设账号体系、不收集个人信息，只做匿名访问统计。</p>
  </div>

  <div class="cta">
    <a href="/">← 返回 Token FBI 情报列表</a>
    <a href="/table/">查看完整情报表</a>
    <a href="/sponsor/">合作赞助</a>
  </div>

  <p class="disc">微信群与邮件的联系人是站长本人，不是客服机器人；消息不一定秒回，但一定有人看。</p>
</div></main>
<script>
document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click',function(){
    var t=b.getAttribute('data-copy'),old=b.textContent;
    var ok=function(){b.textContent='已复制 ✓';setTimeout(function(){b.textContent=old;},1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){});}
  });
});
</script>
</body></html>'''
subscribe_html = (SUBSCRIBE
    .replace("{OG}", og_subscribe).replace("{LD}", subscribe_ld)
    .replace("{DESC}", esc(SUB_DESC))
    .replace("{WECHAT_ID}", WECHAT_ID)
    .replace("{CONTACT_MAIL}", CONTACT_MAIL)
    .replace("{PAID_GROUP_URL}", PAID_GROUP_URL))
os.makedirs(os.path.join(DIST, "subscribe"), exist_ok=True)
with open(os.path.join(DIST, "subscribe", "index.html"), "w", encoding="utf-8") as f:
    f.write(subscribe_html)

# ---------- 流量透明页（/traffic/） ----------
# 为什么要有这一页：广告主查站会用 AITDK / SimilarWeb，而这类工具在流量低于
# 「5,000 次 / 设备 / 国家」时不展示任何数据，且面板样本偏欧美，中文站常被显示为 0。
# 与其被动挨一个「0」，不如主动把第一方数据和机制一起讲清楚 —— 这本身就是信任信号。
# 数据源：token-fbi-next/traffic.json（改完跑 build.py 即更新页面）。
TRAFFIC_DESC = ("Token FBI 流量透明说明：公开本站访问数据的统计方式、统计区间与当前数值，"
                "并解释为何 AITDK、SimilarWeb 等第三方工具会显示 0 —— 它们按「设备 × 国家」"
                "设有 5,000 次访问的展示门槛，且面板样本偏欧美，中文站点因此常被误判为没有流量。"
                "本页同时给出可自行核验的入口。")
with open(os.path.join(HERE, "traffic.json"), encoding="utf-8") as _f:
    _tj = json.load(_f)

_TMETRICS = "".join(
    f'<div class="mt"><div class="mt-v">{esc(m.get("value", ""))}</div>'
    f'<div class="mt-l">{esc(m.get("label", ""))}</div>'
    f'<div class="mt-h">{esc(m.get("hint", ""))}</div></div>'
    for m in _tj.get("metrics", []))
_TSOURCES = "".join(
    f'<li><b>{esc(s.get("name", ""))}</b>：{esc(s.get("desc", ""))}</li>'
    for s in _tj.get("sources", []))
_TLIVE = ""
if _tj.get("live_dashboard_url"):
    _TLIVE = (f'<li><b>{esc(_tj.get("live_dashboard_label") or "公开看板")}</b>：'
              f'<a href="{esc(_tj["live_dashboard_url"])}" target="_blank" rel="noopener nofollow">'
              f'查看实时公开数据 →</a>（第三方托管，链接可直接分享给合作方）</li>')
_TSW = esc(_tj.get("similarweb_url", ""))

traffic_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "流量透明 · Token FBI 访问数据与统计口径说明",
    "url": f"{SITE}/traffic/",
    "description": TRAFFIC_DESC,
    "isPartOf": {"@id": f"{SITE}#website"},
    "publisher": {"@id": f"{SITE}#org"},
    "inLanguage": "zh-CN"
}, ensure_ascii=False)
og_traffic = og_block("流量透明 · Token FBI 访问数据与统计口径说明", TRAFFIC_DESC, SITE + "/traffic/")

TRAFFIC = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>流量透明 · Token FBI 访问数据与统计口径说明</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="https://token-fbi.com/traffic/">
{OG}
<script type="application/ld+json">{LD}</script>
<style>
:root{--bg:#F5F1E8;--bg2:#fff;--bg3:#EFEAE0;--line:rgba(34,52,58,.14);--text:#1F2A2E;--text2:#4C5A5E;--accent:#9EC7D8;--accent-deep:#2F6F82;--accent-soft:rgba(158,199,216,.22);--mono:"JetBrains Mono",ui-monospace,Menlo,monospace;--r:16px;--shadow:0 10px 30px rgba(34,52,58,.08);--sans:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
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
.nav-right{flex-shrink:0}
.nav-right .btn{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:9px 18px;background:var(--accent);color:#0E2A33;white-space:nowrap}
.hd{padding:44px 0 8px}
.kicker{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.05em;color:#fff;background:var(--accent-deep);padding:4px 11px;border-radius:8px;margin-bottom:14px}
h1{font-size:clamp(26px,4vw,36px);line-height:1.22;font-weight:850}
.lead{color:var(--text2);font-size:16px;margin:14px 0 0}
.mt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:20px 0 0}
.mt{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:18px;box-shadow:var(--shadow)}
.mt-v{font-size:30px;font-weight:850;color:var(--accent-deep);line-height:1.1;font-variant-numeric:tabular-nums}
.mt-l{font-size:14px;font-weight:800;margin-top:8px}
.mt-h{font-size:12.5px;color:var(--text2);margin-top:3px}
.meta{font-size:13px;color:var(--text2);margin-top:10px}
.card{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:22px;margin:16px 0;box-shadow:var(--shadow)}
.card h2{font-size:19px;color:var(--accent-deep);margin-bottom:12px}
.card p,.card li{color:var(--text2);font-size:15px}
.card ul{margin:8px 0 0 20px}
.card li{margin:7px 0}
.warn{background:var(--accent-soft);border:1px solid rgba(47,111,130,.28);border-radius:12px;padding:16px 18px;margin:14px 0 0}
.warn p{color:var(--text);font-weight:700;font-size:15px}
.cta{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0 0}
.cta a{display:inline-flex;align-items:center;gap:7px;font-weight:800;border-radius:99px;padding:12px 22px;color:var(--text2);border:1px solid var(--line);background:var(--bg2)}
.cta a:hover{color:var(--accent-deep);border-color:var(--accent-deep)}
.disc{font-size:13px;color:var(--text2);border-top:1px solid var(--line);padding:18px 0 42px;margin-top:26px}
@media(max-width:820px){.nav-in{gap:14px}.nav-links{gap:14px}.mt-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.nav-links{display:none}}
@media(max-width:600px){.nav-right .btn{padding:8px 14px}}
@media(max-width:520px){.mt-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<nav class="nav"><div class="wrap nav-in">
  <div class="brand"><span class="dot"></span>Token FBI</div>
  <div class="nav-links"><a href="/">情报列表</a><a href="/table/">完整情报表</a><a href="/sponsor/">合作赞助</a><a href="/about/">关于</a></div>
  <div class="nav-right"><a class="btn" href="/">← 返回情报列表</a></div>
</div></nav>

<div class="wrap hd">
  <span class="kicker">流量透明</span>
  <h1>本站流量数据公开说明</h1>
  <p class="lead">这一页放两样东西：我们后台的真实访问数据，以及为什么第三方工具查这个站会显示 0。两件事要放在一起看，否则很容易误判。</p>
</div>

<main><div class="wrap">

  <div class="mt-grid">{TMETRICS}</div>
  <p class="meta">统计区间 {RANGE}（{PERIOD}）· 数据来源 {SOURCE} · 本页数字随部署刷新，非实时数据。</p>

  <div class="card">
    <h2>这些数字是怎么来的</h2>
    <ul>{TSOURCES}</ul>
    <p style="margin-top:12px">{COUNTING_NOTE}</p>
  </div>

  <div class="card">
    <h2>为什么第三方工具显示 0</h2>
    <p>如果你用 AITDK、SimilarWeb 这类工具查 token-fbi.com，看到「0」或「数据不足」，这<b>不代表没有流量</b>，而是这类工具的机制决定的：</p>
    <ul>
      <li><b>它们是估算工具，不是测量工具。</b>只有站长在页面里装了统计代码才拿得到准确数据，第三方只能靠「面板样本 + 算法外推」去猜。样本里没有你，你就等于 0。</li>
      <li><b>它们有一条公开的展示门槛。</b>SimilarWeb 官方说明写明：按「设备 × 国家」维度，<b>上月访问量需达到 5,000 次</b>才会展示任何数字，低于这条线一律显示「数据不足」。</li>
      <li><b>它们的样本严重偏欧美。</b>本站读者以中文用户为主，恰好落在这类工具的面板盲区 —— 所以即使真实流量已经越过门槛，估算值仍可能贴近 0。</li>
    </ul>
    <div class="warn"><p>所以「第三方显示 0」这件事，我们选择主动写出来，而不是等你去发现。</p></div>
  </div>

  <div class="card">
    <h2>你可以怎么自行核验</h2>
    <ul>
      <li><b>第三方平台比对</b>：<a href="{SIMILARWEB}" target="_blank" rel="noopener nofollow">在 SimilarWeb 查看 token-fbi.com →</a>。我们已接入 GA4 用于「公开验证」，验证生效后该页面显示的访问数将直接来自我们的 Google Analytics，而不是它的估算模型。</li>
      {TLIVE}
      <li><b>向我们要原始数据</b>：需要哪个统计区间、按什么维度拆（来源 / 地区 / 页面），发邮件到 <a href="mailto:{SPONSOR_MAIL}?subject=%E6%B5%81%E9%87%8F%E6%95%B0%E6%8D%AE%E8%AF%B7%E6%B1%82">{SPONSOR_MAIL}</a>，我导出后台原始记录给你。</li>
    </ul>
  </div>

  <div class="cta">
    <a href="/sponsor/">合作赞助与广告位 →</a>
    <a href="/table/">查看完整情报表</a>
    <a href="/privacy/">隐私政策 · 统计口径</a>
  </div>

  <p class="disc">本页数字为站长第一方统计，不等同于任何第三方估算平台的数值；两者口径不同，出现差异属正常现象。关于统计的完整说明见 <a href="/privacy/">隐私政策</a>。</p>
</div></main>
</body></html>'''
traffic_html = (TRAFFIC
    .replace("{OG}", og_traffic).replace("{LD}", traffic_ld)
    .replace("{DESC}", esc(TRAFFIC_DESC))
    .replace("{TMETRICS}", _TMETRICS)
    .replace("{TSOURCES}", _TSOURCES)
    .replace("{TLIVE}", _TLIVE)
    .replace("{SIMILARWEB}", _TSW)
    .replace("{RANGE}", esc(_tj.get("range_label", "")))
    .replace("{PERIOD}", esc(_tj.get("period_label", "")))
    .replace("{COUNTING_NOTE}", esc(_tj.get("counting_note", "")))
    .replace("{SOURCE}", esc(_tj.get("source", "")))
    .replace("{SPONSOR_MAIL}", SPONSOR_MAIL))
os.makedirs(os.path.join(DIST, "traffic"), exist_ok=True)
with open(os.path.join(DIST, "traffic", "index.html"), "w", encoding="utf-8") as f:
    f.write(traffic_html)

# ---------- 完整情报表（独立页面，首页仅留入口） ----------
table_ld = json.dumps({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Token FBI 完整情报表",
    "url": f"{SITE}/table/",
    "description": f"Token FBI 完整情报表：逐条列出当前收录的 {len(editorial)} 条免费 AI 额度情报，涵盖免费类型、额度摘要、适用地区与截止时间，每条附直达平台官方入口、可一键跳转领取，并支持导出开放数据集。",
    "isPartOf": {"@id": f"{SITE}#website"},
    "mainEntity": {"@type": "ItemList", "numberOfItems": len(editorial),
                   "itemListElement": itemlist},
    "dataset": {"@id": f"{SITE}#dataset"},
    "publisher": {"@id": f"{SITE}#org"}
}, ensure_ascii=False)
og_table = og_block(
    "完整情报表 · 全部免费 AI 额度一览｜Token FBI",
    f"Token FBI 完整情报表：逐条列出当前收录的 {len(editorial)} 条免费 AI 额度情报，涵盖免费类型、额度摘要、适用地区与截止时间，每条附直达平台官方入口、可一键跳转领取，并支持导出开放数据集。",
    SITE + "/table/")
TABLE = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>完整情报表 · 全部免费 AI 额度一览｜Token FBI</title>
<meta name="description" content="Token FBI 完整情报表：逐条列出当前收录的 {N_TOTAL} 条免费 AI 额度情报，涵盖免费类型、额度摘要、适用地区与截止时间，每条附直达平台官方入口、可一键跳转领取，并支持导出开放数据集。">
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

# ---------- 统一注入 favicon 声明与作者 meta（全部 HTML 一处收口，新增页面自动覆盖） ----------
_AUTHOR_META = f'<meta name="author" content="{esc(AUTHOR_LD["name"])}">'


def _inject_head(txt, block):
    """有 canonical 就插在它前面（head 顺序稳定），否则插在 </title> 之后。"""
    if '<link rel="canonical"' in txt:
        return txt.replace('<link rel="canonical"', block + '\n<link rel="canonical"', 1), True
    if "</title>" in txt:
        return txt.replace("</title>", "</title>\n" + block, 1), True
    return txt, False


# 「新增」星标的到点自摘：站点只在 push 时重建，过了 3 天的旧页面必须由浏览器自己摘掉星标
_NEW_STAR_MARK = "tf-new-star-sweep"
NEW_STAR_SWEEP = (
    f"<script>/*{_NEW_STAR_MARK}*/"
    "(function(){function s(){var n=Date.now()/1000,"
    "e=document.querySelectorAll('.new-star[data-exp]');"
    "for(var i=0;i<e.length;i++){var t=e[i];"
    "if(+t.getAttribute('data-exp')<=n){"
    "var c=t.closest('.card');if(c)c.classList.remove('has-new');t.remove();}}}"
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();</script>"
)



# 全站推广横条：统一生成，保持各页面内容与网址不变。
PROMO_BAR = '''<aside class="site-promo-bar" aria-label="推广入口">
<a href="https://www.16688.com.cn/shop/K4399" target="_blank" rel="sponsored nofollow noopener noreferrer">
<span class="site-promo-label">推广</span>
<span class="site-promo-title">Codex 充值快车道</span>
<span class="site-promo-price">月 Plus 仅需 138</span>
<span class="site-promo-arrow" aria-hidden="true">↗</span>
</a></aside>'''
PROMO_STYLE = '''<style id="site-promo-style">
.site-promo-bar{width:100%;background:#E3EEF2;border-bottom:1px solid #CBDDE4;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;text-align:center}
.site-promo-bar a{display:flex;align-items:center;justify-content:center;gap:14px;min-height:44px;padding:9px 20px;color:#244F5E;text-decoration:none;font-size:15px;line-height:1.5}
.site-promo-bar a:hover{background:#D8E9EF}
.site-promo-bar a:focus-visible{outline:2px solid #2F6F82;outline-offset:-3px}
.site-promo-label{font-size:11px;font-weight:400;line-height:1.5;border:1px solid #ACC5CE;border-radius:4px;padding:0 5px;color:#526F79;white-space:nowrap}
.site-promo-title{font-weight:700}.site-promo-price{font-weight:500}.site-promo-arrow{font-size:18px}
body.site-promo-padded{padding:0}
body.site-promo-padded>.wrap{padding:40px 22px;box-sizing:content-box}
body.site-promo-notfound{display:block;padding:0}
body.site-promo-notfound>.wrap{margin:auto;padding:80px 24px}
@media(max-width:540px){.site-promo-bar a{gap:8px;padding:9px 12px;font-size:13px;min-height:42px}.site-promo-label{font-size:10px}.site-promo-arrow{font-size:16px}}
@media(max-width:360px){.site-promo-bar a{gap:6px;font-size:12px}.site-promo-label{padding:0 3px}}
</style>'''


if ADSENSE_ID:
    with open(os.path.join(DIST, "ads.txt"), "w", encoding="utf-8") as f:
        f.write(f"google.com, {ADSENSE_ID.removeprefix('ca-')}, DIRECT, f08c47fec0942fa0\n")

_fav_patched = 0
_author_patched = 0
_stat_patched = 0
_new_patched = 0
for _root, _dirs, _files in os.walk(DIST):
    for _fn in _files:
        if not _fn.endswith(".html"):
            continue
        _fp = os.path.join(_root, _fn)
        _txt = open(_fp, encoding="utf-8").read()
        _changed = False
        # 外链跳转页无需推广横条，所有内容页面与 404 均覆盖。
        if '<body>' in _txt and '/go/' not in _fp.replace(os.sep, '/'):
            _body_class = ''
            if _fn == '404.html':
                _body_class = ' class="site-promo-notfound"'
            elif 'padding:40px 22px' in _txt:
                _body_class = ' class="site-promo-padded"'
            _txt = _txt.replace('</head>', PROMO_STYLE + '\n</head>', 1)
            _txt = _txt.replace('<body>', '<body' + _body_class + '>' + PROMO_BAR, 1)
            _changed = True
        # 广告仅接入内容页；404 与外链跳转页不请求广告。
        if ADSENSE_BLOCK and _fn != '404.html' and '/go/' not in _fp.replace(os.sep, '/') and 'pagead/js/adsbygoogle.js' not in _txt:
            _txt, _ok = _inject_head(_txt, ADSENSE_BLOCK)
            _changed = _changed or _ok
        if 'name="author"' not in _txt:
            _txt, _ok = _inject_head(_txt, _AUTHOR_META)
            if _ok:
                _author_patched += 1
                _changed = True
        if FAVICON_BLOCK and 'rel="icon"' not in _txt:
            _txt, _ok = _inject_head(_txt, FAVICON_BLOCK)
            if _ok:
                _fav_patched += 1
                _changed = True
        if ANALYTICS_BLOCK and _ANALYTICS_MARK not in _txt:
            _txt, _ok = _inject_head(_txt, ANALYTICS_BLOCK)
            if _ok:
                _stat_patched += 1
                _changed = True
        if NEW_STAR_SWEEP and "new-star" in _txt and _NEW_STAR_MARK not in _txt:
            _txt, _ok = _inject_head(_txt, NEW_STAR_SWEEP)
            if _ok:
                _new_patched += 1
                _changed = True
        if _changed:
            with open(_fp, "w", encoding="utf-8") as f:
                f.write(_txt)

print(f"built: index + {detail_written} detail pages + table/sponsor/about/privacy/terms/404 + robots/sitemap/llms/data.json/indexnow | items={len(items)} anchor={anchored} | favicon={_fav_patched} author={_author_patched} stats={_stat_patched} newstar={_new_patched} pages")
