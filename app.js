(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pr:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('pr:' + k, JSON.stringify(v)); } catch { /* sem storage */ } },
  };

  const MEDS = window.MEDS, COND = window.CONDICOES, SINT = window.SINTOMAS;
  const VIA_ORDEM = ['oral', 'SL', 'inalatório', 'nasal', 'oftálmico', 'otológico', 'tópico', 'vaginal', 'IM', 'EV', 'SC'];
  const VIA_TITULO = { oral: 'USO ORAL', SL: 'USO SUBLINGUAL', 'inalatório': 'USO INALATÓRIO', nasal: 'USO NASAL', 'oftálmico': 'USO OFTÁLMICO',
    'otológico': 'USO OTOLÓGICO', 'tópico': 'USO TÓPICO', vaginal: 'USO VAGINAL', IM: 'USO INTRAMUSCULAR', EV: 'USO ENDOVENOSO', SC: 'USO SUBCUTÂNEO', sublingual: 'USO SUBLINGUAL', material: 'MATERIAL' };

  // ---------------- estado ----------------
  const st = {
    modo: store.get('modo', 'ubs'),
    sexo: 'F',
    flags: new Set(),
    manuais: new Set(),      // sintomas adicionados à mão
    removidos: new Set(),    // sintomas detectados que o usuário removeu
    detectados: new Set(),
    cond: null,              // patologia aberta
    sel: {},                 // seleção de itens por patologia
    receita: store.get('receita', []),
    emTempo: false,
  };

  // ---------------- util ----------------
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 1600);
  }
  async function copiar(texto, msg = 'Copiado!') {
    try { await navigator.clipboard.writeText(texto); }
    catch {
      const ta = document.createElement('textarea'); ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast(msg);
  }
  function item(ref) {
    // 'chave' | '?chave' | '?{json}' | {m, ...override}
    let opc = false, obj = ref;
    if (typeof ref === 'string') {
      if (ref.startsWith('?')) { opc = true; ref = ref.slice(1); }
      obj = ref.startsWith('{') ? JSON.parse(ref) : { m: ref };
    }
    const base = MEDS[obj.m];
    if (!base) { console.warn('Medicamento não encontrado:', obj.m); return null; }
    const it = { key: obj.m, ...base, ...obj, opc: opc || !!obj.opc };
    // item pediátrico: com peso preenchido, a posologia vem calculada pela calculadora
    if (base.ped) {
      const pm = (window.PEDIATRIA || []).find((x) => x.id === base.ped);
      const kg = parseFloat(($('#peso') || {}).value);
      if (pm && kg > 0) {
        const anos = idade();
        if (pm.idadeMin != null && anos == null) { it.p = `⚠︎ Informe a idade (mínima: ${pm.idadeMin < 1 ? Math.round(pm.idadeMin * 12) + ' meses' : pm.idadeMin + ' ano(s)'}) para liberar a dose.`; it.bloqueado = true; }
        else { const r = calcPed(pm, kg, anos, mgkgPed(pm, obj.pedMgkg ?? base.pedMgkg)); it.p = r.texto; it.bloqueado = !!r.bloqueado; }
      }
    }
    return it;
  }
  // mg/kg em uso: o da indicação (pedMgkg) tem prioridade; senão o editado na calculadora; senão o padrão
  function mgkgPed(pm, especifico) {
    if (pm.fixo) return null;
    if (especifico != null) return especifico;
    const v = store.get('ped:' + pm.id, null);
    return typeof v === 'number' && v > 0 ? v : pm.mgkg;
  }
  // item da UBS Pedreira sem cadastro próprio: via pela forma farmacêutica e tags de alerta pelo nome
  function viaRemume(r) {
    const f = norm(r.forma + ' ' + r.nome);
    if (/ampola|seringa|carpule|frasco.?ampola|injet|caneta|refil/.test(f)) return /insulin|enoxapar|heparin/.test(f) ? 'SC' : 'IM/EV';
    if (/vaginal|ovulo/.test(f)) return 'vaginal';
    if (/colirio|oftalm/.test(f)) return 'oftálmico';
    if (/otolog/.test(f)) return 'otológico';
    if (/spray nasal|nasal/.test(f)) return 'nasal';
    if (/aerossol|inalat|bombinha|cap.*inal/.test(f)) return 'inalatório';
    if (/pomada|creme|gel\b|locao|shampoo|xampu|emuls|\bpasta\b|sabonete/.test(f)) return 'tópico';
    return 'oral';
  }
  function tagsPorNome(nome) {
    const n = norm(nome); const t = [];
    const mapa = [[/amoxi|penicil|benzil|ampicil/, ['penicilina', 'atb']], [/cefal|ceftri|cefur/, ['cefalosporina', 'atb']], [/sulfameto|trimetop/, ['sulfa', 'atb']],
      [/ibupro|diclofen|nimesul|cetoprof|naprox|meloxic/, ['aine']], [/acido acetilsalic|\baas\b/, ['aas']], [/dipiron|metamizol/, ['dipirona']], [/paraceta/, ['paracetamol']],
      [/ciproflox|levoflox|norflox/, ['quinolona', 'atb']], [/doxicic|tetracic/, ['tetraciclina', 'atb']], [/azitrom|claritrom|eritrom/, ['macrolideo', 'atb']],
      [/metronid/, ['metronidazol']], [/fluconaz/, ['fluconazol']], [/codein|tramad|morfin/, ['opioide']], [/diazep|clonazep|alprazol|midazol/, ['benzodiazepinico', 'sedativo']],
      [/losart/, ['bra']], [/captop|enalap/, ['ieca']], [/warfar|varfar|enoxapar|rivaroxa|heparin/, ['anticoagulante']], [/predniso|dexamet|hidrocort|betamet/, ['corticoide']],
      [/metformin/, ['metformina']], [/estatina|sinvast|rosuvast|atorvast/, ['estatina']]];
    mapa.forEach(([re, tags]) => { if (re.test(n)) tags.forEach((x) => { if (!t.includes(x)) t.push(x); }); });
    return t;
  }
  // mg/kg específico que a própria condição usa para um item da calculadora (ex.: amoxicilina 90 na OMA)
  function pedMgkgDaCond(c, pedId) {
    for (const r of [...(c.casa || []), ...(c.unid || [])]) {
      const it = item(r); if (it && MEDS[it.key] && MEDS[it.key].ped === pedId && it.pedMgkg != null) return it.pedMgkg;
    }
    return null;
  }
  // modelo de receita salvo pelo médico — NÃO é usado se houver alergia/contraindicação grave ou dose por peso
  function modeloSalvo(c) {
    const salvo = store.get('modelo:' + c.id, null); if (!salvo) return null;
    const conflito = c.casa.some((r) => { const it = item(r); return it && (it.ped || alertaItem(it, c).some((a) => a.nivel === 'alto')); });
    return conflito ? null : salvo;
  }
  const idade = () => { const v = parseFloat($('#idade').value); return isNaN(v) ? null : v; };

  // ---------------- sintomas ----------------
  const NEG = /\b(nega|negou|nega-se|sem|nao|nem|ausencia de|afebril)\b/;
  function detectar(texto) {
    const t = ' ' + norm(texto) + ' ';
    const achados = new Set();
    for (const [id, arr] of Object.entries(SINT)) {
      for (const sin of arr.slice(1)) {
        let i = t.indexOf(sin);
        while (i !== -1) {
          const antes = t[i - 1];
          const s0 = sin.trim();
          const inicioOk = sin.startsWith(' ') || !/[a-z0-9]/.test(antes);
          // termos curtos (≤ 4 letras) precisam terminar a palavra: "fid" não casa em "fidelidade"
          const fimOk = s0.length > 4 || sin.endsWith(' ') || !/[a-z0-9]/.test(t[i + sin.length] || ' ');
          if (inicioOk && fimOk) {
            // negação vale para a lista ("nega febre, tosse e coriza") e para até um verbo positivo/ponto:
            // "nega febre e refere tosse" → tosse continua; "sem melhora com dipirona e vômitos" → vômitos continua
            const seg = t.slice(Math.max(0, i - 80), i).split(/[.;:!?\n]|\b(?:mas|porem|refere|relata|apresenta|queixa|associad[oa]s? a|com|evoluiu|evoluindo|iniciou|comecou)\b/).pop();
            if (!NEG.test(seg) || /sem melhora|sem resposta|sem alivio/.test(seg)) { achados.add(id); break; }
          }
          i = t.indexOf(sin, i + 1);
        }
        if (achados.has(id)) break;
      }
    }
    // subtipos de cefaleia (latejante, em aperto, unilateral) só valem se houver cefaleia no texto
    if (!achados.has('cefaleia')) ['cefaleiaPulsatil', 'cefaleiaAperto'].forEach((x) => achados.delete(x));
    return achados;
  }
  // temperatura medida (texto "tax 38,5"/"temperatura 39" ou campo Tax dos sinais vitais)
  function temperaturaInformada() {
    const t = norm($('#anamnese').value);
    const nums = [...t.matchAll(/\b(?:tax|temp\w*|tax\.)\s*:?\s*(?:de\s*)?(\d{2})(?:[.,](\d))?/g)].map((m) => parseFloat(m[1] + '.' + (m[2] || 0)));
    const sv = parseFloat(String(($('#sv-tax') || {}).value || '').replace(',', '.'));
    if (sv > 30) nums.push(sv);
    return { citada: nums.length > 0 || /\b(tax|temperatura)\b/.test(t), febre: nums.some((n) => n >= 37.8 && n < 45) };
  }
  function sintomasAtivos() {
    const s = new Set([...st.detectados].filter((x) => !st.removidos.has(x)));
    st.manuais.forEach((x) => s.add(x));
    if (!st.removidos.has('febre') && temperaturaInformada().febre) s.add('febre');
    return s;
  }
  function renderChips() {
    const ativos = sintomasAtivos();
    const box = $('#chipsSintomas');
    if (!ativos.size) { box.innerHTML = '<span class="nota">Nenhum sintoma reconhecido ainda.</span>'; return; }
    box.innerHTML = [...ativos].map((id) =>
      `<span class="chip ${st.manuais.has(id) ? 'manual' : ''}">${esc(SINT[id][0])}<button data-rm="${id}" aria-label="remover ${esc(SINT[id][0])}">×</button></span>`).join('');
  }
  function ranking() {
    const ativos = sintomasAtivos();
    if (!ativos.size) return [];
    return COND.map((c) => {
      const total = Object.values(c.s).reduce((a, b) => a + b, 0);
      let pts = 0; const bate = [];
      for (const [id, w] of Object.entries(c.s)) if (ativos.has(id)) { pts += w; bate.push(id); }
      return { c, pts, frac: pts / total, bate, score: pts * (0.55 + 0.45 * (pts / total)) };
    }).filter((r) => r.pts > 0)
      .sort((a, b) => b.score - a.score || b.frac - a.frac)
      .slice(0, 8);
  }
  function renderHipoteses() {
    const q = norm($('#buscaPatologia').value.trim());
    const ol = $('#hipoteses');
    let linhas;
    if (q) {
      linhas = COND.filter((c) => norm(c.nome + ' ' + c.cid[0] + ' ' + c.cid[1] + ' ' + c.grupo).includes(q)).map((c) => ({ c, frac: null, bate: [] }));
      if (!linhas.length) { ol.innerHTML = '<li class="nota">Nenhuma patologia encontrada.</li>'; return; }
    } else {
      linhas = ranking();
      if (!linhas.length) {
        const rec = store.get('recentes', []).map((id) => COND.find((c) => c.id === id)).filter(Boolean);
        ol.innerHTML = '<li class="nota">As hipóteses aparecem aqui conforme os sintomas.</li>' +
          (rec.length ? `<li class="recentes"><span class="nota">Usadas recentemente:</span> ${rec.map((c) => `<button class="pill" data-cond="${c.id}">${esc(c.nome)}</button>`).join('')}</li>` : '');
        return;
      }
    }
    ol.innerHTML = linhas.map(({ c, frac, bate }) => `
      <li><button class="hip ${st.cond && st.cond.id === c.id ? 'ativo' : ''}" data-cond="${c.id}">
        <span class="hip-nome">${esc(c.nome)} ${c.ps ? '<em class="tag-ps">PS</em>' : ''}</span>
        <span class="hip-cid">${esc(c.cid[0])}</span>
        ${frac != null ? `<span class="barra"><span style="width:${Math.round(frac * 100)}%"></span></span>
        <span class="hip-bate">${bate.map((b) => esc(SINT[b][0])).join(' · ')}</span>` : `<span class="hip-bate">${esc(c.grupo)}</span>`}
      </button></li>`).join('');
  }
  function renderTodas() {
    const grupos = {};
    COND.forEach((c) => (grupos[c.grupo] ||= []).push(c));
    $('#todas').innerHTML = Object.entries(grupos).map(([g, cs]) =>
      `<h3>${esc(g)}</h3><div class="todas-lista">${cs.map((c) => `<button class="pill" data-cond="${c.id}">${esc(c.nome)}</button>`).join('')}</div>`).join('');
  }

  // ---------------- alertas ----------------
  function alertasDe(itens, cond) {
    const out = [];
    const ja = new Set();
    for (const it of itens) {
      for (const [flag, tag, nivel, msg] of window.REGRAS) {
        if (st.flags.has(flag) && it.t.includes(tag)) {
          const k = it.n + msg; if (ja.has(k)) continue; ja.add(k);
          out.push({ nivel, msg, med: it.n });
        }
      }
      if (cond && window.PROIBE[cond.id]) {
        for (const [tag, msg] of window.PROIBE[cond.id]) if (it.t.includes(tag)) out.push({ nivel: 'alto', msg, med: it.n });
      }
    }
    return out;
  }
  function alertaItem(it, cond) { return alertasDe([it], cond); }
  function htmlAlertas(lista) {
    if (!lista.length) return '';
    return `<ul class="alertas">${lista.map((a) => `<li class="a-${a.nivel}"><b>${esc(a.med)}:</b> ${esc(a.msg)}</li>`).join('')}</ul>`;
  }

  // ---------------- texto de prescrição ----------------
  function textoPrescricao(itens, { comQtd = true } = {}) {
    const porVia = {};
    itens.forEach((it) => (porVia[it.v] ||= []).push(it));
    const blocos = [];
    VIA_ORDEM.concat(Object.keys(porVia).filter((v) => !VIA_ORDEM.includes(v))).forEach((v) => {
      const lista = porVia[v]; if (!lista) return;
      blocos.push(VIA_TITULO[v] || ('USO ' + v.toUpperCase()));
      lista.forEach((it, i) => {
        blocos.push(`${i + 1}. ${it.n}${comQtd && it.q ? ' ———— ' + it.q : ''}`);
        blocos.push(it.p);
      });
      blocos.push('');
    });
    return blocos.join('\n').trim();
  }

  // ---------------- painel da patologia ----------------
  function selecao(c) {
    if (!st.sel[c.id]) {
      const s = { casa: {}, unid: {}, ex: {} };
      const grave = (it) => alertaItem(it, c).some((a) => a.nivel === 'alto');
      const excluidos = [];
      ['casa', 'unid'].forEach((tipo) => c[tipo].forEach((r, i) => {
        const it = item(r); if (!it) return;
        if (!it.opc && (grave(it) || it.bloqueado)) { s[tipo][i] = false; excluidos.push({ tipo, it }); } else s[tipo][i] = !it.opc;
      }));
      // contraindicação grave removeu um item padrão → marca UMA alternativa da mesma classe (sem alerta grave)
      const familia = (it) => { const t = it.t || []; return t.includes('atb') ? 'atb' : t.some((x) => ['aine', 'dipirona', 'paracetamol', 'opioide', 'aas'].includes(x)) ? 'analg' : t.includes('corticoide') ? 'cort' : 'x:' + it.key; };
      const motivoAlt = /alerg|gestant|lactant|contraind|no lugar|em vez|alternativ|se n[ãa]o puder/i;
      excluidos.forEach(({ tipo, it: ex }) => {
        const cand = c[tipo].map((r, i) => ({ i, it: item(r) })).filter(({ i, it }) => it && it.opc && it.alt && !s[tipo][i] && !grave(it) && !it.bloqueado);
        const escolha = cand.find(({ it }) => familia(it) === familia(ex)) || cand.find(({ it }) => motivoAlt.test(it.alt) && familia(it) === familia(ex).replace(/^x:.*/, familia(it)));
        if (escolha) s[tipo][escolha.i] = true;
      });
      exames(c).forEach((_, i) => { s.ex[i] = !/^sem exames/i.test(_); });
      st.sel[c.id] = s;
    }
    return st.sel[c.id];
  }
  const exames = (c) => (st.modo === 'ps' ? (c.exPs.length ? c.exPs : c.exUbs) : (c.exUbs.length ? c.exUbs : c.exPs));
  const itensCasa = (c) => c.casa.map(item).filter(Boolean);
  const itensUnid = (c) => c.unid.map(item).filter(Boolean);
  const escolhidos = (c, tipo) => {
    const s = selecao(c); const lista = tipo === 'casa' ? itensCasa(c) : itensUnid(c);
    return lista.filter((_, i) => s[tipo][i]);
  };

  function abrir(id) {
    st.cond = COND.find((c) => c.id === id) || null;
    if (st.cond) { const r = store.get('recentes', []).filter((x) => x !== id); r.unshift(id); store.set('recentes', r.slice(0, 8)); }
    if (st.cond && st.cond.grupo === 'Puerpério / Amamentação' && !st.flags.has('lactante')) { st.flags.add('lactante'); st.sel = {}; renderFlags(); toast('Marcado: Lactante (alertas de amamentação ativos)'); }
    if (st.cond && st.cond.grupo === 'Gestação' && !st.flags.has('gestante')) { st.flags.add('gestante'); st.sel = {}; renderFlags(); toast('Marcado: Gestante (alertas de gestação ativos)'); }
    if (st.cond) efSugerir(st.cond);
    renderPainel(); renderHipoteses();
    if (window.innerWidth < 900) $('#painelCondicao').scrollIntoView({ behavior: 'smooth' });
  }

  function linhaItem(it, i, tipo, marcado, c) {
    const o = window.ORIGENS[it.o] || {};
    const al = alertaItem(it, c);
    const pior = al.some((a) => a.nivel === 'alto') ? 'alto' : al.length ? 'medio' : '';
    return `<li class="item ${marcado ? '' : 'off'} ${pior ? 'tem-' + pior : ''}">
      <label class="item-cab">
        <input type="checkbox" data-tipo="${tipo}" data-i="${i}" ${marcado ? 'checked' : ''}>
        <span class="item-nome">${esc(it.n)}${it.q ? ` <span class="qtd">— ${esc(it.q)}</span>` : ''}</span>
        <span class="orig ${o.cls || ''}" title="${esc(o.title || '')}">${esc(o.label || '')}</span>
      </label>
      <div class="item-pos">${it.v !== 'oral' ? `<span class="via">${esc(it.v)}</span> ` : ''}${esc(it.p)}</div>
      ${it.alt ? `<div class="item-alt">↳ ${esc(it.alt)}</div>` : ''}
      ${it.obs ? `<div class="item-alt">ℹ︎ ${esc(it.obs)}</div>` : ''}
      ${al.map((a) => `<div class="item-alerta a-${a.nivel}">⚠ ${esc(a.msg)}</div>`).join('')}
    </li>`;
  }

  function renderPainel() {
    const c = st.cond; const painel = $('#painelCondicao');
    if (!c) return;
    const s = selecao(c);
    const ex = exames(c);
    const casa = itensCasa(c), unid = itensUnid(c);
    const ps = st.modo === 'ps';
    const salvo = modeloSalvo(c); const salvoBloq = !salvo && store.get('modelo:' + c.id, null);
    const blocoUnid = unid.length ? `
      <div class="bloco ${ps ? '' : 'recolhido'}">
        <div class="bloco-cab"><h3>Prescrição na unidade ${ps ? '' : '<small>(PS/UPA)</small>'}</h3>
          <button class="mini" data-copiar="unid">Copiar</button></div>
        <ul class="itens">${unid.map((it, i) => linhaItem(it, i, 'unid', s.unid[i], c)).join('')}</ul>
      </div>` : '';
    const blocoCasa = casa.length ? `
      <div class="bloco">
        <div class="bloco-cab"><h3>Prescrição ${c.ps ? 'de alta' : 'domiciliar'}</h3>
          <div class="botoes"><button class="mini" data-addreceita>+ receita avulsa</button><button class="mini primario" data-copiar="casa">Copiar</button></div></div>
        <ul class="itens">${casa.map((it, i) => linhaItem(it, i, 'casa', s.casa[i], c)).join('')}</ul>
        ${salvoBloq ? '<p class="alerta-modelo">⚠︎ Seu modelo salvo NÃO foi usado neste paciente (alergia/contraindicação ou dose por peso) — a receita abaixo segue os itens marcados.</p>' : ''}
        <details class="modelo" ${salvo ? 'open' : ''}>
          <summary>${salvo ? '★ Usando o seu modelo salvo' : 'Editar texto / salvar como meu modelo'}</summary>
          <textarea id="txtCasa" rows="10">${esc(salvo ?? textoPrescricao(escolhidos(c, 'casa')))}</textarea>
          <div class="botoes">
            <button class="mini" data-salvarmodelo>Salvar como meu modelo</button>
            ${salvo ? '<button class="mini link" data-resetmodelo>Voltar ao padrão</button>' : ''}
          </div>
        </details>
      </div>` : '';

    painel.innerHTML = `
      <div class="card cond">
        <div class="cond-cab">
          <div>
            <span class="grupo">${esc(c.grupo)}</span>
            <h2>${esc(c.nome)}</h2>
          </div>
          <button class="mini" data-copiar="cid">Copiar CID</button>
        </div>
        <div class="cid"><b>${esc(c.cid[0])}</b> — ${esc(c.cid[1])}</div>
        <div class="dif"><span>Diferenciais:</span> ${c.dif.map((d) => `<b>${esc(d[0])}</b> ${esc(d[1])}`).join(' · ')}</div>
        ${c.alarme.length ? `<div class="alarme"><h3>Sinais de alarme / red flags</h3><ul>${c.alarme.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
        ${htmlAlertas(alertasDe([...escolhidos(c, 'casa'), ...escolhidos(c, 'unid')], c).filter((a) => a.nivel === 'alto'))}

        ${blocoPedCalc(c)}
        <div class="bloco">
          <div class="bloco-cab"><h3>Exames ${ps ? '(PS/UPA)' : '(UBS)'}</h3><button class="mini" data-copiar="ex">Copiar</button></div>
          <ul class="itens ex">${ex.map((e, i) => `<li class="${s.ex[i] ? '' : 'off'}"><label><input type="checkbox" data-tipo="ex" data-i="${i}" ${s.ex[i] ? 'checked' : ''}> ${esc(e)}</label></li>`).join('')}</ul>
        </div>
        ${ps ? blocoUnid + blocoCasa : blocoCasa + blocoUnid}
        <div class="bloco">
          <div class="bloco-cab"><h3>Orientações</h3><button class="mini" data-copiar="orient">Copiar</button></div>
          <ul class="orient">${c.orient.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
          ${c.obs ? `<p class="obs">ℹ︎ ${esc(c.obs)}</p>` : ''}
        </div>
        <div class="bloco leigo">
          <div class="bloco-cab"><h3>📱 Para o paciente (linguagem simples)</h3>
            <div class="botoes">
              <button class="mini ia-btn" data-leigoia title="Reescreve para este caso, em linguagem bem simples">✨ Melhorar com IA</button>
              <button class="mini" data-leigo="copiar">Copiar</button>
              <button class="mini whats" data-leigo="whats">WhatsApp</button>
            </div></div>
          <textarea id="txtLeigo" rows="10">${esc(textoLeigo(c))}</textarea>
          <p class="nota">Texto para entregar ou mandar ao paciente — sem dados pessoais. O WhatsApp abre para você escolher o contato.</p>
        </div>
      </div>

      <div class="card evolucao">
        <div class="bloco-cab">
          <h2>Evolução completa</h2>
          <div class="botoes">
            ${ps ? `<label class="mini-check"><input type="checkbox" id="chkEmTempo" ${st.emTempo ? 'checked' : ''}> incluir "Em tempo"</label>` : ''}
            <button class="primario" data-copiar="evolucao">Copiar evolução</button>
          </div>
        </div>
        <textarea id="txtEvolucao" rows="22"></textarea>
        <p class="nota">Gerada a partir da anamnese, sinais vitais, condições marcadas e itens selecionados. Pode editar antes de copiar.</p>
      </div>`;
    atualizarEvolucao();
  }

  // orientações + sinais de alarme em linguagem leiga (para o paciente)
  const LEIGO = {
    dispneia: 'falta de ar, cansaço para respirar ou respiração muito rápida', febre: 'febre que não baixa com o remédio ou que dura mais de 3 dias',
    vomito: 'vômitos que não param ou não conseguir beber líquidos', disenteria: 'sangue ou catarro nas fezes', rigidezNuca: 'pescoço duro ou dor forte ao dobrar o pescoço',
    deficitFocal: 'boca torta, fraqueza ou formigamento de um lado do corpo, ou dificuldade para falar', cefaleiaSubita: 'dor de cabeça muito forte e repentina, a pior da vida',
    rebaixamento: 'sonolência excessiva, confusão ou dificuldade para acordar', convulsao: 'convulsão (ataque, tremores com perda de consciência)',
    dorToracica: 'dor ou aperto no peito', sincope: 'desmaio', sudorese: 'suor frio', dorToracicaIrrad: 'dor que vai para o braço, pescoço ou queixo',
    petequias: 'manchas vermelhas na pele, sangramento de gengiva ou nariz', exantema: 'manchas vermelhas espalhadas pelo corpo', hematuria: 'urina com sangue',
    dorLombar: 'dor forte nas costas ou na lateral da barriga', angioedema: 'inchaço nos lábios, língua ou olhos', sibilancia: 'chiado no peito',
    edemaMMII: 'inchaço nas pernas', alarmeOcular: 'dor forte no olho ou piora da visão', otorreia: 'saída de secreção do ouvido', palpitacao: 'coração disparado',
    hipoacusia: 'perda de audição', corrimento: 'corrimento com cheiro forte', ciatica: 'dor que desce para a perna, fraqueza ou dormência na perna',
  };
  // palavras dos "sinais de alarme" técnicos da patologia → frase leiga
  const ALARME_KW = [
    [/dispn|esfor[cç]o resp|tiragem|taquipn|SpO|satura|hipox|cian/i, 'falta de ar, cansaço para respirar ou lábios arroxeados'],
    [/dor abdominal|dor na barriga|abdome agudo|defesa/i, 'dor forte e contínua na barriga'],
    [/v[ôo]mito/i, 'vômitos que não param ou não conseguir beber líquidos'],
    [/sangr|hemorr|pet[ée]quia|melena|hemat[eê]m|enterorrag/i, 'qualquer sangramento (nariz, gengiva, urina, fezes escuras ou com sangue) ou manchas roxas'],
    [/desidrat|diurese|olig|sede/i, 'boca muito seca, muita sede, urinar pouco ou olhos fundos'],
    [/rebaix|sonol|letarg|confus|irritab|Glasgow|consci/i, 'sonolência excessiva, confusão ou dificuldade para acordar'],
    [/hipotens|choque|lipot[ií]mia|s[ií]ncope|desmai|tontura/i, 'tontura forte ou desmaio ao ficar em pé'],
    [/convuls/i, 'convulsão (ataque, tremores com perda de consciência)'],
    [/d[ée]ficit|hemipar|afasia|disartr/i, 'boca torta, fraqueza de um lado do corpo ou dificuldade para falar'],
    [/rigidez de nuca|meníng|mening/i, 'pescoço duro ou dor de cabeça muito forte com febre'],
    [/dor tor[aá]cica|dor no peito/i, 'dor ou aperto no peito'],
    [/febre (persist|> ?3|alta)|febre.*(dias|72)/i, 'febre que não baixa com o remédio ou que dura mais de 3 dias'],
    [/edema de (face|l[aá]bio|glote)|angioedema|estridor/i, 'inchaço nos lábios, língua ou garganta, ou barulho ao respirar'],
    [/vis(ão|ual)|acuidade/i, 'piora da visão ou dor forte no olho'],
    [/movimenta|bcf|perda de l[ií]quido|contra[cç][õo]es/i, 'bebê mexendo menos, perda de líquido ou contrações'],
  ];
  function textoLeigo(c) {
    const al = (c.alarme || []).join(' ');
    const doQuadro = ALARME_KW.filter(([re]) => re.test(al)).map(([, t]) => t);
    const temIds = new Set(Object.keys(c.s || {}));
    const ids = [...new Set(Object.entries(c.s || {}).sort((a, b) => b[1] - a[1]).slice(0, 4).flatMap(([id]) => ALARME_SINT[id] || []))]
      .filter((id) => LEIGO[id] && !(temIds.has(id) && id !== 'febre'));
    const alarmes = [...new Set([...doQuadro, ...(doQuadro.length >= 4 ? [] : ids.map((id) => LEIGO[id]))])].slice(0, 7);
    alarmes.push('piora do estado geral ou se não melhorar como esperado');
    const tecnico = /notifica|compuls|\bCID\b|PCDT|SINAN|protocolo|\bRX\b|solicitar/i;
    const simplificar = (o) => o.replace(/\s*\d[\d,.]*\s*(mL|mg)\/kg(\/dia)?/gi, '').replace(/\s*\([^)]*\b(mL|mg)\b[^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
    return [
      `ORIENTAÇÕES — ${c.nome.split(' (')[0].split(' / ')[0]}`,
      ...c.orient.filter((o) => !tecnico.test(o)).map((o) => '• ' + simplificar(o).replace(/\.?$/, '.')),
      '',
      'PROCURE ATENDIMENTO IMEDIATAMENTE SE:',
      ...alarmes.map((a) => '• ' + a.charAt(0).toUpperCase() + a.slice(1) + '.'),
      '',
      'Tome os remédios exatamente como está na receita. Em caso de dúvida, volte à unidade.',
    ].join('\n');
  }

  // doses por peso (condição pediátrica) — usa peso/idade do atendimento
  function blocoPedCalc(c) {
    if (!c.pedCalc || !c.pedCalc.length) return '';
    const kg = parseFloat($('#peso').value); const anos = idade();
    const itens = c.pedCalc.map((id) => (window.PEDIATRIA || []).find((x) => x.id === id)).filter(Boolean);
    if (!(kg > 0)) return `<div class="bloco ped-cond"><div class="bloco-cab"><h3>Doses por peso</h3></div><p class="nota">⚖︎ Preencha o <b>peso</b> (e a idade) do paciente para calcular: ${itens.map((m) => esc(m.nome.split(' —')[0])).join(', ')}.</p></div>`;
    return `<div class="bloco ped-cond"><div class="bloco-cab"><h3>Doses por peso — ${String(kg).replace('.', ',')} kg${anos != null ? ', ' + String(anos).replace('.', ',') + ' anos' : ''}</h3></div>
      <ul class="itens">${itens.map((m) => { const esp = pedMgkgDaCond(c, m.id); const r = (m.idadeMin != null && anos == null) ? { texto: '⚠︎ Informe a idade do paciente para liberar esta dose.', bloqueado: true } : calcPed(m, kg, anos, mgkgPed(m, esp)); return `<li class="${r.bloqueado ? 'off' : ''}"><div><b>${esc(m.nome)}</b>${r.calc ? ` <span class="nota">${esc(r.calc)}</span>` : ''}<div class="ped-texto">${esc(r.texto)}</div></div><button class="mini" data-pedtxt="${esc(m.nome + '\n' + r.texto)}">Copiar</button></li>`; }).join('')}</ul></div>`;
  }

  function textoCasaAtual(c) {
    const ta = $('#txtCasa');
    const salvo = modeloSalvo(c);
    if (ta && (ta.dataset.editado === '1' || salvo)) return ta.value.trim();
    return textoPrescricao(escolhidos(c, 'casa'));
  }

  function sinaisVitais() {
    const v = (id) => $('#' + id).value.trim();
    const partes = [];
    if (v('sv-pa')) partes.push('PA ' + v('sv-pa') + ' mmHg');
    if (v('sv-fc')) partes.push('FC ' + v('sv-fc') + ' bpm');
    if (v('sv-fr')) partes.push('FR ' + v('sv-fr') + ' irpm');
    if (v('sv-sat')) partes.push('SpO₂ ' + v('sv-sat') + '% em AA');
    if (v('sv-tax')) partes.push('Tax ' + v('sv-tax') + ' °C');
    if (v('sv-hgt')) partes.push('HGT ' + v('sv-hgt') + ' mg/dL');
    return partes.length ? 'SSVV: ' + partes.join(' | ') + '.' : '';
  }

  // Anamnese formatada (cabeçalho + texto + condições marcadas + negativas) e exame físico — usados sem precisar de patologia
  // Negativas pertinentes: sintomas das hipóteses (e diferenciais) que o paciente NÃO citou
  const NEG_FORA = new Set(['imobilizacao', 'falhaContraceptiva', 'colesterol', 'drcDialise', 'usoDiuretico', 'etilismo', 'ingestaoToxica', 'usoAntiemetico', 'preNatalRotina', 'sintomasPE', 'dmgExame', 'sifilisExame', 'bacteriuria', 'amamentacao', 'contracepcao', 'contracepcaoEmergencia', 'violenciaSexual', 'lactenteJovem', 'febreSemFoco', 'recusaAlimentar', 'kussmaul', 'pulsoIrregular', 'bradicardia', 'sinaisDesidratacao', 'desidratacao', 'criseLeiga', 'linguaFramboesa', 'esforcoResp', 'hiperglicemia', 'hirsutismo', 'cicloIrregular', 'puxaOrelha', 'choroExcessivo', 'sintomas10d', 'relacaoDesprotegida', 'exposicaoAlergeno', 'asmaDpocPrevio', 'tabagismo', 'estertores', 'hipotensao', 'paAlta',
    'diabetico', 'epidemiaDengue', 'focoInfeccioso', 'taquipneia', 'gestacao', 'pararFumar', 'dorParede', 'trauma', 'vertigemPosicional', 'hipotireoidismo',
    'palidez', 'cefaleiaPulsatil', 'cefaleiaAperto', 'tosseProd', 'grumoso', 'amareloEsverdeado', 'odorVaginal', 'pruridoNoturno', 'lendeas', 'picada',
    'ferida', 'dorDente', 'maoPeBoca', 'varicela', 'crostas', 'abscesso', 'monoartrite', 'dorMuscular', 'insonia', 'ansiedade', 'tristeza', 'ideacao', 'secrecaoAquosa', 'pruridoOcular', 'dermatite', 'prurido']);
  // sinais de alarme a negar sempre que a queixa estiver presente (entram primeiro na lista)
  const ALARME_SINT = {
    cefaleia: ['cefaleiaSubita', 'rigidezNuca', 'deficitFocal', 'rebaixamento', 'convulsao', 'febre', 'vomito'],
    dorToracica: ['dispneia', 'sudorese', 'sincope', 'dorToracicaIrrad', 'palpitacao'],
    dorAbdominal: ['febre', 'vomito', 'disenteria', 'hematuria'],
    odinofagia: ['dispneia', 'tosse', 'coriza', 'otalgia'],
    tosse: ['dispneia', 'dorToracica', 'febre', 'sibilancia'],
    dispneia: ['dorToracica', 'sibilancia', 'edemaMMII', 'febre'],
    febre: ['rigidezNuca', 'exantema', 'petequias', 'dispneia', 'rebaixamento'],
    diarreia: ['disenteria', 'vomito', 'febre'],
    disuria: ['febre', 'dorLombar', 'hematuria', 'corrimento'],
    dorLombar: ['febre', 'ciatica', 'disuria', 'hematuria'],
    tontura: ['deficitFocal', 'cefaleiaSubita', 'sincope', 'palpitacao', 'dorToracica'],
    vertigem: ['deficitFocal', 'cefaleiaSubita', 'hipoacusia', 'zumbido'],
    olhoVermelho: ['alarmeOcular', 'fotofobia'],
    otalgia: ['otorreia', 'febre', 'hipoacusia'],
    exantema: ['febre', 'petequias', 'dispneia', 'angioedema'],
    urticas: ['angioedema', 'dispneia'],
  };
  ['cefaleiaPulsatil', 'cefaleiaAperto'].forEach((x) => (ALARME_SINT[x] = ALARME_SINT.cefaleia));
  ALARME_SINT.colica = ALARME_SINT.dorAbdominal; ALARME_SINT.epigastralgia = ALARME_SINT.dorAbdominal; ALARME_SINT.polaciuria = ALARME_SINT.disuria;
  const GRUPOS_SINT = [
    ['dorAbdominal', 'colica', 'epigastralgia', 'dorSuprapubica', 'dorFlanco'],
    ['cefaleia', 'cefaleiaPulsatil', 'cefaleiaAperto', 'cefaleiaSubita', 'dorRetroorbitaria'],
    ['tosse', 'tosseProd'], ['dorToracica', 'dorPleuritica', 'dorParede'],
    ['corrimento', 'grumoso', 'amareloEsverdeado', 'odorVaginal'], ['prurido', 'pruridoNoturno', 'pruridoVaginal', 'pruridoNasal', 'pruridoOcular'],
    ['vertigem', 'tontura'], ['dorLombar', 'ciatica'],
  ];
  const NEG_TXT = {
    placas: 'placas ou exsudato em orofaringe', linfonodo: 'linfonodomegalia cervical', dorFacial: 'dor ou pressão facial', secrecaoPurulenta: 'secreção nasal purulenta',
    hipoacusia: 'hipoacusia', cefaleiaSubita: 'cefaleia súbita de forte intensidade', disenteria: 'sangue ou muco nas fezes', dorFlanco: 'dor em flanco',
    ciatica: 'irradiação da dor para membros inferiores', corrimento: 'corrimento vaginal', pruridoVaginal: 'prurido vulvovaginal', ulceraGenital: 'lesões genitais',
    eritemaPele: 'eritema ou calor local', edemaLocal: 'edema local', urticas: 'urticas', vesiculas: 'lesões vesiculares', dorQueimacaoPele: 'dor em queimação na pele',
    dorToracicaIrrad: 'irradiação da dor para membro superior ou mandíbula', dorPleuritica: 'dor ventilatório-dependente', ortopneia: 'ortopneia ou dispneia paroxística noturna',
    edemaMMII: 'edema de membros inferiores', secrecaoOcular: 'secreção ocular purulenta', alarmeOcular: 'dor ocular intensa ou baixa acuidade visual',
    rigidezNuca: 'rigidez de nuca', rebaixamento: 'alteração do nível de consciência', convulsao: 'crises convulsivas', deficitFocal: 'déficit neurológico focal',
    perdaPeso: 'perda ponderal', hipoglicemia: 'episódios de hipoglicemia', parestesiaMaos: 'parestesias', dorRetroorbitaria: 'dor retro-orbitária',
    petequias: 'petéquias ou sangramentos', prostracao: 'prostração', epistaxe: 'epistaxe', dorAnal: 'dor ou sangramento anal', fadiga: 'fadiga',
    exantema: 'exantema', vomito: 'vômitos', nausea: 'náuseas', diarreia: 'diarreia', dorLombar: 'dor lombar', hematuria: 'hematúria',
  };
  const negRotulo = (id) => NEG_TXT[id] || SINT[id][0].toLowerCase();
  // trava extra: não negar se alguma palavra principal do sintoma (≥ 5 letras) aparece no texto
  const PALAVRAS_GENERICAS = new Set(['cefaleia', 'local', 'nasal', 'vaginal', 'ocular', 'abdominal', 'cervical', 'facial', 'lesoes', 'membros', 'inferiores', 'superior', 'intensa', 'forte', 'intensidade', 'subita', 'sangramentos', 'alteracao', 'nivel', 'consciencia', 'secrecao', 'purulenta']);
  function palavraCitada(id, t) {
    const palavras = norm(negRotulo(id) + ' ' + SINT[id][0]).split(/[^a-z]+/).filter((w) => w.length >= 5 && !PALAVRAS_GENERICAS.has(w));
    return palavras.some((w) => new RegExp('\\b' + w.slice(0, Math.max(5, w.length - 2))).test(t));
  }
  function citado(id, t) { return SINT[id].slice(1).some((sin) => t.includes(sin)); }
  function negativasPertinentes(texto) {
    const t = ' ' + norm(texto) + ' ';
    const ativos = sintomasAtivos();
    const base = st.cond ? [st.cond] : ranking().slice(0, 3).map((r) => r.c);
    const conds = [...base];
    base.forEach((c) => (c.dif || []).forEach(([cid]) => { const d = COND.find((x) => x.cid[0] === cid); if (d && !conds.includes(d)) conds.push(d); }));
    const peso = {};
    conds.forEach((c, i) => Object.entries(c.s).forEach(([id, w]) => {
      if (i >= base.length && w < 2) return; // dos diferenciais, só os sintomas mais característicos
      peso[id] = (peso[id] || 0) + w * (i < base.length ? 2 : 1);
    }));
    // sintomas "irmãos": se um do grupo foi citado, não negar os outros (ex.: dor abdominal × cólica)
    const irmaoCitado = (id) => GRUPOS_SINT.some((g) => g.includes(id) && g.some((x) => x !== id && (ativos.has(x) || citado(x, t))));
    const alarme = [...new Set([...ativos].flatMap((x) => ALARME_SINT[x] || []))];
    alarme.forEach((id) => { peso[id] = (peso[id] || 0) + 100; }); // alarme primeiro
    const tempCit = temperaturaInformada().citada;
    const ok = (id) => SINT[id] && !(id === 'febre' && tempCit) && !ativos.has(id) && !citado(id, t) && !palavraCitada(id, t) && (alarme.includes(id) || !irmaoCitado(id));
    return Object.entries(peso)
      .filter(([id]) => ok(id) && (!NEG_FORA.has(id) || alarme.includes(id)))
      .sort((a, b) => b[1] - a[1]).slice(0, 12).map(([id]) => negRotulo(id));
  }
  const listaPt = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1] : arr[0] || '');

  // Anamnese completa: identificação, QP, HDA com sintomas citados + negativas pertinentes, antecedentes
  function textoAnamnese() {
    let anam = $('#anamnese').value.trim();
    if (anam && !/[.!?]$/.test(anam)) anam += '.';
    const fem = st.sexo === 'F';
    const id = idade(); const peso = $('#peso').value.trim();
    const cab = [fem ? 'Paciente do sexo feminino' : 'Paciente do sexo masculino', id != null ? `${id} anos` : '', peso ? `${peso} kg` : ''].filter(Boolean).join(', ') + '.';
    const ativos = [...sintomasAtivos()].filter((x) => !NEG_FORA.has(x) || ['tosseProd', 'cefaleiaPulsatil', 'cefaleiaAperto', 'odorVaginal', 'grumoso', 'dorDente', 'ferida', 'picada', 'ansiedade', 'tristeza', 'insonia', 'monoartrite', 'dorMuscular', 'abscesso', 'prurido', 'dermatite', 'pruridoOcular', 'lendeas', 'crostas', 'varicela', 'maoPeBoca', 'contracepcao', 'contracepcaoEmergencia', 'falhaContraceptiva', 'preNatalRotina', 'amamentacao', 'choroExcessivo', 'puxaOrelha', 'criseLeiga', 'recusaAlimentar', 'colesterol', 'violenciaSexual', 'hirsutismo', 'cicloIrregular', 'etilismo', 'ingestaoToxica'].includes(x));
    // QP sem redundância (cefaleia + cefaleia pulsátil → só a específica) e na ordem de importância da hipótese principal
    const princ = st.cond || (ranking()[0] || {}).c;
    const qpLista = ativos.filter((x) => !GRUPOS_SINT.some((g) => g[0] === x && g.slice(1).some((y) => ativos.includes(y))))
      .sort((a, b) => ((princ && princ.s[b]) || 0) - ((princ && princ.s[a]) || 0));
    const qp = qpLista.length ? 'QP: ' + listaPt(qpLista.slice(0, 4).map((x) => SINT[x][0].toLowerCase())) + '.' : '';
    const flagsTxt = [...st.flags].map((f) => window.FLAGS_TEXTO[f]).filter(Boolean).join(' ');
    const todo = anam + ' ' + flagsTxt;
    const pert = negativasPertinentes(todo);
    // negativas gerais (febre, TGI, sangramentos) que não estejam já entre as pertinentes
    const t = norm(todo);
    const gerais = [];
    if (!/febr|tax|temperatura|afebril/.test(t) && !temperaturaInformada().citada && !pert.includes('febre')) gerais.push('febre');
    if (!/diarr|vomit|nause|enjo|evacu|constip|abdom|fezes|gastro|epigastr/.test(t) && !pert.some((p) => /vômit|náuse|diarr|abdom/.test(p))) gerais.push('alterações gastrointestinais');
    if (!/sangr|hematu|melena|hematem|enterorrag|epistax/.test(t) && !pert.some((p) => /sangr|hematúria/.test(p))) gerais.push('sangramentos');
    const negHda = [...pert, ...gerais];
    const hda = anam ? 'HDA: ' + anam + (negHda.length ? ' Nega ' + listaPt(negHda) + '.' : '') : (negHda.length ? 'Nega ' + listaPt(negHda) + '.' : '');
    const ant = [];
    if (flagsTxt) ant.push(flagsTxt);
    if (!/comorb|\bhas\b|hipertens|diabet|\bdm\b|asma|dpoc|cardiop|tireoid|\bhiv\b|\bdrc\b|\birc\b/.test(t) && !['drc', 'dm', 'has', 'hepatopata', 'asma'].some((f) => st.flags.has(f))) ant.push('Nega comorbidades.');
    if (!/uso de|\busa\b|medica|\bmuc\b|em uso|toma /.test(t) && !st.flags.has('anticoagulado')) ant.push('Nega uso de medicações contínuas.');
    if (!/alerg/.test(t) && ![...st.flags].some((f) => f.startsWith('alergia'))) ant.push('Nega alergias medicamentosas.');
    return [cab, qp, hda, ant.length ? 'Antecedentes: ' + ant.join(' ') : ''].filter(Boolean).join('\n');
  }
  // Exame físico por sistemas: marcado + vazio = normal; texto digitado substitui o normal daquele sistema
  const EF_SIS = [
    { k: 'geral', r: 'Estado geral', pre: '' }, { k: 'acv', r: 'Cardiovascular', pre: 'ACV' }, { k: 'ar', r: 'Respiratório', pre: 'AR' },
    { k: 'abd', r: 'Abdome', pre: 'ABD' }, { k: 'neu', r: 'Neurológico', pre: 'NEU' }, { k: 'ext', r: 'Extremidades', pre: 'EXT' },
    { k: 'orl', r: 'Orofaringe / otoscopia', pre: 'ORL', n: 'Orofaringe sem hiperemia ou exsudato; otoscopia bilateral com membrana timpânica íntegra e translúcida.', off: true },
    { k: 'pele', r: 'Pele', pre: 'PELE', n: 'Íntegra, sem lesões, exantema ou petéquias.', off: true },
    { k: 'osteo', r: 'Osteomuscular', pre: 'OSTEO', n: 'Sem deformidades, edema ou dor à palpação; mobilidade preservada.', off: true },
  ];
  function efNormal(s) {
    if (s.n) return s.n;
    const linhas = window.FRASES.exameFisico(st.sexo === 'F').split('\n');
    if (!s.pre) return linhas[0];
    const l = linhas.find((x) => x.startsWith(s.pre + ':')) || '';
    return l.slice(s.pre.length + 1).trim();
  }
  function efEstado() {
    if (!st.ef) st.ef = Object.fromEntries(EF_SIS.map((s) => [s.k, { on: !s.off, alt: '' }]));
    return st.ef;
  }
  // abre sistemas pertinentes à hipótese (sem mexer no que o médico já marcou)
  function efSugerir(c) {
    const ef = efEstado(); if (st.efMexido) return;
    const s = c.s || {}; const g = (c.grupo || '') + ' ' + c.nome;
    ef.orl.on = !!(s.odinofagia || s.otalgia || s.placas || s.coriza || /ORL|otite|faring|amigdal/i.test(g));
    ef.pele.on = !!(/Pele|derma|exantema|varicela|zoster|escabiose|impetigo|celulite/i.test(g) || s.exantema || s.petequias);
    ef.osteo.on = !!(/lombalg|osteo|gota|tendin|artr|trauma|entorse|cervical/i.test(g) || s.dorLombar || s.artralgia || s.trauma);
    renderEf();
  }
  function renderEf() {
    const box = $('#efSistemas'); if (!box) return;
    const ef = efEstado();
    box.innerHTML = EF_SIS.map((s) => `<div class="ef-linha ${ef[s.k].on ? 'on' : ''}">
      <label class="ef-sis"><input type="checkbox" data-efon="${s.k}" ${ef[s.k].on ? 'checked' : ''}> ${esc(s.r)}</label>
      <input data-efalt="${s.k}" value="${esc(ef[s.k].alt)}" placeholder="alteração (vazio = normal)" ${ef[s.k].on ? '' : 'disabled'} title="${esc(efNormal(s))}">
    </div>`).join('');
  }
  function textoExameFisico() {
    const sv = sinaisVitais(); const ef = efEstado();
    const linhas = EF_SIS.filter((s) => ef[s.k].on).map((s) => {
      let t = ef[s.k].alt.trim() || efNormal(s); t = t.charAt(0).toUpperCase() + t.slice(1);
      return s.pre ? `${s.pre}: ${t.replace(/\.?$/, '.')}` : t.replace(/\.?$/, '.');
    });
    return ['EXAME FÍSICO', sv, ...linhas].filter(Boolean).join('\n');
  }

  function gerarEvolucao() {
    const c = st.cond; if (!c) return '';
    const s = selecao(c);
    const L = [];
    L.push(textoAnamnese());
    L.push('');
    L.push(textoExameFisico());
    L.push('');
    L.push('HIPÓTESE DIAGNÓSTICA');
    L.push(`${c.cid[0]} – ${c.cid[1]}`);
    L.push('Diferenciais: ' + c.dif.map((d) => `${d[0]} – ${d[1]}`).join('; ') + '.');
    const ex = exames(c).filter((_, i) => s.ex[i]);
    if (ex.length) { L.push(''); L.push('EXAMES COMPLEMENTARES'); ex.forEach((e) => L.push('- ' + e)); }
    const un = escolhidos(c, 'unid');
    if (st.modo === 'ps' && un.length) { L.push(''); L.push('PRESCRIÇÃO NA UNIDADE'); L.push(textoPrescricao(un, { comQtd: false })); }
    const casa = textoCasaAtual(c);
    if (casa) { L.push(''); L.push(c.ps ? 'PRESCRIÇÃO DE ALTA' : 'PRESCRIÇÃO'); L.push(casa); }
    if (c.orient.length) { L.push(''); L.push('ORIENTAÇÕES'); c.orient.slice(0, 3).forEach((o) => L.push('- ' + o)); }
    const al = alertasDe([...escolhidos(c, 'casa'), ...un], c);
    if (al.length) { L.push(''); L.push('ATENÇÃO: ' + [...new Set(al.map((a) => a.msg))].join(' ')); }
    L.push('');
    (st.modo === 'ps' ? window.FRASES.finalPs : window.FRASES.finalUbs).forEach((f) => L.push(f));
    if (st.modo === 'ps' && st.emTempo) { L.push(''); window.FRASES.emTempo.forEach((f) => L.push(f)); }
    return L.join('\n');
  }
  function atualizarEvolucao() {
    const ta = $('#txtEvolucao'); if (!ta) return;
    ta.value = gerarEvolucao();
  }

  // ---------------- flags ----------------
  function renderFlags() {
    $('#flags').innerHTML = window.FLAGS.map(([id, rot]) =>
      `<button class="flag ${st.flags.has(id) ? 'on' : ''}" data-flag="${id}">${esc(rot)}</button>`).join('');
  }

  // ---------------- receita avulsa ----------------
  function salvarReceita() { store.set('receita', st.receita); }
  function addReceita(it) {
    st.receita.push({ n: it.n, q: it.q || '', p: it.p || '', v: it.v || 'oral', t: it.t || [], o: it.o || '' });
    salvarReceita(); renderReceita(); toast('Adicionado à receita avulsa');
  }
  function renderReceita() {
    const ul = $('#itensReceita');
    $('#receitaVazia').hidden = st.receita.length > 0;
    const cont = $('#contReceita'); cont.hidden = !st.receita.length; cont.textContent = st.receita.length;
    $('#alertasReceita').innerHTML = htmlAlertas(alertasDe(st.receita.map((r) => ({ ...r, t: r.t || [] })), null));
    ul.innerHTML = st.receita.map((r, i) => `
      <li class="item-rec">
        <div class="rec-linha">
          <select data-rv="${i}" aria-label="via">${VIA_ORDEM.map((v) => `<option ${v === r.v ? 'selected' : ''}>${v}</option>`).join('')}</select>
          <input data-rn="${i}" value="${esc(r.n)}" aria-label="medicamento">
          <input data-rq="${i}" value="${esc(r.q)}" placeholder="quantidade" class="rq" aria-label="quantidade">
          <button class="mini" data-rup="${i}" title="subir">↑</button>
          <button class="mini link" data-rdel="${i}" title="remover">✕</button>
        </div>
        <textarea data-rp="${i}" rows="2" placeholder="posologia">${esc(r.p)}</textarea>
      </li>`).join('');
  }

  function renderBuscaMed() {
    const q = norm($('#buscaMed').value.trim());
    const so = $('#soRemume').checked;
    const ul = $('#resultadoMed');
    const lib = Object.entries(MEDS).filter(([, m]) => !['U'].includes(m.o));
    const vistos = new Set();
    const prontos = lib.filter(([, m]) => (!so || m.o === 'R') && (!q || norm(m.n + ' ' + m.p).includes(q)))
      .filter(([, m]) => { const k = m.n + m.p; if (vistos.has(k)) return false; vistos.add(k); return true; });
    const remume = window.REMUME.filter((r) => !q || norm(r.nome + ' ' + r.classe + ' ' + r.forma).includes(q));
    if (!q && !so) {
      ul.innerHTML = `<li class="nota">Digite para buscar entre as posologias prontas e os ${window.REMUME.length} itens da lista de ${esc(window.CIDADE.nome)}.</li>`;
      return;
    }
    ul.innerHTML = (prontos.length ? `<li class="sub">Posologias prontas</li>` : '') +
      prontos.slice(0, 40).map(([k, m]) => `
        <li class="res"><div><b>${esc(m.n)}</b> <span class="orig ${window.ORIGENS[m.o].cls}">${window.ORIGENS[m.o].label}</span>
          <div class="item-pos">${esc(m.p)}</div></div>
          <button class="mini primario" data-addmed="${k}">+ receita</button></li>`).join('') +
      (remume.length ? `<li class="sub">Lista de ${esc(window.CIDADE.nome)} (${remume.length})</li>` : '') +
      remume.slice(0, 80).map((r, i) => `
        <li class="res"><div><b>${esc(r.nome)}</b> <span class="forma">${esc(r.forma)}</span>
          <div class="item-pos">${esc(r.classe)} · ${esc(r.fin)}</div></div>
          <button class="mini" data-addremume="${window.REMUME.indexOf(r)}">+ receita</button></li>`).join('');
  }

  // ---------------- pediatria ----------------
  function calcPed(m, kg, anos, mgkg) {
    if (m.idadeMin != null && anos != null && anos < m.idadeMin) return { texto: `NÃO INDICADO abaixo de ${m.idadeMin < 1 ? Math.round(m.idadeMin * 12) + ' meses' : m.idadeMin + (m.idadeMin === 1 ? ' ano' : ' anos')}.`, bloqueado: true };
    if (m.pesoMin != null && kg < m.pesoMin) return { texto: `NÃO INDICADO abaixo de ${m.pesoMin} kg.`, bloqueado: true };
    if (m.fixo) return { texto: m.texto(kg, anos) };
    const vezes = 24 / m.freq;
    let dose = m.tipo === 'dose' ? mgkg * kg : (mgkg * kg) / vezes;
    let limitado = false;
    if (m.max && dose > m.max) { dose = m.max; limitado = true; }
    const ml = dose / m.conc;
    const mlR = ml < 2 ? Math.round(ml * 10) / 10 : Math.round(ml * 2) / 2;
    const gotas = m.gotasMl ? Math.round(ml * m.gotasMl) : null;
    const quant = gotas != null ? `${gotas} gotas (${mlR.toString().replace('.', ',')} mL)` : `${mlR.toString().replace('.', ',')} mL`;
    const freq = m.freq === 24 ? 'uma vez ao dia' : `a cada ${m.freq} horas`;
    const dias = m.dias ? `, por ${m.dias} dias` : '';
    const acao = m.acao ? `, ${m.acao}` : '';
    return {
      texto: `Tomar ${quant}, por via ${m.via || 'oral'}, ${freq}${acao}${dias}.`,
      calc: `${Math.round(dose)} mg/dose${limitado ? ' (limitado à dose máxima)' : ''}`,
    };
  }
  // re-renderiza a calculadora preservando o campo mg/kg que está sendo digitado
  function renderPedSoResultados() {
    const ativo = document.activeElement; const id = ativo && ativo.dataset ? ativo.dataset.pedmg : null;
    const val = id ? ativo.value : null; const inv = id ? ativo.classList.contains('invalido') : false;
    renderPed();
    if (id) { const el = $(`[data-pedmg="${id}"]`); if (el) { el.value = val; el.classList.toggle('invalido', inv); el.focus(); } }
  }
  function renderPed() {
    const kg = parseFloat($('#pedPeso').value);
    const anosV = parseFloat($('#pedIdade').value); const anos = isNaN(anosV) ? null : anosV;
    const ok = !isNaN(kg) && kg > 0;
    $('#listaPed').innerHTML = window.PEDIATRIA.map((m) => {
      const mgkg = mgkgPed(m);
      const r = ok ? calcPed(m, kg, anos, mgkg) : null;
      return `<div class="ped">
        <div class="ped-cab"><b>${esc(m.nome)}</b> <span class="orig ${window.ORIGENS[m.o].cls}">${window.ORIGENS[m.o].label}</span></div>
        ${m.fixo ? '' : `<div class="ped-dose"><label>${m.tipo === 'dose' ? 'mg/kg/dose' : 'mg/kg/dia'} <input type="number" step="0.5" data-pedmg="${m.id}" value="${mgkg}"></label>
          <span class="nota">${esc(m.faixa)} · máx ${m.max} mg/${m.tipo === 'dose' || m.freq !== 24 ? 'dose' : 'dia'}</span></div>`}
        ${m.idadeMin != null && anos == null && ok ? `<div class="item-alt">⚠︎ Idade mínima: ${m.idadeMin < 1 ? Math.round(m.idadeMin * 12) + ' meses' : m.idadeMin + ' ano(s)'} — informe a idade.</div>` : ''}
        <div class="ped-res">${r ? `${r.calc ? `<span class="nota">${esc(r.calc)}</span>` : ''}<div class="ped-texto">${esc(r.texto)}</div>` : '<span class="nota">Informe o peso.</span>'}</div>
        ${m.obs ? `<div class="item-alt">ℹ︎ ${esc(m.obs)}</div>` : ''}
        ${r ? `<div class="botoes"><button class="mini" data-pedcopy="${m.id}">Copiar</button><button class="mini primario" data-pedadd="${m.id}">+ receita</button></div>` : ''}
      </div>`;
    }).join('');
  }
  function pedItem(id) {
    const m = window.PEDIATRIA.find((x) => x.id === id);
    const kg = parseFloat($('#pedPeso').value); const a = parseFloat($('#pedIdade').value);
    const r = calcPed(m, kg, isNaN(a) ? null : a, mgkgPed(m));
    return { n: m.nome, q: m.q || '1 frasco', p: r.texto, v: m.via || 'oral', o: m.o, t: m.t || [] };
  }

  // ---------------- plantão rápido (fichas S / O / CD) ----------------
  const rap = { sexo: 'F', id: null };
  const RAP_PADRAO = ['ivas', 'faringo', 'geca', 'cistite', 'lombalgia', 'cefaleiaTensional', 'urgenciaHas', 'asma', 'dengue', 'colicarenal', 'gastrite', 'urticaria'];
  function rapMatch(q) {
    const t = norm(q.trim());
    if (!t) return [];
    return COND.map((c) => {
      let sc = norm(c.nome + ' ' + c.cid[0] + ' ' + c.cid[1]).includes(t) ? 20 : 0;
      for (const [id, w] of Object.entries(c.s)) if (SINT[id] && (norm(SINT[id][0]).includes(t) || SINT[id].slice(1).some((x) => x.includes(t)))) sc += w;
      return { c, sc };
    }).filter((r) => r.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 12).map((r) => r.c);
  }
  const nomeCurto = (n) => n.split(' — ')[0].replace(/\s+\d[\d.,]*\s*(mg|mcg|g|UI|mL|%)(\/\w+)?.*$/i, '').trim();
  function fichaRapida(c) {
    const fem = rap.sexo === 'F'; const ps = st.modo === 'ps';
    const sint = Object.entries(c.s).filter(([id]) => SINT[id] && !NEG_FORA.has(id)).sort((a, b) => b[1] - a[1]);
    const principais = sint.filter(([, w]) => w >= 2).slice(0, 4).map(([id]) => negRotulo(id));
    const temIds = new Set(Object.keys(c.s));
    const negs = [...new Set(sint.slice(0, 3).flatMap(([id]) => ALARME_SINT[id] || []))].filter((id) => !temIds.has(id) && SINT[id]).slice(0, 6).map(negRotulo);
    const S = `Paciente ${fem ? 'do sexo feminino' : 'do sexo masculino'}, ___ anos, refere ${listaPt(principais.length ? principais : ['___'])} há ___ dias. ___` +
      (negs.length ? ` Nega ${listaPt(negs)}.` : '') + ' Nega alergias medicamentosas, comorbidades e uso de medicações contínuas.';
    const O = 'SSVV: PA ___ mmHg | FC ___ bpm | FR ___ irpm | SpO₂ ___% | Tax ___ °C.\n' + window.FRASES.exameFisico(fem);
    const un = escolhidos(c, 'unid'); const casa = escolhidos(c, 'casa');
    const CD = [];
    CD.push(`HD: ${c.cid[0]} – ${c.cid[1]}.`);
    if (ps && un.length) CD.push('Medico na unidade com ' + listaPt(un.map((i) => nomeCurto(i.n))) + '.');
    if (casa.length) CD.push('Prescrevo para casa ' + listaPt(casa.map((i) => nomeCurto(i.n))) + '.');
    c.orient.slice(0, 2).forEach((o) => CD.push('Oriento ' + o.charAt(0).toLowerCase() + o.slice(1).replace(/\.$/, '') + '.'));
    CD.push('Oriento sinais de alarme e retorno imediato se piora.', 'Paciente ciente e concordante.');
    if (!ps) CD.push('Retorno ___.');
    const R = ps ? 'Reavalio paciente após medicação: refere melhora ___. BEG, ___. Alta com receita e orientações.' : '';
    return { S, O, CD: CD.join('\n'), R, RX: casa.length ? textoPrescricao(casa) : '' };
  }
  function renderRapido() {
    const q = $('#rapBusca').value;
    const lista = q.trim() ? rapMatch(q) : [...new Set([...store.get('recentes', []), ...RAP_PADRAO])].map((id) => COND.find((c) => c.id === id)).filter(Boolean).slice(0, 14);
    $('#rapLista').innerHTML = (q.trim() ? '' : '<span class="nota">Mais usadas:</span> ') +
      (lista.length ? lista.map((c) => `<button class="pill ${rap.id === c.id ? 'ativo' : ''}" data-rapcond="${c.id}">${esc(c.nome)}${c.ps ? ' <em class="tag-ps">PS</em>' : ''}</button>`).join('') : '<span class="nota">Nada encontrado — tente outro termo.</span>');
    const c = COND.find((x) => x.id === rap.id);
    if (!c) { $('#rapFicha').innerHTML = ''; return; }
    const f = fichaRapida(c);
    const bloco = (k, titulo, txt) => txt ? `<div class="rap-bloco"><div class="bloco-cab"><h3>${titulo}</h3><button class="mini" data-rapcopy="${k}">Copiar</button></div><textarea id="rap-${k}" rows="${Math.min(14, txt.split('\n').length + 2)}">${esc(txt)}</textarea></div>` : '';
    $('#rapFicha').innerHTML = `<div class="card rap-ficha">
      <div class="cond-cab"><div><span class="grupo">${esc(c.grupo)}</span><h2>${esc(c.nome)}</h2></div>
        <div class="botoes"><span class="pill">CID ${esc(c.cid[0])}</span><button class="primario" data-rapcopy="tudo">Copiar S + O + CD</button></div></div>
      ${bloco('S', 'S — História', f.S)}${bloco('O', 'O — Exame', f.O)}${bloco('CD', 'CD — Conduta', f.CD)}${bloco('R', 'Reavaliação', f.R)}${bloco('RX', 'Receita para casa', f.RX)}
      <div class="botoes"><button class="mini" data-rapabrir="${c.id}">Abrir no Prontuário completo →</button></div>
    </div>`;
  }
  window.renderRapido = renderRapido;

  // ---------------- frases ----------------
  function renderAnamModelos(q) {
    const L = window.ANAMNESES || []; const n = norm(q || '');
    const todos = L.map((a, i) => ({ a, i }));
    let lista = todos.filter(({ a }) => !n || norm(a.t + ' ' + a.g).includes(n));
    if (!lista.length) lista = todos.filter(({ a }) => norm(a.txt).includes(n));
    $('#anamModelos').innerHTML = lista.length ? lista.map(({ a, i }) => `<div class="frase"><div class="bloco-cab"><h3>${esc(a.t)} <span class="nota">· ${esc(a.g)}</span></h3><span><button class="mini" data-anamcopy="${i}">Copiar</button> <button class="mini" data-anamusar="${i}">Usar no prontuário</button></span></div><pre>${esc(a.txt)}</pre></div>`).join('') : '<p class="nota">Nenhum modelo para essa busca.</p>';
  }
  function renderFrases() {
    const F = window.FRASES;
    const blocos = [
      ['Exame físico normal — feminino', F.exameFisico(true)],
      ['Exame físico normal — masculino', F.exameFisico(false)],
      ['Fechamento UBS', F.finalUbs.join('\n')],
      ['Fechamento PS/UPA', F.finalPs.join('\n')],
      ['Em tempo (reavaliação PS)', F.emTempo.join('\n')],
      ['Negativas padrão', 'Nega febre, alterações gastrointestinais, sangramentos, alergias, comorbidades e uso de medicações contínuas.'],
      ...(F.extras || []),
    ];
    $('#frases').innerHTML = `
      <div class="card"><h2>Anamnese pronta</h2>
        <p class="nota">Modelos por queixa com os positivos típicos e as negativas pertinentes. Preencha os <b>___</b> e apague o que não se aplica.</p>
        <input id="anamBusca" type="search" placeholder="Buscar queixa (ex.: dor torácica, ITU, febre)" style="width:100%;margin-bottom:10px">
        <div class="grade-frases" id="anamModelos"></div>
      </div>
      <div class="card"><h2>Frases prontas</h2><div class="grade-frases">
        ${blocos.map(([t, txt], i) => `<div class="frase"><div class="bloco-cab"><h3>${esc(t)}</h3><button class="mini" data-frase="${i}">Copiar</button></div><pre>${esc(txt)}</pre></div>`).join('')}
      </div></div>
      <div class="card"><h2>Encaminhamento / Referência</h2>
        <div class="grade-atestado">
          <label>Especialidade / serviço <input id="encEsp" placeholder="Ex.: Cardiologia, CAPS, Otorrino"></label>
          <label>Prioridade <select id="encPri"><option>Eletivo</option><option>Prioritário</option><option>Urgente</option></select></label>
        </div>
        <label class="rotulo" for="encMotivo">Motivo / pergunta ao especialista</label>
        <input id="encMotivo" style="width:100%" placeholder="Ex.: avaliação de dor torácica atípica com ECG alterado">
        <textarea id="encTexto" rows="9" style="margin-top:8px"></textarea>
        <div class="botoes"><button class="primario" id="encCopiar">Copiar encaminhamento</button></div>
        <p class="nota">Puxa anamnese, hipótese/CID e exames do atendimento atual. Edite antes de copiar.</p>
      </div>
      <div class="card"><h2>Atestado / Declaração</h2>
        <div class="grade-atestado">
          <label>Nome do paciente <input id="atNome" placeholder="(opcional)"></label>
          <label>Tipo <select id="atTipo"><option value="at">Atestado de afastamento</option><option value="dc">Declaração de comparecimento</option></select></label>
          <label>Dias <input id="atDias" type="number" min="1" value="1"></label>
          <label>Horário (declaração) <input id="atHora" placeholder="08:00 às 10:00"></label>
          <label class="chk"><input type="checkbox" id="atCid"> incluir CID (com autorização do paciente)</label>
        </div>
        <textarea id="atTexto" rows="5"></textarea>
        <div class="botoes"><button class="primario" id="atCopiar">Copiar</button></div>
      </div>`;
    $('#frases').dataset.blocos = JSON.stringify(blocos.map((b) => b[1]));
    renderAnamModelos('');
    gerarAtestado(); gerarEncaminhamento();
  }
  function gerarEncaminhamento() {
    const ta = $('#encTexto'); if (!ta) return;
    const esp = $('#encEsp').value.trim() || '________________';
    const motivo = $('#encMotivo').value.trim();
    const c = st.cond;
    const L = [`Ao serviço de ${esp}.`, `Prioridade: ${$('#encPri').value}.`, ''];
    L.push('Encaminho paciente para avaliação e conduta' + (motivo ? `: ${motivo}.` : '.'));
    if ($('#anamnese').value.trim()) { L.push(''); L.push('Resumo clínico: ' + textoAnamnese()); }
    const sv = sinaisVitais(); if (sv) L.push(sv);
    if (c) {
      L.push(''); L.push(`Hipótese diagnóstica: ${c.nome} — CID-10 ${c.cid[0]}.`);
      const ex = exames(c).filter((_, i) => selecao(c).ex[i]).filter((e) => !/^sem exames|diagnóstico clínico/i.test(e));
      if (ex.length) L.push('Exames solicitados/realizados: ' + ex.join('; ') + '.');
    }
    L.push(''); L.push('Agradeço a atenção e coloco-me à disposição.');
    ta.value = L.join('\n');
  }
  function gerarAtestado() {
    const nome = $('#atNome')?.value.trim() || '________________';
    const hoje = new Date().toLocaleDateString('pt-BR');
    const tipo = $('#atTipo').value;
    const cid = $('#atCid').checked && st.cond ? ` (CID-10: ${st.cond.cid[0]})` : '';
    if (tipo === 'at') {
      const d = Math.max(1, parseInt($('#atDias').value || '1', 10));
      $('#atTexto').value = `Atesto, para os devidos fins, que ${nome} foi atendido(a) nesta data, necessitando de ${d} (${extenso(d)}) dia${d > 1 ? 's' : ''} de afastamento de suas atividades a partir de ${hoje}${cid}.`;
    } else {
      const h = $('#atHora').value.trim() || '__:__ às __:__';
      $('#atTexto').value = `Declaro, para os devidos fins, que ${nome} esteve presente nesta unidade de saúde em ${hoje}, no período das ${h}, para atendimento médico.`;
    }
  }
  function extenso(n) {
    const u = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze'];
    return u[n] || String(n);
  }

  // ---------------- eventos ----------------
  function setCidade(id) {
    window.aplicarCidade(id); store.set('cidade', window.CIDADE.id);
    $$('[data-cidade]').forEach((b) => b.classList.toggle('ativo', b.dataset.cidade === window.CIDADE.id));
    $$('.nomeCidade').forEach((x) => { x.textContent = window.CIDADE.nome; });
    st.sel = {}; if (st.cond) renderPainel();
    if ($('#buscaMed')) renderBuscaMed();
    if (window.renderRapido) window.renderRapido();
    if ($('#pedPeso')) renderPed();
  }
  function setModo(m) {
    st.modo = m; store.set('modo', m);
    $$('[data-modo]').forEach((b) => b.classList.toggle('ativo', b.dataset.modo === m));
    document.body.dataset.modo = m;
    const mm = $('#modoMini'); if (mm) mm.textContent = m === 'ps' ? 'PS/UPA' : 'UBS';
    st.sel = {}; if (st.cond) renderPainel();
  }
  function setAba(a) {
    $$('[data-aba]').forEach((b) => b.classList.toggle('ativo', b.dataset.aba === a));
    const bt = $(`.nav [data-aba="${a}"]`); if (bt) $('#tituloAba').textContent = [...bt.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    fecharMenu(); window.scrollTo(0, 0);
    if (a === 'rapido' && window.renderRapido) window.renderRapido();
    $$('.aba').forEach((s) => { s.hidden = s.id !== 'aba-' + a; });
    if (a === 'frases') renderFrases();
    if (a === 'receita') { renderReceita(); renderBuscaMed(); }
  }

  function fecharMenu() { $('#menu').classList.toggle('aberto', false); $('#veu').hidden = true; }
  function abrirMenu() { $('#menu').classList.toggle('aberto', true); $('#veu').hidden = false; }

  let tAnam;
  function onAnamnese() {
    clearTimeout(tAnam);
    tAnam = setTimeout(() => {
      st.detectados = detectar($('#anamnese').value);
      renderChips(); renderHipoteses(); atualizarEvolucao();
      store.set('rascunho', $('#anamnese').value);
    }, 150);
  }

  document.addEventListener('click', (e) => {
    if (e.target.id === 'veu') return fecharMenu();
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'abrirMenu') return abrirMenu();
    if (b.dataset.modo) return setModo(b.dataset.modo);
    if (b.dataset.cidade) { setCidade(b.dataset.cidade); return toast('Remédios conferidos para ' + window.CIDADE.nome + (window.CIDADE.temUbs ? '' : ' (UBS: lista ainda não carregada)')); }
    if (b.dataset.aba) return setAba(b.dataset.aba);
    if (b.dataset.sexo) { st.sexo = b.dataset.sexo; $$('[data-sexo]').forEach((x) => x.classList.toggle('ativo', x === b)); renderEf(); return atualizarEvolucao(); }
    if (b.dataset.flag) {
      const f = b.dataset.flag; st.flags.has(f) ? st.flags.delete(f) : st.flags.add(f);
      st.sel = {};
      renderFlags(); if (st.cond) renderPainel(); renderReceita(); return;
    }
    if (b.dataset.rm) {
      const id = b.dataset.rm; st.manuais.delete(id); if (st.detectados.has(id)) st.removidos.add(id);
      renderChips(); renderHipoteses(); return;
    }
    if (b.dataset.cond) return abrir(b.dataset.cond);
    if (b.dataset.rapsexo) { rap.sexo = b.dataset.rapsexo; $$('[data-rapsexo]').forEach((x) => x.classList.toggle('ativo', x === b)); return renderRapido(); }
    if (b.dataset.rapcond) { rap.id = b.dataset.rapcond; renderRapido(); $('#rapFicha').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (b.dataset.rapcopy) {
      const k = b.dataset.rapcopy; const v = (id) => ($('#rap-' + id) || {}).value || '';
      if (k === 'tudo') return copiar(['S: ' + v('S'), 'O: ' + v('O'), 'CD: ' + v('CD')].join('\n\n'), 'Ficha copiada!');
      return copiar(v(k));
    }
    if (b.dataset.rapabrir) { setAba('atendimento'); return abrir(b.dataset.rapabrir); }
    if (b.id === 'copAnam') { if (!$('#anamnese').value.trim()) return toast('Escreva a anamnese primeiro'); return copiar(textoAnamnese(), 'Anamnese copiada!'); }
    if (b.id === 'copAnamEf') { if (!$('#anamnese').value.trim()) return toast('Escreva a anamnese primeiro'); return copiar(textoAnamnese() + '\n\n' + textoExameFisico(), 'Anamnese + exame físico copiados!'); }
    if (b.id === 'copEf') return copiar(textoExameFisico(), 'Exame físico copiado!');
    if (b.id === 'limpar') {
      if (!confirm('Limpar anamnese, sintomas, sinais vitais e condições marcadas?')) return;
      $('#anamnese').value = ''; ['idade', 'peso', 'sv-pa', 'sv-fc', 'sv-fr', 'sv-sat', 'sv-tax', 'sv-hgt'].forEach((id) => { $('#' + id).value = ''; });
      st.flags.clear(); st.manuais.clear(); st.removidos.clear(); st.detectados.clear(); st.cond = null; st.sel = {}; st.emTempo = false; st.ef = null; st.efMexido = false; renderEf();
      store.set('rascunho', '');
      renderFlags(); renderChips(); renderHipoteses();
      $('#painelCondicao').innerHTML = '<div class="vazio"><h2>Novo atendimento</h2><p>Digite a anamnese ou adicione sintomas à esquerda.</p></div>';
      return;
    }
    const c = st.cond;
    if (b.dataset.copiar && c) {
      const s = selecao(c); const k = b.dataset.copiar;
      if (k === 'cid') return copiar(`${c.cid[0]} – ${c.cid[1]}`);
      if (k === 'ex') return copiar(exames(c).filter((_, i) => s.ex[i]).map((x) => '- ' + x).join('\n'));
      if (k === 'unid') return copiar(textoPrescricao(escolhidos(c, 'unid'), { comQtd: false }));
      if (k === 'casa') return copiar(textoCasaAtual(c), 'Prescrição copiada!');
      if (k === 'orient') return copiar(c.orient.map((o) => '- ' + o).join('\n'));
      if (k === 'evolucao') return copiar($('#txtEvolucao').value, 'Evolução copiada!');
    }
    if (b.dataset.leigo && c) {
      const t = $('#txtLeigo').value.trim();
      if (b.dataset.leigo === 'copiar') return copiar(t, 'Orientações copiadas!');
      return window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
    }
    if (b.hasAttribute('data-leigoia') && c && window.IA) return window.IA.leigo($('#txtLeigo'), c);
    if (b.hasAttribute('data-addreceita') && c) { escolhidos(c, 'casa').forEach((it) => st.receita.push({ n: it.n, q: it.q || '', p: it.p, v: it.v, t: it.t, o: it.o })); salvarReceita(); renderReceita(); return toast('Itens enviados para a receita avulsa'); }
    if (b.hasAttribute('data-salvarmodelo') && c) { store.set('modelo:' + c.id, $('#txtCasa').value); renderPainel(); return toast('Modelo salvo para ' + c.nome); }
    if (b.hasAttribute('data-resetmodelo') && c) { try { localStorage.removeItem('pr:modelo:' + c.id); } catch { /* sem storage */ } renderPainel(); return toast('Modelo padrão restaurado'); }
    if (b.dataset.addmed) return addReceita(MEDS[b.dataset.addmed]);
    if (b.dataset.addremume) { const r = window.REMUME[+b.dataset.addremume]; return addReceita({ n: r.nome, q: '', p: '', v: viaRemume(r), o: /^Farmácia 24h/.test(r.classe) ? 'F24' : 'R', t: tagsPorNome(r.nome) }); }
    if (b.dataset.rdel) { st.receita.splice(+b.dataset.rdel, 1); salvarReceita(); return renderReceita(); }
    if (b.dataset.rup) { const i = +b.dataset.rup; if (i > 0) { [st.receita[i - 1], st.receita[i]] = [st.receita[i], st.receita[i - 1]]; salvarReceita(); renderReceita(); } return; }
    if (b.id === 'copiarReceita') return copiar(textoPrescricao(st.receita), 'Receita copiada!');
    if (b.id === 'limparReceita') { if (confirm('Limpar a receita avulsa?')) { st.receita = []; salvarReceita(); renderReceita(); } return; }
    if (b.dataset.pedtxt) return copiar(b.dataset.pedtxt);
    if (b.dataset.pedcopy) return copiar(pedItem(b.dataset.pedcopy).p);
    if (b.dataset.pedadd) return addReceita(pedItem(b.dataset.pedadd));
    if (b.dataset.anamcopy) return copiar(window.ANAMNESES[+b.dataset.anamcopy].txt);
    if (b.dataset.anamusar) {
      const t = window.ANAMNESES[+b.dataset.anamusar].txt; const atual = $('#anamnese').value.trim();
      if (atual && !confirm('Substituir a anamnese que já está escrita?')) return;
      $('#anamnese').value = t; onAnamnese(); setAba('atendimento'); $('#anamnese').focus(); return toast('Modelo colocado na anamnese — preencha os ___');
    }
    if (b.dataset.frase) return copiar(JSON.parse($('#frases').dataset.blocos)[+b.dataset.frase]);
    if (b.id === 'atCopiar') return copiar($('#atTexto').value);
    if (b.id === 'encCopiar') return copiar($('#encTexto').value, 'Encaminhamento copiado!');
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.efon) { const ef = efEstado(); ef[el.dataset.efon].on = el.checked; st.efMexido = true; renderEf(); return atualizarEvolucao(); }
    if (el.matches('input[data-tipo]') && st.cond) {
      selecao(st.cond)[el.dataset.tipo][+el.dataset.i] = el.checked;
      const ta = $('#txtCasa'); const editado = ta && ta.dataset.editado === '1';
      const val = ta && ta.value;
      renderPainel();
      if (editado && el.dataset.tipo !== 'casa') { $('#txtCasa').value = val; $('#txtCasa').dataset.editado = '1'; atualizarEvolucao(); }
      return;
    }
    if (el.id === 'chkEmTempo') { st.emTempo = el.checked; return atualizarEvolucao(); }
    if (el.id === 'soRemume') return renderBuscaMed();
    if (el.dataset.rv) { st.receita[+el.dataset.rv].v = el.value; salvarReceita(); return; }
    if (el.dataset.pedmg) { const m = window.PEDIATRIA.find((x) => x.id === el.dataset.pedmg); const v = parseFloat(String(el.value).replace(',', '.')); if (m && v > 0 && v <= m.mgkg * 3) { store.set('ped:' + m.id, v); el.classList.toggle('invalido', false); } else { try { localStorage.removeItem('pr:ped:' + el.dataset.pedmg); } catch { /* sem storage */ } el.classList.toggle('invalido', true); } return renderPedSoResultados(); }
    if (['atTipo', 'atCid'].includes(el.id)) return gerarAtestado();
    if (el.id === 'encPri') return gerarEncaminhamento();
    if (el.id === 'buscaSintoma') return addSintomaDaBusca();
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'anamnese') return onAnamnese();
    if (el.id === 'buscaPatologia') return renderHipoteses();
    if (el.id === 'rapBusca') return renderRapido();
    if (el.id === 'anamBusca') return renderAnamModelos(el.value);
    if (el.dataset.efalt) { efEstado()[el.dataset.efalt].alt = el.value; st.efMexido = true; el.closest('.ef-linha').classList.toggle('alt', !!el.value.trim()); return atualizarEvolucao(); }
    if (el.id === 'buscaMed') return renderBuscaMed();
    if (el.id === 'txtCasa') { el.dataset.editado = '1'; return atualizarEvolucao(); }
    if (['idade', 'peso'].includes(el.id) || el.id.startsWith('sv-')) {
      if (el.id === 'idade') {
        const id = idade();
        if (id != null && id >= 65 && !st.flags.has('idoso')) { st.flags.add('idoso'); st.idosoAuto = true; st.sel = {}; renderFlags(); if (st.cond) return renderPainel(); }
        if (st.idosoAuto && (id == null || id < 65)) { st.flags.delete('idoso'); st.idosoAuto = false; st.sel = {}; renderFlags(); if (st.cond) return renderPainel(); }
      }
      if (st.cond && (st.cond.ped || st.cond.pedCalc) && ['idade', 'peso'].includes(el.id)) { clearTimeout(st.tPed); st.tPed = setTimeout(renderPainel, 350); return; }
      return atualizarEvolucao();
    }
    if (el.dataset.rn) { st.receita[+el.dataset.rn].n = el.value; return salvarReceita(); }
    if (el.dataset.rq) { st.receita[+el.dataset.rq].q = el.value; return salvarReceita(); }
    if (el.dataset.rp) { st.receita[+el.dataset.rp].p = el.value; return salvarReceita(); }
    if (['pedPeso', 'pedIdade'].includes(el.id)) return renderPed();
    if (['atNome', 'atDias', 'atHora'].includes(el.id)) return gerarAtestado();
    if (['encEsp', 'encMotivo'].includes(el.id)) return gerarEncaminhamento();
  });

  function addSintomaDaBusca() {
    const inp = $('#buscaSintoma'); const v = norm(inp.value.trim()); if (!v) return;
    const id = Object.keys(SINT).find((k) => norm(SINT[k][0]) === v) || Object.keys(SINT).find((k) => norm(SINT[k][0]).includes(v) || SINT[k].slice(1).some((s) => s.includes(v)));
    if (id) { st.manuais.add(id); st.removidos.delete(id); inp.value = ''; renderChips(); renderHipoteses(); }
    else toast('Sintoma não reconhecido');
  }
  $('#buscaSintoma').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addSintomaDaBusca(); } });

  // ---------------- init ----------------
  $('#listaSintomas').innerHTML = Object.values(SINT).map((s) => `<option value="${esc(s[0])}">`).join('');
  $('#anamnese').value = store.get('rascunho', '');
  $('#pedPeso').addEventListener('focus', () => { if (!$('#pedPeso').value && $('#peso').value) { $('#pedPeso').value = $('#peso').value; $('#pedIdade').value = $('#idade').value; renderPed(); } });
  setCidade(store.get('cidade', 'pedreira'));
  setModo(st.modo);
  renderFlags();
  st.detectados = detectar($('#anamnese').value);
  renderChips(); renderHipoteses(); renderTodas(); renderReceita(); renderPed(); renderEf();

  // ponte para o módulo de IA (ia.js)
  window.PR = {
    paciente() {
      const id = idade(); const peso = $('#peso').value.trim();
      return [
        `Sexo: ${st.sexo === 'F' ? 'feminino' : 'masculino'}`,
        id != null ? `Idade: ${id} anos` : '',
        peso ? `Peso: ${peso} kg` : '',
        sinaisVitais(),
        [...st.flags].map((f) => window.FLAGS_TEXTO[f] || '').filter(Boolean).join(' '),
      ].filter(Boolean).join('\n');
    },
    anamnese: () => $('#anamnese').value.trim(),
    // contexto para a IA: sintomas reconhecidos, hipóteses do app e negativas pertinentes sugeridas
    contexto() {
      const sint = [...sintomasAtivos()].map((x) => SINT[x][0]);
      const hip = st.cond ? [st.cond] : ranking().slice(0, 3).map((r) => r.c);
      const neg = negativasPertinentes($('#anamnese').value + ' ' + [...st.flags].map((f) => window.FLAGS_TEXTO[f] || '').join(' '));
      return [
        sint.length ? 'Sintomas reconhecidos: ' + sint.join(', ') : '',
        hip.length ? 'Hipóteses consideradas: ' + hip.map((c) => `${c.nome} (${c.cid[0]})`).join('; ') : '',
        neg.length ? 'Negativas pertinentes sugeridas (sintomas dos diferenciais que não foram citados): ' + neg.join(', ') : '',
      ].filter(Boolean).join('\n');
    },
    dados: () => ({ idade: idade(), peso: parseFloat($('#peso').value) || null, sexo: st.sexo }),
    setAnamnese(t) { $('#anamnese').value = t; onAnamnese(); },
    modo: () => st.modo,
    hipotese() {
      const c = st.cond; if (!c) return '';
      const itens = [...escolhidos(c, 'unid'), ...escolhidos(c, 'casa')].map((i) => i.n);
      return `Hipótese que o médico está considerando: ${c.nome} (${c.cid[0]}).` + (itens.length ? ` Medicações que ele pré-selecionou: ${itens.join('; ')}.` : '');
    },
    toast, copiar, esc,
  };

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
