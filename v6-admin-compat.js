(function(global){
'use strict';
if(!global||!global.V6_CORE)return;
const V=global.V6_CORE,C=V.C,L=V.LABEL,VER=V.VER;
const liveCalc=calcular;
const legacyHtml=htmlResultado;

function legacyCalc(escolhas){
  escolhas=escolhas||[];const s1={},s2={};C.forEach(c=>{s1[c]=0;s2[c]=0;});let respondidos=0;
  escolhas.forEach(e=>{if(e&&e.primeira){if(s1[e.primeira]!=null)s1[e.primeira]++;respondidos++;}if(e&&e.segunda&&s2[e.segunda]!=null)s2[e.segunda]++;});
  const ordem=C.map(c=>({c,n:s1[c]})).sort((a,b)=>b.n-a.n);const topo=ordem.length?ordem.filter(x=>x.n===ordem[0].n).map(x=>x.c):[];let est='definido';
  if(respondidos<15)est='inconclusivo';else if(topo.length>1)est='empate';else if(ordem[0].n-ordem[1].n<2)est='distribuido';
  return {s1,s2,ordem,topo,principal:ordem[0]?.c||null,estado:est,respondidos};
}
function calcSavedV6(escolhas){
  let posterior=V.uniform(),respondidos=0;const s1={},s2={};C.forEach(c=>{s1[c]=0;s2[c]=0;});
  for(const e of escolhas||[]){if(!e||!e.primeira)continue;const f={id:e.scenario_id||e._v6Family||'',targets:e.alvo_adaptativo||[],socialRisk:'baixo',biasRisk:'baixo'};posterior=V.updatePosterior(posterior,f,e.primeira,1);s1[e.primeira]=(s1[e.primeira]||0)+1;respondidos++;if(e.segunda){posterior=V.updatePosterior(posterior,f,e.segunda,.22);s2[e.segunda]=(s2[e.segunda]||0)+1;}}
  const cls=V.classify(posterior,respondidos);return {s1,s2,ordem:cls.ordem.map(c=>({c,n:Math.round(cls.posterior[c]*1000)/10})),topo:cls.topo,principal:cls.principal,estado:cls.estado,respondidos,posterior:cls.posterior,gap:cls.gap};
}
calcular=function(escolhas){
  try{if(typeof estado!=='undefined'&&escolhas===estado.escolhas&&document.body.classList.contains('v6-active'))return liveCalc(escolhas);}catch(_){ }
  const arr=escolhas||[];if(arr.some(e=>e&&e.versao_motor===VER))return calcSavedV6(arr);return legacyCalc(arr);
};
function escV(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
htmlResultado=function(r,nome){
  if(!r||!r.posterior)return legacyHtml(r,nome);
  const rot={definido:'Sua linguagem mais provável',empate_probabilistico:'Duas linguagens praticamente empatadas',distribuido:'Perfil distribuído',inconclusivo:'Resultado inconclusivo'};
  let h='<div class="card"><div class="coroa"><div class="rotulo">'+(nome?escV(nome)+' · ':'')+(rot[r.estado]||rot.distribuido)+'</div>';
  if(r.estado==='inconclusivo'){h+='<div class="lingua" style="font-size:26px">Ainda não há evidência suficiente</div></div></div>';return h;}
  h+='<div class="lingua">'+r.topo.map(c=>escV(L[c])).join('<span style="color:var(--mut)"> + </span>')+'</div>';
  if(r.estado!=='definido')h+='<p class="mut" style="font-size:13.5px">As evidências ficaram próximas; a V6 não força um vencedor.</p>';
  h+='</div><div class="rank">';for(const x of r.ordem)h+='<div class="rank-item'+(r.topo[0]===x.c?' topo':'')+'"><span class="nm">'+escV(L[x.c])+'</span><span class="qt">'+Number(x.n).toFixed(1).replace('.',',')+'%</span></div>';h+='</div></div>';
  return h;
};
})(typeof window!=='undefined'?window:null);
