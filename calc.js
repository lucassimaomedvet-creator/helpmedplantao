// Calculadoras clínicas. Cada uma gera um resultado com interpretação e uma linha pronta para o prontuário.
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
  const fmt = (n, d = 1) => n.toFixed(d).replace('.', ',');
  const PR = () => window.PR;

  const CALCS = [
    {
      id: 'clcr', titulo: 'Clearance de creatinina (Cockcroft-Gault)', sub: 'Ajuste de dose de antibióticos, AINE, metformina, enoxaparina',
      campos: [['idade', 'Idade (anos)', 'n'], ['peso', 'Peso (kg)', 'n'], ['cr', 'Creatinina (mg/dL)', 'n'], ['sexo', 'Sexo', ['M', 'F']]],
      calc(v) {
        if (!v.idade || !v.peso || !v.cr) return null;
        let c = ((140 - v.idade) * v.peso) / (72 * v.cr); if (v.sexo === 'F') c *= 0.85;
        const obeso = v.peso > 100 ? ' — obesidade: peso real superestima' : '';
        const faixa0 = c >= 90 ? 'normal' : c >= 60 ? 'leve redução' : c >= 30 ? 'moderada — ajustar doses' : c >= 15 ? 'grave — evitar AINE, nitrofurantoína e metformina' : 'falência renal';
        const faixa = faixa0 + obeso;
        return { valor: `${fmt(c, 0)} mL/min`, interp: faixa, linha: `ClCr (Cockcroft-Gault) estimado: ${fmt(c, 0)} mL/min (${faixa}).`, nivel: c < 30 ? 'alto' : c < 60 ? 'medio' : '' };
      },
    },
    {
      id: 'imc', titulo: 'IMC', sub: 'Índice de massa corporal',
      campos: [['peso', 'Peso (kg)', 'n'], ['alt', 'Altura (cm)', 'n'], ['idade', 'Idade (anos)', 'n']],
      calc(v) {
        if (!v.peso || !v.alt) return null;
        const m = v.alt > 3 ? v.alt / 100 : v.alt; const i = v.peso / (m * m);
        const c = v.idade >= 60 ? (i < 22 ? 'baixo peso (idoso)' : i <= 27 ? 'eutrofia (idoso)' : 'sobrepeso (idoso)') : i < 18.5 ? 'baixo peso' : i < 25 ? 'eutrofia' : i < 30 ? 'sobrepeso' : i < 35 ? 'obesidade grau I' : i < 40 ? 'obesidade grau II' : 'obesidade grau III';
        return { valor: fmt(i) + ' kg/m²', interp: c, linha: `IMC: ${fmt(i)} kg/m² (${c}).`, nivel: i >= 35 || i < 18.5 ? 'medio' : '' };
      },
    },
    {
      id: 'ig', titulo: 'Idade gestacional e DPP', sub: 'Pela data da última menstruação (Naegele)',
      campos: [['dum', 'DUM', 'data']],
      calc(v) {
        if (!v.dum) return null;
        const d = new Date(v.dum + 'T12:00:00'); const hoje = new Date(); hoje.setHours(12, 0, 0, 0);
        const dias = Math.round((hoje - d) / 864e5); if (dias < 0 || dias > 310) return { valor: '—', interp: 'DUM fora do intervalo', linha: '' };
        const dpp = new Date(d.getTime() + 280 * 864e5);
        const sem = Math.floor(dias / 7), dd = dias % 7;
        const tri = sem < 14 ? '1º trimestre' : sem < 28 ? '2º trimestre' : '3º trimestre';
        const txt = `IG pela DUM (${d.toLocaleDateString('pt-BR')}): ${sem} semanas e ${dd} dia${dd === 1 ? '' : 's'} (${tri}). DPP: ${dpp.toLocaleDateString('pt-BR')}.`;
        return { valor: `${sem}s ${dd}d`, interp: `${tri} · DPP ${dpp.toLocaleDateString('pt-BR')}`, linha: txt };
      },
    },
    {
      id: 'crb', titulo: 'CRB-65 (pneumonia)', sub: 'Decisão de internar na PAC — 1 ponto cada',
      campos: [['c', 'Confusão mental', 'chk'], ['r', 'FR ≥ 30 irpm', 'chk'], ['b', 'PAS < 90 ou PAD ≤ 60 mmHg', 'chk'], ['i', 'Idade ≥ 65 anos', 'chk']],
      calc(v) {
        const p = ['c', 'r', 'b', 'i'].filter((k) => v[k]).length;
        const t = p === 0 ? 'baixo risco — tratamento ambulatorial' : p <= 2 ? 'risco intermediário — considerar internação/observação' : 'alto risco — internação (avaliar UTI)';
        return { valor: `${p} ponto${p === 1 ? '' : 's'}`, interp: t, linha: `CRB-65: ${p} (${t}).`, nivel: p >= 3 ? 'alto' : p >= 1 ? 'medio' : '' };
      },
    },
    {
      id: 'mcisaac', titulo: 'Centor / McIsaac (faringite)', sub: 'Probabilidade de estreptococo',
      campos: [['f', 'Febre > 38 °C', 'chk'], ['t', 'Ausência de tosse', 'chk'], ['l', 'Linfonodo cervical anterior doloroso', 'chk'], ['e', 'Exsudato/edema amigdaliano', 'chk'], ['idade', 'Idade (anos)', 'n']],
      calc(v) {
        let p = ['f', 't', 'l', 'e'].filter((k) => v[k]).length;
        if (v.idade != null) { if (v.idade >= 3 && v.idade < 15) p += 1; else if (v.idade >= 45) p -= 1; }
        const t = p <= 1 ? 'baixa probabilidade — não tratar com antibiótico' : p <= 3 ? 'intermediária — teste rápido se disponível' : 'alta — tratar empiricamente (penicilina/amoxicilina)';
        return { valor: `${p} ponto${Math.abs(p) === 1 ? '' : 's'}`, interp: t, linha: `Escore de McIsaac: ${p} (${t}).`, nivel: p >= 4 ? 'medio' : '' };
      },
    },
    {
      id: 'qsofa', titulo: 'qSOFA (sepse)', sub: 'Triagem de gravidade em infecção — não exclui sepse',
      campos: [['m', 'Alteração do estado mental', 'chk'], ['fr', 'FR ≥ 22 irpm', 'chk'], ['pa', 'PAS ≤ 100 mmHg', 'chk']],
      calc(v) {
        const p = ['m', 'fr', 'pa'].filter((k) => v[k]).length;
        const t = p >= 2 ? 'positivo — alto risco: lactato, culturas, ATB na 1ª hora' : 'negativo — mantenha vigilância se suspeita de infecção';
        return { valor: `${p}/3`, interp: t, linha: `qSOFA: ${p}/3 (${t}).`, nivel: p >= 2 ? 'alto' : '' };
      },
    },
    {
      id: 'glasgow', titulo: 'Escala de Coma de Glasgow', sub: 'Com reatividade pupilar (Glasgow-P)',
      campos: [
        ['o', 'Abertura ocular', ['4 Espontânea', '3 Ao som', '2 À pressão', '1 Ausente']],
        ['v', 'Resposta verbal', ['5 Orientada', '4 Confusa', '3 Palavras', '2 Sons', '1 Ausente']],
        ['m', 'Resposta motora', ['6 Obedece comandos', '5 Localiza', '4 Flexão normal', '3 Flexão anormal', '2 Extensão', '1 Ausente']],
        ['p', 'Pupilas que NÃO reagem', ['0 Nenhuma', '1 Uma', '2 Ambas']],
      ],
      calc(v) {
        const g = (x) => parseInt(x, 10);
        const o = g(v.o), vv = g(v.v), m = g(v.m), p = g(v.p || '0');
        const t = o + vv + m; const gp = t - p;
        const c = t <= 8 ? 'grave — proteger via aérea' : t <= 12 ? 'moderado' : t < 15 ? 'leve' : 'normal';
        return { valor: `${t}${p ? ` (P ${gp})` : ''}`, interp: c, linha: `Glasgow ${t} (O${o} V${vv} M${m})${p ? `, Glasgow-P ${gp}` : ''} — ${c}.`, nivel: t <= 8 ? 'alto' : t <= 12 ? 'medio' : '' };
      },
    },
    {
      id: 'wells', titulo: 'Wells para TEP', sub: 'Probabilidade clínica de embolia pulmonar',
      campos: [
        ['tvp', 'Sinais clínicos de TVP (3)', 'chk'], ['alt', 'TEP é o diagnóstico mais provável (3)', 'chk'], ['fc', 'FC > 100 bpm (1,5)', 'chk'],
        ['imob', 'Imobilização ≥ 3 dias ou cirurgia < 4 semanas (1,5)', 'chk'], ['prev', 'TVP/TEP prévio (1,5)', 'chk'], ['hemo', 'Hemoptise (1)', 'chk'], ['ca', 'Câncer ativo (1)', 'chk'],
      ],
      calc(v) {
        const pesos = { tvp: 3, alt: 3, fc: 1.5, imob: 1.5, prev: 1.5, hemo: 1, ca: 1 };
        const p = Object.entries(pesos).reduce((a, [k, w]) => a + (v[k] ? w : 0), 0);
        const t = p > 4 ? 'TEP provável — angiotomografia (D-dímero não exclui)' : 'TEP improvável — D-dímero (ajustado à idade se > 50 anos: idade × 10 µg/L); se negativo, exclui';
        return { valor: fmt(p) + ' pontos', interp: t, linha: `Escore de Wells (TEP): ${fmt(p)} (${t}).`, nivel: p > 4 ? 'alto' : '' };
      },
    },
    {
      id: 'ganzoni', titulo: 'Déficit de ferro (Ganzoni)', sub: 'Dose total de ferro EV — sacarato férrico 100 mg/ampola',
      campos: [['peso', 'Peso (kg)', 'n'], ['hb', 'Hb atual (g/dL)', 'n'], ['alvo', 'Hb alvo (g/dL) — padrão 13', 'n']],
      calc(v) {
        if (!v.peso || !v.hb) return null;
        const alvo = v.alvo || 13;
        if (v.hb >= alvo || v.hb < 3 || v.hb > 20 || v.peso > 250) return { valor: '—', interp: 'confira Hb atual e alvo', linha: '' };
        const def = Math.round(v.peso * (alvo - v.hb) * 2.4 + 500);
        const amp = Math.ceil(def / 100); const sessoes = Math.ceil(def / 200);
        const t = `≈ ${amp} ampolas · ${sessoes} ${sessoes === 1 ? 'aplicação' : 'aplicações'} de 200 mg (2–3x/semana, intervalo ≥ 48 h)`;
        return { valor: `${def} mg`, interp: t, linha: `Déficit de ferro (Ganzoni): ${v.peso} kg × (${fmt(alvo)} − ${fmt(v.hb)}) × 2,4 + 500 = ${def} mg. Sacarato férrico 200 mg em 200 mL SF 0,9% EV em ≥ 30 min, ${sessoes} aplicações.` };
      },
    },
    {
      id: 'corticoide', titulo: 'Equivalência de corticoides', sub: 'Converte dose pela potência anti-inflamatória',
      campos: [['dose', 'Dose (mg)', 'n'], ['de', 'De', ['Prednisona', 'Prednisolona', 'Hidrocortisona', 'Metilprednisolona', 'Dexametasona', 'Betametasona', 'Cortisona']], ['para', 'Para', ['Dexametasona', 'Prednisona', 'Prednisolona', 'Hidrocortisona', 'Metilprednisolona', 'Betametasona', 'Cortisona']]],
      calc(v) {
        const eq = { Hidrocortisona: 20, Cortisona: 25, Prednisona: 5, Prednisolona: 5, Metilprednisolona: 4, Dexametasona: 0.75, Betametasona: 0.6 };
        if (!v.dose || !eq[v.de] || !eq[v.para]) return null;
        const r = (v.dose / eq[v.de]) * eq[v.para];
        const d = Number.isInteger(+r.toFixed(2)) ? 0 : r < 10 ? 2 : r < 100 ? 1 : 0;
        const txt = `${fmt(v.dose, v.dose % 1 ? 1 : 0)} mg de ${v.de.toLowerCase()} ≈ ${fmt(r, d)} mg de ${v.para.toLowerCase()}`;
        return { valor: `${fmt(r, d)} mg`, interp: txt + ' (não considera efeito mineralocorticoide nem duração)', linha: `Equivalência de corticoide: ${txt}.` };
      },
    },
  ];

  function campoHtml(c, [k, rot, tipo]) {
    const id = `cl-${c.id}-${k}`;
    if (tipo === 'chk') return `<label class="cl-chk"><input type="checkbox" id="${id}" data-calc="${c.id}"> ${rot}</label>`;
    if (Array.isArray(tipo)) return `<label>${rot}<select id="${id}" data-calc="${c.id}">${tipo.map((o) => `<option value="${o.split(' ')[0]}">${o}</option>`).join('')}</select></label>`;
    return `<label>${rot}<input id="${id}" data-calc="${c.id}" type="${tipo === 'data' ? 'date' : 'text'}" inputmode="${tipo === 'data' ? '' : 'decimal'}"></label>`;
  }
  function render() {
    $('#calcs').innerHTML = CALCS.map((c) => `
      <div class="calc" id="calc-${c.id}">
        <div class="calc-cab"><h3>${c.titulo}</h3><span class="nota">${c.sub}</span></div>
        <div class="calc-campos">${c.campos.map((f) => campoHtml(c, f)).join('')}</div>
        <div class="calc-res" id="res-${c.id}"><span class="nota">Preencha os campos.</span></div>
      </div>`).join('');
    CALCS.forEach(atualizar);
  }
  function ler(c) {
    const v = {};
    for (const [k, , tipo] of c.campos) {
      const el = $(`#cl-${c.id}-${k}`);
      v[k] = tipo === 'chk' ? el.checked : tipo === 'n' ? num(el.value) : el.value;
    }
    return v;
  }
  function atualizar(c) {
    const r = c.calc(ler(c)); const box = $('#res-' + c.id);
    if (!r) { box.innerHTML = '<span class="nota">Preencha os campos.</span>'; return; }
    box.className = 'calc-res ' + (r.nivel ? 'a-' + r.nivel : '');
    box.innerHTML = `<b>${r.valor}</b> <span>${r.interp}</span>${r.linha ? `<button class="mini" data-calccopy="${c.id}">Copiar</button>` : ''}`;
    box.dataset.linha = r.linha || '';
  }
  // preenche com dados do atendimento quando abre a aba
  function preencher() {
    const pac = window.PR?.dados?.(); if (!pac) return;
    // sempre segue o paciente atual; só preserva o que o médico digitou à mão na calculadora
    const set = (id, val) => {
      const el = $(id); if (!el) return;
      const manual = el.value && el.value !== (el.dataset.auto || '');
      if (manual) return;
      el.value = val != null && val !== '' ? val : ''; el.dataset.auto = el.value;
    };
    set('#cl-clcr-idade', pac.idade); set('#cl-clcr-peso', pac.peso); set('#cl-imc-peso', pac.peso); set('#cl-imc-idade', pac.idade); set('#cl-mcisaac-idade', pac.idade);
    const sx = $('#cl-clcr-sexo'); if (sx) sx.value = pac.sexo;
    const i = $('#cl-crb-i'); if (i && pac.idade != null) i.checked = pac.idade >= 65;
    CALCS.forEach(atualizar);
  }

  document.addEventListener('input', (e) => { const id = e.target.dataset?.calc; if (id) atualizar(CALCS.find((c) => c.id === id)); });
  document.addEventListener('change', (e) => { const id = e.target.dataset?.calc; if (id) atualizar(CALCS.find((c) => c.id === id)); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.calccopy) PR().copiar($('#res-' + b.dataset.calccopy).dataset.linha);
    if (b.dataset.aba === 'calculadoras') preencher();
  });
  render();
})();
