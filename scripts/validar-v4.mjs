import fs from 'node:fs';

const arquivo = process.argv[2] || 'dados/v4/homem-casado-35-44.json';
const banco = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
const erros = [];
const avisos = [];
const codigos = ['PA','QT','RP','FS','TF'];
const letras = ['A','B','C','D','E'];

function falha(msg){ erros.push(msg); }
function aviso(msg){ avisos.push(msg); }
function contarPalavras(texto){
  return (texto.match(/[A-Za-zÀ-ÿ0-9'-]+/g) || []).length;
}

if (!Array.isArray(banco.cenarios) || banco.cenarios.length !== 20) {
  falha(`Esperados 20 cenários; encontrados ${banco.cenarios?.length ?? 0}.`);
}

const perspectivas = {};
const experiencias = {};
const letrasPorCodigo = Object.fromEntries(letras.map(l => [l, Object.fromEntries(codigos.map(c => [c,0]))]));
let especificosIdade = 0;

for (const c of banco.cenarios || []) {
  perspectivas[c.perspective] = (perspectivas[c.perspective] || 0) + 1;
  experiencias[c.experience_group] = (experiencias[c.experience_group] || 0) + 1;
  if (c.age_relevance === 'especifico_35_44') especificosIdade++;

  if (c.sexo !== 'masculino' || c.estado_civil !== 'casado' || c.faixa_etaria !== '35-44') {
    falha(`Cenário ${c.n}: perfil administrativo inconsistente.`);
  }
  if (!c.objective || !c.experience || !c.why_unique || !c.status_validacao) {
    falha(`Cenário ${c.n}: metadados administrativos incompletos.`);
  }
  if (c.permite_pular !== false) {
    falha(`Cenário ${c.n}: primeira escolha deve ser obrigatória.`);
  }
  if (!Array.isArray(c.alternativas) || c.alternativas.length !== 5) {
    falha(`Cenário ${c.n}: precisa conter cinco alternativas.`);
    continue;
  }

  const codigosItem = c.alternativas.map(a => a.codigo);
  const letrasItem = c.alternativas.map(a => a.letra);
  if (new Set(codigosItem).size !== 5 || !codigos.every(x => codigosItem.includes(x))) {
    falha(`Cenário ${c.n}: as cinco linguagens não aparecem exatamente uma vez.`);
  }
  if (new Set(letrasItem).size !== 5 || !letras.every(x => letrasItem.includes(x))) {
    falha(`Cenário ${c.n}: letras A–E inconsistentes.`);
  }

  const comprimentos = [];
  for (const a of c.alternativas) {
    if (letrasPorCodigo[a.letra]?.[a.codigo] !== undefined) letrasPorCodigo[a.letra][a.codigo]++;
    const n = contarPalavras(a.texto);
    comprimentos.push(n);
    if (n < 8 || n > 18) aviso(`Cenário ${c.n}${a.letra}: ${n} palavras (preferência 8–18).`);
  }
  if (Math.max(...comprimentos) - Math.min(...comprimentos) > 4) {
    aviso(`Cenário ${c.n}: diferença de comprimento entre alternativas maior que 4 palavras.`);
  }
}

const esperadoPerspectivas = {eu_recebo:9,resposta_espontanea:6,eu_recordo:3,eu_observo:2};
for (const [k,v] of Object.entries(esperadoPerspectivas)) {
  if ((perspectivas[k] || 0) !== v) falha(`Perspectiva ${k}: esperado ${v}, encontrado ${perspectivas[k] || 0}.`);
}

const esperadoExperiencias = {vulnerabilidade:7,rotina:5,celebracao:5,memoria_reconexao:3};
for (const [k,v] of Object.entries(esperadoExperiencias)) {
  if ((experiencias[k] || 0) !== v) falha(`Grupo emocional ${k}: esperado ${v}, encontrado ${experiencias[k] || 0}.`);
}

if (especificosIdade < 5 || especificosIdade > 7) {
  falha(`Cenários específicos de 35–44: esperado entre 5 e 7, encontrado ${especificosIdade}.`);
}

for (const letra of letras) {
  for (const codigo of codigos) {
    if (letrasPorCodigo[letra][codigo] !== 4) {
      falha(`Rotação: ${codigo} aparece ${letrasPorCodigo[letra][codigo]} vezes na letra ${letra}; esperado 4.`);
    }
  }
}

console.log('Arquivo:', arquivo);
console.log('Perspectivas:', perspectivas);
console.log('Experiências:', experiencias);
console.log('Específicos 35–44:', especificosIdade);
console.log('Rotação A–E:', letrasPorCodigo);
if (avisos.length) console.log('\nAVISOS\n- ' + avisos.join('\n- '));
if (erros.length) {
  console.error('\nFALHAS\n- ' + erros.join('\n- '));
  process.exit(1);
}
console.log('\nVALIDAÇÃO ESTRUTURAL APROVADA');
