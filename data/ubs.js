// Conteúdo incorporado das referências enviadas pelo médico (ubs) — revisado.
(function () {
// =====================================================================
// PROPOSTA — ATENÇÃO PRIMÁRIA / AMBULATORIAL DO ADULTO (UBS, ficha verde/amarela)
// Para o Prontuário Rápido (data/condicoes.js, medicamentos.js, sintomas.js, alertas.js)
// Fontes conferidas: 02 (Prescrevendo – ficha verde), 03 (Drive de prescrições),
// 04/05 (Prescrição para plantão/UBS), 09 (Medroute verde/amarela) + diretrizes MS/PCDT,
// SBD, SBC, SBU, FEBRASGO. Onde as fontes divergem, ficou o esquema mais seguro (ver "obs").
// Origem: R = UBS Pedreira 2026 (conferido em data/remume.js) | FP | U | C = compra.
// Itens de prescrição: 'chave' (marcado) | '?chave' (opcional) | { m, p, q, opc, alt } (override).
// =====================================================================

// ---------------------------------------------------------------------
// BLOCO 1 — NOVAS CONDIÇÕES (22) — colar no fim de window.CONDICOES
// ---------------------------------------------------------------------
const NOVAS_CONDICOES = [
  // ===================== PELE / MICOSES =====================
  {
    id: 'tineaCorporis', nome: 'Dermatofitose de pele (tinea corporis / cruris)', grupo: 'Pele / Partes moles',
    cid: ['B35.4', 'Tinha do corpo (tinea corporis)'],
    dif: [['B35.6', 'Tinha inguinal (tinea cruris)'], ['B37.2', 'Candidíase da pele e das unhas'], ['L30.0', 'Dermatite numular']],
    s: { micosePele: 3, prurido: 2, eritemaPele: 1 },
    alarme: ['Lesões extensas, couro cabeludo (tinea capitis), imunossuprimido ou falha do tópico → antifúngico oral', 'Piora após creme com corticoide (tinea incógnita)', 'Sinais de infecção bacteriana secundária (dor, pus, febre)'],
    exUbs: ['Diagnóstico clínico; exame micológico direto se dúvida ou antes de tratamento oral', 'Glicemia de jejum/HbA1c se recorrente ou extensa'],
    exPs: [],
    unid: [],
    casa: ['miconazolPele', { m: 'cetoconazolCreme', opc: true, alt: 'Se a farmácia não dispensar o miconazol para uso cutâneo' }, { m: 'fluconazolTinea', opc: true, alt: 'Lesões extensas/múltiplas ou falha do tópico' }, '?loratadina'],
    orient: ['Aplicar o creme ultrapassando 2 cm a borda da lesão e manter 1–2 semanas após o sumiço (total 2–4 semanas)', 'Secar bem dobras e virilha; roupas de algodão; não compartilhar toalhas', 'Examinar animais domésticos e contactantes com lesões semelhantes; não usar cremes com corticoide'],
    obs: 'Fontes: 03 (clotrimazol 2x/dia 14 dias; griseofulvina oral se extenso). Griseofulvina não está na UBS Pedreira; fluconazol semanal é alternativa oral disponível.',
  },
  {
    id: 'tineaPedis', nome: 'Tinea pedis (frieira / pé de atleta)', grupo: 'Pele / Partes moles',
    cid: ['B35.3', 'Tinha dos pés (tinea pedis)'],
    dif: [['B37.2', 'Candidíase da pele e das unhas (intertrigo)'], ['L30.1', 'Disidrose'], ['L24.9', 'Dermatite de contato por irritantes']],
    s: { frieira: 3, prurido: 2, micosePele: 1 },
    alarme: ['Diabético: fissuras interdigitais são porta de entrada → exame do pé e orientação', 'Eritema/edema ascendente na perna, febre → celulite/erisipela'],
    exUbs: ['Diagnóstico clínico; micológico direto se dúvida', 'Glicemia/HbA1c se recorrente'],
    exPs: [],
    unid: [],
    casa: ['miconazolPele', { m: 'cetoconazolCreme', opc: true, alt: 'Alternativa (compra)' }],
    orient: ['Secar bem entre os dedos após o banho; meias de algodão trocadas diariamente', 'Evitar calçado fechado por longos períodos e andar descalço em vestiários/piscinas', 'Tratar também as unhas se houver onicomicose (reinfecção)'],
    obs: 'Fontes: 09 (cetoconazol creme 12/12 h por 30 dias), 03 (clotrimazol 2x/dia 14 dias). Ficou 4 semanas (interdigital exige tratamento mais longo).',
  },
  {
    id: 'pitiriaseVersicolor', nome: 'Pitiríase versicolor ("pano branco")', grupo: 'Pele / Partes moles',
    cid: ['B36.0', 'Pitiríase versicolor'],
    dif: [['L80', 'Vitiligo'], ['L30.5', 'Pitiríase alba'], ['L42', 'Pitiríase rósea']],
    s: { manchasHipocromicas: 3, prurido: 1, micosePele: 1 },
    alarme: ['Lesões muito extensas ou recidivas frequentes → tratamento oral e profilaxia'],
    exUbs: ['Diagnóstico clínico (sinal de Zileri: descamação ao esticar a pele)'],
    exPs: [],
    unid: [],
    casa: ['cetoconazolShampooPV', { m: 'fluconazolPV', opc: true, alt: 'Lesões extensas ou recidivantes' }, { m: 'miconazolPele', opc: true, alt: 'Poucas lesões' }],
    orient: ['As manchas claras demoram semanas a meses para recuperar a cor mesmo após a cura', 'Recidiva é comum em calor e suor: xampu de cetoconazol no corpo 1x/semana por 3 meses no verão', 'Evitar óleos e cremes gordurosos na pele'],
    obs: 'Fonte 03: fluconazol 150 mg/semana por 3 semanas + cetoconazol creme. Esquema oral adotado (300 mg/semana × 2) é o mais citado em diretrizes; ambos aceitáveis.',
  },
  {
    id: 'onicomicose', nome: 'Onicomicose', grupo: 'Pele / Partes moles',
    cid: ['B35.1', 'Tinha das unhas (tinea unguium)'],
    dif: [['L40.8', 'Psoríase ungueal'], ['B37.2', 'Candidíase ungueal/paroníquia'], ['L60.3', 'Distrofia ungueal (trauma)']],
    s: { unhaMicose: 3, frieira: 1, micosePele: 1 },
    alarme: ['Diabético ou doença arterial periférica: risco de celulite/úlcera → cuidado com os pés', 'Lesão pigmentada longitudinal ou que se estende à pele (sinal de Hutchinson) → dermatologia (melanoma)'],
    exUbs: ['Micológico direto e cultura da unha ANTES do antifúngico oral', 'TGO/TGP antes de terbinafina/fluconazol prolongado (repetir em 4–6 semanas)'],
    exPs: [],
    unid: [],
    casa: [{ m: 'fluconazolOnico', alt: 'Opção UBS Pedreira (uso prolongado)' }, { m: 'terbinafina', opc: true, alt: 'Mais eficaz para dermatófito (compra); não usar em hepatopata' }],
    orient: ['Tratamento longo: unhas das mãos 3–6 meses, dos pés 9–12 meses; a unha nova cresce devagar', 'Lixar/cortar a parte afetada; tratar frieira associada; não compartilhar alicates', 'Só 1–2 unhas e < 50% da lâmina: considerar tratamento tópico (esmalte de ciclopirox/amorolfina — compra)'],
    obs: 'Fonte 03: terbinafina 250 mg/dia 56 dias (mãos) e 84 dias (pés); itraconazol pulso 200 mg 12/12 h 7 dias/mês (2 pulsos mãos, 3 pés). Nenhum dos dois está na UBS Pedreira. Fluconazol semanal é off-label, mas aceito (MFC).',
  },
  {
    id: 'dermatiteSeborreica', nome: 'Dermatite seborreica', grupo: 'Pele / Partes moles',
    cid: ['L21.9', 'Dermatite seborreica não especificada'],
    dif: [['L40.0', 'Psoríase vulgar'], ['L20.9', 'Dermatite atópica'], ['B35.0', 'Tinha da barba e do couro cabeludo']],
    s: { caspa: 3, prurido: 1, eritemaPele: 1 },
    alarme: ['Quadro extenso, súbito e refratário em adulto jovem → oferecer teste rápido de HIV', 'Eritrodermia (pele vermelha em todo o corpo) → referência'],
    exUbs: ['Diagnóstico clínico; teste rápido de HIV se grave/refratária'],
    exPs: [],
    unid: [],
    casa: ['cetoconazolShampoo', { m: 'cetoconazolCreme', opc: true, alt: 'Face/sobrancelhas/atrás das orelhas' }, { m: 'dexametasonaCreme', opc: true, p: 'Aplicar fina camada nas áreas muito inflamadas, 1 a 2 vezes ao dia, por no máximo 5 a 7 dias (no rosto, até 5 dias).', alt: 'Crise inflamatória' }],
    orient: ['Doença crônica com crises: controlar, não curar; piora com estresse, frio e álcool', 'Manter o xampu 1 vez por semana após a melhora (prevenção)', 'Evitar corticoide no rosto por tempo prolongado'],
    obs: 'Fonte 03: cetoconazol xampu 2% 3x/semana 4 semanas + hidrocortisona 1% 2x/dia 5 dias. UBS Pedreira só tem dexametasona 1 mg/g (pomada).',
  },
  {
    id: 'foliculite', nome: 'Foliculite bacteriana', grupo: 'Pele / Partes moles',
    cid: ['L73.9', 'Afecção folicular não especificada'],
    dif: [['L73.1', 'Pseudofoliculite da barba'], ['L70.0', 'Acne vulgar'], ['B36.8', 'Foliculite por Malassezia (pitirospórica)']],
    s: { foliculite: 3, prurido: 1, eritemaPele: 1, abscesso: 1 },
    alarme: ['Evolução para furúnculo/abscesso com flutuação → drenagem', 'Febre, celulite ao redor, lesões na face central', 'Recorrência frequente: investigar diabetes e portador nasal de S. aureus'],
    exUbs: ['Diagnóstico clínico; glicemia se recorrente'],
    exPs: [],
    unid: [],
    casa: ['neoBacitracina', { m: 'mupirocina', opc: true, alt: 'Preferível para S. aureus (compra)' }, { m: 'cefalexina', opc: true, alt: 'Lesões extensas, febre ou celulite associada' }],
    orient: ['Lavar a área 2x/dia com água e sabão; compressa morna 3x/dia', 'Suspender depilação/lâmina na área até melhorar; depois, raspar a favor do pelo com lâmina limpa', 'Não espremer as lesões; toalha individual'],
    obs: 'Fonte 03: eritromicina 500 mg 6/6 h 7 dias + mupirocina. Eritromicina não está na UBS Pedreira e a maioria dos casos é só tópica; cefalexina se extenso.',
  },
  {
    id: 'larvaMigrans', nome: 'Larva migrans cutânea (bicho geográfico)', grupo: 'Pele / Partes moles',
    cid: ['B76.9', 'Ancilostomíase não especificada (larva migrans cutânea)'],
    dif: [['B86', 'Escabiose'], ['B88.1', 'Tungíase'], ['L23.9', 'Dermatite alérgica de contato']],
    s: { bichoGeografico: 3, prurido: 2 },
    alarme: ['Infecção secundária (pus, celulite)', 'Tosse/chiado com eosinofilia (síndrome de Löffler) ou lesões muito numerosas'],
    exUbs: ['Diagnóstico clínico'],
    exPs: [],
    unid: [],
    casa: ['albendazolLarva', { m: 'ivermectinaLarva', opc: true, alt: 'Alternativa ao albendazol' }, { m: 'tiabendazolPomada', opc: true, alt: 'Poucas lesões (compra)' }, '?hidroxizina'],
    orient: ['Usar calçados em areia/terra; evitar contato com fezes de cães e gatos (praias, parquinhos)', 'Não coçar; manter limpo e seco; compressa fria alivia o prurido', 'Autolimitada, mas o tratamento encurta o quadro'],
    obs: 'Fontes 03 e 09: albendazol 400 mg/dia 3 dias ou ivermectina 200 mcg/kg dose única; tiabendazol tópico 3x/dia 5 dias. Gestante: preferir tiabendazol tópico.',
  },
  {
    id: 'onicocriptose', nome: 'Unha encravada / Paroníquia aguda', grupo: 'Pele / Partes moles',
    cid: ['L60.0', 'Unha encravada'],
    dif: [['L03.0', 'Celulite de dedos da mão e do pé (paroníquia)'], ['B35.1', 'Onicomicose'], ['M86.9', 'Osteomielite não especificada']],
    s: { unhaEncravada: 3, eritemaPele: 1, edemaLocal: 1, abscesso: 1 },
    alarme: ['Diabético, doença arterial periférica ou imunossuprimido → avaliar perfusão e infecção profunda', 'Celulite ascendente, febre, secreção profunda ou dor óssea (osteomielite)'],
    exUbs: ['Diagnóstico clínico; RX do dedo se suspeita de osteomielite/crônico'],
    exPs: [],
    unid: [],
    casa: ['neoBacitracina', 'dipirona', '?ibuprofeno', { m: 'cefalexina', opc: true, alt: 'Celulite periungueal ou secreção purulenta extensa' }],
    orient: ['Escalda-pés morno com água e sal 15 min, 3 vezes ao dia; secar bem', 'Cortar a unha reta, sem aprofundar os cantos; calçado largo e bico arredondado', 'Recidiva ou granuloma: agendar cantoplastia/cunha (procedimento na UBS ou cirurgia ambulatorial)'],
    obs: 'Fonte 09: Nebacetin 3x/dia 7 dias; antibiótico sistêmico (cefalexina) só se a infecção ultrapassar a dobra periungueal.',
  },

  // ===================== BOCA / OLHO / OUVIDO =====================
  {
    id: 'aftas', nome: 'Afta / Estomatite aftosa', grupo: 'Respiratório / ORL',
    cid: ['K12.0', 'Aftas bucais recidivantes'],
    dif: [['B00.2', 'Gengivoestomatite e faringoamigdalite por vírus do herpes'], ['K12.1', 'Outras formas de estomatite'], ['M35.2', 'Doença de Behçet']],
    s: { aftaOral: 3, odinofagia: 1 },
    alarme: ['Úlcera única que não cicatriza em 2–3 semanas, endurecida (sobretudo tabagista/etilista) → biópsia (câncer de boca)', 'Úlceras genitais ou oculares associadas (Behçet); diarreia/perda de peso (DII, doença celíaca)', 'Incapacidade de ingerir líquidos, imunossuprimido/HIV'],
    exUbs: ['Diagnóstico clínico', 'Se recorrente: hemograma, ferritina, vitamina B12, ácido fólico; teste rápido HIV/sífilis se úlcera atípica'],
    exPs: [],
    unid: [],
    casa: [{ m: 'triancinolonaOrabase', alt: 'Compra' }, '?clorexidinaBochecho', 'dipirona', '?paracetamol'],
    orient: ['Escova macia; evitar alimentos ácidos, picantes e crocantes enquanto houver lesão', 'Cicatriza em 7–14 dias; procurar a UBS se durar mais de 3 semanas', 'Encaminhar à saúde bucal (ESB) se prótese/dente quebrado ferindo a mucosa'],
    obs: 'Fontes: 09 (triancinolona orabase até 8/8 h por 7 dias; prednisolona curta se muitas lesões), 03 (clorexidina 0,2% 2x/dia 10 dias). Clorexidina: ficou 0,12% (apresentação usual no Brasil). Nenhum dos dois está na UBS Pedreira.',
  },
  {
    id: 'hordeolo', nome: 'Hordéolo (terçol) / Calázio', grupo: 'Olho',
    cid: ['H00.0', 'Hordéolo e outras inflamações profundas das pálpebras'],
    dif: [['H00.1', 'Calázio'], ['H01.0', 'Blefarite'], ['H05.0', 'Inflamação aguda da órbita (celulite orbitária)']],
    s: { nodPalpebra: 3, edemaLocal: 1, olhoVermelho: 1 },
    alarme: ['Edema palpebral difuso, dor à movimentação ocular, proptose, febre ou baixa visual → celulite orbitária (urgência)', 'Calázio recorrente no mesmo local ou > 6 semanas → oftalmologia (biópsia: carcinoma sebáceo)'],
    exUbs: ['Diagnóstico clínico; acuidade visual'],
    exPs: [],
    unid: [],
    casa: [{ m: 'tobraDexPomada', opc: true, alt: 'Hordéolo muito inflamado/drenando (compra)' }, 'dipirona'],
    orient: ['Compressa MORNA (pano limpo) por 10 minutos, 4 vezes ao dia, seguida de massagem suave em direção à borda da pálpebra', 'Não espremer; não usar maquiagem/lentes de contato até melhorar', 'Hordéolo melhora em 1–2 semanas; calázio pode levar semanas — encaminhar se > 4–6 semanas'],
    obs: 'Fontes 02 e 09: pomada oftálmica de antibiótico + dexametasona 3x/dia 5 dias + compressa morna. Evidência de benefício do antibiótico tópico é fraca: compressa morna é o principal; pomada como opcional.',
  },
  {
    id: 'cerume', nome: 'Cerume impactado', grupo: 'Respiratório / ORL',
    cid: ['H61.2', 'Cerume impactado'],
    dif: [['H60.9', 'Otite externa não especificada'], ['H65.9', 'Otite média não supurativa'], ['H91.9', 'Perda de audição não especificada']],
    s: { cerume: 3, hipoacusia: 2, zumbido: 1, otalgia: 1 },
    alarme: ['Otorreia, dor intensa ou febre (otite) — não lavar', 'Perfuração timpânica prévia, cirurgia otológica ou tubo de ventilação → NÃO irrigar (encaminhar para remoção instrumental)', 'Perda auditiva súbita sem rolha de cera → urgência otorrino'],
    exUbs: ['Otoscopia antes e após a remoção'],
    exPs: [],
    unid: [],
    casa: ['oleoOtologico', { m: 'ceruminolitico', opc: true, alt: 'Alternativa (compra)' }],
    orient: ['Amolecer a cera por 3–5 dias e retornar à UBS para lavagem otológica com água morna', 'Não usar hastes flexíveis (empurram a cera)', 'Não pingar nada se houver dor, secreção ou perfuração conhecida'],
    obs: 'Fontes 02, 03 e 09: Cerumin 5 gotas 8/8 h por 5–7 dias e depois lavagem. Óleo mineral (UBS Pedreira) é ceruminolítico aceito (AAO-HNS) e gratuito.',
  },

  // ===================== NEURO / SONO =====================
  {
    id: 'paralisiaFacial', nome: 'Paralisia facial periférica (de Bell)', grupo: 'Neurológico',
    cid: ['G51.0', 'Paralisia de Bell'],
    dif: [['I64', 'Acidente vascular cerebral não especificado'], ['B02.2', 'Herpes zoster com outras manifestações neurológicas (Ramsay Hunt)'], ['G61.0', 'Síndrome de Guillain-Barré']],
    s: { paralisiaFacial: 3, otalgia: 1 },
    alarme: ['TESTA POUPADA (consegue enrugar a testa) ou qualquer outro déficit (braço/perna, fala, visão) → AVC: sala vermelha', 'Vesículas no ouvido/palato + dor intensa → Ramsay Hunt (antiviral obrigatório)', 'Bilateral, recorrente, progressiva > 3 semanas ou sem melhora em 3 meses → investigação/neurologia'],
    exUbs: ['Diagnóstico clínico (acomete toda a hemiface, inclusive a testa)', 'Glicemia/HbA1c; teste rápido de HIV e sífilis se fatores de risco', 'Imagem apenas se atípica'],
    exPs: ['TC de crânio se dúvida com AVC'],
    unid: [],
    casa: ['prednisonaBell', { m: 'carmelose', p: 'Instilar 1 gota no olho do lado paralisado a cada 2 a 4 horas durante o dia, enquanto o olho não fechar bem.' }, { m: 'pomadaOftNoturna', opc: true, alt: 'Olho não fecha à noite (compra)' }, { m: 'aciclovirBell', opc: true, alt: 'Paralisia completa/grave ou suspeita de zoster — sempre junto com o corticoide' }],
    orient: ['Iniciar o corticoide idealmente até 72 h do início', 'Proteger o olho: colírio lubrificante de dia, pomada e oclusão (fita) à noite, óculos de sol', '70–85% recuperam em semanas a 3 meses; fisioterapia/fonoaudiologia se paralisia extensa'],
    obs: 'Fontes: 09 (prednisona 60 mg 5 dias + redução 10 mg/dia por 5 dias; antiviral opcional), 02 (prednisona 60 mg 5 dias; aciclovir 400 mg 5x/dia 10 dias). Antiviral isolado não é indicado.',
  },
  {
    id: 'insonia', nome: 'Insônia', grupo: 'Neurológico',
    cid: ['G47.0', 'Distúrbios do início e da manutenção do sono (insônias)'],
    dif: [['F51.0', 'Insônia não orgânica'], ['F32.9', 'Episódio depressivo não especificado'], ['G47.3', 'Apneia de sono']],
    s: { insonia: 3, ansiedade: 1, tristeza: 1, fadiga: 1 },
    alarme: ['Ronco alto, pausas respiratórias e sonolência diurna → suspeitar apneia do sono (evitar hipnóticos)', 'Depressão/ideação suicida, abuso de álcool ou benzodiazepínico associado', 'Idoso: evitar hipnóticos (quedas, delirium)'],
    exUbs: ['Diário do sono por 2 semanas', 'TSH, hemograma e glicemia se suspeita de causa orgânica', 'Rastrear depressão/ansiedade (PHQ-9/GAD-7)'],
    exPs: [],
    unid: [],
    casa: [{ m: 'zolpidem', opc: true, alt: 'Curto prazo (≤ 4 semanas), adulto < 65 anos, após higiene do sono' }],
    orient: ['Horário fixo para deitar e acordar; cama só para dormir; sair da cama se não dormir em ~20 min', 'Evitar café/energético após 14 h, álcool, telas 1 h antes de deitar e cochilos longos', 'Atividade física regular (não à noite); encaminhar para TCC/práticas integrativas se disponível'],
    obs: 'Fonte 03 (passiflora/melissa + valeriana, fitoterápicos de compra). Zolpidem: Notificação de Receita B (azul) para qualquer dose desde 2024 (Anvisa). Insônia com depressão/ansiedade: tratar a causa (ISRS; amitriptilina ou mirtazapina em dose baixa — UBS Pedreira).',
  },

  // ===================== URO / GINECO =====================
  {
    id: 'dismenorreia', nome: 'Dismenorreia (cólica menstrual)', grupo: 'Urinário / Gineco / IST',
    cid: ['N94.4', 'Dismenorreia primária'],
    dif: [['N80.9', 'Endometriose não especificada'], ['N73.9', 'Doença inflamatória pélvica não especificada'], ['O00.9', 'Gravidez ectópica não especificada']],
    s: { colicaMenstrual: 3, colica: 1, dorSuprapubica: 1, dorLombar: 1, nausea: 1 },
    alarme: ['Atraso menstrual + dor pélvica → beta-HCG (excluir gravidez ectópica)', 'Dor progressiva, início após 25 anos, dispareunia, sangramento fora do ciclo ou infertilidade → dismenorreia secundária (endometriose/mioma): USG transvaginal', 'Febre e corrimento → DIP'],
    exUbs: ['Diagnóstico clínico na primária', 'Beta-HCG se atraso menstrual', 'USG transvaginal se suspeita de causa secundária'],
    exPs: ['Beta-HCG', 'USG pélvica/transvaginal se dor atípica'],
    unid: ['?dipironaIM', '?hioscinaEV'],
    casa: [{ m: 'ibuprofeno', q: '20 comprimidos', p: 'Tomar 2 comprimidos (600 mg), por via oral, a cada 8 horas, após as refeições, começando no 1º dia da menstruação (ou na véspera), por 2 a 3 dias.' }, '?hioscina', '?dipirona', { m: 'acoCombinado', opc: true, alt: 'Dor recorrente que não responde ao AINE ou deseja contracepção' }],
    orient: ['O anti-inflamatório funciona melhor se iniciado ao primeiro sinal de cólica ou na véspera', 'Calor local (bolsa morna) e atividade física regular ajudam', 'Retornar se a dor piorar a cada ciclo, sangramento fora da menstruação ou dor na relação'],
    obs: 'Fonte 03: ibuprofeno 600 mg 8/8 h 5 dias + paracetamol/codeína se dor forte. AINE limitado a 2–3 dias do ciclo é suficiente na maioria.',
  },
  {
    id: 'contracepcaoEmergencia', nome: 'Contracepção de emergência', grupo: 'Urinário / Gineco / IST',
    cid: ['Z30.0', 'Aconselhamento geral sobre contracepção'],
    dif: [['Z20.2', 'Contato com e exposição a doenças de transmissão predominantemente sexual'], ['T74.2', 'Abuso sexual'], ['Z32.0', 'Gravidez (ainda) não confirmada']],
    s: { falhaContraceptiva: 3, relacaoDesprotegida: 2 },
    alarme: ['VIOLÊNCIA SEXUAL → protocolo próprio: PEP-HIV até 72 h, profilaxia de IST e hepatite B, notificação e rede de proteção', 'Atraso menstrual > 7 dias após o uso → beta-HCG'],
    exUbs: ['Beta-HCG apenas se atraso menstrual prévio (não atrasar a CE para colher exame)', 'Testes rápidos HIV, sífilis, hepatites B e C (repetir em 30 dias)'],
    exPs: [],
    unid: [],
    casa: ['levonorgestrelCE', '?ondansetrona'],
    orient: ['Tomar o quanto antes: quanto mais cedo, mais eficaz (pode até 5 dias após a relação)', 'Se vomitar em até 2 horas, repetir a dose; a próxima menstruação pode adiantar ou atrasar alguns dias', 'Não é método regular: iniciar contracepção (DIU, injetável, pílula) e usar preservativo — o DIU de cobre também é contracepção de emergência até 5 dias'],
    obs: 'Fonte 09 (levonorgestrel 1,5 mg dose única; preferir < 72 h, até 5 dias) e 05 (idem, violência sexual). Indutores enzimáticos (carbamazepina, fenitoína, rifampicina, efavirenz): considerar DIU de cobre ou dobrar a dose (3 mg).',
  },
  {
    id: 'dip', nome: 'Doença inflamatória pélvica (ambulatorial)', grupo: 'Urinário / Gineco / IST',
    cid: ['N73.9', 'Doença inflamatória pélvica feminina não especificada'],
    dif: [['O00.9', 'Gravidez ectópica não especificada'], ['K35.8', 'Apendicite aguda, outras e as não especificadas'], ['N83.2', 'Outros cistos ovarianos e os não especificados']],
    s: { dorPelvica: 3, dorSuprapubica: 2, corrimento: 2, febre: 1, relacaoDesprotegida: 1, dorAbdominal: 1 },
    alarme: ['Gestante, abscesso tubo-ovariano, febre alta/toxemia, peritonite, vômitos, falha após 72 h de tratamento oral → internação', 'Dúvida com apendicite ou gravidez ectópica (beta-HCG positivo)'],
    exUbs: ['Beta-HCG (obrigatório)', 'Hemograma, PCR, urina tipo 1', 'Testes rápidos HIV, sífilis, hepatites B e C; pesquisa de gonococo/clamídia se disponível', 'USG transvaginal se massa anexial ou falha terapêutica'],
    exPs: ['Beta-HCG, hemograma, PCR, urina tipo 1', 'USG transvaginal'],
    unid: ['ceftriaxonaIST'],
    casa: ['doxiciclinaDIP', 'metronidazolDIP', 'dipirona', '?ondansetrona'],
    orient: ['Reavaliação OBRIGATÓRIA em 72 h; tomar todo o tratamento (14 dias)', 'Parcerias dos últimos 60 dias: ceftriaxona 500 mg IM + azitromicina 1 g VO dose única', 'Abstinência sexual até 7 dias após o fim do tratamento e da parceria; não é necessário retirar DIU'],
    obs: 'Fonte 09 e 05 = PCDT IST 2022 (ceftriaxona 500 mg IM + doxiciclina 100 mg 12/12 h + metronidazol 500 mg 12/12 h, 14 dias). A fonte 03 traz ceftriaxona 250 mg (dose antiga) — não usar.',
  },
  {
    id: 'hpb', nome: 'Hiperplasia prostática benigna (LUTS)', grupo: 'Urinário / Gineco / IST',
    cid: ['N40', 'Hiperplasia da próstata'],
    dif: [['C61', 'Neoplasia maligna da próstata'], ['N41.1', 'Prostatite crônica'], ['N31.9', 'Disfunção neuromuscular não especificada da bexiga']],
    s: { luts: 3, polaciuria: 2, hematuria: 1 },
    alarme: ['Retenção urinária aguda (bexigoma) → sondagem/PS', 'Hematúria, ITU de repetição, cálculo vesical, creatinina elevada/hidronefrose → urologia', 'Toque retal endurecido/nodular ou PSA alterado → urologia'],
    exUbs: ['Escore IPSS; toque retal', 'Urina tipo 1, creatinina', 'PSA (decisão compartilhada, 50–70 anos ou ≥ 45 se negro/história familiar)', 'USG de próstata e vias urinárias com resíduo pós-miccional'],
    exPs: [],
    unid: [],
    casa: ['tansulosinaHPB', { m: 'finasterida', opc: true, alt: 'Próstata aumentada (> 30–40 mL) — associar ao alfabloqueador' }, { m: 'doxazosina', opc: true, alt: 'Alternativa à tansulosina' }],
    orient: ['Reduzir líquidos 2 h antes de deitar; evitar café e álcool à noite', 'Evitar descongestionantes e antialérgicos que dão sono (podem travar a urina)', 'Retorno em 4–6 semanas para avaliar resposta (IPSS)'],
    obs: 'Fonte 03 (doxazosina, tansulosina, finasterida isoladas ou associadas) — todas na UBS Pedreira (também dutasterida + tansulosina). Finasterida reduz o PSA em ~50% (dobrar o valor para interpretar) e leva ~6 meses para efeito.',
  },
  {
    id: 'prostatite', nome: 'Prostatite bacteriana aguda (ambulatorial)', grupo: 'Urinário / Gineco / IST',
    cid: ['N41.0', 'Prostatite aguda'],
    dif: [['N30.0', 'Cistite aguda'], ['N45.9', 'Orquite e epididimite sem menção de abscesso'], ['N34.1', 'Uretrites não específicas']],
    s: { dorPerineal: 3, disuria: 2, febre: 2, polaciuria: 1, luts: 1, calafrio: 1, dorSuprapubica: 1 },
    alarme: ['Sepse, toxemia, retenção urinária, idoso frágil ou falha VO → internação/ATB EV', 'Sem melhora em 48–72 h → USG/TC (abscesso prostático)'],
    exUbs: ['Urina tipo 1 e urocultura com antibiograma (antes do ATB)', 'Hemograma, creatinina', 'Testes rápidos para IST; < 35 anos sexualmente ativo: pesquisa de gonococo/clamídia', 'Não fazer massagem prostática nem PSA na fase aguda'],
    exPs: ['Urina tipo 1, urocultura, hemograma, PCR, creatinina', 'Hemocultura se febre alta'],
    unid: ['?ceftriaxona1g', '?dipironaIM'],
    casa: ['ciprofloxacinoProstatite', { m: 'ibuprofeno', opc: true }, 'dipirona'],
    orient: ['Tratamento longo (2 a 4 semanas) mesmo com melhora rápida', 'Hidratação; reavaliar em 48–72 h e ao fim do tratamento', 'Retornar se não conseguir urinar, febre persistente ou piora'],
    obs: 'Fonte 03: ciprofloxacino 500 mg 12/12 h 28 dias + ibuprofeno. Alternativa: SMX-TMP 800/160 12/12 h (2 cp de 400/80) 4 semanas, guiado por cultura. Suspeita de IST: ceftriaxona 500 mg IM + doxiciclina 100 mg 12/12 h 10 dias.',
  },

  // ===================== GASTRO =====================
  {
    id: 'diverticulite', nome: 'Diverticulite aguda não complicada', grupo: 'Gastrointestinal',
    cid: ['K57.3', 'Doença diverticular do intestino grosso sem perfuração ou abscesso'],
    dif: [['K35.8', 'Apendicite aguda, outras e as não especificadas'], ['C18.9', 'Neoplasia maligna do cólon, não especificada'], ['N20.1', 'Calculose do ureter']],
    s: { dorFIE: 3, dorAbdominal: 2, febre: 1, nausea: 1, constipacao: 1, diarreia: 1 },
    alarme: ['Peritonite, dor intensa, febre > 39 °C, vômitos, idoso/imunossuprimido, comorbidade grave ou sem suporte em casa → PS/TC/internação', 'Primeiro episódio sem confirmação por imagem → TC de abdome (descartar abscesso/perfuração/neoplasia)', 'Sem melhora em 48–72 h'],
    exUbs: ['Hemograma, PCR, urina tipo 1, beta-HCG se idade fértil', 'TC de abdome com contraste (padrão-ouro) — encaminhar se não confirmada', 'Colonoscopia 6–8 semanas após o episódio (excluir câncer), se não feita recentemente'],
    exPs: ['Hemograma, PCR, creatinina, urina tipo 1', 'TC de abdome e pelve com contraste'],
    unid: ['?dipironaIM', '?hioscinaEV'],
    casa: [{ m: 'amoxClav', q: '30 cápsulas', p: 'Tomar 1 cápsula, por via oral, a cada 8 horas, após as refeições, por 7 a 10 dias.' }, { m: 'ciprofloxacino7', q: '20 comprimidos', p: 'Tomar 1 comprimido, por via oral, a cada 12 horas, por 7 a 10 dias.', opc: true, alt: 'Alergia a penicilina — sempre junto com o metronidazol' }, { m: 'metronidazolDiverticulite', opc: true, alt: 'Junto com o ciprofloxacino' }, 'hioscina', '?dipirona'],
    orient: ['Dieta líquida/leve sem resíduos nos primeiros dias; reintroduzir fibras após a melhora', 'Reavaliação obrigatória em 48–72 h', 'Retornar se febre persistente, vômitos, piora da dor ou sangue nas fezes'],
    obs: 'Fonte 09: amoxicilina-clavulanato 875/125 12/12 h 10 dias; ou SMX-TMP ou ciprofloxacino + metronidazol 500 mg 8/8 h 10 dias. Imunocompetente com quadro leve e TC confirmada pode ser tratado sem antibiótico (AGA 2021), com reavaliação.',
  },
  {
    id: 'enterobiase', nome: 'Enterobíase (oxiúros)', grupo: 'Gastrointestinal',
    cid: ['B80', 'Enterobíase'],
    dif: [['L29.0', 'Prurido anal'], ['I84.9', 'Hemorroidas sem complicação, não especificadas'], ['B86', 'Escabiose']],
    s: { pruridoAnal: 3, prurido: 1, pruridoNoturno: 1, insonia: 1, dorAnal: 1 },
    alarme: ['Vulvovaginite/ITU de repetição em meninas', 'Prurido anal crônico sem oxiúros → investigar hemorroida, fissura, dermatite, candidíase'],
    exUbs: ['Fita gomada (método de Graham) pela manhã, antes do banho, se dúvida'],
    exPs: [],
    unid: [],
    casa: [{ m: 'albendazol', q: '2 comprimidos', p: 'Tomar 1 comprimido, por via oral, em dose única (mastigar). Repetir 1 comprimido após 14 dias (obrigatório).' }, '?hidroxizina'],
    orient: ['Tratar TODOS da casa ao mesmo tempo e repetir em 14 dias', 'Unhas curtas, lavar mãos antes de comer e após o banheiro; banho de manhã', 'Trocar e lavar roupas íntimas, pijama e roupa de cama em água quente no dia do tratamento'],
    obs: 'Fonte 03: albendazol 400 mg dose única + repetir (7 dias na fonte; diretriz: 14 dias) ou pamoato de pirvínio. Gestante: evitar albendazol — pamoato de pirvínio (compra) ou adiar.',
  },

  // ===================== CARDIOMETABÓLICO / VASCULAR =====================
  {
    id: 'dislipidemia', nome: 'Dislipidemia (início de estatina)', grupo: 'Cardiometabólico',
    cid: ['E78.5', 'Hiperlipidemia não especificada'],
    dif: [['E78.0', 'Hipercolesterolemia pura'], ['E78.1', 'Hipergliceridemia pura'], ['E03.9', 'Hipotireoidismo não especificado (causa secundária)']],
    s: { colesterol: 3, diabetico: 1, paAlta: 1, tabagismo: 1 },
    alarme: ['Triglicerídeos > 500 mg/dL → risco de pancreatite: dieta rigorosa, álcool zero, considerar fibrato', 'LDL ≥ 190 mg/dL → suspeitar hipercolesterolemia familiar (estatina de alta intensidade, rastrear familiares)', 'Dor muscular intensa/urina escura com estatina → suspender e dosar CK'],
    exUbs: ['Perfil lipídico (jejum não obrigatório)', 'TGO/TGP basal; CK só se sintomas musculares', 'TSH, glicemia/HbA1c, creatinina, urina tipo 1 (causas secundárias)', 'Estratificar o risco cardiovascular; perfil lipídico de controle em 6–12 semanas'],
    exPs: [],
    unid: [],
    casa: ['rosuvastatina10', { m: 'rosuvastatina20', opc: true, alt: 'Alto/muito alto risco ou LDL ≥ 190 (em vez da de 10 mg)' }, { m: 'sinvastatina40', opc: true, alt: 'Alternativa (Farmácia Popular)' }],
    orient: ['Dieta com menos gordura saturada/trans e açúcar; mais fibras, frutas e verduras', 'Atividade física ≥ 150 min/semana, perda de peso, parar de fumar, reduzir álcool', 'Uso contínuo: o colesterol volta a subir se parar'],
    obs: 'Fontes do pacote quase não abordam o tema (02 cita estatina só no IAM). Metas de LDL conforme risco (Diretriz SBC de dislipidemias vigente; referência: alto risco < 70, muito alto < 50 mg/dL). UBS Pedreira: rosuvastatina 10/20, pitavastatina 2, ezetimiba 10.',
  },
  {
    id: 'insufVenosa', nome: 'Insuficiência venosa crônica / Varizes', grupo: 'Cardiometabólico',
    cid: ['I87.2', 'Insuficiência venosa (crônica) (periférica)'],
    dif: [['I83.9', 'Varizes dos membros inferiores sem úlcera ou inflamação'], ['I80.2', 'Flebite e tromboflebite de outros vasos profundos dos membros inferiores (TVP)'], ['R60.0', 'Edema localizado']],
    s: { varizes: 3, edemaMMII: 2, dorMuscular: 1 },
    alarme: ['Edema unilateral súbito, doloroso, empastamento de panturrilha → TVP (Wells, Doppler)', 'Cordão endurecido, vermelho e doloroso sobre variz → tromboflebite superficial (Doppler se próximo à junção safeno-femoral)', 'Úlcera, eczema de estase, sangramento de variz → curativo/vascular'],
    exUbs: ['Diagnóstico clínico (classificação CEAP)', 'Doppler venoso se suspeita de TVP ou planejamento cirúrgico', 'Índice tornozelo-braquial antes de compressão se pulsos diminuídos'],
    exPs: [],
    unid: [],
    casa: ['meiaCompressiva', { m: 'diosminaHesperidina', opc: true, alt: 'Sintomas (dor, peso, cãibra, edema)' }],
    orient: ['Elevar as pernas 15–30 min, 3 a 4 vezes ao dia; evitar ficar muito tempo parado em pé ou sentado', 'Caminhar diariamente (bomba da panturrilha); controle do peso', 'Hidratar a pele das pernas; procurar a UBS se ferida, vermelhidão ou dor/inchaço súbito em uma perna'],
    obs: 'Fonte 03: meia de média compressão + flavonoide 500 mg 12/12 h. UBS Pedreira tem diosmina 900 + hesperidina 100 mg (1 cp/dia), castanha-da-índia e melilotus. Meia contraindicada se doença arterial periférica importante (ITB < 0,6–0,8).',
  },
];

// ---------------------------------------------------------------------
// BLOCO 2 — NOVOS MEDICAMENTOS — mesclar em window.MEDS
// (UBS Pedreira conferida em data/remume.js; "C" = não consta na UBS Pedreira)
// ---------------------------------------------------------------------
const NOVOS_MEDS = {
  // ---------- antifúngicos ----------
  miconazolPele: { n: 'Miconazol 20 mg/g — creme', q: '1 bisnaga', v: 'tópico', o: 'R', t: [],
    p: 'Após o banho e com a pele bem seca, aplicar fina camada nas lesões e 2 cm ao redor, 2 vezes ao dia, por 4 semanas (manter 1 a 2 semanas após o desaparecimento).',
    obs: 'UBS Pedreira tem miconazol 2% apenas como creme vaginal (mesma concentração do dermatológico) — confirmar com a farmácia se pode ser dispensado para uso na pele.' },
  cetoconazolCreme: { n: 'Cetoconazol 2% — creme', q: '1 bisnaga (30 g)', v: 'tópico', o: 'C', t: [],
    p: 'Aplicar fina camada nas lesões e ao redor, 1 a 2 vezes ao dia, por 2 a 4 semanas (manter 1 a 2 semanas após o desaparecimento).' },
  cetoconazolShampoo: { n: 'Cetoconazol 2% — xampu', q: '1 frasco', v: 'tópico', o: 'C', t: [],
    p: 'Aplicar no couro cabeludo/áreas afetadas, fazer espuma, deixar agir 5 minutos e enxaguar, 3 vezes por semana, por 4 semanas; depois, 1 vez por semana para prevenção.' },
  cetoconazolShampooPV: { n: 'Cetoconazol 2% — xampu', q: '1 frasco', v: 'tópico', o: 'C', t: [],
    p: 'Aplicar no corpo (pescoço, tronco e braços) durante o banho, deixar agir 5 minutos e enxaguar, 1 vez ao dia, por 5 dias. Prevenção: 1 vez por semana nos meses quentes.' },
  fluconazolTinea: { n: 'Fluconazol 150 mg', q: '4 cápsulas', v: 'oral', o: 'R', t: ['fluconazol'],
    p: 'Tomar 1 cápsula, por via oral, 1 vez por semana (sempre no mesmo dia), por 2 a 4 semanas.' },
  fluconazolPV: { n: 'Fluconazol 150 mg', q: '4 cápsulas', v: 'oral', o: 'R', t: ['fluconazol'],
    p: 'Tomar 2 cápsulas (300 mg), por via oral, 1 vez por semana, por 2 semanas. Fazer exercício/suar 1–2 h após a dose e só então tomar banho.' },
  fluconazolOnico: { n: 'Fluconazol 150 mg', q: '8 cápsulas (receita mensal)', v: 'oral', o: 'R', t: ['fluconazol'],
    p: 'Tomar 2 cápsulas (300 mg), por via oral, 1 vez por semana, por 6 meses (unhas das mãos) a 9–12 meses (unhas dos pés). Uso prolongado: controle de TGO/TGP.' },
  terbinafina: { n: 'Terbinafina 250 mg', q: '42 comprimidos (mãos) / 84 comprimidos (pés)', v: 'oral', o: 'C', t: ['terbinafina'],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia, por 6 semanas (unhas das mãos) ou 12 semanas (unhas dos pés). Dosar TGO/TGP antes do início.' },

  // ---------- pele (outros) ----------
  mupirocina: { n: 'Mupirocina 2% — pomada', q: '1 bisnaga (15 g)', v: 'tópico', o: 'C', t: [],
    p: 'Após limpeza com água e sabão, aplicar fina camada nas lesões, 3 vezes ao dia, por 5 a 7 dias.' },
  albendazolLarva: { n: 'Albendazol 400 mg', q: '3 comprimidos', v: 'oral', o: 'R', t: ['antiparasitario'],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia, por 3 dias.' },
  ivermectinaLarva: { n: 'Ivermectina 6 mg', q: 'conforme peso', v: 'oral', o: 'R', t: ['antiparasitario'],
    p: 'Tomar, em jejum, dose única de 200 mcg/kg (36–50 kg: 1½ cp | 51–65 kg: 2 cp | 66–79 kg: 2½ cp | ≥ 80 kg: 3 cp). Repetir em 7 dias se ainda houver lesão ativa.' },
  tiabendazolPomada: { n: 'Tiabendazol 50 mg/g — pomada', q: '1 bisnaga (45 g)', v: 'tópico', o: 'C', t: [],
    p: 'Aplicar sobre o trajeto da lesão, massageando, 3 vezes ao dia, por 5 a 7 dias.' },
  meiaCompressiva: { n: 'Meia elástica de compressão média (20–30 mmHg), 3/4 — 1 par', q: '1 par', v: 'tópico', o: 'C', t: [],
    p: 'Calçar pela manhã, ao acordar (antes de levantar da cama), e retirar ao deitar. Uso diário.' },

  // ---------- boca / olho / ouvido ----------
  triancinolonaOrabase: { n: 'Triancinolona acetonida 1 mg/g — pomada de uso oral (orabase)', q: '1 bisnaga', v: 'tópico', o: 'C', t: ['corticoide-cutaneo'],
    p: 'Secar a lesão com gaze e aplicar pequena quantidade sobre a afta, sem esfregar, 2 a 3 vezes ao dia, após as refeições e ao deitar, por até 7 dias.' },
  clorexidinaBochecho: { n: 'Digliconato de clorexidina 0,12% — solução bucal', q: '1 frasco', v: 'tópico', o: 'C', t: [],
    p: 'Fazer bochecho com 15 mL, sem diluir, por 30 segundos e cuspir, 2 vezes ao dia, após a escovação, por 7 dias. Não comer nem beber por 30 minutos após.' },
  tobraDexPomada: { n: 'Tobramicina 3 mg/g + Dexametasona 1 mg/g — pomada oftálmica', q: '1 bisnaga', v: 'oftálmico', o: 'C', t: ['corticoide-oftalmico'],
    p: 'Aplicar fina camada (cerca de 1 cm) na borda da pálpebra afetada, 3 vezes ao dia, por 5 a 7 dias.',
    obs: 'Corticoide ocular: não usar por mais de 7 dias sem oftalmologista; contraindicado se suspeita de herpes ocular.' },
  pomadaOftNoturna: { n: 'Pomada oftálmica lubrificante (ex.: acetato de retinol 10.000 UI/g)', q: '1 bisnaga', v: 'oftálmico', o: 'C', t: [],
    p: 'Aplicar no olho do lado paralisado ao deitar e ocluir a pálpebra com fita/curativo durante o sono.' },
  oleoOtologico: { n: 'Óleo mineral — uso otológico', q: '1 frasco', v: 'otológico', o: 'R', t: [],
    p: 'Amornar o frasco na mão e pingar 3 a 5 gotas no ouvido afetado, à noite, permanecendo deitado de lado por 5 minutos, por 3 a 5 dias. Depois, retornar para lavagem.',
    obs: 'UBS Pedreira: óleo mineral purificado 100% (mesmo frasco do uso oral). Não usar se perfuração timpânica, dor ou secreção.' },
  ceruminolitico: { n: 'Hidroxiquinolina 0,4 mg + Trolamina 140 mg/mL — gotas otológicas (Cerumin®)', q: '1 frasco', v: 'otológico', o: 'C', t: [],
    p: 'Pingar 5 gotas no ouvido afetado, permanecer deitado de lado por 5 minutos, a cada 8 horas, por 5 dias. Depois, retornar para lavagem.' },

  // ---------- neuro / sono ----------
  prednisonaBell: { n: 'Prednisona 20 mg', q: '23 comprimidos', v: 'oral', o: 'R', t: ['corticoide'],
    p: 'Tomar 3 comprimidos (60 mg), por via oral, pela manhã, por 5 dias. Depois reduzir: 2½ comprimidos no 6º dia, 2 no 7º, 1½ no 8º, 1 no 9º e ½ no 10º dia; então parar.' },
  aciclovirBell: { n: 'Aciclovir 200 mg', q: '100 comprimidos', v: 'oral', o: 'R', t: ['aciclovir'],
    p: 'Tomar 2 comprimidos (400 mg), por via oral, 5 vezes ao dia (7h, 11h, 15h, 19h, 23h), por 10 dias, junto com a prednisona.' },
  zolpidem: { n: 'Zolpidem 10 mg', q: '14 comprimidos', v: 'oral', o: 'R', t: ['sedativo', 'hipnotico'],
    p: 'Tomar ½ comprimido (5 mg), por via oral, imediatamente ao deitar, somente nas noites necessárias, por no máximo 4 semanas. Não tomar com álcool; reservar 7–8 h de sono.',
    obs: 'Notificação de Receita B (azul) para qualquer dose (Anvisa, 2024). Homens < 65 anos podem usar até 10 mg; mulheres e idosos: 5 mg.' },

  // ---------- gineco / uro ----------
  levonorgestrelCE: { n: 'Levonorgestrel 0,75 mg', q: '2 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 2 comprimidos (1,5 mg) juntos, por via oral, em dose única, o quanto antes (até 5 dias após a relação). Se vomitar em até 2 horas, repetir a dose.' },
  acoCombinado: { n: 'Etinilestradiol 0,03 mg + Levonorgestrel 0,15 mg', q: '3 cartelas', v: 'oral', o: 'R', t: ['estrogenio'],
    p: 'Tomar 1 comprimido por dia, sempre no mesmo horário, por 21 dias, começando no 1º dia da menstruação; pausa de 7 dias e iniciar nova cartela.',
    obs: 'Avaliar critérios de elegibilidade da OMS antes: PA, tabagismo ≥ 35 anos, enxaqueca com aura, TEV prévio, pós-parto/lactação.' },
  doxiciclinaDIP: { n: 'Doxiciclina 100 mg', q: '28 comprimidos', v: 'oral', o: 'R', t: ['tetraciclina', 'atb'],
    p: 'Tomar 1 comprimido, por via oral, a cada 12 horas, por 14 dias. Tomar com água, sem deitar logo após.' },
  metronidazolDIP: { n: 'Metronidazol 250 mg', q: '56 comprimidos', v: 'oral', o: 'R', t: ['metronidazol', 'atb'],
    p: 'Tomar 2 comprimidos (500 mg), por via oral, a cada 12 horas, por 14 dias. Não ingerir bebida alcoólica durante e até 48 h após.' },
  tansulosinaHPB: { n: 'Tansulosina 0,4 mg', q: '30 cápsulas', v: 'oral', o: 'R', t: ['alfabloq'],
    p: 'Tomar 1 cápsula, por via oral, 1 vez ao dia, sempre após a mesma refeição. Uso contínuo. Levantar devagar (tontura).' },
  finasterida: { n: 'Finasterida 5 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['5ari'],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia. Uso contínuo (efeito pleno em cerca de 6 meses).',
    obs: 'Reduz o PSA em ~50%. Gestantes não devem manipular comprimidos partidos.' },
  doxazosina: { n: 'Doxazosina 4 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['alfabloq'],
    p: 'Tomar ½ comprimido (2 mg), por via oral, ao deitar, por 14 dias; depois, 1 comprimido (4 mg) ao deitar. Uso contínuo. Risco de tontura/desmaio na primeira dose — tomar já deitado.' },
  ciprofloxacinoProstatite: { n: 'Ciprofloxacino 500 mg', q: '56 comprimidos', v: 'oral', o: 'R', t: ['quinolona', 'atb'],
    p: 'Tomar 1 comprimido, por via oral, a cada 12 horas, por 4 semanas (mínimo 2 semanas, conforme reavaliação). Não tomar junto com leite, antiácido ou ferro.' },

  // ---------- gastro ----------
  metronidazolDiverticulite: { n: 'Metronidazol 250 mg', q: '60 comprimidos', v: 'oral', o: 'R', t: ['metronidazol', 'atb'],
    p: 'Tomar 2 comprimidos (500 mg), por via oral, a cada 8 horas, por 7 a 10 dias. Não ingerir bebida alcoólica durante e até 48 h após.' },

  // ---------- cardiometabólico / vascular ----------
  rosuvastatina10: { n: 'Rosuvastatina 10 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['estatina'],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia (qualquer horário, sempre o mesmo). Uso contínuo.' },
  rosuvastatina20: { n: 'Rosuvastatina 20 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['estatina'],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia (qualquer horário, sempre o mesmo). Uso contínuo.' },
  sinvastatina40: { n: 'Sinvastatina 40 mg', q: '30 comprimidos', v: 'oral', o: 'FP', t: ['estatina'],
    p: 'Tomar 1 comprimido, por via oral, à noite. Uso contínuo.',
    obs: 'Interação: não associar a claritromicina, fluconazol/itraconazol em dose alta, anlodipino > 5 mg com sinvastatina > 20 mg (miopatia).' },
  diosminaHesperidina: { n: 'Diosmina 900 mg + Hesperidina 100 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia, de preferência no café da manhã, por 30 a 90 dias (reavaliar).' },
};

// ---------------------------------------------------------------------
// BLOCO 3 — NOVOS SINTOMAS — mesclar em window.SINTOMAS
// (sinônimos minúsculos sem acento; casam por início de palavra; negação é respeitada)
// Evitei termos ambíguos: "tinha" (= verbo), "prostata" isolado, "manchas brancas" sem "pele",
// "boca torta"/"desvio de rima" (já são do AVC — deficitFocal).
// ---------------------------------------------------------------------
const NOVOS_SINTOMAS = {
  micosePele: ['Micose/lesão anular', 'micose', 'impinge', 'tinea', 'lesao anular', 'lesoes anulares', 'lesao em anel', 'lesao circular', 'lesoes circulares', 'mancha em anel', 'rodinha na pele', 'coceira na virilha', 'micose na virilha', 'assadura na virilha'],
  frieira: ['Frieira/lesão entre os dedos dos pés', 'frieira', 'pe de atleta', 'entre os dedos do pe', 'entre os dedos dos pes', 'micose no pe', 'micose nos pes', 'rachadura entre os dedos', 'descamacao nos pes'],
  manchasHipocromicas: ['Manchas claras descamativas (pano branco)', 'pano branco', 'manchas brancas na pele', 'manchas claras na pele', 'manchas esbranquicadas', 'micose de praia', 'pitiriase versicolor', 'manchas que descamam'],
  unhaMicose: ['Unha espessada/amarelada', 'unha grossa', 'unhas grossas', 'unha amarelada', 'unhas amareladas', 'micose de unha', 'micose na unha', 'micose nas unhas', 'onicomicose', 'unha descolando', 'unha esfarelando', 'unha deformada'],
  unhaEncravada: ['Unha encravada/inflamação periungueal', 'unha encravada', 'unha encravou', 'encravou', 'unha inflamada', 'canto da unha', 'onicocript', 'paroniquia', 'unheiro', 'carne esponjosa'],
  caspa: ['Descamação seborreica/caspa', 'caspa', 'seborr', 'descamacao no couro cabeludo', 'couro cabeludo descamando', 'descamacao na sobrancelha', 'descamacao nas sobrancelhas', 'descamacao atras da orelha', 'vermelhidao ao lado do nariz'],
  foliculite: ['Pústulas foliculares', 'foliculite', 'pelo encravado', 'pelos encravados', 'espinhas na barba', 'bolinhas de pus', 'pustula', 'apos depilacao', 'apos depilar', 'apos raspar'],
  bichoGeografico: ['Lesão serpiginosa (bicho geográfico)', 'bicho geografico', 'bicho de praia', 'larva migrans', 'lesao serpiginosa', 'trajeto serpiginoso', 'lesao em trilha', 'lesao que anda', 'lesao que caminha'],
  aftaOral: ['Afta/úlcera oral', 'afta', 'ulcera na boca', 'ulcera oral', 'ulceras orais', 'ferida na boca', 'feridas na boca', 'feridinha na boca', 'machucado na boca', 'estomatite', 'ferida na lingua'],
  nodPalpebra: ['Nódulo/terçol na pálpebra', 'tercol', 'hordeolo', 'calazio', 'caroco na palpebra', 'bolinha na palpebra', 'nodulo na palpebra', 'palpebra inchada', 'inchaco na palpebra'],
  cerume: ['Cerume/rolha de cera', 'cerume', 'cera no ouvido', 'rolha de cera', 'tampao de cera', 'excesso de cera', 'ouvido entupido de cera', 'usa cotonete', 'usa haste flexivel'],
  paralisiaFacial: ['Paralisia facial', 'paralisia facial', 'paralisia de bell', 'nao fecha o olho', 'nao consegue fechar o olho', 'olho nao fecha', 'face paralisada', 'rosto paralisado', 'rosto torto', 'testa nao enruga'],
  colicaMenstrual: ['Cólica menstrual', 'colica menstrual', 'colicas menstruais', 'dismenorreia', 'dor menstrual', 'colica na menstruacao', 'colica quando menstrua', 'colica durante a menstruacao', 'dor quando menstrua'],
  falhaContraceptiva: ['Falha do método/pede contracepção de emergência', 'camisinha estourou', 'camisinha rompeu', 'camisinha furou', 'camisinha saiu', 'preservativo rompeu', 'preservativo estourou', 'esqueceu a pilula', 'esqueceu o anticoncepcional', 'esqueceu de tomar o anticoncepcional', 'pilula do dia seguinte', 'contracepcao de emergencia', 'anticoncepcao de emergencia'],
  dorPelvica: ['Dor pélvica/dispareunia', 'dor pelvica', 'dispareunia', 'dor na relacao', 'dor durante a relacao', 'dor ao ter relacao', 'dor a mobilizacao do colo', 'dor ao mobilizar o colo'],
  luts: ['Sintomas urinários obstrutivos (jato fraco, noctúria)', 'jato fraco', 'jato urinario fraco', 'jato fino', 'esvaziamento incompleto', 'nocturia', 'acorda para urinar', 'levanta para urinar', 'levanta a noite para urinar', 'gotejamento', 'demora para comecar a urinar', 'aumento da prostata', 'prostata aumentada', 'hiperplasia prostatica'],
  dorPerineal: ['Dor perineal/prostática', 'dor perineal', 'dor no perineo', 'dor na prostata', 'dor ao ejacular', 'dor entre o saco e o anus', 'prostata dolorosa'],
  dorFIE: ['Dor em fossa ilíaca esquerda', 'fossa iliaca esquerda', 'quadrante inferior esquerdo', 'lado esquerdo da barriga', 'lado esquerdo do abdome', 'diverticul'],
  pruridoAnal: ['Prurido anal (oxiúros?)', 'coceira no anus', 'coceira anal', 'coceira no bumbum', 'prurido anal', 'oxiur', 'enterobi', 'vermes brancos', 'bichinhos brancos', 'vermezinhos'],
  colesterol: ['Colesterol/triglicerídeos alterados', 'colesterol alto', 'colesterol elevado', 'ldl alto', 'ldl elevado', 'triglicerides alto', 'triglicerides elevado', 'triglicerideos alto', 'triglicerideos elevado', 'dislipidemia', 'gordura no sangue', 'hipercolesterolemia', 'hipertrigliceridemia'],
  varizes: ['Varizes/pernas pesadas', 'varizes', 'variz', 'veias dilatadas', 'vasinhos', 'pernas pesadas', 'peso nas pernas', 'pernas cansadas', 'cansaco nas pernas', 'insuficiencia venosa'],
};

// ---------------------------------------------------------------------
// BLOCO 4 — NOVAS REGRAS DE ALERTA — acrescentar em window.REGRAS
// [flag, tag, nível, mensagem]  (tags novas: estatina, terbinafina, hipnotico, estrogenio,
//  alfabloq [já existia na tansulosina, sem regra], corticoide-oftalmico, 5ari)
// ---------------------------------------------------------------------
const NOVAS_REGRAS = [
  ['gestante', 'estatina', 'alto', 'Estatina: contraindicada na gestação — suspender.'],
  ['lactante', 'estatina', 'alto', 'Estatina: evitar durante a amamentação.'],
  ['hepatopata', 'estatina', 'medio', 'Estatina: contraindicada se hepatopatia ativa/descompensada; dosar TGO/TGP.'],
  ['drc', 'estatina', 'baixo', 'Rosuvastatina com ClCr < 30: dose máxima 10 mg/dia.'],
  ['anticoagulado', 'estatina', 'baixo', 'Rosuvastatina/sinvastatina podem elevar o RNI com varfarina — controlar ao iniciar.'],
  ['hepatopata', 'terbinafina', 'alto', 'Terbinafina: contraindicada em hepatopatia (hepatotoxicidade).'],
  ['gestante', 'terbinafina', 'alto', 'Terbinafina: não tratar onicomicose na gestação — adiar.'],
  ['hepatopata', 'fluconazol', 'medio', 'Fluconazol em uso prolongado: hepatotoxicidade — monitorar TGO/TGP.'],
  ['idoso', 'alfabloq', 'medio', 'Alfabloqueador em idoso: hipotensão postural e quedas — tomar à noite e levantar devagar.'],
  ['has', 'alfabloq', 'baixo', 'Alfabloqueador soma efeito aos anti-hipertensivos (hipotensão postural).'],
  ['idoso', 'hipnotico', 'alto', 'Zolpidem em idoso (Beers): quedas, fraturas e delirium — evitar.'],
  ['hepatopata', 'hipnotico', 'alto', 'Zolpidem na hepatopatia grave: risco de encefalopatia — evitar.'],
  ['gestante', 'hipnotico', 'medio', 'Zolpidem na gestação: evitar (sobretudo no 3º trimestre).'],
  ['lactante', 'hipnotico', 'medio', 'Zolpidem na lactação: risco de sedação do lactente.'],
  ['has', 'estrogenio', 'alto', 'Anticoncepcional com estrogênio na HAS: OMS categoria 3 (controlada) a 4 (PA ≥ 160/100) — preferir progestagênio isolado/DIU.'],
  ['anticoagulado', 'estrogenio', 'alto', 'Estrogênio com TEV prévio/anticoagulação: contraindicado (OMS 4).'],
  ['hepatopata', 'estrogenio', 'alto', 'Estrogênio na hepatopatia/tumor hepático: contraindicado.'],
  ['lactante', 'estrogenio', 'alto', 'Estrogênio na lactação (< 6 meses pós-parto): evitar — preferir progestagênio isolado.'],
  ['gestante', 'estrogenio', 'alto', 'Paciente marcada como gestante: anticoncepcional não indicado.'],
  ['idoso', 'quinolona', 'medio', 'Quinolona em idoso: tendinopatia/ruptura de tendão, QT longo, confusão e hipoglicemia.'],
];

  const P = { remover: [] };
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
})();
