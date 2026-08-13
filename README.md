# Instrumento das Cinco Linguagens do Amor — v3.0

Aplicação de página única para coleta das respostas do instrumento.
Piloto interno.

## Estrutura

```
index.html              a aplicação inteira (8 conjuntos embutidos)
config.exemplo.js       modelo de configuração
netlify.toml            build e cabeçalhos de segurança
scripts/gerar-config.sh gera o config.js na publicação
robots.txt              bloqueia indexação por buscadores
_redirects              rotas do Netlify
banco/                  scripts SQL do Supabase
```

## Como funciona

Cada participante informa sexo e estado civil, e a aplicação seleciona
automaticamente um dos 8 conjuntos de 20 situações. Em cada situação há
5 alternativas, uma por linguagem: primeira escolha obrigatória, segunda
opcional.

Cada resposta é gravada com o texto integral da situação, da pergunta e
das alternativas marcadas, além do identificador da versão do
instrumento. As respostas continuam legíveis mesmo que as perguntas
sejam alteradas depois.

## Configuração

O arquivo `config.js` **não fica no repositório**. Ele é gerado na
publicação a partir de duas variáveis de ambiente definidas no Netlify:

| Variável | Onde encontrar no Supabase |
|---|---|
| `SUPABASE_URL` | Project Settings → Data API → Project URL |
| `SUPABASE_KEY` | Project Settings → API Keys → anon / public |

A chave `anon` só tem permissão de inserir respostas. Não lê, não exporta
e não apaga. A chave `service_role` nunca deve ser usada aqui.

Para rodar na sua máquina, copie `config.exemplo.js` como `config.js` e
preencha os dois valores.

## Banco de dados

Rode os arquivos de `banco/` no SQL Editor do Supabase, nesta ordem:

1. `supabase-v3.sql` — tabelas, índices e políticas de acesso
2. `supabase-v3-instrumento.sql` — grava a versão do instrumento (opcional)

Ler e excluir respostas exige usuário autenticado no Supabase Auth.
O cadastro público de novos usuários deve ficar desativado.

## Painel de pesquisa

Acrescente `#admin` ao final da URL e entre com o usuário do Supabase
Auth. O painel traz a distribuição das linguagens, contagem por conjunto,
tempo médio de resposta, filtros e exportação em CSV.

## Versionamento do instrumento

O identificador da versão é um resumo do próprio conteúdo. Se o texto de
qualquer situação mudar, o identificador muda junto, e as respostas
antigas permanecem associadas à versão que foi efetivamente respondida.
