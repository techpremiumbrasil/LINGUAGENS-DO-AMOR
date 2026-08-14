'use strict';

const data=require('../v51-adaptive.js');
const C=['PA','QT','RP','FS','TF'];
const expectedPerspective={recebo:9,espontanea:6,recordo:3,observo:2};
const expectedNature={privacao:6,vulnerabilidade:3,rotina:5,alegria:3,memoria:3};
const auditKeys=[
  'realLife','humanSpeech','visualizable','fiveLanguagesFit','noMoralWinner',
  'noObjectiveWinner','touchNatural','wordsHuman','serviceConcrete','timeConcrete',
  'giftsThoughtful','oneMainIdea','addsInformation','perspectiveCorrect','natureCorrect'
];
const banned=[
  'oferecer proximidade física','manter contato acolhedor','nomear um esforço',
  'preservar um momento','materializar o cuidado','demonstrar familiaridade',
  'destacar um aspecto percebido','oferecer contato físico se fizer sentido',
  'proximidade física','contato corporal','algo simbólico'
];
const labels=[
  'palavras de afirmação','qualidade de tempo','receber presentes','formas de servir','toque físico'
];
const errors=[];
const warnings=[];
const fail=(m)=>errors.push(m);
const countBy=(arr,key)=>arr.reduce((o,x)=>(o[x[key]]=(o[x[key]]||0)+1,o),{});
const norm=(s)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const wc=(s)=>String(s||'').trim().split(/\s+/).filter(Boolean).length;

if(data.version!=='5.1-a1')fail(`Versão inesperada: ${data.version}`);
if(data.instrumentId!=='v5.1-adaptativo-homem-casado-35-44-a1')fail('instrumentId inesperado.');
if(!Array.isArray(data.slots)||data.slots.length!==20)fail('O plano precisa ter exatamente 20 posições.');
if(!Array.isArray(data.families)||data.families.length<20)fail('Pool adaptativo insuficiente.');

const pc=countBy(data.slots||[],'perspective');
for(const [k,v] of Object.entries(expectedPerspective))if(pc[k]!==v)fail(`Perspectiva ${k}: esperado ${v}, encontrado ${pc[k]||0}.`);
const nc=countBy(data.slots||[],'nature');
for(const [k,v] of Object.entries(expectedNature))if(nc[k]!==v)fail(`Natureza ${k}: esperado ${v}, encontrado ${nc[k]||0}.`);

const ids=new Map();
for(const f of data.families||[]){
  if(ids.has(f.id))fail(`ID de família duplicado: ${f.id}`);
  ids.set(f.id,f);
  if(f.status!=='aprovado')fail(`${f.id}: status não aprovado.`);
  const optKeys=Object.keys(f.options||{}).sort();
  if(JSON.stringify(optKeys)!==JSON.stringify(C.slice().sort()))fail(`${f.id}: precisa conter exatamente as cinco linguagens.`);
  for(const key of auditKeys)if(!f.audit||f.audit[key]!==true)fail(`${f.id}: auditoria crítica '${key}' não aprovada.`);
  const publicText=[f.title,f.situation,f.question,...Object.values(f.options||{})].join(' ');
  const ntext=norm(publicText);
  for(const term of banned)if(ntext.includes(norm(term)))fail(`${f.id}: expressão artificial/proibida encontrada: '${term}'.`);
  for(const label of labels)if(ntext.includes(norm(label)))fail(`${f.id}: nome de linguagem vazou para o participante: '${label}'.`);
  for(const [code,text] of Object.entries(f.options||{})){
    const words=wc(text);
    if(words<6||words>22)warnings.push(`${f.id}/${code}: ${words} palavras (preferência metodológica é aproximadamente 8–18).`);
  }
  if(!Array.isArray(f.targets)||f.targets.length<1||f.targets.some(x=>!C.includes(x)))fail(`${f.id}: alvos adaptativos inválidos.`);
  if(!f.objective||!f.difference)fail(`${f.id}: objetivo/diferença administrativa ausentes.`);
  if(!f.socialRisk||!f.biasRisk)fail(`${f.id}: riscos administrativos ausentes.`);
}

/* Cada posição precisa apontar para uma família compatível. */
for(const slot of data.slots||[]){
  const f=ids.get(slot.representative);
  if(!f)fail(`Slot ${slot.n}: família representativa '${slot.representative}' inexistente.`);
  else{
    if(f.perspective!==slot.perspective)fail(`Slot ${slot.n}: perspectiva da família representativa não confere.`);
    if(f.nature!==slot.nature)fail(`Slot ${slot.n}: natureza da família representativa não confere.`);
  }
}

/* O pool deve ter alternativas suficientes para cada missão, sem repetir por falta de opção. */
const need={};
for(const s of data.slots||[]){const k=s.perspective+'|'+s.nature;need[k]=(need[k]||0)+1;}
const have={};
for(const f of data.families||[]){const k=f.perspective+'|'+f.nature;have[k]=(have[k]||0)+1;}
for(const [k,n] of Object.entries(need))if((have[k]||0)<n)fail(`Pool ${k}: precisa de ${n} famílias e só tem ${have[k]||0}.`);

/* Balanceamento A–E. O deslocamento individual conserva esta propriedade. */
const pos={};C.forEach(c=>pos[c]=[0,0,0,0,0]);
function rotate(arr,k){return arr.slice(k).concat(arr.slice(0,k));}
for(const s of data.slots||[]){
  const order=rotate(C,(s.n-1)%5);
  order.forEach((code,i)=>pos[code][i]++);
}
for(const code of C)for(let i=0;i<5;i++)if(pos[code][i]!==4)fail(`${code} na posição ${i+1}: esperado 4, encontrado ${pos[code][i]}.`);

/* As quatro perspectivas devem permanecer intercaladas. */
let longest=1,current=1;
for(let i=1;i<(data.slots||[]).length;i++){
  if(data.slots[i].perspective===data.slots[i-1].perspective){current++;longest=Math.max(longest,current);}else current=1;
}
if(longest>2)fail(`Perspectivas pouco intercaladas: sequência máxima repetida = ${longest}.`);

/* Perfil piloto é o único explicitamente habilitado nesta versão. */
if(data.profile?.sexo!=='masculino'||data.profile?.estadoCivil!=='casado'||data.profile?.faixaEtaria!=='35 a 44')fail('Perfil piloto incorreto.');

console.log('--- AUDITORIA V5.1 ---');
console.log('Versão:',data.version);
console.log('Famílias adaptativas:',data.families.length);
console.log('Perspectivas:',JSON.stringify(pc));
console.log('Categorias emocionais:',JSON.stringify(nc));
console.log('Posições A–E:',JSON.stringify(pos));
console.log('Avisos de tamanho:',warnings.length);
for(const w of warnings.slice(0,20))console.log('AVISO:',w);
if(warnings.length>20)console.log(`AVISO: +${warnings.length-20} aviso(s) omitidos.`);

if(errors.length){
  console.error(`\nFALHA: ${errors.length} erro(s) crítico(s):`);
  errors.forEach(e=>console.error(' -',e));
  process.exit(1);
}
console.log('\nOK: V5.1 aprovada pela auditoria automática.');
