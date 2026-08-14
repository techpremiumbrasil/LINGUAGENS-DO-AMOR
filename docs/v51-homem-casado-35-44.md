# V5.1 — Homem / Casado / 35–44

Status: **piloto em pesquisa**. Não replicar para outros perfis antes de aprovação.

## Princípios congelados

- 20 etapas por sessão.
- 9 `Eu Recebo`, 6 `Resposta Espontânea`, 3 `Eu Recordo`, 2 `Eu Observo`.
- 6 `Privação / dor afetiva`, 3 `Vulnerabilidade circunstancial`, 5 `Rotina`, 3 `Alegria / conquista`, 3 `Memória / reconexão / observação neutra`.
- O motor escolhe a situação concreta adaptativamente dentro da missão metodológica de cada etapa.
- Funções possíveis da próxima pergunta: `explorar`, `diferenciar`, `contraprovar`, `confirmar`, `cruzar`, `resolver_inconsistencia`.
- A hipótese adaptativa usa somente a primeira escolha nesta fase da pesquisa.
- A segunda escolha é opcional, armazenada separadamente e não altera automaticamente a hipótese nem a pontuação final.
- Linguagens não são exibidas ao participante.
- A ordem das cinco alternativas recebe um deslocamento individual por participante. O desenho mantém cada linguagem exatamente quatro vezes em cada posição ao longo de 20 etapas.
- O layout e a devolutiva final permanecem os do aplicativo existente.

## Matriz das 20 missões

| # | Perspectiva | Categoria | Função | Cenário representativo | Objetivo principal |
|---|---|---|---|---|---|
| 1 | Eu Recebo | Privação | explorar | Quando a rotina vai apagando algumas coisas | Comparar a dor causada pela ausência das cinco formas de afeto. |
| 2 | Resposta Espontânea | Rotina | explorar | Carinho sem ocasião especial | Observar como ele demonstra carinho sem estímulo externo. |
| 3 | Eu Recebo | Vulnerabilidade | explorar | Uma decisão profissional importante | Medir apoio afetivo depois de a parte prática já estar encaminhada. |
| 4 | Eu Recordo | Memória | cruzar | Uma lembrança do começo da vida adulta | Cruzar preferências atuais com memória formativa. |
| 5 | Eu Recebo | Privação | explorar | Quando o casamento começa a parecer automático | Investigar qual ausência mais transforma casamento em mera convivência. |
| 6 | Resposta Espontânea | Alegria | diferenciar | Uma notícia muito boa da sua esposa | Separar linguagens próximas na forma de celebrar quem ele ama. |
| 7 | Eu Observo | Privação | contraprovar | Um casal de amigos vai se afastando | Ver qual privação ele reconhece como mais dolorosa olhando de fora. |
| 8 | Eu Recebo | Rotina | diferenciar | Uma noite comum em casa | Linha de base cotidiana para diferenciar hipóteses líderes. |
| 9 | Resposta Espontânea | Vulnerabilidade | cruzar | Sua esposa perde uma oportunidade | Mudar a direção: de receber cuidado para oferecê-lo. |
| 10 | Eu Recebo | Privação | contraprovar | Quando algo importante passa em branco | Testar a hipótese líder através da dor de não ser lembrado. |
| 11 | Eu Recordo | Memória | cruzar | Uma fase em que vocês estavam muito conectados | Observar o que se consolida como memória positiva conjugal. |
| 12 | Resposta Espontânea | Rotina | diferenciar | Um sábado normal de vocês | Confrontar formas de carinho em contexto doméstico neutro. |
| 13 | Eu Recebo | Alegria | confirmar | Uma conquista profissional | Confirmar ou enfraquecer a hipótese em celebração adulta. |
| 14 | Eu Observo | Rotina | cruzar | Um casal depois de muitos anos juntos | Reconhecer amor em terceiros e em outra etapa de vida. |
| 15 | Resposta Espontânea | Privação | contraprovar | Ela diz que vocês estão distantes | Testar como ele tenta reconstruir proximidade. |
| 16 | Eu Recebo | Vulnerabilidade | diferenciar | Esperando uma resposta importante | Diferenciar linguagens quando nenhuma ação resolve o problema. |
| 17 | Eu Recordo | Memória | resolver_inconsistencia | Quando sua família cuidou de você | Resolver divergências entre receber, expressar e observar. |
| 18 | Resposta Espontânea | Rotina | confirmar | Ela chega em casa | Confirmar padrão em reencontro cotidiano. |
| 19 | Eu Recebo | Privação | contraprovar | Quando uma forma de carinho desaparece | Isolar qual privação realmente pesa mais quando as demais continuam. |
| 20 | Eu Recebo | Alegria | confirmar | Você começa um projeto que queria há tempos | Fechar a investigação em um contexto positivo de início e apoio. |

## Banco adaptativo

A V5.1 contém **31 famílias de cenários** para este único perfil. Uma sessão usa 20 delas. O motor só escolhe famílias que respeitem a perspectiva e a categoria emocional definidas para aquela etapa.

Exemplos de famílias adicionais usadas para contraprovas e diferenciação:

- `priv_sem_interesse`
- `priv_esposa_se_sente_esquecida`
- `obs_casal_anos_juntos`
- `vul_despesa_planejada`
- `vul_pai_exame`
- `rot_chegada_casa`
- `esp_pais_visita`
- `obs_irmaos_adultos`
- `mem_transicao_trabalho`
- `alegria_noticia_pessoal`
- `alegria_pai_noticia`

## Linguagem pública

As alternativas foram reescritas para ações e falas observáveis, por exemplo:

- `Dar um beijo e um abraço demorado.`
- `Dizer: “Tenho orgulho de você. Eu vi o quanto você trabalhou por isso.”`
- `Deixar o celular de lado e conversar.`
- `Preparar o jantar naquela noite.`
- `Trazer o chocolate ou uma coisinha que sabe que ela gosta.`

Evitar no conteúdo destinado ao participante expressões como `oferecer proximidade física`, `contato acolhedor`, `materializar o cuidado`, `nomear um esforço`, `algo simbólico` como fórmula repetida.

## Segunda escolha

Fluxo obrigatório por item:

1. participante escolhe a primeira alternativa;
2. interface pergunta: **“Tem uma segunda alternativa que também combina bastante com você?”**;
3. `Sim, escolher uma segunda` libera uma segunda seleção, sem permitir repetir a primeira;
4. `Não, avançar` segue imediatamente;
5. primeira e segunda ficam armazenadas separadamente;
6. a segunda não entra na hipótese adaptativa nem altera a pontuação principal nesta fase.

## Auditoria automática

O build executa `node scripts/validar-v51.cjs` antes de gerar o site. O deploy falha se ocorrer qualquer um destes problemas críticos:

- perda das quotas de perspectiva;
- perda das quotas emocionais;
- menos de 20 missões;
- família incompatível com a missão;
- pool adaptativo insuficiente;
- falta de uma das cinco linguagens em uma família;
- algum dos 15 controles metodológicos marcado como não aprovado;
- expressão artificial proibida no texto público;
- nome de linguagem exposto ao participante;
- perda do balanceamento A–E;
- perspectivas excessivamente agrupadas;
- perfil piloto diferente de Homem / Casado / 35–44.

## Metadados armazenados por resposta V5.1

Além dos campos já existentes, cada escolha guarda no JSON bruto:

- `scenario_id`;
- `perfil`;
- `faixa_etaria_metodologica`;
- `perspectiva`;
- `natureza`;
- `funcao_adaptativa`;
- `hipotese_antes`;
- `alvo_adaptativo`;
- `relacao`;
- `mapa_posicoes`;
- `segunda_usada_na_hipotese: false`;
- `versao_motor`;
- `status_validacao`.

Isso permite reconstruir posteriormente por que uma determinada pergunta foi exibida, sem transformar a segunda escolha em pontuação definitiva antes da decisão metodológica.
