#!/bin/sh
# Gera config.js e prepara o artefato Netlify.
# V6 reutiliza o banco textual/metodológico V5.2 em modo SOMENTE DADOS.
set -e

cat > config.js <<INNER
window.CONFIG = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}"
};
INNER

# Gera uma cópia data-only do V5.2. O arquivo original permanece intacto
# para rollback e para validação metodológica.
sed 's/global.V52_DATA=DATA;/global.V52_DATA=DATA;if(global.__V6_DATA_ONLY__)return;/' v52-adaptive.js > v52-data-only.js

# Remove motores anteriores do HTML publicado.
sed -i '/v4-loader.js/d' index.html
sed -i '/v5-adaptive.js/d' index.html
sed -i '/v51-adaptive.js/d' index.html
sed -i '/v52-adaptive.js/d' index.html
sed -i '/v52-data-only.js/d' index.html
sed -i '/v6-inferencial.js/d' index.html
sed -i '/v6-hotfix.js/d' index.html
sed -i '/v6-admin-compat.js/d' index.html

# Carrega somente os dados V5.2 e, depois, o novo motor V6.
sed -i 's#</body>#<script>window.__V6_DATA_ONLY__=true;</script>\n<script src="/v52-data-only.js?v=6.0-inferencial-a1"></script>\n<script>window.__V6_DATA_ONLY__=false;</script>\n<script src="/v6-inferencial.js?v=6.0-inferencial-a1"></script>\n<script src="/v6-hotfix.js?v=6.0-inferencial-a1"></script>\n<script src="/v6-admin-compat.js?v=6.0-inferencial-a1"></script>\n</body>#' index.html

echo "config.js gerado e motor inferencial V6 injetado."
