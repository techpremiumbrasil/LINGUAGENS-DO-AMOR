#!/usr/bin/env node
'use strict';
const path=require('path');
const V52=require(path.join(__dirname,'..','v52-adaptive.js'));
const V6=require(path.join(__dirname,'..','v6-inferencial.js'));
const fail=[];
const ok=(cond,msg)=>{if(!cond)fail.push(msg);};

ok(V6.VER==='6.0-inferencial-a1','versão V6 inesperada');
ok(V52.profiles.length===48,'V5.2 deve continuar cobrindo 48 perfis');
ok(V6.MIN_Q===10&&V6.MAX_Q===24,'faixa adaptativa deve ser 10–24 perguntas');

const prior=V6.uniform();
for(const p of V52.profiles){
  const d=V52.buildProfileData(p.sexo,p.estadoCivil,p.faixaEtaria);
  ok(d&&d.families&&d.families.length>=30,'pool insuficiente: '+p.key);
  if(!d||!d.families)continue;
  for(const f of d.families){
    ok(f.options&&V6.C.every(c=>typeof f.options[c]==='string'&&f.options[c].trim()),'alternativas incompletas '+p.key+'/'+f.id);
    const ig=V6.informationGain(prior,f);
    ok(Number.isFinite(ig)&&ig>=0,'ganho de informação inválido '+p.key+'/'+f.id);
    const a=V6.empiricalAttraction(f.id);
    const sum=V6.C.reduce((s,c)=>s+a[c],0);
    ok(Math.abs(sum-1)<1e-8,'atratividade não normalizada '+f.id);
  }
  const eng={posterior:prior,history:[],challengeCount:0,lastChallenge:null};
  const q=V6.chooseFamily(eng,d.families,'auditoria|'+p.key);
  ok(q&&q.family&&q.mode==='explorar','primeira questão inválida '+p.key);
}

// Itens empiricamente muito enviesados devem carregar menos informação que
// itens equilibrados, em vez de empurrar a hipótese líder.
const demo=V52.buildProfileData('masculino','casado','35 a 44');
const byId=new Map(demo.families.map(f=>[f.id,f]));
const balanced=byId.get('esp_carinho_sem_data');
const biased=byId.get('alegria_conquista');
ok(balanced&&biased,'famílias de referência ausentes');
if(balanced&&biased)ok(V6.informationGain(prior,balanced)>V6.informationGain(prior,biased),'motor não está reduzindo influência do item enviesado alegria_conquista');

// Empate/resultado muito próximo nunca pode produzir principal artificial.
let c=V6.classify({PA:.30,QT:.30,RP:.15,FS:.13,TF:.12},20);
ok(c.principal===null&&c.estado==='empate_probabilistico','empate probabilístico escolheu vencedor artificial');
c=V6.classify({PA:.39,QT:.34,RP:.10,FS:.09,TF:.08},20);
ok(c.principal===null&&c.estado==='distribuido','diferença pequena escolheu vencedor artificial');

// O motor deve exigir contraprova/cobertura antes de encerrar cedo.
let e={posterior:{PA:.70,QT:.12,RP:.06,FS:.06,TF:.06},history:Array.from({length:10},(_,i)=>({perspective:i%2?'recebo':'espontanea',nature:'rotina',response:'PA'})),challengeCount:0,lastChallenge:null};
ok(!V6.shouldStop(e).stop,'motor encerrou sem contraprova/cobertura');

if(fail.length){console.error('\nV6 REPROVADA ('+fail.length+' falhas)');for(const x of fail)console.error(' - '+x);process.exit(1);}
console.log('V6 APROVADA');
console.log('48 perfis preservados; seleção probabilística, debias empírico, contraprova e empate sem vencedor validados.');
