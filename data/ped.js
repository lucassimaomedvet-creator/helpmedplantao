// Conteúdo incorporado das referências enviadas pelo médico (ped) — revisado.
(function () {
// =====================================================================================
// PROPOSTA — PEDIATRIA (Prontuário Rápido) — revisão pediátrica, 26/11/2026
// Fontes: 12 Prescrições Ped | 13 Dose medicamento pediatria (macetes) | 14 Ajuda Ped cálculos |
//         15 Guia Pediatria – Prescrição no PS (UpToDate/SBP 2025-26) | 16 Manual das emergências ped. |
//         06 Manual APS (puericultura: ferro/vit. D, SBP 2026) | UBS Pedreira 2026 (data/remume.js)
// Itens sem fonte nos PDFs (oseltamivir, cetirizina) seguem bula/Protocolo MS — marcado no obs.
//
// CAMPOS NOVOS (opcionais) usados aqui — exigem pequeno ajuste em app.js (calcPed/pedItem):
//   via       : 'oral' (padrão) | 'IM/EV' | 'inalatório' | 'retal' | 'tópico' ... → pedItem hoje fixa v:'oral'
//   q         : quantidade na receita (hoje pedItem fixa '1 frasco')
//   idadeMin  : idade mínima em anos (itens não-fixos) → mostrar aviso quando anos < idadeMin
//   pesoMin   : peso mínimo em kg (itens não-fixos)
// Itens não-orais/por faixa usam fixo:true, porque calcPed escreve sempre "Tomar ..., por via oral".
//
// Helpers: colar no topo de data/pediatria.js junto com os itens fixos novos.
// =====================================================================================

function pedFmt(n, casas = 1) {
  const f = 10 ** casas;
  return String(Math.round(n * f) / f).replace('.', ',');
}
function pedMl(ml) { return pedFmt(ml, ml < 1 ? 2 : 1); }

const NOVOS_PED = [
  // ---------------------------------------------------------------- analgesia parenteral
  { id: 'dipironaInj', t: ['dipirona'], nome: 'Dipirona 500 mg/mL — injetável (IM/EV)', o: 'U', fixo: true, via: 'IM/EV', q: '1 ampola',
    texto: (kg, anos) => {
      if ((anos !== null && anos < 0.25) || kg < 5) return 'NÃO USAR abaixo de 3 meses ou 5 kg.';
      const ml = Math.min(2, kg * 0.03);
      const soIM = (anos !== null && anos < 1) || kg < 9;
      return `Aplicar ${pedMl(ml)} mL (${Math.round(ml * 500)} mg) ${soIM ? 'IM (abaixo de 1 ano ou 9 kg: SOMENTE IM)' : 'EV lento, diluído em 10 mL de SF 0,9%, ou IM'}, agora, se dor ou febre; pode repetir a cada 6 horas.`;
    },
    obs: '0,02–0,03 mL/kg (10–15 mg/kg/dose), máx. 2 mL (1 g). EV contraindicada < 1 ano ou < 9 kg (Guia PS p.107). A fonte 12 usa 0,03 mL/kg; a 13 usa peso ÷ 20 (25 mg/kg) — adotado 15 mg/kg.' },

  // ---------------------------------------------------------------- antieméticos
  { id: 'ondansetronaInj', t: ['ondansetrona'], nome: 'Ondansetrona 2 mg/mL — injetável', o: 'U', fixo: true, via: 'IM/EV', q: '1 ampola',
    texto: (kg, anos) => {
      if (anos !== null && anos < 1 / 12) return 'Abaixo de 1 mês: não usar sem discutir com pediatra.';
      const mg = Math.min(4, kg * 0.15);
      return `Aplicar ${pedMl(mg / 2)} mL (${pedFmt(mg, 1)} mg) EV lento (2–5 min) ou IM, agora, se náusea ou vômitos; pode repetir a cada 8 horas.`;
    },
    obs: '0,15 mg/kg/dose (Guia PS: macete peso × 0,075 mL), teto adotado 4 mg/dose na GECA (fonte 13 aceita até 8 mg). Idade mín. 1 mês. Cuidado com QT longo.' },
  { id: 'ondansetronaVO', t: ['ondansetrona'], nome: 'Ondansetrona 4 mg orodispersível (8 mg na UBS Pedreira)', o: 'C', fixo: true, q: '1 caixa',
    texto: (kg, anos) => {
      if ((anos !== null && anos < 0.5) || kg < 8) return 'Abaixo de 6 meses ou 8 kg: não prescrever para casa — se necessário, dose única 0,15 mg/kg EV/IM na unidade.';
      const d = kg < 15 ? '½ comprimido de 4 mg (2 mg)' : kg <= 30 ? '1 comprimido de 4 mg' : '1 comprimido de 8 mg (UBS Pedreira)';
      return `Dissolver ${d} na boca (ou em um pouco de água), a cada 8 horas, se vômitos, por até 2 dias.`;
    },
    obs: '8–15 kg: 2 mg | 15–30 kg: 4 mg | > 30 kg: 8 mg (Guia PS: solução 4 mg/5 mL 2–11 a 5 mL 8/8 h; > 11 a 8 mg; fonte 14: 15–30 kg 4 mg, > 30 kg 8 mg). UBS Pedreira só tem 8 mg. Na GECA uma dose antes da TRO costuma bastar.' },
  { id: 'bromoprida', t: [], nome: 'Bromoprida 4 mg/mL — gotas', o: 'C', fixo: true,
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade (evitar abaixo de 2 anos).';
      if (anos < 2) return 'EVITAR abaixo de 2 anos (bula: contraindicada < 1 ano; Guia PS: idade mínima 2 anos) — preferir ondansetrona.';
      const g = Math.min(60, Math.max(1, Math.round(kg)));
      return `Dar ${g} gotas, por via oral, a cada 8 horas, antes das refeições, se náusea ou vômitos, por até 3 dias.`;
    },
    obs: '1 gota/kg/dose (24 gotas/mL ≈ 0,17 mg/gota) = 0,5 mg/kg/dia; máx. 1 mg/kg/dia e 60 gotas (10 mg)/dose. Risco de reação extrapiramidal.' },
  { id: 'metoclopramida', t: ['metoclopramida'], nome: 'Metoclopramida 4 mg/mL — gotas', o: 'R', fixo: true,
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade (CONTRAINDICADA abaixo de 1 ano).';
      if (anos < 1) return 'CONTRAINDICADA abaixo de 1 ano.';
      const g = Math.min(50, Math.max(1, Math.round(kg * 0.5)));
      return `Dar ${g} gotas, por via oral, a cada 8 horas, se vômitos, por no máximo 5 dias.`;
    },
    obs: 'Só 2ª linha (ANVISA/EMA): 0,1–0,15 mg/kg/dose até 3x/dia, máx. 0,5 mg/kg/dia, ≤ 5 dias; ≈ 0,2 mg/gota (conferir gotas/mL do fabricante). Distonia aguda é frequente em crianças — preferir ondansetrona. A fonte 14 recomenda não usar < 18 anos.' },

  // ---------------------------------------------------------------- vias aéreas: crupe / asma / anafilaxia
  { id: 'dexaElixir', t: ['corticoide'], nome: 'Dexametasona 0,1 mg/mL — elixir', o: 'R', fixo: true,
    texto: (kg) => {
      const mg = Math.min(10, kg * 0.15);
      if (mg / 0.1 > 30) return `Volume do elixir > 30 mL: preferir dexametasona 4 mg/mL (ampola) por via oral — ${pedMl(mg / 4)} mL (${pedFmt(mg, 1)} mg) misturados em suco, dose única (crupe leve).`;
      return `Tomar ${pedFmt(Math.round(mg / 0.1 * 2) / 2, 1)} mL (${pedFmt(Math.round(mg / 0.1 * 2) / 2 * 0.1, 2)} mg), por via oral, em dose única (crupe leve).`;
    },
    obs: 'Crupe leve: 0,15 mg/kg dose única (Guia PS: 0,15–0,6 mg/kg, máx. 16 mg). Com 0,1 mg/mL a dose de 0,6 mg/kg vira 6 mL/kg (inviável) — no moderado/grave usar ampola 4 mg/mL VO/IM. Obs.: o macete do Guia ("1,6 a 6 mL/kg") está errado; o certo é 1,5–6 mL/kg.' },
  { id: 'dexaInj', t: ['corticoide'], nome: 'Dexametasona 4 mg/mL — injetável (IM, EV ou VO)', o: 'U', fixo: true, via: 'IM/EV', q: '1 ampola',
    texto: (kg) => {
      const mg = Math.min(10, kg * 0.6);
      return `Aplicar ${pedMl(mg / 4)} mL (${pedFmt(mg, 1)} mg) IM, em dose única — ou dar a mesma dose por via oral, misturada em suco.`;
    },
    obs: 'Crupe moderado/grave: 0,6 mg/kg (0,15 mL/kg). Teto adotado 10 mg (Guia PS e manual de emergência: até 16 mg; fontes 12/13: máx. 4 mg — subdose acima de 7 kg). Asma: 0,3–0,6 mg/kg 1x/dia por 1–2 dias.' },
  { id: 'adrenalinaNBZ', t: [], nome: 'Adrenalina 1 mg/mL — nebulização (crupe)', o: 'U', fixo: true, via: 'inalatório', q: '5 ampolas',
    texto: (kg) => {
      const ml = Math.min(5, Math.max(0.5, Math.round(kg * 0.5 * 2) / 2));
      return `Crupe com estridor em repouso: nebulizar ${pedFmt(ml, 1)} mL de adrenalina 1 mg/mL (completar até 4–5 mL com SF 0,9% se necessário), com O₂ a 6–8 L/min, agora; pode repetir em 20–30 min. Observar no mínimo 2–4 h após a última dose.`;
    },
    obs: '0,5 mL/kg, máx. 5 mL (Guia PS; manual de emergência: 3–5 ampolas). Fonte 13 traz 1 mL fixo — subdose acima de 2 kg. Sempre associar dexametasona.' },
  { id: 'adrenalinaIM', t: [], nome: 'Adrenalina 1 mg/mL — IM (anafilaxia)', o: 'U', fixo: true, via: 'IM', q: '1 ampola',
    texto: (kg) => {
      const mg = Math.min(kg >= 50 ? 0.5 : 0.3, kg * 0.01);
      return `ANAFILAXIA: aplicar ${pedFmt(mg, 2)} mL (${pedFmt(mg, 2)} mg) de adrenalina 1 mg/mL IM na face anterolateral da coxa, AGORA; repetir a cada 5–15 min se não houver melhora.`;
    },
    obs: '0,01 mg/kg = 0,01 mL/kg; máx. 0,3 mg até 50 kg e 0,5 mg acima (Guia PS; manual de emergência e fonte 13: máx. 0,5). Sem balança: 10–25 kg 0,15 mL; 25–50 kg 0,3 mL. Deitar com pernas elevadas; SF 20 mL/kg se má perfusão; observar ≥ 4 h (12 h se grave/bifásica).' },
  { id: 'nbzBroncoespasmo', t: ['beta2'], nome: 'Fenoterol 5 mg/mL + Ipratrópio 0,25 mg/mL — nebulização', o: 'U', fixo: true, via: 'inalatório', q: '—',
    texto: (kg, anos) => {
      const fen = Math.min(10, Math.max(1, Math.round(kg / 3)));
      const ipr = anos !== null ? (anos < 1 ? 10 : anos < 12 ? 20 : 40) : (kg < 10 ? 10 : kg < 40 ? 20 : 40);
      return `Nebulizar fenoterol ${fen} gota(s) + brometo de ipratrópio ${ipr} gotas + SF 0,9% 3 a 4 mL, com O₂ a 6–8 L/min, a cada 20 minutos, até 3 vezes na 1ª hora.`;
    },
    obs: 'Preferir salbutamol aerossol + espaçador (item Salbutamol): mesma eficácia, menos taquicardia. Fenoterol 1 gota/3 kg (máx. 10); ipratrópio < 1 a 10 gotas | 1–11 a 20 | ≥ 12 a 40 (Guia PS, fontes 12/14). Bronquiolite: não usar de rotina (SBP) — só teste terapêutico no grave com sibilos.' },
  { id: 'salbutamolXarope', t: ['beta2'], nome: 'Salbutamol 2 mg/5 mL (0,4 mg/mL) — xarope', o: 'R', conc: 0.4, tipo: 'dose', mgkg: 0.1, faixa: '0,1–0,15 mg/kg/dose (máx. 2 mg/dose)', freq: 8, max: 2, dias: 5, idadeMin: 2,
    acao: 'se chiado', obs: 'Acima de 2 anos. GINA/SBP NÃO recomendam broncodilatador oral (menos eficaz, mais tremor/taquicardia) — preferir aerossol com espaçador. Bula: 2–6 a 1–2 mg; 6–12 a 2 mg 3–4x/dia. Fonte 13: 0,5 mL a cada 3 kg (≈ 0,07 mg/kg).' },
  { id: 'beclometasona', t: ['corticoide'], nome: 'Beclometasona 50 mcg/dose — aerossol (controle da asma)', o: 'FP', fixo: true, via: 'inalatório', q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade.';
      if (anos < 6) return 'Fazer 1 jato (50 mcg) a cada 12 horas, com espaçador e máscara, uso contínuo. Enxaguar a boca/limpar o rosto após.';
      if (anos < 12) return 'Fazer 2 jatos (100 mcg) a cada 12 horas, com espaçador, uso contínuo. Enxaguar a boca após.';
      return 'Beclometasona 250 mcg/dose: fazer 1 jato a cada 12 horas, com espaçador, uso contínuo. Enxaguar a boca após.';
    },
    obs: 'Dose baixa GINA: ≤ 5 a 100 mcg/dia; 6–11 a 100–200 mcg/dia; ≥ 12 a 200–500 mcg/dia. NÃO é medicação de crise. Reavaliar em 4–6 semanas. Fonte 14: Clenil A 400 mcg/mL ½ flaconete/dia em NBZ (alternativa hospitalar).' },

  // ---------------------------------------------------------------- crise convulsiva (benzodiazepínicos)
  { id: 'midazolamCrise', t: ['benzodiazepinico'], nome: 'Midazolam 5 mg/mL — crise convulsiva', o: 'U', fixo: true, via: 'EV/IM/intranasal', q: '1 ampola',
    texto: (kg) => {
      const mg = Math.min(10, kg * 0.2);
      return `Crise > 5 min: aplicar ${pedMl(mg / 5)} mL (${pedFmt(mg, 1)} mg) de midazolam 5 mg/mL EV lento OU IM (coxa) OU intranasal (metade em cada narina, com atomizador), agora. Pode repetir 1 vez após 5–10 min (máx. 2 doses de benzodiazepínico; depois fenitoína 20 mg/kg ou fenobarbital).`;
    },
    obs: '0,2 mg/kg/dose, máx. 10 mg (Guia PS; manual de emergência 0,1–0,4 mg/kg; fonte 12: 0,15–0,3). 1ª opção quando não há acesso venoso (IM/IN). Glicemia capilar; via aérea e bolsa-válvula-máscara à mão.' },
  { id: 'diazepamCrise', t: ['benzodiazepinico'], nome: 'Diazepam 5 mg/mL — crise convulsiva (EV ou retal)', o: 'U', fixo: true, via: 'EV/retal', q: '1 ampola',
    texto: (kg, anos) => {
      const ev = Math.min(10, kg * 0.2);
      const fr = anos !== null && anos >= 12 ? 0.2 : anos !== null && anos >= 6 ? 0.3 : 0.5;
      const re = Math.min(10, kg * fr);
      return `Crise > 5 min: aplicar ${pedMl(ev / 5)} mL (${pedFmt(ev, 1)} mg) EV lento, sem diluir (máx. 2 mg/min). Sem acesso venoso: ${pedMl(re / 5)} mL (${pedFmt(re, 1)} mg) por via retal (seringa sem agulha ou sonda fina). Pode repetir 1 vez após 5–10 min.`;
    },
    obs: 'EV 0,2 mg/kg máx. 10 mg (Guia PS; fonte 13: peso × 0,06 mL = 0,3 mg/kg). Retal: 0,5 mg/kg (até 5 a), 0,3 (6–11 a), 0,2 (≥ 12 a); teto adotado 10 mg/dose (literatura aceita até 20 mg retal). Não usar IM (absorção errática).' },

  // ---------------------------------------------------------------- antibióticos
  { id: 'cefuroxima', t: ['cefalosporina', 'atb'], nome: 'Axetilcefuroxima 250 mg/5 mL — suspensão', o: 'C', conc: 50, tipo: 'dia', mgkg: 30, faixa: '20–30 mg/kg/dia ÷ 12/12 h (máx. 1 g/dia)', freq: 12, max: 500, dias: 10, idadeMin: 0.25,
    acao: 'junto com alimento', obs: 'Acima de 3 meses. OMA/sinusite (alergia não anafilática à penicilina): 30 mg/kg/dia 10 dias; ITU: 7–10 dias (Guia PS: 0,5 mL/kg/dia).' },
  { id: 'claritromicina', t: ['macrolideo', 'atb'], nome: 'Claritromicina 250 mg/5 mL — suspensão', o: 'C', conc: 50, tipo: 'dia', mgkg: 15, faixa: '15 mg/kg/dia ÷ 12/12 h (máx. 500 mg/dose)', freq: 12, max: 500, dias: 10, idadeMin: 0.5,
    obs: 'Acima de 6 meses (coqueluche: > 1 mês, 7 dias — Guia PS). UBS Pedreira só tem cp 500 mg. Muitas interações (CYP3A4).' },
  { id: 'benzatinaPed', t: ['penicilina', 'atb'], nome: 'Benzilpenicilina benzatina 1.200.000 UI — IM', o: 'R', fixo: true, via: 'IM', q: '1 frasco-ampola',
    texto: (kg) => kg < 27
      ? 'Aplicar 600.000 UI IM profunda, dose única (reconstituir o frasco de 1.200.000 UI com 3,2 mL de AD = 300.000 UI/mL e aspirar 2 mL).'
      : 'Aplicar 1.200.000 UI (frasco inteiro) IM profunda no glúteo, dose única.',
    obs: '< 27 kg: 600.000 UI | ≥ 27 kg: 1.200.000 UI (Guia PS/AHA). Fontes 13/14 usam corte de 25 kg. Observar 30 min após.' },

  // ---------------------------------------------------------------- antifúngicos / pele
  { id: 'nistatinaOral', t: [], nome: 'Nistatina 100.000 UI/mL — suspensão oral', o: 'C', fixo: true, q: '1 frasco',
    texto: (kg, anos) => ((anos !== null && anos < 1) || (anos === null && kg < 10))
      ? 'Pingar 1 mL em cada lado da boca (total 2 mL), 4 vezes ao dia, após as mamadas, por 7 a 14 dias (manter até 48 h após sumirem as placas).'
      : 'Manter 4 mL na boca (bochechar) e depois engolir, 4 vezes ao dia, após as refeições, por 7 a 14 dias (manter até 48 h após sumirem as placas).',
    obs: 'Bula: lactente 1–2 mL 4x/dia; crianças 1–6 mL 4x/dia (Guia PS: lactente 1 mL; fonte 14: lactente 2 mL, criança 4–6 mL). Prematuro: 1 mL. Ferver bicos/chupetas; tratar mamilo materno (miconazol creme). Violeta de genciana: proscrita (SBP). Não está na UBS Pedreira.' },
  { id: 'nistatinaZnO', t: [], nome: 'Nistatina 100.000 UI/g + Óxido de zinco 200 mg/g — pomada', o: 'C', fixo: true, via: 'tópico', q: '1 bisnaga',
    texto: () => 'Aplicar camada fina na área da fralda a cada troca (2 a 4 vezes ao dia), por 14 dias.',
    obs: 'Só se candidíase (vermelho-vivo, pregas acometidas, lesões satélites) — Guia PS 1ª linha. Assadura irritativa: só pasta de óxido de zinco. Evitar corticoide + antifúngico (atrofia).' },

  // ---------------------------------------------------------------- antiparasitários / ectoparasitas
  { id: 'mebendazol', t: ['antiparasitario'], nome: 'Mebendazol 100 mg/5 mL — suspensão', o: 'C', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade.';
      if (anos < 1) return 'NÃO INDICADO abaixo de 1 ano.';
      if (anos < 2) return 'Abaixo de 2 anos a bula brasileira não recomenda — preferir albendazol 200 mg (5 mL) dose única.';
      return 'Tomar 5 mL (100 mg), por via oral, a cada 12 horas, por 3 dias. (Oxiúros: 5 mL dose única, repetir em 2 semanas.)';
    },
    obs: 'Fontes 13/14: > 2 anos, 5 mL 12/12 h por 3 dias. Dose independe do peso. Não está na UBS Pedreira (preferir albendazol).' },
  { id: 'ivermectinaPed', t: ['antiparasitario'], nome: 'Ivermectina 6 mg — comprimido', o: 'R', fixo: true, q: '1 caixa',
    texto: (kg, anos) => {
      if (kg < 15 || (anos !== null && anos < 5)) return 'NÃO INDICADO abaixo de 15 kg ou 5 anos — escabiose: permetrina 5%; pediculose: permetrina 1%.';
      const n = kg < 25 ? '½ comprimido' : kg < 36 ? '1 comprimido' : kg < 51 ? '1 e ½ comprimido' : kg < 66 ? '2 comprimidos' : kg < 80 ? '2 e ½ comprimidos' : '3 comprimidos';
      return `Tomar ${n}, por via oral, em dose única, em jejum; repetir a mesma dose após 7 a 14 dias (escabiose/pediculose).`;
    },
    obs: '≈ 200 mcg/kg: 15–24 kg ½ | 25–35 kg 1 | 36–50 kg 1½ | 51–65 kg 2 | 66–79 kg 2½ | ≥ 80 kg 3 (fontes 13/14). Fonte 12 repete em 14 dias.' },
  { id: 'permetrina5', t: [], nome: 'Permetrina 5% — loção (escabiose)', o: 'C', fixo: true, via: 'tópico', q: '1 frasco',
    texto: (kg, anos) => (anos !== null && anos < 2 / 12)
      ? 'Abaixo de 2 meses: não usar — discutir com pediatra (alternativa: enxofre precipitado 5–10% em vaselina).'
      : `Aplicar a loção em todo o corpo, do pescoço para baixo${anos === null || anos < 2 ? ' (abaixo de 2 anos incluir couro cabeludo, rosto e orelhas, poupando olhos e boca)' : ''}, à noite; deixar agir 8 a 12 horas e retirar no banho. Repetir após 7 dias. Tratar todos os contactantes ao mesmo tempo.`,
    obs: 'Acima de 2 meses. Fonte 12 usa 3 noites seguidas (esquema antigo). Pediculose: permetrina 1% xampu, 10 min, repetir em 7–10 dias. UBS Pedreira tem deltametrina 0,2 mg/mL e benzoato de benzila 25% (diluir; evitar < 2 anos).' },
  { id: 'nitazoxanida', t: ['antiparasitario'], nome: 'Nitazoxanida 20 mg/mL — suspensão', o: 'C', conc: 20, tipo: 'dose', mgkg: 7.5, faixa: '7,5 mg/kg/dose 12/12 h', freq: 12, max: 200, dias: 3, idadeMin: 1,
    acao: 'junto com alimento', obs: 'Acima de 1 ano. Bula: 1–3 a 5 mL; 4–11 a 10 mL; ≥ 12 a cp 500 mg 12/12 h (fontes 13/14: peso × 0,375 mL). Giardíase/criptosporidíase/rotavírus — não usar de rotina na GECA.' },

  // ---------------------------------------------------------------- anti-histamínicos
  { id: 'hidroxizina', t: [], nome: 'Hidroxizina 2 mg/mL — xarope', o: 'C', conc: 2, tipo: 'dose', mgkg: 0.6, faixa: '0,5–0,7 mg/kg/dose 8/8 h (máx. 2 mg/kg/dia)', freq: 8, max: 25, dias: 5, idadeMin: 0.5,
    acao: 'se coceira', obs: 'Acima de 6 meses. Máx. 50 mg/dia (< 6 a) e 100 mg/dia (≥ 6 a). Seda. Guia PS: 0,7 mg/kg 3x/dia (= 2,1 mg/kg/dia, acima do próprio máx. de 2) — adotado 0,6. UBS Pedreira: cp 25 mg (≥ 6 a e ≥ 25 kg: ½–1 cp).' },
  { id: 'dexclorfeniramina', t: [], nome: 'Dexclorfeniramina 0,4 mg/mL (2 mg/5 mL) — xarope', o: 'R', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade (não usar abaixo de 2 anos).';
      if (anos < 2) return 'NÃO INDICADO abaixo de 2 anos.';
      const ml = anos < 6 ? '1,25' : anos < 12 ? '2,5' : '5';
      return `Tomar ${ml} mL, por via oral, a cada 8 horas, se coceira, por até 5 dias.`;
    },
    obs: 'Bula/Guia PS: 2–5 a 1,25 mL (máx. 7,5 mL/dia); 6–11 a 2,5 mL (máx. 15 mL/dia); ≥ 12 a 5 mL. O macete "peso ÷ 4 mL" (fontes 13/14) dá 2–3x a dose da bula no pré-escolar — não usar.' },
  { id: 'desloratadina', t: [], nome: 'Desloratadina 0,5 mg/mL — xarope', o: 'C', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade.';
      if (anos < 0.5) return 'NÃO INDICADO abaixo de 6 meses.';
      const ml = anos < 1 ? '2' : anos < 6 ? '2,5' : anos < 12 ? '5' : '10';
      return `Tomar ${ml} mL, por via oral, uma vez ao dia, por 5 a 7 dias.`;
    },
    obs: '6–11 m 1 mg | 1–5 a 1,25 mg | 6–11 a 2,5 mg | ≥ 12 a 5 mg (fontes 12/14). O Guia PS lista "1 mg/mL" com outros volumes — conferir a concentração do frasco.' },
  { id: 'cetirizina', t: [], nome: 'Cetirizina 1 mg/mL — solução oral', o: 'C', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade.';
      if (anos < 2) return 'NÃO INDICADO abaixo de 2 anos (bula brasileira).';
      if (anos < 6) return 'Tomar 2,5 mL, por via oral, a cada 12 horas, por 5 a 7 dias.';
      if (anos < 12) return 'Tomar 5 mL, por via oral, a cada 12 horas (ou 10 mL uma vez ao dia), por 5 a 7 dias.';
      return 'Tomar 10 mL, por via oral, uma vez ao dia, por 5 a 7 dias.';
    },
    obs: 'Sem fonte nos PDFs — dose da bula. Menos sedativa que dexclorfeniramina/hidroxizina.' },

  // ---------------------------------------------------------------- antivirais
  { id: 'aciclovirCp', t: ['aciclovir'], nome: 'Aciclovir 200 mg — comprimido (varicela)', o: 'R', fixo: true, q: '1 caixa',
    texto: (kg, anos) => {
      if (anos !== null && anos < 2) return 'Abaixo de 2 anos: usar suspensão 200 mg/5 mL (20 mg/kg/dose 6/6 h).';
      const n = Math.min(4, Math.max(0.5, Math.round(kg * 20 / 100) / 2));
      return `Varicela: tomar ${pedFmt(n, 1)} comprimido(s) de 200 mg (pode macerar e dissolver em água), por via oral, a cada 6 horas, por 5 dias.`;
    },
    obs: '20 mg/kg/dose 4x/dia, máx. 800 mg/dose (Guia PS). Indicado ≥ 12 a, doença crônica de pele/pulmão, corticoide/AAS crônico, caso secundário domiciliar — iniciar até 24–72 h do exantema. Gengivoestomatite: 15 mg/kg/dose 5x/dia (máx. 200 mg) — ≥ 14 kg: 1 cp 5x/dia.' },
  { id: 'aciclovirSusp', t: ['aciclovir'], nome: 'Aciclovir 200 mg/5 mL — suspensão', o: 'C', conc: 40, tipo: 'dose', mgkg: 15, faixa: 'Gengivoestomatite 15 mg/kg/dose (máx. 200 mg) | Varicela 20 mg/kg/dose 6/6 h (máx. 800 mg)', freq: 4, max: 200, dias: 7,
    acao: '5 vezes ao dia (pular a dose da madrugada)', obs: 'Padrão = gengivoestomatite herpética (Guia PS: 0,38 × peso mL, 5x/dia, 5–7 dias, iniciar até 72 h). Para varicela o teto de 200 mg subdosa — usar o item de comprimidos ou calcular à parte.' },
  { id: 'oseltamivirPed', t: [], nome: 'Oseltamivir — cápsulas 30/45/75 mg (pediátrico)', o: 'FP', fixo: true, q: '10 cápsulas',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade.';
      if (anos < 1) {
        const mg = Math.round(kg * (anos < 0.75 ? 3 : 3.5));
        return `Dar ${mg} mg (${pedMl(mg / 6)} mL da suspensão 6 mg/mL — preparo conforme farmácia/protocolo MS), por via oral, a cada 12 horas, por 5 dias.`;
      }
      const c = kg <= 15 ? '1 cápsula de 30 mg' : kg <= 23 ? '1 cápsula de 45 mg' : kg <= 40 ? '2 cápsulas de 30 mg (60 mg)' : '1 cápsula de 75 mg';
      return `Tomar ${c}, por via oral, a cada 12 horas, por 5 dias (pode abrir a cápsula e misturar em líquido doce ou alimento pastoso).`;
    },
    obs: 'Sem fonte nos PDFs — Protocolo MS de Influenza (conferir versão vigente): < 1 a 3 mg/kg (0–8 m) e 3,5 mg/kg (9–11 m); ≤ 15 kg 30 mg; 15–23 kg 45 mg; 23–40 kg 60 mg; > 40 kg 75 mg, 12/12 h, 5 dias. Indicado < 5 anos com síndrome gripal (grupo de risco) e SRAG, idealmente até 48 h.' },

  // ---------------------------------------------------------------- diarreia / hidratação
  { id: 'zincoDiarreia', t: [], nome: 'Sulfato de zinco 4 mg/mL (2 mg/0,5 mL) — xarope', o: 'C', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade (< 6 meses: 2,5 mL | ≥ 6 meses: 5 mL, 1x/dia, 10–14 dias).';
      if (anos >= 5) return 'Zinco na diarreia: indicado para menores de 5 anos (OMS/MS).';
      return anos < 0.5
        ? 'Dar 2,5 mL (10 mg), por via oral, uma vez ao dia, por 10 a 14 dias.'
        : 'Dar 5 mL (20 mg), por via oral, uma vez ao dia, por 10 a 14 dias.';
    },
    obs: 'OMS/MS/Guia PS: < 6 m 10 mg/dia; ≥ 6 m 20 mg/dia, 10–14 dias, mesmo após a diarreia parar. Fonte 12 (Biozinc): < 6 m 2,5 mL; até 5 a 5 mL.' },
  { id: 'sroPlanoB', t: [], nome: 'SRO — Plano B (reidratação oral na unidade)', o: 'R', fixo: true, q: '—',
    texto: (kg) => `Plano B (na unidade): oferecer ${Math.round(kg * 50)} a ${Math.round(kg * 100)} mL de SRO em 4 a 6 horas (cerca de ${Math.round(kg * 75 / 16)} mL a cada 15 min), em colher ou copo, em pequenos goles; manter o aleitamento. Se vomitar, pausar 10 min e recomeçar mais devagar. Reavaliar a hidratação ao final.`,
    obs: '50–100 mL/kg em 4–6 h (MS/Guia PS). Alta só após reidratação, com Plano A + zinco. Acima de 30–40 kg, seguir o volume do protocolo de adulto.' },
  { id: 'expansaoPlanoC', t: [], nome: 'Plano C / choque — SF 0,9% ou Ringer lactato EV', o: 'U', fixo: true, via: 'EV', q: '—',
    texto: (kg, anos) => {
      const r = (x) => Math.round(kg * x);
      const fase = anos === null
        ? `< 1 ano: ${r(30)} mL (30 mL/kg) em 1 h + ${r(70)} mL (70 mL/kg) em 5 h | ≥ 1 ano: ${r(30)} mL em 30 min + ${r(70)} mL em 2 h 30 min`
        : anos < 1
          ? `${r(30)} mL (30 mL/kg) em 1 hora, seguidos de ${r(70)} mL (70 mL/kg) em 5 horas`
          : `${r(30)} mL (30 mL/kg) em 30 minutos, seguidos de ${r(70)} mL (70 mL/kg) em 2 h 30 min`;
      return `Plano C — SF 0,9% ou Ringer lactato EV: ${fase}. Reavaliar a cada hora; iniciar SRO assim que conseguir beber. Choque: ${Math.min(1000, r(20))} mL (20 mL/kg, máx. 1.000 mL) em 5–20 min, reavaliar e repetir (RN/cardiopata: ${r(10)} mL = 10 mL/kg).`;
    },
    obs: 'MS 2023/Guia PS. Acima de ~40 kg usar protocolo de adulto (volumes deste cálculo ficam excessivos). Depois da expansão: manutenção (Holliday-Segar) + reposição 50 mL/kg/dia (SG 5% + SF 0,9% 1:1).' },
  { id: 'hollidaySegar', t: [], nome: 'Soro de manutenção isotônico (Holliday-Segar)', o: 'U', fixo: true, via: 'EV', q: '—',
    texto: (kg) => {
      const v = Math.min(2400, kg <= 10 ? kg * 100 : kg <= 20 ? 1000 + (kg - 10) * 50 : 1500 + (kg - 20) * 20);
      return `Manutenção 24 h: SG 5% ${Math.round(v)} mL + NaCl 20% ${pedFmt(v * 0.04, 1)} mL + KCl 19,1% ${pedFmt(v * 0.008, 1)} mL — EV em bomba de infusão a ${pedFmt(v / 24, 1)} mL/h. (Em etapas de 500 mL: SG 5% 500 mL + NaCl 20% 20 mL + KCl 19,1% 4 mL.)`;
    },
    obs: '100 mL/kg até 10 kg; 1.000 + 50 mL/kg acima de 10; 1.500 + 20 mL/kg acima de 20 (máx. 2.400 mL/dia — Guia PS). NaCl 20% 4 mL/100 mL ≈ Na 136 mEq/L (isotônico, AAP 2018); KCl só após diurese. Restringir a 70–80% se risco de SIADH (bronquiolite, meningite, pneumonia). NÃO usar em RN < 28 dias (prescrição neonatal própria).' },

  // ---------------------------------------------------------------- puericultura
  { id: 'vitaminaD', t: [], nome: 'Colecalciferol (vitamina D) 400 UI — gotas', o: 'R', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade (< 1 ano 400 UI/dia; 1–2 anos 600 UI/dia).';
      if (anos < 1) return 'Dar 400 UI, por via oral, uma vez ao dia, até completar 1 ano (conferir no rótulo quantas gotas = 400 UI).';
      if (anos < 2) return 'Dar 600 UI, por via oral, uma vez ao dia, até 2 anos (conferir no rótulo quantas gotas = 600 UI).';
      return 'Profilaxia universal só até 2 anos (SBP); acima disso, apenas se fator de risco ou deficiência comprovada.';
    },
    obs: 'SBP: 400 UI/dia da 1ª semana até 12 m (inclusive no aleitamento exclusivo); 600 UI/dia de 12 a 24 m. Pré-termo: iniciar com peso > 1.500 g e dieta enteral plena. A concentração por gota varia entre marcas (200 ou 400 UI/gota).' },
  { id: 'ferroProfilaxia', t: [], nome: 'Sulfato ferroso 25 mg/mL (1,25 mg Fe/gota) — profilaxia', o: 'R', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      const bpn = Math.max(1, Math.round(kg * 2 / 1.25));
      const pos = Math.max(1, Math.round(kg / 1.25));
      if (anos !== null && anos < 0.5) return `Termo com peso adequado: iniciar só aos 6 meses. Pré-termo ou peso ao nascer < 2.500 g: dar ${bpn} gotas (2 mg/kg/dia), por via oral, uma vez ao dia, a partir de 30 dias de vida até 12 meses.`;
      if (anos !== null && anos >= 2) return 'Profilaxia universal termina aos 2 anos. Se anemia: tratamento 3–5 mg/kg/dia (item Sulfato ferroso).';
      return `Dar 8 a 10 gotas (10–12,5 mg de ferro elementar), por via oral, uma vez ao dia, 30 min antes de uma refeição, por 3 meses (ciclos dos 6 aos 9 meses e dos 12 aos 15 meses). Pré-termo/baixo peso: ${bpn} gotas/dia até 12 meses e depois ${pos} gotas/dia (1 mg/kg) até 2 anos.`;
    },
    obs: 'SBP 2026 / PNSF (Manual APS, fonte 06): termo com peso adequado = dose FIXA 10–12,5 mg/dia em 2 ciclos de 3 meses. Pré-termo/BPN: 2 mg/kg/dia (1.500–2.500 g), 3 mg/kg (1.000–1.500 g), 4 mg/kg (< 1.000 g) por 12 m, depois 1 mg/kg/dia até 24 m.' },

  // ---------------------------------------------------------------- intestino
  { id: 'lactulosePed', t: [], nome: 'Lactulose 667 mg/mL — xarope', o: 'C', fixo: true, q: '1 frasco',
    texto: (kg) => {
      const ini = Math.min(30, Math.max(2.5, Math.round(kg)));
      const max = Math.min(60, Math.round(kg * 3));
      return `Tomar ${pedFmt(ini, 1)} mL, por via oral, uma vez ao dia (ou dividido em 2 tomadas); aumentar a cada 2–3 dias até fezes pastosas diárias, sem passar de ${max} mL/dia. Manter por no mínimo 2 meses.`;
    },
    obs: '1–3 mL/kg/dia, máx. 60 mL/dia (Guia PS); segura em todas as idades (2ª escolha após PEG; 1ª abaixo de 2 anos). Gases/cólica nos primeiros dias. Contraindicada em galactosemia.' },
  { id: 'pegPed', t: [], nome: 'Polietilenoglicol 3350 — pó (manutenção)', o: 'C', fixo: true, q: '1 frasco/caixa',
    texto: (kg, anos) => {
      if (anos === null) return 'Informe a idade (PEG: acima de 2 anos).';
      if (anos < 2) return 'Abaixo de 2 anos: preferir lactulose (PEG off-label a partir de 6 meses, só com pediatra).';
      const g = Math.min(17, Math.round(kg * 0.4 * 2) / 2);
      return `Diluir ${pedFmt(g, 1)} g de polietilenoglicol 3350 (medir com a colher-medida/balança) em cerca de 125 mL de água ou suco e tomar uma vez ao dia, por no mínimo 2 meses; ajustar (0,4–0,8 g/kg/dia, máx. 17 g/dia) até fezes pastosas diárias.`;
    },
    obs: 'Guia PS: manutenção 0,4–0,8 g/kg/dia ≥ 60 dias; desimpactação (fecaloma) 1–1,5 g/kg/dia por 3–6 dias (máx. 100 g/dia). Desmame gradual.' },
  { id: 'simeticonaPed', t: [], nome: 'Simeticona 75 mg/mL — gotas', o: 'R', fixo: true, q: '1 frasco',
    texto: (kg, anos) => {
      const g = anos === null ? (kg < 10 ? 5 : 8) : anos < 1 ? 5 : anos < 12 ? 8 : 13;
      return `Dar ${g} gotas, por via oral, até 3 vezes ao dia, se gases ou desconforto abdominal.`;
    },
    obs: 'Lactente 3–6 gotas; criança até 12 a 5–12 gotas; > 12 a 13–16 gotas, até 3x/dia (Guia PS, bula, fontes 12–14 com pequenas diferenças). Cólica do lactente: sem eficácia comprovada (SBP) — não é obrigatório prescrever.' },
];

// =====================================================================================
// NOVOS_MEDS — chaves para usar nas condições pediátricas (CONDICOES.unid/casa).
// Campo novo `ped` = id do item da calculadora; `pedMgkg` = mg/kg sugerido para essa condição.
// Proposta de app.js: se a condição tem ped:true e há peso preenchido, substituir `p` pelo texto
// de calcPed(PEDIATRIA[ped], kg, anos, pedMgkg ?? mgkg). Sem peso, aparece o `p` abaixo.
// =====================================================================================
const PED_P = 'Dose por peso — preencher peso/idade e usar a Calculadora pediátrica.';
const NOVOS_MEDS = {
  pedDipirona: { n: 'Dipirona 500 mg/mL — gotas', q: '1 frasco', v: 'oral', o: 'R', t: ['dipirona'], ped: 'dipirona', p: PED_P },
  pedParacetamol: { n: 'Paracetamol 200 mg/mL — gotas', q: '1 frasco', v: 'oral', o: 'R', t: ['paracetamol'], ped: 'paracetamol', p: PED_P },
  pedIbuprofeno: { n: 'Ibuprofeno 100 mg/mL — gotas', q: '1 frasco', v: 'oral', o: 'R', t: ['aine'], ped: 'ibuprofeno', p: PED_P,
    alt: 'Acima de 6 meses; evitar em varicela, dengue ou desidratação.' },
  pedDipironaInj: { n: 'Dipirona 500 mg/mL — injetável', v: 'IM/EV', o: 'U', t: ['dipirona'], ped: 'dipironaInj', p: PED_P },
  pedAmoxicilina: { n: 'Amoxicilina 250 mg/5 mL — suspensão', q: '1 frasco', v: 'oral', o: 'R', t: ['penicilina', 'atb'], ped: 'amoxicilina', pedMgkg: 50, p: PED_P },
  pedAmoxicilinaOMA: { n: 'Amoxicilina 250 mg/5 mL — suspensão (dose alta)', q: '2 frascos', v: 'oral', o: 'R', t: ['penicilina', 'atb'], ped: 'amoxicilina', pedMgkg: 90, p: PED_P,
    alt: 'OMA: 80–90 mg/kg/dia; duração < 2 a 10 dias | 2–5 a 7 dias | ≥ 6 a 5–7 dias.' },
  pedAmoxClav: { n: 'Amoxicilina 400 mg + Clavulanato 57 mg/5 mL — suspensão', q: '1 frasco', v: 'oral', o: 'R', t: ['penicilina', 'atb'], ped: 'amoxclav', p: PED_P },
  pedAzitromicina: { n: 'Azitromicina 200 mg/5 mL — suspensão', q: '1 frasco', v: 'oral', o: 'R', t: ['macrolideo', 'atb'], ped: 'azitromicina', p: PED_P },
  pedCefalexina: { n: 'Cefalexina 250 mg/5 mL — suspensão', q: '1 frasco', v: 'oral', o: 'R', t: ['cefalosporina', 'atb'], ped: 'cefalexina', p: PED_P },
  pedCefuroxima: { n: 'Axetilcefuroxima 250 mg/5 mL — suspensão', q: '1 frasco', v: 'oral', o: 'C', t: ['cefalosporina', 'atb'], ped: 'cefuroxima', p: PED_P },
  pedSmxTmp: { n: 'Sulfametoxazol 200 mg + Trimetoprima 40 mg/5 mL — suspensão', q: '1 frasco', v: 'oral', o: 'R', t: ['sulfa', 'atb'], ped: 'smxtmp', p: PED_P },
  pedBenzatina: { n: 'Benzilpenicilina benzatina 1.200.000 UI', v: 'IM', o: 'R', t: ['penicilina', 'atb'], ped: 'benzatinaPed', p: PED_P },
  pedPrednisolona: { n: 'Prednisolona 3 mg/mL — solução oral', q: '1 frasco', v: 'oral', o: 'R', t: ['corticoide'], ped: 'prednisolona', p: PED_P },
  pedDexaElixir: { n: 'Dexametasona 0,1 mg/mL — elixir', q: '1 frasco', v: 'oral', o: 'R', t: ['corticoide'], ped: 'dexaElixir', p: PED_P },
  pedDexaInj: { n: 'Dexametasona 4 mg/mL — injetável', v: 'IM/EV', o: 'U', t: ['corticoide'], ped: 'dexaInj', p: PED_P },
  pedAdrenalinaNBZ: { n: 'Adrenalina 1 mg/mL — nebulização', v: 'inalatório', o: 'U', t: [], ped: 'adrenalinaNBZ', p: PED_P },
  pedAdrenalinaIM: { n: 'Adrenalina 1 mg/mL — IM', v: 'IM', o: 'U', t: [], ped: 'adrenalinaIM', p: PED_P },
  pedSalbutamolSpray: { n: 'Salbutamol 100 mcg/dose — aerossol com espaçador', q: '1 frasco', v: 'inalatório', o: 'FP', t: ['beta2'], ped: 'salbutamol', p: PED_P },
  pedNbz: { n: 'Fenoterol + Ipratrópio — nebulização', v: 'inalatório', o: 'U', t: ['beta2'], ped: 'nbzBroncoespasmo', p: PED_P },
  pedBeclometasona: { n: 'Beclometasona 50 mcg/dose — aerossol', q: '1 frasco', v: 'inalatório', o: 'FP', t: ['corticoide'], ped: 'beclometasona', p: PED_P },
  pedMidazolam: { n: 'Midazolam 5 mg/mL', v: 'EV/IM/IN', o: 'U', t: ['benzodiazepinico'], ped: 'midazolamCrise', p: PED_P },
  pedDiazepam: { n: 'Diazepam 5 mg/mL', v: 'EV/retal', o: 'U', t: ['benzodiazepinico'], ped: 'diazepamCrise', p: PED_P },
  pedSro: { n: 'Sais para reidratação oral', q: '4 envelopes', v: 'oral', o: 'R', t: [], ped: 'sro', p: PED_P },
  pedSroPlanoB: { n: 'SRO — Plano B na unidade', v: 'oral', o: 'U', t: [], ped: 'sroPlanoB', p: PED_P },
  pedExpansao: { n: 'SF 0,9% / Ringer lactato — Plano C', v: 'EV', o: 'U', t: [], ped: 'expansaoPlanoC', p: PED_P },
  pedHolliday: { n: 'Soro de manutenção isotônico', v: 'EV', o: 'U', t: [], ped: 'hollidaySegar', p: PED_P },
  pedZinco: { n: 'Sulfato de zinco 4 mg/mL — xarope', q: '1 frasco', v: 'oral', o: 'C', t: [], ped: 'zincoDiarreia', p: PED_P },
  pedOndansetronaVO: { n: 'Ondansetrona 4 mg orodispersível', q: '1 caixa', v: 'oral', o: 'C', t: ['ondansetrona'], ped: 'ondansetronaVO', p: PED_P },
  pedOndansetronaInj: { n: 'Ondansetrona 2 mg/mL — injetável', v: 'IM/EV', o: 'U', t: ['ondansetrona'], ped: 'ondansetronaInj', p: PED_P },
  pedNistatina: { n: 'Nistatina 100.000 UI/mL — suspensão oral', q: '1 frasco', v: 'oral', o: 'C', t: [], ped: 'nistatinaOral', p: PED_P },
  pedNistatinaZnO: { n: 'Nistatina + Óxido de zinco — pomada', q: '1 bisnaga', v: 'tópico', o: 'C', t: [], ped: 'nistatinaZnO', p: PED_P },
  pedSimeticona: { n: 'Simeticona 75 mg/mL — gotas', q: '1 frasco', v: 'oral', o: 'R', t: [], ped: 'simeticonaPed', p: PED_P },
  pedLactulose: { n: 'Lactulose 667 mg/mL — xarope', q: '1 frasco', v: 'oral', o: 'C', t: [], ped: 'lactulosePed', p: PED_P },
  pedPeg: { n: 'Polietilenoglicol 3350 — pó', q: '1 frasco', v: 'oral', o: 'C', t: [], ped: 'pegPed', p: PED_P },
  pedHidroxizina: { n: 'Hidroxizina 2 mg/mL — xarope', q: '1 frasco', v: 'oral', o: 'C', t: [], ped: 'hidroxizina', p: PED_P },
  pedAciclovir: { n: 'Aciclovir 200 mg — comprimido', q: '1 caixa', v: 'oral', o: 'R', t: ['aciclovir'], ped: 'aciclovirCp', p: PED_P },
  // itens sem cálculo por peso
  pedSfNasal: { n: 'Cloreto de sódio 0,9% (soro fisiológico) — gotas/jato nasal', q: '1 frasco', v: 'nasal', o: 'R', t: [],
    p: 'Pingar/aplicar 1 a 2 mL em cada narina (lactente) ou 3 a 5 mL (criança maior), várias vezes ao dia e antes das mamadas, aspirando a secreção em seguida.' },
  pedOxidoZinco: { n: 'Óxido de zinco — pasta/pomada de barreira', q: '1 bisnaga', v: 'tópico', o: 'C', t: [],
    p: 'Aplicar camada espessa a cada troca de fralda, sem esfregar para tirar todo o creme anterior (limpar só a sujeira).' },
  pedMiconazolMamilo: { n: 'Miconazol 20 mg/g — creme (mamilo materno)', q: '1 bisnaga', v: 'tópico', o: 'R', t: [],
    p: 'Mãe: aplicar fina camada nos mamilos após as mamadas, 2 vezes ao dia, por 14 dias (limpar antes da mamada seguinte).' },
};

// =====================================================================================
// NOVAS_CONDICOES — schema de data/condicoes.js + campos novos:
//   ped: true            → condição pediátrica (filtrar/realçar quando idade < 12 ou peso preenchido)
//   pedCalc: [ids]       → itens de PEDIATRIA a mostrar já calculados na tela da condição
// =====================================================================================
const NOVAS_CONDICOES = [
  {
    id: 'bronquiolite', ped: true, nome: 'Bronquiolite viral aguda (< 2 anos)', grupo: 'Pediatria',
    cid: ['J21.9', 'Bronquiolite aguda não especificada'],
    dif: [['J21.0', 'Bronquiolite aguda devida a vírus sincicial respiratório'], ['J45.9', 'Asma não especificada'], ['J18.9', 'Pneumonia não especificada'], ['A37.9', 'Coqueluche não especificada']],
    s: { sibilancia: 3, coriza: 2, tosse: 2, esforcoResp: 2, dispneia: 1, obstrucaoNasal: 1, febre: 1, recusaAlimentar: 1, apneia: 1, lactenteJovem: 1 },
    alarme: ['Idade < 3 meses, prematuro < 32 semanas, cardiopatia/displasia/imunodeficiência → baixo limiar para internar', 'Apneia, cianose, gemência, FR > 60, tiragem, SpO₂ < 92% persistente', 'Ingestão < 50% do habitual, sem diurese há 12 h, desidratação, letargia'],
    exUbs: ['Diagnóstico clínico; sem RX ou hemograma de rotina', 'Oximetria de pulso'],
    exPs: ['Oximetria; RX de tórax só se grave, dúvida diagnóstica ou piora atípica'],
    unid: ['?pedNbz', '?pedHolliday'],
    casa: ['pedSfNasal', 'pedParacetamol', '?pedDipirona'],
    pedCalc: ['paracetamol', 'dipirona', 'nbzBroncoespasmo', 'hollidaySegar'],
    orient: ['Lavagem nasal com SF antes das mamadas e aspirar o nariz; mamadas menores e mais frequentes', 'Cabeceira elevada; evitar fumaça de cigarro; quadro piora até o 3º–5º dia e a tosse pode durar 3–4 semanas', 'NÃO usar xarope para tosse, descongestionante, corticoide, antibiótico ou nebulização de rotina (SBP)', 'Retornar em 24–48 h ou antes se cansaço para respirar, pausas na respiração, arroxeamento ou mamar pouco'],
    obs: 'SBP/Guia PS: tratamento de suporte. Broncodilatador só como teste terapêutico no quadro grave com sibilos (manter se resposta). O₂ se SpO₂ < 92%.',
  },
  {
    id: 'crupe', ped: true, nome: 'Laringotraqueíte viral (crupe)', grupo: 'Pediatria',
    cid: ['J05.0', 'Laringite obstrutiva aguda [crupe]'],
    dif: [['J05.1', 'Epiglotite aguda'], ['T17.9', 'Corpo estranho no trato respiratório, parte não especificada'], ['J04.0', 'Laringite aguda'], ['T78.3', 'Edema angioneurótico']],
    s: { tosseLadrante: 3, rouquidao: 3, estridor: 3, coriza: 1, febre: 1, esforcoResp: 1 },
    alarme: ['Estridor em repouso ou tiragem → adrenalina em nebulização + dexametasona e observar 2–4 h', 'Toxemia, febre alta, sialorreia, posição em tripé, voz abafada → epiglotite/traqueíte bacteriana (não examinar orofaringe, chamar equipe de via aérea)', 'Hipoxemia, cianose, agitação ou sonolência (exaustão) → sala vermelha; crupe < 6 meses ou recorrente → investigar'],
    exUbs: ['Diagnóstico clínico'], exPs: ['Diagnóstico clínico; oximetria. RX cervical só se dúvida (corpo estranho)'],
    unid: ['pedDexaInj', '?pedAdrenalinaNBZ', '?pedDexaElixir'],
    casa: ['pedParacetamol', '?pedDipirona'],
    pedCalc: ['dexaInj', 'dexaElixir', 'adrenalinaNBZ'],
    orient: ['Manter a criança calma, no colo do responsável; evitar manipulação', 'Nebulização com soro/ar frio não tem benefício comprovado', 'Retornar imediatamente se barulho ao respirar em repouso, afundamento entre as costelas, arroxeamento ou baba excessiva'],
    obs: 'Corticoide em dose única para TODOS os graus: dexametasona 0,15–0,6 mg/kg (máx. 16 mg; adotado teto 10 mg) VO/IM ou prednisolona 1 mg/kg (máx. 60 mg). Alta após 2–4 h sem estridor em repouso, SpO₂ normal e aceitando VO (Guia PS).',
  },
  {
    id: 'asmaPed', ped: true, nome: 'Crise asmática / sibilância (criança)', grupo: 'Pediatria',
    cid: ['J45.9', 'Asma não especificada'],
    dif: [['J21.9', 'Bronquiolite aguda não especificada'], ['J18.9', 'Pneumonia não especificada'], ['T17.9', 'Corpo estranho no trato respiratório, parte não especificada'], ['T78.2', 'Choque anafilático não especificado']],
    s: { sibilancia: 3, dispneia: 2, esforcoResp: 2, tosse: 2, asmaDpocPrevio: 2 },
    alarme: ['SpO₂ < 92%, fala entrecortada, tiragem importante, tórax silencioso, cianose, sonolência/agitação → crise grave (sala vermelha)', 'Sem resposta após 3 ciclos de broncodilatador na 1ª hora → sulfato de magnésio 25–50 mg/kg EV em 20 min (máx. 2 g) e internação', 'Crise grave prévia/UTI, uso frequente de SABA, má adesão → baixo limiar para observação prolongada'],
    exUbs: ['Oximetria de pulso; PFE se ≥ 6 anos e colaborativo'],
    exPs: ['Oximetria; RX de tórax só se suspeita de pneumonia, pneumotórax ou 1º episódio grave'],
    unid: ['pedSalbutamolSpray', '?pedNbz', 'pedPrednisolona', '?pedDexaInj'],
    casa: ['pedSalbutamolSpray', 'pedPrednisolona', '?pedBeclometasona'],
    pedCalc: ['salbutamol', 'nbzBroncoespasmo', 'prednisolona', 'dexaInj', 'beclometasona'],
    orient: ['Usar o aerossol SEMPRE com espaçador (e máscara abaixo de 4–5 anos); demonstrar a técnica', 'Plano de ação escrito: sinais de piora e quando voltar', 'Retornar à UBS em até 1 semana para avaliar controle e tratamento de manutenção'],
    obs: 'Salbutamol 1 jato/3 kg (mín. 2, máx. 10) a cada 20 min na 1ª hora + ipratrópio na crise moderada/grave. Prednisolona 1–2 mg/kg/dia por 3–5 dias, máx. 20 mg (0–2 a), 30 mg (3–5 a), 40 mg (6–11 a) — Guia PS/GINA. O₂ alvo 93–95%.',
  },
  {
    id: 'gecaPed', ped: true, nome: 'Diarreia aguda / GECA com avaliação da desidratação (criança)', grupo: 'Pediatria',
    cid: ['A09', 'Diarreia e gastroenterite de origem infecciosa presumível'],
    dif: [['A08.4', 'Infecção intestinal viral não especificada'], ['E86', 'Depleção de volume'], ['K35.8', 'Outras formas de apendicite aguda e as não especificadas'], ['N39.0', 'Infecção do trato urinário de localização não especificada']],
    s: { diarreia: 3, vomito: 2, sinaisDesidratacao: 2, febre: 1, dorAbdominal: 1, recusaAlimentar: 1 },
    alarme: ['PLANO C: letargia, não consegue beber, olhos muito fundos, prega > 2 s, pulso fino, TEC > 3 s → expansão EV e internação', 'Sangue nas fezes com comprometimento do estado geral (disenteria) → azitromicina 10 mg/kg D1 + 5 mg/kg D2–5', 'Vômitos biliosos, distensão, dor localizada → abdome cirúrgico/invaginação; < 6 meses, desnutrido ou diarreia > 14 dias → avaliação ampliada'],
    exUbs: ['Sem exames na diarreia aguda sem desidratação'],
    exPs: ['Plano C/grave: glicemia capilar, sódio, potássio, ureia, creatinina, gasometria venosa'],
    unid: ['?pedSroPlanoB', '?pedOndansetronaInj', '?pedExpansao', '?pedHolliday'],
    casa: ['pedSro', 'pedZinco', '?pedOndansetronaVO', '?pedParacetamol'],
    pedCalc: ['sro', 'sroPlanoB', 'zincoDiarreia', 'ondansetronaVO', 'ondansetronaInj', 'expansaoPlanoC', 'hollidaySegar'],
    orient: ['PLANO A: SRO após cada evacuação/vômito (< 1 a 50–100 mL; 1–10 a 100–200 mL; > 10 a à vontade) e mais líquidos', 'Manter aleitamento e a alimentação habitual; não usar antidiarreicos, antiespasmódicos ou antibiótico sem sangue nas fezes', 'Retornar em 48 h se não melhorar, ou antes se muita sede, vômitos que não param, sangue nas fezes, sonolência ou pouca urina'],
    obs: 'Classificação e planos A/B/C do MS (Guia PS). Zinco para < 5 anos por 10–14 dias. Ondansetrona dose única facilita a TRO (≥ 6 meses).',
  },
  {
    id: 'omaPed', ped: true, nome: 'Otite média aguda (criança)', grupo: 'Pediatria',
    cid: ['H66.9', 'Otite média não especificada'],
    dif: [['H65.9', 'Otite média não supurativa, não especificada'], ['H60.9', 'Otite externa não especificada'], ['H92.0', 'Otalgia']],
    s: { otalgia: 3, puxaOrelha: 2, febre: 2, otorreia: 2, coriza: 1, recusaAlimentar: 1 },
    alarme: ['Edema/dor atrás da orelha com orelha deslocada (mastoidite)', 'Paralisia facial, rigidez de nuca, sonolência → complicação intracraniana'],
    exUbs: ['Diagnóstico clínico (otoscopia: abaulamento da membrana timpânica)'], exPs: [],
    unid: ['?pedDipironaInj'],
    casa: ['pedAmoxicilinaOMA', 'pedDipirona', '?pedIbuprofeno', '?{"m":"pedAmoxClav","alt":"Falha após 48–72 h, amoxicilina nos últimos 30 dias ou otite + conjuntivite purulenta"}', '?{"m":"pedAzitromicina","alt":"Só se alergia a beta-lactâmico: 10 mg/kg D1 + 5 mg/kg D2–5"}'],
    pedCalc: ['amoxicilina', 'amoxclav', 'azitromicina', 'cefuroxima', 'dipirona', 'ibuprofeno'],
    orient: ['Analgesia é parte essencial do tratamento', 'Sem antibiótico de imediato (casos leves ≥ 2 anos): reavaliar em 48–72 h', 'Retornar se febre ou dor persistirem após 48–72 h de tratamento'],
    obs: 'ATB imediato: < 6 meses, < 2 anos bilateral, otorreia ou quadro grave (febre ≥ 39 °C/otalgia intensa > 48 h). Amoxicilina 80–90 mg/kg/dia 12/12 h (máx. 4 g/dia); duração < 2 a 10 d | 2–5 a 7 d | ≥ 6 a 5–7 d (Guia PS). Alergia não anafilática: cefuroxima 30 mg/kg/dia.',
  },
  {
    id: 'faringoPed', ped: true, nome: 'Faringoamigdalite estreptocócica (criança)', grupo: 'Pediatria',
    cid: ['J03.0', 'Amigdalite estreptocócica'],
    dif: [['J02.9', 'Faringite aguda não especificada'], ['B27.9', 'Mononucleose infecciosa não especificada'], ['A38', 'Escarlatina'], ['B08.4', 'Estomatite vesicular devida a enterovírus com exantema']],
    s: { odinofagia: 3, placas: 3, febre: 2, linfonodo: 2, dorAbdominal: 1, linguaFramboesa: 1 },
    alarme: ['Trismo, voz abafada, desvio de úvula (abscesso periamigdaliano)', 'Sialorreia, estridor, dificuldade para engolir líquidos'],
    exUbs: ['Clínico (rara antes dos 3 anos; tosse/coriza/aftas sugerem vírus); teste rápido se disponível'],
    exPs: ['Clínico; hemograma só se suspeita de mononucleose'],
    unid: ['?pedBenzatina'],
    casa: ['pedAmoxicilina', 'pedDipirona', '?pedIbuprofeno', '?{"m":"pedAzitromicina","alt":"Alergia a penicilina: 12 mg/kg/dia (máx. 500 mg) por 5 dias"}', '?{"m":"pedCefalexina","alt":"Alergia não anafilática à penicilina: 50 mg/kg/dia 12/12 h por 10 dias"}'],
    pedCalc: ['amoxicilina', 'benzatinaPed', 'azitromicina', 'cefalexina', 'dipirona', 'ibuprofeno'],
    orient: ['Benzatina (dose única) OU amoxicilina por 10 dias completos — não os dois', 'Afastamento da escola até 24 h após o início do antibiótico', 'Dieta pastosa e fria, boa hidratação'],
    obs: 'Amoxicilina 50 mg/kg/dia em 2–3 tomadas por 10 dias (máx. 1 g/dia). Benzatina: < 27 kg 600.000 UI; ≥ 27 kg 1.200.000 UI (Guia PS).',
  },
  {
    id: 'escarlatina', ped: true, nome: 'Escarlatina', grupo: 'Pediatria',
    cid: ['A38', 'Escarlatina'],
    dif: [['B05.9', 'Sarampo sem complicação'], ['M30.3', 'Síndrome de linfonodos mucocutâneos [Kawasaki]'], ['B06.9', 'Rubéola sem complicação'], ['L00', 'Síndrome da pele escaldada estafilocócica do recém-nascido']],
    s: { linguaFramboesa: 3, exantema: 2, febre: 2, odinofagia: 2, placas: 1 },
    alarme: ['Febre ≥ 5 dias + conjuntivite, mucosite, edema de mãos/pés → pensar em Kawasaki', 'Edema, urina escura/hematúria 1–3 semanas depois (GNPE); artrite migratória ou sopro (febre reumática)'],
    exUbs: ['Diagnóstico clínico'], exPs: [],
    unid: ['?pedBenzatina'],
    casa: ['pedAmoxicilina', 'pedDipirona', '?{"m":"pedAzitromicina","alt":"Alergia a penicilina: 12 mg/kg/dia por 5 dias"}'],
    pedCalc: ['amoxicilina', 'benzatinaPed', 'azitromicina', 'dipirona'],
    orient: ['Afastamento da escola até 24 h após o início do antibiótico', 'Descamação de mãos e pés 1–2 semanas depois é esperada', 'Completar os 10 dias de antibiótico'],
    obs: 'Mesmo tratamento da faringite estreptocócica: benzatina dose única (1ª linha) ou amoxicilina 50 mg/kg/dia 8/8 h por 10 dias (máx. 500 mg/dose) — Guia PS.',
  },
  {
    id: 'febreSemFoco', ped: true, nome: 'Febre sem sinais localizatórios (< 3 anos)', grupo: 'Pediatria',
    cid: ['R50.9', 'Febre não especificada'],
    dif: [['N39.0', 'Infecção do trato urinário de localização não especificada'], ['A41.9', 'Septicemia não especificada'], ['B08.2', 'Exantema súbito [sexta doença]'], ['G03.9', 'Meningite não especificada']],
    s: { febreSemFoco: 3, febre: 2, lactenteJovem: 2, recusaAlimentar: 1 },
    alarme: ['< 28 dias com febre → internar, triagem completa (hemograma, PCR, urina, hemocultura, LCR) e ATB empírico', '29–90 dias: hemograma, PCR/procalcitonina, urina tipo 1 + urocultura, hemocultura; baixo risco pode ter seguimento ambulatorial em 24 h', 'Toxemia (letargia, má perfusão, petéquias, irritabilidade extrema) em qualquer idade → sepse/meningite'],
    exUbs: ['3–36 meses, T ≥ 39 °C ou vacinação incompleta: urina tipo 1 + urocultura (cateterismo/jato médio; saco coletor só para triagem)', 'Hemograma e PCR conforme idade/estado vacinal'],
    exPs: ['Hemograma, PCR, urina tipo 1 + urocultura, hemocultura; RX tórax se leucocitose ≥ 20.000 ou taquipneia; LCR se < 28 dias ou toxemia'],
    unid: ['?pedDipironaInj'],
    casa: ['pedDipirona', '?pedParacetamol'],
    pedCalc: ['dipirona', 'paracetamol', 'dipironaInj'],
    orient: ['Antitérmico só para desconforto, não para "zerar" a febre; oferecer líquidos', 'Reavaliar em 24–48 h; febre > 5 dias precisa de nova avaliação (ex.: Kawasaki)', 'Retornar já se sonolência, gemência, manchas que não somem ao apertar, recusa de líquidos ou piora'],
    obs: 'Avaliar sempre a carteira vacinal (pneumo/Hib). Causa bacteriana oculta mais comum: ITU.',
  },
  {
    id: 'moniliaseOral', ped: true, nome: 'Candidíase oral (monilíase, "sapinho")', grupo: 'Pediatria',
    cid: ['B37.0', 'Estomatite por Candida'],
    dif: [['B00.2', 'Gengivoestomatite e faringoamigdalite devida ao vírus do herpes'], ['K12.0', 'Aftas bucais recidivantes'], ['K12.1', 'Outras formas de estomatite']],
    s: { sapinho: 3, recusaAlimentar: 1 },
    alarme: ['Lesões extensas, recorrentes ou além do 1º ano sem causa (antibiótico/corticoide inalatório) → investigar imunodeficiência (HIV)', 'Recusa alimentar com desidratação'],
    exUbs: ['Diagnóstico clínico (placas que não saem com a gaze, diferente de resto de leite)'], exPs: [],
    unid: [],
    casa: ['pedNistatina', '?pedMiconazolMamilo'],
    pedCalc: ['nistatinaOral'],
    orient: ['Ferver bicos, chupetas e mordedores diariamente', 'Se a mãe tem dor/fissura no mamilo: tratar a mãe junto (miconazol creme)', 'Violeta de genciana é proscrita (SBP)'],
    obs: 'Nistatina 7–14 dias, mantendo 48 h após sumirem as lesões (Guia PS).',
  },
  {
    id: 'dermatiteFralda', ped: true, nome: 'Dermatite da área das fraldas (assadura)', grupo: 'Pediatria',
    cid: ['L22', 'Dermatite das fraldas'],
    dif: [['B37.2', 'Candidíase da pele e das unhas'], ['L21.1', 'Dermatite seborreica infantil'], ['L01.0', 'Impetigo']],
    s: { assadura: 3, eritemaPele: 1, diarreia: 1 },
    alarme: ['Pústulas, bolhas, crostas melicéricas ou febre → infecção bacteriana', 'Lesões erosivas, persistentes ou fora da área da fralda → reavaliar (psoríase, histiocitose, carência de zinco)'],
    exUbs: ['Diagnóstico clínico'], exPs: [],
    unid: [],
    casa: ['pedOxidoZinco', '?pedNistatinaZnO'],
    pedCalc: ['nistatinaZnO'],
    orient: ['Trocar a fralda com frequência e deixar a pele secar/ficar sem fralda alguns períodos', 'Limpar com água morna e algodão; evitar lenços com perfume/álcool, talco e amido', 'Não usar pomadas com corticoide forte nem combinações com antibiótico/antifúngico sem orientação'],
    obs: 'Assadura irritativa: barreira (óxido de zinco). Comprometimento das pregas + lesões satélites = candidíase → nistatina + óxido de zinco 14 dias.',
  },
  {
    id: 'colicaLactente', ped: true, nome: 'Cólica do lactente / choro excessivo', grupo: 'Pediatria',
    cid: ['R10.4', 'Outras dores abdominais e as não especificadas'],
    dif: [['K21.9', 'Doença de refluxo gastroesofágico sem esofagite'], ['K56.1', 'Intussuscepção'], ['K40.9', 'Hérnia inguinal unilateral ou não especificada, sem obstrução ou gangrena'], ['N39.0', 'Infecção do trato urinário de localização não especificada']],
    s: { choroExcessivo: 3, colica: 1, lactenteJovem: 1 },
    alarme: ['Febre, vômitos em jato ou biliosos, recusa alimentar, baixo ganho de peso', 'Choro agudo intermitente com palidez/letargia ou sangue nas fezes (invaginação, APLV)', 'Hérnia endurecida, lesões suspeitas de maus-tratos'],
    exUbs: ['Diagnóstico clínico; exame físico completo (hérnias, fio de cabelo em dedo — "torniquete")'], exPs: [],
    unid: [],
    casa: ['?pedSimeticona'],
    pedCalc: ['simeticonaPed'],
    orient: ['É comum (> 3 h/dia, > 3 dias/semana), pico com 6 semanas e melhora até 3–4 meses; o bebê está saudável', 'Acalmar: colo, embalar, ruído branco, banho morno, massagem; conferir pega e técnica de amamentação', 'NUNCA sacudir o bebê; se o cuidador estiver no limite, colocar o bebê em local seguro e pedir ajuda'],
    obs: 'Simeticona e antiespasmódicos sem benefício comprovado (SBP). Não retirar alimentos da dieta materna de rotina.',
  },
  {
    id: 'constipacaoPed', ped: true, nome: 'Constipação intestinal funcional (criança)', grupo: 'Pediatria',
    cid: ['K59.0', 'Constipação'],
    dif: [['Q43.1', 'Doença de Hirschsprung'], ['E03.9', 'Hipotireoidismo não especificado'], ['F98.1', 'Encoprese de origem não orgânica']],
    s: { fezesEndurecidas: 3, constipacao: 2, dorAbdominal: 1, dorAnal: 1 },
    alarme: ['Início no 1º mês ou eliminação de mecônio > 48 h (Hirschsprung)', 'Distensão importante, vômitos biliosos, sangue sem fissura, perda de peso', 'Alteração neurológica de membros inferiores, lesão/tufo de pelos na região lombossacra'],
    exUbs: ['Diagnóstico clínico (Roma IV); TSH só se outros sinais'], exPs: ['RX de abdome só se dúvida de fecaloma'],
    unid: [],
    casa: ['pedPeg', '?pedLactulose'],
    pedCalc: ['pegPed', 'lactulosePed'],
    orient: ['Sentar no vaso 5–10 min após as refeições, com apoio para os pés', 'Mais água, frutas (ameixa, pera, mamão) e fibras; manter o laxativo por no mínimo 2 meses, com desmame gradual', 'Diário das evacuações (escala de Bristol) para o retorno'],
    obs: 'PEG 0,4–0,8 g/kg/dia (> 2 a) é 1ª escolha; lactulose em qualquer idade. Fecaloma: PEG 1–1,5 g/kg/dia por 3–6 dias ou enema. Óleo mineral: evitar < 2–3 anos e se risco de aspiração (Guia PS).',
  },
  {
    id: 'convulsaoFebril', ped: true, nome: 'Convulsão febril', grupo: 'Pediatria',
    cid: ['R56.0', 'Convulsões febris'],
    dif: [['G03.9', 'Meningite não especificada'], ['G04.9', 'Encefalite, mielite e encefalomielite não especificada'], ['G40.9', 'Epilepsia não especificada']],
    s: { convulsao: 3, criseLeiga: 3, febre: 3 },
    alarme: ['Crise > 5 min → benzodiazepínico (midazolam IM/IN/EV ou diazepam EV/retal)', 'Complexa: > 15 min, focal, > 1 crise em 24 h; ou < 6 meses / > 5 anos', 'Não volta ao normal em 1 h, rigidez de nuca, fontanela abaulada, petéquias → punção lombar/sepse; LCR também se < 12 meses com vacinação incompleta ou ATB prévio'],
    exUbs: ['Glicemia capilar; exames dirigidos à causa da febre'],
    exPs: ['Glicemia capilar; investigação do foco febril. EEG/TC NÃO são necessários na crise febril simples'],
    unid: ['?pedMidazolam', '?pedDiazepam', 'pedDipironaInj'],
    casa: ['pedDipirona', '?pedParacetamol'],
    pedCalc: ['midazolamCrise', 'diazepamCrise', 'dipironaInj', 'dipirona', 'paracetamol'],
    orient: ['Na crise: deitar de lado, proteger a cabeça, não colocar nada na boca, marcar o tempo; > 5 min procurar atendimento', 'Recorrência em ~30% (maior se < 1 ano); antitérmico NÃO previne nova crise', 'Bom prognóstico; risco de epilepsia baixo na crise simples'],
    obs: 'Simples: 6 meses–5 anos, generalizada, < 15 min, única em 24 h, retorno rápido da consciência (Guia PS).',
  },
  {
    id: 'ituPed', ped: true, nome: 'Infecção do trato urinário (criança)', grupo: 'Pediatria',
    cid: ['N39.0', 'Infecção do trato urinário de localização não especificada'],
    dif: [['N10', 'Nefrite túbulo-intersticial aguda'], ['N30.0', 'Cistite aguda'], ['R50.9', 'Febre não especificada']],
    s: { febre: 2, febreSemFoco: 2, disuria: 2, polaciuria: 2, dorSuprapubica: 1, dorLombar: 1, vomito: 1, recusaAlimentar: 1 },
    alarme: ['< 3 meses, toxemia, vômitos que impedem VO, desidratação, má adesão → internar (ceftriaxona 50–75 mg/kg/dia EV)', 'Uropatia conhecida, ITU de repetição, insuficiência renal'],
    exUbs: ['Urina tipo 1 + urocultura ANTES do antibiótico (jato médio ou cateterismo; saco coletor só exclui se negativo)'],
    exPs: ['Urina tipo 1 + urocultura; hemograma, PCR, ureia e creatinina se febril/toxemiado'],
    unid: ['?pedDipironaInj'],
    casa: ['pedCefalexina', 'pedDipirona', '?pedSmxTmp', '?pedAmoxClav', '?pedCefuroxima'],
    pedCalc: ['cefalexina', 'smxtmp', 'amoxclav', 'cefuroxima', 'dipirona'],
    orient: ['Completar o antibiótico; ajustar pelo resultado da urocultura', 'Combater constipação e corrigir hábitos de micção (urinar a cada 3 h, não segurar)', 'Retornar se febre persistir após 48 h de antibiótico'],
    obs: 'Cefalexina 50 mg/kg/dia; SMX-TMP 8 mg/kg/dia de TMP (≥ 6 semanas); amox-clav 40–50 mg/kg/dia; cefuroxima 20–30 mg/kg/dia (Guia PS). Febril 7–10 dias; afebril 5–7 dias. 1º episódio febril < 2 anos: USG de rins e vias urinárias.',
  },
];

// =====================================================================================
// NOVOS_SINTOMAS — formato de data/sintomas.js (rótulo + sinônimos sem acento, minúsculos).
// Atenção ao detector: sinônimo casa por trecho, precisa começar em início de palavra e é
// anulado se houver "nega/sem/nao/nem" nos 40 caracteres anteriores (mesma frase).
// =====================================================================================
const NOVOS_SINTOMAS = {
  tosseLadrante: ['Tosse ladrante ("de cachorro")', 'tosse de cachorro', 'tosse de cao', 'tosse ladrante', 'tosse de foca', 'tosse metalica', 'tosse rouca', 'tosse de latido', 'tosse que parece latido'],
  rouquidao: ['Rouquidão', 'rouquidao', 'rouco', 'rouca', 'voz rouca', 'disfonia', 'afonia', 'perdeu a voz', 'ficou sem voz'],
  estridor: ['Estridor', 'estridor', 'barulho ao puxar o ar', 'barulho para puxar o ar', 'barulho pra puxar o ar', 'ronco ao respirar', 'chiado na garganta', 'respiracao barulhenta'],
  esforcoResp: ['Esforço respiratório (tiragem)', 'tiragem', 'retracao', 'batimento de asa', 'asa de nariz', 'canseira pra respirar', 'barriga afundando', 'barriga subindo e descendo', 'afundando as costelas', 'costela aparecendo', 'gemencia', 'gemente', 'respirando com dificuldade', 'puxando o ar', 'fungando muito'],
  apneia: ['Apneia / pausa respiratória', 'apneia', 'parou de respirar', 'pausa na respiracao', 'pausas respiratorias', 'ficou roxinho', 'ficou roxinha', 'cianose'],
  recusaAlimentar: ['Recusa alimentar / mamando pouco', 'mamando pouco', 'mama pouco', 'recusa alimentar', 'recusando alimento', 'recusa o peito', 'parou de mamar', 'parou de comer', 'aceitando pouco', 'aceitacao ruim', 'pouca aceitacao'],
  sinaisDesidratacao: ['Sinais de desidratação', 'olhos fundos', 'boca seca', 'lingua seca', 'mucosas secas', 'chora sem lagrima', 'xixi pouco', 'urinando pouco', 'fralda seca', 'moleira funda', 'fontanela deprimida', 'prega lenta', 'sinal da prega', 'bebendo avidamente', 'muito sedento', 'desidratad'],
  lactenteJovem: ['Lactente < 3 meses / RN', 'recem nascido', 'recem-nascido', 'neonato', 'dias de vida', 'bebe de 1 mes', 'bebe de 2 meses', 'com 1 mes de vida', 'com 2 meses de vida', 'prematuro'],
  febreSemFoco: ['Febre sem foco aparente', 'febre sem foco', 'so febre', 'apenas febre', 'somente febre', 'febre isolada', 'febre sem outros sintomas', 'febre sem causa'],
  puxaOrelha: ['Puxa/coça a orelha (lactente)', 'puxando a orelha', 'puxa a orelha', 'coca a orelha', 'cocando a orelha', 'mexendo na orelha', 'mao no ouvido', 'chora ao deitar'],
  sapinho: ['Placas brancas na boca (sapinho)', 'sapinho', 'monilia', 'monilias', 'placas brancas na boca', 'placa branca na boca', 'lingua branca', 'boca branca', 'candidiase oral', 'leite talhado na boca'],
  assadura: ['Assadura (dermatite de fraldas)', 'assadura', 'assadinho', 'bumbum assado', 'bumbum vermelho', 'vermelhidao na fralda', 'regiao da fralda', 'area da fralda', 'dermatite de fralda', 'dermatite das fraldas'],
  choroExcessivo: ['Choro excessivo/inconsolável (lactente)', 'chora muito', 'choro inconsolavel', 'choro excessivo', 'chorando muito', 'chora o tempo todo', 'colica do bebe', 'colica de bebe', 'colica do lactente', 'encolhe as pernas', 'chora no fim da tarde'],
  fezesEndurecidas: ['Fezes endurecidas / dor para evacuar (criança)', 'fezes duras', 'fezes endurecidas', 'coco duro', 'bolinhas de cabrito', 'coco em bolinha', 'coco em bolinhas', 'dor para fazer coco', 'dor pra fazer coco', 'segura o coco', 'segurando o coco', 'escape fecal', 'suja a cueca', 'suja a calcinha', 'escape de fezes'],
  linguaFramboesa: ['Língua em framboesa / exantema áspero', 'lingua em framboesa', 'lingua de framboesa', 'lingua de morango', 'lingua em morango', 'pele de lixa', 'pele aspera', 'manchas asperas', 'sinal de pastia', 'palidez perioral', 'descamando os dedos', 'descamacao das maos'],
  criseLeiga: ['Crise convulsiva (relato leigo)', 'revirou os olhos', 'olhos virados', 'olho virado', 'ficou dura', 'ficou duro', 'ficou durinha', 'ficou durinho', 'se debateu', 'tremeu todo', 'tremeu toda', 'babando e tremendo', 'desmaiou com febre', 'ataque de febre'],
  pruridoAnal: ['Prurido anal noturno (oxiúros)', 'coceira no bumbum', 'coceira no anus', 'coceira anal', 'coca o bumbum', 'bichinhos nas fezes', 'bichinho no coco', 'vermes nas fezes'],
};
// Sinônimos a ACRESCENTAR em chaves já existentes de data/sintomas.js:
const SINONIMOS_EXISTENTES = {
  sibilancia: ['ronqueira', 'chieira', 'chiadeira', 'peito roncando', 'miando no peito'],
  dispneia: ['cansaco pra respirar', 'cansacinho'],
  vomito: ['gorfo', 'gorfando', 'golfada', 'regurgit', 'botando pra fora', 'pondo pra fora'],
  diarreia: ['coco mole', 'coco liquido', 'coco aguado', 'fezes aguadas', 'evacuando muito'],
  febre: ['corpo quente', 'termometro marcou'],
  constipacao: ['nao faz coco', 'sem fazer coco'], // obs.: "nao/sem" no próprio sinônimo não anula (o NEG só olha o texto ANTES)
  exantema: ['brotoeja', 'pintinhas no corpo'],
  coriza: ['meleca', 'ranho', 'nariz pingando'],
};

// Export opcional (não interfere no uso como script)
if (typeof module !== 'undefined') module.exports = { NOVOS_PED, NOVOS_MEDS, NOVAS_CONDICOES, NOVOS_SINTOMAS, SINONIMOS_EXISTENTES, pedFmt, pedMl };

  const P = { remover: [] };
  if (typeof NOVAS_CONDICOES !== 'undefined') P.NOVAS_CONDICOES = NOVAS_CONDICOES;
  if (typeof NOVOS_MEDS !== 'undefined') P.NOVOS_MEDS = NOVOS_MEDS;
  if (typeof NOVOS_SINTOMAS !== 'undefined') P.NOVOS_SINTOMAS = NOVOS_SINTOMAS;
  if (typeof SINONIMOS_EXTRA !== 'undefined') P.SINONIMOS_EXTRA = SINONIMOS_EXTRA;
  if (typeof SINONIMOS_EXISTENTES !== 'undefined') P.SINONIMOS_EXISTENTES = SINONIMOS_EXISTENTES;
  if (typeof TAGS_EM_MEDS_EXISTENTES !== 'undefined') P.TAGS_EM_MEDS_EXISTENTES = TAGS_EM_MEDS_EXISTENTES;
  if (typeof REGRAS_CORRIGIDAS !== 'undefined') P.REGRAS_CORRIGIDAS = REGRAS_CORRIGIDAS;
  if (typeof NOVAS_REGRAS !== 'undefined') P.NOVAS_REGRAS = NOVAS_REGRAS;
  if (typeof NOVAS_PROIBE !== 'undefined') P.NOVAS_PROIBE = NOVAS_PROIBE;
  if (typeof NOVOS_PED !== 'undefined') P.NOVOS_PED = NOVOS_PED;
  window.mesclarPacote(P);
})();
