---
name: spec-develop
description: |
  Spec 驱动的完整开发工作流，覆盖 Spec 编写、代码实现、Code Review、Git 提交和 Bugfix 全流程。识别用户意图后自动进入对应阶段，阶段间有人工审核暂停点确保质量。
  前提：仓库已完成 spec-bootstrap（有 specs/ 目录和 .agents.md）。
  触发词：做需求、新 feature、写 Spec、写代码、生成代码、按 Spec 开发、spec-develop、Bugfix、修 bug、生成测试、跑测试、Code Review、提交代码、开始实现、验证通过。
  工具要求：OpenClaw 或 Claude Code。

metadata:
  skillhub.creator: "wangjianlei02"
  skillhub.updater: "wangjianlei02"
  skillhub.version: "V12"
  skillhub.source: "FRIDAY Skillhub"
  skillhub.skill_id: "58250"
  skillhub.high_sensitive: "false"
---

# Spec 驱动开发 — 完整工作流

## 流程概览

```
[用户意图]
    │
    ├─ 写 Spec ──────────────→ 环境准备、读取项目约定
    │                          Feature Spec（用户故事 + AC + 非目标）
    │                          UI Spec（组件结构 + 交互状态）
    │                          API Spec（接口定义 + 数据流）
    │                          Test Fixtures（每条 AC 的测试数据）
    │                          ⏸️ Feature Spec 审核（HARD STOP）
    │
    ├─ 实现代码 ─────────────→ 按 Spec 生成实现代码
    │                          生成单元测试（每条 AC 至少 2 个用例）
    │                          Sensors 验证（tsc + eslint + jest，最多 3 轮自修复）
    │                          ⏸️ 代码确认
    │
    ├─ Review + 提交 ────────→ 逐条 AC 对照实现，输出 Review 报告
    │                          ⏸️ Review 确认（HARD STOP）
    │                          Git 提交 + 生成 MR/PR 描述模板
    │
    └─ Bugfix ───────────────→ 分级处理（见下方）
```

## 意图路由

| 用户意图关键词 | 进入阶段 |
|---|---|
| 做需求、新 feature、写 Spec、准备需求 | 写 Spec（环境准备 → Feature/UI/API Spec → Test Fixtures） |
| 按 Spec 生成代码、实现这个、生成代码、开始实现 | 生成实现代码 |
| 生成测试、跑测试、跑验证 | 生成单元测试 + Sensors 验证 |
| Review、检查代码、Code Review、提交代码 | Code Review + Git 提交 |
| Bugfix、修 bug、修复问题 | Bugfix 流程 |

多意图（如"帮我写 Spec 然后实现"）：按顺序逐阶段执行，每个暂停点照常生效，不合并。

---

## 关键原则

1. **Spec 是唯一真相**：实现代码严格基于 Spec，不添加 Spec 未声明的功能
2. **AC 必须可判定**：每条验收标准必须是非此即彼的布尔判断，禁止模糊表述
3. **非目标即禁区**：Feature Spec 中的「非目标」绝对不实现
4. **零 any**：不允许使用 `any` 类型，所有类型必须显式声明
5. **先确认再继续**：每个暂停点必须等待人工确认，不可跳过
6. **自修复有限度**：Sensors 失败最多自修复 3 轮，超出则停下报告

---

## AC 写作规范

AC（验收条件）面向人类阅读，直接描述触发条件、行为和预期结果，用自然语言分条陈述。
AI 生成测试用例时，应直接从 AC 自然语言中提取语义，无需 AC 配合机器格式。

### 规则

1. **🚫 禁止 BDD 格式** — 禁止 Given/When/Then/And，禁止符号箭头（`→`），用自然语言直接描述
2. **🚫 禁止伪代码风格** — AC 中禁止出现方法签名、返回值描述、参数列表、条件表达式（如 `isReady()=true 时返回 null`）。用自然语言描述触发条件和预期行为，关键标识仅用反引号点缀
3. **关键标识用反引号** — 方法名、变量名、事件名用 `` ` `` 包裹，给 AI 锚点
4. **单文件 AC 上限 15 条** — 超过应拆分 Spec
5. **AC 编号连续** — 每个 Spec 文件内从 AC1 开始

---

## 增量原则（新需求 Spec 管理）

**新需求必须新建 Spec 文件，禁止修改已有 Spec。**

| 规则 | 说明 |
|------|------|
| 新需求 = 新文件 | 命名 `feature-<需求简称>.md`，与已有 Spec 并行存在 |
| 已有 Spec 不可改 | 已有 Spec 代表“当前线上行为”，是已有测试的依据 |
| 新 Spec 引用已有 | 顶部用 `Related Spec` 标注关联的已有 Spec |
| 定期合并 | 需求上线稳定后，将新 Spec 的 AC 整合进主 Spec，删除独立文件 |
---

## 前置条件检查

进入任何流程前确认：

1. 根目录存在 `.agents.md` 或 `CLAUDE.md`
2. 存在 `specs/` 目录（含 `constraints/` 子目录）
3. 存在 `package.json`

缺失则提示用户先执行 `spec-bootstrap` 完成初始化。

---

## 仓库差异表

| 仓库 | 代码生成注意点 |
|------|---------------|
| Max | 使用 Max DSL（x-if/x-for/x-model），不生成 JSX 条件渲染 |
| MRN | 只用 RN 组件和 API，不用 DOM API |
| Web | 无特殊限制 |
| 小程序 | 注意 setData 性能；注意分包引用路径 |

---

## 写 Spec — 环境准备

读取仓库上下文：

1. 读取 `.agents.md` 或 `CLAUDE.md`，了解项目约定
2. 读取 `specs/` 目录结构，了解已有 Spec
3. 读取 `package.json`，了解依赖和脚本命令
4. 向用户输出项目环境总结（技术栈、目录结构、编码约定、测试方式）

**自检**：已读取 `.agents.md`、`specs/` 目录结构、`package.json`，已输出环境总结。

---

## 写 Spec — Feature Spec

1. 读取目标模块现有代码，了解当前功能上下文
2. 基于现有代码上下文 + 新需求描述，生成 Feature Spec

**输出格式：**

```markdown
## Feature: <功能名称>

### 用户故事
作为 <角色>，我希望 <做什么>，以便 <获得什么价值>

### 验收标准（AC）
- [ ] AC1: <用自然语言描述验收条件>
- [ ] AC2: ...

### 影响范围

### 非目标（明确不做）

### 技术约束
```

**输出路径**：`specs/features/<module>/feature-<name>.md`

**自检**：每条 AC 都是可判定的布尔条件；「非目标」已明确列出；技术约束已补充（如有）。

---

#### ⏸️ 暂停点（HARD STOP）

> **Feature Spec 已生成，请审核。**
>
> 请确认：AC 列表是否完整覆盖需求？「非目标」是否准确？有无遗漏的边界场景？
>
> 确认通过后，继续生成 UI Spec → API Spec → Test Fixtures。

**⛔ 必须等待用户明确回复"确认"或具体修改意见后，才能继续。不得在同一 turn 内继续生成任何后续文件。**

---

## 写 Spec — UI Spec

基于 Feature Spec 生成 UI Spec 增量：

1. 读取 `specs/features/<module>/feature-<name>.md`
2. 读取现有相关组件代码，了解当前 UI 结构
3. 生成：组件树结构（层级关系）、新增/修改组件的 Props 接口、样式规范、交互状态（loading / empty / error）

**输出路径**：`specs/features/<module>/ui-spec.md`

**自检**：组件树结构清晰；新增/修改组件都有 Props 接口定义；包含 loading/empty/error 状态说明。

---

## 写 Spec — API Spec

基于 Feature Spec 和 UI Spec 生成 API Spec 增量：

1. 读取已生成的 Feature Spec 和 UI Spec
2. 读取现有相关 Store、Service、API 代码
3. 生成：TypeScript 接口定义（无 `any`）、Store 新增字段及类型、API 端点定义、数据流文字描述

**输出路径**：`specs/features/<module>/api-spec.md`

**自检**：所有 TypeScript 接口定义完整（无 `any`）；API 端点包含 URL/Method/Request/Response。

---

## 写 Spec — Test Fixtures

基于 AC 和类型定义生成测试数据：

1. 读取 Feature Spec 中的 AC 列表
2. 读取 API Spec 中的类型定义
3. 为每个 AC 生成：正常路径数据 + 边界条件数据 + 异常数据，使用 TypeScript 类型标注

**输出目录**：`specs/features/<module>/test-fixtures/`

**自检**：每个 AC 都有对应测试数据文件；包含正常/边界/异常三类；类型与 API Spec 一致。

---

完成 Step 1-5 后输出总结，**HARD STOP 等待人工审核确认所有 Spec 文件后，再开始实现**。

---

## 生成实现代码

**⛔ 严禁在 Spec 未经人工确认前开始写任何实现代码。**

前置确认：
1. Feature / UI / API Spec 文件存在
2. 用户在本次对话中明确回复过"确认"或 LGTM 等肯定性指令
3. Jest 的 transform/babel 配置在 `jest.config.ts` 中内联，或使用独立的 `babel.jest.config.js`（禁止修改项目根目录的 `babel.config.js` / `vite.config.ts` 等构建配置）

实现步骤：
1. 读取所有 Spec 文件（Feature / UI / API）
2. 读取 `specs/constraints/architecture.md` 和 `coding-style.md`
3. 读取 `.agents.md`，确认项目约定
4. 严格按 Spec 生成代码，不实现「非目标」，不使用 `any`
5. 运行 Sensors（见 Step 8），有报错自修复后重验证

**自检**：代码不含 `any`；未实现「非目标」；代码风格与现有代码一致；Sensors 通过。

---

#### ⏸️ 暂停点

> **代码实现完成，请确认变更文件清单，确认后继续生成测试。**

---

## 生成单元测试

1. 读取 Feature Spec 中的 AC 列表
2. 读取 `test-fixtures/` 中的测试数据
3. 为每个 AC 生成至少 2 个测试用例（正常路径 + 边界条件）
4. 测试文件放在 `<module>/__tests__/`，描述包含 AC 编号
5. 运行 `npx jest --no-cache` 确保全部通过，有失败则修复后重跑

**自检**：每个 AC 至少 2 个测试用例；测试描述包含 AC 编号；`jest --no-cache` 全部通过。

---

## Sensors 验证 & 自修复

依次执行，有报错则修复后重跑，最多 3 轮：

```bash
npx tsc --noEmit
npx eslint <变更文件>
npx jest --no-cache
```

3 轮后仍有问题：停下来报告具体错误 + 根因分析 + 建议，不再继续自修复。

---

## Code Review

读取 Feature Spec，逐条对照 AC 确认每条都有对应实现，检查「非目标」未被意外实现，检查有无未声明的隐式行为。

**Review 报告格式：**

```markdown
## Code Review 报告

### ✅ 符合 Spec
| AC | 描述 | 实现位置 |
|---|---|---|
| AC1 | xxx | `src/xxx.ts:L42` |

### ⚠️ 需要人工确认
- <描述需确认的问题>

### ❌ 不符合 Spec
- <描述问题及修复建议>

### 非目标检查
- ✅ 未发现非目标功能被实现

### 隐式行为
- ✅ 无隐式行为

### 代码风格
- ✅ 与项目约定一致
```

---

#### ⏸️ 暂停点（HARD STOP）

> **Review 报告已生成，请审核。如有 ❌ 项需先修复；⚠️ 项请确认是否可接受。确认后执行 Git 提交。**

**等待用户确认后再继续 Step 10。**

---

## Git 提交

```bash
git add <本次变更文件>
git commit -m "feat(<module>): <简短描述>

- AC1: <验收标准1>
- AC2: <验收标准2>

Spec: specs/features/<module>/feature-<name>.md"
git push origin <branch-name>
```

输出 MR/PR 描述模板：

```markdown
## 变更说明

### 关联 Spec
- specs/features/<module>/feature-<name>.md

### 验收标准
- [ ] AC1: <验收标准1>
- [ ] AC2: <验收标准2>

### 变更文件
- <文件清单>

### 测试覆盖
- 单元测试：<N> 个用例，全部通过
- Sensors：tsc ✅ | eslint ✅ | jest ✅

### 影响范围
<说明影响的模块和页面>

### 回滚方案
<如需回滚的操作步骤>
```

---

## Bugfix 流程（分级）

> **核心原则**：Bugfix 的价值不在"写不写 Spec"，而在**补测试**——让 bug 不再复现。测试永远不能省。

### 分级判断（AI 自动判断，无需询问用户）

| 情况 | Level |
|---|---|
| 改动 ≤ 3 文件 且 无逻辑分支变更 | Level 1 |
| 需要分析根因 或 修复方案有 2+ 选择 | Level 2 |
| 涉及 3+ 模块 或 需要新增/修改接口契约 | Level 3 |

用户明确说"直接改"或"不用写 Spec"时，优先尊重用户判断。

---

### Level 1：直接改 + 补测试

适用：一眼看出问题在哪，改动 ≤ 3 个文件。

1. 直接修复代码
2. 补测试：针对该 bug 场景补测试用例，防止回归
3. 更新相关 Spec（如有需要，如 UI 样式规范变更）
4. 跑 Sensors：`tsc --noEmit` + `eslint` + `jest --no-cache`
5. 提交：`fix(<module>): <简短描述>`

---

### Level 2：轻量 Bugfix Spec + 改 + 测试

适用：需要分析根因，或修复方案有多种选择。

1. 写轻量 Bugfix Spec，输出到 `specs/bugfix/<module>/bugfix-<name>.md`
   - 内容：现象 + 根因分析 + 修复方案 + 验证标准
   - AC 格式：自然语言分条陈述，禁止 GIVEN/WHEN/THEN；只为业务分支写 AC，不为防御性代码凑数
2. 按方案修复代码
3. 补测试，防止回归
4. 跑 Sensors（最多 3 轮自修复）
5. 提交：`fix(<module>): <描述>\n\n- Root cause: <根因>\nBugfix-Spec: specs/bugfix/<module>/bugfix-<name>.md`

---

### Level 3：完整流程

涉及多模块联动、改动面大：直接走 Step 1-10 完整流程，在 Feature Spec 中标注 `type: bugfix`。

---

### Bugfix Spec 模板

```markdown
# Bugfix: <bug-id>

> Parent Spec: specs/features/<module>/feature-<name>.md

## 现象
## 复现步骤
1. 
2. 
3. 预期：<expected>，实际：<actual>

## 根因分析
## 修复方案
## 影响范围
- 涉及文件：
- 是否有副作用：

## 验证方法
| # | 验证点 | 断言 |
|---|---|---|
| V1 | 修复后正常场景 | |
| V2 | 回归测试 | |
```

### 交叉引用规范

- **Bugfix Spec** 顶部必须包含 `Parent Spec` 引用，指向原始 Feature Spec
- **Feature Spec** 底部必须包含 `Related` 引用，列出所有关联的 Bugfix Spec
- Bugfix Spec 修复完成后独立保留，不合并回主 Spec

---

## 通用非目标（所有 Spec 文件默认继承）

以下规则适用于所有 Spec，各 Spec 文件无需重复声明：

- 不测试 UI 渲染逻辑（组件是否正确渲染 DOM/视图）
- 不测试响应式绑定（MobX observer、Vue reactivity 等框架机制）
- 不测试埋点上报的具体参数（除非 AC 明确要求）
- 不测试动画和定时器的精确时序（只验证最终状态）

## 通用技术环境声明

以下环境约定默认生效，各 Spec 无需重复：

- 测试环境默认为 Node（非 jsdom），除非 Spec 明确标注
- 使用 `jest.useFakeTimers` 处理 setTimeout/setInterval
- 所有函数对 null/undefined 输入返回空值结构，不抛异常
