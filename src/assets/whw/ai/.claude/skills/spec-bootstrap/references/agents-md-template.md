# .agents.md 模板

> 根据仓库类型选用对应章节。

---

```markdown
# .agents.md — <项目名称>

## 项目概述

<一段话描述项目定位、核心功能、目标用户>

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | <React / Vue / Max / MRN / 原生小程序> |
| 语言 | <TypeScript / JavaScript> |
| 构建工具 | <Webpack / Vite / Metro / Max CLI> |
| 包管理器 | <pnpm / yarn / npm> |
| 状态管理 | <Redux / MobX / Vuex / Pinia > |
| 样式方案 | <CSS Modules / Styled Components / Tailwind / SCSS> |
| 测试框架 | <Jest / Vitest / 未配置> |

## 目录约定

```
src/
├── components/    # 公共组件
├── pages/         # 页面/路由入口
├── modules/       # 业务模块（按功能划分）
├── services/      # API 请求层
├── stores/        # 状态管理
├── utils/         # 工具函数
├── types/         # 类型定义
└── assets/        # 静态资源
```

> 根据实际项目结构调整，删除不存在的目录，补充遗漏的目录。

## 命名规范

| 对象 | 规则 | 示例 |
|------|------|------|
| 文件（组件） | PascalCase | `UserProfile.tsx` |
| 文件（非组件） | camelCase 或 kebab-case | `useAuth.ts` / `api-client.ts` |
| 组件名 | PascalCase | `<UserProfile />` |
| 函数/变量 | camelCase | `getUserInfo` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 类型/接口 | PascalCase，接口不加 I 前缀 | `UserInfo`、`PageProps` |
| CSS 类名 | camelCase（CSS Modules）或 BEM | `.userName` / `.user-card__title` |

## 禁止事项

通用禁止：
- 禁止 `any` 类型（除非有注释说明原因）
- 禁止 `console.log` 留在生产代码中
- 禁止跨模块直接引用内部文件（通过 index 导出）
- 禁止在组件中直接调用 HTTP 请求（通过 services 层）
- 禁止 magic number（提取为命名常量）
- 禁止循环依赖

### [Max 专用]

- 禁止在模板中使用复杂表达式（提取为 computed）
- DSL 指令仅使用：`x-if`、`x-for`、`x-model`、`x-show`
- 禁止 `x-for` 不带 `:key`
- 禁止模板嵌套超过 3 层

### [MRN 专用]

- **禁止使用任何 DOM API**（`document.*`、`window.*`）
- 禁止使用 Web 专属 CSS（`position: fixed`、`vh/vw` 单位）
- 禁止在 render 中创建新对象/函数（性能）
- 使用 `StyleSheet.create()` 而非内联样式

### [小程序专用]

- 禁止单次 `setData` 数据量超过 256KB
- 禁止频繁 setData（合并为一次调用）
- 禁止主包超过 2MB
- 禁止跨分包直接引用（通过公共模块）
- 禁止在 `onLoad` 中执行重计算

### [Web 专用]

- 禁止未做 code splitting 的大页面（> 200KB）
- 禁止 `document.querySelector` 操作 React/Vue 管理的 DOM

## 测试约定

| 项目 | 规则 |
|------|------|
| 框架 | Jest / Vitest |
| 文件位置 | `__tests__/` 或 `*.test.ts(x)` 与源文件同目录 |
| 命名 | `<源文件名>.test.ts(x)` |
| 覆盖率目标 | 新代码 ≥ 80%（逐步提升） |
| 必测内容 | 业务逻辑函数、自定义 Hook、状态变更、API 调用 |
| 可选内容 | 纯展示组件、样式、第三方库 wrapper |

## Spec 工作流

本项目使用 Spec 驱动开发：

### Spec 目录结构（强制约定）

```
specs/
├── constraints/
│   ├── architecture.md      # 架构约束
│   └── coding-style.md      # 编码规范
└── features/
    └── <模块名>/            # 每个功能模块独立目录
        ├── feature-<name>.md
        ├── ui-spec.md
        ├── api-spec.md
        └── test-fixtures/
```

**禁止事项**：
- ❌ 禁止在 `specs/` 以外的目录创建 Spec 文件
- ❌ 禁止将不同模块的 Spec 混放在同一目录
- ❌ 禁止使用其他目录名（如 `__specs__/`、`spec/`、`docs/`）替代 `specs/`

### 工作流约定

- 开发前先写/更新 Spec，通过人工审核后再编码（⚠️ 严禁在 Spec 未审核前开始写代码）
- AI 编码时必须遵循 `.agents.md` 和 `specs/constraints/` 中的所有约束

## Sensors（质量门禁）

以下命令必须在提交前通过：

```bash
npx tsc --noEmit                    # 类型检查
npx eslint src/ --ext .ts,.tsx      # 代码规范
npx jest --passWithNoTests          # 单元测试
```

CI 同样会执行以上检查，本地失败 = CI 必然失败。
```

---

## 差异速查

| 仓库类型 | 关键差异点 |
|----------|-----------|
| Max | 增加 DSL 指令章节、模板规范、computed 规则 |
| MRN | 禁止 DOM API、RN 样式规范、性能约束 |
| 小程序 | 分包约束、setData 规则、生命周期规范 |
| Web | 浏览器兼容、路由规范、Bundle 体积约束 |

---

## 使用说明

1. 复制上方模板到仓库根目录 `.agents.md`
2. 根据实际项目填充占位内容
3. 删除不适用的 `[条件]` 章节
4. 保留适用的条件章节，去掉 `[条件]` 标记
5. 随项目演进持续更新
