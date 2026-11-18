#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"

echo "=== Running 12 Bad Requests against $BASE_URL/orders ==="
for file in starter/bad-requests/*.json; do
  name=$(basename "$file")
  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/orders" \
    -H "Content-Type: application/json" \
    -d @"$file")
  code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  echo "$name -> $code"
  echo "  Body: $body"
done

echo ""
echo "=== Testing Invalid Status Transition (409) ==="
curl -s -w "\nHTTP Status: %{http_code}\n" -X PATCH "$BASE_URL/orders/ord-delivered/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELLED"}'

echo ""
echo "=== Testing Forced TypeError (500, no stack trace) ==="
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/orders/debug/force-type-error"
