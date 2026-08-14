(function(global){
'use strict';

const VER='5.2-a1';
const BASE_ID='v5.2-adaptativo-universal-a1';
const C=['PA','QT','RP','FS','TF'];
const L={PA:'Palavras de Afirmação',QT:'Qualidade de Tempo',RP:'Receber Presentes',FS:'Formas de Servir',TF:'Toque Físico'};
const PL={recebo:'Eu Recebo',espontanea:'Resposta Espontânea',recordo:'Eu Recordo',observo:'Eu Observo'};
const NL={privacao:'Privação / dor afetiva',vulnerabilidade:'Vulnerabilidade circunstancial',rotina:'Rotina / cotidiano',alegria:'Alegria / conquista',memoria:'Memória / reconexão / observação neutra'};
const INST={
  recebo:'Escolha a alternativa que teria maior peso emocional para você nessa situação.',
  espontanea:'Escolha a atitude que surgiria primeiro em você como forma de cuidado.',
  recordo:'Escolha aquilo que tende a permanecer mais vivo na sua memória.',
  observo:'Escolha a atitude que lhe pareceria mais significativa como expressão de amor nessa situação.'
};

const SEXES=['feminino','masculino'];
const CIVILS=['solteiro','casado','divorciado','viuvo'];
const AGES=['18 a 24','25 a 34','35 a 44','45 a 54','55 a 64','65 ou mais'];
const SEGMENT_SLUG={
  'feminino|solteiro':'mulher-solteira','feminino|casado':'mulher-casada','feminino|divorciado':'mulher-divorciada','feminino|viuvo':'mulher-viuva',
  'masculino|solteiro':'homem-solteiro','masculino|casado':'homem-casado','masculino|divorciado':'homem-divorciado','masculino|viuvo':'homem-viuvo'
};

const AGE_PACK={
  '18 a 24':{
    slug:'18-24',tone:'jovem-adulto-direto',stage:'começo da vida adulta',
    load:'estudo, primeiro trabalho, escolhas de carreira, independência e mudanças rápidas de rotina',
    decision:'faculdade, estágio, primeiro emprego, mudança de área ou outro passo importante',
    achievement:'uma aprovação, uma oportunidade, a conclusão de uma etapa de estudo ou um avanço em um projeto',
    transition:'começar faculdade, estágio, emprego, morar em outro lugar ou assumir uma nova responsabilidade',
    project:'um curso, treino, projeto criativo, negócio pequeno ou ideia pessoal',
    routine:'uma fase em que estudo, trabalho e vida pessoal disputam sua atenção'
  },
  '25 a 34':{
    slug:'25-34',tone:'adulto-direto',stage:'fase de construção da vida adulta',
    load:'carreira, vida financeira, casa, relacionamentos, estudos e projetos que começam a ganhar peso',
    decision:'troca de emprego, crescimento profissional, mudança de cidade, negócio ou outra decisão de rumo',
    achievement:'uma promoção, uma certificação, um projeto concluído ou uma meta pessoal importante',
    transition:'mudar de trabalho, casa, cidade, rotina ou assumir uma responsabilidade maior',
    project:'um curso, negócio, atividade física, especialização ou projeto pessoal',
    routine:'uma fase em que trabalho, vida pessoal e responsabilidades práticas ocupam boa parte do dia'
  },
  '35 a 44':{
    slug:'35-44',tone:'adulto-direto',stage:'fase de consolidação e múltiplas responsabilidades',
    load:'trabalho, família, compromissos financeiros, casa e projetos de longo prazo',
    decision:'mudança profissional, novo negócio, especialização, mudança de cidade ou outro passo de longo prazo',
    achievement:'um reconhecimento profissional, um projeto concluído ou uma meta construída ao longo de meses',
    transition:'mudar de trabalho, casa, ritmo profissional ou assumir uma nova responsabilidade importante',
    project:'um curso, negócio, atividade física ou projeto pessoal que vinha sendo adiado',
    routine:'uma fase em que trabalho, família e compromissos deixam pouco espaço livre'
  },
  '45 a 54':{
    slug:'45-54',tone:'adulto-maduro-direto',stage:'fase adulta de experiência e reavaliação de prioridades',
    load:'carreira, família, finanças, pessoas próximas e decisões sobre os próximos anos',
    decision:'mudança de função, novo projeto, reorientação profissional, mudança de rotina ou outro passo relevante',
    achievement:'um reconhecimento, a conclusão de um projeto importante ou uma meta pessoal de longa duração',
    transition:'mudar de função, ritmo de trabalho, casa, cidade ou reorganizar uma responsabilidade importante',
    project:'um curso, projeto, atividade física, negócio ou interesse pessoal que ganhou espaço agora',
    routine:'uma fase em que responsabilidades já conhecidas convivem com novas prioridades'
  },
  '55 a 64':{
    slug:'55-64',tone:'maduro-direto',stage:'fase de transições e novos ritmos',
    load:'trabalho, família, saúde, finanças, mudanças de ritmo e projetos pessoais',
    decision:'reduzir ou mudar o ritmo profissional, iniciar um projeto, reorganizar a vida financeira ou fazer outra mudança importante',
    achievement:'uma conquista profissional ou pessoal, um projeto concluído ou um passo esperado há bastante tempo',
    transition:'mudar o ritmo de trabalho, reorganizar a casa, iniciar uma nova atividade ou assumir uma responsabilidade diferente',
    project:'um projeto, curso, viagem planejada, atividade física ou interesse pessoal',
    routine:'uma fase em que o ritmo da vida começa a ser reorganizado por novas prioridades'
  },
  '65 ou mais':{
    slug:'65-plus',tone:'maduro-respeitoso-direto',stage:'fase de vida marcada por experiência e escolhas mais conscientes de tempo',
    load:'rotina, saúde, autonomia, família, amizades, compromissos e projetos que continuam importantes',
    decision:'uma mudança de rotina, tratamento, viagem, projeto, organização financeira ou outra escolha relevante',
    achievement:'uma meta pessoal, uma boa notícia de saúde ou família, um projeto concluído ou algo esperado há bastante tempo',
    transition:'mudar a rotina, a casa, um cuidado de saúde, uma atividade ou a forma de organizar o próprio tempo',
    project:'um projeto, atividade, viagem, curso, hobby ou plano pessoal que traz motivação',
    routine:'uma fase em que tempo, autonomia, saúde, família e interesses pessoais precisam conviver de forma equilibrada'
  }
};

const AUDIT_OK={
  realLife:true,humanSpeech:true,visualizable:true,fiveLanguagesFit:true,
  noMoralWinner:true,noObjectiveWinner:true,touchNatural:true,wordsHuman:true,
  serviceConcrete:true,timeConcrete:true,giftsThoughtful:true,oneMainIdea:true,
  addsInformation:true,perspectiveCorrect:true,natureCorrect:true,
  ageAdjusted:true,civilAdjusted:true,genderAdjusted:true
};

const SLOTS=[
  [1,'recebo','privacao','explorar','priv_rotina_apaga'],
  [2,'espontanea','rotina','explorar','esp_carinho_sem_data'],
  [3,'recebo','vulnerabilidade','explorar','vul_decisao_fase'],
  [4,'recordo','memoria','cruzar','mem_fase_adulta'],
  [5,'recebo','privacao','explorar','priv_vinculo_automatico'],
  [6,'espontanea','alegria','diferenciar','alegria_pessoa'],
  [7,'observo','privacao','contraprovar','obs_casal_afastado'],
  [8,'recebo','rotina','diferenciar','rot_noite_comum'],
  [9,'espontanea','vulnerabilidade','cruzar','vul_pessoa_frustracao'],
  [10,'recebo','privacao','contraprovar','priv_momento_passou'],
  [11,'recordo','memoria','cruzar','mem_conexao'],
  [12,'espontanea','rotina','diferenciar','esp_sabado_normal'],
  [13,'recebo','alegria','confirmar','alegria_conquista'],
  [14,'observo','rotina','cruzar','obs_casal_mais_velho'],
  [15,'espontanea','privacao','contraprovar','priv_pessoa_distante'],
  [16,'recebo','vulnerabilidade','diferenciar','vul_espera'],
  [17,'recordo','memoria','resolver_inconsistencia','mem_familia'],
  [18,'espontanea','rotina','confirmar','esp_reencontro'],
  [19,'recebo','privacao','contraprovar','priv_forma_sumiu'],
  [20,'recebo','alegria','confirmar','alegria_projeto']
].map(x=>({n:x[0],perspective:x[1],nature:x[2],fn:x[3],representative:x[4]}));

function cap(s){s=String(s||'');return s?s[0].toUpperCase()+s.slice(1):s;}
function gender(profile,m,f){return profile.sexo==='masculino'?m:f;}
function relationPack(profile){
  const married=profile.estadoCivil==='casado';
  if(married){
    const actor=profile.sexo==='masculino'?'sua esposa':'seu marido';
    return {
      actor,actorCap:cap(actor),spontActor:actor,spontActorCap:cap(actor),
      relationship:'casamento',relationshipPhrase:'a relação de vocês',relationshipLoc:'na relação de vocês',relationshipFrom:'da relação de vocês',relation:'casal',
      receiveQuestion:`Qual atitude ${profile.sexo==='masculino'?'dela':'dele'} teria maior peso emocional para você?`,
      touchReceive:`${cap(actor)} se aproxima, dá um beijo e um abraço demorado.`,
      touchSpont:'Dar um beijo e um abraço demorado.',
      connectedMemory:'Pense numa fase do casamento em que vocês se sentiram especialmente próximos, sem precisar ter sido uma viagem ou data especial.',
      connectedTitle:'Uma fase em que vocês estavam muito conectados'
    };
  }
  const byCivil={
    solteiro:{actor:'uma pessoa muito próxima',spont:'uma pessoa importante para você',rel:'pessoa-proxima',phrase:'um vínculo importante da sua vida',mem:`Pense numa fase em que você se sentiu especialmente ${gender(profile,'conectado','conectada')} a alguém importante — em amizade, família ou relacionamento afetivo.`},
    divorciado:{actor:'uma pessoa importante na sua vida hoje',spont:'alguém de quem você gosta e com quem tem proximidade',rel:'pessoa-proxima',phrase:'um vínculo importante da sua vida hoje',mem:`Pense numa fase da sua vida em que você se sentiu especialmente ${gender(profile,'conectado','conectada')} a alguém importante, sem precisar voltar a uma relação que prefira deixar no passado.`},
    viuvo:{actor:'uma pessoa muito próxima hoje',spont:'alguém importante para você',rel:'pessoa-proxima',phrase:'um vínculo importante da sua vida hoje',mem:`Pense numa fase da sua história em que você se sentiu especialmente ${gender(profile,'conectado','conectada')} a alguém importante. Escolha uma lembrança que seja confortável para você acessar agora.`}
  }[profile.estadoCivil];
  return {
    actor:byCivil.actor,actorCap:cap(byCivil.actor),spontActor:byCivil.spont,spontActorCap:cap(byCivil.spont),
    relationship:'vínculo',relationshipPhrase:byCivil.phrase,relationshipLoc:'nesse '+byCivil.phrase.replace(/^um /,''),relationshipFrom:'desse '+byCivil.phrase.replace(/^um /,''),relation:byCivil.rel,
    receiveQuestion:`Qual atitude dessa pessoa teria maior peso emocional para você?`,
    touchReceive:`${cap(byCivil.actor)} dá um abraço demorado quando vocês se encontram.`,
    touchSpont:'Dar um abraço demorado.',
    connectedMemory:byCivil.mem,
    connectedTitle:'Uma fase de muita conexão'
  };
}

function makeProfile(sexo,estadoCivil,faixaEtaria){
  if(!SEXES.includes(sexo)||!CIVILS.includes(estadoCivil)||!AGES.includes(faixaEtaria))return null;
  const age=AGE_PACK[faixaEtaria],segmento=SEGMENT_SLUG[sexo+'|'+estadoCivil];
  const labelCivil={
    solteiro:sexo==='masculino'?'Solteiro':'Solteira',
    casado:sexo==='masculino'?'Casado':'Casada',
    divorciado:sexo==='masculino'?'Divorciado':'Divorciada',
    viuvo:sexo==='masculino'?'Viúvo':'Viúva'
  }[estadoCivil];
  const labelSexo=sexo==='masculino'?'Homem':'Mulher';
  return {
    sexo,estadoCivil,faixaEtaria,segmento,age,
    key:`${segmento}-${age.slug}`,
    label:`${labelSexo} · ${labelCivil} · ${faixaEtaria}`,
    self:{
      cared:gender({sexo},'cuidado','cuidada'), loved:gender({sexo},'amado','amada'),
      valued:gender({sexo},'valorizado','valorizada'), tired:gender({sexo},'cansado','cansada'),
      excited:gender({sexo},'animado','animada'), connected:gender({sexo},'conectado','conectada'),
      secure:gender({sexo},'seguro','segura'), remembered:gender({sexo},'lembrado','lembrada')
    },
    tone:age.tone
  };
}

function addFamily(arr,profile,id,p,n,targets,objective,difference,relation,socialRisk,biasRisk,builder){
  const ctx={profile,age:profile.age,rel:relationPack(profile),self:profile.self,g:(m,f)=>gender(profile,m,f)};
  const built=builder(ctx);
  arr.push({
    id,perspective:p,nature:n,title:built.title,situation:built.situation,question:built.question,
    options:built.options,targets:targets.slice(),objective,difference,
    relation:built.relation||relation||ctx.rel.relation,socialRisk:socialRisk||'baixo',biasRisk:biasRisk||'baixo',
    status:'aprovado',audit:Object.assign({},AUDIT_OK),ageBand:profile.faixaEtaria,profileKey:profile.key
  });
}

function buildFamilies(profile){
  const F=[];
  const add=(id,p,n,targets,objective,difference,builder,relation='primary',socialRisk='baixo',biasRisk='baixo')=>
    addFamily(F,profile,id,p,n,targets,objective,difference,relation,socialRisk,biasRisk,builder);

  add('priv_rotina_apaga','recebo','privacao',['QT','TF'],'Medir dor pela ausência das cinco formas de afeto em uma rotina real.','Compara privação afetiva gradual, sem crise aberta.',c=>({
    title:'Quando a rotina vai apagando algumas coisas',situation:`Depois de alguns meses de ${c.age.routine}, algumas demonstrações de carinho começam a aparecer cada vez menos ${c.rel.relationshipLoc}.`,question:'Qual dessas ausências mais machucaria você?',options:{
      PA:`${c.rel.actorCap} quase nunca diz que percebe ou valoriza o que você faz.`,QT:'Vocês quase nunca conseguem ter um tempo de verdade juntos, sem celular ou outra distração.',RP:`${c.rel.actorCap} quase nunca aparece com uma pequena lembrança que mostre que pensou em você.`,FS:'Você percebe que pequenas responsabilidades que poderiam ser divididas acabam ficando quase sempre com você.',TF:`Abraços${c.profile.estadoCivil==='casado'?', beijos':''} e carinho entre vocês ficam cada vez mais raros.`}}));
  add('priv_vinculo_automatico','recebo','privacao',['PA','QT'],'Investigar qual ausência mais transforma um vínculo em mera convivência.','Foca automaticidade da relação e não um evento externo.',c=>({
    title:c.profile.estadoCivil==='casado'?'Quando o casamento começa a parecer automático':'Quando um vínculo importante começa a parecer automático',situation:`Imagine uma fase em que não existe uma briga específica, mas ${c.rel.relationshipPhrase} começa a funcionar mais no automático do que com proximidade.`,question:'Qual mudança faria você sentir maior distância?',options:{
      PA:`${c.rel.actorCap} para de dizer coisas boas sobre você e só fala do que precisa ser resolvido.`,QT:'Quase todo o tempo juntos passa a ser ocupado por celular, televisão, tarefas ou outros compromissos.',RP:`${c.rel.actorCap} deixa de trazer até aquelas coisinhas simples que antes mostravam que lembrou de você.`,FS:'Pequenas ajudas que antes aconteciam espontaneamente praticamente somem.',TF:`Abraços${c.profile.estadoCivil==='casado'?', beijos':''} e carinhos ficam muito raros entre vocês.`}}),'primary','medio','baixo');
  add('priv_momento_passou','recebo','privacao',['RP','PA'],'Medir sensação de ser lembrado em um acontecimento pessoal sem associar presente a preço.','Trabalha um marco pessoal que passa quase despercebido.',c=>({
    title:'Quando algo importante para você passa quase em branco',situation:`Você vive uma semana em que acontece algo importante para você — ${c.age.achievement}. Não precisava de festa, mas esperava algum sinal de atenção.`,question:'Qual dessas faltas pesaria mais?',options:{
      PA:`${c.rel.actorCap} não comenta nada sobre o que aquilo significou para você.`,QT:'A pessoa não separa nem alguns minutos para estar com você e ouvir como foi.',RP:'Não aparece nem uma pequena lembrança, comida ou coisinha ligada à ocasião.',FS:'Ela percebe que seu dia ficou corrido, mas não toma a frente de nenhuma pequena tarefa para aliviar.',TF:`O dia passa sem um abraço${c.profile.estadoCivil==='casado'?', beijo':''} ou carinho diferente do habitual.`}}),'primary','medio','baixo');
  add('priv_desinteresse','recebo','privacao',['QT','PA'],'Investigar a dor de perder interesse percebido no cotidiano.','Parte da sensação de desinteresse, não de uma data ou problema isolado.',c=>({
    title:'Quando você sente que sua vida deixou de interessar',situation:`Por algumas semanas, ${c.rel.actor} parece mais distante das coisas que acontecem com você. Não existe uma briga específica.`,question:`O que mais faria você se sentir pouco ${c.self.loved} nessa fase?`,options:{
      PA:'A pessoa raramente fala algo positivo sobre você ou sobre o que você vem enfrentando.',QT:'Ela quase nunca para para ouvir você com atenção, sem fazer outra coisa ao mesmo tempo.',RP:'Ela deixa de aparecer com pequenas coisas que mostram que lembrou de você durante o dia.',FS:'Quando surge uma ajuda simples que ela poderia dar, aquilo costuma ficar para depois e sobra para você.',TF:`Ela quase nunca procura um abraço${c.profile.estadoCivil==='casado'?', um beijo':''} ou um carinho espontâneo.`}}),'primary','medio','baixo');
  add('priv_forma_sumiu','recebo','privacao',['TF','QT'],'Isolar a privação de uma manifestação mantendo as demais presentes.','É uma contraprova limpa: uma forma de carinho desaparece de cada vez.',c=>({
    title:'Quando uma forma de carinho desaparece',situation:`Imagine que, ao longo de alguns meses, uma única forma de carinho praticamente desaparecesse ${c.rel.relationshipFrom}, enquanto as outras continuassem existindo.`,question:'De qual dessas coisas você sentiria mais falta?',options:{
      PA:'Ouvir frases sinceras como “Eu admiro você” ou “Tenho orgulho de você”.',QT:'Ter momentos juntos, conversando ou fazendo algo sem celular e sem pressa.',RP:'Receber uma coisinha simples trazida porque a pessoa lembrou de você.',FS:'Perceber que a pessoa tomou a frente de uma tarefa para aliviar seu dia.',TF:`Receber abraço${c.profile.estadoCivil==='casado'?', beijo':''} e carinho de forma espontânea.`}}));

  add('priv_pessoa_distante','espontanea','privacao',['QT','TF'],'Observar a forma espontânea de reconstruir proximidade diante de distância percebida.','Muda a direção: o respondente precisa agir, não escolher o que gostaria de receber.',c=>({
    title:'A pessoa diz que vocês estão distantes',situation:`Depois de uma fase corrida, ${c.rel.spontActor} diz: “Acho que a gente ficou meio distante ultimamente.” Não existe uma briga aberta.`,question:'Qual atitude surgiria primeiro em você para tentar se aproximar novamente?',options:{
      PA:'Dizer: “Você é muito importante para mim. Eu também não quero que a gente fique assim.”',QT:'Combinar um tempo só de vocês e deixar os celulares de lado.',RP:'Aparecer depois com um chocolate, café ou outra coisinha de que a pessoa gosta.',FS:'Assumir uma pequena tarefa que deixaria o dia dela mais leve.',TF:c.rel.touchSpont}}),'primary','medio','baixo');
  add('priv_pessoa_esquecida','espontanea','privacao',['RP','QT'],'Testar como o respondente repara a sensação de ter deixado alguém importante em segundo plano.','A privação é percebida pelo outro; a resposta mede a expressão espontânea do participante.',c=>({
    title:'Alguém importante diz que ficou em segundo plano',situation:`${c.rel.spontActorCap} comenta que, nas últimas semanas, seus compromissos ocuparam quase tudo e que acabou se sentindo em segundo plano.`,question:'O que você tenderia a fazer primeiro para mostrar que essa pessoa continua importante?',options:{
      PA:`Dizer: “Eu sei que fiquei muito ${c.g('focado','focada')} em outras coisas, mas você continua sendo muito importante para mim.”`,QT:'Marcar um café, passeio ou refeição juntos e ficar realmente presente.',RP:'Levar uma comida, flor ou pequena coisa que tenha a cara da pessoa.',FS:'Resolver uma pequena pendência que você sabe que facilitaria o dia dela.',TF:c.rel.touchSpont}}),'primary','medio','baixo');

  add('obs_casal_afastado','observo','privacao',['QT','TF'],'Observar qual privação o respondente reconhece como mais dolorosa olhando de fora.','Desloca a avaliação para terceiros e reduz autorrelato direto.',c=>({
    title:'Um casal de amigos vai se afastando',situation:'Um casal de amigos não vive uma crise grave, mas os dois dizem que a relação perdeu parte do carinho que existia antes.',question:'Qual dessas ausências lhe pareceria mais dolorosa dentro daquela relação?',relation:'casal-terceiro',options:{
      PA:'Eles quase nunca dizem um ao outro que admiram, valorizam ou agradecem alguma coisa.',QT:'Eles convivem, mas quase nunca têm um tempo de verdade só dos dois.',RP:'Um quase nunca faz uma pequena surpresa ou traz algo porque lembrou do outro.',FS:'Cada um cuida do próprio lado e quase não se ajudam nas pequenas responsabilidades.',TF:'Beijos, abraços e carinhos entre eles praticamente desapareceram.'}}),'casal-terceiro');
  add('obs_vinculo_longo','observo','privacao',['PA','FS'],'Ver como o respondente interpreta privação em uma relação longa.','Testa ausência em outra etapa de vida e fora da própria relação.',c=>({
    title:'Depois de muitos anos juntos',situation:'Um casal continua unido e respeitoso depois de muitos anos, mas percebe que uma parte do cuidado foi ficando para trás.',question:'Qual ausência lhe pareceria criar mais distância entre os dois?',relation:'casal-terceiro',options:{
      PA:'Eles quase nunca dizem um ao outro coisas boas que ainda admiram.',QT:'Passam muito tempo no mesmo ambiente, mas quase nunca fazem algo juntos de verdade.',RP:'Deixaram de ter pequenas lembranças e surpresas que mostram “eu pensei em você”.',FS:'Quase não se oferecem para facilitar pequenas coisas um para o outro.',TF:'Abraços, beijos e carinhos ficaram muito raros entre eles.'}}),'casal-terceiro');

  add('vul_decisao_fase','recebo','vulnerabilidade',['PA','QT'],'Medir cuidado durante incerteza depois de a parte prática já estar encaminhada.','A decisão muda com a faixa etária, preservando a mesma função psicométrica.',c=>({
    title:'Uma decisão importante nesta fase da vida',situation:`Você está avaliando ${c.age.decision}. Já levantou as informações e não precisa que alguém decida por você; o que pesa agora é a incerteza.`,question:c.rel.receiveQuestion,options:{
      PA:`${c.rel.actorCap} diz: “Eu confio em você. Você já enfrentou decisões difíceis antes.”`,QT:'A pessoa senta com você para tomar um café e conversar sem mexer no celular.',RP:'Ela chega com seu café, doce ou outra pequena coisa de que você gosta para animar aquele dia.',FS:'Ela cuida de uma tarefa simples naquele dia para você ter a cabeça um pouco mais livre.',TF:c.rel.touchReceive}}));
  add('vul_espera','recebo','vulnerabilidade',['QT','PA'],'Diferenciar linguagens quando nenhuma providência resolve a situação.','A vulnerabilidade está na espera e não na solução prática.',c=>({
    title:'Esperando uma resposta importante',situation:'Você está esperando uma resposta sobre algo importante. Já fez tudo o que podia e agora não existe nenhuma providência prática que resolva a espera.',question:`O que mais faria você se sentir ${c.self.cared} durante esse período?`,options:{
      PA:`${c.rel.actorCap} diz: “Sei que essa espera está mexendo com você. Estou torcendo por você.”`,QT:'A pessoa fica um tempo com você fazendo algo leve ou conversando sem pressa.',RP:'Ela aparece com uma pequena coisa de que você gosta para tornar aquele dia menos pesado.',FS:'Ela toma a frente de uma tarefa simples da rotina para você não precisar pensar em tudo ao mesmo tempo.',TF:c.rel.touchReceive}}));
  add('vul_cansaco','recebo','vulnerabilidade',['FS','TF'],'Testar cuidado em sobrecarga cotidiana sem doença ou crise.','Foca recuperação e baixa energia em vez de incerteza decisória.',c=>({
    title:'Um dia em que você chega no limite',situation:`Depois de alguns dias puxados com ${c.age.load}, você chega ao fim do dia muito ${c.self.tired}. Não aconteceu uma emergência; você só está sem energia.`,question:`Qual atitude mais faria você se sentir ${c.self.cared}?`,options:{
      PA:'A pessoa reconhece que você teve dias pesados e diz que percebe o seu esforço.',QT:'Ela fica com você um tempo sem cobrar conversa ou produtividade.',RP:'Ela traz sua bebida, comida ou pequena coisa preferida para aquele momento.',FS:'Ela assume uma tarefa concreta que você ainda teria de resolver naquele dia.',TF:c.rel.touchReceive}}));

  add('vul_pessoa_frustracao','espontanea','vulnerabilidade',['PA','QT'],'Cruzar a hipótese mudando de receber apoio para oferecê-lo em frustração.','A outra pessoa não precisa de solução; mede o cuidado que surge primeiro.',c=>({
    title:'Uma pessoa importante perde uma oportunidade',situation:`${c.rel.spontActorCap} conta que perdeu uma oportunidade pela qual vinha torcendo. A parte prática já acabou e a pessoa está claramente frustrada.`,question:'Qual atitude surgiria primeiro em você como forma de cuidado?',options:{
      PA:'Dizer: “Eu sei o quanto você queria isso. Esse resultado não apaga tudo o que você fez.”',QT:'Ficar com a pessoa, ouvir sem pressa e deixar que ela fale ou fique em silêncio.',RP:'Levar depois uma comida, café ou pequena coisa que você sabe que costuma animá-la.',FS:'Assumir uma pequena pendência daquele dia para ela poder desacelerar.',TF:c.rel.touchSpont}}));
  add('vul_pessoa_sobrecarga','espontanea','vulnerabilidade',['FS','QT'],'Observar cuidado espontâneo diante de sobrecarga percebida no outro.','Foca leitura da necessidade sem pedido explícito.',c=>({
    title:'Alguém próximo chega mentalmente sobrecarregado',situation:`${c.rel.spontActorCap} termina um dia em que precisou resolver muitas coisas ao mesmo tempo. A pessoa não pede nada específico, mas você percebe que está sem espaço mental.`,question:'Qual atitude surgiria primeiro em você?',options:{
      PA:'Dizer: “Eu vi que hoje foi pesado. Você fez muita coisa.”',QT:'Sentar perto e dar atenção inteira se a pessoa quiser conversar.',RP:'Trazer uma bebida, lanche ou pequena coisa de que ela gosta.',FS:'Tomar a frente de uma tarefa concreta que ainda precisaria ser feita.',TF:c.rel.touchSpont}}));

  add('rot_noite_comum','recebo','rotina',['TF','QT'],'Criar linha de base cotidiana para diferenciar hipóteses líderes.','Não há problema nem data especial; mede carinho em situação neutra.',c=>({
    title:'Uma noite comum',situation:`É uma noite normal em ${c.age.stage}. Não aconteceu nada ruim nem extraordinário, e vocês têm algum tempo antes de encerrar o dia.`,question:`Qual gesto faria você perceber com mais força que foi ${c.self.remembered} e querido nesse momento?`,options:{
      PA:'A pessoa comenta algo específico que admira ou valoriza em você.',QT:'Ela deixa o celular de lado e fica um tempo conversando ou fazendo algo com você.',RP:'Ela aparece com uma pequena coisa que viu e lembrou de você.',FS:'Ela resolve uma pequena tarefa que você faria mais tarde, sem você precisar pedir.',TF:c.rel.touchReceive}}));
  add('rot_fimsemana','recebo','rotina',['QT','FS'],'Testar preferência em tempo livre não planejado.','Diferencia presença e ajuda prática em uma janela cotidiana.',c=>({
    title:'Um período livre sem programação',situation:'Surge um período livre sem compromisso marcado. Existem pequenas coisas para fazer, mas nada urgente.',question:`Qual atitude dessa pessoa faria você se sentir mais ${c.self.loved}?`,options:{
      PA:'Dizer de forma espontânea uma coisa boa que percebe em você ultimamente.',QT:'Convidar você para fazer algo simples juntos e ficar presente de verdade.',RP:'Trazer uma pequena coisa de que você gosta para dividir naquele período.',FS:'Resolver junto com você uma pendência simples para liberar o restante do tempo.',TF:c.rel.touchReceive}}));
  add('rot_dia_normal','recebo','rotina',['PA','RP'],'Medir percepção de lembrança em um dia sem estímulo emocional forte.','Foca microgestos cotidianos, não descanso ou lazer.',c=>({
    title:'Um dia normal da sua rotina',situation:`É um dia comum, no meio de ${c.age.routine}. Não existe crise, conquista ou data especial.`,question:`Qual atitude espontânea faria você se sentir mais ${c.self.remembered}?`,options:{
      PA:'Receber uma mensagem curta dizendo algo que a pessoa realmente valoriza em você.',QT:'Receber um convite para conversar ou fazer algo simples juntos sem distração.',RP:'Receber uma pequena lembrança escolhida porque combinava com você.',FS:'Perceber que a pessoa fez algo útil para facilitar uma responsabilidade sua.',TF:c.rel.touchReceive}}));

  add('esp_carinho_sem_data','espontanea','rotina',['TF','PA'],'Observar como o participante demonstra carinho sem estímulo externo.','É uma expressão ativa em contexto totalmente comum.',c=>({
    title:'Carinho sem ocasião especial',situation:`É um dia comum e ${c.rel.spontActor} não está triste nem especialmente feliz. Você apenas sente vontade de demonstrar carinho.`,question:'Qual atitude tenderia a surgir primeiro?',options:{
      PA:'Dizer uma coisa específica que você gosta ou admira nessa pessoa.',QT:'Chamar a pessoa para ficar um tempo com você sem celular ou outra distração.',RP:'Aparecer com um café, doce ou pequena coisa que viu e lembrou dela.',FS:'Fazer uma tarefa simples que você sabe que facilitaria o dia dela.',TF:c.rel.touchSpont}}));
  add('esp_sabado_normal','espontanea','rotina',['QT','FS'],'Confrontar formas de carinho em contexto doméstico ou cotidiano neutro.','Mede iniciativa quando existe tempo disponível, mas nenhuma demanda emocional.',c=>({
    title:'Um dia tranquilo sem plano definido',situation:'Vocês têm algumas horas livres e nada especial foi combinado. Cada um poderia simplesmente seguir fazendo suas próprias coisas.',question:'O que você tenderia a fazer primeiro para demonstrar cuidado?',options:{
      PA:'Falar espontaneamente algo que você aprecia nessa pessoa.',QT:'Sugerir fazer algo juntos e realmente reservar aquele tempo.',RP:'Buscar ou preparar uma pequena coisa de que a pessoa gosta.',FS:'Aproveitar para resolver uma pequena tarefa que facilitaria a semana dela.',TF:c.rel.touchSpont}}));
  add('esp_reencontro','espontanea','rotina',['TF','PA'],'Confirmar padrão de expressão em um reencontro cotidiano.','Tira o respondente de situações de dor ou conquista e mede o primeiro gesto no reencontro.',c=>({
    title:'Vocês se encontram no fim do dia',situation:`Depois de um dia comum, você encontra ${c.rel.spontActor}. Nada grave aconteceu e ninguém está pedindo ajuda.`,question:'Qual atitude surgiria primeiro em você para demonstrar carinho?',options:{
      PA:'Perguntar como foi o dia e dizer algo carinhoso que você realmente pensa.',QT:'Parar por alguns minutos e dar atenção inteira antes de voltar às outras coisas.',RP:'Entregar uma pequena coisa que você trouxe porque lembrou da pessoa.',FS:'Perguntar se existe alguma pequena coisa que você pode adiantar naquele momento.',TF:c.rel.touchSpont}}));
  add('esp_pessoa_cansada','espontanea','rotina',['FS','TF'],'Testar cuidado cotidiano quando o outro demonstra cansaço leve.','Não é vulnerabilidade grave; mede microcuidado de rotina.',c=>({
    title:'A pessoa chega cansada, mas bem',situation:`${c.rel.spontActorCap} chega de um dia cheio, visivelmente sem energia, mas não está em crise nem pede nada.`,question:'Qual atitude surgiria primeiro em você?',options:{
      PA:'Dizer: “Hoje foi puxado, né? Você deu conta de muita coisa.”',QT:'Sentar junto por alguns minutos e perguntar como foi o dia.',RP:'Trazer água, café, lanche ou alguma coisinha de que a pessoa gosta.',FS:'Adiantar uma tarefa pequena para ela poder descansar um pouco.',TF:c.rel.touchSpont}}));

  add('obs_casal_mais_velho','observo','rotina',['QT','TF'],'Reconhecer amor em terceiros e em outra etapa da vida.','Mede leitura do cuidado sem autorrelato direto.',c=>({
    title:'Um casal depois de muitos anos juntos',situation:'Um casal mais velho vive uma rotina relativamente tranquila. Em um dia comum, um deles quer mostrar ao outro que continua atento depois de muitos anos.',question:'Qual atitude lhe pareceria mais significativa como expressão de amor?',relation:'casal-terceiro',options:{
      PA:'Dizer uma coisa específica que ainda admira no outro.',QT:'Desligar a televisão ou guardar o celular e ficar um tempo conversando juntos.',RP:'Trazer uma comida, flor ou pequena coisa que sabe que o outro gosta.',FS:'Fazer uma tarefa que normalmente seria do outro para facilitar o dia.',TF:'Dar um abraço e ficar próximo com carinho.'}}),'casal-terceiro');
  add('obs_irmaos_adultos','observo','rotina',['PA','RP'],'Observar amor fraterno adulto com manifestações ajustadas ao vínculo.','Diversifica a observação para fora do casal e mantém toque natural.',c=>({
    title:'Dois irmãos adultos que continuam próximos',situation:'Dois irmãos adultos têm rotinas diferentes, mas continuam presentes na vida um do outro. Um deles quer demonstrar carinho em um dia comum.',question:'Qual atitude lhe pareceria mais significativa?',relation:'irmaos',options:{
      PA:'Dizer: “Eu admiro muito a forma como você tem levado essa fase.”',QT:'Chamar o irmão para tomar um café e conversar sem pressa.',RP:'Levar uma comida ou pequena coisa que lembrou uma história dos dois.',FS:'Ajudar a resolver uma pequena pendência que o irmão comentou.',TF:'Cumprimentar o irmão com um abraço e uma mão no ombro.'}}),'irmaos');

  add('mem_fase_adulta','recordo','memoria',['PA','FS'],'Cruzar memória afetiva com a etapa de vida atual.','A referência muda por faixa etária sem mudar a função de recordar cuidado.',c=>({
    title:'Uma fase que marcou sua vida adulta',situation:c.profile.faixaEtaria==='18 a 24'?'Pense nos últimos anos, em uma fase em que você começou a assumir mais decisões, estudo, trabalho ou independência e alguém próximo demonstrou cuidado.':`Pense em uma fase anterior da sua vida adulta em que você atravessava uma mudança importante. Hoje você está em ${c.age.stage}.`,question:'Qual tipo de demonstração tende a permanecer mais vivo na sua memória?',relation:'memoria-proximo',options:{
      PA:'Uma frase específica mostrando que a pessoa acreditava em você.',QT:'O tempo que a pessoa separou para ficar com você e ouvir sem pressa.',RP:'Uma pequena lembrança que você guardou porque marcou aquela fase.',FS:'Uma ajuda concreta que diminuiu uma responsabilidade naquele período.',TF:'Um abraço de alguém próximo num momento em que aquele carinho fez diferença.'}}),'memoria-proximo');
  add('mem_conexao','recordo','memoria',['QT','TF'],'Observar quais manifestações positivas se consolidam como memória de conexão.','Usa lembrança de proximidade, não dor, conquista ou problema.',c=>({
    title:c.rel.connectedTitle,situation:c.rel.connectedMemory,question:'O que tende a ficar mais vivo na sua memória daquela fase?',relation:'memoria-vinculo',options:{
      PA:`As coisas que a pessoa dizia e que faziam você perceber o quanto era ${c.self.valued}.`,QT:'Os momentos juntos, conversando ou fazendo coisas sem pressa e sem distrações.',RP:'Alguma pequena lembrança que acabou virando marca daquela fase.',FS:'Uma atitude prática que tornou sua rotina mais leve sem você precisar insistir.',TF:`Os abraços${c.profile.estadoCivil==='casado'?', beijos':''} e carinhos que faziam parte daquela fase.`}}),'memoria-vinculo');
  add('mem_familia','recordo','memoria',['PA','TF'],'Cruzar preferência atual com memória de cuidado em família ou círculo próximo.','Retira a relação principal da cena e observa memória afetiva em outro vínculo.',c=>({
    title:'Quando alguém da sua família ou círculo próximo cuidou de você',situation:'Pense em algum período em que uma pessoa da sua família ou do seu círculo mais próximo fez você sentir claramente que se importava com você.',question:'O que provavelmente permaneceria mais vivo na sua lembrança?',relation:'familia-ou-proximo',options:{
      PA:'Uma frase como “Tenho orgulho de você” ou “Você é muito importante para mim”.',QT:'Um tempo em que a pessoa ficou com você sem pressa e sem distrações.',RP:'Uma pequena coisa que ela trouxe porque sabia que você gostava.',FS:'Uma ajuda concreta que tirou uma responsabilidade das suas costas.',TF:'Um abraço ou carinho de alguém com quem esse afeto sempre foi natural.'}}),'familia-ou-proximo');
  add('mem_transicao','recordo','memoria',['FS','PA'],'Medir memória de cuidado em uma transição adulta concreta.','Foca adaptação e mudança, diferente da memória geral de conexão.',c=>({
    title:'Uma mudança importante de rotina',situation:`Pense em uma fase em que você precisou ${c.age.transition}. Alguém próximo esteve ao seu lado durante a adaptação.`,question:'Qual forma de cuidado tenderia a ficar mais marcada?',relation:'memoria-proximo',options:{
      PA:'Ouvir: “Eu confio em você. Sei que vai encontrar seu jeito nessa fase.”',QT:'Ter alguém por perto para conversar e passar tempo junto durante a adaptação.',RP:'Receber uma pequena lembrança ligada ao começo daquela nova fase.',FS:'Ter ajuda concreta para organizar alguma parte prática da mudança.',TF:'Receber um abraço forte de alguém próximo nos dias mais cansativos.'}}),'memoria-proximo','baixo','medio');

  add('alegria_conquista','recebo','alegria',['PA','RP'],'Medir como o participante prefere receber celebração de uma conquista adequada à faixa etária.','A conquista é ajustada à etapa de vida sem alterar as cinco alternativas.',c=>({
    title:'Uma conquista que importa para você',situation:`Depois de bastante dedicação, acontece ${c.age.achievement}. Você conta a notícia ainda ${c.self.excited}.`,question:`Qual reação faria você se sentir mais ${c.self.valued}?`,options:{
      PA:`${c.rel.actorCap} diz: “Tenho orgulho de você. Eu vi o quanto você trabalhou por isso.”`,QT:'A pessoa chama você para sair, tomar um café ou passar um tempo juntos só para comemorar.',RP:'Ela dá uma pequena lembrança ligada ao seu interesse, projeto ou àquela conquista.',FS:'Ela cuida de um detalhe prático da comemoração para você apenas aproveitar.',TF:c.rel.touchReceive}}));
  add('alegria_projeto','recebo','alegria',['QT','RP'],'Medir apoio a uma iniciativa antes de sucesso ou fracasso.','É alegria de começo, não conquista final ou reconhecimento externo.',c=>({
    title:'Você começa algo que queria há tempos',situation:`Você finalmente começa ${c.age.project}. Ainda não há resultado; existe apenas o entusiasmo de tirar a ideia do papel.`,question:`Qual reação faria você se sentir mais ${c.self.valued} e ${c.g('apoiado','apoiada')}?`,options:{
      PA:`A pessoa diz: “Eu gosto de ver você ${c.self.excited} assim. Isso combina com você.”`,QT:'Ela pede para você contar mais e passa um tempo entendendo por que aquilo importa.',RP:'Ela dá uma pequena coisa relacionada ao projeto ou interesse que você começou.',FS:'Ela ajusta uma pequena tarefa da rotina para você conseguir começar com mais calma.',TF:c.rel.touchReceive}}));
  add('alegria_noticia','recebo','alegria',['TF','QT'],'Observar compartilhamento de alegria em uma boa notícia aguardada.','Foca reação imediata e não a trajetória que levou à conquista.',c=>({
    title:'Uma notícia boa que você estava esperando',situation:'Chega uma notícia boa sobre algo pessoal que você vinha esperando. Você conta ainda com vontade de comemorar.',question:'Qual reação faria você sentir que a alegria realmente foi compartilhada?',options:{
      PA:'A pessoa diz: “Que notícia boa! Eu sabia o quanto isso era importante para você.”',QT:'Ela para o que está fazendo e fica um tempo com você comemorando.',RP:'Ela aparece depois com seu doce, café ou pequena coisa preferida para marcar o dia.',FS:'Ela organiza um detalhe simples da comemoração para você não precisar pensar nisso.',TF:c.rel.touchReceive}}));
  add('alegria_pessoa','espontanea','alegria',['PA','TF'],'Observar expressão espontânea de celebração.','Troca a direção da conquista: a vitória é de alguém importante para o participante.',c=>({
    title:'Uma notícia muito boa de alguém importante',situation:`${c.rel.spontActorCap} recebe uma notícia muito boa sobre algo em que vinha se dedicando e conta a você claramente feliz.`,question:'Qual atitude surgiria primeiro em você para comemorar junto?',options:{
      PA:'Dizer: “Tenho muito orgulho de você. Eu vi o quanto você correu atrás disso.”',QT:'Convidar a pessoa para sair ou separar um tempo para comemorar juntos.',RP:'Comprar ou preparar uma pequena coisa de que ela gosta para marcar a conquista.',FS:'Organizar um detalhe simples da comemoração para ela só aproveitar.',TF:c.rel.touchSpont}}));
  add('alegria_familia','espontanea','alegria',['PA','QT'],'Observar celebração em vínculo familiar ou de amizade próximo.','Diversifica a direção da alegria sem depender de cônjuge ou filhos.',c=>({
    title:'Uma pequena vitória de alguém da sua família ou círculo próximo',situation:'Uma pessoa da sua família ou do seu círculo mais próximo conta uma notícia positiva que representa uma vitória pessoal importante para ela.',question:'Como você tenderia a demonstrar que ficou feliz por essa pessoa?',relation:'familia-ou-proximo',options:{
      PA:`Dizer: “Que bom! Fico muito feliz e ${c.g('orgulhoso','orgulhosa')} de ver você conseguindo isso.”`,QT:'Convidar a pessoa para tomar um café e comemorar juntos sem pressa.',RP:'Levar depois uma comida, livro ou pequena coisa de que ela gosta.',FS:'Oferecer ajuda para organizar um detalhe simples da nova fase, se houver.',TF:'Dar um abraço quando vocês se encontrarem.'}}),'familia-ou-proximo','baixo','medio');

  return F;
}

function buildProfileData(sexo,estadoCivil,faixaEtaria){
  const profile=makeProfile(sexo,estadoCivil,faixaEtaria);if(!profile)return null;
  const families=buildFamilies(profile);
  return {version:VER,instrumentId:`${BASE_ID}|${profile.key}`,baseInstrumentId:BASE_ID,codes:C,labels:L,perspectiveLabels:PL,natureLabels:NL,instructions:INST,slots:SLOTS.map(x=>Object.assign({},x)),families,profile};
}

const PROFILE_CATALOG=[];
for(const sexo of SEXES)for(const civil of CIVILS)for(const age of AGES){const p=makeProfile(sexo,civil,age);PROFILE_CATALOG.push({key:p.key,label:p.label,sexo:p.sexo,estadoCivil:p.estadoCivil,faixaEtaria:p.faixaEtaria,segmento:p.segmento,tone:p.tone});}
const DATA={version:VER,baseInstrumentId:BASE_ID,codes:C,labels:L,perspectiveLabels:PL,natureLabels:NL,instructions:INST,slots:SLOTS,sexes:SEXES,civils:CIVILS,ages:AGES,segmentSlugs:SEGMENT_SLUG,profiles:PROFILE_CATALOG,buildProfileData,makeProfile,buildFamilies};

if(typeof module==='object' && module.exports){module.exports=DATA;return;}
if(!global)return;
global.V52_DATA=DATA;

let activeData=null;
let originalInstrument=null;
const originalBanks={};
function formAge(){const el=document.querySelector('#in-idade');return el?String(el.value||'').trim():'';}
function dataFromForm(){try{return buildProfileData(estado.sexo,estado.civil,formAge());}catch(_){return null;}}
function active(){try{return !!(activeData && estado.sexo===activeData.profile.sexo && estado.civil===activeData.profile.estadoCivil && estado.idade===activeData.profile.faixaEtaria && estado.segmento===activeData.profile.segmento);}catch(_){return false;}}
function hash(s){let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function participantOffset(){return hash((estado.codigo||'')+'|'+(estado.nome||'')+'|'+(estado.contato||''))%5;}
function rotate(arr,k){return arr.slice(k).concat(arr.slice(0,k));}
function baseOrder(slotN,offset){return rotate(C,((slotN-1)+(offset||0))%5);}
function idxMap(){return new Map((activeData?.families||[]).map(f=>[f.id,f]));}
function optionMap(f,slotN,offset){return baseOrder(slotN,offset).map((code,i)=>({letra:String.fromCharCode(65+i),codigo:code,texto:f.options[code]}));}
function canonical(data,slot){const f=new Map(data.families.map(x=>[x.id,x])).get(slot.representative);return {n:slot.n,titulo:f.title,situacao:f.situation,pergunta:f.question,alternativas:optionMap(f,slot.n,0),permite_pular:false,_v52:{family:f.id,perspective:slot.perspective,nature:slot.nature,fn:slot.fn,status:f.status,profile:data.profile.key}};}
function hypothesis(beforeIndex){const scores={PA:0,QT:0,RP:0,FS:0,TF:0};if(typeof estado==='undefined')return {scores,order:C.slice(),top:C.slice(0,2),gap:0};for(let i=0;i<beforeIndex;i++){const e=estado.escolhas[i];if(e&&e.primeira&&scores[e.primeira]!==undefined)scores[e.primeira]+=1;}const order=C.slice().sort((a,b)=>scores[b]-scores[a] || C.indexOf(a)-C.indexOf(b));return {scores,order,top:order.slice(0,2),gap:scores[order[0]]-scores[order[1]]};}
function perspectiveLeaders(beforeIndex){const by={};for(let i=0;i<beforeIndex;i++){const e=estado.escolhas[i];if(!e||!e.primeira||!e._v52Perspective)continue;by[e._v52Perspective] ||= {PA:0,QT:0,RP:0,FS:0,TF:0};by[e._v52Perspective][e.primeira]++;}return Object.fromEntries(Object.entries(by).map(([p,s])=>[p,C.slice().sort((a,b)=>s[b]-s[a] || C.indexOf(a)-C.indexOf(b))[0]]));}
function adaptiveFunction(slot,index){if(slot.fn!=='resolver_inconsistencia')return slot.fn;const vals=Object.values(perspectiveLeaders(index));return new Set(vals).size>1?'resolver_inconsistencia':'confirmar';}
function chooseFamily(slot,index){
  const F=activeData.families,idx=idxMap();const used=new Set((estado.escolhas||[]).slice(0,index).map(e=>e&&e._v52Family).filter(Boolean));let cand=F.filter(f=>f.perspective===slot.perspective && f.nature===slot.nature && !used.has(f.id));if(!cand.length)cand=F.filter(f=>f.perspective===slot.perspective && f.nature===slot.nature);const h=hypothesis(index),top=h.top,fn=adaptiveFunction(slot,index),prev=index>0?estado.escolhas[index-1]:null;
  function score(f){let s=0;const both=top.every(x=>f.targets.includes(x));const leader=f.targets.includes(top[0]),runner=f.targets.includes(top[1]);if(index<5)s+=new Set(f.targets).size*0.2;if(fn==='diferenciar'){if(both)s+=12;else if(leader||runner)s+=5;}if(fn==='contraprovar'){if(leader)s+=9;if(runner)s+=4;if(both)s+=4;}if(fn==='confirmar'){if(leader)s+=8;if(runner)s+=2;}if(fn==='cruzar'){if(leader||runner)s+=5;}if(fn==='resolver_inconsistencia'){if(both)s+=12;else if(leader||runner)s+=6;}if(prev&&prev._v52Relation===f.relation)s-=1.5;if(prev&&prev._v52Family===f.id)s-=20;s+=(hash((estado.codigo||'')+'|'+activeData.profile.key+'|'+slot.n+'|'+f.id)%1000)/100000;return s;}
  cand.sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id));return {family:cand[0]||idx.get(slot.representative),hyp:h,fn};
}
function prepare(index){if(!active()||index<0||index>=20)return;const e=estado.escolhas[index];if(e&&e._v52Family)return;const slot=activeData.slots[index],pick=chooseFamily(slot,index),f=pick.family;const q={n:slot.n,titulo:f.title,situacao:f.situation,pergunta:f.question,alternativas:optionMap(f,slot.n,participantOffset()),permite_pular:false,_v52:{family:f.id,perspective:slot.perspective,nature:slot.nature,fn:pick.fn,status:f.status,profile:activeData.profile.key}};cenariosAtuais[index]=q;Object.assign(e,{n:slot.n,_v52Family:f.id,_v52Perspective:slot.perspective,_v52Nature:slot.nature,_v52Fn:pick.fn,_v52HypBefore:JSON.parse(JSON.stringify(pick.hyp.scores)),_v52Targets:f.targets.slice(),_v52Relation:f.relation,_v52SecondMode:false,_v52SecondAnswered:false,_v52FirstAtDecision:null,_v52Profile:activeData.profile.key});}

function activateFromForm(){try{const data=dataFromForm();if(!data){activeData=null;document.body.classList.remove('v52-active');return;}const slug=data.profile.segmento;if(!BANCO.segmentos[slug])return;if(!originalInstrument)originalInstrument=BANCO.instrumento_id;if(!originalBanks[slug])originalBanks[slug]=BANCO.segmentos[slug].cenarios;activeData=data;BANCO.segmentos[slug].cenarios=data.slots.map(slot=>canonical(data,slot));BANCO.instrumento_id=data.instrumentId;document.body.classList.add('v52-active');document.body.classList.remove('v51-active');}catch(err){console.error('[V5.2] preparação do perfil:',err);}}
try{const btn=document.querySelector('#btn-comecar');if(btn)btn.addEventListener('click',activateFromForm,true);}catch(err){console.error('[V5.2] captura do cadastro:',err);}

const st=document.createElement('style');
st.textContent=`
.v52-active .opt .letra{display:none!important}
.v52-second-box{margin:14px 0 2px;padding:14px;border:1px solid var(--linha);border-radius:11px;background:rgba(201,191,180,.035)}
.v52-second-box p{font-size:14px;color:var(--osso2);margin:0 0 10px;line-height:1.45}
.v52-second-actions{display:flex;gap:8px;flex-wrap:wrap}
.v52-second-actions .btn{width:auto;flex:1;min-width:150px;padding:11px 12px;font-size:13.5px}
.v52-active .opt:disabled{cursor:default}
.v52-admin-matrix{margin-top:18px}
.v52-admin-item{border-top:1px solid var(--linha);padding:14px 0}
.v52-admin-item:first-child{border-top:0}
.v52-admin-item dl{display:grid;grid-template-columns:minmax(120px,180px) 1fr;gap:6px 12px;font-size:13px}
.v52-admin-item dt{color:var(--mut);font-family:var(--mono)}
.v52-admin-item dd{color:var(--osso2)}
.v52-profile-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:12px}
.v52-profile-chip{border:1px solid var(--linha);border-radius:9px;padding:8px 10px;font-size:12px;color:var(--osso2)}
`;
document.head.appendChild(st);
try{const baseRender=renderCenario;renderCenario=function(){if(active())prepare(estado.i);baseRender();if(active())decorateQuestion();};}catch(err){console.error('[V5.2] render:',err);}

function decorateQuestion(){
  const e=estado.escolhas[estado.i],slot=activeData?.slots?.[estado.i];const etapa=document.querySelector('.etapa');if(!e||!slot)return;document.body.classList.add('v52-active');
  if(e._v52FirstAtDecision && e._v52FirstAtDecision!==e.primeira){e._v52SecondMode=false;e._v52SecondAnswered=false;e._v52FirstAtDecision=null;e.segunda=null;}
  if(!e.primeira){if(etapa)etapa.textContent=INST[slot.perspective];return;}
  if(e.segunda){e._v52SecondAnswered=true;e._v52SecondMode=true;e._v52FirstAtDecision=e.primeira;}
  const opts=[...document.querySelectorAll('#area-cenario .opt')];let box=document.querySelector('#v52-second-box');if(!box){box=document.createElement('div');box.id='v52-second-box';box.className='v52-second-box';const wrap=document.querySelector('#area-cenario .opts');if(wrap)wrap.insertAdjacentElement('afterend',box);}const advance=document.querySelector('#btn-avancar');
  if(e._v52SecondMode){if(etapa)etapa.innerHTML='Se outra atitude também combina bastante com você, marque agora a <strong>segunda escolha</strong>.';box.innerHTML='<p>A segunda escolha é opcional e será guardada separadamente da primeira.</p>';opts.forEach(b=>{const code=b.dataset.c;b.disabled=(code===e.primeira);b.classList.remove('apagado');});if(advance)advance.disabled=!e.segunda;return;}
  if(e._v52SecondAnswered){if(etapa)etapa.textContent=e.segunda?'Primeira e segunda escolhas registradas.':'Sua primeira escolha foi registrada.';box.innerHTML=e.segunda?'<p>Segunda escolha registrada. Ela ficará separada da sua primeira resposta.</p>':'<p>Você optou por registrar apenas a primeira escolha.</p>';if(advance)advance.disabled=false;return;}
  if(etapa)etapa.textContent='Sua primeira escolha foi registrada.';opts.forEach(b=>{if(b.dataset.c!==e.primeira)b.disabled=true;});box.innerHTML='<p><strong>Tem uma segunda alternativa que também combina bastante com você?</strong></p><div class="v52-second-actions"><button type="button" class="btn ghost" id="v52-sim">Sim, escolher uma segunda</button><button type="button" class="btn" id="v52-nao">Não, avançar</button></div>';if(advance)advance.disabled=true;document.querySelector('#v52-sim')?.addEventListener('click',()=>{e._v52SecondMode=true;e._v52FirstAtDecision=e.primeira;renderCenario();});document.querySelector('#v52-nao')?.addEventListener('click',()=>{e._v52SecondAnswered=true;e._v52SecondMode=false;e._v52FirstAtDecision=e.primeira;e.segunda=null;avancar();});
}

try{const baseDetalhes=escolhasDetalhadas;escolhasDetalhadas=function(){const arr=baseDetalhes();if(!active())return arr;const idx=idxMap();return arr.map((x,i)=>{const e=estado.escolhas[i]||{},c=cenariosAtuais[i]||{},f=idx.get(e._v52Family),slot=activeData.slots[i];return Object.assign({},x,{scenario_id:e._v52Family||null,perfil:activeData.profile.key,sexo_metodologico:activeData.profile.sexo,estado_civil_metodologico:activeData.profile.estadoCivil,faixa_etaria_metodologica:activeData.profile.age.slug,tom_etario:activeData.profile.tone,perspectiva:e._v52Perspective||slot?.perspective||null,natureza:e._v52Nature||slot?.nature||null,funcao_adaptativa:e._v52Fn||slot?.fn||null,hipotese_antes:e._v52HypBefore||null,alvo_adaptativo:e._v52Targets||null,relacao:f?.relation||null,mapa_posicoes:(c.alternativas||[]).map((a,pos)=>({posicao:pos+1,codigo:a.codigo})),segunda_usada_na_hipotese:false,versao_motor:VER,status_validacao:f?.status||null});});};}catch(err){console.error('[V5.2] dados detalhados:',err);}

const originalFetch=global.fetch;
if(originalFetch){global.fetch=async function(input,init){if(active() && init && typeof init.body==='string' && String(input).includes('linguagem_amor_v3')){try{const body=JSON.parse(init.body),rows=Array.isArray(body)?body:[body];rows.forEach(r=>{if(r&&typeof r==='object'){r.versao_questionario=VER;r.instrumento_id=activeData.instrumentId;}});init=Object.assign({},init,{body:JSON.stringify(Array.isArray(body)?rows:rows[0])});}catch(_){ }}return originalFetch.call(this,input,init);};}

function esc52(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function injectAdminMatrix(){const adm=document.querySelector('#tela-admin');if(!adm || adm.classList.contains('oculto') || document.querySelector('#v52-admin-matrix'))return;const demo=buildProfileData('masculino','casado','35 a 44'),idx=new Map(demo.families.map(f=>[f.id,f]));const box=document.createElement('details');box.id='v52-admin-matrix';box.className='card v52-admin-matrix';box.innerHTML='<summary style="cursor:pointer;font-family:var(--display);font-weight:800">Matriz metodológica V5.2 · cobertura universal</summary>'+'<p class="lead" style="margin-top:10px;font-size:13.5px">O mesmo motor adaptativo aprovado foi habilitado para 48 combinações: 2 sexos × 4 estados civis × 6 faixas etárias. A missão metodológica das 20 etapas é fixa; a linguagem pública e as situações são ajustadas ao perfil.</p>'+'<div class="v52-profile-grid">'+PROFILE_CATALOG.map(p=>'<div class="v52-profile-chip">'+esc52(p.label)+'</div>').join('')+'</div>'+'<div style="margin-top:18px">'+SLOTS.map(slot=>{const f=idx.get(slot.representative),order=baseOrder(slot.n,0);return '<div class="v52-admin-item"><h3>Etapa '+slot.n+' · '+esc52(f.title)+'</h3><dl>'+'<dt>Perspectiva</dt><dd>'+esc52(PL[slot.perspective])+'</dd>'+'<dt>Categoria emocional</dt><dd>'+esc52(NL[slot.nature])+'</dd>'+'<dt>Função adaptativa</dt><dd>'+esc52(slot.fn)+'</dd>'+'<dt>Objetivo do item</dt><dd>'+esc52(f.objective)+'</dd>'+order.map((code,pos)=>'<dt>Linguagem opção '+(pos+1)+'</dt><dd>'+esc52(L[code])+'</dd>').join('')+'<dt>Por que é diferente</dt><dd>'+esc52(f.difference)+'</dd>'+'<dt>Status</dt><dd>'+esc52(f.status)+'</dd></dl></div>';}).join('')+'</div>';adm.appendChild(box);}
setInterval(injectAdminMatrix,1400);
try{document.querySelectorAll('.eyebrow,.rodape').forEach(el=>{if(/Piloto interno\s*·\s*versão\s*3\.0/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/versão\s*3\.0/i,'versão 5.2');});}catch(_){ }
console.info('[V5.2] motor adaptativo universal carregado',VER,PROFILE_CATALOG.length,'perfis');
})(typeof window!=='undefined'?window:null);