# Spec 模板集

供 `spec-develop` 工作流使用的标准模板。

---

## Feature Spec 模板

```markdown
# Feature: <feature-name>

## 概述
<!-- 1-3 句话说清楚这个 feature 做什么 -->

## Scope
- [ ] <要做的事 1>
- [ ] <要做的事 2>

## Non-Scope
- <明确不做的事>

## Acceptance Criteria

| # | AC 描述 | 可判定条件 |
|---|---|---|
| AC1 | <描述> | <断言：当 X 时，Y 应为 Z> |
| AC2 | <描述> | <断言> |

## 依赖
- 接口：<API Spec 中的接口名>
- 组件：<UI Spec 中的组件名>

## 技术方案（可选）
<!-- AI 或人补充实现思路 -->

## 约束
<!-- 从 constraints.md 中摘出与本 feature 相关的约束 -->
```

---

## UI Spec 模板

```markdown
# UI Spec: <页面/组件名>

## 组件结构

<ComponentName>
├── <SubComponent1> — <职责>
├── <SubComponent2> — <职责>
└── <SubComponent3> — <职责>

## 状态

| 状态 | 触发条件 | UI 表现 |
|---|---|---|
| loading | 接口请求中 | 骨架屏 |
| empty | 列表为空 | 空状态插图 + 引导文案 |
| error | 接口报错 | 错误提示 + 重试按钮 |
| normal | 数据就绪 | 正常渲染列表 |

## 交互行为

1. <用户操作> → <UI 响应> → <副作用（如接口调用）>
2. ...

## 响应式（如适用）

| 断点 | 布局变化 |
|---|---|
| < 375px | 单列 |
| ≥ 375px | 双列 |

## 关联 AC
- AC1 → <ComponentName> normal 状态
- AC2 → <ComponentName> error 状态
```

---

## API Spec 模板

```markdown
# API: <接口名>

## 基本信息

- 路径：`<METHOD> /api/v1/<path>`
- 认证：<是否需要 token>
- 限流：<QPS 限制（如有）>

## 请求

### Headers
| Key | Value | 必填 |
|---|---|---|
| Content-Type | application/json | 是 |

### Query Parameters（如适用）
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|

### Request Body
```json
{
  "field1": "string, 必填, 说明",
  "field2": "number, 可选, 默认值=0"
}
```

## 响应

### 成功（200）
```json
{
  "code": 0,
  "data": {
    "field1": "string"
  }
}
```

### 错误码
| code | 含义 | 处理方式 |
|---|---|---|
| 1001 | 参数错误 | 前端 toast |
| 1002 | 无权限 | 跳转登录 |

## 调用时序（如有依赖）
1. 先调用 A 接口获取 token
2. 再调用本接口
```

---

## Bugfix Spec 模板

```markdown
# Bugfix: <bug-id>

## 现象
<!-- 用户看到了什么问题 -->

## 复现步骤
1. <step 1>
2. <step 2>
3. 预期：<expected>，实际：<actual>

## 根因分析
<!-- 代码哪里出了问题，为什么 -->

## 修复方案
<!-- 改什么、怎么改 -->

## 影响范围
- 涉及文件：<file list>
- 是否有副作用：<yes/no，说明>

## 验证方法
| # | 验证点 | 断言 |
|---|---|---|
| V1 | 修复后正常场景 | <断言> |
| V2 | 回归：原有功能不受影响 | <断言> |

## 回归测试
<!-- 新增测试用例描述 -->
```
