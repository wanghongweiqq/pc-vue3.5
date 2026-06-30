# 方案 A：多窗口实时通信机制

## Context

用户希望 Tech Lead 和各角色窗口（如 QA）能够实时通信——Tech Lead 发消息，QA 窗口自动感知并处理，结果自动回到 Tech Lead。

现有基础设施已相当完整：
- `msg/team-msg.sh`：SQLite 消息队列 CLI
- `msg/watch.sh`：守护进程，1秒轮询，写 inbox JSON，发系统通知
- `lead-watch.sh`：Tech Lead 侧消息路由（监听 → 转发）
- `role-agent.sh`：角色侧自主循环（监听 → `claude -p` → 回复）
- `launch_team.py`：启动 5 个 iTerm2 标签页

**缺口**：启动脚本没有自动启动 `role-agent.sh` 和 `lead-watch.sh`，导致"消息发出去没人处理"。解决这个缺口即可实现方案 A。

---

## 实现方案

### 核心思路

在每个角色标签页启动时，同时后台启动两个进程：
1. `watch.sh <role>`：负责通知（系统通知 + inbox 文件）
2. `role-agent.sh <role> <workdir>`：负责自动用 `claude -p` 处理消息并回复

Tech Lead 窗口同样启动 `lead-watch.sh`，实现自动路由。

```
[Tech Lead 窗口]
  ├── 交互式 Claude（Tech Lead system prompt）
  └── lead-watch.sh（后台）: 监听 → 自动转发给下游角色

[QA 窗口]
  ├── 交互式 Claude（QA system prompt）    ← 可视化，用户可看到
  ├── watch.sh qa（后台）: 通知 + inbox
  └── role-agent.sh qa（后台）: 自动处理消息 → 回复给 lead

消息流：
  Tech Lead 说"问 QA 状态"
    → lead-watch 写消息到 DB (from=lead, to=qa)
    → role-agent.sh 检测到新消息
    → 调用 claude -p 处理
    → 结果写回 DB (from=qa, to=lead)
    → lead-watch 检测到 QA 回复
    → 展示给 Tech Lead
```

---

## 需要修改的文件

### 1. `~/.claude/skills/team-lead/launch_team.py`

在 `make_tab_script()` 生成的 bash 脚本中，在启动交互式 Claude 之前，后台启动：
```bash
# 后台启动消息守护进程
bash ~/.claude/skills/team-lead/msg/watch.sh {role_id} {DB_PATH} &
WATCH_PID=$!

# 后台启动角色自治代理（处理来自其他角色的消息）
bash ~/.claude/skills/team-lead/role-agent.sh {role_id} {WORKDIR} {DB_PATH} &
AGENT_PID=$!

# 退出时清理子进程
trap "kill $WATCH_PID $AGENT_PID 2>/dev/null" EXIT
```

### 2. `~/.claude/skills/team-lead/launch_team.py` 中 Tech Lead 标签页逻辑

新增 Tech Lead 自身的标签页（或在现有代码中对 lead 角色额外启动 `lead-watch.sh`）：
```bash
bash ~/.claude/skills/team-lead/lead-watch.sh {WORKDIR} {DB_PATH} &
LEAD_WATCH_PID=$!
trap "kill $LEAD_WATCH_PID 2>/dev/null" EXIT
```

### 3. 新增 `~/.claude/skills/team-lead/launch-qa-only.py`（单独启动 QA）

用户刚才启动了单个 QA 窗口，需要一个支持单角色启动且自动加载消息代理的脚本：
```python
# 启动单个角色窗口，自动集成消息队列
# 参数：role_id, workdir
# 同时启动 watch.sh + role-agent.sh
```

---

## 实现步骤

### Step 1：修改 `launch_team.py` 的 `make_tab_script()`

在生成的 bash 脚本中，Claude 启动命令**之前**插入后台进程启动代码。

关键改动（约 +10 行）：
```python
# 在 {claude_cmd} 之前插入：
SKILL_DIR = os.path.join(os.path.expanduser("~"), ".claude", "skills", "team-lead")
bg_procs = f"""
# ── 启动消息守护进程 ────────────────────────────────────────────────────────
export TEAM_MSG_DB='{DB_PATH}'
bash '{SKILL_DIR}/msg/watch.sh' '{role_id}' '{DB_PATH}' &
WATCH_PID=$!
bash '{SKILL_DIR}/role-agent.sh' '{role_id}' '{WORKDIR}' '{DB_PATH}' &
AGENT_PID=$!
trap 'kill $WATCH_PID $AGENT_PID 2>/dev/null; exit' INT TERM EXIT
echo "  ✓ 消息代理已启动 (watch=$WATCH_PID, agent=$AGENT_PID)"
echo ""
"""
```

### Step 2：新建 `launch-single-role.py`

支持单独启动某角色窗口并集成消息队列，供 `launch_qa_only.py` 等场景复用。

### Step 3：初始化消息 DB

在 QA 窗口脚本里同时初始化 DB（如果不存在）：
```bash
mkdir -p "$(dirname $TEAM_MSG_DB)"
bash team-msg.sh init
```

---

## 验证方式

1. **启动测试**：运行 `launch_team.py` 或单角色脚本，观察标签页 banner 下出现 `✓ 消息代理已启动`
2. **发消息测试**：在 Tech Lead 窗口执行：
   ```bash
   bash ~/.claude/skills/team-lead/msg/team-msg.sh send lead qa "今天工作状态怎么样？"
   ```
3. **观察 QA 窗口**：应在 2 秒内看到消息通知 + claude -p 自动触发处理
4. **观察回复**：Tech Lead 窗口应收到 QA 的回复消息（通过 `tm recv lead`）
5. **端到端测试**：Tech Lead 交互式对话"问 QA 状态" → 自动触发 → QA 回复显示在 Tech Lead 侧

---

## 注意事项

- `role-agent.sh` 使用 `--dangerously-skip-permissions`，需要用户确认这是可接受的
- 每个标签页会多运行 2 个后台进程（watch + agent），关闭标签页时通过 trap 自动清理
- DB 路径统一为 `<WORKDIR>/specs/.messages.db`，确保各角色共享同一数据库
- fswatch 已在系统中可用（`/opt/homebrew/bin/fswatch`），watch.sh 目前用 sleep 轮询，可选升级为 fswatch 触发（更快响应，但非必须）
