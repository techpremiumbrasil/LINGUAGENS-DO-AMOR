(function(global){
'use strict';

const VER='5.1-a1';
const ID='v5.1-adaptativo-homem-casado-35-44-a1';
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

/*
  Cada posição é uma missão metodológica. A situação concreta é escolhida
  adaptativamente dentro da mesma perspectiva + natureza emocional.
  Assim preservamos comparabilidade e quotas sem engessar a sequência.
*/
const SLOTS=[
  [1,'recebo','privacao','explorar','priv_rotina_corrida'],
  [2,'espontanea','rotina','explorar','esp_carinho_sem_data'],
  [3,'recebo','vulnerabilidade','explorar','vul_decisao_profissional'],
  [4,'recordo','memoria','cruzar','mem_inicio_adulto'],
  [5,'recebo','privacao','explorar','priv_virando_colegas'],
  [6,'espontanea','alegria','diferenciar','alegria_esposa_noticia'],
  [7,'observo','privacao','contraprovar','obs_casal_afastado'],
  [8,'recebo','rotina','diferenciar','rot_noite_comum'],
  [9,'espontanea','vulnerabilidade','cruzar','vul_esposa_oportunidade'],
  [10,'recebo','privacao','contraprovar','priv_datas_passando'],
  [11,'recordo','memoria','cruzar','mem_casamento_conectado'],
  [12,'espontanea','rotina','diferenciar','esp_sabado_normal'],
  [13,'recebo','alegria','confirmar','alegria_reconhecimento_profissional'],
  [14,'observo','rotina','cruzar','obs_casal_mais_velho'],
  [15,'espontanea','privacao','contraprovar','priv_esposa_sente_distancia'],
  [16,'recebo','vulnerabilidade','diferenciar','vul_esperando_resposta'],
  [17,'recordo','memoria','resolver_inconsistencia','mem_familia_cuidou'],
  [18,'espontanea','rotina','confirmar','esp_chegada_em_casa'],
  [19,'recebo','privacao','contraprovar','priv_carinho_sumiu'],
  [20,'recebo','alegria','confirmar','alegria_projeto_pessoal']
].map(x=>({n:x[0],perspective:x[1],nature:x[2],fn:x[3],representative:x[4]}));

const AUDIT_OK={
  realLife:true,humanSpeech:true,visualizable:true,fiveLanguagesFit:true,
  noMoralWinner:true,noObjectiveWinner:true,touchNatural:true,wordsHuman:true,
  serviceConcrete:true,timeConcrete:true,giftsThoughtful:true,oneMainIdea:true,
  addsInformation:true,perspectiveCorrect:true,natureCorrect:true
};
const F=[];
function add(id,p,n,title,situation,question,options,targets,objective,difference,relation='casal',socialRisk='baixo',biasRisk='baixo'){
  F.push({id,perspective:p,nature:n,title,situation,question,options,targets,objective,difference,relation,socialRisk,biasRisk,status:'aprovado',audit:AUDIT_OK});
}

/* ========================== PRIVACAO — EU RECEBO ========================== */
add('priv_rotina_corrida','recebo','privacao','Quando a rotina vai apagando algumas coisas',
'Depois de alguns meses de rotina corrida, vocês continuam bem, mas algumas demonstrações começam a aparecer cada vez menos.',
'Qual dessas ausências mais machucaria você?',{
PA:'Sua esposa quase nunca diz que percebe ou valoriza o que você faz.',
QT:'Vocês quase nunca conseguem ter um tempo só dos dois, sem distrações.',
RP:'Ela quase nunca aparece com uma pequena lembrança que mostre que pensou em você.',
FS:'Você sente que muitas responsabilidades do dia a dia acabam ficando só com você.',
TF:'Abraços, beijos e carinho entre vocês ficam cada vez mais raros.'},['QT','TF'],
'Medir dor pela ausência das cinco formas de afeto na rotina conjugal.',
'É a comparação mais direta de privação afetiva depois de meses de rotina.');

add('priv_virando_colegas','recebo','privacao','Quando o casamento começa a parecer automático',
'Imagine uma fase em que vocês não estão brigando, mas a relação começa a parecer mais uma parceria de tarefas do que um casamento.',
'Qual mudança faria você sentir maior distância da sua esposa?',{
PA:'Ela para de dizer coisas boas sobre você e só fala do que precisa ser resolvido.',
QT:'Quase todo o tempo juntos passa a ser ocupado por celular, televisão ou tarefas.',
RP:'Ela deixa de trazer até aquelas coisinhas simples que antes mostravam que lembrou de você.',
FS:'Ela deixa de dividir pequenas responsabilidades que antes vocês resolviam como uma equipe.',
TF:'Beijos, abraços e carinhos praticamente somem da rotina de vocês.'},['PA','QT'],
'Observar qual ausência transforma mais a percepção de casamento em mera convivência.',
'Foca na sensação de viver como colegas, não em um evento externo.','casal','medio','baixo');

add('priv_datas_passando','recebo','privacao','Quando algo importante passa em branco',
'Você vive uma semana que teve um momento importante para você. Não precisava de festa nem de grande comemoração, mas esperava algum sinal de atenção da sua esposa.',
'Qual dessas faltas pesaria mais?',{
PA:'Ela não comenta nada sobre o que aquilo significou para você.',
QT:'Ela não separa nem alguns minutos para estar com você e ouvir como foi.',
RP:'Ela não traz nem uma pequena lembrança ou mimo ligado à ocasião.',
FS:'Ela sabe que seu dia ficou corrido, mas não assume nenhuma pequena tarefa para ajudar.',
TF:'Ela passa pelo dia sem beijo, abraço ou carinho diferente do habitual.'},['RP','PA'],
'Medir sensação de ser lembrado em um acontecimento pessoal sem tornar presente sinônimo de preço.',
'Trabalha a dor de um marco pessoal pouco percebido.','casal','medio','baixo');

add('priv_sem_interesse','recebo','privacao','Quando você sente que sua vida deixou de interessar',
'Por algumas semanas, você percebe que sua esposa está mais distante das coisas que acontecem com você. Não existe uma briga específica.',
'O que mais faria você se sentir pouco amado nessa fase?',{
PA:'Ela raramente fala algo positivo sobre você ou sobre o que você vem enfrentando.',
QT:'Ela quase nunca para para ouvir você com atenção, sem fazer outra coisa ao mesmo tempo.',
RP:'Ela deixa de aparecer com pequenas coisas que mostram que lembrou de você durante o dia.',
FS:'Quando você pede ajuda em algo simples, aquilo costuma ficar para depois e sobra para você.',
TF:'Ela quase nunca procura um abraço, um beijo ou um carinho espontâneo.'},['QT','PA'],
'Investigar a dor de perder interesse percebido no cotidiano.',
'Parte da sensação de desinteresse, não de uma data ou sobrecarga específica.','casal','medio','baixo');

add('priv_carinho_sumiu','recebo','privacao','Quando uma forma de carinho desaparece',
'Imagine que, ao longo de alguns meses, uma única forma de carinho praticamente desaparecesse do casamento, enquanto as outras continuassem existindo.',
'De qual dessas coisas você sentiria mais falta?',{
PA:'Ouvir dela frases como: “Eu admiro você” ou “Tenho orgulho de você.”',
QT:'Ter momentos só dos dois, conversando ou fazendo algo juntos sem celular.',
RP:'Receber uma coisinha simples que ela trouxe porque lembrou de você.',
FS:'Perceber que ela tomou a frente de alguma tarefa para aliviar seu dia.',
TF:'Receber beijo, abraço e carinho físico de forma espontânea.'},['TF','QT'],
'Isolar privação de uma manifestação mantendo as demais presentes.',
'É uma contraprova limpa: uma forma de carinho some de cada vez.');

/* ====================== PRIVACAO — RESPOSTA ESPONTANEA ==================== */
add('priv_esposa_sente_distancia','espontanea','privacao','Ela diz que vocês estão distantes',
'Depois de uma fase muito corrida, sua esposa diz: “Acho que a gente ficou meio distante ultimamente.” Vocês não estão brigados.',
'Qual atitude surgiria primeiro em você para tentar se aproximar novamente?',{
PA:'Dizer: “Você é muito importante para mim. Eu também não quero que a gente fique assim.”',
QT:'Combinar uma noite só de vocês e deixar os celulares de lado.',
RP:'Chegar depois com o chocolate ou outra coisinha que você sabe que ela gosta.',
FS:'Assumir uma tarefa da noite para deixar o ritmo dela mais leve.',
TF:'Abraçá-la e ficar alguns segundos ali com ela.'},['QT','TF'],
'Observar a forma espontânea de reconstruir proximidade diante de distância percebida.',
'É expressão ativa do respondente, não algo que ele gostaria de receber.','casal','medio','baixo');

add('priv_esposa_se_sente_esquecida','espontanea','privacao','Ela sente que ficou em segundo plano',
'Sua esposa comenta que, nas últimas semanas, trabalho e compromissos ocuparam quase tudo e ela se sentiu um pouco esquecida.',
'O que você tenderia a fazer primeiro para mostrar que ela continua importante para você?',{
PA:'Dizer: “Eu sei que fiquei muito focado em outras coisas, mas você é prioridade para mim.”',
QT:'Marcar um café ou jantar só com ela e ficar realmente presente.',
RP:'Levar uma flor, um chocolate ou algo pequeno que tenha a cara dela.',
FS:'Resolver uma tarefa que ela vinha adiando para aliviar o dia dela.',
TF:'Recebê-la com um beijo e um abraço demorado quando vocês se encontrarem.'},['RP','QT'],
'Testar como ele repara a sensação de ter deixado a esposa em segundo plano.',
'A privação é percebida por ela; a resposta mede a expressão espontânea dele.','casal','medio','baixo');

/* ============================ PRIVACAO — OBSERVO ========================== */
add('obs_casal_afastado','observo','privacao','Um casal de amigos vai se afastando',
'Um casal de amigos não vive uma crise grave, mas os dois dizem que o casamento perdeu parte do carinho que existia antes.',
'Qual dessas ausências lhe pareceria mais dolorosa dentro daquela relação?',{
PA:'Eles quase nunca dizem um ao outro que admiram, valorizam ou agradecem alguma coisa.',
QT:'Eles convivem todos os dias, mas quase nunca têm um tempo só dos dois.',
RP:'Um quase nunca faz uma pequena surpresa ou traz algo porque lembrou do outro.',
FS:'Cada um cuida do próprio lado e quase não se ajudam nas responsabilidades.',
TF:'Beijos, abraços e carinhos entre eles praticamente desapareceram.'},['QT','TF'],
'Observar qual privação o respondente reconhece como mais dolorosa olhando de fora.',
'Desloca a avaliação para terceiros e reduz autorrelato direto.','casal-terceiro');

add('obs_casal_anos_juntos','observo','privacao','Depois de muitos anos juntos',
'Um casal mais velho continua unido e respeitoso, mas percebe que uma parte da relação foi ficando para trás com o tempo.',
'Qual ausência lhe pareceria criar mais distância entre os dois?',{
PA:'Eles quase nunca dizem um ao outro coisas boas que ainda admiram.',
QT:'Eles passam muito tempo na mesma casa, mas quase nunca fazem algo juntos de verdade.',
RP:'Eles deixaram de ter pequenas lembranças e surpresas que mostram “eu pensei em você”.',
FS:'Eles quase não se oferecem para facilitar pequenas coisas um para o outro.',
TF:'Abraços, beijos e carinhos ficaram muito raros entre eles.'},['PA','FS'],
'Ver como o respondente interpreta privação em uma relação longa.',
'Testa ausência em outra etapa de vida e fora da própria relação.','casal-terceiro');

/* ====================== VULNERABILIDADE — EU RECEBO ======================= */
add('vul_decisao_profissional','recebo','vulnerabilidade','Uma decisão profissional importante',
'Você está avaliando uma mudança profissional. Já levantou as informações e não precisa que alguém decida por você; o que pesa agora é a incerteza.',
'Qual atitude da sua esposa teria maior peso emocional nesse momento?',{
PA:'Dizer: “Eu confio em você. Você já enfrentou decisões difíceis antes.”',
QT:'Sentar com você para tomar um café e conversar sem mexer no celular.',
RP:'Chegar com seu café preferido ou uma pequena lembrança para animar aquele dia.',
FS:'Cuidar de uma tarefa da casa naquela noite para você ter a cabeça mais livre.',
TF:'Segurar sua mão enquanto vocês conversam sobre o que está acontecendo.'},['PA','QT'],
'Medir cuidado durante incerteza profissional depois de a parte prática já estar encaminhada.',
'Contexto típico da fase 35–44 sem transformar Serviço em solução.');

add('vul_esperando_resposta','recebo','vulnerabilidade','Esperando uma resposta importante',
'Você está esperando uma resposta sobre algo importante. Já fez tudo o que podia e agora não existe nenhuma providência prática a tomar.',
'O que mais faria você se sentir cuidado pela sua esposa durante essa espera?',{
PA:'Dizer: “Sei que essa espera está mexendo com você. Estou torcendo por você.”',
QT:'Ficar um tempo com você fazendo algo leve para tirar a cabeça da espera.',
RP:'Aparecer com uma besteirinha que você gosta só para melhorar seu dia.',
FS:'Preparar uma refeição ou cuidar de uma tarefa que você faria naquela noite.',
TF:'Dar um abraço demorado quando perceber que você ficou mais ansioso.'},['QT','TF'],
'Observar preferência afetiva quando não há problema concreto para resolver.',
'Elimina vantagem prática de Serviço porque nada pode alterar o resultado.');

add('vul_despesa_planejada','recebo','vulnerabilidade','Uma despesa fora do planejamento',
'Surge uma despesa relevante. Vocês já fizeram as contas, cortaram o que precisava e sabem como vão lidar com ela. A preocupação ainda fica na cabeça por alguns dias.',
'Qual demonstração da sua esposa teria maior peso afetivo para você nessa fase?',{
PA:'Dizer: “A gente já se organizou. Eu gosto de como você está conduzindo isso comigo.”',
QT:'Chamar você para caminhar ou conversar sobre outra coisa por um tempo.',
RP:'Trazer seu café ou lanche preferido numa tarde mais tensa.',
FS:'Assumir uma tarefa simples da casa naquele dia sem você precisar pedir.',
TF:'Sentar perto de você e segurar sua mão por alguns minutos.'},['FS','PA'],
'Medir suporte emocional em preocupação financeira já operacionalmente resolvida.',
'O plano financeiro já existe; a questão não mede quem resolve melhor o problema.','casal','baixo','medio');

/* ================= VULNERABILIDADE — RESPOSTA ESPONTANEA ================== */
add('vul_esposa_oportunidade','espontanea','vulnerabilidade','Sua esposa perde uma oportunidade',
'Sua esposa conta que não conseguiu uma oportunidade que queria muito. Ela está chateada, mas já sabe o que vai fazer depois.',
'Qual atitude surgiria primeiro em você para cuidar dela?',{
PA:'Dizer: “Eu vi o quanto você se esforçou. Isso não muda o quanto eu admiro você.”',
QT:'Sentar com ela sem celular e deixar que conte tudo no tempo dela.',
RP:'Levar mais tarde o chocolate, a flor ou outra coisinha que costuma alegrá-la.',
FS:'Preparar o jantar naquela noite para ela poder descansar um pouco.',
TF:'Abraçá-la e ficar ali por alguns segundos antes de falar qualquer coisa.'},['PA','TF'],
'Observar como ele oferece cuidado à esposa diante de frustração sem decisão prática.',
'Troca a direção do cuidado: ele age, em vez de receber.');

add('vul_pai_exame','espontanea','vulnerabilidade','Um dos seus pais está apreensivo',
'Seu pai ou sua mãe comenta que está apreensivo antes de um exame de rotina. Não existe notícia grave; é só ansiedade com aquele momento.',
'Qual atitude surgiria primeiro em você como forma de cuidado?',{
PA:'Dizer: “Vai dar um passo de cada vez. Estou com você nessa.”',
QT:'Ligar ou passar um tempo com ele antes ou depois do exame.',
RP:'Levar um café, uma fruta ou alguma coisinha de que ele gosta.',
FS:'Oferecer carona ou resolver uma pequena coisa da agenda daquele dia.',
TF:'Dar um abraço ao encontrá-lo antes de vocês seguirem o dia.'},['FS','QT'],
'Observar cuidado intergeracional típico da faixa 35–44.',
'Usa pai ou mãe sem dramatizar saúde e adapta Toque ao vínculo familiar.','familia','baixo','medio');

/* ============================= ROTINA — RECEBO ============================ */
add('rot_noite_comum','recebo','rotina','Uma noite comum em casa',
'É uma noite normal. Não aconteceu nada ruim nem especial, e vocês têm algum tempo antes de dormir.',
'Qual gesto da sua esposa faria você perceber mais carinho naquela noite?',{
PA:'Ela diz: “Eu gosto muito da vida que a gente está construindo juntos.”',
QT:'Ela deixa o celular de lado e chama você para conversar ou ver algo juntos.',
RP:'Ela aparece com um doce ou uma coisinha que viu e lembrou de você.',
FS:'Ela adianta uma tarefa que normalmente ficaria para você fazer.',
TF:'Ela senta perto no sofá e fica abraçada com você por um tempo.'},['QT','TF'],
'Medir preferência afetiva em rotina neutra, sem sofrimento ou conquista.',
'Serve como linha de base cotidiana para comparar com cenários de dor.');

add('rot_chegada_casa','recebo','rotina','Chegando em casa num dia normal',
'Você chega em casa em um dia comum, sem problema específico para contar. Sua esposa está lá e demonstra que ficou feliz de ver você.',
'Qual atitude dela teria mais peso para você?',{
PA:'Ela diz: “Que bom que você chegou. Eu gosto muito de ter você aqui comigo.”',
QT:'Ela para o que está fazendo e fica alguns minutos conversando só com você.',
RP:'Ela mostra uma coisinha que comprou no caminho porque lembrou de você.',
FS:'Ela diz que já cuidou de uma pequena tarefa que você faria ao chegar.',
TF:'Ela recebe você com um beijo e um abraço.'},['PA','TF'],
'Medir carinho na chegada sem carga emocional externa.',
'Contexto breve de reencontro diário, diferente da noite inteira em casa.');

/* ======================= ROTINA — RESPOSTA ESPONTANEA ===================== */
add('esp_carinho_sem_data','espontanea','rotina','Carinho sem ocasião especial',
'É uma noite comum e sua esposa chega em casa sem estar triste nem especialmente animada. Você simplesmente quer demonstrar carinho.',
'Qual atitude surgiria primeiro em você?',{
PA:'Dizer: “Você sabe que eu admiro muito você, né?”',
QT:'Chamá-la para sentar com você e conversar um pouco sem celular.',
RP:'Dar a ela uma coisinha que você viu durante o dia e lembrou dela.',
FS:'Preparar o jantar ou cuidar de uma tarefa que ela faria naquela noite.',
TF:'Recebê-la com um beijo e um abraço demorado.'},['PA','TF'],
'Observar forma espontânea de demonstrar amor sem estímulo externo.',
'É a expressão mais neutra do instrumento: não existe problema nem conquista.');

add('esp_sabado_normal','espontanea','rotina','Um sábado normal de vocês',
'Vocês acordam num sábado sem plano especial. Há algumas tarefas e também tempo livre.',
'Qual gesto você tenderia a fazer primeiro para demonstrar carinho?',{
PA:'Dizer algo que você gosta na forma como ela vem conduzindo a semana.',
QT:'Convidá-la para tomar café fora ou fazer alguma coisa juntos.',
RP:'Passar numa loja ou padaria e trazer algo que você sabe que ela gosta.',
FS:'Adiantar a louça, a roupa ou outra tarefa antes que ela precise pensar nisso.',
TF:'Chegar por trás, dar um abraço e ficar um pouco junto dela.'},['FS','QT'],
'Medir expressão espontânea em rotina doméstica de fim de semana.',
'Confronta fazer junto com fazer por ela, em contexto sem urgência.');

add('esp_chegada_em_casa','espontanea','rotina','Ela chega em casa',
'Sua esposa chega em casa num dia comum. Ela não reclama de nada e vocês ainda têm a noite pela frente.',
'Como você tenderia a demonstrar que ficou feliz de vê-la?',{
PA:'Dizer: “Que bom que você chegou. Eu estava com saudade de você hoje.”',
QT:'Parar o que está fazendo e sentar alguns minutos para conversar com ela.',
RP:'Entregar uma coisinha que você trouxe porque lembrou dela durante o dia.',
FS:'Dizer que já deixou pronta uma tarefa que ela normalmente faria ao chegar.',
TF:'Recebê-la com um beijo e um abraço.'},['TF','PA'],
'Observar gesto espontâneo num reencontro cotidiano.',
'É a versão ativa da chegada: o respondente é quem demonstra o afeto.');

add('esp_pais_visita','espontanea','rotina','Seu pai ou sua mãe passa para uma visita',
'Seu pai ou sua mãe passa para uma visita tranquila, sem problema para resolver. Você quer demonstrar carinho naquele encontro.',
'O que surgiria primeiro em você?',{
PA:'Dizer alguma coisa que você valoriza nele e que nem sempre fala.',
QT:'Sentar para tomar um café e conversar sem ficar olhando o celular.',
RP:'Separar uma comida ou pequena coisa que sabe que ele gosta.',
FS:'Resolver uma coisinha prática que ele comentou estar precisando em casa.',
TF:'Recebê-lo com um abraço.'},['QT','PA'],
'Observar expressão de afeto em relação familiar adulta.',
'Amplia o instrumento além do casamento sem introduzir vulnerabilidade.','familia');

/* ============================== ROTINA — OBSERVO ========================== */
add('obs_casal_mais_velho','observo','rotina','Um casal depois de muitos anos juntos',
'Um casal mais velho está numa fase tranquila da vida. Em uma noite comum, um deles quer demonstrar que ainda presta atenção no outro.',
'Qual gesto lhe pareceria mais significativo como expressão de amor?',{
PA:'Dizer: “Depois de todos esses anos, eu ainda admiro muito você.”',
QT:'Fazer um café e sentar para conversar juntos sem televisão nem celular.',
RP:'Trazer uma pequena coisa porque viu e lembrou do outro.',
FS:'Resolver uma tarefa da casa que normalmente ficaria para o outro.',
TF:'Sentar ao lado e segurar a mão do outro enquanto conversam.'},['QT','PA'],
'Observar reconhecimento de amor em relação longa e cotidiana.',
'Terceiros e etapa de vida diferente reduzem projeção direta do próprio casamento.','casal-terceiro');

add('obs_irmaos_adultos','observo','rotina','Dois irmãos adultos mantendo a proximidade',
'Dois irmãos adultos têm rotinas bem diferentes, mas fazem questão de continuar próximos. Num encontro comum, um quer demonstrar carinho pelo outro.',
'Qual gesto lhe pareceria mais significativo?',{
PA:'Dizer: “Eu admiro muito a pessoa que você se tornou.”',
QT:'Chamar o irmão para tomar um café e colocar a conversa em dia.',
RP:'Levar uma comida ou pequena coisa que lembrou uma história dos dois.',
FS:'Ajudar a resolver uma pequena pendência que o irmão comentou.',
TF:'Cumprimentar o irmão com um abraço e uma mão no ombro.'},['PA','RP'],
'Observar amor fraterno adulto com manifestações ajustadas ao vínculo.',
'Diversifica Eu Observo para irmãos e testa Toque de modo natural.','irmaos');

/* ================================ MEMORIA ================================= */
add('mem_inicio_adulto','recordo','memoria','Uma lembrança do começo da vida adulta',
'Pense numa fase do início da sua vida adulta em que você estava começando trabalho, estudo, casamento ou outra responsabilidade importante.',
'Qual tipo de cuidado recebido tenderia a ficar mais vivo na sua memória?',{
PA:'Alguém dizer: “Eu acredito em você. Você vai aprender a lidar com isso.”',
QT:'Alguém separar tempo para ficar com você e ouvir sem pressa.',
RP:'Uma pequena lembrança que você guardou porque marcou aquela fase.',
FS:'Alguém ajudar de verdade em uma tarefa que estava pesando naquele começo.',
TF:'Um abraço de alguém próximo num momento em que você precisava de apoio.'},['PA','FS'],
'Cruzar memória afetiva de uma transição típica do início da vida adulta.',
'Olha para trás e reduz influência do casamento atual.','familia-ou-proximo');

add('mem_casamento_conectado','recordo','memoria','Uma fase em que vocês estavam muito conectados',
'Pense numa fase do casamento em que vocês se sentiram especialmente próximos, sem precisar ter sido uma viagem ou data especial.',
'O que tende a ficar mais vivo na sua memória daquela fase?',{
PA:'As coisas que ela dizia e que faziam você perceber o quanto era valorizado.',
QT:'Os momentos só de vocês, conversando ou fazendo coisas juntos sem pressa.',
RP:'Alguma pequena lembrança que acabou virando marca daquela fase.',
FS:'Uma atitude dela que tornou sua rotina mais leve sem você precisar pedir.',
TF:'Os beijos, abraços e carinhos que faziam parte daquela fase.'},['QT','TF'],
'Medir quais manifestações positivas se consolidam como memória conjugal.',
'Usa lembrança de conexão, não dor, conquista ou problema.');

add('mem_familia_cuidou','recordo','memoria','Quando sua família cuidou de você',
'Pense em algum período em que seu pai, sua mãe ou outra pessoa próxima da família fez você sentir claramente que se importava com você.',
'O que provavelmente permaneceria mais vivo na sua lembrança?',{
PA:'Uma frase como: “Tenho orgulho de você” ou “Você é muito importante para mim.”',
QT:'Um tempo em que a pessoa ficou com você sem pressa e sem distrações.',
RP:'Uma pequena coisa que ela trouxe porque sabia que você gostava.',
FS:'Uma ajuda concreta que tirou uma responsabilidade das suas costas.',
TF:'Um abraço ou carinho de alguém com quem esse afeto sempre foi natural.'},['PA','TF'],
'Cruzar preferência atual com memória familiar de cuidado.',
'Retira o cônjuge da cena e observa memória afetiva em vínculo de origem.','familia');

add('mem_transicao_trabalho','recordo','memoria','Uma mudança grande de rotina',
'Pense numa mudança de emprego, cidade, casa ou responsabilidade que exigiu adaptação sua em algum momento da vida adulta.',
'Qual forma de cuidado de alguém próximo tenderia a ficar mais marcada?',{
PA:'Ouvir: “Eu confio em você. Sei que vai encontrar seu jeito nessa fase.”',
QT:'Ter alguém por perto para conversar e passar tempo junto durante a adaptação.',
RP:'Receber uma pequena lembrança ligada ao começo daquela nova fase.',
FS:'Ter ajuda concreta para organizar alguma parte prática da mudança.',
TF:'Receber um abraço forte de alguém próximo nos dias mais cansativos.'},['FS','PA'],
'Medir memória de cuidado em transição adulta concreta.',
'Foca adaptação e mudança, diferente do início geral da vida adulta.','familia-ou-proximo','baixo','medio');

/* =============================== ALEGRIA — RECEBO ========================= */
add('alegria_reconhecimento_profissional','recebo','alegria','Uma conquista profissional',
'Depois de meses de dedicação, você recebe um reconhecimento no trabalho ou conclui um projeto que era importante para você.',
'Qual reação da sua esposa faria esse momento ter mais peso afetivo?',{
PA:'Dizer: “Tenho orgulho de você. Eu vi o quanto você trabalhou por isso.”',
QT:'Chamar você para sair, jantar ou tomar um café só para comemorar juntos.',
RP:'Dar uma pequena lembrança ligada ao seu trabalho, hobby ou àquela conquista.',
FS:'Cuidar de um detalhe da comemoração para você chegar e aproveitar.',
TF:'Dar um beijo e um abraço demorado quando você contar a notícia.'},['PA','RP'],
'Medir como ele prefere receber celebração de uma conquista profissional.',
'Conquista ligada ao trabalho, típica da faixa 35–44.');

add('alegria_projeto_pessoal','recebo','alegria','Você começa um projeto que queria há tempos',
'Você finalmente começa um curso, negócio, atividade física ou projeto pessoal que vinha adiando. Ainda não há resultado; só entusiasmo com o começo.',
'Qual reação da sua esposa faria você se sentir mais apoiado?',{
PA:'Dizer: “Eu gosto de ver você animado assim. Acho que isso combina muito com você.”',
QT:'Pedir para você mostrar o projeto e passar um tempo entendendo por que ele importa.',
RP:'Dar uma pequena coisa relacionada ao projeto ou ao hobby que você começou.',
FS:'Ajustar uma tarefa da rotina naquele dia para você conseguir começar com calma.',
TF:'Dar um abraço e um beijo, comemorando com você esse começo.'},['QT','RP'],
'Medir apoio a uma nova iniciativa antes de sucesso ou fracasso.',
'É alegria de começo, não conquista final ou reconhecimento externo.');

add('alegria_noticia_pessoal','recebo','alegria','Uma notícia boa que você estava esperando',
'Chega uma notícia boa sobre algo pessoal que você vinha esperando. Você conta para sua esposa ainda animado.',
'Qual reação dela faria você sentir que a alegria realmente foi compartilhada?',{
PA:'Dizer: “Que notícia boa! Eu sabia o quanto isso era importante para você.”',
QT:'Parar o que está fazendo e ficar com você comemorando por um tempo.',
RP:'Aparecer depois com seu doce ou bebida preferida para marcar o dia.',
FS:'Organizar uma pequena parte da comemoração para vocês não precisarem pensar nisso.',
TF:'Abraçar você na hora e comemorar com beijo e carinho.'},['TF','QT'],
'Observar compartilhamento da alegria em notícia aguardada.',
'Foca reação imediata a uma boa notícia, não trajetória profissional.');

/* ====================== ALEGRIA — RESPOSTA ESPONTANEA ===================== */
add('alegria_esposa_noticia','espontanea','alegria','Uma notícia muito boa da sua esposa',
'Sua esposa recebe uma notícia muito boa sobre algo em que vinha se dedicando e conta a você claramente feliz.',
'Qual atitude surgiria primeiro em você para comemorar com ela?',{
PA:'Dizer: “Tenho muito orgulho de você. Eu vi o quanto você correu atrás disso.”',
QT:'Chamá-la para sair ou separar um tempo para comemorar só vocês dois.',
RP:'Comprar uma flor, chocolate ou pequena lembrança ligada à conquista.',
FS:'Organizar uma pequena parte da comemoração para ela só aproveitar.',
TF:'Abraçá-la, beijá-la e comemorar junto naquele momento.'},['PA','TF'],
'Observar expressão espontânea de celebração conjugal.',
'Troca a direção da conquista: a vitória é da esposa.');

add('alegria_pai_noticia','espontanea','alegria','Uma pequena vitória do seu pai ou da sua mãe',
'Seu pai ou sua mãe conta uma notícia boa que representa uma vitória pessoal importante nessa fase da vida.',
'Como você tenderia a demonstrar que ficou feliz por ele?',{
PA:'Dizer: “Que bom! Eu fico muito orgulhoso de ver você conseguindo isso.”',
QT:'Convidá-lo para tomar um café e comemorar juntos sem pressa.',
RP:'Levar depois uma comida, livro ou pequena coisa de que ele gosta.',
FS:'Oferecer ajuda para organizar um detalhe da nova fase, se houver algo simples.',
TF:'Dar um abraço nele quando vocês se encontrarem.'},['PA','QT'],
'Observar celebração em vínculo intergeracional.',
'Faz a etapa de vida aparecer por meio dos pais sem presumir filhos.','familia','baixo','medio');

const DATA={version:VER,instrumentId:ID,codes:C,labels:L,perspectiveLabels:PL,natureLabels:NL,instructions:INST,slots:SLOTS,families:F,
  profile:{sexo:'masculino',estadoCivil:'casado',faixaEtaria:'35 a 44',segmento:'homem-casado',tom:'adulto-direto'}};

/* Permite que o mesmo arquivo seja auditado pelo Node no build. */
if(typeof module==='object' && module.exports){module.exports=DATA;return;}
if(!global)return;
global.V51_DATA=DATA;

/* =============================== MOTOR V5.1 =============================== */
let originalBank=null,originalInstrument=null,secondUI=false;
const idxF=new Map(F.map(f=>[f.id,f]));

function isTargetAge(v){return String(v||'').trim()==='35 a 44';}
function targetFromForm(){
  try{return estado.sexo==='masculino' && estado.civil==='casado' && isTargetAge(document.querySelector('#in-idade').value);}catch(_){return false;}
}
function active(){
  try{return estado.sexo==='masculino' && estado.civil==='casado' && isTargetAge(estado.idade);}catch(_){return false;}
}
function hash(s){let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function participantOffset(){return hash((estado.codigo||'')+'|'+(estado.nome||'')+'|'+(estado.contato||''))%5;}
function rotate(arr,k){return arr.slice(k).concat(arr.slice(0,k));}
function baseOrder(slotN,offset){return rotate(C,((slotN-1)+(offset||0))%5);}
function optionMap(f,slotN,offset){
  return baseOrder(slotN,offset).map((code,i)=>({letra:String.fromCharCode(65+i),codigo:code,texto:f.options[code]}));
}
function canonical(slot){
  const f=idxF.get(slot.representative);
  return {n:slot.n,titulo:f.title,situacao:f.situation,pergunta:f.question,alternativas:optionMap(f,slot.n,0),permite_pular:false,
    _v51:{family:f.id,perspective:slot.perspective,nature:slot.nature,fn:slot.fn,status:f.status}};
}
function hypothesis(beforeIndex){
  const scores={PA:0,QT:0,RP:0,FS:0,TF:0};
  if(typeof estado==='undefined')return {scores,order:C.slice(),top:C.slice(0,2),gap:0};
  for(let i=0;i<beforeIndex;i++){
    const e=estado.escolhas[i];
    if(e&&e.primeira&&scores[e.primeira]!==undefined)scores[e.primeira]+=1;
    /* Segunda escolha fica salva como dado bruto e NÃO altera a hipótese nesta etapa da pesquisa. */
  }
  const order=C.slice().sort((a,b)=>scores[b]-scores[a] || C.indexOf(a)-C.indexOf(b));
  return {scores,order,top:order.slice(0,2),gap:scores[order[0]]-scores[order[1]]};
}
function perspectiveLeaders(beforeIndex){
  const by={};
  for(let i=0;i<beforeIndex;i++){
    const e=estado.escolhas[i]; if(!e||!e.primeira||!e._v51Perspective)continue;
    by[e._v51Perspective] ||= {PA:0,QT:0,RP:0,FS:0,TF:0};
    by[e._v51Perspective][e.primeira]++;
  }
  return Object.fromEntries(Object.entries(by).map(([p,s])=>[p,C.slice().sort((a,b)=>s[b]-s[a])[0]]));
}
function adaptiveFunction(slot,index){
  if(slot.fn!=='resolver_inconsistencia')return slot.fn;
  const vals=Object.values(perspectiveLeaders(index));
  return new Set(vals).size>1?'resolver_inconsistencia':'confirmar';
}
function chooseFamily(slot,index){
  const used=new Set((estado.escolhas||[]).slice(0,index).map(e=>e&&e._v51Family).filter(Boolean));
  let cand=F.filter(f=>f.perspective===slot.perspective && f.nature===slot.nature && !used.has(f.id));
  if(!cand.length)cand=F.filter(f=>f.perspective===slot.perspective && f.nature===slot.nature);
  const h=hypothesis(index), top=h.top, fn=adaptiveFunction(slot,index);
  const prev=index>0?estado.escolhas[index-1]:null;
  cand.sort((a,b)=>score(b)-score(a) || a.id.localeCompare(b.id));
  function score(f){
    let s=0;
    const both=top.every(x=>f.targets.includes(x));
    const leader=f.targets.includes(top[0]), runner=f.targets.includes(top[1]);
    if(index<5)s+=new Set(f.targets).size*0.2;
    if(fn==='diferenciar'){if(both)s+=12; else if(leader||runner)s+=5;}
    if(fn==='contraprovar'){if(leader)s+=9;if(runner)s+=4;if(both)s+=4;}
    if(fn==='confirmar'){if(leader)s+=8;if(runner)s+=2;}
    if(fn==='cruzar'){if(leader||runner)s+=5;}
    if(fn==='resolver_inconsistencia'){if(both)s+=12;else if(leader||runner)s+=6;}
    if(prev&&prev._v51Relation===f.relation)s-=1.5;
    if(prev&&prev._v51Family===f.id)s-=20;
    s+=(hash((estado.codigo||'')+'|'+slot.n+'|'+f.id)%1000)/100000;
    return s;
  }
  return {family:cand[0]||idxF.get(slot.representative),hyp:h,fn};
}
function prepare(index){
  if(!active() || index<0 || index>=20)return;
  const e=estado.escolhas[index];
  if(e&&e._v51Family)return;
  const slot=SLOTS[index],pick=chooseFamily(slot,index),f=pick.family;
  const q={n:slot.n,titulo:f.title,situacao:f.situation,pergunta:f.question,alternativas:optionMap(f,slot.n,participantOffset()),permite_pular:false,
    _v51:{family:f.id,perspective:slot.perspective,nature:slot.nature,fn:pick.fn,status:f.status}};
  cenariosAtuais[index]=q;
  Object.assign(e,{
    n:slot.n,_v51Family:f.id,_v51Perspective:slot.perspective,_v51Nature:slot.nature,_v51Fn:pick.fn,
    _v51HypBefore:JSON.parse(JSON.stringify(pick.hyp.scores)),_v51Targets:f.targets.slice(),_v51Relation:f.relation,
    _v51SecondMode:false,_v51SecondAnswered:false
  });
}

/* O banco V5.1 só é entregue ao perfil piloto. Outros perfis mantêm o banco atual. */
try{
  originalBank=BANCO.segmentos['homem-casado'].cenarios;
  originalInstrument=BANCO.instrumento_id;
  const btnContinue=document.querySelector('#btn-continuar');
  if(btnContinue)btnContinue.addEventListener('click',function(){
    if(targetFromForm()){
      BANCO.segmentos['homem-casado'].cenarios=SLOTS.map(canonical);
      BANCO.instrumento_id=ID;
      document.body.classList.add('v51-active');
    }else{
      BANCO.segmentos['homem-casado'].cenarios=originalBank;
      BANCO.instrumento_id=originalInstrument;
      document.body.classList.remove('v51-active');
    }
  },true);
}catch(err){console.error('[V5.1] preparação do banco:',err);}

/* Estilo mínimo: preserva o layout e só reduz elementos metodológicos visíveis. */
const st=document.createElement('style');
st.textContent=`
.v51-active .opt .letra{display:none!important}
.v51-second-box{margin:14px 0 2px;padding:14px;border:1px solid var(--linha);border-radius:11px;background:rgba(201,191,180,.035)}
.v51-second-box p{font-size:14px;color:var(--osso2);margin:0 0 10px;line-height:1.45}
.v51-second-actions{display:flex;gap:8px;flex-wrap:wrap}
.v51-second-actions .btn{width:auto;flex:1;min-width:150px;padding:11px 12px;font-size:13.5px}
.v51-active .opt:disabled{cursor:default}
.v51-admin-matrix{margin-top:18px}
.v51-admin-item{border-top:1px solid var(--linha);padding:14px 0}
.v51-admin-item:first-child{border-top:0}
.v51-admin-item dl{display:grid;grid-template-columns:minmax(120px,180px) 1fr;gap:6px 12px;font-size:13px}
.v51-admin-item dt{color:var(--mut);font-family:var(--mono)}
.v51-admin-item dd{color:var(--osso2)}
`;
document.head.appendChild(st);

/* Reescreve apenas o motor de renderização; o layout HTML e a devolutiva permanecem do app original. */
try{
  const baseRender=renderCenario;
  renderCenario=function(){
    if(active())prepare(estado.i);
    baseRender();
    if(active())decorateQuestion();
  };
}catch(err){console.error('[V5.1] render:',err);}

function decorateQuestion(){
  const e=estado.escolhas[estado.i],slot=SLOTS[estado.i];
  const etapa=document.querySelector('.etapa');
  if(!e||!slot)return;
  document.body.classList.add('v51-active');
  if(!e.primeira){
    if(etapa)etapa.textContent=INST[slot.perspective];
    return;
  }
  if(e.segunda){e._v51SecondAnswered=true;e._v51SecondMode=true;}
  const opts=[...document.querySelectorAll('#area-cenario .opt')];
  let box=document.querySelector('#v51-second-box');
  if(!box){
    box=document.createElement('div');box.id='v51-second-box';box.className='v51-second-box';
    const optsWrap=document.querySelector('#area-cenario .opts');
    if(optsWrap)optsWrap.insertAdjacentElement('afterend',box);
  }
  const advance=document.querySelector('#btn-avancar');
  if(e._v51SecondMode){
    if(etapa)etapa.innerHTML='Se outra atitude também combina bastante com você, marque agora a <strong>segunda escolha</strong>.';
    box.innerHTML='<p>A segunda escolha é opcional e será guardada separadamente da primeira.</p>';
    opts.forEach(b=>{const code=b.dataset.c;b.disabled=(code===e.primeira);b.classList.remove('apagado');});
    if(advance)advance.disabled=!e.segunda;
    return;
  }
  if(e._v51SecondAnswered){
    if(etapa)etapa.textContent='Primeira e segunda escolhas registradas.';
    box.innerHTML='<p>Segunda escolha registrada. Ela ficará separada da sua primeira resposta.</p>';
    if(advance)advance.disabled=false;
    return;
  }
  if(etapa)etapa.textContent='Sua primeira escolha foi registrada.';
  opts.forEach(b=>{if(b.dataset.c!==e.primeira)b.disabled=true;});
  box.innerHTML='<p><strong>Tem uma segunda alternativa que também combina bastante com você?</strong></p><div class="v51-second-actions"><button type="button" class="btn ghost" id="v51-sim">Sim, escolher uma segunda</button><button type="button" class="btn" id="v51-nao">Não, avançar</button></div>';
  if(advance)advance.disabled=true;
  document.querySelector('#v51-sim')?.addEventListener('click',()=>{e._v51SecondMode=true;renderCenario();});
  document.querySelector('#v51-nao')?.addEventListener('click',()=>{e._v51SecondAnswered=true;e._v51SecondMode=false;e.segunda=null;avancar();});
}

/* Enriquece o dado bruto no Supabase sem misturar primeira e segunda escolhas. */
try{
  const baseDetalhes=escolhasDetalhadas;
  escolhasDetalhadas=function(){
    const arr=baseDetalhes();
    if(!active())return arr;
    return arr.map((x,i)=>{
      const e=estado.escolhas[i]||{},c=cenariosAtuais[i]||{},f=idxF.get(e._v51Family),slot=SLOTS[i];
      return Object.assign({},x,{
        scenario_id:e._v51Family||null,perfil:'homem-casado-35-44',faixa_etaria_metodologica:'35-44',
        perspectiva:e._v51Perspective||slot?.perspective||null,natureza:e._v51Nature||slot?.nature||null,
        funcao_adaptativa:e._v51Fn||slot?.fn||null,hipotese_antes:e._v51HypBefore||null,
        alvo_adaptativo:e._v51Targets||null,relacao:f?.relation||null,
        mapa_posicoes:(c.alternativas||[]).map((a,pos)=>({posicao:pos+1,codigo:a.codigo})),
        segunda_usada_na_hipotese:false,versao_motor:VER,status_validacao:f?.status||null
      });
    });
  };
}catch(err){console.error('[V5.1] dados detalhados:',err);}

/* Garante identificação inequívoca da versão salva. */
const originalFetch=global.fetch;
if(originalFetch){
  global.fetch=async function(input,init){
    if(active() && init && typeof init.body==='string' && String(input).includes('linguagem_amor_v3')){
      try{
        const body=JSON.parse(init.body),rows=Array.isArray(body)?body:[body];
        rows.forEach(r=>{if(r&&typeof r==='object'){r.versao_questionario=VER;r.instrumento_id=ID;}});
        init=Object.assign({},init,{body:JSON.stringify(Array.isArray(body)?rows:rows[0])});
      }catch(_){ }
    }
    return originalFetch.call(this,input,init);
  };
}

/* ============================ MATRIZ ADMINISTRATIVA ======================== */
function esc51(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function injectAdminMatrix(){
  const adm=document.querySelector('#tela-admin');
  if(!adm || adm.classList.contains('oculto') || document.querySelector('#v51-admin-matrix'))return;
  const box=document.createElement('details');box.id='v51-admin-matrix';box.className='card v51-admin-matrix';
  box.innerHTML='<summary style="cursor:pointer;font-family:var(--display);font-weight:800">Matriz metodológica V5.1 · Homem / Casado / 35–44</summary>'+
    '<p class="lead" style="margin-top:10px;font-size:13.5px">Mapa-base administrativo. A ordem A–E recebe um deslocamento individual por participante, mantendo cada linguagem exatamente 4 vezes em cada posição ao longo das 20 etapas. A situação concreta é escolhida adaptativamente dentro da missão metodológica de cada etapa.</p>'+
    SLOTS.map((slot,i)=>{
      const f=idxF.get(slot.representative),order=baseOrder(slot.n,0);
      return '<div class="v51-admin-item"><h3>Cenário '+slot.n+' · '+esc51(f.title)+'</h3><dl>'+
        '<dt>Perspectiva</dt><dd>'+esc51(PL[slot.perspective])+'</dd>'+
        '<dt>Categoria emocional</dt><dd>'+esc51(NL[slot.nature])+'</dd>'+
        '<dt>Função adaptativa</dt><dd>'+esc51(slot.fn)+'</dd>'+
        '<dt>Objetivo do item</dt><dd>'+esc51(f.objective)+'</dd>'+
        order.map((code,pos)=>'<dt>Linguagem opção '+(pos+1)+'</dt><dd>'+esc51(L[code])+'</dd>').join('')+
        '<dt>Por que é diferente</dt><dd>'+esc51(f.difference)+'</dd>'+
        '<dt>Desejabilidade social</dt><dd>'+esc51(f.socialRisk)+'</dd>'+
        '<dt>Risco de privilégio</dt><dd>'+esc51(f.biasRisk)+'</dd>'+
        '<dt>Status</dt><dd>'+esc51(f.status)+'</dd></dl></div>';
    }).join('');
  adm.appendChild(box);
}
setInterval(injectAdminMatrix,1400);

console.info('[V5.1] motor adaptativo carregado',VER,ID);
})(typeof window!=='undefined'?window:null);
