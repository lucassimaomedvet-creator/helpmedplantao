// Conteúdo incorporado do PDF "Prescrições" (combos de UBS/PS enviados pelo médico) — revisado.
// Só entrou o que o app ainda não tinha. Doses conferidas com bula/diretrizes (MS, SBC 2025, SBD, NICE).
// Correções em relação ao PDF (ver "obs" de cada item):
//  - "Cianocobalamina 5000 mg" → é mcg; e ampola não deve ser fracionada e guardada (uso único).
//  - Prednisona no combo de "vias aéreas superiores": não incluída no resfriado (sem benefício).
//  - Prednisolona colírio na conjuntivite: não incluída (sem lâmpada de fenda há risco de piorar ceratite herpética).
//  - Betabloqueador como 1ª linha na HAS: só com indicação específica (Diretriz Brasileira de HA 2025).
(function () {
const NOVOS_MEDS = {
  hexomedine: { n: 'Hexamidina 1 mg/mL + Tetracaína 1 mg/mL (Hexomedine® ou similar) — spray', q: '1 frasco', v: 'orofaríngeo', o: 'C', t: [],
    p: 'Aplicar 2 jatos na garganta a cada 6 horas, se dor de garganta, por até 5 dias.' },
  cromoglicato: { n: 'Cromoglicato dissódico 2% — colírio', q: '1 frasco', v: 'oftálmico', o: 'C', t: [],
    p: 'Instilar 1 gota em cada olho afetado, 4 a 6 vezes ao dia, enquanto durarem os sintomas.' },
  enemaFosfato: { n: 'Fosfato de sódio monobásico + dibásico — enema retal (adulto)', v: 'retal', o: 'U', t: ['enemaFosfato'],
    p: 'Aplicar 1 frasco por via retal, dose única.',
    obs: 'Evitar em DRC, insuficiência cardíaca, desidratação e idosos frágeis (risco de hiperfosfatemia).' },
  cetorolacoSL: { n: 'Cetorolaco de trometamol 10 mg — sublingual', q: '10 comprimidos', v: 'sublingual', o: 'C', t: ['aine'],
    p: 'Dissolver 1 comprimido embaixo da língua a cada 8 horas, se dor, por no máximo 5 dias.' },
  hidroxocobalamina: { n: 'Hidroxocobalamina 5.000 mcg — ampola IM', q: '4 ampolas', v: 'IM', o: 'C', t: [],
    p: 'Aplicar 1 ampola por via intramuscular 1 vez por semana, por 4 semanas; depois, 1 ampola por mês (manutenção conforme a causa).',
    obs: 'Alternativa (NICE): 1 mg IM 3x/semana por 2 semanas, depois 1 mg a cada 3 meses. Ampola é de uso único — não guardar sobra para a próxima dose.' },
  metilcobalamina: { n: 'Metilcobalamina 1.000 mcg', q: '30 comprimidos', v: 'oral', o: 'C', t: [],
    p: 'Tomar 1 a 2 comprimidos (1.000–2.000 mcg), por via oral, uma vez ao dia, por 3 meses e reavaliar.' },
  sacaratoFerrico: { n: 'Sacarato de hidróxido férrico 20 mg/mL — ampola 5 mL (100 mg de ferro)', v: 'EV', o: 'U', t: ['ferroEV'],
    p: 'Diluir 2 ampolas (200 mg) em 200 mL de SF 0,9% e infundir EV em no mínimo 30 minutos. Repetir 2 a 3 vezes por semana (intervalo ≥ 48 h) até completar o déficit calculado (Ganzoni).',
    obs: 'Máximo 200 mg por aplicação nesta diluição. Aplicar em local com recursos para anafilaxia; observar 30 min. Déficit: calculadora "Déficit de ferro (Ganzoni)".' },
  insulinaNPH: { n: 'Insulina humana NPH 100 UI/mL', q: '1 frasco', v: 'SC', o: 'R', t: ['insulina'],
    p: 'Aplicar 10 UI por via subcutânea às 22 horas. Medir a glicemia em jejum todos os dias e ajustar a cada 3 dias: acima de 130 mg/dL → aumentar 2 UI; 80 a 130 → manter; abaixo de 70 ou hipoglicemia de madrugada → diminuir 2 a 4 UI.' },
  seringasInsulina: { n: 'Seringa para insulina 100 UI com agulha', q: '60 unidades', v: 'material', o: 'FP', t: [],
    p: 'Usar para aplicação da insulina conforme orientação. Descartar em recipiente rígido.' },
  glibenclamida: { n: 'Glibenclamida 5 mg', q: '60 comprimidos', v: 'oral', o: 'FP', t: ['sulfonilureia'],
    p: 'Tomar 1 comprimido, por via oral, antes do café da manhã. Pode aumentar até 2 comprimidos 2 vezes ao dia (máximo 20 mg/dia). Uso contínuo.',
    obs: 'Maior risco de hipoglicemia que gliclazida — evitar em idosos e DRC.' },
  metformina500: { n: 'Metformina 500 mg', q: '120 comprimidos', v: 'oral', o: 'FP', t: ['metformina'],
    p: 'Tomar 1 comprimido após o almoço e 1 após o jantar por 7 dias; depois, 2 comprimidos após o almoço e 2 após o jantar (máximo 2.000 mg/dia). Uso contínuo.' },
  metforminaXR: { n: 'Metformina XR 500 mg (liberação prolongada)', q: '60 comprimidos', v: 'oral', o: 'FP', t: ['metformina'],
    p: 'Tomar 1 comprimido após o jantar por 7 dias; depois, 2 comprimidos após o jantar (máximo 2.000 mg/dia). Engolir inteiro. Uso contínuo.' },
  captoprilCont: { n: 'Captopril 25 mg', q: '90 comprimidos', v: 'oral', o: 'FP', t: ['ieca'],
    p: 'Tomar 1 a 2 comprimidos (25–50 mg), por via oral, 2 a 3 vezes ao dia, 1 hora antes das refeições. Uso contínuo.' },
  enalapril10: { n: 'Maleato de enalapril 10 mg', q: '60 comprimidos', v: 'oral', o: 'FP', t: ['ieca'],
    p: 'Tomar 1 comprimido, por via oral, pela manhã (pode subir para 1 comprimido de 12/12 h no retorno). Uso contínuo.' },
  propranolol40: { n: 'Propranolol 40 mg', q: '60 comprimidos', v: 'oral', o: 'FP', t: ['betabloqueador'],
    p: 'Tomar 1 comprimido, por via oral, a cada 12 horas. Uso contínuo. Não suspender de forma abrupta.' },
  atenolol50: { n: 'Atenolol 50 mg', q: '30 comprimidos', v: 'oral', o: 'FP', t: ['betabloqueador'],
    p: 'Tomar 1 comprimido, por via oral, pela manhã. Uso contínuo. Não suspender de forma abrupta.' },
  atorvastatina40: { n: 'Atorvastatina 40 mg', q: '30 comprimidos', v: 'oral', o: 'C', t: ['estatina'],
    p: 'Tomar 1 comprimido, por via oral, 1 vez ao dia (sempre no mesmo horário). Uso contínuo.' },
  fluoxetina20: { n: 'Fluoxetina 20 mg', q: '30 cápsulas', v: 'oral', o: 'R', t: ['isrs'],
    p: 'Tomar 1 cápsula, por via oral, pela manhã. Uso contínuo (ajustar no retorno; máximo 80 mg/dia).',
    obs: 'Receita de controle especial (2 vias).' },
  citalopram20: { n: 'Citalopram 20 mg', q: '30 comprimidos', v: 'oral', o: 'R', t: ['isrs'],
    p: 'Tomar ½ comprimido (10 mg), por via oral, pela manhã, por 7 dias; após, 1 comprimido pela manhã. Uso contínuo (máximo 40 mg/dia; 20 mg/dia se 60 anos ou mais).',
    obs: 'Receita de controle especial (2 vias). Prolonga QT — cuidado com outras drogas que aumentam QT.' },
  trazodona50: { n: 'Trazodona 50 mg', q: '30 comprimidos', v: 'oral', o: 'C', t: ['sedativo'],
    p: 'Tomar ½ a 1 comprimido (25–50 mg), por via oral, à noite, se insônia (pode aumentar até 100 mg).',
    obs: 'Receita de controle especial (2 vias). Hipotensão postural em idosos.' },
  duloxetina30: { n: 'Duloxetina 30 mg', q: '60 cápsulas', v: 'oral', o: 'R', t: ['irsn'],
    p: 'Tomar 1 cápsula (30 mg), por via oral, pela manhã, por 7 dias; após, 2 cápsulas (60 mg) pela manhã. Uso contínuo.',
    obs: 'Receita de controle especial (2 vias). Evitar se ClCr < 30 ou hepatopatia.' },
  pregabalina75: { n: 'Pregabalina 75 mg', q: '60 cápsulas', v: 'oral', o: 'R', t: ['gabapentinoide', 'sedativo'],
    p: 'Tomar 1 cápsula, por via oral, a cada 12 horas. Ajustar no retorno conforme resposta (150–600 mg/dia).',
    obs: 'Receita de controle especial (2 vias). Reduzir a dose se ClCr < 60 mL/min. Sonolência e tontura.' },
  nortriptilina25: { n: 'Nortriptilina 25 mg', q: '30 cápsulas', v: 'oral', o: 'R', t: ['anticolinergico', 'sedativo'],
    p: 'Tomar 1 cápsula (25 mg), por via oral, à noite. Aumentar conforme resposta (dor neuropática: 25–75 mg à noite).',
    obs: 'Receita de controle especial (2 vias). ECG se > 50 anos ou cardiopata.' },
  gabapentina300: { n: 'Gabapentina 300 mg', q: '90 cápsulas', v: 'oral', o: 'C', t: ['gabapentinoide', 'sedativo'],
    p: '1º dia: tomar 1 cápsula à noite. 2º dia: 1 cápsula a cada 12 horas. A partir do 3º dia: 1 cápsula a cada 8 horas. Uso contínuo.',
    obs: 'Receita de controle especial (2 vias). Ajustar dose na doença renal.' },
  vitD50mil: { n: 'Colecalciferol 50.000 UI', q: '8 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, 1 vez por semana, por 8 semanas (6 semanas se 25-OH-vitamina D entre 12 e 20 ng/mL), junto a uma refeição.' },
  vitD7mil: { n: 'Colecalciferol 7.000 UI', q: '4 comprimidos', v: 'oral', o: 'R', t: [],
    p: 'Tomar 1 comprimido, por via oral, 1 vez por semana, junto a uma refeição. Manutenção por 6 meses e reavaliar.' },
  medroxiVO10: { n: 'Acetato de medroxiprogesterona 10 mg', q: '42 comprimidos', v: 'oral', o: 'C', t: ['progestagenio', 'hormonal'],
    p: 'Tomar 2 comprimidos (20 mg), por via oral, 3 vezes ao dia, por 7 dias. Retornar para reavaliação.' },
};

const NOVOS_SINTOMAS = {
  b12Baixa: ['Vitamina B12 baixa', 'b12 baixa', 'vitamina b12 baixa', 'deficiencia de b12', 'deficiencia de vitamina b12', 'anemia megaloblastica', 'anemia perniciosa', 'gastrectomia', 'bariatrica'],
  vitDBaixa: ['Vitamina D baixa', 'vitamina d baixa', 'vit d baixa', 'deficiencia de vitamina d', 'hipovitaminose d', 'insuficiencia de vitamina d', '25-oh'],
  dorNeuropatica: ['Dor neuropática / crônica', 'dor neuropatica', 'dor cronica', 'neuropatia', 'queimacao nos pes', 'pes queimando', 'choque nas pernas', 'fibromialgia', 'nevralgia', 'neuralgia'],
  insulinizar: ['Diabetes sem controle (HbA1c alta)', 'glicada alta', 'hemoglobina glicada alta', 'hba1c alta', 'hba1c acima', 'diabetes descompensado', 'diabetes sem controle', 'iniciar insulina', 'insulinizar'],
  checkup: ['Check-up / rastreamento', 'check-up', 'checkup', 'check up', 'exames de rotina', 'exame de rotina', 'rastreamento', 'consulta de rotina', 'quer fazer exames'],
};

const NOVAS_CONDICOES = [
  {
    id: 'deficienciaB12', nome: 'Deficiência de vitamina B12', grupo: 'Cardiometabólico',
    cid: ['E53.8', 'Deficiência de outras vitaminas do grupo B'],
    dif: [['D51.0', 'Anemia por deficiência de B12 devida a deficiência de fator intrínseco (perniciosa)'], ['D51.9', 'Anemia por deficiência de vitamina B12 não especificada'], ['D52.9', 'Anemia por deficiência de folato'], ['E03.9', 'Hipotireoidismo']],
    s: { b12Baixa: 3, parestesiaMaos: 2, fadiga: 1, palidez: 1 },
    alarme: ['Sintomas neurológicos (formigamento, perda de equilíbrio, alteração de memória) → tratamento IM e não atrasar', 'Hb < 7 g/dL, dispneia ou dor torácica → PS', 'Pancitopenia ou blastos → hematologia'],
    exUbs: ['Hemograma (VCM), vitamina B12, ácido fólico, TSH, reticulócitos', 'Controle: hemograma em 8 semanas e B12 após 3 meses', 'Investigar a causa: metformina longa, IBP prolongado, bariátrica/gastrectomia, vegetarianos estritos, etilismo, gastrite atrófica'],
    exPs: [],
    unid: [],
    casa: [{ m: 'hidroxocobalamina', alt: 'B12 < 180 pg/mL ou sintomas neurológicos/anemia' }, { m: 'metilcobalamina', opc: true, alt: 'B12 180–350 pg/mL sem sintomas (via oral funciona mesmo sem fator intrínseco em dose alta)' }],
    orient: ['Fontes de B12: carnes, fígado, peixes (salmão, sardinha), frutos do mar, ovos e leite', 'Se a causa é irreversível (gastrectomia, anemia perniciosa, bariátrica), a reposição é para a vida toda', 'Formigamento pode demorar meses para melhorar'],
    obs: 'Fonte: PDF Prescrições. Corrigido: "cianocobalamina 5000 mg" → mcg. O PDF sugere fracionar 0,2 mL da ampola de 5 mg/mL; a ampola é de uso único, então a sobra não deve ser guardada. Manutenção vitalícia se a causa for irreversível.',
  },
  {
    id: 'hipovitaminoseD', nome: 'Deficiência / insuficiência de vitamina D', grupo: 'Cardiometabólico',
    cid: ['E55.9', 'Deficiência não especificada de vitamina D'],
    dif: [['M81.9', 'Osteoporose não especificada'], ['E21.3', 'Hiperparatireoidismo não especificado']],
    s: { vitDBaixa: 3, fadiga: 1, dorMuscular: 1 },
    alarme: ['Cálcio alto, cálculo renal ou doença granulomatosa → cuidado com reposição em dose alta', 'Fratura por fragilidade → investigar osteoporose (densitometria)'],
    exUbs: ['25-OH-vitamina D: dosar só em grupos de risco (idoso, osteoporose, má absorção, DRC, bariátrica, gestante, uso de anticonvulsivante/corticoide)', 'Cálcio, fósforo, creatinina; PTH se nível muito baixo', 'Repetir 25-OH-D em 2–3 meses após o ataque'],
    exPs: [],
    unid: [],
    casa: [{ m: 'vitD50mil', alt: '< 12 ng/mL: 8 semanas | 12–20 ng/mL: 6 semanas' }, { m: 'vitD7mil', alt: 'Manutenção após o ataque, ou 20–30 ng/mL (≈ 1.000 UI/dia)' }],
    orient: ['Tomar a vitamina D junto com uma refeição que tenha gordura (absorve melhor)', 'Exposição ao sol de 15 minutos por dia em braços e pernas, fora do horário de pico', 'Repetir o exame em 2 a 3 meses'],
    obs: 'Fonte: PDF Prescrições (50.000 UI/semana 8 sem se < 12; 6 sem se 12–20; manutenção 1.000 UI/dia ou equivalente semanal). UBS Pedreira tem colecalciferol 50.000 UI e 7.000 UI.',
  },
  {
    id: 'dorNeuropatica', nome: 'Dor crônica / Dor neuropática', grupo: 'Neurológico',
    cid: ['M79.2', 'Nevralgia e neurite não especificadas'],
    dif: [['E11.4', 'Diabetes tipo 2 com complicações neurológicas (polineuropatia)'], ['B02.2', 'Herpes zoster com outros comprometimentos do sistema nervoso (neuralgia pós-herpética)'], ['M79.7', 'Fibromialgia'], ['G56.0', 'Síndrome do túnel do carpo']],
    s: { dorNeuropatica: 3, parestesiaMaos: 2, dorQueimacaoPele: 1, diabetico: 1 },
    alarme: ['Fraqueza progressiva, perda de controle urinário/fecal ou anestesia em sela → urgência', 'Perda de peso, febre ou dor noturna que não melhora → investigar câncer/infecção', 'Ideação suicida em dor crônica → avaliar risco'],
    exUbs: ['Glicemia/HbA1c, B12, TSH, creatinina (ClCr para dose de gabapentinoide)', 'ECG antes de tricíclico se > 50 anos ou cardiopata', 'Escala de dor (0–10) e funcionalidade a cada retorno'],
    exPs: [],
    unid: [],
    casa: [{ m: 'amitriptilina', alt: 'Dor neuropática/fibromialgia — evitar em idosos (preferir nortriptilina)' }, { m: 'nortriptilina25', opc: true, alt: 'Idoso ou intolerância à amitriptilina' }, { m: 'duloxetina30', opc: true, alt: 'Neuropatia diabética, fibromialgia ou dor + depressão' }, { m: 'pregabalina75', opc: true, alt: 'Neuropatia diabética / pós-herpética (UBS Pedreira)' }, { m: 'gabapentina300', opc: true, alt: 'Alternativa à pregabalina (compra)' }],
    orient: ['Os remédios para dor neuropática demoram 2 a 4 semanas para fazer efeito — não parar antes', 'Podem dar sono e tontura no início: tomar à noite e não dirigir até saber como reage', 'Atividade física regular, sono e acompanhamento psicológico ajudam a controlar a dor'],
    obs: 'Fonte: PDF Prescrições. Doses: duloxetina 30 → 60 mg/dia; pregabalina 75 mg 2x/dia → 150–600 mg/dia (ajuste renal); amitriptilina 10–75 mg/noite e nortriptilina 25–75 mg/noite na dor neuropática; gabapentina 300 mg titulada até 8/8 h. Não associar tricíclico + duloxetina sem avaliação (síndrome serotoninérgica).',
  },
  {
    id: 'dm2Insulina', nome: 'DM2 — intensificação por HbA1c e início de insulina NPH', grupo: 'Cardiometabólico',
    cid: ['E11.9', 'Diabetes mellitus tipo 2 sem complicações'],
    dif: [['E11.6', 'Diabetes tipo 2 com outras complicações especificadas'], ['E10.9', 'Diabetes tipo 1 / LADA (magro, cetose, jovem)']],
    s: { insulinizar: 3, hiperglicemia: 2, diabetico: 2, poliuria: 1, polidipsia: 1, perdaPeso: 1 },
    alarme: ['Glicemia > 300 com cetonúria, vômitos ou desidratação → PS (CAD/EHH)', 'Hipoglicemia grave (< 54 mg/dL ou precisou de ajuda) → rever doses', 'Perda de peso importante + glicemia muito alta → considerar insulina já'],
    exUbs: ['HbA1c a cada 3 meses até a meta (< 7%; idoso frágil < 8%)', 'Creatinina/TFG, microalbuminúria, perfil lipídico, fundo de olho e exame dos pés anual'],
    exPs: [],
    unid: [],
    casa: [{ m: 'metformina500', alt: 'HbA1c ≤ 7,5%: monoterapia | 7,5–9%: metformina + 2º fármaco' }, { m: 'metforminaXR', opc: true, alt: 'Intolerância gastrointestinal à metformina comum' }, { m: 'gliclazida', opc: true, alt: '2º fármaco (preferir no idoso/DRC)' }, { m: 'glibenclamida', opc: true, alt: '2º fármaco (Farmácia Popular) — mais hipoglicemia' }, { m: 'insulinaNPH', opc: true, alt: 'HbA1c > 9% ou glicemia > 300 sintomático, ou falha de 2 orais' }, { m: 'seringasInsulina', opc: true, alt: 'Junto com a insulina' }],
    orient: ['Medir a glicemia em jejum todos os dias e anotar — a dose da insulina é ajustada a cada 3 dias por esses valores', 'Hipoglicemia (tremor, suor, confusão): tomar 1 colher de sopa de açúcar em água e medir de novo em 15 minutos', 'Guardar a insulina na geladeira (porta ou gaveta, nunca no congelador); o frasco em uso dura 28 dias fora da geladeira'],
    obs: 'Fonte: PDF Prescrições + SBD. HbA1c até 7,5%: metformina. 7,5–9%: metformina + sulfonilureia (ou outro). > 9% assintomático: 2 orais e encaminhar/insulinizar; sintomático ou > 300: insulina NPH 10 UI (ou 0,1–0,2 UI/kg) às 22 h. Titulação: jejum > 130 ↑2 UI; 80–130 mantém; < 70 ↓2–4 UI. Troca NPH → glargina: NPH 1x/dia = mesma dose; NPH 2x/dia ou mais = 80% da dose total diária, 1x/dia em horário fixo. Esquema plena (0,5 UI/kg/dia, 2/3 manhã e 1/3 noite) só com acompanhamento próximo.',
  },
  {
    id: 'rastreamento', nome: 'Check-up / Rastreamento do adulto (MS)', grupo: 'Cardiometabólico',
    cid: ['Z00.0', 'Exame médico geral'],
    dif: [['Z12.4', 'Exame especial de rastreamento de neoplasia do colo do útero'], ['Z12.3', 'Exame especial de rastreamento de neoplasia de mama'], ['Z13.1', 'Exame especial de rastreamento de diabetes mellitus']],
    s: { checkup: 3, colesterol: 1 },
    alarme: ['Sintomas (sangue nas fezes, nódulo na mama, sangramento pós-menopausa) não são rastreamento → investigação diagnóstica'],
    exUbs: [
      'PA: todo adulto ≥ 18 anos, em toda consulta (formalmente 1x/ano)',
      'Perfil lipídico: homens ≥ 35 e mulheres ≥ 45 anos (antes se fator de risco), a cada 5 anos se normal',
      'Glicemia/HbA1c: todos ≥ 35 anos; < 35 se sobrepeso/obesidade + 1 fator de risco',
      'Colo do útero (MS 2024): 25–64 anos → DNA-HPV oncogênico a cada 5 anos se negativo (onde ainda é citologia: 2 anuais negativas → a cada 3 anos)',
      'Mama: mulheres 50–74 anos → mamografia a cada 2 anos',
      'Colorretal: 50–75 anos assintomáticos → teste imunoquímico fecal (FIT) a cada 2 anos; positivo → colonoscopia (incorporado ao SUS em ago/2026, implantação nos municípios em até 180 dias)',
      'Osteoporose: densitometria em mulheres ≥ 65 e homens ≥ 70 anos, ou antes se fator de risco (baixo peso, fratura por fragilidade, corticoide)',
      'TSH a partir de 35 anos a cada 5 anos (conforme referência; rastreio universal é controverso)',
      'Sorologias HIV, sífilis, hepatites B e C ao menos 1 vez na vida (e se exposição)',
    ],
    exPs: [],
    unid: [],
    casa: [],
    orient: ['Atividade física 150 minutos por semana, alimentação com pouco sal, açúcar e ultraprocessados', 'Não fumar e reduzir bebida alcoólica', 'Conferir a carteira de vacinação (influenza, dT, hepatite B, e as indicadas pela idade)'],
    obs: 'Fonte: PDF Prescrições (rastreios). FIT confirmado: portaria publicada no DOU em 10/08/2026 (rastreamento bienal 50–75 anos assintomáticos; não usar para diagnóstico de sintomáticos). Conferir com a Secretaria se Pedreira já recebeu os testes.',
  },
];

// itens extras em condições que já existem (sem substituir o que está lá)
const EXTRAS = {
  ivas: { casa: ['?hexomedine'], obs: 'PDF Prescrições: prednisona no combo de vias aéreas superiores não foi incluída — corticoide não tem benefício no resfriado comum.' },
  osteomuscular: { casa: ['?cetorolacoSL'] },
  lombalgia: { casa: ['?cetorolacoSL'] },
  conjAlerg: { casa: [{ m: 'cromoglicato', opc: true, alt: 'Coceira importante (compra)' }] },
  conjBact: { obs: 'PDF Prescrições cita prednisolona colírio: não incluída — corticoide ocular sem avaliação em lâmpada de fenda pode agravar ceratite herpética e úlcera de córnea. Atenção a glaucoma agudo (dor + baixa visual).' },
  constipacao: { unid: [{ m: 'enemaFosfato', opc: true, alt: 'Fecaloma/impactação, sem DRC ou ICC' }] },
  has: {
    casa: [{ m: 'enalapril10', opc: true, alt: 'IECA (DM, DRC com albuminúria, obesos) — não associar a losartana' }, { m: 'captoprilCont', opc: true, alt: 'IECA alternativo (2–3x/dia)' }, { m: 'nifedipinoRetard', opc: true, alt: 'BCC alternativo ao anlodipino' }, { m: 'propranolol40', opc: true, alt: 'Só com indicação: taquicardia, enxaqueca, tremor essencial' }, { m: 'atenolol50', opc: true, alt: 'Só com indicação: pós-IAM, angina, controle de FC' }],
    obs: 'Escolha inicial (PDF Prescrições + Diretriz Brasileira de HA 2025): negros/idosos → BCC (anlodipino) ± tiazídico; DM, DRC com albuminúria ou obesos → IECA ou BRA; demais → IECA/BRA + BCC ou tiazídico. Nunca IECA + BRA juntos. Betabloqueador não é 1ª linha sem indicação específica.',
  },
  dislipidemia: {
    casa: [{ m: 'atorvastatina40', opc: true, alt: 'Alta intensidade (compra)' }],
    obs: 'Intensidade das estatinas — moderada (redução 30–49% do LDL): rosuvastatina 5–10, atorvastatina 10–20, sinvastatina 20–40 mg. Alta (≥ 50%): rosuvastatina 20–40, atorvastatina 40–80 mg (sinvastatina não atinge). Metas de LDL: risco baixo < 115 | intermediário < 100 | alto < 70 | muito alto < 50 | extremo < 40 mg/dL.',
  },
  dm2: {
    casa: [{ m: 'glibenclamida', opc: true, alt: '2º fármaco (Farmácia Popular)' }, { m: 'metforminaXR', opc: true, alt: 'Intolerância GI à metformina' }],
    obs: 'HbA1c > 9% ou insulina: ver "DM2 — intensificação por HbA1c e início de insulina NPH".',
  },
  anemia: { unid: [{ m: 'sacaratoFerrico', opc: true, alt: 'Intolerância/falha do ferro oral ou má absorção — calcular déficit (Ganzoni)' }] },
  sua: { casa: [{ m: 'medroxiVO10', opc: true, alt: 'Sangramento agudo com contraindicação a estrogênio' }], obs: 'Sangramento agudo sem contraindicação a estrogênio (PDF Prescrições): etinilestradiol 30 mcg + levonorgestrel 150 mcg 1 cp 3x/dia por 7 dias, depois 1 cp/dia.' },
  depressao: {
    casa: [{ m: 'fluoxetina20', opc: true, alt: 'Alternativa (UBS Pedreira) — mais insônia/ansiedade no início' }, { m: 'citalopram20', opc: true, alt: 'Alternativa (UBS Pedreira) — menos interações; máx. 20 mg se ≥ 60 anos' }],
    obs: 'Doses (PDF Prescrições): sertralina 50–200 | fluoxetina 20–80 | citalopram 20–40 (20 se ≥ 60) | paroxetina 20–60 mg/dia (mais efeito sexual e ganho de peso). Trazodona 25–100 mg para insônia; 150–400 mg para depressão.',
  },
  insonia: { casa: [{ m: 'trazodona50', opc: true, alt: 'Insônia com ansiedade/depressão ou idoso (compra)' }] },
};

const FRASES_NOVAS = [
  ['Rastreamento do adulto (MS)', 'Rastreamento conforme MS: PA anual (≥ 18 a); perfil lipídico (H ≥ 35, M ≥ 45 a, a cada 5 a); glicemia ≥ 35 a; DNA-HPV 25–64 a a cada 5 a; mamografia 50–74 a bienal; FIT 50–75 a bienal; densitometria M ≥ 65 / H ≥ 70 a. Solicitados os exames pertinentes à idade.'],
  ['Ajuste de insulina NPH (jejum)', 'Orientado ajuste da NPH a cada 3 dias pela glicemia de jejum: > 130 mg/dL aumentar 2 UI; 80–130 manter; < 70 ou hipoglicemia noturna reduzir 2–4 UI.'],
  ['Troca NPH → glargina', 'Conversão NPH → glargina: NPH 1x/dia → mesma dose; NPH 2x/dia ou mais → 80% da dose total diária de NPH, 1x/dia em horário fixo.'],
  ['Escala de insulina regular SC', 'Insulina regular SC conforme glicemia capilar: 181–200: 2 UI | 201–250: 4 UI | 251–300: 6 UI | 301–350: 8 UI | 351–400: 10 UI | > 400: 12 UI e avisar o médico (descartar CAD/EHH). Escala isolada não substitui insulina basal.'],
  ['Hipoglicemia grave (< 54 mg/dL)', 'Hipoglicemia grave: glicose 50% 40 mL EV em bolus + SG 5% 100 mL/h EV até estabilidade clínica; glicemia capilar a cada 15 min até > 70 e depois 1/1 h.'],
  ['Equivalência de corticoides', 'Doses equivalentes (potência anti-inflamatória): hidrocortisona 20 mg = cortisona 25 = prednisona 5 = prednisolona 5 = metilprednisolona 4 = dexametasona 0,75 = betametasona 0,6 mg. Dexa/beta: ação longa (36–54 h), sem efeito mineralocorticoide.'],
  ['Potência de corticoide tópico', 'Corticoide tópico — superalta (I): clobetasol 0,05%; alta (II): betametasona dipropionato 0,05% pomada, fluocinonida 0,05%; média (IV): mometasona 0,1% creme; baixa (VII): hidrocortisona 1–2,5% (face, dobras, crianças).'],
  ['Ferro EV — déficit (Ganzoni)', 'Déficit de ferro (Ganzoni) = peso (kg) × (Hb alvo − Hb atual) × 2,4 + 500 mg. Sacarato férrico 200 mg (2 ampolas) em 200 mL SF 0,9% EV em ≥ 30 min, 2–3x/semana (intervalo ≥ 48 h) até completar a dose.'],
];

const NOVAS_REGRAS = [
  ['drc', 'gabapentinoide', 'medio', 'DRC: reduzir a dose de pregabalina/gabapentina conforme o ClCr (acúmulo → sonolência, queda).'],
  ['idoso', 'gabapentinoide', 'medio', 'Idoso: iniciar pregabalina/gabapentina em dose baixa — tontura e risco de queda.'],
  ['drc', 'enemaFosfato', 'alto', 'DRC: enema de fosfato contraindicado (hiperfosfatemia grave). Preferir enema de glicerina/SF.'],
  ['idoso', 'enemaFosfato', 'medio', 'Idoso frágil/desidratado: risco de hiperfosfatemia com enema de fosfato — preferir glicerina.'],
  ['drc', 'ferroEV', 'medio', 'DRC: ferro EV é adequado, mas confirmar ferritina/saturação e evitar em infecção ativa.'],
];

const P = { NOVOS_MEDS, NOVOS_SINTOMAS, NOVAS_CONDICOES, NOVAS_REGRAS };
window.mesclarPacote(P);
for (const [id, ex] of Object.entries(EXTRAS)) {
  const c = window.CONDICOES.find((x) => x.id === id); if (!c) continue;
  for (const campo of ['casa', 'unid']) if (ex[campo]) {
    const chave = (it) => { if (typeof it !== 'string') return it.m; const r = it.replace(/^\?/, ''); try { return r.startsWith('{') ? JSON.parse(r).m : r; } catch { return r; } };
    const ja = new Set((c[campo] || []).map(chave));
    c[campo] = (c[campo] || []).concat(ex[campo].filter((it) => !ja.has(chave(it))));
  }
  if (ex.obs && !(c.obs || '').includes(ex.obs)) c.obs = (c.obs ? c.obs + ' ' : '') + ex.obs;
}
window.FRASES.extras = (window.FRASES.extras || []).concat(FRASES_NOVAS);
})();
