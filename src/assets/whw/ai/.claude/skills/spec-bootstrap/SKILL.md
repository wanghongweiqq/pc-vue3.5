---
name: spec-bootstrap
description: |
  历史仓库首次接入 Spec 驱动工作流的初始化工具。分析仓库技术栈和模块结构，搭建 specs/ 目录体系，生成 .agents.md 仓库约定、architecture.md 架构约束、coding-style.md 编码规范，验证 tsc/eslint/jest 三个质量门禁可运行。完成后可使用 spec-reverse 给已有代码补 Spec，或使用 spec-develop 正向开发。
  触发词：接入 Spec 体系、初始化 Spec、spec-bootstrap、搭建约束环境、生成 .agents.md、新仓库接入、零 Spec 仓库改造。
  工具要求：OpenClaw 或 Claude Code。

metadata:
  skillhub.creator: "wangjianlei02"
  skillhub.updater: "wangjianlei02"
  skillhub.version: "V6"
  skillhub.source: "FRIDAY Skillhub"
  skillhub.skill_id: "58251"
  skillhub.high_sensitive: "false"
---

# spec-bootstrap — Spec 体系初始化

一次性初始化 Skill。将历史仓库（零 Spec、零测试）改造为 Spec 驱动的 AI 协作仓库。
覆盖两个阶段：摸清家底并搭建 Spec 目录体系，以及搭建约束环境并验证质量门禁。
完成后即可使用 `spec-reverse`（给已有代码补 Spec）和 `spec-develop`（正向开发）。

---

## 前提检查

执行以下检查，任一不满足则暂停并询问用户：

1. **仓库路径**：确认仓库已 clone 到本地，记录根目录路径 `$REPO_ROOT`
2. **仓库类型**：确认类型为 **Max** / **MRN** / **Web** / **小程序** 之一
3. **工作分支**：建议新建 `feat/spec-bootstrap` 分支

**退出条件**：执行 `ls $REPO_ROOT/specs/ $REPO_ROOT/.agents.md 2>/dev/null`。若两者均存在，输出：
> ⚠️ 该仓库已完成 Spec 初始化（存在 specs/ 和 .agents.md）。建议使用 `spec-reverse` 补 Spec 或 `spec-develop` 正向开发。

---

## 第一阶段：摸清家底 + 搭 Spec 体系

### Step 1.1 — 分析仓库技术栈

**做什么**：全面了解仓库的技术组成。

**怎么做**：依次执行：

```bash
# 1. 根目录结构
ls -la $REPO_ROOT
tree -L 2 $REPO_ROOT/src/ 2>/dev/null || find $REPO_ROOT/src -maxdepth 2 -type d

# 2. 依赖分析
cat $REPO_ROOT/package.json
```

从 `package.json` 中提取：
- `dependencies` / `devDependencies` 中的框架（React/Vue/Max/MRN/Taro）
- 状态管理库（Redux/MobX/Vuex/Pinia/zustand）
- 构建工具（Webpack/Vite/Metro）
- 测试框架（Jest/Vitest/mocha）
- Lint 工具（ESLint 配置文件名）
- `scripts` 中已有的 lint/test/build 命令

**格式要求**：输出技术栈总结表：

```
### 仓库技术栈总结

| 类别 | 技术 |
|------|------|
| 框架 | <实际值> |
| 语言 | TypeScript / JavaScript |
| 构建工具 | <实际值> |
| 包管理器 | <实际值> |
| 状态管理 | <实际值 或 "未使用"> |
| 样式方案 | <实际值> |
| 测试框架 | <实际值 或 "未配置"> |
| Lint | <实际值 或 "未配置"> |
```

**自检**：确认表中无"未知"项——每项要么填入具体值，要么标注"未配置/未使用"。

---

### Step 1.2 — 分析业务模块

**做什么**：梳理 `src/` 下所有业务模块及其职责。

**怎么做**：

1. 列出 `src/` 一级子目录
2. 对每个目录，读取其 `index.ts(x)` 或入口文件，判断职责
3. 区分**基础设施目录**（utils/types/assets/services）和**业务模块目录**

**格式要求**：输出模块清单：

```
### 业务模块清单

| # | 模块目录 | 职责描述（一句话） | 文件数 | 外部依赖数 |
|---|----------|-------------------|--------|-----------|
| 1 | modules/order | 订单管理流程 | 12 | 2 |
| 2 | modules/user | 用户信息与认证 | 8 | 1 |
| ... | ... | ... | ... | ... |
```

**自检**：确认列出了所有 `src/` 下的业务相关目录（排除 utils/types/assets 等基础设施）。

---

### Step 1.3 — 推荐试点模块

**做什么**：从业务模块中推荐 1-3 个适合作为试点的模块。

**选择标准**（按优先级）：
1. **逻辑独立**：外部依赖少，不是被其他模块广泛引用的基础模块
2. **边界清晰**：输入/输出明确，有清晰的 API 边界
3. **复杂度中等**：不是简单的 utils 工具集，也不是耦合严重的核心主流程

**格式要求**：

```
### 推荐试点模块

1. **<模块名>**
   - 理由：<为什么适合>
   - 预估 Spec 数：<N> 个 Feature Spec
   - 风险：<低/中>

2. **<模块名>**
   - 理由：<为什么适合>
   - 预估 Spec 数：<N> 个 Feature Spec
   - 风险：<低/中>

3. **<模块名>**（可选）
   - 理由：<为什么适合>
   - 预估 Spec 数：<N> 个 Feature Spec
   - 风险：<低/中>
```

**自检**：确认推荐的模块不是 utils/common/shared 类基础库，且不是整个应用的主入口。

---

#### ⏸️ 暂停点 1：试点模块确认

向用户展示以上分析结果（技术栈、模块清单、推荐），然后暂停等待确认：

> 请确认试点模块选择：
> 1. 接受推荐？（输入"确认"或回车）
> 2. 需要更换？（请指定模块名）
>
> **审核要点**：
> - 推荐的模块是否业务重要性适中（不要选核心主流程作试点）
> - 模块边界是否确实清晰（代码里没有和其他模块深度耦合）
> - 预估工作量是否可接受

**⚠️ 必须等待用户回复后再继续执行 Step 1.4。**

---

### Step 1.4 — 创建 specs/ 目录结构

**做什么**：根据用户确认的试点模块，创建完整的 specs 目录和模板文件。

**怎么做**：执行以下命令（假设用户确认了模块 `$MODULE`）：

```bash
mkdir -p $REPO_ROOT/specs/constraints
mkdir -p $REPO_ROOT/specs/features/$MODULE
```

创建以下文件：

**文件 1** — `specs/constraints/architecture.md`（占位，Phase 2 填充）：

```markdown
# 架构约束

> 此文件将在 Phase 2 中基于代码分析填充。
```

**文件 2** — `specs/constraints/coding-style.md`（占位，Phase 2 填充）：

```markdown
# 编码规范

> 此文件将在 Phase 2 中基于代码分析填充。
```

**文件 3** — `specs/features/$MODULE/feature-template.md`：

```markdown
# Feature Spec: <功能名称>

## 元信息

| 项目 | 值 |
|------|------|
| 状态 | Draft / Review / Approved |
| 作者 | <mis> |
| 模块 | <模块名> |
| 创建日期 | <YYYY-MM-DD> |

## 用户故事

作为 <角色>，我希望 <操作>，以便 <价值>。

## AC 写作规范

AC（验收条件）面向人类阅读，禁止使用 Given/When/Then 格式。
正确格式：直接描述触发条件、行为和预期结果，用自然语言分条陈述。
禁止格式：BDD 风格（Given/When/Then/And）、测试框架风格（describe/it/expect）。
AI 生成测试用例时，应直接从 AC 自然语言中提取语义，无需 AC 配合机器格式。

## 验收标准（AC）

- [ ] AC1: <用自然语言描述验收条件>
- [ ] AC2: <用自然语言描述验收条件>
- [ ] AC3: <用自然语言描述验收条件>

## 影响范围

- 涉及文件/目录：
- 涉及接口：
- 涉及状态：

## 非目标

- <明确不在本次范围内的事项>

## 技术约束

- <必须遵守的技术限制，如性能要求、兼容性要求>
```

**文件 4** — `specs/features/$MODULE/ui-spec-template.md`：

```markdown
# UI Spec: <页面/组件名称>

## 组件结构

- 组件名：
- Props 定义：
- 状态：

## 交互行为

| 用户操作 | 系统响应 | 异常处理 |
|----------|----------|----------|
| | | |

## 样式约束

- 响应式断点：
- 主题适配：
```

**文件 5** — `specs/features/$MODULE/api-spec-template.md`：

```markdown
# API Spec: <接口名称>

## 接口定义

| 项目 | 值 |
|------|------|
| Method | GET / POST / PUT / DELETE |
| Path | /api/v1/... |
| 认证 | 需要 / 不需要 |

## 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| | | | |

## 响应结构

| 字段 | 类型 | 说明 |
|------|------|------|
| | | |

## 错误码

| Code | Message | 处理方式 |
|------|---------|----------|
| | | |
```

**自检**：执行 `tree $REPO_ROOT/specs/`，确认目录结构完整，所有文件非空。

---

## 第二阶段：搭约束环境

### Step 2.1 — 分析现有编码风格

**做什么**：从实际代码中归纳编码风格，作为约束文件的输入。

**怎么做**：

1. 阅读 `.eslintrc*` / `eslint.config.*` 文件，提取已有 lint 规则
2. 阅读 `tsconfig.json`，提取 strict 级别和路径别名
3. **抽样阅读 8-10 个核心业务文件**（非 index.ts），记录：
   - 缩进方式（2空格/4空格/Tab）
   - 引号风格（单引号/双引号）
   - 分号使用（有/无）
   - 导入顺序（三方库 → 内部模块 → 相对路径 → 样式）
   - 组件定义方式（函数组件/Class组件、箭头函数/function声明）
   - 状态管理使用方式
   - 错误处理模式（try-catch / .catch / ErrorBoundary）
   - 异步模式（async-await / Promise链 / callback）

4. 若发现不一致风格，统计各风格出现次数，**选择主流写法（出现 ≥60%）作为规范**

**格式要求**：产出内部分析笔记（不直接展示给用户）：

```
编码风格分析：
- 缩进：2空格（8/10 文件）
- 引号：单引号（10/10 文件）
- 分号：无（7/10 文件）
- 组件：箭头函数 + FC（6/10 文件）
- 导入：三方库 → @/ 别名 → 相对路径 → 样式（一致）
- 状态：zustand，集中在 stores/ 目录
- 异步：async-await 为主
- 不一致点：2个文件用了 Class 组件（历史遗留）
```

**自检**：确认分析了至少 8 个不同目录下的文件，覆盖了组件/服务/工具/Store 等不同类型。

---

### Step 2.2 — 生成 .agents.md

**做什么**：在仓库根目录创建 `.agents.md`——AI 编码时必须遵守的仓库级约定。

**怎么做**：

1. 读取模板文件 `references/agents-md-template.md`（位于本 Skill 目录下）
2. 用 Step 1.1 的技术栈分析和 Step 2.1 的编码风格分析**填充模板中所有占位符**
3. 根据仓库类型选择对应的"禁止事项"章节：
   - Max → 保留 `[Max 专用]` 部分，删除其他
   - MRN → 保留 `[MRN 专用]` 部分，删除其他
   - 小程序 → 保留 `[小程序专用]` 部分，删除其他
   - Web → 保留 `[Web 专用]` 部分，删除其他

**`.agents.md` 必须包含的章节**：

| # | 章节 | 内容要求 |
|---|------|----------|
| 1 | 项目概述 | 一段话，说明项目是什么、服务谁、核心能力 |
| 2 | 技术栈 | 表格形式，与 Step 1.1 一致 |
| 3 | 目录约定 | tree 格式展示 src/ 结构，每个目录附一句话说明 |
| 4 | 命名规范 | 表格：对象/规则/示例，覆盖文件、组件、函数、常量、类型、CSS |
| 5 | 禁止事项 | 通用禁止 + 仓库类型专用禁止 |
| 6 | 测试约定 | 表格：框架/位置/命名/覆盖率/必测内容 |
| 7 | Spec 工作流 | 指向 specs/ 目录 |
| 8 | Sensors | 三条命令：tsc / eslint / jest |

**核心原则**：
- ⚠️ **所有内容必须从实际代码中归纳，严禁凭空编造**
- 若代码中不一致，选主流写法作为规范，并在文件中注释说明

**自检**：
1. 检查 `.agents.md` 中是否还有 `<占位符>` 格式的未填充内容
2. 确认"禁止事项"章节只保留了当前仓库类型对应的部分

---

### Step 2.3 — 生成 specs/constraints/architecture.md

**做什么**：填充架构约束文件，描述代码的分层结构和通信规则。

**怎么做**：基于 Step 2.1 的代码分析，写入以下内容：

```markdown
# 架构约束

## 分层架构

| 层次 | 目录 | 职责 | 可依赖的层 |
|------|------|------|-----------|
| 页面层 | pages/ | 路由入口、页面组装 | 组件层、Store层、Service层 |
| 组件层 | components/ | UI 渲染、交互响应 | Store层（读）、Utils |
| Store层 | stores/ | 状态管理、业务逻辑 | Service层、Utils |
| Service层 | services/ | API 通信、数据转换 | Utils |
| 工具层 | utils/ | 纯函数、无副作用 | 无外部依赖 |

> 根据实际项目层次调整上表。

## 数据流方向

<描述单向数据流或双向绑定模式，画出简单的文字流向>

示例：
```
用户操作 → Component → dispatch Action → Store 更新 → Component 重渲染
                                        ↓
                                   Service 调用 API
```

## 模块间通信方式

| 场景 | 方式 | 示例 |
|------|------|------|
| 父子组件 | Props / Events | |
| 跨组件 | Store | |
| 跨模块 | 公共 Store 或事件总线 | |

## 依赖方向约束（禁止违反）

- ❌ 组件层不得直接调用 Service 层（必须通过 Store）
- ❌ 工具层不得引用业务模块
- ❌ 下层不得引用上层
```

**自检**：确认分层表中的目录名与仓库实际目录一致。

---

### Step 2.4 — 生成 specs/constraints/coding-style.md

**做什么**：填充编码规范文件，确保 AI 生成代码风格统一。

**怎么做**：基于 Step 2.1 的编码风格分析，写入以下内容：

```markdown
# 编码规范

## 代码风格

| 规则 | 标准 |
|------|------|
| 缩进 | <2空格 / 4空格> |
| 引号 | <单引号 / 双引号> |
| 分号 | <有 / 无> |
| 行宽 | <80 / 100 / 120> |
| 尾逗号 | <always / es5 / never> |

## 导入顺序

```typescript
// 1. Node 内置模块
import path from 'path';

// 2. 第三方库
import React from 'react';

// 3. 内部模块（@/ 别名）
import { UserStore } from '@/stores/user';

// 4. 相对路径
import { helper } from './utils';

// 5. 样式文件
import styles from './index.module.css';
```

## 组件编写规范

<根据实际框架填充：函数组件 vs Class、Props 定义方式、默认值处理>

## 状态管理规范

<根据实际状态管理库填充：Store 结构、Action 命名、副作用处理方式>

## 异步处理规范

- 统一使用 async/await（或根据项目实际）
- 错误处理方式：<try-catch / .catch / ErrorBoundary>
- 请求取消：<AbortController / 取消 token>

## 注释规范

- 函数/方法：JSDoc 格式，描述参数和返回值
- 复杂逻辑：行内注释说明"为什么"而非"做什么"
- TODO 格式：`// TODO(<mis>): <描述>`
```

**自检**：确认所有规则都来自实际代码分析，没有"建议"类的模糊表述——每条必须是明确的"做/不做"。

---

### Step 2.5 — 配置隔离测试环境

**做什么**：为 Jest 配置独立的 transform/babel 配置，确保测试环境不污染项目构建配置。

**核心约束（必须遵守）**：
> ⚠️ **严禁修改项目根目录的 `babel.config.js` / `babel.config.ts` / `vite.config.ts` 等构建配置文件来让测试跑通。**
> Jest 所需的 transform/babel 配置必须在 `jest.config.ts` 中内联，或使用独立的 `babel.jest.config.js` 文件。

**标准做法**：

```typescript
// jest.config.ts（推荐方式）
export default {
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {}],  // 或使用 ts-jest
  },
  // 不在这里引用 babel.config.js
};
```

如果必须使用 babel transform：

```javascript
// babel.jest.config.js（独立文件，不是 babel.config.js）
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
```

```typescript
// jest.config.ts 中引用
export default {
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.jest.config.js' }],
  },
};
```

**检查项**：执行以下命令验证配置隔离：

```bash
# 确认项目构建配置未被修改
git diff HEAD -- babel.config.js babel.config.ts vite.config.ts webpack.config.js 2>/dev/null
# 应该没有输出（未修改）
```

---

### Step 2.6 — 验证 Sensors

**做什么**：确认 tsc / eslint / jest 三个质量门禁命令可以执行。

**怎么做**：在 `$REPO_ROOT` 下依次执行：

```bash
# 1. TypeScript 类型检查
npx tsc --noEmit 2>&1 | tail -20
echo "Exit code: $?"

# 2. ESLint 代码规范
npx eslint src/ --ext .ts,.tsx 2>&1 | tail -20
echo "Exit code: $?"

# 3. Jest 单元测试（注意：必须直接可运行，不依赖额外环境变量）
npx jest --passWithNoTests 2>&1 | tail -20
echo "Exit code: $?"
```

> ⚠️ **Jest 必须不依赖 `NODE_ENV=test` 等环境变量前缀才能通过**。如果需要设置环境变量，应在 `jest.config.ts` 的 `testEnvironment` 或 `globals` 中配置，不依赖外部环境。

**记录规则**：
- 命令成功（exit 0）→ 记录 `✅ 可运行`
- 命令有报错但可执行 → 记录 `⚠️ 可运行，N 个错误/警告`
- 命令不存在或依赖未安装 → 记录 `❌ 未配置`，**不要求此阶段修复**

**格式要求**：

```
### Sensors 验证结果

| Sensor | 状态 | 详情 |
|--------|------|------|
| tsc --noEmit | ✅/⚠️/❌ | <具体信息> |
| eslint | ✅/⚠️/❌ | <具体信息> |
| jest | ✅/⚠️/❌ | <具体信息> |
```

**自检**：
- 三个命令都已执行并记录结果
- jest 不依赖外部环境变量即可运行
- 构建配置文件（babel.config.js 等）未被修改

---

#### ⏸️ 暂停点 2：约束文件审核

向用户展示生成的三个文件的核心内容摘要，然后暂停等待审核：

> 请审核以下文件是否准确反映了项目现状：
>
> **1. `.agents.md`** — 仓库级 AI 约定
> - 技术栈是否正确？
> - 命名规范是否与团队习惯一致？
> - 禁止事项是否有遗漏或需要调整？
>
> **2. `specs/constraints/architecture.md`** — 架构约束
> - 分层描述是否准确？
> - 依赖方向约束是否正确？
>
> **3. `specs/constraints/coding-style.md`** — 编码规范
> - 代码风格规则是否与实际一致？
> - 有无需要补充的团队约定？
>
> **审核要点**：
> - 内容是否基于实际代码，而非通用模板
> - 是否有明显错误或过时信息
> - 是否遗漏了团队特有的约定
>
> 请回复修改意见，或输入"确认"通过。

**⚠️ 必须等待用户回复后再继续。**

---

### Step 2.6 — 根据反馈修改

**做什么**：根据用户审核反馈修改约束文件。

**怎么做**：

1. 逐项对应用户的修改意见
2. 修改对应文件
3. 展示变更摘要（修改了哪个文件的哪个部分）

**格式要求**：

```
### 变更摘要

| 文件 | 修改内容 |
|------|----------|
| .agents.md | <修改描述> |
| architecture.md | <修改描述> |
| coding-style.md | <修改描述> |
```

若用户回复"确认"/"没问题"/"LGTM"等肯定回复，跳过此步直接进入完成输出。

---

## 完成输出

Phase 1-2 全部完成后，输出总结：

```
## ✅ Spec Bootstrap 完成

### 仓库信息
- 仓库路径：<$REPO_ROOT>
- 仓库类型：<Max / MRN / Web / 小程序>
- 技术栈：<框架> + <语言> + <构建工具>
- 工作分支：<分支名>

### 试点模块
- <模块 1>
- <模块 2>（如有）

### 创建的文件清单
| 文件 | 说明 |
|------|------|
| `.agents.md` | 仓库级 AI 约定 |
| `specs/constraints/architecture.md` | 架构约束 |
| `specs/constraints/coding-style.md` | 编码规范 |
| `specs/features/<模块>/feature-template.md` | Feature Spec 模板 |
| `specs/features/<模块>/ui-spec-template.md` | UI Spec 模板 |
| `specs/features/<模块>/api-spec-template.md` | API Spec 模板 |

### Sensors 状态
| Sensor | 状态 |
|--------|------|
| tsc | ✅ 可运行 / ⚠️ N 个错误 / ❌ 未配置 |
| eslint | ✅ 可运行 / ⚠️ N 个警告 / ❌ 未配置 |
| jest | ✅ 可运行 / ⚠️ N 个失败 / ❌ 未配置 |

### 🚀 下一步
使用 `spec-reverse` 给试点模块的已有代码补充 Spec 和测试。
```

---

## 注意事项

- ⚠️ **所有生成内容基于实际代码分析**——不使用通用占位符，不凭空编造
- ⚠️ **约束文件宁少勿虚**——每条规则都要有代码依据，不确定的不写
- ⚠️ **暂停点必须严格等待人确认**——不可跳过，不可自行假设确认
- ⚠️ **模板路径**：`.agents.md` 的结构模板见本 Skill 目录下 `references/agents-md-template.md`
- 若仓库无 TypeScript / ESLint / Jest，在总结中标注"未配置"，建议后续引入但不阻塞流程
