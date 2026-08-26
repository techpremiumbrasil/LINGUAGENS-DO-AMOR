(function(global){
'use strict';

const VER='6.0-inferencial-a1';
const INSTRUMENT_ID='v6-inferencial-a1';
const C=['PA','QT','RP','FS','TF'];
const LABEL={PA:'Palavras de Afirmação',QT:'Qualidade de Tempo',RP:'Receber Presentes',FS:'Formas de Servir',TF:'Toque Físico'};
const MIN_Q=10, MAX_Q=24;
const PERSPECTIVE_TARGET={recebo:.45,espontanea:.30,recordo:.15,observo:.10};
const NATURE_TARGET={privacao:.30,vulnerabilidade:.15,rotina:.25,alegria:.15,memoria:.15};

// Frequências empíricas V5.2 (267 participantes). São usadas SOMENTE para
// estimar atratividade basal de cada alternativa e reduzir evidência de itens
// enviesados. O resultado V5.2 não é tratado como ground truth.
const EMP={
 alegria_conquista:[111,19,8,13,18,169],alegria_familia:[131,36,8,23,26,224],alegria_noticia:[79,61,13,16,29,198],alegria_pessoa:[21,7,1,4,10,43],alegria_projeto:[58,50,19,27,13,167],
 esp_carinho_sem_data:[56,56,49,33,30,224],esp_pessoa_cansada:[14,51,25,30,23,143],esp_reencontro:[90,48,18,19,48,223],esp_sabado_normal:[29,108,41,18,15,211],
 mem_conexao:[26,85,14,26,38,189],mem_familia:[81,42,20,26,27,196],mem_fase_adulta:[54,55,30,33,31,203],mem_transicao:[80,53,10,50,20,213],
 obs_casal_afastado:[17,30,7,23,22,99],obs_casal_mais_velho:[36,36,31,11,30,144],obs_irmaos_adultos:[42,27,12,26,16,123],obs_vinculo_longo:[23,48,31,20,46,168],
 priv_desinteresse:[49,71,25,48,51,244],priv_forma_sumiu:[43,64,17,18,47,189],priv_momento_passou:[69,51,6,26,44,196],priv_pessoa_distante:[73,37,8,6,14,138],priv_pessoa_esquecida:[66,30,8,15,10,129],priv_rotina_apaga:[37,47,12,48,49,193],priv_vinculo_automatico:[37,85,17,48,59,246],
 rot_dia_normal:[25,22,13,11,18,89],rot_fimsemana:[15,40,4,18,10,87],rot_noite_comum:[22,29,7,10,23,91],
 vul_cansaco:[45,20,23,20,19,127],vul_decisao_fase:[121,30,19,24,16,210],vul_espera:[73,50,14,35,25,197],vul_pessoa_frustracao:[65,42,12,24,17,160],vul_pessoa_sobrecarga:[16,35,25,22,9,107]
};

function uniform(){return Object.fromEntries(C.map(c=>[c,1/C.length]));}
function normalize(o){let s=C.reduce((a,c)=>a+(Number(o[c])||0),0);if(!(s>0))return uniform();return Object.fromEntries(C.map(c=>[c,(Number(o[c])||0)/s]));}
function entropy(p){let h=0;for(const c of C){const x=p[c]||0;if(x>0)h-=x*Math.log2(x);}return h;}
function orderPosterior(p){return C.slice().sort((a,b)=>(p[b]||0)-(p[a]||0)||C.indexOf(a)-C.indexOf(b));}
function hash(s){let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}

function empiricalAttraction(familyId){
  const row=EMP[familyId];
  if(!row)return uniform();
  const n=row[5]||0, shrink=Math.min(.75,n/(n+100));
  const raw={};for(let i=0;i<5;i++)raw[C[i]]=(row[i]+3)/(n+15);
  return normalize(Object.fromEntries(C.map(c=>[c,.2+shrink*(raw[c]-.2)])));
}
function discrimination(family){
  const a=empiricalAttraction(family.id),mx=Math.max(...C.map(c=>a[c]));
  const bias=clamp((mx-.24)/.30,0,1);
  let d=3.9-1.8*bias;
  if((family.socialRisk||'baixo')!=='baixo')d-=.15;
  if((family.biasRisk||'baixo')!=='baixo')d-=.20;
  return clamp(d,1.8,4.0);
}
function responseDistribution(family,trueCode){
  const a=empiricalAttraction(family.id), d=discrimination(family);
  const targeted=(family.targets||[]).includes(trueCode);
  const boost=d*(targeted?1.15:.92);
  const w={};for(const r of C)w[r]=a[r]*(r===trueCode?boost:1);
  return normalize(w);
}
function likelihoodOfResponse(family,response,trueCode){return responseDistribution(family,trueCode)[response]||1e-9;}
function updatePosterior(prior,family,response,weight){
  weight=weight==null?1:Number(weight);
  const next={};for(const t of C)next[t]=(prior[t]||0)*Math.pow(likelihoodOfResponse(family,response,t),weight);
  return normalize(next);
}
function predictedResponse(prior,family){
  const out=Object.fromEntries(C.map(c=>[c,0]));
  for(const t of C){const d=responseDistribution(family,t);for(const r of C)out[r]+=(prior[t]||0)*d[r];}
  return normalize(out);
}
function informationGain(prior,family){
  const before=entropy(prior),pred=predictedResponse(prior,family);let after=0;
  for(const r of C){if(pred[r]<=0)continue;const post=updatePosterior(prior,family,r,1);after+=pred[r]*entropy(post);}
  return Math.max(0,before-after);
}
function pairDistance(family,a,b){
  if(!a||!b||a===b)return 0;const da=responseDistribution(family,a),db=responseDistribution(family,b);let s=0;
  for(const r of C)s+=Math.abs(da[r]-db[r]);return s/2;
}
function rawCounts(escolhas,upto){const s=Object.fromEntries(C.map(c=>[c,0]));for(let i=0;i<Math.min(escolhas.length,upto);i++){const e=escolhas[i];if(e&&e.primeira&&s[e.primeira]!=null)s[e.primeira]++;}return s;}
function tally(history,key){const o={};for(const h of history){const v=h[key];if(v)o[v]=(o[v]||0)+1;}return o;}
function quotaDeficit(counts,target,total,key){const want=(target[key]||0)*(total+1);return want-(counts[key]||0);}
function distinctSupport(history,leader){return new Set(history.filter(h=>h.response===leader).map(h=>h.perspective)).size;}

function adaptiveMode(engine){
  const q=engine.history.length,ord=orderPosterior(engine.posterior),a=ord[0],b=ord[1],gap=engine.posterior[a]-engine.posterior[b];
  if(q<5)return 'explorar';
  const since=engine.lastChallenge==null?99:q-engine.lastChallenge;
  if(engine.posterior[a]>=.34 && since>=3)return 'contraprovar';
  if(gap<.12)return 'diferenciar';
  if(distinctSupport(engine.history,a)<3)return 'cruzar';
  return 'confirmar';
}
function chooseFamily(engine,families,participantKey){
  const used=new Set(engine.history.map(h=>h.family));
  const candidates=families.filter(f=>!used.has(f.id));
  const pool=candidates.length?candidates:families;
  const q=engine.history.length,ord=orderPosterior(engine.posterior),leader=ord[0],runner=ord[1];
  const mode=adaptiveMode(engine),pc=tally(engine.history,'perspective'),nc=tally(engine.history,'nature');
  const prev=engine.history[q-1]||null;
  function score(f){
    const att=empiricalAttraction(f.id),maxAtt=Math.max(...C.map(c=>att[c]));
    let s=informationGain(engine.posterior,f)*100;
    s+=Math.max(0,quotaDeficit(pc,PERSPECTIVE_TARGET,q,f.perspective))*8;
    s+=Math.max(0,quotaDeficit(nc,NATURE_TARGET,q,f.nature))*6;
    const pd=pairDistance(f,leader,runner);s+=pd*12;
    const targets=f.targets||[],both=targets.includes(leader)&&targets.includes(runner);
    if(q>=5&&both)s+=5;
    if(mode==='diferenciar'){if(both)s+=9;else if(targets.includes(leader)||targets.includes(runner))s+=3;}
    if(mode==='contraprovar'){
      if(both)s+=8;else if(targets.includes(leader))s+=5;
      // Contraprova não pode usar uma questão que já favorece empiricamente a líder.
      s+=(0.30-att[leader])*35;
      if(att[leader]>.42)s-=14;
    }
    if(mode==='cruzar' && prev && f.perspective!==prev.perspective)s+=7;
    if(mode==='confirmar' && targets.includes(leader) && att[leader]<.38)s+=4;
    if(maxAtt>.50)s-=18*(maxAtt-.50)/.20;
    if(prev&&prev.perspective===f.perspective)s-=4;
    if(prev&&prev.nature===f.nature)s-=3;
    if(prev&&prev.relation===f.relation)s-=2;
    s+=(hash(participantKey+'|'+q+'|'+f.id)%1000)/100000;
    return s;
  }
  pool.sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id));
  return {family:pool[0],mode,score:pool.length?score(pool[0]):0,leader,runner};
}
function coverage(history){return {perspectives:new Set(history.map(h=>h.perspective)).size,natures:new Set(history.map(h=>h.nature)).size};}
function shouldStop(engine){
  const q=engine.history.length;if(q<MIN_Q)return {stop:false,reason:'minimo'};
  const ord=orderPosterior(engine.posterior),a=ord[0],b=ord[1],top=engine.posterior[a],gap=top-engine.posterior[b];
  const cov=coverage(engine.history),support=distinctSupport(engine.history,a),ch=engine.challengeCount||0;
  const covered=cov.perspectives>=3&&cov.natures>=4&&support>=3;
  if(covered&&ch>=1&&top>=.62&&gap>=.20)return {stop:true,reason:'evidencia_forte'};
  if(q>=14&&covered&&ch>=2&&top>=.56&&gap>=.16)return {stop:true,reason:'evidencia_consistente'};
  if(q>=18&&covered&&ch>=2&&top>=.51&&gap>=.12)return {stop:true,reason:'evidencia_suficiente'};
  if(q>=MAX_Q)return {stop:true,reason:'maximo'};
  return {stop:false,reason:'continuar'};
}
function classify(posterior,answered){
  const p=normalize(posterior),ord=orderPosterior(p),a=ord[0],b=ord[1],gap=p[a]-p[b];let state='definido',principal=a,topo=[a];
  if(answered<MIN_Q){state='inconclusivo';principal=null;topo=[];}
  else if(gap<.035){state='empate_probabilistico';principal=null;topo=[a,b];}
  else if(gap<.12 || p[a]<.50){state='distribuido';principal=null;topo=[a,b];}
  return {posterior:p,ordem:ord,principal,topo,estado:state,gap};
}
function rebuildFrom(escolhas,questions,upto){
  let posterior=uniform(),history=[],challengeCount=0,lastChallenge=null;
  for(let i=0;i<Math.min(upto,escolhas.length);i++){
    const e=escolhas[i],q=questions[i];if(!e||!e.primeira||!q||!q._v6)continue;
    const f=q._v6.familyObject;const before=posterior;posterior=updatePosterior(posterior,f,e.primeira,1);
    if(e.segunda)posterior=updatePosterior(posterior,f,e.segunda,.22);
    const h={index:i,family:f.id,perspective:f.perspective,nature:f.nature,relation:f.relation,response:e.primeira,second:e.segunda||null,mode:q._v6.mode,before,after:posterior};
    history.push(h);if(q._v6.mode==='contraprovar'){challengeCount++;lastChallenge=history.length-1;}
  }
  return {posterior,history,challengeCount,lastChallenge};
}

const CORE={VER,INSTRUMENT_ID,C,LABEL,EMP,MIN_Q,MAX_Q,PERSPECTIVE_TARGET,NATURE_TARGET,uniform,normalize,entropy,orderPosterior,empiricalAttraction,discrimination,responseDistribution,updatePosterior,predictedResponse,informationGain,pairDistance,adaptiveMode,chooseFamily,coverage,shouldStop,classify,rebuildFrom};
if(typeof module==='object'&&module.exports){module.exports=CORE;return;}
if(!global)return;
global.V6_CORE=CORE;

const DATA=global.V52_DATA;
if(!DATA){console.error('[V6] dados metodológicos V5.2 não carregados.');return;}
let activeData=null,originalInstrument=null;const originalBanks={};
function formAge(){const el=document.querySelector('#in-idade');return el?String(el.value||'').trim():'';}
function participantKey(){return String((estado.codigo||'')+'|'+(estado.nome||'')+'|'+(estado.contato||'')+'|'+(activeData?.profile?.key||''));}
function active(){try{return !!(activeData&&estado.sexo===activeData.profile.sexo&&estado.civil===activeData.profile.estadoCivil&&estado.idade===activeData.profile.faixaEtaria);}catch(_){return false;}}
function baseOrder(n){const off=hash(participantKey())%5;const k=((n-1)+off)%5;return C.slice(k).concat(C.slice(0,k));}
function optionMap(f,n){return baseOrder(n).map((code,i)=>({letra:String.fromCharCode(65+i),codigo:code,texto:f.options[code]}));}
function placeholder(f,n){return {n,titulo:f.title,situacao:f.situation,pergunta:f.question,alternativas:optionMap(f,n),permite_pular:false,_v6:null};}
function bootstrap(data){const F=data.families;return Array.from({length:MAX_Q},(_,i)=>placeholder(F[i%F.length],i+1));}
function activateFromForm(){
  try{
    const age=formAge();if(!estado.sexo||!estado.civil||!age)return;
    const data=DATA.buildProfileData(estado.sexo,estado.civil,age);if(!data)return;
    const slug=data.profile.segmento;if(!BANCO.segmentos[slug])return;
    if(!originalInstrument)originalInstrument=BANCO.instrumento_id;if(!originalBanks[slug])originalBanks[slug]=BANCO.segmentos[slug].cenarios;
    activeData=data;BANCO.segmentos[slug].cenarios=bootstrap(data);BANCO.instrumento_id=INSTRUMENT_ID;
    document.body.classList.add('v6-active');document.body.classList.remove('v52-active','v51-active');
  }catch(err){console.error('[V6] ativação:',err);}
}
try{document.querySelector('#btn-comecar')?.addEventListener('click',activateFromForm,true);}catch(err){console.error('[V6] captura:',err);}

function engineBefore(index){
  const rebuilt=rebuildFrom(estado.escolhas,cenariosAtuais,index);
  estado._v6=Object.assign(estado._v6||{},rebuilt,{highestIndex:Math.max((estado._v6&&estado._v6.highestIndex)||0,index)});
  return estado._v6;
}
function ensureQuestion(index){
  if(!active()||index<0||index>=MAX_Q)return;
  const e=estado.escolhas[index];if(e&&e._v6Family&&cenariosAtuais[index]?._v6)return;
  const eng=engineBefore(index),pick=chooseFamily(eng,activeData.families,participantKey());const f=pick.family;
  const before=JSON.parse(JSON.stringify(eng.posterior));
  cenariosAtuais[index]={n:index+1,titulo:f.title,situacao:f.situation,pergunta:f.question,alternativas:optionMap(f,index+1),permite_pular:false,_v6:{family:f.id,familyObject:f,mode:pick.mode,leaderBefore:pick.leader,runnerBefore:pick.runner,posteriorBefore:before,informationGain:informationGain(eng.posterior,f),empiricalAttraction:empiricalAttraction(f.id),discrimination:discrimination(f)}};
  Object.assign(e,{n:index+1,_v6Family:f.id,_v6Mode:pick.mode,_v6SecondMode:false,_v6SecondAnswered:false,_v6Profile:activeData.profile.key});
}
function truncateAfter(index){
  for(let j=index+1;j<estado.escolhas.length;j++){
    const e=estado.escolhas[j];if(e){e.primeira=null;e.segunda=null;e.pulado=false;delete e._v6Family;delete e._v6Mode;delete e._v6SecondMode;delete e._v6SecondAnswered;}
    if(activeData)cenariosAtuais[j]=placeholder(activeData.families[j%activeData.families.length],j+1);
  }
  if(estado._v6)estado._v6.highestIndex=index;
}
function progressValue(){
  const q=estado.i+1,eng=engineBefore(estado.i),ord=orderPosterior(eng.posterior),conf=eng.posterior[ord[0]]||.2;
  return clamp(.08+q/MAX_Q*.65+Math.max(0,conf-.2)*.34,.08,.94);
}

const st=document.createElement('style');st.textContent=`
.v6-active .opt .letra{display:none!important}.v6-second-box{margin:14px 0 2px;padding:14px;border:1px solid var(--linha);border-radius:11px;background:rgba(201,191,180,.035)}
.v6-second-box p{font-size:14px;color:var(--osso2);margin:0 0 10px;line-height:1.45}.v6-second-actions{display:flex;gap:8px;flex-wrap:wrap}.v6-second-actions .btn{width:auto;flex:1;min-width:150px;padding:11px 12px;font-size:13.5px}
.v6-active .opt:disabled{cursor:default}.v6-confidence{font-family:var(--mono);font-size:11px;color:var(--mut);margin-top:10px}.v6-rank-pct{font-family:var(--mono);font-weight:700}
`;document.head.appendChild(st);

renderCenario=function(){
  if(!active())return;
  ensureQuestion(estado.i);const i=estado.i,c=cenariosAtuais[i],e=estado.escolhas[i];const prog=progressValue();
  $('#contador').textContent='Pergunta '+String(i+1).padStart(2,'0');$('#preenche').style.width=(prog*100)+'%';$('#anel-ext').style.strokeDashoffset=119.4*(1-prog);$('#anel-int').style.strokeDashoffset=81.7*(1-Math.min(1,prog*1.15));
  let instr=(DATA.instructions&&DATA.instructions[c._v6.familyObject.perspective])||'Escolha a alternativa que mais representa você nesta situação.';
  if(e.primeira&&!e._v6SecondAnswered&&!e._v6SecondMode)instr='Sua primeira escolha foi registrada.';
  if(e._v6SecondMode)instr='Se outra atitude também combina bastante com você, marque agora a segunda escolha.';
  let h='<p class="cena-titulo">Situação '+String(i+1).padStart(2,'0')+' · '+esc(c.titulo)+'</p><p class="cena-situacao">'+esc(c.situacao)+'</p><p class="pergunta">'+esc(c.pergunta)+'</p><p class="etapa">'+instr+'</p><div class="opts" role="radiogroup">';
  c.alternativas.forEach(a=>{let cls='opt';if(e.primeira===a.codigo)cls+=' sel';else if(e.segunda===a.codigo)cls+=' seg';else if(e.primeira&&!e._v6SecondMode)cls+=' apagado';const disabled=e.primeira&&!e._v6SecondMode&&e.primeira!==a.codigo;h+='<button type="button" class="'+cls+'" data-c="'+a.codigo+'" '+(disabled?'disabled ':'')+'role="radio"><span class="letra">'+a.letra+'</span><span class="marca-opt"></span><span>'+esc(a.texto)+'</span></button>';});h+='</div>';
  if(e.primeira&&!e._v6SecondAnswered&&!e._v6SecondMode)h+='<div class="v6-second-box"><p><strong>Tem uma segunda alternativa que também combina bastante com você?</strong></p><div class="v6-second-actions"><button type="button" class="btn ghost" id="v6-sim">Sim, escolher uma segunda</button><button type="button" class="btn" id="v6-nao">Não, avançar</button></div></div>';
  else if(e._v6SecondMode)h+='<div class="v6-second-box"><p>A segunda escolha é opcional e tem peso menor na investigação.</p></div>';
  else if(e._v6SecondAnswered)h+='<div class="v6-second-box"><p>'+(e.segunda?'Primeira e segunda escolhas registradas.':'Sua primeira escolha foi registrada.')+'</p></div>';
  const area=$('#area-cenario');area.innerHTML=h;area.classList.remove('fade');void area.offsetWidth;area.classList.add('fade');
  area.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{const code=b.dataset.c;if(!e.primeira){e.primeira=code;e.pulado=false;e._v6SecondAnswered=false;e._v6SecondMode=false;}else if(e._v6SecondMode){if(code!==e.primeira)e.segunda=e.segunda===code?null:code;}else if(code===e.primeira){e.primeira=null;e.segunda=null;e._v6SecondAnswered=false;}renderCenario();}));
  $('#v6-sim')?.addEventListener('click',()=>{e._v6SecondMode=true;e._v6SecondAnswered=false;renderCenario();});
  $('#v6-nao')?.addEventListener('click',()=>{e.segunda=null;e._v6SecondMode=false;e._v6SecondAnswered=true;avancar();});
  $('#btn-avancar').disabled=!e.primeira||(!e._v6SecondAnswered&&!e._v6SecondMode)|| (e._v6SecondMode&&!e.segunda);
  $('#btn-avancar').textContent=e._v6SecondMode?'Registrar segunda escolha':'Avançar';$('#btn-voltar').style.visibility=i===0?'hidden':'visible';$('#area-pular').innerHTML='';
};

avancar=function(){
  if(!active())return;const e=estado.escolhas[estado.i];if(!e.primeira)return;
  if(e._v6SecondMode&&e.segunda){e._v6SecondMode=false;e._v6SecondAnswered=true;}
  if(!e._v6SecondAnswered)return renderCenario();
  truncateAfter(estado.i);const rebuilt=rebuildFrom(estado.escolhas,cenariosAtuais,estado.i+1);estado._v6=Object.assign(estado._v6||{},rebuilt,{highestIndex:estado.i});const stop=shouldStop(estado._v6);estado._v6.stop=stop;
  if(stop.stop||estado.i>=MAX_Q-1){finalizar();return;}estado.i++;ensureQuestion(estado.i);renderCenario();
};
try{$('#btn-avancar').onclick=null;}catch(_){ }
// O listener original chama a referência global `avancar`, que agora aponta para V6.

try{$('#btn-voltar').addEventListener('click',()=>{},true);}catch(_){ }

calcular=function(escolhas){
  const answered=escolhas.filter(e=>e&&e.primeira).length;const eng=rebuildFrom(escolhas,cenariosAtuais,answered);const cls=classify(eng.posterior,answered);const s1=rawCounts(escolhas,answered),s2=Object.fromEntries(C.map(c=>[c,0]));for(let i=0;i<answered;i++){const e=escolhas[i];if(e&&e.segunda)s2[e.segunda]++;}
  return {s1,s2,ordem:cls.ordem.map(c=>({c,n:Math.round(cls.posterior[c]*1000)/10})),topo:cls.topo,principal:cls.principal,estado:cls.estado,respondidos:answered,posterior:cls.posterior,gap:cls.gap,engine:eng};
};

function resultHtml(r,nome){
  const ROT={definido:'Sua linguagem mais provável',empate_probabilistico:'Duas linguagens praticamente empatadas',distribuido:'Perfil distribuído',inconclusivo:'Resultado inconclusivo'};
  let h='<div class="card"><div class="coroa"><div class="rotulo">'+(nome?esc(nome)+' · ':'')+(ROT[r.estado]||ROT.distribuido)+'</div>';
  if(r.estado==='inconclusivo'){h+='<div class="lingua" style="font-size:26px">Ainda não há evidência suficiente</div></div></div>';return h;}
  h+='<div class="lingua">'+r.topo.map(c=>LABEL[c]).join('<span style="color:var(--mut)"> + </span>')+'</div>';
  if(r.estado!=='definido')h+='<p class="mut" style="font-size:13.5px">As evidências ficaram muito próximas. O instrumento não força uma vencedora quando a diferença é pequena.</p>';
  h+='</div><div class="rank">';for(const x of r.ordem){h+='<div class="rank-item'+(r.topo[0]===x.c?' topo':'')+'"><span class="nm">'+LABEL[x.c]+'</span><span class="qt v6-rank-pct">'+x.n.toFixed(1).replace('.',',')+'%</span></div>';}
  h+='</div><div class="v6-confidence">'+r.respondidos+' perguntas · motor inferencial adaptativo · versão '+VER+'</div></div>';
  const lead=r.ordem[0]?.c;if(lead&&typeof TEXTO!=='undefined'&&TEXTO[lead]){const t=TEXTO[lead];h+='<div class="card" style="margin-top:14px"><div class="bloco"><h3>O que isso indica</h3><p class="lead">'+t.d+'</p><p class="lead" style="font-size:15px;margin-top:10px">'+t.r+'</p></div></div>';}
  h+='<p class="mut" style="font-size:12px;margin-top:16px;line-height:1.5">As porcentagens representam força relativa das evidências dentro deste instrumento. Não são probabilidade clínica nem diagnóstico psicológico.</p>';return h;
}

escolhasDetalhadas=function(){
  const answered=estado.escolhas.filter(e=>e&&e.primeira).length;return estado.escolhas.slice(0,answered).map((e,i)=>{const c=cenariosAtuais[i],f=c._v6?.familyObject;const alt=code=>{const a=(c.alternativas||[]).find(x=>x.codigo===code);return a?{letra:a.letra,codigo:a.codigo,texto:a.texto}:null;};return {n:i+1,titulo:c.titulo,situacao:c.situacao,pergunta:c.pergunta,alternativas_exibidas:c.alternativas.map(a=>({letra:a.letra,codigo:a.codigo,texto:a.texto})),primeira:e.primeira,primeira_texto:alt(e.primeira),segunda:e.segunda||null,segunda_texto:e.segunda?alt(e.segunda):null,pulado:false,scenario_id:f?.id||null,perfil:activeData?.profile?.key||null,perspectiva:f?.perspective||null,natureza:f?.nature||null,funcao_adaptativa:c._v6?.mode||null,hipotese_antes:c._v6?.posteriorBefore||null,ganho_informacao_estimado:c._v6?.informationGain||null,atratividade_empirica:c._v6?.empiricalAttraction||null,discriminacao:c._v6?.discrimination||null,alvo_adaptativo:f?.targets||[],relacao:f?.relation||null,versao_motor:VER};});
};

finalizar=async function(){
  const r=calcular(estado.escolhas);const stop=estado._v6?.stop||shouldStop(r.engine);const reg={codigo:estado.codigo,nome:estado.nome,contato:estado.contato,sexo:estado.sexo,estado_civil:estado.civil,faixa_etaria:estado.idade,segmento:estado.segmento,consentimento_em:estado.consentimentoEm,escolhas:escolhasDetalhadas(),instrumento_id:INSTRUMENT_ID,scores1:r.s1,scores2:r.s2,ordem:r.ordem.map(x=>x.c),principal:r.principal,estado:r.estado,respondidos:r.respondidos,tempo:Math.round((Date.now()-estado.inicio)/1000),probabilidades:r.posterior,motor_meta:{versao:VER,stop_reason:stop.reason,questions:r.respondidos,gap:r.gap,challenge_count:r.engine.challengeCount,coverage:coverage(r.engine.history),posterior:r.posterior}};
  let h='<div class="marca"><img src="'+LOGO+'" alt=""><div class="nome">Crer+Ser em Cristo</div></div><div class="regua"></div>'+resultHtml(r,estado.nome)+'<div id="status-salvo" style="margin-top:14px"></div><p class="mono mut" style="font-size:11px;margin-top:14px">Código do participante: '+esc(estado.codigo)+'</p><div class="btn-row" style="margin-top:14px"><button class="btn ghost" onclick="window.print()">Salvar em PDF</button><button class="btn" id="btn-novo">Nova resposta</button></div><p class="rodape">Pesquisa de autoconhecimento relacional · versão 6.0</p>';
  telas.resultado.innerHTML=h;mostrar('resultado');$('#btn-novo').addEventListener('click',()=>{$('#in-nome').value='';$('#in-contato').value='';$('#in-consent').checked=false;$('#in-idade').value='';telas.inicio.querySelectorAll('.opt').forEach(x=>{x.classList.remove('sel');x.setAttribute('aria-checked','false');});estado.sexo='';estado.civil='';estado._v6=null;mostrar('inicio');});
  estado._v6Final=reg.motor_meta;enviar(reg,$('#status-salvo'),1);
};

const originalFetch=global.fetch;if(originalFetch){global.fetch=async function(input,init){if(active()&&init&&typeof init.body==='string'&&String(input).includes('linguagem_amor_v3')){try{const body=JSON.parse(init.body),rows=Array.isArray(body)?body:[body];rows.forEach(r=>{if(r&&typeof r==='object'){r.versao_questionario=VER;r.instrumento_id=INSTRUMENT_ID;r.probabilidades=estado._v6Final?.posterior||null;r.motor_meta=estado._v6Final||null;}});init=Object.assign({},init,{body:JSON.stringify(Array.isArray(body)?rows:rows[0])});}catch(_){ }}return originalFetch.call(this,input,init);};}

try{document.querySelectorAll('.eyebrow,.rodape').forEach(el=>{el.textContent=(el.textContent||'').replace(/versão\s*[0-9.]+/i,'versão 6.0');});}catch(_){ }
console.info('[V6] motor inferencial adaptativo carregado',VER);
})(typeof window!=='undefined'?window:null);
