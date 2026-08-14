#!/bin/sh
# Gera o config.js a partir das variáveis de ambiente do Netlify.
# Injeta o motor adaptativo V5 depois do aplicativo principal.
set -e

cat > config.js <<INNER
window.CONFIG = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}"
};
INNER

# Remove loaders experimentais antigos do artefato de build, se existirem.
sed -i '/v4-loader.js/d' index.html

if ! grep -q 'v5-adaptive.js' index.html; then
  sed -i 's#</body>#<script src="/v5-adaptive.js?v=5.0-a1"></script>\n</body>#' index.html
fi

echo "config.js gerado e motor adaptativo V5 injetado."
