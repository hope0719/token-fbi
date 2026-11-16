# Token FBI 项目长期记忆（2026-11-13 重写）

> 逐条改档流水账在 `.workbuddy/memory/YYYY-MM-DD.md`；本文件只留**生效规则**。

## 一、数据结构
- 唯一数据源 `data.json`（`build.py` → `dist/`）。容器：`items`（收录）/`watchlist`（观望，渲染官网+原因）/`retired`（下架）/`hidden`（**完全不渲染**）。后三者不计 `total`。
- 字段：name/vendor/category(model|tool|event)/free_type(长期免费|注册赠送|限时活动|每日赠送|免费层|付费中转)/quota/validity/region/gates/note/sponsored/entry_url/intel_url/modality/last_verified/update_source/detail_slug/added。
- `card_style:"red"` 整卡红渐变；`card_promo` 名称下蓝字卖点；`guide` 详情页图文教程 + 自动 📖 chip。
- 邀请码：`signup` 是死字段。用 `invite_text`+`invite_url`+`invite_code`，仅详情页「专属邀请」渲染。
- 推广链接：写 `promo_url`(+`promo_net`)，**不改 `entry_url`**；CTA 走 `/go/<中文slug>/`（302+meta refresh，rel=sponsored）；发布版经 `PROMO_FIELDS` 过滤；中文参数 percent-encode。
- watchlist+retired 详情页注入 `noindex, follow`，sitemap 只收在架（两处同步改）。观望区渲染「复核 YYYY-MM-DD」，来源 last_verified→added→reason 日期，缺失写「待复核」。
- hidden：整条迁入 + `hidden_at`+`hidden_reason`，`total`−1；`build.py` 有 `pub.pop("hidden")`。

## 二、硬规则
1. **`gates`/`note`/`card_promo` 只许人工写**，自动更新一律空；`build.py` 按 `auto_src`（update_source 以「自动更新」开头）拦截。现存人工内容：TRAE(2 蓝框)+Antigravity(1)、商汤+微信云开发(黄块)。
2. **`NEVER_RELIST`（items+watchlist 双守卫，命中中断构建）**：腾讯元器、DeepSeek 开放平台、百度搭子 DuMate、Today AI（todayai.cn）、库库 AI（kuku.baidu，2026-11-13 用户点名下架）、**月之暗面 / Moonshot / Kimi 全系（2026-11-16 用户点名「下掉以后都不允许上架」，含 kimi.com、moonshot.cn、Kimi Work、Kimi 开放平台）**。守卫匹配 name/vendor/entry_url/intel_url/promo_url，换名也拦得住；黑名单不匹配 `modality`/`quota`，故 Qoder、硅基流动、讯飞星辰这类「聚合了 Kimi 模型」的他家卡片不受影响。
3. **邀请码/返佣不是排除或下架理由**；有免费或近乎免费权益即可收；此类 quota 不以「无免费模型：」开头。
4. 限时活动必带 `validity` ISO 日期；限量但无官方截止日 → `free_type=免费层`，禁编造。
5. 不收：付费订阅附赠（Claude Max/Team、Codex 重置卡、会员制视频平台 0 积分）、必绑卡试用、身份/融资门槛、地方与运营商定向补贴、专用小模型 API、已关停（QClaw）。
6. 同构聚合器已足量（OpenRouter/BazaarLink/Kilo/OpenCode Zen/硅基流动）→ 新的先入 watchlist。
7. 同平台延续活动不单独成卡；同厂不同产品可各自成卡（Qoder CN≠ZCode，Ling Studio≠Ling-3.2-flash）。
8. 边界：积分制桌面 Agent 可收；运营商云看「是否面向全网个人」；主体未披露小站、去中心化 GPU 网关、海外小型推理站 → watchlist 或不收。
9. `无免费模型` 不得配 `长期免费`；`category=event` 渲染为「限时活动」，长期项目用 `tool`。
10. 不打分、不写 rating；页面不出现「最后核验/数据锚点/更新于」。

## 三、ID 与新增
- `detail_slug` = 4 位数字 + 4 位小写字母，**永久不复用**（四个容器都要有）。
- 流程：append 到 **items 末尾**（严禁插前）→ `scripts/assign_detail_ids.py`（写 added=当天）→ `build.py`。**脚本打印「分配 0 个」不可信，以 data.json 为准**。
- 排序 = items 自然顺序（editorial 仅去 sponsored）。改既有卡不产生星标、不用跑 assign。
- 星标：added 起 3 天（NEW_DAYS）内 ★，按北京时间 UTC+8 算；`scripts/check_star.py` 在 build 之后跑。`RECO_NAMES = ["WorkBuddy 国际版"]`。
- **写 data.json 必须 `indent=2`**。

## 四、每日自动化（任务 76b2fc99，09:00）
① 源 diff → ② 巡检 8 条 → ③ 新增扫描 → ④ 构建发布（顺序不可跳；在架卡错误比少一条情报更致命）。
- ① `watch_sources.py` 读 `sources.json`，快照在 `.workbuddy/state/sources/`，末行 `CHANGED:`；新源 `--only <id> --init`；退化=转 SPA，连续 3 天设 `enabled:false`。**每次运行覆盖快照，首跑必须 tee 落盘**。
- ② `audit_drift.py -n 8`（P0 已过期/P1 七天内/P2 正文含过期日/P3 超 14 天/P4 轮转）；`--mark` 记核验（`.workbuddy/state/verify_log.json`），核完立刻 mark；「无变化」不改 last_verified。
- ③ 源优先级：官方一手（changelog/pricing/blog）> 快讯（ailyre/freetokens/rss.bz）> 中文汇总（夜雨聆风、腾讯云社区清单、smzdm，滞后 1–2 周只作线索）。**新增型 + 变更型（延期/续期）都要搜**。
- ④ 无改动跳过发布，不产生空提交。

## 四·五、本地暂存制（2026-11-16 用户指令）
- **用户在会话中要求批量改稿期间，所有改动只落本地，不 commit、不 push**；只有用户明确说「提交」才统一提交上传。
- 交付方式：改完先本地 `build.py` 自检（可选），报告 diff 与影响面，等指令。
- 每日 09:00 自动化（任务 76b2fc99）仍按自身流程自行发布，不受此条约束；若用户要求自动化也暂停发布，需单独说明。
- 提交时机由用户控制，禁止「顺手先推一下」。

## 五、部署排错
- `build.py` → `git add data.json` → commit → push → `curl` 首页 200 且 `_version.txt` **前缀**匹配 SHA 前 7 位（文件内 40 位，用 `case "$V" in abc1234*)`）。未核对不许说「已上线」。
- 改数据后**手工同步** `last_updated` 与 `total`（build.py 只读）。
- 构建 Python 用 managed 3.13（系统 3.9 不支持 PEP 701）。
- push 被拒先 `git fetch`，用 `git diff --name-only <sha>^ <sha>` 判断远端动了什么（**别用 `git diff HEAD origin/main`，会把自身改动显示成远端删除**）；仅改 `ai-pick/data.json` → `git rebase origin/main`；被已跟踪 memory 挡住先 `git stash push -- <file>`。
- `legacy_detail_paths` → `_redirects` 301；**禁止把条目自身 `/intel/<slug>/` 写进 legacy**（死循环）。CF 缓存 s-maxage≈7 天，需 Dashboard Purge。
- `dist/_headers` 由 `build.py` 生成（**不要手改 dist**）：`/go/*` X-Robots-Tag、全站 HSTS + `Cache-Control: public,max-age=300,s-maxage=300,stale-while-revalidate=60`、`/_version.txt` 必须 `no-store`。Pages 的规则**按文件顺序叠加**，同一个头写两次会逗号拼接，`Cache-Control` 必须用 `! Cache-Control` 先摘除再重设，否则指令打架（RFC 9111 取第一个值）。Pages 的 HTML 即使带 `s-maxage` 仍 `cf-cache-status: DYNAMIC`，要边缘缓存须在 Dashboard 加 Cache Rule。
- 下架迁 retired：只留 name/url/reason/detail_slug/legacy_detail_paths，`total`−1；详情页 noindex + 「已下架 + 原因」。`reason` 是外对文案，禁内部术语。
- 观望区转正须**同批删 watchlist 同 slug**。
- **唯一工作目录** = 本仓库（见 `WORKDIR.md`）；归档克隆远端 `no-push://` 禁改；旧流水线 `token-fbi-data` 已冻结。
- `/traffic/` 只写 Cloudflare 第一方数字，拿不到改标签不编数。教程截图放 `assets/guide/<主题>/`，发布前裁掉账号名/券号/订单号。

## 六、抓取经验
- **SPA 抓不到**：codebuddy.cn/pricing、workbuddy.ai/pricing、qoder.com 主页、teleai.com.cn、OVH endpoints、maas.unisound.com 价格区 → 只能靠发布稿+三家媒体同口径或客户端截图。
- **可 curl**：`docs.qoder.cn`（llms.txt + .md 直出）、`developer.ant-ling.com` 定价页、`platform.stepfun.com/docs/zh/guides/pricing/details.md`、码道 `support.huaweicloud.com/wtsnew-codeartsagent/`（含活动下线公告）、`autoclaw.zhipuai.cn/blog/news/M11Wn/`（周更提前 2–3 天）、`trae.cn/pricing`、`openrouter.ai/api/v1/models`（数 `:free` 是唯一可靠口径）、`cognition.ai/blog`。
- **P2 误报三类**（占多数，勿盲改）：活动起算日、已写进卡面的下线日、模型版本串（`Mistral-Small-3.2-24B` 会被 parse_dates 当日期）。
- 聚合站虚增免费模型数（把路由/音乐模型算进去）→ 以官方 API/目录为准。

## 七、当前状态（2026-11-16 12:50）
- items 51 / total 51 / watchlist 63 / retired 23 / hidden 1，赞助 3（蓝博、豆包拉新、腾讯云服务器）。
- **月之暗面已整体下架**：`0139jupq`（Kimi 开放平台，原在架）与 `0112soyt`（Kimi Work，原观望）同批迁入 retired，`0061stqi` 旧重复条目删除并把 `/intel/0061stqi/` 写成 301 到 `0139jupq`；`build.py` 黑名单已加月之暗面关键词。
- **WorkBuddy 双卡限免 11-15 到期、未续期**：国内 `0001hgwg` → 注册赠送、validity 11-30（新户 2000 积分 + 免费档 500 积分/月，`card_promo`「日常任务推荐使用 DeepSeek-V4.1-Flash」）；国际版 `0036xxzt` → 限时活动、validity 11-30（Hy4-flash 11-16~11-30 每日免费、0.03×，`card_promo` 后半句为 Hy4-flash）。两卡 `note` 黄底句已于 11-16 删除。
- AutoClaw `0085puck` 已切 M11W3 当期（11/16–11/22 送 1 亿=1 万积分，validity 11-22），M11W4 未发布。
- 码道 `0038rlna` 在 retired；`sources.json` 的 `huawei-codearts-news` 仍指向它，属陈旧映射待清理。
- 近期到期：11-17 阶跃 StepAudio 3、11-19 Ling-3.2-flash、11-20 云知声 U Plan 活动期。
- 新增 `0014jyev` NVIDIA NIM 免费端点（观望区转正，43 个 Free Endpoint）。
- 11-17 阶跃 StepAudio 3（观望 `0005ebrx`）；11-19 Ling-3.2-flash `0134gfaz`。
- 待用户裁定：Gemini 4 Hydrogen 免费 API 是否复上架（`0069hiaq` 在 retired）；讯飞星辰 MaaS `0125rcqt` 转正；蓝博科技；Token Harbor/OrcaRouter/UnoRouter；TeleAgent 额度口径；云知声 U2-Decision 限时 ¥0。
- 已裁定保留：腾讯云服务器=广告位卡（三字段空是设计）、阿里云百炼 `0033dkpk` 标长期免费不改量包口径。
