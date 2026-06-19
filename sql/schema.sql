-- ═══════════════════════════════════════════════════════════════
-- PRODE MUNDIAL CJM 2026 — Schema Supabase
-- Ejecutar en: Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════

create table if not exists prodes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),

  nombre      text not null,
  telefono    text,
  jugadora    text,

  -- Grupos (12 grupos x 4 partidos = 48 partidos)
  g_a_0_h int2, g_a_0_a int2, g_a_1_h int2, g_a_1_a int2, g_a_2_h int2, g_a_2_a int2, g_a_3_h int2, g_a_3_a int2,
  g_b_0_h int2, g_b_0_a int2, g_b_1_h int2, g_b_1_a int2, g_b_2_h int2, g_b_2_a int2, g_b_3_h int2, g_b_3_a int2,
  g_c_0_h int2, g_c_0_a int2, g_c_1_h int2, g_c_1_a int2, g_c_2_h int2, g_c_2_a int2, g_c_3_h int2, g_c_3_a int2,
  g_d_0_h int2, g_d_0_a int2, g_d_1_h int2, g_d_1_a int2, g_d_2_h int2, g_d_2_a int2, g_d_3_h int2, g_d_3_a int2,
  g_e_0_h int2, g_e_0_a int2, g_e_1_h int2, g_e_1_a int2, g_e_2_h int2, g_e_2_a int2, g_e_3_h int2, g_e_3_a int2,
  g_f_0_h int2, g_f_0_a int2, g_f_1_h int2, g_f_1_a int2, g_f_2_h int2, g_f_2_a int2, g_f_3_h int2, g_f_3_a int2,
  g_g_0_h int2, g_g_0_a int2, g_g_1_h int2, g_g_1_a int2, g_g_2_h int2, g_g_2_a int2, g_g_3_h int2, g_g_3_a int2,
  g_h_0_h int2, g_h_0_a int2, g_h_1_h int2, g_h_1_a int2, g_h_2_h int2, g_h_2_a int2, g_h_3_h int2, g_h_3_a int2,
  g_i_0_h int2, g_i_0_a int2, g_i_1_h int2, g_i_1_a int2, g_i_2_h int2, g_i_2_a int2, g_i_3_h int2, g_i_3_a int2,
  g_j_0_h int2, g_j_0_a int2, g_j_1_h int2, g_j_1_a int2, g_j_2_h int2, g_j_2_a int2, g_j_3_h int2, g_j_3_a int2,
  g_k_0_h int2, g_k_0_a int2, g_k_1_h int2, g_k_1_a int2, g_k_2_h int2, g_k_2_a int2, g_k_3_h int2, g_k_3_a int2,
  g_l_0_h int2, g_l_0_a int2, g_l_1_h int2, g_l_1_a int2, g_l_2_h int2, g_l_2_a int2, g_l_3_h int2, g_l_3_a int2,

  -- 32avos llave A (8 partidos)
  ko_r64a_0_h int2, ko_r64a_0_a int2, ko_r64a_1_h int2, ko_r64a_1_a int2,
  ko_r64a_2_h int2, ko_r64a_2_a int2, ko_r64a_3_h int2, ko_r64a_3_a int2,
  ko_r64a_4_h int2, ko_r64a_4_a int2, ko_r64a_5_h int2, ko_r64a_5_a int2,
  ko_r64a_6_h int2, ko_r64a_6_a int2, ko_r64a_7_h int2, ko_r64a_7_a int2,

  -- 32avos llave B (8 partidos)
  ko_r64b_0_h int2, ko_r64b_0_a int2, ko_r64b_1_h int2, ko_r64b_1_a int2,
  ko_r64b_2_h int2, ko_r64b_2_a int2, ko_r64b_3_h int2, ko_r64b_3_a int2,
  ko_r64b_4_h int2, ko_r64b_4_a int2, ko_r64b_5_h int2, ko_r64b_5_a int2,
  ko_r64b_6_h int2, ko_r64b_6_a int2, ko_r64b_7_h int2, ko_r64b_7_a int2,

  -- 8vos (8 partidos)
  ko_r32_0_h int2, ko_r32_0_a int2, ko_r32_1_h int2, ko_r32_1_a int2,
  ko_r32_2_h int2, ko_r32_2_a int2, ko_r32_3_h int2, ko_r32_3_a int2,
  ko_r32_4_h int2, ko_r32_4_a int2, ko_r32_5_h int2, ko_r32_5_a int2,
  ko_r32_6_h int2, ko_r32_6_a int2, ko_r32_7_h int2, ko_r32_7_a int2,

  -- 4tos (4 partidos)
  ko_qf_0_h int2, ko_qf_0_a int2, ko_qf_1_h int2, ko_qf_1_a int2,
  ko_qf_2_h int2, ko_qf_2_a int2, ko_qf_3_h int2, ko_qf_3_a int2,

  -- Semis (2 partidos)
  ko_sf_0_h int2, ko_sf_0_a int2,
  ko_sf_1_h int2, ko_sf_1_a int2,

  -- Final y bronce
  ko_final_h  int2, ko_final_a  int2,
  ko_bronze_h int2, ko_bronze_a int2,

  -- Podio y goleador
  campeon    text,
  subcampeon text,
  tercero    text,
  goleador   text
);

-- Tabla resultados reales (misma estructura)
create table if not exists resultados (
  id         uuid primary key default gen_random_uuid(),
  updated_at timestamptz default now(),

  g_a_0_h int2, g_a_0_a int2, g_a_1_h int2, g_a_1_a int2, g_a_2_h int2, g_a_2_a int2, g_a_3_h int2, g_a_3_a int2,
  g_b_0_h int2, g_b_0_a int2, g_b_1_h int2, g_b_1_a int2, g_b_2_h int2, g_b_2_a int2, g_b_3_h int2, g_b_3_a int2,
  g_c_0_h int2, g_c_0_a int2, g_c_1_h int2, g_c_1_a int2, g_c_2_h int2, g_c_2_a int2, g_c_3_h int2, g_c_3_a int2,
  g_d_0_h int2, g_d_0_a int2, g_d_1_h int2, g_d_1_a int2, g_d_2_h int2, g_d_2_a int2, g_d_3_h int2, g_d_3_a int2,
  g_e_0_h int2, g_e_0_a int2, g_e_1_h int2, g_e_1_a int2, g_e_2_h int2, g_e_2_a int2, g_e_3_h int2, g_e_3_a int2,
  g_f_0_h int2, g_f_0_a int2, g_f_1_h int2, g_f_1_a int2, g_f_2_h int2, g_f_2_a int2, g_f_3_h int2, g_f_3_a int2,
  g_g_0_h int2, g_g_0_a int2, g_g_1_h int2, g_g_1_a int2, g_g_2_h int2, g_g_2_a int2, g_g_3_h int2, g_g_3_a int2,
  g_h_0_h int2, g_h_0_a int2, g_h_1_h int2, g_h_1_a int2, g_h_2_h int2, g_h_2_a int2, g_h_3_h int2, g_h_3_a int2,
  g_i_0_h int2, g_i_0_a int2, g_i_1_h int2, g_i_1_a int2, g_i_2_h int2, g_i_2_a int2, g_i_3_h int2, g_i_3_a int2,
  g_j_0_h int2, g_j_0_a int2, g_j_1_h int2, g_j_1_a int2, g_j_2_h int2, g_j_2_a int2, g_j_3_h int2, g_j_3_a int2,
  g_k_0_h int2, g_k_0_a int2, g_k_1_h int2, g_k_1_a int2, g_k_2_h int2, g_k_2_a int2, g_k_3_h int2, g_k_3_a int2,
  g_l_0_h int2, g_l_0_a int2, g_l_1_h int2, g_l_1_a int2, g_l_2_h int2, g_l_2_a int2, g_l_3_h int2, g_l_3_a int2,

  ko_r64a_0_h int2, ko_r64a_0_a int2, ko_r64a_1_h int2, ko_r64a_1_a int2,
  ko_r64a_2_h int2, ko_r64a_2_a int2, ko_r64a_3_h int2, ko_r64a_3_a int2,
  ko_r64a_4_h int2, ko_r64a_4_a int2, ko_r64a_5_h int2, ko_r64a_5_a int2,
  ko_r64a_6_h int2, ko_r64a_6_a int2, ko_r64a_7_h int2, ko_r64a_7_a int2,

  ko_r64b_0_h int2, ko_r64b_0_a int2, ko_r64b_1_h int2, ko_r64b_1_a int2,
  ko_r64b_2_h int2, ko_r64b_2_a int2, ko_r64b_3_h int2, ko_r64b_3_a int2,
  ko_r64b_4_h int2, ko_r64b_4_a int2, ko_r64b_5_h int2, ko_r64b_5_a int2,
  ko_r64b_6_h int2, ko_r64b_6_a int2, ko_r64b_7_h int2, ko_r64b_7_a int2,

  ko_r32_0_h int2, ko_r32_0_a int2, ko_r32_1_h int2, ko_r32_1_a int2,
  ko_r32_2_h int2, ko_r32_2_a int2, ko_r32_3_h int2, ko_r32_3_a int2,
  ko_r32_4_h int2, ko_r32_4_a int2, ko_r32_5_h int2, ko_r32_5_a int2,
  ko_r32_6_h int2, ko_r32_6_a int2, ko_r32_7_h int2, ko_r32_7_a int2,

  ko_qf_0_h int2, ko_qf_0_a int2, ko_qf_1_h int2, ko_qf_1_a int2,
  ko_qf_2_h int2, ko_qf_2_a int2, ko_qf_3_h int2, ko_qf_3_a int2,

  ko_sf_0_h int2, ko_sf_0_a int2,
  ko_sf_1_h int2, ko_sf_1_a int2,

  ko_final_h  int2, ko_final_a  int2,
  ko_bronze_h int2, ko_bronze_a int2,

  campeon    text,
  subcampeon text,
  tercero    text,
  goleador   text
);

-- RLS
alter table prodes     enable row level security;
alter table resultados enable row level security;

create policy "prodes_insert" on prodes for insert with check (true);
create policy "prodes_select" on prodes for select using (true);
create policy "resultados_select" on resultados for select using (true);

-- Fila inicial de resultados
insert into resultados (id) values ('00000000-0000-0000-0000-000000000001')
on conflict do nothing;
