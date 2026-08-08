#!/usr/bin/env bash
set -e

# Domain can be passed as argument $1, defaulting to demo.seloraos.online
DOMAIN="${1:-demo.seloraos.online}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo " Starting Setup for CRM Project"
echo " Domain: ${DOMAIN}"
echo " Directory: ${PROJECT_DIR}"
echo "=========================================="

# 1. Update system & install required tools
echo "[1/6] Updating packages & installing system dependencies..."
sudo apt-get update -y
sudo apt-get install -y curl git build-essential caddy

# 2. Check Node.js and PM2
echo "[2/6] Checking Node.js and PM2..."
if ! command -v node &> /dev/null; then
  echo "Installing Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  sudo npm install -g pm2
fi

echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"
echo "PM2 version:  $(pm2 -v)"

# 3. Setup Server Backend
echo "[3/6] Setting up Server Backend..."
cd "${PROJECT_DIR}/server"

# Ensure .env file exists in server directory
if [ ! -f .env ]; then
  echo "Creating server/.env file..."
  cat <<'EOF' > .env
DB_HOST=187.127.167.177
DB_PORT=3306
DB_USER=riaan
DB_PASS=helliswell@6226
DB_NAME=crm_dev
JWT_SECRET=supersecretjwtkey_replace_me_in_prod
PORT=5000
EOF
else
  echo "server/.env already exists, checking PORT configuration..."
  if ! grep -q "^PORT=" .env; then
    echo "PORT=5000" >> .env
  fi
  if ! grep -q "^JWT_SECRET=" .env; then
    echo "JWT_SECRET=supersecretjwtkey_replace_me_in_prod" >> .env
  fi
fi

echo "Installing server dependencies..."
npm install

echo "Starting/restarting backend server with PM2..."
if pm2 describe crm-server > /dev/null 2>&1; then
  pm2 restart crm-server
else
  pm2 start server.js --name "crm-server"
fi
pm2 save

# 4. Setup Client Frontend
echo "[4/6] Setting up Client Frontend..."
cd "${PROJECT_DIR}/client"

# Create/update client/.env
cat <<EOF > .env
VITE_API_URL=https://${DOMAIN}
PORT=5173
EOF

echo "Installing client dependencies..."
npm install

echo "Building frontend client..."
npm run build

# 5. Configure Caddy Web Server
echo "[5/6] Configuring Caddy for ${DOMAIN}..."

# Create Caddyfile configuration
sudo mkdir -p /etc/caddy
sudo cat <<EOF > /etc/caddy/Caddyfile
${DOMAIN} {
  root * ${PROJECT_DIR}/client/dist
  encode gzip zstd

  # Serve SPA frontend assets with fallback to index.html
  try_files {path} /index.html
  file_server

  # Reverse proxy API requests to Node server
  @api path /api/*
  reverse_proxy @api localhost:5000

  # Reverse proxy WebSocket requests to Node server
  @sockets path /socket.io/*
  reverse_proxy @sockets localhost:5000
}
EOF

echo "Testing and reloading Caddy..."
sudo systemctl enable caddy
sudo systemctl restart caddy

# 6. Verification
echo "[6/6] Verifying setup..."
sleep 2

echo "--- PM2 Status ---"
pm2 status

echo "--- Caddy Status ---"
sudo systemctl status caddy --no-pager | head -n 15

echo "=========================================="
echo " Setup complete!"
echo " Your application is live at: https://${DOMAIN}"
echo "=========================================="
