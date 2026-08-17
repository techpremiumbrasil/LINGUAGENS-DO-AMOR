# V5.3 — Calibração Empírica

Base congelada: **V5.2-a1**.

Backup estável: `backup/v5.2-a1-stable`.

## Regra de governança

A V5.3 não substitui a arquitetura da V5.2. Ela atua somente sobre as 14 famílias classificadas empiricamente como `RECONSTRUIR` ou `REVISAR` na Matriz de Calibração Empírica V5.2.

### RECONSTRUIR — 6 famílias

- `alegria_conquista`
- `alegria_familia`
- `vul_decisao_fase`
- `priv_pessoa_distante`
- `esp_sabado_normal`
- `priv_pessoa_esquecida`

### REVISAR — 8 famílias

- `rot_fimsemana`
- `mem_conexao`
- `mem_familia`
- `vul_pessoa_frustracao`
- `esp_reencontro`
- `alegria_noticia`
- `mem_transicao`
- `priv_momento_passou`

As demais 18 famílias continuam usando integralmente a redação da V5.2.

## A/B

Para cada uma das 14 famílias, a atribuição A/B é determinística por participante + família:

- **A** = redação V5.2 preservada;
- **B** = redação calibrada V5.3.

Isso permite comparar a nova redação com a referência sem apagar o controle histórico.

## O que a V5.3 tenta corrigir

- retirar de `alegria_conquista` e `alegria_familia` a vantagem semântica imediata de Palavras de Afirmação;
- retirar de `vul_decisao_fase` a resposta verbal que reproduzia diretamente a necessidade do cenário;
- retirar de `priv_pessoa_distante` e `priv_pessoa_esquecida` a reciprocidade verbal induzida pela própria fala do outro;
- retirar de `esp_sabado_normal` e `rot_fimsemana` a premissa de tempo livre que favorecia Qualidade de Tempo;
- representar Receber Presentes como evidência de lembrança e atenção a detalhes, e não como simples mimo genérico;
- reduzir desejabilidade social em conquista, vulnerabilidade e reconexão.

## Dados adicionais da V5.3

Cada item salva no JSON bruto:

- `familia_base`;
- `calibracao_status`;
- `calibracao_variante`;
- `calibracao_experimento`;
- `calibracao_patch`;
- `versao_calibracao`;
- `item_inicio`;
- `item_ultima_saida`;
- `item_tempo_ativo_ms`;
- `item_visitas`.

A hipótese adaptativa e a pontuação principal continuam usando apenas a primeira escolha, como na V5.2.

## Feedback cognitivo

A tela final recebe um bloco opcional sobre:

- resposta que pareceu mais correta/adequada;
- cenário sem alternativa representativa;
- alternativa confusa/artificial;
- naturalidade de Presentes;
- utilidade da segunda escolha;
- comentário aberto.

O feedback não altera o resultado.

## Rollback

Se a V5.3 apresentar falha funcional ou metodológica, restaurar a `main` para o commit congelado da branch:

`backup/v5.2-a1-stable`

A V5.2 original não foi reescrita nem apagada.
