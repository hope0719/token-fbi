# Token FBI 项目长期记忆（2026-10-13 精简重写）

## 数据与架构
- 唯一数据源 `data.json` 的 `items`（`build.py` 生成 `dist/`，Cloudflare Pages 自动构建）。
- 四个容器：`items`（收录）/ `watchlist`（观望，渲染官网+原因）/ `retired`（下架，渲染官网+原因）/ `hidden`（暂存，**完全不渲染**、不进 sitemap/情报表/公开 data.json）。后三者不计 `total`。
- 卡片字段：name/vendor/category(model|tool|event)/free_type(长期免费|注册赠送|限时活动|每日赠送|免费层|付费中转)/quota/validity/region(国内留空|国际)/gates/note/sponsored/entry_url/intel_url/signup/modality/last_verified/update_source/detail_slug/added。
- **邀请码渲染**：`signup` 字段是死字段（build.py 不渲染）；用户邀请码/邀请链接须用 `invite_text` + `invite_url` + `invite_code` 三字段，详情页渲染「专属邀请」区块，卡片/领取入口不出现邀请码（build.py ~L1017）。
- 分类 `catOf`：category=tool → 工具；modality 含 GLM5.2 → GLM5.2；其余 → 大模型。
- hidden 写入：整条迁入 `hidden`，保留全部字段 + `hidden_at` + `hidden_reason`，`total` 减 1；配套 `build.py` 的 `pub.pop("hidden")` 与 assign 脚本扫描含 hidden。

## 收录硬门槛（任一不满足即不收或先入 watchlist）
1. 可公开领取的真实免费额度；排除付费抵扣券、绑卡付费、纯赞助。
2. 限时活动（free_type=限时活动 或 category=event）**必须带 validity** ISO 截止日。**限量名额但官方无 ISO 截止日 → 用 `free_type=免费层`**，禁止编造日期。
3. 国内可直连优先；国际-only 标 `region=国际`。
4. 同构聚合器（OpenRouter 式）只留 1–2 个代表。
5. 禁止从竞品 GitHub `awesome-free-llm` 清单整批灌入，逐条人工核验。
6. 一律不收：付费订阅附赠（Claude Max/Team）、绑卡免费层（Cerebras）、海外小型工具 signup credit（Mio/Viktor/Valyu）、身份限定类（Copilot Pro 教师）、地方政府/运营商定向补贴券、专用小模型 API（HAL-X THX-01）、返佣公益中转站。

## 永久 ID 与新增流程（强制）
- 每条（items+watchlist+retired+hidden）必须有 `detail_slug`：4 位数字+4 位小写字母（如 `/intel/0001hgwg/`），永久不复用。
- 流程：append 到 items **末尾**（严禁插前）→ `python3 scripts/assign_detail_ids.py`（自动写 `added`=当天）→ `npm run check`（=build.py；缺 ID/格式错/重复即中断）。
- 排序列：`editorial = items 去掉 sponsored`，按 items 自然顺序渲染，无额外排序；新增只需 append。
- **更新既有卡不产生新增星标、不触发 assign 脚本**（星标只认条目 `added`）。

## 黑名单（用户指定，永不上架 items）
- 腾讯元器（yuanqi.tencent.com）、DeepSeek 开放平台（platform.deepseek.com）。

## 首页角标
- 站长推荐：`build.py` 的 `RECO_NAMES` 当前 = `["WorkBuddy 国际版"]`。
- 新增五角星：条目 `added` 起 3 天（`NEW_DAYS`）内首页卡片显示 ★；**一律按北京时间 UTC+8** 算 `data-exp`，禁用 `date.today()`/裸 `datetime.now()`；`scripts/check_star.py` 逐条校验到期时刻。

## 部署
- `python3 build.py` → `git add data.json`（+其他改动）→ commit → `git push -u origin main` → 等 CF 重建 → `curl` 首页 200 且 `/_version.txt` = 提交 SHA。
- 远端常领先本地：push 被拒先 `git fetch`；若仅非 data.json 变化 → `git rebase origin/main`（勿手工解 data.json 冲突）；被已跟踪的 memory 文件挡住先 `git stash push -- <file>`（rebase 后 pop）。
- 老详情链接：`legacy_detail_paths` 由构建写入 `dist/_redirects` 301 跳固定 ID。CF 边缘缓存不随文件删除失效（s-maxage≈7 天），需 Dashboard 手动 Purge。
- 构建 Python 需 managed 3.13（系统 3.9 不支持新 f-string PEP 701）。

## 关键历史约定（近期）
- 同厂不同产品可各自成卡（AutoClaw `0085puck` ≠ ZCode）；同一平台的免费活动一般不单独成卡（CodeBuddy 国内版不单独成卡，与站点 WorkBuddy 同属 codebuddy.cn）。
- ZCode（`0003dfyo`）2026-10-12 已移至 items 末位；库库 AI（`0075fcju`，百度）2026-10-12 曾下架入 hidden，**2026-10-13 用户指示恢复并移至 items 首位**（打破"严禁插前"默认，属手动恢复特例）；观望区近期新增：Heicode（`0089dcan`）、Tokenator API（`0090zloz`）、京东云 JoyCode（`0091fxiq`）、Gonka Broker（`0092onmi`）、Sarashina 软银（`0095mrua`）、极智智能体平台 中国电科（`0096vfgj`）、Free Claude Code FCC（`0097lyfk`）。
- items 10-14 新增：Loomy 科大讯飞（`0093mxzf`，每日赠送 5000 积分）、UOS AI deepin 免费 DeepSeek 账号（`0094zgpv`，免费层 50 次/月，领取截止 2026-12-31）。
- items 10-15 新增 7 条（append 末尾）：千问办公 QwenWork 阿里（`0098zpea`，注册赠送，免费版 ¥0 + 注册 2000 积分 + 每日 100 积分）、百度搭子 DuMate（`0099bcrh`，每日赠送 500 积分）、移动云 MoMA 中国移动（`0100xzno`，注册赠送 2500 万 Tokens·30 天·活动至 2026-12-31）、百川智能开放平台（`0101smoc`，注册赠送 1000 万 tokens 赠送金）、蚂蚁百灵 Ling Studio（`0102isrz`，每日赠送 50 万计算单元）、AtomGit AtomCode CodingPlan 开放原子/CSDN（`0103wunm`，免费层）、书生 Intern AI 上海 AI 实验室（`0104skjl`，免费层，9000 万输入/月 + Anthropic 兼容）；观望区 +3：快手万擎 StreamLake（`0105ggiq`）、华为云盘古 ModelArts MaaS（`0106unaw`）、Ollama Cloud（`0107hqzp`）。
- 线索源优先级（2026-10-15 起）：**夜雨聆风《AI 免费 Token 地图》`yeyulingfeng.com/a/1159580.html` 为首选单一线索源**（不定期更新、只收国内可直连且当日有效额度），信息密度高于 smzdm 清单；但仍需逐条对官方源二次核验，且表中夹带的黑名单/已停购项须剔除。**2026-10-16 增补并列源**：腾讯云开发者社区「赛博鸡蛋」免费 AI 模型清单（`cloud.tencent.com/developer/article/2762018`，约 21 条、持续核实），国内限免模型的首发信源之一（云知声 U2-Flash 即由其带出）。
- 收录口径补充：**积分制桌面 Agent 可以收录**（千问办公 / 百度搭子，与 库库 AI / Loomy / 华为云码道 同类，积分为平台计费单位、非代金券）；**运营商云额度按「是否面向全网个人开放」判断**（移动云 MoMA 支持互联网账号 → 收录；地方定向算力券 → 排除）。
- **永久排除项新增**：QClaw（腾讯电脑管家，每日 4000 万 Token）**已关停**，不再收录（`juejin.cn/post/7693805723601813514`）。
- 边界待用户裁定保留项：蓝博科技（lanbuff，付费中转+赞助）、腾讯云服务器（空 free_type+赞助）、Token Harbor/OrcaRouter/UnoRouter（已在 watchlist）。
- items 10-16 新增 3 条（append 末尾）：云知声 U2-Flash / Unisound MaaS（`0108rkie`，限时活动，validity=2026-10-31，输入输出缓存全 0 元不限量、不绑卡、OpenAI+Anthropic 双协议）、百度文心快码 Comate（`0109tdmg`，免费层，个人标准版 ¥0 + 补全永久免费 + 注册赠 ¥10）、AWS Kiro（`0110oxyf`，免费层/region=国际，每月 50 credits 含 Claude Sonnet 4.5，Builder ID 免信用卡）；观望区 +2：Vercel AI Gateway（`0111vlhe`）、Kimi Work 月之暗面（`0112soyt`）。
- **站内聚合器已足量**（OpenRouter / BazaarLink / Kilo Gateway / OpenCode Zen / 硅基流动），2026-10-16 起新出现的 OpenRouter 式聚合器（如 Vercel AI Gateway）一律先入 watchlist，不进 items。
- **同平台延续活动不单独成卡（补例）**：天翼云 Token Plan（新户 2,500 万 Tokens / 2 周）归入已收录的天翼云息壤卡；阿里云「7000 万 tokens 组合权益」归入百炼卡；OpenCode Go 三款限时免费模型归入 OpenCode Zen 卡。
- 2026-10-19：items +1 摩尔线程 AI Coding Plan（`0119yljj`，tool/免费层，Free Trial ¥0 每日限量 100 名·30 天·GLM-4.7）；watchlist +1 Together AI（`0120vdvm`）。新线索源：`aiaiai.help/free` 与 `/free` 雷达页（71 平台、每日 3 次扫描、带核验时间戳）。口径冲突处理：官网套餐页 vs 文档中心额度不一致时双向标注、不自行取舍。
- **教程与卡片强调（2026-10-19 新增 schema）**：条目可带 `guide`（{title,intro,facts[],steps[{t,d,url,url_text,code,imgs[{src,cap}]}],tips[],source}）→ 详情页渲染「图文教程」编号步骤；`card_style:"red"` → 卡片整块红色填充。带 guide 的卡片自动加「📖 领取教程」chip。教程截图放 `assets/guide/<主题>/`（构建复制到 `/img/guide/...`），发布前必须裁剪/打码账号名、任务列表、券号、订单号。首个用例：华为云码道 `0038rlna`。
- `/intel/<slug>/` 详情页与 `/_version.txt` 校验：`_version.txt` 写的是**完整 40 位 SHA**，比较时须前缀匹配（如 `case "$V" in ef90087*)`），不可与短 SHA 直接相等判断。
