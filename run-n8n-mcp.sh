#!/usr/bin/env bash
set -euo pipefail

# Directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.mcp"

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing ${ENV_FILE}. Copy .env.mcp.example to .env.mcp and add your N8N_API_KEY."
  exit 1
fi

# shellcheck source=/dev/null
source "${ENV_FILE}"

: "${N8N_API_URL:?N8N_API_URL is required}"
: "${N8N_API_KEY:?N8N_API_KEY is required}"

# Find docker binary (handles cases where Docker Desktop CLI isn't on PATH)
DOCKER_BIN="$(command -v docker || true)"
if [ -z "${DOCKER_BIN}" ] && [ -x "/Applications/Docker.app/Contents/Resources/bin/docker" ]; then
  DOCKER_BIN="/Applications/Docker.app/Contents/Resources/bin/docker"
fi

if [ -z "${DOCKER_BIN}" ]; then
  echo "docker CLI not found. Start Docker Desktop and ensure the docker binary is available."
  exit 1
fi

exec "${DOCKER_BIN}" run -i --rm \
  --add-host=host.docker.internal:host-gateway \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -e N8N_API_URL="${N8N_API_URL}" \
  -e N8N_API_KEY="${N8N_API_KEY}" \
  ghcr.io/czlonkowski/n8n-mcp:latest
