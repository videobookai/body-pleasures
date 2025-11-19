#!/usr/bin/env zsh
# Create a dev admin user by calling the dev-only seed endpoint.
# Usage:
#   DEV_ADMIN_EMAIL=admin@local.test DEV_ADMIN_PASSWORD=Pa55w0rd ./scripts/seed-admin.sh
#   BASE_URL=https://dev.example.com ./scripts/seed-admin.sh --login

set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:3000}
SEED_PATH="/api/admin/seed-admin"
LOGIN_PATH="/api/auth/login"
COOKIE_JAR=".admin_cookies"

# Flags
DO_LOGIN=false
for arg in "$@"; do
  case "$arg" in
    --login) DO_LOGIN=true ;;
    -h|--help)
      echo "Usage: DEV_ADMIN_EMAIL=... DEV_ADMIN_PASSWORD=... BASE_URL=... $0 [--login]"
      exit 0
      ;;
  esac
done

echo "Calling seed endpoint: $BASE_URL$SEED_PATH"

# Call seed endpoint
RESPONSE=$(curl -sS -X POST "$BASE_URL$SEED_PATH" -H "Content-Type: application/json" || true)

if [[ -z "$RESPONSE" ]]; then
  echo "Empty response from server. Is $BASE_URL running?"
  exit 1
fi

# Print raw response
echo "Seed endpoint response:"
echo "$RESPONSE" | sed 's/^/  /'

# Try to parse JSON using jq if available
if command -v jq >/dev/null 2>&1; then
  STATUS=$(echo "$RESPONSE" | jq -r '.message // .error // empty')
  EMAIL=$(echo "$RESPONSE" | jq -r '.user.email // empty')
  PASSWORD=$(echo "$RESPONSE" | jq -r '.password // empty')
  ID=$(echo "$RESPONSE" | jq -r '.user.id // empty')

  echo
  if [[ -n "$STATUS" ]]; then
    echo "Status: $STATUS"
  fi
  if [[ -n "$EMAIL" ]]; then
    echo "Admin email: $EMAIL"
  fi
  if [[ -n "$PASSWORD" ]]; then
    echo "Admin password: $PASSWORD"
  fi
  if [[ -n "$ID" ]]; then
    echo "Admin user id: $ID"
  fi

  if $DO_LOGIN; then
    if [[ -z "$EMAIL" || -z "$PASSWORD" ]]; then
      echo "Cannot login: email or password missing from seed response"
      exit 1
    fi

    echo
    echo "Logging in as admin and saving cookies to $COOKIE_JAR..."
    curl -sS -c "$COOKIE_JAR" -X POST "$BASE_URL$LOGIN_PATH" \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" \
      | jq '.' || true

    echo "Cookies saved to $COOKIE_JAR"
    echo "You can now access admin pages in the browser using the cookie jar or use the cookie for curl requests with -b $COOKIE_JAR"
  fi
else
  echo "\nNote: 'jq' not found - install jq for nicer output and auto-login."
  echo "If you want to login, re-run with --login and jq installed, or login manually:" 
  echo "  curl -i -X POST $BASE_URL$LOGIN_PATH -H 'Content-Type: application/json' -d '{\"email\": \"<email>\", \"password\": \"<password>\"}' -c $COOKIE_JAR"
fi

echo "Done. Reminder: /api/admin/seed-admin is blocked in production (NODE_ENV=production)."