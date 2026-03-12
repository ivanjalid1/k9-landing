#!/bin/bash
# ═══════════════════════════════════════════════════════
# K9 MOVEMENT — Deploy to Hostinger via SSH
# ═══════════════════════════════════════════════════════
#
# SETUP:
#   1. Go to Hostinger hPanel → Hosting → SSH Access
#   2. Enable SSH and copy your credentials
#   3. Fill in the variables below
#   4. Run: bash deploy.sh
#
# ═══════════════════════════════════════════════════════

# ─── YOUR HOSTINGER CREDENTIALS (edit these) ───
SSH_USER="u123456789"           # Your Hostinger SSH username
SSH_HOST="ssh.yourdomain.hstgr.io"  # Your SSH hostname
SSH_PORT=65002                  # Hostinger SSH port (usually 65002)
REMOTE_DIR="/home/$SSH_USER/public_html"

# ─── LOCAL ───
DIST_DIR="$(dirname "$0")/dist"

# ─── COLORS ───
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  K9 MOVEMENT — Deploying to Hostinger ${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# Check dist exists
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}ERROR: dist/ folder not found. Run 'npm run build' first.${NC}"
    exit 1
fi

# Check if scp is available
if ! command -v scp &> /dev/null; then
    echo -e "${RED}ERROR: scp not found. Install OpenSSH.${NC}"
    exit 1
fi

echo -e "${YELLOW}→ Uploading files to ${SSH_HOST}...${NC}"
echo ""

# Upload everything in dist/ to public_html
scp -P $SSH_PORT -r "$DIST_DIR"/.htaccess "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" && \
scp -P $SSH_PORT -r "$DIST_DIR"/index.html "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" && \
scp -P $SSH_PORT -r "$DIST_DIR"/k9logo.png "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" && \
scp -P $SSH_PORT -r "$DIST_DIR"/vite.svg "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" && \
scp -P $SSH_PORT -r "$DIST_DIR"/assets "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" && \
scp -P $SSH_PORT -r "$DIST_DIR"/api "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}  DEPLOY COMPLETE!                     ${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo ""
    echo -e "  Your site is live at:"
    echo -e "  ${GREEN}https://${SSH_HOST/ssh./}${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}ERROR: Upload failed. Check your SSH credentials.${NC}"
    exit 1
fi
