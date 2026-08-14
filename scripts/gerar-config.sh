#!/bin/sh
# Gera o config.js na publicação a partir das variáveis do Netlify.
# Também ativa, sem afetar os demais perfis, o banco V4 piloto para
# Homem / Casado / 35–44 quando o arquivo de dados estiver disponível.
set -e
cat > config.js <<'INNER'
window.CONFIG = {
  SUPABASE_URL: "__SUPABASE_URL__",
  SUPABASE_KEY: "__SUPABASE_KEY__"
};

(function () {
  const V4_URL = '/dados/v4/homem-casado-35-44.json?v=4.0-c2';
  let v4 = null;
  let v4Erro = null;
  const fetchNativo = window.fetch.bind(window);

  const v4Promise = fetchNativo(V4_URL, { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error('V4 HTTP ' + r.status); return r.json(); })
    .then(d => { v4 = d; return d; })
    .catch(e => { v4Erro = e; console.error('Falha ao carregar V4:', e); return null; });

  // Marca corretamente no banco as respostas feitas com o piloto V4.
  window.fetch = async function(input, init) {
    try {
      if (init && init.method === 'POST' && typeof init.body === 'string') {
        const body = JSON.parse(init.body);
        if (body && body.instrumento_id === 'v4-homem-casado-35-44-c2') {
          body.versao_questionario = '4.0-c2';
          body.segmento = 'homem-casado-35-44';
          init = Object.assign({}, init, { body: JSON.stringify(body) });
        }
      }
    } catch (_) {}
    return fetchNativo(input, init);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('#btn-comecar');
    const idade = document.querySelector('#in-idade');
    const lead = document.querySelector('#tela-inicio .lead');
    const doc = document.querySelector('#tela-instrucoes .doc');

    if (lead) {
      lead.textContent = 'São 20 situações do dia a dia. Em cada uma, compare o que realmente teria mais peso para você naquele contexto. Leva aproximadamente 10 a 15 minutos.';
    }

    if (doc) {
      const p = doc.querySelector('p');
      if (p) p.innerHTML = '<strong style="color:var(--osso)">Todas as alternativas representam formas legítimas de demonstrar amor e cuidado.</strong> Mesmo que você já tenha uma hipótese sobre qual é a sua linguagem do amor, não tente confirmá-la nem manter um padrão entre as respostas. Considere cada situação isoladamente e escolha o que realmente representa você naquele contexto.';
    }

    if (!btn) return;

    let originalCenarios = null;
    let originalInstrumento = null;

    function perfilV4Selecionado() {
      return !!document.querySelector('[data-sexo="masculino"].sel') &&
             !!document.querySelector('[data-civil="casado"].sel') &&
             idade && idade.value === '35 a 44';
    }

    function converterCenarios(dados) {
      return dados.cenarios.map(c => ({
        n: c.n,
        titulo: c.title,
        situacao: c.situation,
        pergunta: c.question,
        alternativas: c.alternativas,
        permite_pular: !!c.permite_pular,
        perspectiva: c.perspective,
        instrucao_perspectiva: c.instrucao_perspectiva,
        objetivo_admin: c.objective,
        experiencia_admin: c.experience,
        singularidade_admin: c.why_unique,
        faixa_etaria_admin: c.age_relevance,
        vulnerabilidade_admin: c.vulnerability,
        status_validacao: c.status_validacao
      }));
    }

    btn.addEventListener('click', function (ev) {
      if (typeof BANCO === 'undefined') return;
      if (originalCenarios === null && BANCO.segmentos && BANCO.segmentos['homem-casado']) {
        originalCenarios = BANCO.segmentos['homem-casado'].cenarios;
        originalInstrumento = BANCO.instrumento_id;
      }

      if (perfilV4Selecionado()) {
        if (!v4) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          const erro = document.querySelector('#erro-inicio');
          if (erro) {
            erro.textContent = v4Erro ? 'Não foi possível carregar a versão atualizada. Recarregue a página.' : 'Preparando a versão atualizada do questionário. Aguarde um instante e tente novamente.';
            erro.classList.remove('oculto');
          }
          v4Promise.then(() => {});
          return;
        }
        BANCO.segmentos['homem-casado'].cenarios = converterCenarios(v4);
        BANCO.instrumento_id = v4.instrumento_id || 'v4-homem-casado-35-44-c2';
        document.body.classList.add('v4-ativo');
      } else if (originalCenarios) {
        BANCO.segmentos['homem-casado'].cenarios = originalCenarios;
        BANCO.instrumento_id = originalInstrumento;
        document.body.classList.remove('v4-ativo');
      }
    }, true);

    // Mantém a instrução de cada tela coerente com a perspectiva metodológica.
    const area = document.querySelector('#area-cenario');
    if (area) {
      const ajustarInstrucao = function () {
        try {
          if (!document.body.classList.contains('v4-ativo')) return;
          if (typeof estado === 'undefined' || typeof cenariosAtuais === 'undefined') return;
          const c = cenariosAtuais[estado.i];
          const e = estado.escolhas[estado.i];
          const etapa = area.querySelector('.etapa');
          if (!c || !e || !etapa) return;
          etapa.textContent = e.primeira
            ? 'Existe uma segunda alternativa que também representa bastante você? A segunda escolha é opcional.'
            : (c.instrucao_perspectiva || 'Considere apenas esta situação e escolha o que mais representa você nela.');
        } catch (_) {}
      };
      new MutationObserver(ajustarInstrucao).observe(area, { childList:true, subtree:true });
    }

    // As letras continuam registradas internamente, mas não ajudam o participante a criar padrões.
    const style = document.createElement('style');
    style.textContent = '.v4-ativo .opt .letra{display:none}.v4-ativo .opt{padding-left:17px}';
    document.head.appendChild(style);
  });
})();
INNER
# Substitui apenas os placeholders, preservando o JavaScript acima.
sed -i "s|__SUPABASE_URL__|${SUPABASE_URL}|g" config.js
sed -i "s|__SUPABASE_KEY__|${SUPABASE_KEY}|g" config.js
echo "config.js gerado com suporte ao piloto V4."
