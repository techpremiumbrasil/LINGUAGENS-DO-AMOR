-- =====================================================================
--  INSTRUMENTO DAS CINCO LINGUAGENS DO AMOR — versão 3.0
--  Cole no Supabase -> SQL Editor -> Run.
--
--  Duas tabelas:
--   1) linguagem_amor_instrumento — guarda o instrumento inteiro (as 160
--      situações e as 800 alternativas), uma linha por versão.
--   2) linguagem_amor_v3 — as respostas. Cada linha guarda também o texto
--      da situação e da alternativa marcada, e aponta para a versão do
--      instrumento usada.
--
--  Assim a resposta continua legível mesmo que as perguntas mudem depois.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. VERSÕES DO INSTRUMENTO
-- ---------------------------------------------------------------------
create table if not exists public.linguagem_amor_instrumento (
  instrumento_id  text primary key,       -- ex.: v3.0-636ee53e1b8d
  versao          text not null,
  criado_em       timestamptz not null default now(),
  descricao       text,
  conteudo        jsonb not null          -- os 8 conjuntos completos
);

alter table public.linguagem_amor_instrumento enable row level security;

drop policy if exists "instrumento leitura" on public.linguagem_amor_instrumento;
create policy "instrumento leitura"
  on public.linguagem_amor_instrumento for select to anon, authenticated using (true);

-- O conteúdo é inserido por você, uma vez, aqui mesmo no SQL Editor:
--
--   insert into public.linguagem_amor_instrumento
--     (instrumento_id, versao, descricao, conteudo)
--   values ('v3.0-636ee53e1b8d', '3.0',
--           '8 conjuntos por sexo e estado civil, 160 situações',
--           '<<COLE AQUI O CONTEÚDO DE instrumento-v3-snapshot.json>>'::jsonb)
--   on conflict (instrumento_id) do nothing;

-- ---------------------------------------------------------------------
-- 2. RESPOSTAS
-- ---------------------------------------------------------------------
create table if not exists public.linguagem_amor_v3 (
  id                   uuid primary key default gen_random_uuid(),
  criado_em            timestamptz not null default now(),

  codigo_participante  text not null,
  nome                 text,
  contato              text,

  sexo                 text not null check (sexo in ('feminino','masculino')),
  estado_civil         text not null check (estado_civil in ('solteiro','casado','divorciado','viuvo')),
  faixa_etaria         text,
  segmento             text not null,

  versao_questionario  text not null default '3.0',
  instrumento_id       text,
  consentimento_em     timestamptz,

  -- cada item traz: n, titulo, situacao, pergunta, alternativas_exibidas,
  -- primeira, primeira_texto, segunda, segunda_texto, pulado
  escolhas             jsonb not null,

  scores_primeira      jsonb not null,
  scores_segunda       jsonb not null,
  ordem                jsonb not null,
  principal            text,
  estado_resultado     text,
  respondidos          int,
  tempo_segundos       int
);

create index if not exists idx_v3_data     on public.linguagem_amor_v3 (criado_em desc);
create index if not exists idx_v3_segmento on public.linguagem_amor_v3 (segmento);
create index if not exists idx_v3_codigo   on public.linguagem_amor_v3 (codigo_participante);
create index if not exists idx_v3_instr    on public.linguagem_amor_v3 (instrumento_id);
create index if not exists idx_v3_escolhas on public.linguagem_amor_v3 using gin (escolhas);

-- ---------------------------------------------------------------------
-- 3. SEGURANÇA — chave pública só INSERE; ler e excluir exige login
-- ---------------------------------------------------------------------
alter table public.linguagem_amor_v3 enable row level security;

drop policy if exists "participante insere" on public.linguagem_amor_v3;
create policy "participante insere"
  on public.linguagem_amor_v3 for insert to anon with check (true);

drop policy if exists "pesquisa consulta" on public.linguagem_amor_v3;
create policy "pesquisa consulta"
  on public.linguagem_amor_v3 for select to authenticated using (true);

drop policy if exists "pesquisa exclui" on public.linguagem_amor_v3;
create policy "pesquisa exclui"
  on public.linguagem_amor_v3 for delete to authenticated using (true);

-- Sem policy de UPDATE: resposta enviada não é editada.

-- =====================================================================
-- CONSULTAS ÚTEIS
-- =====================================================================

-- Conferir as políticas:
-- select tablename, policyname, cmd, roles from pg_policies
--  where tablename in ('linguagem_amor_v3','linguagem_amor_instrumento');

-- Distribuição das linguagens por segmento:
-- select segmento, principal, count(*)
--   from public.linguagem_amor_v3 group by 1,2 order by 1, 3 desc;

-- Todas as respostas de uma situação, já com o texto da pergunta:
-- select codigo_participante, segmento,
--        e->>'titulo'                  as situacao,
--        e->>'pergunta'                as pergunta,
--        e->>'primeira'                as codigo_1a,
--        e->'primeira_texto'->>'texto' as alternativa_1a,
--        e->>'segunda'                 as codigo_2a
--   from public.linguagem_amor_v3, jsonb_array_elements(escolhas) e
--  where (e->>'n')::int = 3
--  order by criado_em desc;

-- Alternativa mais escolhida em cada situação:
-- select (e->>'n')::int as situacao, e->>'primeira' as linguagem, count(*)
--   from public.linguagem_amor_v3, jsonb_array_elements(escolhas) e
--  where e->>'primeira' is not null
--  group by 1,2 order by 1, 3 desc;

-- Situações puladas:
-- select segmento, (e->>'n')::int as situacao, count(*)
--   from public.linguagem_amor_v3, jsonb_array_elements(escolhas) e
--  where (e->>'pulado')::boolean group by 1,2 order by 3 desc;
