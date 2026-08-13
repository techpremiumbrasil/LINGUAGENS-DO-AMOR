#!/bin/sh
# Gera o config.js na hora da publicação, a partir das variáveis de
# ambiente definidas no Netlify. Assim a chave nunca entra no repositório.
set -e
cat > config.js <<INNER
window.CONFIG = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}"
};
INNER
echo "config.js gerado."
