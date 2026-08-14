#!/bin/sh
# Gera o config.js a partir das variáveis de ambiente do Netlify.
# Injeta o motor adaptativo universal V5.2 depois do aplicativo principal.
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
sed -i '/v52-adaptive.js/d' index.html

sed -i 's#</body>#<script src="/v52-adaptive.js?v=5.2-a1"></script>\n</body>#' index.html

echo "config.js gerado e motor adaptativo universal V5.2 injetado."
