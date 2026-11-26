// Modelos de anamnese por queixa (aba Frases prontas). "___" = lacuna para preencher.
// Cada modelo traz os positivos típicos e as negativas pertinentes (sinais de alarme) da queixa.
// Apague o que não se aplica antes de colar no prontuário.
window.ANAMNESES = [
  // ---------- estrutura geral ----------
  { g: 'Geral', t: 'Estrutura completa (qualquer queixa)',
    txt: `QP: ___ há ___ dias.
HDA: Paciente refere ___ há ___ dias, de início (súbito/insidioso) ___, localizado em ___, de caráter ___, intensidade ___/10, (contínuo/intermitente) ___. Fatores de melhora: ___. Fatores de piora: ___. Sintomas associados: ___. Fez uso de ___ com (melhora/sem melhora) ___.
Nega ___.
ISDA: sem outras queixas.
Antecedentes: Comorbidades: ___. Medicações em uso: ___. Alergias: ___. Cirurgias/internações: ___. Hábitos: tabagismo ___, etilismo ___. Vacinas: ___.` },
  { g: 'Geral', t: 'Retorno com exames',
    txt: `QP: Retorno para avaliação de exames.
HDA: Paciente retorna trazendo exames solicitados em ___ (resultados abaixo). Refere ___ desde a última consulta. Em uso de ___, com boa adesão e tolerância (nega efeitos colaterais).
Nega novas queixas.
Exames (__/__/____): ___.` },
  { g: 'Geral', t: 'Renovação de receita (uso contínuo)',
    txt: `QP: Renovação de receita.
HDA: Paciente em acompanhamento de ___ há ___ anos, em uso de ___. Refere boa adesão e tolerância, sem efeitos colaterais. Assintomático no momento.
Nega dor torácica, dispneia, edema, hipoglicemias, internações ou idas ao PS desde a última consulta.
Último controle: ___.` },

  // ---------- respiratório / ORL ----------
  { g: 'Respiratório / ORL', t: 'IVAS / resfriado',
    txt: `QP: Coriza e tosse há ___ dias.
HDA: Paciente refere coriza (hialina/amarelada) ___, obstrução nasal e tosse (seca/produtiva) ___ há ___ dias. Refere ___ (dor de garganta/espirros/mialgia/febre aferida de ___ °C).
Nega dispneia, dor torácica, sibilância, otalgia, dor facial, vômitos e prostração.
Contactantes com sintomas semelhantes: ___.` },
  { g: 'Respiratório / ORL', t: 'Dor de garganta',
    txt: `QP: Dor de garganta há ___ dias.
HDA: Paciente refere odinofagia há ___ dias, (com/sem) febre ___ °C, associada a ___. Refere (presença/ausência) de tosse e coriza.
Nega dispneia, sialorreia, trismo, voz abafada (de "batata quente"), dificuldade para engolir saliva e manchas na pele.` },
  { g: 'Respiratório / ORL', t: 'Sinusite',
    txt: `QP: Dor na face e secreção nasal há ___ dias.
HDA: Paciente refere obstrução nasal e rinorreia (purulenta) ___ há ___ dias, associada a dor/pressão em região ___ que piora ao abaixar a cabeça. Refere ___ (febre ___ °C/hiposmia/tosse). Evolução (piora após melhora inicial — bifásica) ___.
Nega edema ou vermelhidão ao redor dos olhos, alteração visual, cefaleia intensa, rigidez de nuca e confusão.` },
  { g: 'Respiratório / ORL', t: 'Otalgia',
    txt: `QP: Dor de ouvido (direito/esquerdo) há ___ dias.
HDA: Paciente refere otalgia ___ há ___ dias, associada a ___ (febre/hipoacusia/plenitude auricular/otorreia). Refere ___ (IVAS prévia/entrada de água no ouvido/uso de cotonete).
Nega vertigem, zumbido, paralisia facial e dor/edema atrás da orelha.` },
  { g: 'Respiratório / ORL', t: 'Tosse / dispneia / crise de asma',
    txt: `QP: Falta de ar há ___ (horas/dias).
HDA: Paciente refere dispneia (aos esforços/em repouso) ___ há ___, associada a sibilância e tosse (seca/produtiva) ___. Fator desencadeante: ___. Fez uso de ___ (bombinha ___ vezes) com ___. Diagnóstico prévio de ___ (asma/DPOC), crises anteriores ___, internações/IOT prévias ___.
Nega dor torácica, febre, hemoptise, edema de membros, ortopneia e dor/inchaço na panturrilha.` },

  // ---------- gastrointestinal ----------
  { g: 'Gastrointestinal', t: 'Diarreia / GECA',
    txt: `QP: Diarreia há ___ dias.
HDA: Paciente refere ___ episódios/dia de evacuações (líquidas/pastosas) há ___ dias, associadas a ___ (cólica abdominal/náuseas/___ episódios de vômitos/febre ___ °C). Refere ___ (ingestão de alimento suspeito/contactantes com sintomas). Aceitando líquidos (sim/não) ___. Diurese ___.
Nega sangue ou muco nas fezes, sinais de desidratação (sede intensa, boca seca, urina escassa), tontura ao levantar e dor abdominal intensa ou contínua.` },
  { g: 'Gastrointestinal', t: 'Dor abdominal',
    txt: `QP: Dor abdominal há ___ (horas/dias).
HDA: Paciente refere dor em ___ (epigástrio/hipocôndrio D/FID/difusa), de início (súbito/insidioso) há ___, caráter (cólica/queimação/pontada) ___, intensidade ___/10, (com/sem) irradiação para ___. Associada a ___ (náuseas/vômitos/hiporexia/febre). Hábito intestinal ___; última evacuação ___. DUM ___.
Nega hematêmese, melena, sangue nas fezes, icterícia, distensão abdominal, parada de eliminação de gases e fezes, disúria e febre.` },
  { g: 'Gastrointestinal', t: 'Epigastralgia / dispepsia',
    txt: `QP: Queimação no estômago há ___.
HDA: Paciente refere epigastralgia em queimação ___ há ___, que (piora/melhora) com a alimentação, associada a ___ (pirose/plenitude pós-prandial/eructação/náuseas). Uso de AINE: ___. Etilismo: ___.
Nega disfagia, odinofagia, vômitos persistentes, hematêmese, melena, perda de peso não intencional e anemia conhecida.` },

  // ---------- urinário / gineco ----------
  { g: 'Urinário / Gineco', t: 'ITU / disúria',
    txt: `QP: Ardência ao urinar há ___ dias.
HDA: Paciente refere disúria e polaciúria há ___ dias, associadas a ___ (urgência miccional/dor suprapúbica/urina turva/hematúria). DUM ___; (nega/possível) gestação.
Nega febre, calafrios, dor lombar ou em flancos, náuseas, vômitos, corrimento vaginal e prurido vulvar.
Episódios prévios de ITU no último ano: ___.` },
  { g: 'Urinário / Gineco', t: 'Corrimento vaginal',
    txt: `QP: Corrimento vaginal há ___ dias.
HDA: Paciente refere corrimento (branco grumoso/acinzentado com odor/amarelo-esverdeado) ___ há ___ dias, associado a ___ (prurido vulvar/ardor/odor fétido/dispareunia). Parceria sexual ___, uso de preservativo ___. DUM ___. Método contraceptivo: ___.
Nega febre, dor pélvica, sangramento fora do período menstrual, dor à relação profunda e lesões/úlceras genitais.` },
  { g: 'Urinário / Gineco', t: 'Cólica renal',
    txt: `QP: Dor lombar (direita/esquerda) há ___ horas.
HDA: Paciente refere dor em flanco/lombar ___ de início súbito há ___, em cólica, intensidade ___/10, com irradiação para ___ (FIE/região inguinal/genitália), associada a ___ (náuseas/vômitos/hematúria/disúria). Episódios prévios de litíase: ___.
Nega febre, calafrios, anúria e rim único.` },

  // ---------- neuro / musculoesquelético ----------
  { g: 'Neuro / Músculo', t: 'Cefaleia',
    txt: `QP: Dor de cabeça há ___.
HDA: Paciente refere cefaleia (frontal/holocraniana/hemicraniana ___) há ___, de caráter (em aperto/pulsátil) ___, intensidade ___/10, associada a ___ (fotofobia/fonofobia/náuseas). Padrão semelhante a crises prévias (sim/não) ___. Fez uso de ___ com ___.
Nega início súbito ("pior dor da vida"), febre, rigidez de nuca, déficit motor ou sensitivo, alteração visual, convulsão, confusão, trauma recente e piora progressiva ou que acorda à noite.` },
  { g: 'Neuro / Músculo', t: 'Lombalgia',
    txt: `QP: Dor lombar há ___ dias.
HDA: Paciente refere dor em região lombar ___ há ___ dias, iniciada após ___ (esforço/sem fator desencadeante), que piora com ___ e melhora com ___, (com/sem) irradiação para ___ (membro inferior até o joelho/pé). Fez uso de ___.
Nega perda de força nas pernas, dormência em região genital/perianal (sela), retenção ou incontinência urinária/fecal, febre, perda de peso, história de câncer e trauma importante.` },
  { g: 'Neuro / Músculo', t: 'Entorse / trauma de membro',
    txt: `QP: Dor em ___ após trauma há ___.
HDA: Paciente refere ___ (entorse/queda/contusão) em ___ há ___, com dor ___/10 e edema local. Mecanismo: ___. Consegue apoiar/deambular (sim/não) ___.
Nega deformidade, ferida aberta, perda de sensibilidade ou de força distal, palidez/frieza do membro e trauma em outras regiões.` },
  { g: 'Neuro / Músculo', t: 'Tontura / vertigem',
    txt: `QP: Tontura há ___.
HDA: Paciente refere tontura (rotatória/sensação de desmaio/desequilíbrio) ___ há ___, com crises de ___ (segundos/minutos/horas), desencadeadas por ___ (mudança de posição da cabeça), associadas a ___ (náuseas/vômitos/zumbido/hipoacusia).
Nega cefaleia súbita, diplopia, disartria, disfagia, déficit motor ou sensitivo, dificuldade para andar, dor torácica, palpitação e síncope.` },

  // ---------- cardiovascular / urgência ----------
  { g: 'Cardiovascular / Urgência', t: 'Dor torácica',
    txt: `QP: Dor no peito há ___.
HDA: Paciente refere dor torácica (retroesternal/ventilatório-dependente/localizada) ___ há ___, de início (súbito/progressivo), caráter (aperto/queimação/pontada) ___, intensidade ___/10, duração ___, com irradiação para ___, desencadeada por ___ e aliviada por ___. Associada a ___ (dispneia/sudorese/náuseas/palpitação).
Fatores de risco: HAS ___, DM ___, dislipidemia ___, tabagismo ___, história familiar ___.
Nega síncope, dor que piora com a palpação, febre, tosse, dor/inchaço na panturrilha, imobilização ou cirurgia recente e uso de cocaína.` },
  { g: 'Cardiovascular / Urgência', t: 'Pico pressórico',
    txt: `QP: Pressão alta aferida (___ mmHg).
HDA: Paciente refere PA de ___ mmHg aferida em ___. Hipertenso há ___ anos, em uso de ___; adesão ___ (última dose ___). Refere ___ (cefaleia leve/assintomático). Situação desencadeante: ___ (dor/ansiedade/esquecimento da medicação/uso de AINE ou descongestionante).
Nega dor torácica, dispneia, déficit motor ou sensitivo, alteração da fala, confusão, alteração visual, cefaleia súbita intensa e diminuição da diurese.` },
  { g: 'Cardiovascular / Urgência', t: 'Febre (adulto)',
    txt: `QP: Febre há ___ dias.
HDA: Paciente refere febre aferida de até ___ °C há ___ dias, ___ picos/dia, associada a ___ (calafrios/mialgia/cefaleia/dor retro-orbitária/manchas na pele). Foco referido: ___. Viagem/área de dengue ou contato com doente: ___.
Nega dispneia, rigidez de nuca, confusão, petéquias ou sangramentos, dor abdominal intensa, vômitos persistentes, tontura ao levantar e diminuição da diurese.` },

  // ---------- pele / olho ----------
  { g: 'Pele / Olho', t: 'Lesão de pele / alergia',
    txt: `QP: Manchas/coceira na pele há ___ dias.
HDA: Paciente refere lesões (avermelhadas/placas elevadas/vesículas) ___ em ___ há ___ dias, (pruriginosas/dolorosas) ___, com evolução ___. Possível desencadeante: ___ (alimento/medicação nova/picada/contato com produto). Contactantes com lesões semelhantes ___.
Nega inchaço de lábios, língua ou olhos, dificuldade para respirar ou engolir, rouquidão, tontura, febre e lesões em mucosas.` },
  { g: 'Pele / Olho', t: 'Olho vermelho',
    txt: `QP: Olho (direito/esquerdo/ambos) vermelho há ___ dias.
HDA: Paciente refere hiperemia ocular ___ há ___ dias, associada a ___ (secreção purulenta/lacrimejamento/prurido/sensação de areia). Contactantes com sintomas: ___. Uso de lente de contato: ___.
Nega baixa da acuidade visual, dor ocular intensa, fotofobia importante, halos ao redor das luzes, trauma ocular e corpo estranho.` },

  // ---------- saúde mental ----------
  { g: 'Saúde mental', t: 'Ansiedade / humor',
    txt: `QP: ___ (ansiedade/tristeza/insônia) há ___.
HDA: Paciente refere ___ há ___ (semanas/meses), associado a ___ (preocupação excessiva/anedonia/alteração do sono/apetite/irritabilidade/crises de falta de ar e palpitação). Fatores desencadeantes: ___. Prejuízo em trabalho/relações: ___. Tratamentos prévios: ___. Uso de álcool/substâncias: ___. Rede de apoio: ___.
Nega ideação suicida, planos ou tentativas prévias e alucinações.` },

  // ---------- pediatria ----------
  { g: 'Pediatria', t: 'Febre na criança',
    txt: `QP: Febre há ___ dias (informante: ___).
HDA: Mãe refere febre aferida de até ___ °C há ___ dias, ___ picos/dia, com boa resposta ao antitérmico (___). Associada a ___ (tosse/coriza/vômitos/diarreia/otalgia). Aceitação alimentar ___; diurese ___ (fraldas/dia). Brinca e interage entre os picos (sim/não) ___. Vacinas em dia (conferido na caderneta) ___.
Nega gemência, dificuldade para respirar, sonolência excessiva ou irritabilidade inconsolável, manchas na pele que não somem à pressão, convulsão, vômitos persistentes e recusa total de líquidos.` },
];
