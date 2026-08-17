#!/bin/sh
# Gera o config.js a partir das variáveis de ambiente do Netlify.
# Mantém a V5.2 como base e injeta a camada de calibração empírica V5.3 A/B.
set -e

cat > config.js <<INNER
window.CONFIG = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}"
};
INNER

# Remove loaders antigos para impedir dupla execução.
sed -i '/v4-loader.js/d' index.html
sed -i '/v5-adaptive.js/d' index.html
sed -i '/v51-adaptive.js/d' index.html
sed -i '/v52-adaptive.js/d' index.html
sed -i '/v53-pre.js/d' index.html
sed -i '/v53-calibration.js/d' index.html

# A ordem é intencional: captura fetch nativo -> V5.2 estável -> calibração V5.3.
sed -i 's#</body>#<script src="/v53-pre.js?v=5.3-ab1"></script>\n<script src="/v52-adaptive.js?v=5.2-a1"></script>\n<script src="/v53-calibration.js?v=5.3-ab1"></script>\n</body>#' index.html

echo "config.js gerado; V5.2 base + calibração empírica V5.3 A/B injetadas."
