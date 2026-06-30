# 代码修改规范

## 检查流程

### 1. 识别项目架构
读取 `package.json` 的 `dependencies` 和 `devDependencies`，判断架构类型：

```
Max 特征：@max/max、@hfe/max-view、remStyleSheet
React 特征：react + react-dom（无 react-native）
Vue3 特征：vue@^3、@vue/core
Next.js 特征：next
```

支持多架构共存（如 Max + TypeScript + React Native）。

### 2. 加载对应规范
根据识别结果，读取对应的规范文件：

| 架构 | 规范文件 |
|---|---|
| Max | `references/max.md` |
| React | `references/react.md` |
| Vue3 | `references/vue3.md` |
| 未识别 | 提示用户说明架构，或跳过规范检查 |

读取规范后，向用户展示与本次改动最相关的规则，而非全部规则。

### 3. 检查项目约束文件
如果项目存在以下文件，读取并提取关键约束：
- `specs/constraints/` 目录下的约束文件
- `.agents.md`（仓库级 AI 协作约定）
- `CLAUDE.md`（项目级指令）

### 4. 给出改动建议
结合规范和约束，针对本次改动给出：
- 需要注意的规范要点（只展示相关的，不要全部列出）
- 可能的风险点（如跨平台兼容、类型安全等）
- ✅ 可以开始改动
