# Token FBI 项目长期记忆（2026-10-13 精简重写）

## 数据与架构
- 唯一数据源 `data.json` 的 `items`（`build.py` 生成 `dist/`，Cloudflare Pages 自动构建）。
- 四个容器：`items`（收录）/ `watchlist`（观望，渲染官网+原因）/ `retired`（下架，渲染官网+原因）/ `hidden`（暂存，**完全不渲染**、不进 sitemap/情报表/公开 data.json）。后三者不计 `total`。
- 卡片字段：name/vendor/category(model|tool|event)/free_type(长期免费|注册赠送|限时活动|每日赠送|免费层|付费中转)/quota/validity/region(国内留空|国际)/gates/note/sponsored/entry_url/intel_url/signup/modality/last_verified/update_source/detail_slug/added。
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
- ZCode（`0003dfyo`）2026-10-12 已移至 items 末位；hidden 案例：库库 AI（`0075fcju`）；观望区近期新增：Heicode（`0089dcan`）、Tokenator API（`0090zloz`）。
- 边界待用户裁定保留项：蓝博科技（lanbuff，付费中转+赞助）、腾讯云服务器（空 free_type+赞助）、Token Harbor/OrcaRouter/UnoRouter（已在 watchlist）。
