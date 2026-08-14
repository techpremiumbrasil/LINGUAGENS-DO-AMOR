# V5.2 — Cobertura universal do motor adaptativo

Status: **metodologia V5.1 aprovada e expandida para todos os perfis do cadastro**.

## Cobertura

A V5.2 habilita o motor adaptativo para todas as combinações disponíveis no formulário:

- 2 sexos: Feminino e Masculino;
- 4 estados civis: Solteiro(a), Casado(a), Divorciado(a) e Viúvo(a);
- 6 faixas etárias: 18–24, 25–34, 35–44, 45–54, 55–64 e 65 ou mais;
- total: **48 perfis metodológicos**.

Cada um dos 8 segmentos possui as 6 faixas etárias:

- Mulher · Solteira;
- Mulher · Casada;
- Mulher · Divorciada;
- Mulher · Viúva;
- Homem · Solteiro;
- Homem · Casado;
- Homem · Divorciado;
- Homem · Viúvo.

## O que permanece congelado

Todos os 48 perfis preservam exatamente:

- 20 etapas por sessão;
- 9 `Eu Recebo`;
- 6 `Resposta Espontânea`;
- 3 `Eu Recordo`;
- 2 `Eu Observo`;
- 6 cenários de `Privação / dor afetiva`;
- 3 de `Vulnerabilidade circunstancial`;
- 5 de `Rotina / cotidiano`;
- 3 de `Alegria / conquista`;
- 3 de `Memória / reconexão / observação neutra`;
- funções adaptativas `explorar`, `diferenciar`, `contraprovar`, `confirmar`, `cruzar` e `resolver_inconsistencia`;
- segunda escolha opcional, armazenada separadamente e fora da hipótese/pontuação principal;
- balanceamento de posição: cada linguagem aparece exatamente quatro vezes em cada posição A–E ao longo das 20 etapas;
- nomes das cinco linguagens ocultos do participante.

## Como a adaptação foi transferida

A V5.2 não mantém 48 cópias literais do mesmo questionário. Existe uma matriz metodológica única e um gerador de perfil que adapta o conteúdo público antes de iniciar a sessão.

### Sexo

Ajusta concordância e linguagem dirigida ao participante, por exemplo `amado/amada`, `cuidado/cuidada`, `valorizado/valorizada`, `animado/animada` e outras construções equivalentes.

### Estado civil

- **Casado(a):** cenários primários podem usar diretamente `sua esposa` ou `seu marido` e contexto conjugal.
- **Solteiro(a):** usa pessoas próximas, família, amizade ou relacionamento afetivo sem presumir namoro atual.
- **Divorciado(a):** usa vínculos importantes da vida atual; memórias não obrigam o participante a retornar ao casamento anterior.
- **Viúvo(a):** usa vínculos atuais e, nas perguntas de memória, evita obrigar acesso a lembranças de perda; o texto orienta a escolher uma lembrança confortável.

Cenários de observação podem usar terceiros — casal, irmãos e outros vínculos — porque a função metodológica é avaliar o significado percebido de fora.

### Faixa etária

O contexto concreto muda sem alterar a função psicométrica:

- **18–24:** estudo, primeiro trabalho, independência, mudanças rápidas e início da vida adulta;
- **25–34:** construção de carreira, vida financeira, casa, relacionamentos e projetos;
- **35–44:** consolidação profissional, família, compromissos financeiros e projetos de longo prazo;
- **45–54:** experiência profissional, reavaliação de prioridades e responsabilidades com pessoas próximas;
- **55–64:** mudanças de ritmo, saúde, finanças, família e novos projetos;
- **65+:** autonomia, saúde, rotina, família, amizades e projetos que continuam relevantes.

Nenhuma faixa presume obrigatoriamente filhos, aposentadoria, pais vivos, doença ou relacionamento amoroso atual.

## Banco adaptativo

Cada perfil é gerado com **32 famílias de cenários**. Uma sessão utiliza 20, selecionadas conforme:

1. missão metodológica da etapa;
2. perspectiva obrigatória;
3. categoria emocional obrigatória;
4. hipótese líder e segunda hipótese antes da pergunta;
5. função adaptativa da etapa;
6. famílias já utilizadas;
7. relação utilizada na etapa anterior, para reduzir repetição de contexto.

A hipótese adaptativa continua usando somente a **primeira escolha** nesta fase da pesquisa.

## Metadados salvos

Cada resposta V5.2 registra, além dos campos existentes:

- `scenario_id`;
- `perfil`;
- `sexo_metodologico`;
- `estado_civil_metodologico`;
- `faixa_etaria_metodologica`;
- `tom_etario`;
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

O `instrumento_id` identifica também o perfil específico, por exemplo:

`v5.2-adaptativo-universal-a1|homem-casado-25-34`

## Auditoria automática

O Netlify executa `node scripts/validar-v52.cjs` antes de publicar.

O deploy falha se qualquer um dos 48 perfis perder:

- cobertura das 20 etapas;
- quotas 9/6/3/2;
- quotas emocionais 6/3/5/3/3;
- uma das cinco linguagens em qualquer família;
- compatibilidade entre família e missão;
- pool adaptativo suficiente;
- balanceamento A–E;
- intercalamento de perspectivas;
- adaptação etária;
- adaptação de sexo/estado civil;
- controles metodológicos críticos;
- linguagem pública humana;
- proteção contra exposição do nome das linguagens.

Também é bloqueada referência direta a `sua esposa`, `seu marido` ou `casamento` em famílias primárias de perfis não casados.

## Arquivos ativos

- `v52-adaptive.js` — gerador de perfis e motor adaptativo;
- `scripts/validar-v52.cjs` — auditor de 48 perfis;
- `scripts/gerar-config.sh` — injeta somente a V5.2 no artefato publicado;
- `netlify.toml` — exige auditoria V5.2 antes do deploy.

A V5.1 permanece no repositório apenas como referência/rollback e não deve ser injetada no build atual.