#!/bin/bash
# AI 团队并行启动脚本
# 用法：./launch-team.sh [工作目录]

WORKDIR="${1:-$PWD}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}🚀 AI Dev Team Starting...${NC}"
echo -e "${CYAN}WORKDIR: ${WORKDIR}${NC}"
echo ""

python3 "$SCRIPT_DIR/launch_team.py" "$WORKDIR"

echo ""
echo -e "${GREEN}✅ Team ready!${NC}"
echo -e "${YELLOW}💡 Share context via: ${WORKDIR}/specs/${NC}"
