# Instrumento das Cinco Linguagens do Amor — v3.1

Aplicação web para coleta, cálculo e análise das respostas do instrumento das cinco linguagens do amor.

## Estado atual

- 8 conjuntos de perguntas por sexo e estado civil.
- 20 situações por participante.
- Primeira escolha obrigatória e segunda escolha opcional.
- Cálculo de resultado com estados definido, empate, distribuído e inconclusivo.
- Persistência das respostas no Supabase.
- Painel de pesquisa protegido por autenticação do Supabase.
- Exportação em CSV, filtros e consulta individual.
- Versionamento do instrumento e preservação do texto integral respondido.

## Estrutura

```
index.html              aplicação principal e painel de pesquisa
config.exemplo.js       modelo de configuração local
netlify.toml            build e cabeçalhos de segurança
scripts/gerar-config.sh gera o config.js durante o deploy
robots.txt              bloqueia indexação por buscadores
_redirects              fallback do Netlify
banco/                  scripts SQL do Supabase
```

## Publicação

A arquitetura oficial desta versão é:

GitHub → Netlify → Supabase

O Netlify publica diretamente a raiz do repositório. O arquivo `config.js` não deve ser versionado: ele é gerado no deploy a partir das variáveis de ambiente.

Variáveis exigidas no Netlify:

| Variável | Valor |
|---|---|
| `SUPABASE_URL` | Project URL do projeto Supabase |
| `SUPABASE_KEY` | chave publishable/anon pública |

Nunca use `service_role` no frontend.

## Banco de dados

O projeto usa:

- `linguagem_amor_instrumento`: versões completas do instrumento.
- `linguagem_amor_v3`: respostas dos participantes.
- `linguagem_amor_admins`: base reservada para evolução do controle administrativo.

A chave pública pode inserir respostas. A leitura e exclusão continuam restritas a usuário autenticado, conforme as políticas RLS existentes.

O projeto Supabase de produção já recebeu hardening aditivo em 13/08/2026:

- tabela administrativa reservada;
- campos `origem` e `user_agent` preparados para auditoria;
- índices adicionais para consultas por data/segmento e linguagem principal.

Nenhuma resposta existente foi removida ou alterada.

## Segurança

O deploy Netlify usa cabeçalhos adicionais:

- `X-Frame-Options`;
- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `Cross-Origin-Opener-Policy`;
- `X-Robots-Tag`;
- `Cache-Control: no-store` para configuração e área administrativa.

O cadastro público de usuários no Supabase Auth deve permanecer desativado.

O advisor de segurança do Supabase aponta somente uma recomendação operacional pendente: habilitar proteção contra senhas conhecidas como vazadas no Auth.

## Painel de pesquisa

Acesse `#admin` ao final da URL publicada e entre com um usuário existente no Supabase Auth.

O painel permite:

- distribuição das linguagens;
- contagem por conjunto;
- tempo médio de resposta;
- busca por nome/código;
- filtros por sexo e estado civil;
- consulta detalhada;
- exportação CSV;
- exclusão autenticada.

## Versionamento do instrumento

O identificador do instrumento é derivado do próprio conteúdo. Se qualquer situação ou alternativa mudar, deve ser publicada uma nova versão em vez de sobrescrever silenciosamente a anterior. Dessa forma, respostas históricas permanecem vinculadas ao conteúdo efetivamente respondido.

## Regra de manutenção

Não alterar perguntas, alternativas ou regras de pontuação diretamente em produção sem criar nova versão do instrumento e validar o impacto histórico.
