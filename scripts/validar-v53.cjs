'use strict';
const base=require('../v52-adaptive.js');
const cal=require('../v53-calibration.js');
const errors=[];
const fail=m=>errors.push(m);
const expectedRebuild=new Set(['alegria_conquista','alegria_familia','vul_decisao_fase','priv_pessoa_distante','esp_sabado_normal','priv_pessoa_esquecida']);
const expectedReview=new Set(['rot_fimsemana','mem_conexao','mem_familia','vul_pessoa_frustracao','esp_reencontro','alegria_noticia','mem_transicao','priv_momento_passou']);
if(cal.version!=='5.3-ab1')fail('Versão da calibração inesperada.');
if(cal.baseVersion!=='5.2-a1')fail('Base da calibração não é V5.2-a1.');
if(cal.targetCount!==14)fail('A calibração deve atuar em exatamente 14 famílias.');
const same=(a,b)=>a.size===b.size&&[...a].every(x=>b.has(x));
if(!same(new Set(cal.reconstruir),expectedRebuild))fail('Lista RECONSTRUIR diverge da matriz empírica.');
if(!same(new Set(cal.revisar),expectedReview))fail('Lista REVISAR diverge da matriz empírica.');
if(!Array.isArray(base.profiles)||base.profiles.length!==48)fail('A V5.2 base deve continuar cobrindo 48 perfis.');
for(const p of base.profiles||[]){
  const d=base.buildProfileData(p.sexo,p.estadoCivil,p.faixaEtaria);
  const ids=new Set((d?.families||[]).map(f=>f.id));
  for(const id of [...expectedRebuild,...expectedReview])if(!ids.has(id))fail(`${p.key}: família de calibração ausente: ${id}`);
  if((d?.slots||[]).length!==20)fail(`${p.key}: perdeu as 20 etapas.`);
}
if(errors.length){console.error('FALHA V5.3:');errors.forEach(e=>console.error(' - '+e));process.exit(1);}
console.log('OK: V5.3 usa V5.2 como base, cobre 48 perfis e calibra somente as 14 famílias empíricas.');
