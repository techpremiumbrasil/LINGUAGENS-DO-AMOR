(function(){
  'use strict';
  const V4_URL='/dados/v4/homem-casado-35-44.json?v=4.0-c3';
  const V4_ID='v4-homem-casado-35-44-c3';
  const V4_VERSAO='4.0-c3';
  let dadosV4=null;
  let erroV4=null;
  let carregando=null;

  function perfilSelecionado(){
    const sexo=document.querySelector('[data-sexo="masculino"].sel');
    const civil=document.querySelector('[data-civil="casado"].sel');
    const idade=document.querySelector('#in-idade');
    return !!sexo && !!civil && !!idade && idade.value==='35 a 44';
  }

  function carregar(){
    if(dadosV4) return Promise.resolve(dadosV4);
    if(carregando) return carregando;
    carregando=window.fetch(V4_URL,{cache:'no-store'})
      .then(r=>{if(!r.ok) throw new Error('HTTP '+r.status); return r.json();})
      .then(d=>{dadosV4=d; erroV4=null; return d;})
      .catch(e=>{erroV4=e; console.error('Falha ao carregar V4',e); return null;});
    return carregando;
  }

  function converter(dados){
    return dados.cenarios.map(c=>({
      n:c.n,
      titulo:c.title,
      situacao:c.situation,
      pergunta:c.question,
      alternativas:c.alternativas,
      permite_pular:!!c.permite_pular,
      perspectiva:c.perspective,
      instrucao_perspectiva:c.instrucao_perspectiva,
      objetivo_admin:c.objective,
      experiencia_admin:c.experience,
      singularidade_admin:c.why_unique,
      faixa_etaria_admin:c.age_relevance,
      vulnerabilidade_admin:c.vulnerability,
      status_validacao:c.status_validacao
    }));
  }

  const original={
    cenarios:BANCO.segmentos['homem-casado'].cenarios,
    instrumento_id:BANCO.instrumento_id
  };

  function aplicarV4(){
    BANCO.segmentos['homem-casado'].cenarios=converter(dadosV4);
    BANCO.instrumento_id=V4_ID;
    document.body.classList.add('v4-ativo');
  }

  function restaurarV3(){
    BANCO.segmentos['homem-casado'].cenarios=original.cenarios;
    BANCO.instrumento_id=original.instrumento_id;
    document.body.classList.remove('v4-ativo');
  }

  const fetchOriginal=window.fetch.bind(window);
  window.fetch=function(input,init){
    try{
      if(init&&init.method==='POST'&&typeof init.body==='string'){
        const body=JSON.parse(init.body);
        if(body&&body.instrumento_id===V4_ID){
          body.versao_questionario=V4_VERSAO;
          body.segmento='homem-casado-35-44';
          init=Object.assign({},init,{body:JSON.stringify(body)});
        }
      }
    }catch(_){ }
    return fetchOriginal(input,init);
  };

  const btn=document.querySelector('#btn-comecar');
  const erro=document.querySelector('#erro-inicio');
  if(btn){
    btn.addEventListener('click',function(ev){
      if(!perfilSelecionado()){
        restaurarV3();
        return;
      }
      if(dadosV4){
        aplicarV4();
        return;
      }
      ev.preventDefault();
      ev.stopImmediatePropagation();
      btn.disabled=true;
      if(erro){
        erro.textContent='Carregando a versão atualizada do questionário…';
        erro.classList.remove('oculto');
      }
      carregar().then(d=>{
        btn.disabled=false;
        if(!d){
          if(erro) erro.textContent='Não foi possível carregar a versão atualizada. Recarregue a página e tente novamente.';
          return;
        }
        if(erro) erro.classList.add('oculto');
        aplicarV4();
        btn.click();
      });
    },true);
  }

  const lead=document.querySelector('#tela-inicio .lead');
  if(lead) lead.textContent='São 20 situações do dia a dia. Em cada uma, compare o que realmente teria mais peso para você naquele contexto. Leva aproximadamente 10 a 15 minutos.';
  const doc=document.querySelector('#tela-instrucoes .doc p');
  if(doc) doc.innerHTML='<strong style="color:var(--osso)">Todas as alternativas representam formas legítimas de demonstrar amor e cuidado.</strong> Mesmo que você já tenha uma hipótese sobre sua linguagem do amor, não tente confirmá-la nem manter um padrão entre as respostas. Considere cada situação isoladamente.';

  const style=document.createElement('style');
  style.textContent='.v4-ativo .opt .letra{display:none}.v4-ativo .opt{padding-left:17px}';
  document.head.appendChild(style);

  const area=document.querySelector('#area-cenario');
  if(area){
    new MutationObserver(function(){
      try{
        if(!document.body.classList.contains('v4-ativo')) return;
        const c=cenariosAtuais[estado.i];
        const e=estado.escolhas[estado.i];
        const etapa=area.querySelector('.etapa');
        if(!c||!e||!etapa) return;
        etapa.textContent=e.primeira
          ? 'Existe uma segunda alternativa que também representa bastante você? A segunda escolha é opcional.'
          : (c.instrucao_perspectiva||'Considere apenas esta situação e escolha o que mais representa você nela.');
      }catch(_){ }
    }).observe(area,{childList:true,subtree:true});
  }

  carregar();
})();
