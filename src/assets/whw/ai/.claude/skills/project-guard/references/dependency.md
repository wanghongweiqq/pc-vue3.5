# 依赖安装规范

## 检查流程

按顺序逐项执行，收集所有检查结果后统一输出，格式参考 SKILL.md 的输出规范。

### 1. Node 版本匹配
- 读取项目 `package.json` 中的 `engines.node` 字段
- 执行 `node -v` 获取当前版本
- 对比结果：
  - ✅ 在声明范围内 → 通过
  - ❌ 超出范围不管 `.npmrc` 有无 `engine-strict=true` → 阻断，必须切换版本

### 2. 包管理器一致性
- 检测 `yarn.lock` / `package-lock.json` 确定项目应使用的包管理器
- 识别用户输入命令的包管理器（npm/yarn/pnpm）
- 对比结果：
  - ✅ 一致 → 通过
  - ❌ 不一致（如项目用 yarn 但输入 `npm i`）→ 阻断
  - ⚠️ 两个 lockfile 都存在 → 警告 lockfile 冲突
  - 都不存在 → 询问用户偏好

### 3. 输出检查列表

执行完以上检查后，按格式输出：

```
## 检查结果

| 检查项 | 状态 | 说明 |
|---|:---:|---|
| Node 版本 | ✅/⚠️/❌ | 当前 vX.X.X，要求 >=X <X |
| 包管理器 | ✅/⚠️/❌ | 项目使用 yarn，输入命令为 npm |
```

### 4. 有问题时输出解决方案

若存在 ⚠️ 或 ❌，紧接着输出解决方案块，方案按优先级排序：

**Node 版本不匹配的方案选项：**

**问题：Node 版本不符合要求（当前 vX，要求 >=A <B）**

| | # | 方案 | 命令 |
|:---:|:---:|---|---|
| 🟢 | 1 | 切换 Node 版本 | `nvm use <compatible-version> && yarn add <pkg>` |
| | 2 | 临时绕过版本检查 | `yarn add <pkg> --ignore-engines` |

↑↓ 输入数字选择，回车执行。

**包管理器不一致的方案选项：**

**问题：项目使用 yarn，请勿使用 npm**

| | # | 方案 | 命令 |
|:---:|:---:|---|---|
| 🟢 | 1 | 使用正确的 yarn 命令（生产依赖） | `yarn add <pkg>` |
| | 2 | 安装为开发依赖 | `yarn add -D <pkg>` |

↑↓ 输入数字选择，回车执行。

**Peer dependency 风险（仅提示，不阻断）：**
- 项目有大量内部包（`@hfe/`、`@max/`）时，提示可能需要 `--ignore-engines`（yarn）或 `--legacy-peer-deps`（npm）

---

## 包管理器选择

| 判断依据 | 使用工具 |
|---|---|
| 存在 `yarn.lock` | yarn |
| 存在 `package-lock.json` | npm |
| 两者都有 | ⚠️ 冲突，需用户确认后删除多余的 |
| 都没有 | 询问用户偏好 |

**为什么要统一**：yarn 和 npm 有不同的依赖解析算法，混用会导致两个 lockfile 的依赖树不一致，其他开发者安装后的 `node_modules` 可能和你本地不同，引发难以复现的问题。

## Node 版本

- 检查 `package.json` 的 `engines.node` 字段
- 检查 `.nvmrc` 或 `.node-version` 文件
- 不匹配时的处理方式：
  - **推荐**：`nvm use <version>` 切换到兼容版本
  - **临时绕过（yarn）**：`yarn install --ignore-engines`
  - **临时绕过（npm）**：npm 默认只警告，无需额外 flag
  - **强制检查（npm）**：若 `.npmrc` 有 `engine-strict=true`，必须先切换版本

## peer dependency 处理

遇到 peer dependency 冲突时：

**yarn**：
```bash
yarn add <package> --ignore-engines
```

**npm**：
```bash
npm install <package> --legacy-peer-deps
```

`--legacy-peer-deps` 的含义：使用 npm v6 的旧解析模式，遇到 peer dep 冲突时不报错，而是尽量安装。适用于依赖关系复杂的旧项目（如内部 Max 框架包）。

## 命令对照表

| 操作 | npm | yarn |
|---|---|---|
| 安装全部依赖 | `npm install` | `yarn install` |
| 安装生产依赖 | `npm install <pkg>` | `yarn add <pkg>` |
| 安装开发依赖 | `npm install -D <pkg>` | `yarn add -D <pkg>` |
| 卸载 | `npm uninstall <pkg>` | `yarn remove <pkg>` |
| 更新 | `npm update <pkg>` | `yarn upgrade <pkg>` |

## 安装后检查

安装完成后，注意以下情况：
1. `yarn.lock` 或 `package-lock.json` 是否有非预期的大量变更（可能是包管理器版本不同导致的重新解析）
2. 是否有安全漏洞警告（`npm audit`）
3. 是否有 deprecated 警告，评估是否影响功能
