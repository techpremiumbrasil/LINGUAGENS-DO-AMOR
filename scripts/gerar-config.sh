#!/bin/sh
# Gera o config.js a partir das variáveis de ambiente do Netlify.
# Em seguida injeta o loader V4 no final do HTML, depois do aplicativo
# principal já ter sido carregado. Isso permite substituir o banco piloto
# no momento correto sem afetar os demais perfis.
set -e

cat > config.js <<INNER
window.CONFIG = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}"
};
INNER

if ! grep -q 'v4-loader.js' index.html; then
  sed -i 's#</body>#<script src="/v4-loader.js?v=4.0-c4"></script>\n</body>#' index.html
fi

echo "config.js gerado e loader V4 injetado."
