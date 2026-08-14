#!/bin/sh
# Gera o config.js a partir das variáveis de ambiente do Netlify.
# Injeta o motor adaptativo V5.1 depois do aplicativo principal.
set -e

cat > config.js <<INNER
window.CONFIG = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}"
};
INNER

# O artefato publicado deve carregar somente o motor atual.
sed -i '/v4-loader.js/d' index.html
sed -i '/v5-adaptive.js/d' index.html
sed -i '/v51-adaptive.js/d' index.html

sed -i 's#</body>#<script src="/v51-adaptive.js?v=5.1-a1"></script>\n</body>#' index.html

echo "config.js gerado e motor adaptativo V5.1 injetado."
