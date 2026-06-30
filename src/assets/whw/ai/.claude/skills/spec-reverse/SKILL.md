---
name: spec-reverse
description: |
  给已有代码逆向推导出 Feature Spec / UI Spec / API Spec，并生成测试用例确保 Sensors 全绿。适用于给历史代码补 Spec、补全测试覆盖、逆向工程文档化、代码审计前梳理。
  前提：仓库已完成 spec-bootstrap（有 specs/ 目录和 .agents.md）。
  触发词：逆向 Spec、补 Spec、spec-reverse、给代码补测试、补全测试、逆向分析模块、历史代码文档化。
  工具要求：OpenClaw 或 Claude Code。

metadata:
  skillhub.creator: "wangjianlei02"
  skillhub.updater: "wangjianlei02"
  skillhub.version: "V8"
  skillhub.source: "FRIDAY Skillhub"
  skillhub.skill_id: "58252"
  skillhub.high_sensitive: "false"
---

# spec-reverse — 逆向 Spec + 测试补全

给已有代码逆向出 Spec 并补全测试。
前提：仓库已有 `specs/` 和 `.agents.md`。
如没有，先执行 `spec-bootstrap`。

---

## 前提检查

确认以下条件，任一不满足则提示用户先运行 spec-bootstrap：

1. `specs/` 目录存在
2. `.agents.md` 存在
3. 目标模块路径有效且包含源代码

```bash
ls specs/ .agents.md
ls <目标模块路径>
```

---

## 输入

向用户确认：

- **目标模块名称**（如 `order-list`）
- **目标模块路径**（如 `src/order-list/`）

---

## 逆向流程

### Step 1：逆向 Feature Spec

1. 读取模块下所有源代码文件
2. 分析功能职责，反推 Feature Spec，包含：
   - **用户故事**：As a … I want … So that …
   - **验收标准 AC**：从代码行为归纳，每条必须可判定
   - **影响范围**：该模块修改会波及的文件/模块
   - **非目标**：明确排除的能力
3. 输出到 `specs/features/<module>/feature-<name>.md`
4. **⏸️ 暂停——让人审核 Spec 准确性后再继续**
---

### Step 2：逆向 UI Spec

1. 分析组件树结构和 Props 接口
2. 列出：
   - 组件层级关系
   - 每个组件的 Props 类型定义
   - 条件渲染逻辑
   - 关键交互行为
3. 输出到 `specs/features/<module>/ui-spec.md`

---

### Step 3：逆向 API Spec

1. 分析 Store / Service / API 请求
2. 输出完整 TypeScript 类型定义：
   - 请求参数类型
   - 响应数据类型
   - 错误处理类型
   - 状态管理接口
3. 输出到 `specs/features/<module>/api-spec.md`

---

### Step 4：生成测试

1. 基于 AC 生成测试用例（每个 AC 至少 2 个：正常 + 边界）
2. 运行测试：

```bash
npx jest --no-cache
```

3. 如有失败，分析原因并修复（最多 3 轮）
4. 测试验证**当前行为**，不是理想行为

---

### Step 5：Sensors 全量验证

依次运行：

```bash
npx tsc --noEmit
npx eslint <模块文件>
npx jest --no-cache
```

全部通过后输出报告。任一失败则修复后重跑。

---

## 关键原则

- Spec 描述"代码实际做了什么"，不是"应该做什么"
- 发现 bug 在 Spec 中标注 `[已知问题]`，不"修正"
- 测试验证当前行为，不是理想行为
- AC 必须可判定——两个人读同一条 AC 不会有不同理解
- Step 1 结束后**必须暂停**等人审核

### AC 写作规范（逆向时同样适用）

AC（验收条件）面向人类阅读，直接描述触发条件、行为和预期结果，用自然语言分条陈述。
AI 生成测试用例时，应直接从 AC 自然语言中提取语义，无需 AC 配合机器格式。

规则：
1. **🚫 禁止 BDD 格式** — 禁止 Given/When/Then/And，禁止符号箭头（`→`），用自然语言直接描述
2. **🚫 禁止伪代码风格** — AC 中禁止出现方法签名、返回值描述、参数列表、条件表达式（如 `isReady()=true 时返回 null`）。用自然语言描述触发条件和预期行为，关键标识仅用反引号点缀
3. **关键标识用反引号** — 方法名、变量名、事件名用 `` ` `` 包裹，给 AI 锚点
4. **单文件 AC 上限 15 条** — 超过应拆分 Spec
5. **AC 编号连续** — 每个 Spec 文件内从 AC1 开始

补充：
- 不为纯防御性代码（`?.`、`?? []`）写冗余 AC
- AC 聚焦业务判断逻辑，对称操作可合并

### ⚠️ 逆向时特别注意：不要照抄实现

逆向最大的陷阱：**把代码实现翻译成 AC，变成描述「代码做了什么」而不是「业务约束是什么」**。

**每读一段代码，先问：这段代码有业务判断逻辑吗？**

| 代码类型 | 处理方式 |
|---|---|
| `if` / `switch` / 条件映射 / 状态流转 | ✅ 写 AC，描述条件分支 |
| 纯赋值 `this.x = value` | ❌ 不写 AC |
| class field 初始化 `visible = false` | ❌ 不写 AC（除非有业务含义） |
| `?.` / `??` / `\|\|` 防御性语法 | ❌ 不写 AC |
| `.length` / 模板字符串 等语言操作 | ❌ 不写 AC |

**写每条 AC 前问自己 3 个问题：**

1. 这条 AC 描述的是业务规则，还是语言/框架内置行为？
2. 把这条 AC 改成「不满足」，用户能感知到异常吗？不能就删掉。
3. 不看代码，能直接写出测试用例吗？不能就先补完整前提条件。

---

## 仓库差异

| 仓库类型 | 逆向时注意 |
|---|---|
| Max | 识别 `x-if` / `x-for` 等 DSL，不要误认为 JSX |
| MRN | 区分 RN 原生组件和自定义组件 |
| Web | 标准 React，注意 hooks 和 context |
| 小程序 | WXML 模板语法，注意 `setData` 调用模式 |

---

## 通用非目标（所有逆向 Spec 默认继承）

以下规则适用于所有逆向生成的 Spec，无需在每个文件中重复声明：

- 不测试 UI 渲染逻辑（组件是否正确渲染 DOM/视图）
- 不测试响应式绑定（MobX observer、Vue reactivity 等框架机制）
- 不测试埋点上报的具体参数（除非 AC 明确要求）
- 不测试动画和定时器的精确时序（只验证最终状态）

## 通用技术环境声明

以下环境约定默认生效，各 Spec 无需重复：

- 测试环境默认为 Node（非 jsdom），除非 Spec 明确标注
- 使用 `jest.useFakeTimers` 处理 setTimeout/setInterval
- 所有函数对 null/undefined 输入返回空值结构，不抛异常

---

## 完成输出

输出以下内容：

1. **创建的 Spec 文件清单**（路径列表）
2. **测试覆盖情况**（用例数、通过率）
3. **Sensors 运行结果**（tsc / eslint / jest 状态）
4. **下一步建议**：
   - 继续对其他模块执行 spec-reverse
   - 或进入 spec-develop 日常开发流程
