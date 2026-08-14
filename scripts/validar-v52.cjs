'use strict';
const data=require('../v52-adaptive.js');
const C=['PA','QT','RP','FS','TF'];
const expectedPerspective={recebo:9,espontanea:6,recordo:3,observo:2};
const expectedNature={privacao:6,vulnerabilidade:3,rotina:5,alegria:3,memoria:3};
const auditKeys=['realLife','humanSpeech','visualizable','fiveLanguagesFit','noMoralWinner','noObjectiveWinner','touchNatural','wordsHuman','serviceConcrete','timeConcrete','giftsThoughtful','oneMainIdea','addsInformation','perspectiveCorrect','natureCorrect','ageAdjusted','civilAdjusted','genderAdjusted'];
const banned=['oferecer proximidade física','manter contato acolhedor','nomear um esforço','preservar um momento','materializar o cuidado','demonstrar familiaridade','destacar um aspecto percebido','oferecer contato físico se fizer sentido','proximidade física','contato corporal','algo simbólico'];
const labels=['palavras de afirmação','qualidade de tempo','receber presentes','formas de servir','toque físico'];
const errors=[],warnings=[];
const fail=m=>errors.push(m),warn=m=>warnings.push(m);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const wc=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const countBy=(arr,key)=>arr.reduce((o,x)=>(o[x[key]]=(o[x[key]]||0)+1,o),{});
const rotate=(arr,k)=>arr.slice(k).concat(arr.slice(0,k));

if(data.version!=='5.2-a1')fail(`Versão inesperada: ${data.version}`);
if(data.baseInstrumentId!=='v5.2-adaptativo-universal-a1')fail(`Instrumento base inesperado: ${data.baseInstrumentId}`);
if(!Array.isArray(data.profiles)||data.profiles.length!==48)fail(`Cobertura: esperado 48 perfis, encontrado ${(data.profiles||[]).length}.`);
if(new Set((data.profiles||[]).map(p=>p.key)).size!==48)fail('Há chaves de perfil duplicadas.');

const expectedSegments=new Set(['mulher-solteira','mulher-casada','mulher-divorciada','mulher-viuva','homem-solteiro','homem-casado','homem-divorciado','homem-viuvo']);
for(const seg of expectedSegments){const n=(data.profiles||[]).filter(p=>p.segmento===seg).length;if(n!==6)fail(`Segmento ${seg}: esperado 6 faixas etárias, encontrado ${n}.`);}

for(const profile of data.profiles||[]){
  const d=data.buildProfileData(profile.sexo,profile.estadoCivil,profile.faixaEtaria);
  if(!d){fail(`${profile.key}: buildProfileData retornou vazio.`);continue;}
  if(d.profile.key!==profile.key)fail(`${profile.key}: chave reconstruída diverge.`);
  if(d.profile.segmento!==profile.segmento)fail(`${profile.key}: segmento reconstruído diverge.`);
  if(d.version!==data.version)fail(`${profile.key}: versão do perfil diverge.`);
  if(!String(d.instrumentId).includes(profile.key))fail(`${profile.key}: instrumentId não identifica o perfil.`);
  if(!Array.isArray(d.slots)||d.slots.length!==20)fail(`${profile.key}: precisa ter 20 missões.`);
  if(!Array.isArray(d.families)||d.families.length<20)fail(`${profile.key}: pool adaptativo insuficiente.`);

  const pc=countBy(d.slots||[],'perspective');
  for(const [k,v] of Object.entries(expectedPerspective))if(pc[k]!==v)fail(`${profile.key}: perspectiva ${k}: esperado ${v}, encontrado ${pc[k]||0}.`);
  const nc=countBy(d.slots||[],'nature');
  for(const [k,v] of Object.entries(expectedNature))if(nc[k]!==v)fail(`${profile.key}: natureza ${k}: esperado ${v}, encontrado ${nc[k]||0}.`);

  const ids=new Map();
  for(const f of d.families||[]){
    if(ids.has(f.id))fail(`${profile.key}: família duplicada ${f.id}.`);ids.set(f.id,f);
    if(f.status!=='aprovado')fail(`${profile.key}/${f.id}: status não aprovado.`);
    const optKeys=Object.keys(f.options||{}).sort();
    if(JSON.stringify(optKeys)!==JSON.stringify(C.slice().sort()))fail(`${profile.key}/${f.id}: não contém exatamente as cinco linguagens.`);
    for(const key of auditKeys)if(!f.audit||f.audit[key]!==true)fail(`${profile.key}/${f.id}: auditoria '${key}' não aprovada.`);
    if(f.ageBand!==profile.faixaEtaria)fail(`${profile.key}/${f.id}: ageBand incorreta.`);
    if(f.profileKey!==profile.key)fail(`${profile.key}/${f.id}: profileKey incorreta.`);
    if(!Array.isArray(f.targets)||f.targets.length<1||f.targets.some(x=>!C.includes(x)))fail(`${profile.key}/${f.id}: targets inválidos.`);
    if(!f.objective||!f.difference)fail(`${profile.key}/${f.id}: objetivo/diferença ausentes.`);
    if(!f.socialRisk||!f.biasRisk)fail(`${profile.key}/${f.id}: riscos administrativos ausentes.`);
    const publicText=[f.title,f.situation,f.question,...Object.values(f.options||{})].join(' '),nt=norm(publicText);
    for(const term of banned)if(nt.includes(norm(term)))fail(`${profile.key}/${f.id}: expressão artificial proibida: ${term}.`);
    for(const label of labels)if(nt.includes(norm(label)))fail(`${profile.key}/${f.id}: nome de linguagem exposto: ${label}.`);
    for(const [code,text] of Object.entries(f.options||{})){const words=wc(text);if(words<4||words>26)warn(`${profile.key}/${f.id}/${code}: ${words} palavras.`);}
    if(profile.estadoCivil!=='casado' && f.relation==='primary' && /\b(sua esposa|seu marido|casamento)\b/i.test(publicText))fail(`${profile.key}/${f.id}: referência conjugal vazou para perfil ${profile.estadoCivil}.`);
  }

  for(const slot of d.slots||[]){const f=ids.get(slot.representative);if(!f)fail(`${profile.key}/slot ${slot.n}: representante inexistente ${slot.representative}.`);else{if(f.perspective!==slot.perspective)fail(`${profile.key}/slot ${slot.n}: perspectiva incompatível.`);if(f.nature!==slot.nature)fail(`${profile.key}/slot ${slot.n}: natureza incompatível.`);}}

  const need={},have={};
  for(const s of d.slots||[]){const k=s.perspective+'|'+s.nature;need[k]=(need[k]||0)+1;}
  for(const f of d.families||[]){const k=f.perspective+'|'+f.nature;have[k]=(have[k]||0)+1;}
  for(const [k,n] of Object.entries(need))if((have[k]||0)<n)fail(`${profile.key}: pool ${k} precisa ${n}, tem ${have[k]||0}.`);

  const pos={};C.forEach(c=>pos[c]=[0,0,0,0,0]);
  for(const s of d.slots||[]){const order=rotate(C,(s.n-1)%5);order.forEach((code,i)=>pos[code][i]++);}
  for(const code of C)for(let i=0;i<5;i++)if(pos[code][i]!==4)fail(`${profile.key}: ${code} posição ${i+1}, esperado 4, encontrado ${pos[code][i]}.`);

  let longest=1,current=1;
  for(let i=1;i<d.slots.length;i++){if(d.slots[i].perspective===d.slots[i-1].perspective){current++;longest=Math.max(longest,current);}else current=1;}
  if(longest>2)fail(`${profile.key}: perspectivas excessivamente agrupadas (${longest}).`);

  const joined=norm(d.families.map(f=>f.situation+' '+f.question).join(' '));
  const ageTokens={'18 a 24':['estudo','primeiro trabalho','independencia'],'25 a 34':['carreira','vida financeira','responsabilidades'],'35 a 44':['trabalho','familia','compromissos'],'45 a 54':['carreira','prioridades','proximos anos'],'55 a 64':['mudancas de ritmo','saude','projetos'],'65 ou mais':['autonomia','saude','tempo']}[profile.faixaEtaria]||[];
  if(!ageTokens.some(t=>joined.includes(norm(t))))fail(`${profile.key}: adaptação etária não apareceu no texto gerado.`);
}

console.log('--- AUDITORIA V5.2 UNIVERSAL ---');
console.log('Versão:',data.version);
console.log('Perfis:',data.profiles.length);
console.log('Segmentos:',new Set(data.profiles.map(p=>p.segmento)).size);
console.log('Faixas etárias:',new Set(data.profiles.map(p=>p.faixaEtaria)).size);
console.log('Avisos:',warnings.length);
for(const w of warnings.slice(0,30))console.log('AVISO:',w);
if(warnings.length>30)console.log(`AVISO: +${warnings.length-30} omitidos.`);
if(errors.length){console.error(`\nFALHA: ${errors.length} erro(s) crítico(s):`);errors.forEach(e=>console.error(' -',e));process.exit(1);}
console.log('\nOK: V5.2 cobre e valida as 48 combinações.');