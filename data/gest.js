// Conteúdo incorporado das referências enviadas pelo médico (gest) — revisado.
(function () {
// PROPOSTA — Gestação, lactação, saúde da mulher e puericultura (APS) — Prontuário Rápido
// Revisor: GO/MFC. Fontes: Manual APS Saúde da Mulher e Puericultura (MEDRoute 2026, ref. 06),
// "Medicamentos gestantes" (ref. 17), "Prescrição na gestação" (Estratégia MED, ref. 18),
// cruzadas com MS (CAB 32 pré-natal; PCDT IST 2022; PCDT-TV 2022; NT 251/2024 cálcio), FEBRASGO/RBEHG 2025-26, SBD 2026, SBP 2026.
// Formato idêntico aos arquivos do app. Nada aqui foi aplicado no app — é só proposta.
// Chaves de MEDS citadas: existentes (paracetamol, dipirona, hioscina, aluminio, omeprazol, lactulose, cefalexina, amoxClav,
// azitromicina1g, ceftriaxonaIST, benzatinaSifilis, metronidazolVB, metronidazolGel, miconazolCreme, nitrofurantoinaGest,
// anlodipino, metoclopramida, metoclopramidaEV, ibuprofeno, dipironaIM, diclofenacoIM, hioscinaEV, albendazol,
// sulfatoFerroso, pomadaHemorroida, ciclobenzaprina, metformina, sf1000) ou novas (NOVOS_MEDS abaixo).

// =====================================================================================
// 1) NOVOS MEDS  (o: R = UBS Pedreira 2026 | FP | U = unidade | C = compra)
// =====================================================================================
const NOVOS_MEDS = {
  // ---------- pré-natal / suplementação ----------
  acidoFolico5: { n: 'Ácido fólico 5 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, uma vez ao dia, até completar 12 semanas de gestação.',
    obs: 'UBS Pedreira só tem 5 mg (dose do CAB 32 e de alto risco: epilepsia, bariátrica, DTN prévio). Dose padrão MS/OMS: 0,4 mg/dia — usar a solução 0,2 mg/mL se houver.' },
  acidoFolicoGotas: { n: 'Ácido fólico 0,2 mg/mL — solução oral', q: '1 frasco', v: 'oral', o: 'C', t: [],
    p: 'Tomar 2 mL (0,4 mg), por via oral, uma vez ao dia, até completar 12 semanas de gestação.',
    obs: 'Nº de gotas varia com o conta-gotas (em geral 40 gotas ≈ 2 mL).' },
  sulfatoFerrosoGest: { n: 'Sulfato ferroso 40 mg de ferro elementar', q: '60 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, uma vez ao dia, 1 hora antes do almoço, com suco de laranja ou limão. Manter durante toda a gestação e até 3 meses após o parto. Não tomar junto com leite, café, antiácido ou cálcio. Fezes ficam escuras.' },
  sulfatoFerrosoTrat: { n: 'Sulfato ferroso 40 mg de ferro elementar', q: '150 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 2 comprimidos antes do café, 2 comprimidos antes do almoço e 1 comprimido antes do jantar (200 mg de ferro elementar ao dia), 1 hora antes das refeições, com suco cítrico. Não tomar junto com leite, café, antiácido ou cálcio.',
    obs: 'Esquema de tratamento MS. Se intolerância gastrointestinal: reduzir para 2–3 comprimidos/dia ou dias alternados (melhor absorção) antes de abandonar. Após Hb ≥ 11 g/dL, voltar a 1 comprimido/dia até 3 meses pós-parto.' },
  carbonatoCalcioGest: { n: 'Carbonato de cálcio 1.250 mg (500 mg de cálcio elementar)', q: '60 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, após o café da manhã e 1 comprimido após o jantar, a partir de 12 semanas de gestação até o parto. Tomar com intervalo de pelo menos 2 horas do sulfato ferroso.',
    obs: 'UBS Pedreira lista "Carbonato de cálcio 500 mg": confirmar na farmácia se são 500 mg de cálcio elementar (= 1.250 mg de sal). Se forem 500 mg de sal (200 mg de cálcio), ajustar. MS (NT 251/2024) mantém suplementação universal; FEBRASGO/RBEHG (abr/2026) não indicam mais para profilaxia de pré-eclâmpsia.' },
  aasPE: { n: 'Ácido acetilsalicílico 100 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['aasBaixa'],
    p: 'Tomar 1 comprimido, por via oral, uma vez ao dia, à noite, após o jantar. Iniciar entre 12 e 16 semanas de gestação e manter até 36 semanas.',
    obs: 'Profilaxia de pré-eclâmpsia: 1 fator de alto risco OU ≥ 2 moderados. Suspender se pré-eclâmpsia confirmada. (FEBRASGO aceita 100–150 mg; MS/UBS Pedreira: 100 mg.)' },

  // ---------- hipertensão na gestação ----------
  metildopa: { n: 'Metildopa 250 mg', q: '90 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, a cada 8 horas. Uso contínuo (dose ajustada no pré-natal; máximo 8 comprimidos/dia). Pode causar sonolência no início.' },
  nifedipinoRetard: { n: 'Nifedipino 20 mg (liberação prolongada)', q: '60 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, a cada 12 horas. Engolir inteiro, sem partir ou mastigar. Uso contínuo.' },
  nifedipinoCrise: { n: 'Nifedipino 10 mg (ação rápida)', v: 'oral', o: 'U', t: [],
    p: 'Dar 10 mg por via ORAL (engolir — nunca sublingual, não mastigar). Repetir 10 mg a cada 20–30 minutos se PA ≥ 160/110 mmHg (máximo 30 mg). Meta: PAS < 150 e PAD < 100, sem queda > 25%. PA a cada 5 min e BCF. Acionar SAMU/vaga zero.' },
  sulfatoMgPE: { n: 'Sulfato de magnésio — esquema de Pritchard (MgSO₄ 50%)', v: 'IM', o: 'U', t: [],
    p: 'Ataque: 4 g EV lento em 15–20 min (MgSO₄ 50% 8 mL + 12 mL de SF 0,9% ou AD; ou 40 mL de MgSO₄ 10% + 60 mL SF) + 10 g IM profundo (10 mL de MgSO₄ 50% em cada glúteo, com 1 mL de lidocaína 2% sem vasoconstritor). Se demora na transferência: 5 g IM a cada 4 horas, alternando glúteos.',
    obs: 'Antes de cada dose: reflexo patelar presente, FR ≥ 12–16 irpm e diurese ≥ 25–30 mL/h. Intoxicação → suspender e dar gluconato de cálcio 10% 10 mL EV em 3–5 min.' },
  gluconatoCalcioMg: { n: 'Gluconato de cálcio 10% — 10 mL', v: 'EV', o: 'U', t: [],
    p: 'Aplicar 10 mL EV lento, em 3 a 5 minutos, se intoxicação por magnésio (arreflexia, depressão respiratória).' },

  // ---------- sintomas comuns da gestação ----------
  simeticona: { n: 'Simeticona 75 mg/mL — gotas', q: '1 frasco', v: 'oral', o: 'R', t: [],
    p: 'Tomar 30 a 40 gotas, por via oral, a cada 8 horas, se gases ou estufamento.' },
  psyllium: { n: 'Psyllium (Plantago ovata) — pó', q: '1 pote', v: 'oral', o: 'C', t: [],
    p: 'Diluir 1 colher de sopa (ou 1 sachê) em 1 copo de água e tomar 1 a 2 vezes ao dia; beber mais 1 copo de água logo após.' },
  bisacodil: { n: 'Bisacodil 5 mg', q: '6 comprimidos', v: 'oral', o: 'C', t: [],
    p: 'Tomar 1 a 2 comprimidos, por via oral, à noite, apenas se ficar mais de 3 dias sem evacuar. No máximo 3 dias seguidos.' },
  supositorioGlicerina: { n: 'Supositório de glicerina (adulto)', q: '1 caixa', v: 'retal', o: 'C', t: [],
    p: 'Aplicar 1 supositório via retal, se ficar mais de 3 dias sem evacuar ou fezes muito ressecadas.' },
  diosmina: { n: 'Diosmina 900 mg + Hesperidina 100 mg', q: '20 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, 3 vezes ao dia por 4 dias; depois 1 comprimido 2 vezes ao dia por 3 dias; depois 1 comprimido ao dia.' },
  prometazinaVO: { n: 'Prometazina 25 mg', q: '10 comprimidos', v: 'oral', o: 'R', t: ['sedativo', 'anticolinergico'],
    p: 'Tomar 1 comprimido, por via oral, a cada 8 horas, se náuseas ou vômitos. Causa sonolência — não dirigir.' },

  // ---------- vulvovaginites / IST ----------
  nistatinaCreme: { n: 'Nistatina 25.000 UI/g — creme vaginal', q: '1 bisnaga', v: 'vaginal', o: 'R', t: [],
    p: 'Aplicar 1 aplicador cheio via vaginal, à noite, ao deitar, por 14 noites.' },
  doxiciclinaDIP: { n: 'Doxiciclina 100 mg', q: '28 comprimidos', v: 'oral', o: 'R', t: ['tetraciclina', 'atb'],
    p: 'Tomar 1 comprimido, por via oral, a cada 12 horas, por 14 dias. Tomar com bastante água e não deitar logo após.' },
  metronidazolDIP: { n: 'Metronidazol 250 mg', q: '56 comprimidos', v: 'oral', o: 'R', t: ['metronidazol', 'atb'],
    p: 'Tomar 2 comprimidos (500 mg), por via oral, a cada 12 horas, por 14 dias. Não ingerir bebida alcoólica durante e até 24 h após.' },

  // ---------- puerpério / amamentação ----------
  cefalexinaMastite: { n: 'Cefalexina 500 mg', q: '56 cápsulas', v: 'oral', o: 'R', t: ['cefalosporina', 'atb'],
    p: 'Tomar 1 cápsula, por via oral, a cada 6 horas, por 10 a 14 dias. Continuar amamentando.' },
  amoxClavMastite: { n: 'Amoxicilina 500 mg + Clavulanato de potássio 125 mg', q: '42 comprimidos', v: 'oral', o: 'R', t: ['penicilina', 'atb'],
    p: 'Tomar 1 comprimido, por via oral, a cada 8 horas, por 10 a 14 dias, no início das refeições. Continuar amamentando.' },
  clindamicinaMastite: { n: 'Clindamicina 300 mg', q: '56 cápsulas', v: 'oral', o: 'C', t: ['atb'],
    p: 'Tomar 1 cápsula, por via oral, a cada 6 horas, por 10 a 14 dias.', obs: 'Se alergia grave (anafilaxia) a betalactâmico. Observar diarreia no lactente.' },
  lanolina: { n: 'Lanolina purificada (anidra) — pomada', q: '1 bisnaga', v: 'tópico', o: 'C', t: [],
    p: 'Aplicar fina camada no mamilo após as mamadas, apenas se fissura profunda. Não precisa retirar para amamentar.' },

  // ---------- contracepção ----------
  aco: { n: 'Etinilestradiol 0,03 mg + Levonorgestrel 0,15 mg', q: '3 cartelas', v: 'oral', o: 'R', t: ['estrogenio', 'hormonal'],
    p: 'Tomar 1 comprimido, por via oral, todos os dias no mesmo horário, por 21 dias; pausar 7 dias e iniciar nova cartela no 8º dia. Iniciar no 1º dia da menstruação (ou até o 5º dia).' },
  minipilula: { n: 'Noretisterona 0,35 mg', q: '3 cartelas', v: 'oral', o: 'R', t: ['progestagenio', 'hormonal'],
    p: 'Tomar 1 comprimido, por via oral, todos os dias no mesmo horário (atraso máximo de 3 horas), sem pausa entre as cartelas.' },
  medroxiInj: { n: 'Acetato de medroxiprogesterona 150 mg/mL — injetável trimestral', q: '1 ampola', v: 'IM', o: 'R', t: ['progestagenio', 'hormonal'],
    p: 'Aplicar 1 ampola IM profunda, a cada 3 meses (13 semanas), sem massagear o local. 1ª dose do 1º ao 7º dia do ciclo. Retorno permitido até 2 semanas antes ou depois da data.' },
  injMensal: { n: 'Enantato de noretisterona 50 mg + Valerato de estradiol 5 mg/mL — injetável mensal', q: '1 ampola', v: 'IM', o: 'R', t: ['estrogenio', 'hormonal'],
    p: 'Aplicar 1 ampola IM profunda a cada 30 dias (± 3 dias), sem massagear o local. 1ª dose do 1º ao 5º dia do ciclo.' },
  levonorgestrelEmerg: { n: 'Levonorgestrel 0,75 mg', q: '2 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar os 2 comprimidos juntos, por via oral, em dose única, o quanto antes (até 5 dias após a relação; mais eficaz nas primeiras 72 horas). Se vomitar em até 3 horas, repetir a dose.' },
  ciproteronaEE: { n: 'Ciproterona 2 mg + Etinilestradiol 0,035 mg', q: '3 cartelas', v: 'oral', o: 'R', t: ['estrogenio', 'hormonal', 'antiandrogenio'],
    p: 'Tomar 1 comprimido, por via oral, todos os dias no mesmo horário, por 21 dias; pausar 7 dias e reiniciar.',
    obs: 'A UBS Pedreira grafa "Ciproterona 0,035 mg + Etinilestradiol 2 mg" (doses invertidas). Maior risco de TEV que o levonorgestrel — reservar para hirsutismo/acne importantes.' },

  // ---------- SOP / climatério / SUA ----------
  espironolactonaSOP: { n: 'Espironolactona 50 mg', q: '60 comprimidos', v: 'oral', o: 'R', t: ['espironolactona', 'antiandrogenio'],
    p: 'Tomar 1 comprimido, por via oral, pela manhã, por 7 dias; depois 1 comprimido 2 vezes ao dia (100 mg/dia). Uso contínuo, reavaliar em 6 meses. Usar método contraceptivo eficaz.' },
  metforminaSOP: { n: 'Metformina 850 mg', q: '60 comprimidos', v: 'oral', o: 'FP', t: ['metformina'],
    p: 'Tomar 1 comprimido, por via oral, após o jantar, por 7 dias; depois 1 comprimido após o café e 1 após o jantar. Uso contínuo.' },
  venlafaxinaFogacho: { n: 'Venlafaxina 75 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['irsn'],
    p: 'Tomar 1 comprimido, por via oral, uma vez ao dia, após o café da manhã. Não suspender de forma abrupta.',
    obs: 'Ideal iniciar 37,5 mg (não há na UBS Pedreira). Opção preferida em usuárias de tamoxifeno.' },
  paroxetinaFogacho: { n: 'Paroxetina 20 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['isrs'],
    p: 'Tomar ½ comprimido (10 mg), por via oral, pela manhã, por 7 dias; depois 1 comprimido ao dia. Não suspender de forma abrupta.',
    obs: 'Não usar com tamoxifeno (inibe CYP2D6).' },
  estriolCreme: { n: 'Estriol 1 mg/g — creme vaginal', q: '1 bisnaga', v: 'vaginal', o: 'C', t: ['estrogenioTopico'],
    p: 'Aplicar 1 aplicador via vaginal, à noite, por 14 noites; depois 2 vezes por semana (manutenção).' },
  thEstradiol: { n: 'Estradiol 1 mg (terapia hormonal)', q: '28 comprimidos', v: 'oral', o: 'C', t: ['estrogenioTH'],
    p: 'Tomar 1 comprimido, por via oral, uma vez ao dia, de forma contínua. Mulher com útero: associar obrigatoriamente progestagênio.' },
  progesteronaMicro: { n: 'Progesterona micronizada 100 mg', q: '30 cápsulas', v: 'oral', o: 'C', t: [],
    p: 'Tomar 1 cápsula, por via oral, à noite, ao deitar, todos os dias (uso contínuo junto ao estradiol). Pode causar sonolência.' },
  tranexamico: { n: 'Ácido tranexâmico 250 mg', q: '30 comprimidos', v: 'oral', o: 'C', t: ['antifibrinolitico'],
    p: 'Tomar 4 comprimidos (1 g), por via oral, a cada 8 horas, apenas nos dias de maior fluxo, por até 5 dias por ciclo.' },
  ibuprofenoDismenorreia: { n: 'Ibuprofeno 300 mg', q: '18 comprimidos', v: 'oral', o: 'R', t: ['aine'],
    p: 'Tomar 2 comprimidos (600 mg), por via oral, a cada 8 horas, após as refeições. Iniciar 1 a 2 dias antes da menstruação (ou ao primeiro sinal de cólica) e manter por até 3 dias. Não ultrapassar 7 dias por ciclo.' },

  // ---------- DMG ----------
  insulinaNPHGest: { n: 'Insulina humana NPH 100 UI/mL', q: '1 frasco', v: 'SC', o: 'R', t: ['insulina'],
    p: 'Aplicar via subcutânea conforme esquema definido (dose inicial usual 0,5 UI/kg/dia: 2/3 antes do café e 1/3 às 22 h). Ajustar a cada 2–3 dias pelo perfil glicêmico.',
    obs: 'Insulina é 1ª escolha no DMG (SBD 2026). Iniciar junto com o PNAR; orientar hipoglicemia, rodízio de locais e glicemia capilar.' },
};

// =====================================================================================
// 2) TAGS NOVAS EM MEDS EXISTENTES  (aplicar em data/medicamentos.js)
// =====================================================================================
const TAGS_EM_MEDS_EXISTENTES = {
  aas100: { remover: ['aas'], adicionar: ['aasBaixa'] },         // evita o alerta "dose analgésica" na gestante; mantém alergia/HDA/anticoagulado via regras novas
  paracetamolCodeina: { adicionar: ['codeina'] },
  tramadol: { adicionar: ['tramadol'] },
  tramadolEV: { adicionar: ['tramadol'] },
  ivermectinaEstrong: { adicionar: ['ivermectina'] },
  ivermectinaEscabiose: { adicionar: ['ivermectina'] },
  fenitoinaEV: { adicionar: ['anticonvulsivante'] },
  // quando forem cadastrados (estão na UBS Pedreira): varfarina → ['varfarina','anticoagulante']; valproato/divalproato → ['valproato','anticonvulsivante'];
  // carbamazepina/oxcarbazepina/fenobarbital/fenitoína VO → ['anticonvulsivante']; carbonato de lítio → ['litio']; rosuvastatina/pitavastatina → ['estatina'];
  // amiodarona → ['amiodarona']; espironolactona 25/50 → ['espironolactona']; acetofenida+estradiol → ['estrogenio','hormonal'];
  // gentamicina/amicacina (unidade) → ['aminoglicosideo']; vacinas tríplice viral/varicela/febre amarela → ['vacinaViva'];
  // isotretinoína/acitretina → ['retinoide']; metotrexato → ['metotrexato']; misoprostol (hospitalar) → ['misoprostol'].
};

// =====================================================================================
// 3) REGRAS — novas  [flag, tag, nível, mensagem]
// =====================================================================================
const NOVAS_REGRAS = [
  // ---- gestante: teratógenos / fetotóxicos ----
  ['gestante', 'varfarina', 'alto', 'Varfarina: embriopatia (6–12 sem) e hemorragia fetal — trocar por enoxaparina e encaminhar ao PNAR.'],
  ['gestante', 'misoprostol', 'alto', 'Misoprostol: abortivo/teratogênico (Möbius) — contraindicado na gestação desejada.'],
  ['gestante', 'retinoide', 'alto', 'Isotretinoína/acitretina: altamente teratogênicas — CONTRAINDICADAS.'],
  ['gestante', 'estatina', 'alto', 'Estatina: suspender na gestação (sem benefício e com risco fetal).'],
  ['gestante', 'metotrexato', 'alto', 'Metotrexato: abortivo e teratogênico — contraindicado.'],
  ['gestante', 'valproato', 'alto', 'Valproato: maior teratogenicidade entre os antiepilépticos (DTN, autismo) — não suspender abruptamente; encaminhar com urgência ao neurologista/PNAR; ácido fólico 5 mg.'],
  ['gestante', 'anticonvulsivante', 'medio', 'Antiepiléptico: não suspender por conta própria; ácido fólico 5 mg e PNAR. Convulsão ≥ 20 sem ou no puerpério = eclâmpsia até prova em contrário → sulfato de magnésio.'],
  ['gestante', 'litio', 'medio', 'Lítio: risco cardíaco fetal (Ebstein) e toxicidade neonatal — manter só com psiquiatra/PNAR, litemia frequente.'],
  ['gestante', 'aminoglicosideo', 'medio', 'Aminoglicosídeo: ototoxicidade fetal — só em ambiente hospitalar, sem alternativa.'],
  ['gestante', 'amiodarona', 'alto', 'Amiodarona: hipotireoidismo/bócio fetal — evitar; avaliar com cardiologista.'],
  ['gestante', 'vacinaViva', 'alto', 'Vacina de vírus vivo (tríplice viral, varicela, febre amarela*) contraindicada na gestação (*FA só se risco epidemiológico alto).'],
  ['gestante', 'espironolactona', 'alto', 'Espironolactona: antiandrogênico (feminização de feto masculino) — suspender.'],
  ['gestante', 'estrogenio', 'alto', 'Contraceptivo hormonal: sem indicação na gestação — confirmar β-hCG negativo antes de iniciar.'],
  ['gestante', 'sulfonilureia', 'alto', 'Sulfonilureia: não usar na gestação — trocar por insulina (SBD 2026).'],
  ['gestante', 'metformina', 'baixo', 'Metformina na gestação: insulina é a 1ª escolha; metformina como alternativa/associação, decidir com o PNAR (SBD 2026).'],
  ['gestante', 'tiazidico', 'baixo', 'Diurético tiazídico: não iniciar na gestação (reduz volume plasmático); manter só HAS crônica já controlada, com PNAR.'],
  ['gestante', 'benzodiazepinico', 'medio', 'Benzodiazepínico: uso pontual; próximo ao parto causa hipotonia e abstinência neonatal.'],
  ['gestante', 'oleo-mineral', 'medio', 'Óleo mineral: não usar na gestação (reduz absorção de vitamina K e lipossolúveis) — preferir psyllium/lactulose.'],
  ['gestante', 'ivermectina', 'alto', 'Ivermectina: evitar na gestação (dados insuficientes). Escabiose: permetrina 5%/deltametrina tópica; estrongiloidíase: albendazol 2º/3º tri ou tratar após o parto.'],
  ['gestante', 'aasBaixa', 'baixo', 'AAS 100 mg: indicado de 12 (ideal < 16) a 36 semanas se risco de pré-eclâmpsia; suspender se PE confirmada.'],
  ['gestante', 'irsn', 'baixo', 'Venlafaxina na gestação: manter só se indicado (psiquiatria); sertralina é o antidepressivo preferido.'],

  // ---- AAS baixa dose (tag nova — replica as regras de 'aas') ----
  ['alergiaAine', 'aasBaixa', 'alto', 'ALERGIA A AINE/AAS.'],
  ['hda', 'aasBaixa', 'alto', 'AAS com úlcera/HDA prévia: avaliar risco × benefício + IBP.'],
  ['anticoagulado', 'aasBaixa', 'alto', 'AAS + anticoagulante: alto risco de sangramento.'],

  // ---- lactante ----
  ['lactante', 'codeina', 'alto', 'Codeína na amamentação: CONTRAINDICADA (metabolizadoras ultrarrápidas — óbito de lactente). Usar paracetamol/ibuprofeno/dipirona.'],
  ['lactante', 'tramadol', 'medio', 'Tramadol na amamentação: evitar (sedação/depressão respiratória do lactente) — se inevitável, dose única e observar o bebê.'],
  ['lactante', 'estrogenio', 'alto', 'Estrogênio na lactação: OMS 4 até 6 sem e 3 até 6 meses (reduz o leite) — preferir minipílula, trimestral (≥ 6 sem), implante ou DIU.'],
  ['lactante', 'benzodiazepinico', 'medio', 'Benzodiazepínico na amamentação: sedação do lactente — dose única/curta, preferir meia-vida curta; observar sonolência.'],
  ['lactante', 'sedativo', 'baixo', 'Sedativo/anti-histamínico de 1ª geração: pode sedar o lactente e reduzir o leite — uso pontual; preferir loratadina.'],
  ['lactante', 'litio', 'medio', 'Lítio na amamentação: passa ao leite em níveis relevantes — só com psiquiatra e monitorização do lactente.'],
  ['lactante', 'amiodarona', 'alto', 'Amiodarona: contraindicada na amamentação (iodo/hipotireoidismo do lactente).'],
  ['lactante', 'metotrexato', 'alto', 'Metotrexato: contraindicado na amamentação.'],
  ['lactante', 'retinoide', 'alto', 'Isotretinoína/acitretina: contraindicadas na amamentação.'],
  ['lactante', 'estatina', 'medio', 'Estatina: evitar na amamentação (sem dados de segurança); retomar após o desmame.'],
  ['lactante', 'aas', 'medio', 'AAS em dose analgésica: evitar na amamentação (síndrome de Reye/sangramento) — 100 mg/dia é compatível.'],
  ['lactante', 'sulfa', 'baixo', 'SMX-TMP: evitar se lactente < 1 mês, prematuro, ictérico ou com deficiência de G6PD.'],
  ['lactante', 'quinolona', 'baixo', 'Quinolona: compatível por curto período; preferir alternativa se disponível.'],
  ['lactante', 'dipirona', 'baixo', 'Dipirona: uso pontual na amamentação; paracetamol e ibuprofeno são as primeiras escolhas.'],
  ['lactante', 'bupropiona', 'baixo', 'Bupropiona: relatos de convulsão em lactente — preferir terapia de reposição de nicotina.'],
  ['lactante', 'progestagenio', 'baixo', 'Progestagênio isolado: compatível; trimestral pela prática brasileira a partir de 6 semanas pós-parto.'],

  // ---- contracepção hormonal x comorbidades (critérios OMS) ----
  ['has', 'estrogenio', 'alto', 'Estrogênio combinado com HAS: OMS 3 (controlada) / 4 (PA ≥ 160/100 ou doença vascular) — preferir progestagênio isolado ou DIU de cobre.'],
  ['anticoagulado', 'estrogenio', 'alto', 'Estrogênio com TEV/anticoagulação: OMS 4 — usar DIU, progestagênio isolado ou medroxiprogesterona.'],
  ['hepatopata', 'estrogenio', 'alto', 'Estrogênio na hepatopatia grave/tumor hepático: OMS 4.'],
  ['dm', 'estrogenio', 'baixo', 'Estrogênio no DM: OMS 3/4 se lesão vascular, nefro/retino/neuropatia ou > 20 anos de doença.'],
  ['idoso', 'estrogenio', 'medio', 'Contraceptivo combinado após os 35–40 anos: checar tabagismo (≥ 35 a fumante = OMS 4), PA e risco CV.'],
  ['anticoagulado', 'estrogenioTH', 'alto', 'Terapia hormonal com TEV prévio/anticoagulação: contraindicada (via oral).'],
  ['hepatopata', 'estrogenioTH', 'alto', 'Terapia hormonal oral na hepatopatia: contraindicada.'],
  ['drc', 'espironolactona', 'medio', 'Espironolactona na DRC: risco de hipercalemia — dosar potássio.'],
  ['has', 'irsn', 'baixo', 'Venlafaxina pode elevar a PA — monitorar.'],
];

// Mensagens/níveis das regras EXISTENTES a substituir (detalhes e fontes em proposta-gest.md)
const REGRAS_CORRIGIDAS = [
  { atual: ['gestante', 'aine', 'alto', 'AINE na gestação: evitar (contraindicado ≥ 20 semanas).'],
    novo: ['gestante', 'aine', 'alto', 'AINE na gestação: evitar em todos os trimestres (aborto/malformação no 1º; oligoâmnio ≥ 20 sem; fechamento do ducto arterioso ≥ 30 sem). Usar paracetamol.'] },
  { atual: ['gestante', 'sulfa', 'medio', 'SMX-TMP: evitar no 1º trimestre e no termo.'],
    novo: ['gestante', 'sulfa', 'alto', 'SMX-TMP: evitar na gestação (1º tri: antifolato/DTN; 3º tri: kernicterus). Usar só no 2º tri se sem alternativa, guiado por cultura.'] },
  { atual: ['gestante', 'nitrofurantoina', 'medio', 'Nitrofurantoína: evitar no termo (≥ 38 semanas).'],
    novo: ['gestante', 'nitrofurantoina', 'medio', 'Nitrofurantoína: evitar a partir de 36 semanas (hemólise neonatal/G6PD) — usar cefalexina.'] },
  { atual: ['gestante', 'metronidazol', 'baixo', 'Metronidazol: preferir após o 1º trimestre; evitar dose única de 2 g.'],
    novo: ['gestante', 'metronidazol', 'baixo', 'Metronidazol: pode ser usado em qualquer trimestre (PCDT-IST 2022); preferir esquema de 7 dias à dose única de 2 g.'] },
  { atual: ['gestante', 'fluconazol', 'alto', 'Fluconazol oral: evitar na gestação — usar tratamento tópico.'],
    novo: ['gestante', 'fluconazol', 'alto', 'Fluconazol oral: contraindicado na gestação — miconazol creme 7 noites ou nistatina 14 noites.'] },
  { atual: ['gestante', 'antiparasitario', 'medio', 'Albendazol/ivermectina: evitar na gestação.'],
    novo: ['gestante', 'antiparasitario', 'medio', 'Albendazol/mebendazol: contraindicados no 1º trimestre; permitidos no 2º/3º (dose única). Ivermectina: evitar.'] },
  { atual: ['gestante', 'ondansetrona', 'baixo', 'Ondansetrona: cautela no 1º trimestre.'],
    novo: ['gestante', 'ondansetrona', 'medio', 'Ondansetrona: 3ª linha; evitar no 1º trimestre (fenda oral/cardiopatia em alguns estudos). Antes: dimenidrinato+B6 → prometazina → metoclopramida.'] },
  { atual: ['lactante', 'tetraciclina', 'baixo', 'Doxiciclina: aceitável por curto período na lactação.'],
    novo: ['lactante', 'tetraciclina', 'medio', 'Doxiciclina na lactação: só curso curto (≤ 3 semanas); em cervicite/clamídia preferir azitromicina 1 g (PCDT-IST).'] },
  { atual: ['lactante', 'opioide', 'medio', 'Codeína/tramadol: risco de sedação no lactente — evitar.'],
    novo: ['lactante', 'opioide', 'baixo', 'Opioide na amamentação: dose única/curta é compatível (morfina preferível); observar sonolência e dificuldade de sucção no lactente.'] },
  { atual: ['gestante', 'bupropiona', 'medio', 'Bupropiona: não é 1ª linha na gestação.'],
    novo: ['gestante', 'bupropiona', 'medio', 'Bupropiona: não é 1ª linha na gestação — priorizar abordagem comportamental; TRN só se benefício superar risco.'] },
];

// =====================================================================================
// 4) PROIBE — por patologia (novas condições + acréscimos a existentes)
// =====================================================================================
const NOVAS_PROIBE = {
  preNatal: [['aine', 'Gestação: AINE contraindicado.'], ['ieca', 'Gestação: IECA contraindicado.'], ['bra', 'Gestação: BRA contraindicado.'], ['tetraciclina', 'Gestação: tetraciclina contraindicada.'], ['retinoide', 'Gestação: retinoide contraindicado.'], ['estatina', 'Gestação: suspender estatina.'], ['varfarina', 'Gestação: trocar varfarina por enoxaparina.'], ['valproato', 'Gestação: valproato — encaminhar com urgência.']],
  anemiaGest: [['aine', 'Gestação: evitar AINE.']],
  piroseGest: [['aine', 'Gestação: AINE contraindicado (e piora a dispepsia).']],
  constipacaoGest: [['oleo-mineral', 'Gestação: óleo mineral não recomendado (vitamina K/lipossolúveis).']],
  hemorroidaGest: [['oleo-mineral', 'Gestação: óleo mineral não recomendado.'], ['aine', 'Gestação: evitar AINE.']],
  lombalgiaGest: [['aine', 'Gestação: AINE contraindicado — usar paracetamol.'], ['opioide', 'Lombalgia gestacional: opioide não indicado na dor mecânica.']],
  cefaleiaGest: [['aine', 'Gestação: AINE contraindicado.']],
  hasGest: [['ieca', 'Gestação: IECA contraindicado — usar metildopa/nifedipino/anlodipino.'], ['bra', 'Gestação: BRA contraindicado.'], ['aine', 'Pré-eclâmpsia: AINE eleva PA e lesa rim.'], ['tiazidico', 'Gestação: não iniciar diurético.']],
  dmg: [['sulfonilureia', 'DMG: sulfonilureia não indicada — insulina.']],
  candidiaseGest: [['fluconazol', 'Gestação: antifúngico oral contraindicado — só tópico.']],
  vaginoseGest: [['tetraciclina', 'Gestação: doxiciclina contraindicada.'], ['fluconazol', 'Gestação: antifúngico oral contraindicado.']],
  sifilisGest: [['tetraciclina', 'Gestação: doxiciclina contraindicada — penicilina benzatina é o ÚNICO tratamento eficaz para o feto.'], ['macrolideo', 'Gestação: azitromicina/eritromicina não tratam o feto — alergia à penicilina = dessensibilização.']],
  sangramentoGest: [['aine', 'Gestação: AINE contraindicado.'], ['misoprostol', 'Ameaça de aborto: misoprostol contraindicado.']],
  mastite: [['codeina', 'Amamentação: codeína contraindicada.'], ['estrogenio', 'Lactação: evitar estrogênio.']],
  fissuraIngurg: [['codeina', 'Amamentação: codeína contraindicada.'], ['estrogenio', 'Lactação: evitar estrogênio.']],
  // acréscimos a condições existentes
  ituGestante: [['oleo-mineral', 'Gestação: óleo mineral não recomendado.']],
  nauseaGest: [['oleo-mineral', 'Gestação: óleo mineral não recomendado.']],
  dengue: [['aasBaixa', 'Dengue: avaliar suspensão do AAS (risco de sangramento) — manter só se alto risco CV, sob vigilância de plaquetas.']],
};

// =====================================================================================
// 5) NOVOS SINTOMAS  (id: [rótulo, ...sinônimos sem acento, minúsculos — busca por trecho])
// =====================================================================================
const NOVOS_SINTOMAS = {
  preNatalRotina: ['Consulta de pré-natal', 'consulta de pre-natal', 'consulta de prenatal', 'primeira consulta de pre', 'iniciar pre-natal', 'iniciar prenatal', 'beta hcg positivo', 'teste de gravidez positivo', 'idade gestacional'],
  sangramentoVaginal: ['Sangramento vaginal', 'sangramento vaginal', 'sangrando pela vagina', 'sangramento na gravidez', 'sangrando na gravidez', 'perda de sangue pela vagina', 'sangue pela vagina', 'escape de sangue', 'sangramento transvaginal'],
  perdaLiquido: ['Perda de líquido vaginal', 'perda de liquido', 'bolsa rompeu', 'bolsa estourou', 'agua escorrendo', 'liquido escorrendo'],
  contracoes: ['Contrações uterinas', 'contracoes', 'contracao', 'barriga dura', 'barriga endurecendo', 'barriga endurece', 'trabalho de parto'],
  movFetalReduzido: ['Redução dos movimentos fetais', 'bebe parou de mexer', 'bebe nao mexe', 'bebe mexendo pouco', 'nao sente o bebe', 'diminuicao dos movimentos fetais', 'movimentos fetais diminuidos'],
  sintomasPE: ['Sinais de pré-eclâmpsia', 'pre-eclampsia', 'pre eclampsia', 'eclampsia', 'dheg', 'visao turva', 'vista turva', 'vista embacada', 'vista escura', 'dor em barra', 'inchaco subito', 'proteinuria'],
  dmgExame: ['Glicemia alterada na gestação', 'diabetes gestacional', 'dmg', 'curva glicemica alterada', 'totg alterado', 'glicemia alterada na gravidez', 'glicemia alta na gravidez'],
  sifilisExame: ['Sífilis/VDRL reagente', 'vdrl reagente', 'vdrl positivo', 'sifilis', 'treponemico reagente', 'teste rapido reagente para sifilis'],
  bacteriuria: ['Urocultura positiva', 'urocultura positiva', 'bacteriuria', 'urocultura com crescimento', 'urocultura alterada'],
  amamentacao: ['Amamentando/puérpera', 'amamentando', 'amamenta', 'aleitamento', 'lactante', 'puerpera', 'puerperio', 'pos-parto', 'pos parto', 'resguardo', 'ganhou bebe', 'teve bebe'],
  mamaInflamada: ['Mama vermelha/inflamada', 'mama vermelha', 'peito vermelho', 'mama inflamada', 'peito inflamado', 'mama quente', 'peito quente', 'mastite', 'mama empedrada e vermelha'],
  ingurgitamento: ['Mamas ingurgitadas', 'peito empedrado', 'mama empedrada', 'leite empedrado', 'peito empedrou', 'mamas cheias', 'peito cheio', 'ingurgit', 'leite empedr', 'mama dura'],
  fissuraMamilo: ['Fissura mamilar', 'bico rachado', 'bico do peito rachado', 'rachadura no bico', 'rachadura no mamilo', 'mamilo rachado', 'fissura mamilar', 'fissura no mamilo', 'bico ferido', 'mamilo ferido', 'bico machucado', 'mamilo machucado', 'bico sangrando'],
  dorAmamentar: ['Dor ao amamentar', 'dor para amamentar', 'dor ao amamentar', 'doi para amamentar', 'doi ao amamentar', 'dor na mamada', 'dor quando o bebe mama'],
  contracepcao: ['Deseja método contraceptivo', 'anticoncepcional', 'anticoncepcao', 'contraceptivo', 'planejamento familiar', 'planejamento reprodutivo', 'nao quer engravidar', 'evitar gravidez', 'injecao para nao engravidar', 'injecao trimestral', 'injecao mensal', 'trocar de pilula', 'trocar a pilula'],
  contracepcaoEmergencia: ['Contracepção de emergência', 'pilula do dia seguinte', 'contracepcao de emergencia', 'anticoncepcao de emergencia', 'camisinha estourou', 'camisinha rompeu', 'camisinha furou', 'camisinha saiu', 'preservativo rompeu', 'preservativo estourou', 'preservativo furou', 'esqueceu a pilula', 'esqueceu de tomar a pilula'],
  violenciaSexual: ['Violência sexual', 'violencia sexual', 'estupro', 'abuso sexual', 'foi abusada', 'relacao forcada', 'relacao sem consentimento'],
  colicaMenstrual: ['Cólica menstrual', 'colica menstrual', 'dismenorreia', 'dor na menstruacao', 'dor quando menstrua', 'colica quando menstrua', 'colica na menstruacao', 'dor menstrual', 'colica de menstruacao'],
  sangramentoUterino: ['Sangramento uterino aumentado/irregular', 'menstruacao abundante', 'menstruacao muito forte', 'fluxo intenso', 'fluxo aumentado', 'menorragia', 'hipermenorreia', 'sangramento fora da menstruacao', 'menstruando muito', 'menstruacao prolongada', 'coagulos na menstruacao', 'menstrua duas vezes', 'sangramento pos-menopausa', 'sangramento apos a menopausa'],
  cicloIrregular: ['Ciclos irregulares', 'menstruacao irregular', 'ciclo irregular', 'ciclos irregulares', 'fica meses sem menstruar', 'amenorreia', 'oligomenorreia', 'menstruacao desregulada', 'menstruacao atrasa'],
  hirsutismo: ['Hirsutismo', 'hirsut', 'pelos no rosto', 'pelo no rosto', 'pelos no queixo', 'excesso de pelos', 'pelos na barriga', 'pelos grossos'],
  acne: ['Acne', 'acne', 'espinhas', 'cravos e espinhas'],
  fogacho: ['Fogachos/sintomas vasomotores', 'fogacho', 'calorao', 'caloroes', 'ondas de calor', 'onda de calor', 'suor noturno', 'sudorese noturna', 'menopausa', 'climaterio', 'parou de menstruar'],
  securaVaginal: ['Secura vaginal/dispareunia', 'secura vaginal', 'ressecamento vaginal', 'vagina seca', 'dor na relacao', 'dor durante a relacao', 'dispareunia', 'dor no ato sexual'],
  dorAnexial: ['Dor à mobilização do colo/anexos', 'mobilizacao do colo', 'mobilizacao do utero', 'dor anexial', 'dor em anexo', 'anexos dolorosos', 'dor a mobilizacao'],
};
// Acréscimos a sintomas existentes (somente sinônimos seguros):
const SINONIMOS_EXTRA = {
  gestacao: ['semanas de gravidez', 'gestante de', 'gravida de'],   // NÃO incluir "gravidez" sozinho ("teste de gravidez negativo", "evitar gravidez")
  dorAnal: ['hemorroida na gravidez'],
  edemaMMII: ['pes inchados'],
};

// =====================================================================================
// 6) NOVAS CONDIÇÕES  (schema de data/condicoes.js)
// Obs. do app: grupo 'Gestação' marca 'gestante' automaticamente (app.js linha ~205). Por isso as condições de
// amamentação usam grupo próprio 'Puerpério / Amamentação' (sugestão: marcar 'lactante' automaticamente nesse grupo).
// =====================================================================================
const NOVAS_CONDICOES = [
  // ===================== GESTAÇÃO =====================
  {
    id: 'preNatal', nome: 'Pré-natal de baixo risco — rotina e suplementação', grupo: 'Gestação',
    cid: ['Z34.9', 'Supervisão de gravidez normal, não especificada'],
    dif: [['Z34.0', 'Supervisão de primeira gravidez normal'], ['Z35.9', 'Supervisão de gravidez de alto risco, não especificada'], ['Z32.1', 'Gravidez confirmada']],
    s: { gestacao: 3, preNatalRotina: 3 },
    alarme: ['Sangramento vaginal, perda de líquido, contrações regulares < 37 sem ou redução dos movimentos fetais → urgência obstétrica', 'PA ≥ 140/90 após 20 sem, cefaleia intensa, escotomas, epigastralgia → pré-eclâmpsia', 'Fator de alto risco (HAS/DM prévios, PE prévia, gemelar, epilepsia, cardiopatia, anemia grave, bariátrica...) → PNAR mantendo o vínculo na APS'],
    exUbs: ['1º tri: hemograma, ABO/Rh (Coombs indireto se Rh negativo), glicemia de jejum, EAS + urocultura', 'Testes rápidos/sorologias: HIV, sífilis (+ VDRL), HBsAg, hepatite C, toxoplasmose IgG/IgM', 'USG obstétrica (ideal 11–14 sem); citopatológico se em atraso', '24–28 sem: TOTG 75 g (se jejum < 92); 3º tri: hemograma, HIV, sífilis, hepatite B, urocultura', 'Urocultura por trimestre (rastrear bacteriúria assintomática)'],
    exPs: [],
    unid: [],
    casa: ['acidoFolico5', 'sulfatoFerrosoGest', '?carbonatoCalcioGest', '?{"m":"aasPE","alt":"Se 1 fator de alto risco ou ≥ 2 moderados para pré-eclâmpsia (iniciar 12–16 sem, manter até 36 sem)"}'],
    orient: ['Ferro 1 h antes do almoço com suco cítrico; cálcio após café e jantar — nunca junto com o ferro (intervalo ≥ 2 h)', 'Vacinas: dTpa a partir de 20 sem (toda gestação), influenza, hepatite B e dT conforme situação, COVID-19 e VSR a partir de 28 sem conforme calendário vigente', 'Procurar a maternidade se sangramento, perda de líquido, contrações regulares, febre, dor de cabeça forte, visão turva ou bebê mexendo menos'],
    obs: 'Ácido fólico até 12 sem (ideal desde 30 dias antes da concepção): 0,4 mg é a dose padrão MS/OMS; UBS Pedreira só tem 5 mg (aceitável — dose do CAB 32 e de alto risco). Ferro 40 mg/dia até 3 meses pós-parto. AAS — alto risco: PE prévia, gemelar, HAS crônica, DM 1/2, DRC, autoimune (LES/SAF), IMC > 30, FIV; moderado: nuliparidade, ≥ 35 anos, história familiar de PE, intervalo > 10 anos, negra/parda, baixa renda.',
  },
  {
    id: 'anemiaGest', nome: 'Anemia na gestação', grupo: 'Gestação',
    cid: ['O99.0', 'Anemia complicando a gravidez, o parto e o puerpério'],
    dif: [['D50.9', 'Anemia por deficiência de ferro não especificada'], ['D56.9', 'Talassemia não especificada'], ['D52.9', 'Anemia por deficiência de folato não especificada']],
    s: { gestacao: 3, palidez: 3, fadiga: 2, tontura: 1, dispneia: 1 },
    alarme: ['Hb < 8 g/dL (grave), anemia sem resposta após 30–60 dias de ferro oral adequado ou pós-bariátrica com Hb < 10 → PNAR (avaliar ferro EV)', 'Hb < 7 g/dL, dispneia, taquicardia ou sangramento → urgência', 'Hb < 9 após 30–34 sem: pouco tempo para o ferro oral agir → referenciar'],
    exUbs: ['Hemograma (anemia: Hb < 11 no 1º/3º tri; < 10,5 no 2º tri)', 'Ferritina (< 30 ng/mL confirma ferropenia) ± ferro, IST', 'Parasitológico de fezes', 'Microcítica com ferritina normal ou Mentzer < 13 → eletroforese de Hb; macrocítica → B12 e folato', 'Hemograma de controle em 30–60 dias'],
    exPs: ['Hemograma'],
    unid: [],
    casa: ['sulfatoFerrosoTrat', '?acidoFolico5', '?{"m":"albendazol","alt":"Somente no 2º/3º trimestre, se EPF positivo ou área endêmica"}'],
    orient: ['Tomar o ferro 1 h antes das refeições com suco de laranja/limão; não tomar com leite, café, chá, antiácido ou cálcio', 'Fezes escuras são esperadas; se enjoo/intestino preso, avisar (dá para ajustar a dose) — não abandonar', 'Alimentos ricos em ferro: carne, feijão, lentilha, folhas verde-escuras'],
    obs: 'Antes de chamar de refratária: conferir adesão, técnica (tomou com leite/café?) e diagnóstico (talassemia?). Após Hb ≥ 11: manter 40 mg/dia até 3 meses pós-parto.',
  },
  {
    id: 'piroseGest', nome: 'Pirose / refluxo na gestação', grupo: 'Gestação',
    cid: ['O99.6', 'Doenças do aparelho digestivo complicando a gravidez, o parto e o puerpério'],
    dif: [['K21.9', 'Doença de refluxo gastroesofágico sem esofagite'], ['O14.1', 'Pré-eclâmpsia grave (dor epigástrica / HELLP)'], ['K80.2', 'Calculose da vesícula biliar sem colecistite']],
    s: { gestacao: 3, pirose: 3, epigastralgia: 2, plenitude: 1, nausea: 1 },
    alarme: ['Dor epigástrica/em barra ou em hipocôndrio direito após 20 sem + PA ≥ 140/90, cefaleia ou escotomas → pré-eclâmpsia/HELLP até prova em contrário', 'Hematêmese, melena, disfagia/odinofagia, vômitos persistentes, perda de peso'],
    exUbs: ['Diagnóstico clínico; AFERIR PA em toda queixa epigástrica após 20 semanas'],
    exPs: ['Se dor epigástrica ≥ 20 sem: PA, hemograma com plaquetas, TGO/TGP, LDH, creatinina, proteinúria'],
    unid: [],
    casa: ['aluminio', '?omeprazol'],
    orient: ['Refeições pequenas e frequentes; não deitar por 2–3 h após comer', 'Elevar a cabeceira da cama 15–20 cm (calços) e dormir de lado esquerdo', 'Evitar gordura, fritura, café, chocolate, refrigerante, condimentos; antiácido com 2 h de intervalo do ferro'],
    obs: 'Escada: medidas → antiácido/alginato → famotidina (compra) → IBP (omeprazol UBS Pedreira, seguro na gestação).',
  },
  {
    id: 'constipacaoGest', nome: 'Constipação na gestação', grupo: 'Gestação',
    cid: ['O99.6', 'Doenças do aparelho digestivo complicando a gravidez, o parto e o puerpério'],
    dif: [['K59.0', 'Constipação'], ['K58.9', 'Síndrome do cólon irritável sem diarreia'], ['K56.7', 'Íleo não especificado']],
    s: { gestacao: 3, constipacao: 3, dorAbdominal: 1, plenitude: 1 },
    alarme: ['Parada de eliminação de gases, vômitos, distensão (obstrução)', 'Dor abdominal intensa, contrações rítmicas, sangramento vaginal ou perda de líquido → urgência obstétrica'],
    exUbs: ['Diagnóstico clínico; revisar uso de sulfato ferroso'], exPs: [],
    unid: [],
    casa: ['psyllium', '?lactulose', '?bisacodil', '?supositorioGlicerina'],
    orient: ['Água 2,5–3 L/dia (o psyllium sem água piora)', 'Fibras: mamão, ameixa, aveia, farelo, frutas com casca; caminhada se liberada', 'Se o ferro estiver piorando: tomar junto à refeição ou em dias alternados — não suspender'],
    obs: 'Escada: formador de bolo → osmótico (lactulose/macrogol) → estimulante pontual (bisacodil, glicerina; máx. 3 dias). Não usar óleo mineral nem óleo de rícino na gestação.',
  },
  {
    id: 'hemorroidaGest', nome: 'Doença hemorroidária na gestação', grupo: 'Gestação',
    cid: ['O22.4', 'Hemorroidas na gravidez'],
    dif: [['K60.2', 'Fissura anal não especificada'], ['I84.3', 'Hemorroidas externas trombosadas'], ['K62.5', 'Hemorragia do ânus e do reto']],
    s: { gestacao: 3, dorAnal: 3, constipacao: 2 },
    alarme: ['Nódulo arroxeado muito doloroso (trombose) → avaliação cirúrgica', 'Sangramento volumoso, anemia ou sangue misturado às fezes'],
    exUbs: ['Diagnóstico clínico; hemograma se sangramento frequente'], exPs: [],
    unid: [],
    casa: ['psyllium', 'diosmina', '?pomadaHemorroida', 'paracetamol'],
    orient: ['Banho de assento morno 15 min, 3 vezes ao dia', 'Fibras e água; não fazer força nem ficar muito tempo no vaso', 'Pomada com corticoide: pelo menor tempo possível (até 7 dias)'],
  },
  {
    id: 'lombalgiaGest', nome: 'Lombalgia na gestação', grupo: 'Gestação',
    cid: ['O26.8', 'Outras afecções especificadas ligadas à gravidez'],
    dif: [['M54.5', 'Dor lombar baixa'], ['O23.0', 'Infecções do rim na gravidez'], ['O60', 'Parto pré-termo (trabalho de parto prematuro)']],
    s: { gestacao: 3, dorLombar: 3, ciatica: 1, contracoes: 1, perdaLiquido: 1 },
    alarme: ['Dor rítmica em cólica, barriga endurecendo, perda de líquido ou sangramento → trabalho de parto prematuro (maternidade)', 'Febre, calafrio, disúria, Giordano + → pielonefrite (internação)', 'Anestesia em sela, incontinência, déficit motor → cauda equina (urgência)'],
    exUbs: ['Diagnóstico clínico; EAS + urocultura se sintomas urinários'], exPs: ['EAS + urocultura; avaliação obstétrica (BCF, dinâmica uterina, toque se indicado)'],
    unid: [],
    casa: ['paracetamol', '?{"m":"ciclobenzaprina","q":"10 comprimidos","p":"Tomar 2 comprimidos (10 mg), por via oral, à noite, ao deitar, por no máximo 3 a 5 dias. Causa sonolência.","alt":"Exceção: só espasmo muscular agudo e incapacitante"}', '?{"m":"dipirona","alt":"Evitar no 1º e no 3º trimestre"}'],
    orient: ['Calor local na lombar 15–20 min, 3–4x/dia (nunca sobre a barriga)', 'Dormir de lado com travesseiro entre os joelhos; levantar rolando de lado', 'Caminhada, alongamento, hidroginástica; calçado firme com salto baixo (2–3 cm)'],
    obs: 'AINE contraindicado. Paracetamol é a 1ª escolha em qualquer trimestre.',
  },
  {
    id: 'cefaleiaGest', nome: 'Cefaleia na gestação', grupo: 'Gestação',
    cid: ['R51', 'Cefaleia'],
    dif: [['O14.1', 'Pré-eclâmpsia grave'], ['G43.9', 'Enxaqueca sem especificação'], ['G44.2', 'Cefaleia tensional']],
    s: { gestacao: 3, cefaleia: 3, cefaleiaAperto: 1, cefaleiaPulsatil: 1, fotofobia: 1, sintomasPE: 2 },
    alarme: ['Após 20 sem ou no puerpério: cefaleia + PA ≥ 140/90 → pré-eclâmpsia (≥ 160/110 = emergência)', 'Súbita/pior da vida, déficit focal, convulsão, febre com rigidez de nuca', 'Cefaleia nova no pós-parto: pensar PE pós-parto e trombose venosa cerebral'],
    exUbs: ['AFERIR PA (obrigatório)', 'Se PA elevada ≥ 20 sem: fita urinária/proteinúria e rotina de PE'],
    exPs: ['Se PA elevada: hemograma com plaquetas, TGO/TGP, LDH, creatinina, ácido úrico, relação proteína/creatinina'],
    unid: ['?metoclopramidaEV', '?{"m":"dipironaIM","alt":"Evitar no 1º e no 3º trimestre"}'],
    casa: ['paracetamol', '?metoclopramida', '?{"m":"dipirona","alt":"Evitar no 1º e no 3º trimestre"}'],
    orient: ['Repouso em ambiente escuro, hidratação, regularidade de sono e refeições', 'Medir a pressão; voltar já se dor forte, visão turva/pontos brilhantes, dor no estômago ou inchaço súbito'],
    obs: 'Refratária: dexametasona 4 mg EV ou cetoprofeno só antes de 20 sem e pontual (fonte 18). Triptano (rizatriptano/sumatriptano) aceitável pontualmente se enxaqueca típica. AINE contraindicado.',
  },
  {
    id: 'hasGest', nome: 'Hipertensão na gestação / Pré-eclâmpsia (APS)', grupo: 'Gestação',
    cid: ['O13', 'Hipertensão gestacional sem proteinúria significativa'],
    dif: [['O14.1', 'Pré-eclâmpsia grave'], ['O10.0', 'Hipertensão essencial pré-existente complicando a gravidez'], ['O11', 'Distúrbio hipertensivo pré-existente com proteinúria superposta']],
    s: { gestacao: 3, paAlta: 3, sintomasPE: 3, cefaleia: 1, edemaMMII: 1, epigastralgia: 1 },
    alarme: ['PA ≥ 160/110 (confirmada em 15 min) → nifedipino VO + sulfato de magnésio se PE grave + SAMU/vaga zero', 'PA ≥ 140/90 surgida após 20 sem, ou sintomática (cefaleia, escotomas, epigastralgia, vômitos) → emergência obstétrica no mesmo dia', 'Convulsão = eclâmpsia → MgSO₄; HELLP (dor HD, plaquetas < 100 mil, TGO/TGP > 2×)', 'Redução de movimentos fetais, sangramento'],
    exUbs: ['PA em 2 medidas com intervalo ≥ 4 h (sentada, manguito adequado)', 'Rotina de PE: hemograma com plaquetas, TGO/TGP, LDH, creatinina, ácido úrico, EAS e relação proteína/creatinina urinária'],
    exPs: ['Rotina de PE (hemograma, plaquetas, TGO/TGP, LDH, creatinina, ácido úrico, proteína/creatinina urinária)', 'BCF/cardiotocografia e avaliação obstétrica'],
    unid: ['?nifedipinoCrise', '?sulfatoMgPE', '?gluconatoCalcioMg'],
    casa: ['metildopa', '?nifedipinoRetard', '?anlodipino'],
    orient: ['Toda hipertensão na gestação vai para o PNAR, mantendo acompanhamento na UBS', 'Medir a PA em casa/na UBS 2x/semana; ir à maternidade se PA ≥ 160/110 ou sintomas', 'Não usar IECA (captopril, enalapril), BRA (losartana) nem atenolol na gestação'],
    obs: 'Tratar a partir de 140/90 (CHAP 2022), alvo ~135/85, sem baixar de 120/80. Metildopa 750–2.000 mg/dia (1ª), anlodipino 5–10 mg ou nifedipino retard 20–60 mg/dia. Suspender AAS se PE confirmada. Crise: nifedipino VO (nunca sublingual).',
  },
  {
    id: 'dmg', nome: 'Diabetes mellitus gestacional (DMG)', grupo: 'Gestação',
    cid: ['O24.4', 'Diabetes mellitus que surge durante a gravidez'],
    dif: [['O24.3', 'Diabetes mellitus pré-existente, não especificado'], ['O24.0', 'Diabetes mellitus pré-existente, insulino-dependente'], ['R73.0', 'Teste de tolerância à glicose anormal']],
    s: { gestacao: 3, dmgExame: 3, polidipsia: 1, poliuria: 1, diabetico: 1 },
    alarme: ['Jejum ≥ 126, TOTG 2 h ≥ 200 ou HbA1c ≥ 6,5% → diabetes franco na gestação → PNAR', 'Glicemia > 200 com sintomas, vômitos ou alteração de consciência → emergência', '≥ 2 glicemias acima da meta em 1–2 semanas de dieta → insulina (co-manejo com PNAR)'],
    exUbs: ['Diagnóstico: jejum 92–125 (1ª consulta) ou TOTG 75 g 24–28 sem com jejum ≥ 92, 1 h ≥ 180 ou 2 h 153–199', 'Perfil glicêmico capilar (jejum e 1 h após café, almoço e jantar)', 'EAS/urocultura; USG obstétrica (crescimento/líquido)', 'TOTG 75 g 6–8 semanas após o parto (reclassificação)'],
    exPs: ['Glicemia capilar, cetonúria/cetonemia, eletrólitos se descompensação'],
    unid: [],
    casa: ['?insulinaNPHGest', '?{"m":"metformina","alt":"2ª linha (SBD 2026): se recusa/impossibilidade de insulina — decidir com PNAR"}'],
    orient: ['Dieta fracionada (3 refeições + 2–3 lanches), sem açúcar e com controle de carboidratos; nutricionista', 'Atividade física 30 min/dia, se sem contraindicação obstétrica', 'Metas: jejum/pré-prandial 65–95; 1 h pós < 140; 2 h pós < 120 mg/dL'],
    obs: 'Insulina (NPH ± regular) é a 1ª escolha farmacológica (SBD 2026). Sulfonilureias não indicadas. Após o parto: suspender tratamento e reclassificar; risco alto de DM2 — rastrear a cada 1–3 anos.',
  },
  {
    id: 'candidiaseGest', nome: 'Candidíase vulvovaginal na gestação', grupo: 'Gestação',
    cid: ['O23.5', 'Infecções do trato genital na gravidez'],
    dif: [['B37.3', 'Candidíase da vulva e da vagina'], ['N76.0', 'Vaginite aguda (vaginose)'], ['A59.0', 'Tricomoníase urogenital']],
    s: { gestacao: 3, pruridoVaginal: 3, grumoso: 3, corrimento: 2, disuria: 1 },
    alarme: ['Recorrente (≥ 4/ano): investigar DMG/DM e HIV', 'Perda de líquido, sangramento ou contrações → avaliação obstétrica'],
    exUbs: ['Exame especular (pH ≤ 4,5)', 'Glicemia/TOTG conforme idade gestacional se recorrente'], exPs: [],
    unid: [],
    casa: ['miconazolCreme', '?{"m":"nistatinaCreme","alt":"Alternativa: nistatina 14 noites"}'],
    orient: ['Somente tratamento vaginal (antifúngico oral é contraindicado na gestação)', 'Introduzir o aplicador com delicadeza, sem forçar', 'Não precisa tratar parceria assintomática; roupas de algodão, evitar duchas'],
  },
  {
    id: 'vaginoseGest', nome: 'Vaginose bacteriana / Tricomoníase na gestação', grupo: 'Gestação',
    cid: ['O23.5', 'Infecções do trato genital na gravidez'],
    dif: [['N76.0', 'Vaginite aguda (vaginose bacteriana)'], ['A59.0', 'Tricomoníase urogenital'], ['O42.9', 'Ruptura prematura de membranas, não especificada']],
    s: { gestacao: 3, odorVaginal: 3, corrimento: 3, amareloEsverdeado: 2, pruridoVaginal: 1, perdaLiquido: 1 },
    alarme: ['Líquido claro abundante escorrendo (rotura de membranas) → maternidade', 'Febre, dor pélvica, contrações'],
    exUbs: ['Exame especular (pH > 4,5, teste das aminas, colo em framboesa)', 'Testes rápidos HIV, sífilis, hepatites B e C'], exPs: [],
    unid: [],
    casa: ['metronidazolVB', '?{"m":"metronidazolGel","alt":"Vaginose: alternativa tópica (não serve para tricomoníase)"}'],
    orient: ['Tratar a vaginose sintomática em qualquer trimestre', 'Tricomoníase é IST: tratar parceria(s) e abster-se de relações até a cura', 'Não ingerir bebida alcoólica durante e até 24 h após o metronidazol'],
    obs: 'PCDT-IST 2022: metronidazol 250 mg 2 cp 12/12 h por 7 dias (gestante pode em qualquer trimestre). Alternativa na vaginose: clindamicina 300 mg 12/12 h 7 dias (compra).',
  },
  {
    id: 'sifilisGest', nome: 'Sífilis na gestação', grupo: 'Gestação',
    cid: ['O98.1', 'Sífilis complicando a gravidez, o parto e o puerpério'],
    dif: [['A51.0', 'Sífilis genital primária'], ['A53.0', 'Sífilis latente, não especificada se recente ou tardia'], ['A50.9', 'Sífilis congênita não especificada']],
    s: { gestacao: 3, sifilisExame: 3, ulceraGenital: 2, exantema: 1, linfonodo: 1 },
    alarme: ['Tratar no mesmo dia com 1 teste reagente (não aguardar o confirmatório)', 'Alergia à penicilina → referência para dessensibilização (não há alternativa eficaz para o feto)', 'Sintomas neurológicos/oculares; aumento de 2 diluições no VDRL → retratar'],
    exUbs: ['Teste rápido treponêmico + VDRL quantitativo (titulação basal no dia do tratamento)', 'VDRL MENSAL até o parto', 'Testes rápidos HIV, hepatites B e C; testar parceria(s)'], exPs: [],
    unid: ['benzatinaSifilis'],
    casa: [],
    orient: ['Recente (< 1 ano): 2,4 milhões UI dose única; tardia ou tempo ignorado: 3 doses semanais (intervalo máximo de 9 dias, senão reiniciar)', 'Notificação compulsória; tratar parceria(s) — contato < 90 dias: tratar mesmo com teste não reagente', 'Febre, dor no corpo e manchas nas primeiras 24 h podem ser reação de Jarisch-Herxheimer (não é alergia; não interromper)'],
    obs: 'Tratamento adequado: penicilina benzatina, esquema conforme estágio, iniciado até 30 dias antes do parto. Registrar no cartão da gestante (data, dose, VDRL).',
  },
  {
    id: 'sangramentoGest', nome: 'Sangramento na gestação inicial / Ameaça de aborto', grupo: 'Gestação',
    cid: ['O20.0', 'Ameaça de aborto'],
    dif: [['O00.9', 'Gravidez ectópica, não especificada'], ['O03.9', 'Aborto espontâneo completo ou não especificado, sem complicações'], ['O01.9', 'Mola hidatiforme, não especificada']],
    s: { gestacao: 3, sangramentoVaginal: 3, colica: 2, dorAbdominal: 1, dorSuprapubica: 1 },
    alarme: ['Tontura, síncope, taquicardia, hipotensão ou dor forte unilateral → ectópica rota: SAMU', 'Sangramento intenso (> 1 absorvente/h), saída de tecido, febre/secreção fétida (aborto infectado)', '≥ 20 sem: sangramento = placenta prévia/DPP — NÃO fazer toque; urgência obstétrica'],
    exUbs: ['β-hCG quantitativo se gestação não confirmada', 'USG transvaginal com urgência', 'Tipagem ABO/Rh (Rh negativo → imunoglobulina anti-D até 72 h)', 'Hemograma'],
    exPs: ['Hemograma, ABO/Rh, β-hCG quantitativo', 'USG transvaginal', 'Exame especular (origem do sangramento, colo aberto ou fechado)'],
    unid: [],
    casa: ['paracetamol', '?hioscina'],
    orient: ['Repouso relativo e evitar relações até reavaliação (sem prova de que evitem o aborto)', 'Voltar imediatamente se o sangramento aumentar, dor forte, febre, desmaio ou saída de tecido'],
    obs: 'Ameaça = colo fechado, embrião vivo. Progesterona: sem benefício na ameaça isolada; considerar (PNAR) se aborto de repetição. Rh negativo não sensibilizada: imunoglobulina anti-D no serviço de referência.',
  },

  // ===================== PUERPÉRIO / AMAMENTAÇÃO =====================
  {
    id: 'mastite', nome: 'Mastite lactacional', grupo: 'Puerpério / Amamentação',
    cid: ['O91.2', 'Mastite não purulenta associada ao parto'],
    dif: [['O91.1', 'Abscesso da mama associado ao parto'], ['O92.2', 'Outras afecções da mama e as não especificadas associadas ao parto (ingurgitamento)'], ['N61', 'Transtornos inflamatórios da mama']],
    s: { amamentacao: 3, mamaInflamada: 3, febre: 2, calafrio: 1, ingurgitamento: 1, dorAmamentar: 1 },
    alarme: ['Massa flutuante ou falta de melhora em 48–72 h → abscesso: USG e drenagem (referenciar)', 'Sepse, hipotensão, mastite bilateral grave', 'Mastite fora da lactação ou que não cede → excluir carcinoma inflamatório'],
    exUbs: ['Diagnóstico clínico; USG de mama se suspeita de abscesso', 'Cultura do leite se recorrente, grave ou sem resposta'], exPs: ['Hemograma, PCR se sistêmica; USG se suspeita de abscesso'],
    unid: ['?dipironaIM'],
    casa: ['cefalexinaMastite', '?{"m":"amoxClavMastite","alt":"Alternativa à cefalexina"}', '?{"m":"clindamicinaMastite","alt":"Se alergia grave a betalactâmico"}', 'ibuprofeno', '?dipirona'],
    orient: ['MANTER a amamentação, começando pela mama não afetada; o leite não faz mal ao bebê', 'Esvaziar bem a mama (livre demanda + ordenha do resto); compressa fria após as mamadas', 'Repouso, hidratação; retorno em 48–72 h'],
    obs: 'ATB se sintomas intensos desde o início ou sem melhora em 12–24 h de esvaziamento. Ibuprofeno é o anti-inflamatório de escolha na lactação. Codeína contraindicada.',
  },
  {
    id: 'fissuraIngurg', nome: 'Fissura mamilar / Ingurgitamento mamário', grupo: 'Puerpério / Amamentação',
    cid: ['O92.1', 'Fissuras do mamilo associadas ao parto'],
    dif: [['O92.2', 'Outras afecções da mama associadas ao parto (ingurgitamento)'], ['O91.2', 'Mastite não purulenta associada ao parto'], ['B37.8', 'Candidíase de outras localizações (mamilar)']],
    s: { amamentacao: 3, fissuraMamilo: 3, ingurgitamento: 3, dorAmamentar: 2 },
    alarme: ['Febre ≥ 38,5 °C, área vermelha em cunha e mal-estar → mastite', 'Dor em agulhada/ardência após a mamada com mamilo brilhante → candidíase (tratar mãe e bebê)', 'Fissura que não melhora com a pega corrigida → avaliar língua presa (anquiloglossia)'],
    exUbs: ['Observar uma mamada completa (pega e posição)'], exPs: [],
    unid: [],
    casa: ['paracetamol', '?ibuprofeno', '?lanolina'],
    orient: ['Pega: barriga do bebê encostada na mãe, boca bem aberta abocanhando a aréola, lábio inferior virado para fora', 'Fissura: passar o próprio leite no mamilo após a mamada e deixar secar; começar pela mama menos dolorida; não usar sabonete, álcool, pomadas de rotina nem bico de silicone', 'Ingurgitamento: ordenhar um pouco a aréola antes para amolecer, mamadas em livre demanda, compressa FRIA 15–20 min após, sutiã firme'],
    obs: 'Se dor insuportável: ordenhar e oferecer no copinho por 24–48 h e voltar ao peito. Lanolina só em fissura profunda.',
  },

  // ===================== SAÚDE DA MULHER =====================
  {
    id: 'contracepcao', nome: 'Contracepção — início ou troca de método', grupo: 'Saúde da Mulher',
    cid: ['Z30.0', 'Aconselhamento geral sobre contracepção'],
    dif: [['Z30.4', 'Supervisão do uso de medicamentos contraceptivos'], ['Z30.1', 'Inserção de dispositivo anticoncepcional (intra-uterino)'], ['Z30.2', 'Esterilização']],
    s: { contracepcao: 3, amamentacao: 1 },
    alarme: ['Estrogênio contraindicado (OMS 4): enxaqueca com aura, TEV prévio/trombofilia, ≥ 35 anos fumando ≥ 15 cig/dia, PA ≥ 160/100 ou doença vascular, câncer de mama, hepatopatia grave, LES com antifosfolípide, < 6 sem pós-parto amamentando / < 21 dias sem amamentar', 'Usuária com dor em uma perna, falta de ar, dor no peito, cefaleia súbita forte ou alteração visual → suspender e avaliar (TEV/AVC)'],
    exUbs: ['PA e IMC (únicos obrigatórios para hormonal)', 'β-hCG se não houver certeza razoável de não gravidez', 'Oferecer testes rápidos de IST; citopatológico se em atraso (25–64 anos)'],
    exPs: [],
    unid: [],
    casa: ['aco', '?{"m":"minipilula","alt":"Lactante ou contraindicação a estrogênio"}', '?{"m":"medroxiInj","alt":"Lactante (≥ 6 sem) ou contraindicação a estrogênio"}', '?injMensal'],
    orient: ['Usar preservativo junto em todas as relações (nenhum hormônio protege de IST)', 'Esqueceu 1 comprimido: tomar assim que lembrar; 2 ou mais: tomar o último, seguir a cartela e usar camisinha por 7 dias. Vômito até 3 h: repetir', 'DIU de cobre (10 anos) disponível na UBS — pode ser inserido em qualquer dia com certeza de não gravidez'],
    obs: 'Início fora da menstruação (quick start): β-hCG/certeza razoável + preservativo por 7 dias. Interações que reduzem eficácia: carbamazepina, fenitoína, fenobarbital, topiramato, rifampicina, alguns ARV. Lei 14.443/2022: laqueadura/vasectomia a partir de 21 anos OU 2 filhos vivos, sem consentimento do cônjuge, 60 dias entre pedido e cirurgia.',
  },
  {
    id: 'contracepcaoEmerg', nome: 'Contracepção de emergência', grupo: 'Saúde da Mulher',
    cid: ['Z30.0', 'Aconselhamento geral sobre contracepção'],
    dif: [['Z32.0', 'Gravidez (ainda) não confirmada'], ['T74.2', 'Abuso sexual'], ['Z20.2', 'Contato com e exposição a doenças transmitidas predominantemente por via sexual']],
    s: { contracepcaoEmergencia: 3, relacaoDesprotegida: 2, violenciaSexual: 2 },
    alarme: ['Violência sexual: acolher, notificar, PEP para HIV (até 72 h), profilaxia de IST e hepatite B, encaminhar ao serviço de referência — não exigir boletim de ocorrência', 'Atraso menstrual > 7 dias após o uso → β-hCG', 'Dor pélvica forte/sangramento atípico nas semanas seguintes → excluir ectópica'],
    exUbs: ['β-hCG se atraso menstrual atual (não é pré-requisito)', 'Testes rápidos HIV, sífilis, hepatites B e C (repetir em 30 dias)'], exPs: [],
    unid: [],
    casa: ['levonorgestrelEmerg'],
    orient: ['Tomar o quanto antes; funciona até 5 dias, melhor nas primeiras 72 h; não é abortiva', 'Próxima menstruação pode adiantar ou atrasar alguns dias; se atrasar > 7 dias, fazer teste de gravidez', 'Iniciar um método regular já no dia seguinte e usar camisinha por 7 dias'],
    obs: 'DIU de cobre até 5 dias é o método de emergência mais eficaz (e serve de método contínuo). IMC > 30: levonorgestrel menos eficaz — preferir DIU. Pode ser usada mais de uma vez no mesmo ciclo.',
  },
  {
    id: 'dismenorreia', nome: 'Dismenorreia (cólica menstrual)', grupo: 'Saúde da Mulher',
    cid: ['N94.4', 'Dismenorreia primária'],
    dif: [['N80.9', 'Endometriose não especificada'], ['N94.5', 'Dismenorreia secundária'], ['N73.9', 'Doença inflamatória pélvica feminina, não especificada']],
    s: { colicaMenstrual: 3, colica: 2, dorSuprapubica: 1, dorLombar: 1, nausea: 1 },
    alarme: ['Atraso menstrual → excluir gravidez/ectópica', 'Febre, corrimento, dor à mobilização do colo → DIP', 'Dor progressiva, dispareunia profunda, dor fora da menstruação, infertilidade ou falha de AINE + hormônio por 2–3 ciclos → causa secundária (endometriose/adenomiose): referenciar'],
    exUbs: ['Diagnóstico clínico; β-hCG se atraso', 'USG transvaginal se suspeita de causa secundária'], exPs: ['β-hCG se dúvida'],
    unid: ['?dipironaIM', '?hioscinaEV'],
    casa: ['ibuprofenoDismenorreia', '?dipirona', '?{"m":"aco","alt":"2ª linha ou se deseja contracepção (uso contínuo é mais eficaz para a dor)"}'],
    orient: ['Começar o anti-inflamatório antes de a dor ficar forte, em horário fixo nos 2–3 primeiros dias', 'Bolsa de água morna no baixo ventre; atividade física regular', 'Procurar a UBS se a cólica piorar a cada mês, vier com febre, atraso menstrual, dor na relação ou fora da menstruação'],
    obs: 'AINE é 1ª linha (ibuprofeno; naproxeno se disponível). Antiespasmódico só como adjuvante. Respeitar critérios de elegibilidade para estrogênio; se contraindicado: minipílula contínua ou trimestral.',
  },
  {
    id: 'sop', nome: 'Síndrome dos ovários policísticos (SOP)', grupo: 'Saúde da Mulher',
    cid: ['E28.2', 'Síndrome do ovário policístico'],
    dif: [['E03.9', 'Hipotireoidismo não especificado'], ['E22.1', 'Hiperprolactinemia'], ['E25.0', 'Transtornos adrenogenitais congênitos associados a deficiência enzimática (HAC não clássica)']],
    s: { cicloIrregular: 3, hirsutismo: 3, acne: 1 },
    alarme: ['Virilização rápida (clitoromegalia, voz grave, calvície) → tumor androgênico: referência urgente', 'Amenorreia > 3 meses sem proteção endometrial ou sangramento irregular persistente → USG TV/avaliar endométrio', 'Desejo de gestar → ginecologia (indução de ovulação) + ácido fólico'],
    exUbs: ['β-hCG, TSH, prolactina, 17-OH-progesterona (fase folicular), testosterona total', 'USG transvaginal (opcional para Rotterdam; não usar em < 8 anos pós-menarca)', 'Rastreio metabólico: glicemia de jejum/TOTG 75 g, perfil lipídico, PA, IMC/circunferência abdominal'],
    exPs: [],
    unid: [],
    casa: ['aco', '?{"m":"ciproteronaEE","alt":"Hirsutismo/acne importantes (maior risco de TEV)"}', '?{"m":"metforminaSOP","alt":"Resistência insulínica, IMC ≥ 25 ou intolerância à glicose"}', '?{"m":"espironolactonaSOP","alt":"Hirsutismo sem resposta após 6 meses de ACO — sempre com contracepção"}'],
    orient: ['Perder 5–10% do peso já regula ciclos e melhora a ovulação', 'Hirsutismo leva 6 meses para responder; métodos estéticos ajudam', 'Risco aumentado de diabetes, colesterol e apneia: acompanhamento anual'],
    obs: 'Rotterdam (2 de 3): oligo/anovulação, hiperandrogenismo clínico/laboratorial, ovários policísticos na USG — após excluir gestação, tireoide, prolactina e HAC (PCDT SOP/MS).',
  },
  {
    id: 'climaterio', nome: 'Climatério / Sintomas vasomotores (fogachos)', grupo: 'Saúde da Mulher',
    cid: ['N95.1', 'Estados da menopausa e do climatério feminino'],
    dif: [['E05.9', 'Tireotoxicose não especificada'], ['N95.2', 'Vaginite atrófica pós-menopausa'], ['F41.2', 'Transtorno misto ansioso e depressivo']],
    s: { fogacho: 3, securaVaginal: 2, cicloIrregular: 1, insonia: 1, ansiedade: 1, tristeza: 1 },
    alarme: ['Sangramento após 12 meses de amenorreia → USG TV e referência (câncer de endométrio)', 'Menopausa antes dos 40 anos (insuficiência ovariana prematura) → FSH 2x e referência', 'Nódulo mamário, TEV, AVC/IAM prévios: contraindicam TH'],
    exUbs: ['Diagnóstico clínico (≥ 12 meses sem menstruar após os 45 anos); FSH só se < 45 anos ou dúvida', 'TSH; glicemia, perfil lipídico e PA (risco CV antes de TH)', 'Mamografia (50–74 anos, bienal) e citopatológico em dia; densitometria se ≥ 65 anos ou risco'],
    exPs: [],
    unid: [],
    casa: ['?{"m":"venlafaxinaFogacho","alt":"Não hormonal (UBS Pedreira) — se TH contraindicada ou não desejada"}', '?{"m":"paroxetinaFogacho","alt":"Não hormonal alternativa (não usar com tamoxifeno)"}', '?{"m":"estriolCreme","alt":"Secura vaginal/dispareunia (síndrome geniturinária)"}', '?{"m":"thEstradiol","alt":"TH sistêmica: fogachos moderados/graves, < 60 anos ou < 10 anos de menopausa, sem contraindicação"}', '?{"m":"progesteronaMicro","alt":"Obrigatório junto ao estrogênio se tem útero"}'],
    orient: ['Roupas em camadas, ambiente fresco, evitar álcool, cafeína e comida apimentada; atividade física e parar de fumar', 'Lubrificante/hidratante vaginal à base de água para secura', 'Cálcio da dieta, vitamina D e exercício de força para os ossos'],
    obs: 'TH não é indicada para prevenção cardiovascular. Contraindicações: câncer de mama/endométrio, TEV/trombofilia, doença CV/AVC, hepatopatia ativa, sangramento não esclarecido. Estradiol transdérmico preferível se risco de TEV/HAS/obesidade. UBS Pedreira não tem TH oral — compra.',
  },
  {
    id: 'dip', nome: 'Doença inflamatória pélvica (DIP) — ambulatorial', grupo: 'Urinário / Gineco / IST',
    cid: ['N73.9', 'Doença inflamatória pélvica feminina, não especificada'],
    dif: [['N70.9', 'Salpingite e ooforite não especificadas'], ['O00.9', 'Gravidez ectópica, não especificada'], ['K35.9', 'Apendicite aguda sem outra especificação']],
    s: { dorAnexial: 3, dorSuprapubica: 2, corrimento: 2, febre: 2, securaVaginal: 1, relacaoDesprotegida: 1, dorAbdominal: 1 },
    alarme: ['Internar: gestante, abscesso tubo-ovariano, peritonite/sepse, vômitos/intolerância oral, dúvida diagnóstica (ectópica, apendicite), sem melhora em 72 h', 'Usuária de DIU: não retirar antes das 2 primeiras doses do antibiótico'],
    exUbs: ['β-hCG (obrigatório)', 'Testes rápidos HIV, sífilis, hepatites B e C; pesquisa de gonococo/clamídia (biologia molecular)', 'Hemograma, PCR; USG transvaginal se massa/abscesso'],
    exPs: ['β-hCG, hemograma, PCR, EAS', 'USG transvaginal'],
    unid: ['ceftriaxonaIST'],
    casa: ['doxiciclinaDIP', 'metronidazolDIP'],
    orient: ['Reavaliar em 72 h (melhora esperada); tomar todos os comprimidos até o fim', 'Tratar parceria(s) dos últimos 60 dias (ceftriaxona 500 mg IM + azitromicina 1 g VO) e abstinência até o fim do tratamento', 'Não ingerir bebida alcoólica durante o metronidazol'],
    obs: 'PCDT-IST 2022: ceftriaxona 500 mg IM DU + doxiciclina 100 mg 12/12 h 14 d + metronidazol 500 mg 12/12 h 14 d. Atraso > 3 dias no início triplica o risco de infertilidade — tratar na suspeita.',
  },
  {
    id: 'sua', nome: 'Sangramento uterino anormal (não gestante)', grupo: 'Saúde da Mulher',
    cid: ['N92.0', 'Menstruação excessiva e frequente com ciclo regular'],
    dif: [['N93.9', 'Sangramento anormal do útero ou da vagina, não especificado'], ['D25.9', 'Leiomioma do útero, não especificado'], ['O20.9', 'Hemorragia do início da gravidez, não especificada']],
    s: { sangramentoUterino: 3, sangramentoVaginal: 1, cicloIrregular: 1, palidez: 1, fadiga: 1 },
    alarme: ['Instabilidade hemodinâmica, Hb < 7 ou sangramento volumoso persistente → urgência', 'Excluir gestação (β-hCG) em toda mulher em idade fértil', 'Pós-menopausa, ≥ 45 anos com SUA persistente ou fatores de risco (obesidade, SOP, tamoxifeno) → avaliação endometrial (referência)', 'Sangramento intenso desde a menarca → investigar coagulopatia (von Willebrand)'],
    exUbs: ['β-hCG', 'Hemograma, ferritina, TSH', 'USG transvaginal', 'Citopatológico em dia; coagulograma se suspeita de coagulopatia'],
    exPs: ['β-hCG, hemograma'],
    unid: [],
    casa: ['?{"m":"ibuprofeno","p":"Tomar 2 comprimidos (600 mg), por via oral, a cada 8 horas, após as refeições, nos dias de maior fluxo (até 5 dias por ciclo).","alt":"Reduz o fluxo em ~30%"}', '?{"m":"aco","alt":"Sem contraindicação a estrogênio (cíclico ou contínuo)"}', '?{"m":"medroxiInj","alt":"Contraindicação a estrogênio"}', '?tranexamico', '?sulfatoFerroso'],
    orient: ['Anotar no calendário dias e intensidade do sangramento (nº de absorventes/dia)', 'Retornar se sangramento encharcar 1 absorvente por hora, tontura ou desmaio'],
    obs: 'Classificação PALM-COEIN. DIU de levonorgestrel é muito eficaz (não disponível na APS do SUS — referência).',
  },
];

// =====================================================================================
// 7) PUERICULTURA — sugestões (pediatria.js e FRASES)
// =====================================================================================
const PUERICULTURA_SUGESTOES = [
  // a) pediatria.js — itens de dose fixa por idade
  { onde: 'pediatria.js', id: 'vitaminaD', t: [], nome: 'Colecalciferol 400 UI — gotas', o: 'R', fixo: true,
    texto: (kg, anos) => anos !== null && anos >= 2 ? 'Rotina não indicada acima de 2 anos (só se fator de risco).' : anos !== null && anos >= 1 ? 'Dar 600 UI, por via oral, uma vez ao dia (12 a 24 meses — SBP, se fator de risco).' : 'Dar 400 UI, por via oral, uma vez ao dia, da 1ª semana de vida até 12 meses.',
    obs: 'Todos os lactentes, inclusive em aleitamento exclusivo. Conferir quantas UI tem cada gota na apresentação dispensada. Pré-termo: iniciar quando > 1.500 g e tolerando dieta.' },
  { onde: 'pediatria.js', id: 'ferroProfilaxia', t: [], nome: 'Sulfato ferroso 25 mg/mL de Fe elementar — gotas (1 gota = 1,25 mg)', o: 'R', fixo: true,
    texto: (kg, anos) => anos !== null && anos >= 2 ? 'Profilaxia encerrada aos 24 meses.' : 'Dar 8 a 10 gotas (10 a 12,5 mg de ferro elementar), por via oral, uma vez ao dia, 30 min antes de uma refeição, por 3 meses seguidos (ciclo I: 6 a 9 meses; ciclo II: 12 a 15 meses).',
    obs: 'A termo e peso adequado (SBP 2026 / PNSF). Pré-termo ou < 2.500 g: 2 mg/kg/dia a partir de 30 dias por 1 ano (3 mg/kg se 1.000–1.500 g; 4 mg/kg se < 1.000 g), depois 1 mg/kg/dia até 2 anos — usar o item "ferroso" (mg/kg).' },
  { onde: 'pediatria.js', id: 'nistatinaOral', t: [], nome: 'Nistatina 100.000 UI/mL — suspensão oral', o: 'C', fixo: true,
    texto: () => 'Aplicar 1 mL na boca (metade de cada lado), 4 vezes ao dia, após as mamadas, por 7 a 14 dias (manter 2 dias após sumirem as placas).',
    obs: 'Monilíase oral (sapinho). Tratar o mamilo da mãe se dor/fissura (miconazol tópico). Não tem na UBS Pedreira.' },
  // b) FRASES / orientações
  { onde: 'FRASES', id: 'triagemNeonatal', texto: 'Triagem neonatal: teste do pezinho (3º–5º dia), orelhinha, olhinho (reflexo vermelho), coraçãozinho (oximetria 24–48 h) e linguinha — conferir resultados na 1ª consulta.' },
  { onde: 'FRASES', id: 'alarmeRN', texto: 'Sinais de alarme no lactente < 2 meses: febre ≥ 37,8 °C, recusa alimentar, gemência, letargia, icterícia < 24 h ou que alcança abdome/pernas, fezes claras (acolia) — encaminhar ao PS.' },
  { onde: 'FRASES', id: 'aleitamento', texto: 'Aleitamento materno exclusivo até 6 meses e complementado até 2 anos ou mais; sem água/chás antes de 6 meses; sem açúcar até 2 anos; mel nunca antes de 1 ano; leite de vaca integral não antes de 12 meses.' },
  { onde: 'FRASES', id: 'sonoSeguro', texto: 'Sono seguro: dormir de barriga para cima, em berço próprio no quarto dos pais, colchão firme, sem travesseiro/protetor/bichos de pelúcia.' },
  { onde: 'FRASES', id: 'colicaLactente', texto: 'Cólica do lactente (2 sem a 3–4 meses): orientar técnicas de conforto (colo, contato pele a pele, massagem, banho morno) e cuidar da exaustão dos pais; não há benefício de simeticona ou outros fármacos.' },
  { onde: 'FRASES', id: 'vitaminaA', texto: 'Vitamina A (apenas municípios do Programa Nacional de Suplementação de Vitamina A): 100.000 UI aos 6–11 meses; 200.000 UI a cada 6 meses de 12 a 59 meses. Conferir se Pedreira participa.' },
  { onde: 'FRASES', id: 'vacinas', texto: 'Conferir caderneta conforme calendário PNI vigente (muda anualmente) e resgatar atrasos em toda consulta.' },
  { onde: 'FRASES', id: 'exameObstetrico', texto: 'Exame obstétrico: AU ___ cm, BCF ___ bpm, movimentação fetal presente, dinâmica uterina ausente, edema ausente. Toque não realizado.' },
];

// Para validação local: node --check proposta-gest.js
if (typeof module !== 'undefined') module.exports = { NOVOS_MEDS, TAGS_EM_MEDS_EXISTENTES, NOVAS_REGRAS, REGRAS_CORRIGIDAS, NOVAS_PROIBE, NOVOS_SINTOMAS, SINONIMOS_EXTRA, NOVAS_CONDICOES, PUERICULTURA_SUGESTOES };

  const P = { remover: ['dismenorreia', 'dip', 'contracepcaoEmergencia'] };
  if (typeof NOVAS_CONDICOES !== 'undefined') P.NOVAS_CONDICOES = NOVAS_CONDICOES;
  if (typeof NOVOS_MEDS !== 'undefined') P.NOVOS_MEDS = NOVOS_MEDS;
  if (typeof NOVOS_SINTOMAS !== 'undefined') P.NOVOS_SINTOMAS = NOVOS_SINTOMAS;
  if (typeof SINONIMOS_EXTRA !== 'undefined') P.SINONIMOS_EXTRA = SINONIMOS_EXTRA;
  if (typeof TAGS_EM_MEDS_EXISTENTES !== 'undefined') P.TAGS_EM_MEDS_EXISTENTES = TAGS_EM_MEDS_EXISTENTES;
  if (typeof REGRAS_CORRIGIDAS !== 'undefined') P.REGRAS_CORRIGIDAS = REGRAS_CORRIGIDAS;
  if (typeof NOVAS_REGRAS !== 'undefined') P.NOVAS_REGRAS = NOVAS_REGRAS;
  if (typeof NOVAS_PROIBE !== 'undefined') P.NOVAS_PROIBE = NOVAS_PROIBE;
  if (typeof NOVOS_PED !== 'undefined') P.NOVOS_PED = NOVOS_PED;
  window.mesclarPacote(P);
  if (typeof PUERICULTURA_SUGESTOES !== 'undefined' && window.FRASES) {
    const T = { triagemNeonatal: 'Triagem neonatal', alarmeRN: 'Alarmes no lactente < 2 meses', aleitamento: 'Aleitamento e alimentação', sonoSeguro: 'Sono seguro', colicaLactente: 'Cólica do lactente', vitaminaA: 'Vitamina A', vacinas: 'Vacinas', exameObstetrico: 'Exame obstétrico (modelo)' };
    window.FRASES.extras = (window.FRASES.extras || []).concat(PUERICULTURA_SUGESTOES.filter((x) => x.onde === 'FRASES').map((x) => [T[x.id] || x.id, x.texto]));
  }
})();
