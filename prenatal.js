// Aba Pré-natal (baixo risco, APS): IG/DPP, roteiro da consulta pela IG, exames, vacinas,
// suplementação, risco de pré-eclâmpsia, alertas, evolução pronta e orientações para a gestante.
// Referências: MS (Cadernos AB 32, Rede Alyne — Portaria 5.350/2024, NT 251/2024 cálcio),
// Calendário Nacional de Vacinação da Gestante 2026, FEBRASGO, IOM (ganho de peso).
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const PR = () => window.PR;
  const esc = (t) => PR().esc(String(t));
  const num = (v) => { const n = parseFloat(String(v || '').replace(',', '.')); return isNaN(n) ? null : n; };
  const fmt = (n, d = 1) => n.toFixed(d).replace('.', ',');
  const DIA = 864e5;
  const hoje = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  const data = (s) => (s ? new Date(s + 'T12:00:00') : null);
  const br = (d) => d.toLocaleDateString('pt-BR');

  const ALTO = [
    ['pePrevia', 'Pré-eclâmpsia em gestação anterior'], ['gemelar', 'Gestação gemelar'], ['hasCronica', 'Hipertensão crônica'],
    ['dmPrevio', 'Diabetes tipo 1 ou 2 prévio'], ['drc', 'Doença renal crônica'], ['autoimune', 'Doença autoimune (LES, SAF)'],
    ['obesa', 'IMC pré-gestacional > 30'], ['fiv', 'Reprodução assistida (FIV)'],
  ];
  const MODERADO = [
    ['nulipara', 'Primeira gestação (nulípara)'], ['idade35', 'Idade ≥ 35 anos'], ['famPE', 'Mãe ou irmã com pré-eclâmpsia'],
    ['intervalo', 'Intervalo > 10 anos desde a última gestação'], ['negra', 'Negra ou parda'], ['baixaRenda', 'Baixa renda / vulnerabilidade'],
    ['rnPequeno', 'RN de baixo peso ou desfecho ruim em gestação anterior'],
  ];
  const PNAR = [
    'Hipertensão crônica, pré-eclâmpsia, DM prévio ou gestacional que precisa de insulina',
    'Cardiopatia, nefropatia, epilepsia, doença autoimune, HIV, sífilis terciária, hepatites, tireoidopatia descompensada',
    'Gemelar, placenta prévia, restrição de crescimento, polidrâmnio/oligoâmnio, malformação fetal',
    'Anemia grave (Hb < 8), bariátrica, dependência de drogas, IMC ≥ 40, idade < 15 anos',
    'Perda gestacional de repetição, parto prematuro ou óbito fetal prévio, isoimunização Rh',
    'Manter o vínculo com a UBS: a gestante continua sendo acompanhada aqui junto com o PNAR',
  ];

  function ler() {
    const v = {};
    $$('#aba-prenatal [data-pn]').forEach((el) => { v[el.dataset.pn] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
    return v;
  }

  // ---------- idade gestacional ----------
  function ig(v) {
    const h = hoje();
    const dum = data(v.dum);
    const igDum = dum ? Math.round((h - dum) / DIA) : null;
    let igUsg = null; const dUsg = data(v.usgData);
    const sUsg = num(v.usgSem); const dd = num(v.usgDias) || 0;
    if (dUsg && sUsg != null) igUsg = Math.round(sUsg * 7 + dd + (h - dUsg) / DIA);
    let dias = null; let por = '';
    if (igUsg != null && igDum != null) {
      // USG precoce corrige a DUM quando a diferença passa do limite da idade gestacional da USG
      const limite = sUsg < 14 ? 7 : sUsg < 20 ? 10 : 14;
      const igDumNaUsg = Math.round((dUsg - dum) / DIA);
      if (Math.abs(igDumNaUsg - (sUsg * 7 + dd)) > limite) { dias = igUsg; por = `USG (difere da DUM em > ${limite} dias)`; } else { dias = igDum; por = 'DUM (confirmada pela USG)'; }
    } else if (igUsg != null) { dias = igUsg; por = 'USG'; } else if (igDum != null) { dias = igDum; por = 'DUM'; }
    if (dias == null || dias < 0 || dias > 300) return null;
    const dpp = new Date(h.getTime() + (280 - dias) * DIA);
    return { dias, sem: Math.floor(dias / 7), d: dias % 7, por, dpp, tri: dias < 98 ? 1 : dias < 196 ? 2 : 3 };
  }
  const igTxt = (g) => `${g.sem} semanas e ${g.d} dia${g.d === 1 ? '' : 's'}`;

  function proximaConsulta(g) {
    if (g.sem < 28) return 'em 4 semanas (mensal até 28 sem)';
    if (g.sem < 36) return 'em 2 semanas (quinzenal de 28 a 36 sem)';
    if (g.sem < 41) return 'em 1 semana (semanal a partir de 36 sem)';
    return 'encaminhar à maternidade hoje (≥ 41 sem: avaliação de pós-datismo)';
  }

  // ---------- roteiro da consulta pela IG ----------
  function roteiro(g, v, risco) {
    const s = g.sem; const it = [];
    const add = (grupo, txt, nivel = '') => it.push({ grupo, txt, nivel });
    // exames
    if (v.primeira || s < 14) {
      add('Exames', '1ª consulta: hemograma, tipagem ABO/Rh, Coombs indireto (se Rh negativo), glicemia de jejum, EAS + urocultura, eletroforese de hemoglobina');
      add('Exames', 'Testes rápidos: HIV, sífilis (+ VDRL), hepatite B (HBsAg), hepatite C; sorologias: toxoplasmose IgG/IgM, HTLV (Rede Alyne)');
      add('Exames', 'USG obstétrica — ideal entre 11 e 14 semanas (datação e translucência nucal); citopatológico/DNA-HPV se em atraso');
    }
    if (s >= 24 && s <= 28) add('Exames', 'TOTG 75 g (jejum, 1 h e 2 h) entre 24 e 28 semanas — se glicemia de jejum inicial < 92 mg/dL', 'medio');
    if (s >= 20 && s < 24) add('Exames', 'USG morfológica do 2º trimestre (20–24 sem), se disponível');
    if (s >= 28) add('Exames', '3º trimestre: hemograma, glicemia de jejum, urocultura, testes rápidos de HIV, sífilis e hepatite B (repetir)');
    if (s >= 35 && s <= 37) add('Exames', 'Cultura para estreptococo do grupo B (35–37 sem), se disponível no município');
    if (v.toxoSusc) add('Exames', 'Toxoplasmose suscetível (IgG negativo): repetir sorologia a cada trimestre + orientar higiene (carne bem passada, lavar verduras, evitar fezes de gato)');
    if (v.rhNeg) add('Exames', s >= 28 ? 'Rh negativo: Coombs indireto e imunoglobulina anti-D com 28 semanas (se Coombs negativo e parceiro Rh+ ou desconhecido)' : 'Rh negativo: Coombs indireto agora e de novo com 28 semanas', 'medio');
    // vacinas
    add('Vacinas', 'Hepatite B e dT: completar 3 doses conforme histórico (aplicar ao saber da gravidez)');
    add('Vacinas', 'Influenza (1 dose por temporada) e COVID-19 (1 dose a cada gestação)');
    if (s >= 20) add('Vacinas', 'dTpa: 1 dose a partir de 20 semanas — em toda gestação', 'medio');
    else add('Vacinas', `dTpa a partir de 20 semanas (agendar para ${br(new Date(hoje().getTime() + (140 - g.dias) * DIA))})`);
    if (s >= 28) add('Vacinas', 'VSR (vírus sincicial respiratório): 1 dose a partir de 28 semanas, conforme estratégia vigente do MS/município', 'medio');
    // suplementação
    if (s < 12) add('Suplementação', 'Ácido fólico até 12 semanas');
    add('Suplementação', 'Sulfato ferroso 40 mg de ferro elementar/dia durante toda a gestação e até 3 meses pós-parto');
    if (s >= 12) add('Suplementação', 'Carbonato de cálcio 1.000 mg de cálcio/dia a partir de 12 semanas até o parto (NT MS 251/2024), separado do ferro');
    if (risco.indicaAAS) {
      if (s < 12) add('Suplementação', `AAS 100 mg à noite — iniciar com 12 semanas (${br(new Date(hoje().getTime() + (84 - g.dias) * DIA))}) até 36 semanas`, 'alto');
      else if (s < 36) add('Suplementação', `AAS 100 mg à noite até 36 semanas${s >= 16 ? ' (início ideal era até 16 sem — ainda há benefício até ~20 sem; decidir caso a caso)' : ''}`, 'alto');
    }
    // condutas pela idade gestacional
    if (s >= 20) add('Consulta', 'Medir altura uterina e auscultar BCF (sonar a partir de 12 sem); perguntar sobre movimentação fetal');
    if (s >= 36) add('Consulta', 'Apresentação fetal; plano de parto e visita à maternidade de referência; sinais de trabalho de parto');
    if (s >= 41) add('Consulta', '≥ 41 semanas: encaminhar à maternidade para avaliação do bem-estar fetal e indução', 'alto');
    add('Consulta', 'Saúde bucal (consulta odontológica no pré-natal), avaliação de violência e saúde mental (rastrear depressão)');
    return it;
  }

  // ---------- alertas da consulta ----------
  function alertas(g, v) {
    const a = [];
    const pas = num(v.pas); const pad = num(v.pad);
    if (pas != null && pad != null) {
      if (pas >= 160 || pad >= 110) a.push(['alto', `PA ${pas}/${pad}: hipertensão grave — confirmar em 15 min; nifedipino VO, sulfato de magnésio se pré-eclâmpsia grave e transferência (SAMU/vaga zero).`]);
      else if (pas >= 140 || pad >= 90) a.push(['alto', g && g.sem >= 20 ? `PA ${pas}/${pad} com ${g.sem} sem: suspeita de pré-eclâmpsia — proteinúria (fita/relação P/C), plaquetas, TGO/TGP, creatinina; avaliação na maternidade no mesmo dia se sintomas.` : `PA ${pas}/${pad} antes de 20 sem: provável hipertensão crônica — referenciar ao PNAR e iniciar tratamento se ≥ 140/90 persistente.`]);
    }
    const au = num(v.au);
    if (g && au != null && g.sem >= 20 && g.sem <= 36 && Math.abs(au - g.sem) > 3) a.push(['medio', `Altura uterina ${au} cm com ${g.sem} sem (esperado ≈ ${g.sem} ± 3 cm): ${au < g.sem ? 'menor — avaliar restrição de crescimento/oligoâmnio/erro de datação' : 'maior — avaliar gemelar, polidrâmnio, macrossomia, erro de datação'} → USG.`]);
    const bcf = num(v.bcf);
    if (bcf != null && (bcf < 110 || bcf > 160)) a.push(['alto', `BCF ${bcf} bpm fora de 110–160 → repetir ausculta e encaminhar à maternidade se persistir.`]);
    const hb = num(v.hb);
    if (hb != null && hb < 11) a.push([hb < 8 ? 'alto' : 'medio', hb < 8 ? `Hb ${fmt(hb)}: anemia grave → PNAR / investigar.` : `Hb ${fmt(hb)}: anemia — sulfato ferroso em dose de tratamento (ver patologia "Anemia na gestação") e repetir em 30–60 dias.`]);
    const gj = num(v.gj);
    if (gj != null && gj >= 92) a.push(['alto', gj >= 126 ? `Glicemia de jejum ${gj}: diabetes diagnosticado na gestação (overt) → PNAR.` : `Glicemia de jejum ${gj} (92–125): diabetes gestacional → dieta, perfil glicêmico e acompanhamento (ver patologia DMG).`]);
    if (g && g.sem >= 41) a.push(['alto', 'Idade gestacional ≥ 41 semanas → encaminhar à maternidade hoje.']);
    return a;
  }

  function riscoPE(v) {
    const altos = ALTO.filter(([k]) => v['r_' + k]).map(([, t]) => t);
    const mods = MODERADO.filter(([k]) => v['r_' + k]).map(([, t]) => t);
    return { altos, mods, indicaAAS: altos.length >= 1 || mods.length >= 2 };
  }

  function pesoInfo(v, g) {
    const pp = num(v.pesoPre); const alt = num(v.altura); const pa = num(v.peso);
    if (!pp || !alt) return null;
    const m = alt > 3 ? alt / 100 : alt; const imc = pp / (m * m);
    const [faixa, ganho] = imc < 18.5 ? ['baixo peso', [12.5, 18]] : imc < 25 ? ['eutrofia', [11.5, 16]] : imc < 30 ? ['sobrepeso', [7, 11.5]] : ['obesidade', [5, 9]];
    const r = { imc, faixa, ganho, txt: `IMC pré-gestacional ${fmt(imc)} kg/m² (${faixa}) — ganho total recomendado ${fmt(ganho[0])}–${fmt(ganho[1])} kg.` };
    if (pa) {
      r.atual = pa - pp;
      r.txt += ` Ganho até agora: ${r.atual >= 0 ? '+' : ''}${fmt(r.atual)} kg`;
      if (g && g.sem >= 14) {
        // ganho esperado ~1–2 kg no 1º tri e taxa semanal depois (IOM)
        const taxa = { 'baixo peso': [0.44, 0.58], eutrofia: [0.35, 0.5], sobrepeso: [0.23, 0.33], obesidade: [0.17, 0.27] }[faixa];
        const min = 0.5 + (g.sem - 13) * taxa[0]; const max = 2 + (g.sem - 13) * taxa[1];
        r.txt += ` (esperado para ${g.sem} sem: ${fmt(min)}–${fmt(max)} kg)`;
        r.fora = r.atual < min - 1 ? 'abaixo' : r.atual > max + 1 ? 'acima' : '';
      }
      r.txt += '.';
    }
    return r;
  }

  // ---------- textos ----------
  function evolucao(v, g, risco, pi, rot) {
    const idade = num(v.idade);
    const gpa = [v.g && `G${v.g}`, (v.pn || v.pc) && `P${(+v.pn || 0) + (+v.pc || 0)}${v.pc ? ` (${v.pn || 0}N/${v.pc}C)` : ''}`, v.a && `A${v.a}`].filter(Boolean).join('');
    const l = [];
    l.push(`Gestante${idade ? `, ${idade} anos` : ''}${gpa ? `, ${gpa}` : ''}${g ? `, IG ${igTxt(g)} (por ${g.por}), DPP ${br(g.dpp)}` : ''}. Comparece para consulta de pré-natal${v.primeira ? ' (1ª consulta)' : ''}.`);
    l.push(`Refere ${v.queixa || 'estar bem, sem queixas'}.${g && g.sem >= 20 ? ' Refere movimentação fetal presente.' : ''}`);
    l.push('Nega sangramento vaginal, perda de líquido, contrações regulares, disúria, febre, cefaleia, escotomas visuais e epigastralgia.');
    const ex = [
      v.pas && v.pad ? `PA ${v.pas}/${v.pad} mmHg` : 'PA ___ mmHg',
      v.peso ? `peso ${v.peso} kg` : 'peso ___ kg',
      g && g.sem >= 12 ? (v.au ? `AU ${v.au} cm` : (g.sem >= 20 ? 'AU ___ cm' : '')) : '',
      g && g.sem >= 12 ? (v.bcf ? `BCF ${v.bcf} bpm` : 'BCF ___ bpm') : '',
      `edema ${v.edema || 'ausente'}`,
      g && g.sem >= 36 ? `apresentação ${v.apres || '___'}` : '',
    ].filter(Boolean).join(', ');
    l.push(`Exame obstétrico: ${ex}.`);
    if (pi) l.push(pi.txt);
    if (risco.altos.length || risco.mods.length) l.push(`Risco para pré-eclâmpsia: ${[...risco.altos.map((x) => x + ' (alto)'), ...risco.mods.map((x) => x + ' (moderado)')].join('; ')}${risco.indicaAAS ? ' — indicado AAS profilático.' : '.'}`);
    const cond = rot.filter((x) => x.marcado).map((x) => '- ' + x.txt);
    l.push('Conduta:');
    l.push(...(cond.length ? cond : ['- ___']));
    if (g) l.push(`- Retorno ${proximaConsulta(g)}.`);
    l.push('- Orientados sinais de alarme e procurar a maternidade se necessário. Gestante ciente e concordante.');
    return l.join('\n');
  }

  function receita(g, risco) {
    const M = window.MEDS; const itens = [];
    if (!g || g.sem < 12) itens.push(M.acidoFolico5);
    itens.push(M.sulfatoFerrosoGest);
    if (g && g.sem >= 12) itens.push(M.carbonatoCalcioGest);
    if (risco.indicaAAS && g && g.sem >= 12 && g.sem < 36) itens.push(M.aasPE); // antes de 12 sem fica só agendado no roteiro
    return 'USO ORAL\n' + itens.filter(Boolean).map((m, i) => `${i + 1}. ${m.n} ———— ${m.q || ''}\n${m.p}`).join('\n\n');
  }

  function leigo(g) {
    const l = ['🤰 *Orientações do pré-natal*', ''];
    if (g) l.push(`Você está com ${igTxt(g)} de gestação. Data provável do parto: ${br(g.dpp)}.`, '');
    l.push('*Procure a maternidade na hora se tiver:*',
      '• sangramento pela vagina ou perda de líquido',
      '• contrações (barriga endurecendo) de forma regular antes de 37 semanas',
      '• dor de cabeça forte, visão embaçada ou com pontos brilhantes, dor forte no estômago',
      '• inchaço de repente no rosto e nas mãos',
      '• febre, ardência para urinar ou dor nas costas',
      '• bebê mexendo menos que o normal (depois de 28 semanas: menos de 10 movimentos em 2 horas)', '',
      '*Cuidados:*',
      '• tomar o ferro 1 hora antes do almoço com suco de laranja; o cálcio depois do café e do jantar (nunca junto com o ferro)',
      '• comer carne bem passada, lavar bem frutas e verduras; não beber álcool nem fumar',
      '• não tomar remédio sem falar com a equipe da UBS',
      '• levar sempre a Caderneta da Gestante às consultas e à maternidade');
    if (g) l.push('', `*Próxima consulta:* ${proximaConsulta(g)}.`);
    return l.join('\n');
  }

  // ---------- tela ----------
  const campo = (k, rot, tipo = 'text', extra = '') => `<label>${rot}<input data-pn="${k}" type="${tipo}"${tipo === 'text' ? ' inputmode="decimal"' : ''} ${extra}></label>`;
  const chk = (k, rot) => `<label class="chk"><input type="checkbox" data-pn="${k}"> ${rot}</label>`;

  function montar() {
    const box = $('#aba-prenatal'); if (!box || box.dataset.ok) return;
    box.dataset.ok = '1';
    box.innerHTML = `
      <div class="card"><h2>🤰 Pré-natal — consulta de baixo risco</h2>
        <p class="nota">Preencha o que tiver; o roteiro, os alertas, a evolução e a receita se atualizam sozinhos. Nada fica salvo.</p>
        <h3 class="pn-h">Datação</h3>
        <div class="grade-atestado">
          ${campo('dum', 'DUM', 'date')}
          ${campo('usgData', 'Data da 1ª USG', 'date')}
          ${campo('usgSem', 'IG na USG — semanas')}
          ${campo('usgDias', 'IG na USG — dias')}
        </div>
        <div id="pnIg" class="calc-res"><span class="nota">Informe a DUM e/ou a USG.</span></div>
        <h3 class="pn-h">Gestante</h3>
        <div class="grade-atestado">
          ${campo('idade', 'Idade (anos)')}
          ${campo('g', 'Gestações (G)')}
          ${campo('pn', 'Partos normais')}
          ${campo('pc', 'Cesáreas')}
          ${campo('a', 'Abortos (A)')}
          ${campo('pesoPre', 'Peso antes de engravidar (kg)')}
          ${campo('altura', 'Altura (cm)')}
          ${chk('primeira', '1ª consulta de pré-natal')}
          ${chk('rhNeg', 'Rh negativo')}
          ${chk('toxoSusc', 'Toxoplasmose suscetível (IgG −)')}
        </div>
        <h3 class="pn-h">Consulta de hoje</h3>
        <div class="grade-atestado">
          ${campo('pas', 'PA sistólica')}
          ${campo('pad', 'PA diastólica')}
          ${campo('peso', 'Peso atual (kg)')}
          ${campo('au', 'Altura uterina (cm)')}
          ${campo('bcf', 'BCF (bpm)')}
          <label>Edema<select data-pn="edema"><option value="ausente">ausente</option><option value="+/4+">+/4+</option><option value="++/4+">++/4+</option><option value="+++/4+">+++/4+</option></select></label>
          <label>Apresentação (≥ 36 sem)<select data-pn="apres"><option value="">—</option><option>cefálica</option><option>pélvica</option><option>córmica</option></select></label>
          ${campo('hb', 'Última Hb (g/dL)')}
          ${campo('gj', 'Glicemia de jejum (mg/dL)')}
        </div>
        <label class="rotulo">Queixas / observações<input data-pn="queixa" type="text" style="width:100%" placeholder="Ex.: náuseas matinais leves, pirose após as refeições"></label>
      </div>

      <div class="card"><h2>Risco de pré-eclâmpsia (indicação de AAS)</h2>
        <p class="nota">AAS 100 mg à noite de 12 a 36 semanas se <b>1 fator alto</b> ou <b>2 ou mais moderados</b>.</p>
        <div class="pn-risco">
          <div><h3 class="pn-h">Alto risco</h3>${ALTO.map(([k, t]) => chk('r_' + k, t)).join('')}</div>
          <div><h3 class="pn-h">Moderado</h3>${MODERADO.map(([k, t]) => chk('r_' + k, t)).join('')}</div>
        </div>
        <div id="pnRisco" class="calc-res"></div>
      </div>

      <div id="pnAlertas"></div>

      <div class="card"><h2>O que fazer nesta consulta</h2>
        <p class="nota">Marque o que foi feito/solicitado — entra na conduta da evolução.</p>
        <div id="pnRoteiro"></div>
      </div>

      <div class="card"><h2>Evolução pronta</h2>
        <textarea id="pnEvol" rows="14"></textarea>
        <div class="botoes"><button class="primario" id="pnCopiarEvol">Copiar evolução</button><button class="mini" id="pnUsarEvol">Usar no prontuário</button></div>
      </div>

      <div class="card"><h2>Receita do pré-natal</h2>
        <textarea id="pnReceita" rows="10"></textarea>
        <div class="botoes"><button class="primario" id="pnCopiarRec">Copiar receita</button></div>
        <p class="nota">Ácido fólico só até 12 sem; cálcio a partir de 12 sem; AAS só se indicado pelo risco. Edite antes de copiar.</p>
      </div>

      <div class="card bloco leigo"><h2>📱 Para a gestante</h2>
        <textarea id="pnLeigo" rows="14"></textarea>
        <div class="botoes"><button class="mini" id="pnCopiarLeigo">Copiar</button><button class="mini whats" id="pnWhats">WhatsApp</button></div>
      </div>

      <div class="card"><h2>Quando encaminhar ao pré-natal de alto risco (PNAR)</h2>
        <ul class="pn-lista">${PNAR.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <p class="nota">Calendário de consultas: mensal até 28 sem, quinzenal até 36 sem e semanal até o parto — mínimo de 7 consultas, 1ª até 12 sem (Rede Alyne).</p>
      </div>`;
    box.addEventListener('input', atualizar);
    box.addEventListener('change', atualizar);
    box.addEventListener('click', clique);
    atualizar();
  }

  let ultimo = { rot: [] };
  const marcados = new Set();
  function atualizar(e) {
    if (e && e.target && e.target.dataset.rot != null) {
      const k = e.target.dataset.rot; if (e.target.checked) marcados.add(k); else marcados.delete(k);
    } else if (e && e.target && ['pnEvol', 'pnReceita', 'pnLeigo'].includes(e.target.id)) return; // edição manual
    const v = ler(); const g = ig(v); const risco = riscoPE(v); const pi = pesoInfo(v, g);
    $('#pnIg').innerHTML = g
      ? `<b>${g.sem}s ${g.d}d</b> <span>${g.tri}º trimestre · DPP <b>${br(g.dpp)}</b> · por ${esc(g.por)} · próxima consulta ${esc(proximaConsulta(g))}</span>`
      : '<span class="nota">Informe a DUM e/ou a USG (data + IG na USG).</span>';
    $('#pnRisco').className = 'calc-res ' + (risco.indicaAAS ? 'a-alto' : '');
    $('#pnRisco').innerHTML = risco.indicaAAS
      ? `<b>AAS indicado</b> <span>${risco.altos.length} alto · ${risco.mods.length} moderado(s) — 100 mg à noite de 12 a 36 semanas</span>`
      : `<span>${risco.altos.length} alto · ${risco.mods.length} moderado(s) — sem indicação de AAS por enquanto</span>`;
    const al = alertas(g, v);
    if (pi && pi.fora) al.push(['medio', `Ganho de peso ${pi.fora} do esperado para a idade gestacional — orientação nutricional${pi.fora === 'acima' ? ', rastrear DMG e edema' : ' e investigar causa'}.`]);
    $('#pnAlertas').innerHTML = al.length ? `<div class="card"><h2>⚠️ Alertas</h2>${al.map(([n, t]) => `<div class="calc-res a-${n}" style="margin-bottom:6px"><span>${esc(t)}</span></div>`).join('')}</div>` : '';
    const rot = g ? roteiro(g, v, risco) : [];
    rot.forEach((x) => { x.marcado = marcados.has(x.txt); });
    ultimo = { rot };
    const grupos = [...new Set(rot.map((x) => x.grupo))];
    $('#pnRoteiro').innerHTML = g
      ? grupos.map((gr) => `<h3 class="pn-h">${gr}</h3>${rot.filter((x) => x.grupo === gr).map((x) => `<label class="pn-item ${x.nivel ? 'a-' + x.nivel : ''}"><input type="checkbox" data-rot="${esc(x.txt)}"${x.marcado ? ' checked' : ''}> ${esc(x.txt)}</label>`).join('')}`).join('')
      : '<p class="nota">Informe a idade gestacional para ver o roteiro.</p>';
    $('#pnEvol').value = evolucao(v, g, risco, pi, rot);
    $('#pnReceita').value = receita(g, risco);
    $('#pnLeigo').value = leigo(g);
  }

  function clique(e) {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'pnCopiarEvol') return PR().copiar($('#pnEvol').value, 'Evolução copiada');
    if (b.id === 'pnCopiarRec') return PR().copiar($('#pnReceita').value, 'Receita copiada');
    if (b.id === 'pnCopiarLeigo') return PR().copiar($('#pnLeigo').value, 'Copiado');
    if (b.id === 'pnWhats') return window.open('https://wa.me/?text=' + encodeURIComponent($('#pnLeigo').value), '_blank', 'noopener');
    if (b.id === 'pnUsarEvol') {
      const ta = $('#anamnese');
      if (ta.value.trim() && !confirm('Substituir a anamnese que já está escrita?')) return;
      PR().setAnamnese($('#pnEvol').value);
      document.querySelector('.nav [data-aba="atendimento"]').click();
      PR().toast('Evolução do pré-natal colocada no prontuário');
    }
  }

  window.renderPrenatal = montar;
  document.addEventListener('click', (e) => { if (e.target.closest('[data-aba="prenatal"]')) setTimeout(montar, 0); });
})();
