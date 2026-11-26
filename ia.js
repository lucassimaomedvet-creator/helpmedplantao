// Recursos de IA (Claude via servidor local). Depende de window.PR (app.js).
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const PR = window.PR;
  let ativa = false;
  let controle = null;
  const historico = [];

  // remove números longos (CPF, CNS, telefone, prontuário) e e-mails antes de enviar
  const anonimizar = (t) => t
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[e-mail removido]')
    .replace(/\b\d[\d.\-/ ]{7,}\d\b/g, (m) => (m.replace(/\D/g, '').length >= 9 ? '[nº removido]' : m));

  let incompleta = false; let semServidor = false;
  async function status() {
    try {
      const r = await fetch('/api/status');
      if (!r.ok) semServidor = true;
      const j = r.ok ? await r.json().catch(() => { semServidor = true; return {}; }) : {};
      ativa = Boolean(j.ia); incompleta = Boolean(j.incompleta);
    } catch { ativa = false; semServidor = true; }
    document.querySelectorAll('.ia-btn').forEach((b) => { b.disabled = !ativa; });
    $('.ia-off').hidden = ativa;
    $('#iaConfig').hidden = ativa || semServidor;
    const aviso = $('#iaIncompleta'); if (aviso) aviso.hidden = !incompleta;
    $('.ia-off').textContent = semServidor ? 'IA indisponível nesta versão online — o resto do app funciona normalmente.' : incompleta ? 'IA desligada — a chave salva está incompleta (veja a aba "Dúvidas (IA)").' : 'IA desligada — veja como ativar na aba "Dúvidas (IA)".';
    $('#chatForm button').disabled = !ativa;
  }

  // lê o stream de texto do servidor; \u0001…\u0002 = status, \u0003{json} = fontes
  async function stream(corpo, aoTexto, aoStatus) {
    controle = new AbortController();
    const r = await fetch('/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...corpo, cidade: window.CIDADE?.id || 'pedreira' }), signal: controle.signal });
    if (!r.ok) throw new Error(await r.text());
    const leitor = r.body.getReader(); const dec = new TextDecoder();
    let bruto = ''; let erro = false;
    for (;;) {
      const { value, done } = await leitor.read();
      if (done) break;
      bruto += dec.decode(value, { stream: true });
      let fontes = null; let txt = bruto;
      const i3 = txt.indexOf('\u0003');
      if (i3 >= 0) { try { fontes = JSON.parse(txt.slice(i3 + 1)); } catch { /* ainda chegando */ } txt = txt.slice(0, i3); }
      const pesquisando = /\u0001[^\u0002]*\u0002?$/.test(txt); // marcador de busca é a última coisa recebida
      txt = txt.replace(/\u0001[^\u0002]*\u0002?/g, '');
      if (txt.includes('\u0004')) { erro = true; txt = txt.replace(/\u0004/g, ''); }
      aoStatus?.(pesquisando ? 'pesquisando fontes…' : 'escrevendo…');
      aoTexto(txt, fontes);
    }
    return { erro };
  }

  // ---------- painel lateral ----------
  function abrirPainel(titulo, podeUsar) {
    $('#iaTitulo').textContent = titulo;
    $('#iaTexto').value = '';
    $('#iaUsar').hidden = !podeUsar;
    $('#iaParar').hidden = false;
    $('#iaPainel').hidden = false;
  }
  async function gerar(tipo) {
    if (!ativa) return;
    const anam = PR.anamnese();
    if (!anam) { PR.toast('Escreva a anamnese primeiro'); $('#anamnese').focus(); return; }
    const modo = PR.modo();
    let texto, tipoApi, titulo;
    if (tipo === 'anamnese') {
      tipoApi = 'anamnese'; titulo = '✨ Anamnese revisada';
      texto = [PR.paciente(), 'Anamnese (rascunho do médico):\n' + anam, PR.contexto()].filter(Boolean).join('\n\n');
    } else {
      tipoApi = modo === 'ps' ? 'ps' : 'ubs'; titulo = `✨ Evolução completa — ${modo === 'ps' ? 'PS/UPA' : 'UBS'}`;
      texto = [PR.paciente(), 'Descrição do atendimento:\n' + anam, PR.contexto(), PR.hipotese()].filter(Boolean).join('\n\n');
    }
    abrirPainel(titulo, tipo === 'anamnese');
    const st = $('#iaStatus'); st.textContent = 'pensando…';
    const ta = $('#iaTexto');
    try {
      const r = await stream({ tipo: tipoApi, texto: anonimizar(texto) }, (t) => { ta.value = t; ta.scrollTop = ta.scrollHeight; }, (s) => { st.textContent = s; });
      if (r.erro) { st.textContent = 'erro — veja a mensagem'; $('#iaUsar').hidden = true; } else st.textContent = 'pronto — revise e copie';
    } catch (e) {
      st.textContent = ''; $('#iaUsar').hidden = true;
      if (e.name === 'AbortError') { st.textContent = 'interrompido'; return; }
      ta.value = (ta.value ? ta.value + '\n\n' : '') + '[' + e.message + ']';
    } finally { $('#iaParar').hidden = true; controle = null; }
  }

  // ---------- chat de dúvidas ----------
  function bolha(papel, html) {
    const d = document.createElement('div');
    d.className = 'msg ' + papel; d.innerHTML = html;
    $('#chatLog').appendChild(d); d.scrollIntoView({ block: 'end', behavior: 'smooth' });
    return d;
  }
  async function perguntar(q) {
    bolha('eu', PR.esc(q));
    const caixa = bolha('ia', '<span class="nota">pensando…</span>');
    let resposta = '';
    try {
      await stream({ tipo: 'duvida', texto: anonimizar(q), historico: historico.slice() }, (t, fontes) => {
        resposta = t;
        caixa.innerHTML = `<div class="msg-txt">${PR.esc(t)}</div>` +
          (fontes && fontes.length ? `<div class="fontes">${fontes.filter((f) => /^https?:\/\//i.test(String(f.url))).map((f) => { let host = ''; try { host = new URL(f.url).hostname; } catch { /* url estranha */ } return `<a href="${PR.esc(f.url)}" target="_blank" rel="noopener noreferrer">${PR.esc(f.titulo || host || 'fonte')}</a>`; }).join('')}</div>` : '') +
          `<button class="mini copia">Copiar</button>`;
      }, (s) => { if (!resposta) caixa.innerHTML = `<span class="nota">${s}</span>`; });
      historico.push({ role: 'user', content: anonimizar(q) }, { role: 'assistant', content: resposta });
    } catch (e) {
      caixa.innerHTML = `<span class="nota">[${PR.esc(e.name === 'AbortError' ? 'interrompido' : e.message)}]</span>`;
    }
    caixa.querySelector('.copia')?.addEventListener('click', () => PR.copiar(resposta));
  }

  // ---------- eventos ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ia) return gerar(b.dataset.ia);
    if (b.id === 'iaFechar') { controle?.abort(); $('#iaPainel').hidden = true; }
    if (b.id === 'iaParar') controle?.abort();
    if (b.id === 'iaCopiar') PR.copiar($('#iaTexto').value, 'Copiado!');
    if (b.id === 'iaUsar') { PR.setAnamnese($('#iaTexto').value.trim()); $('#iaPainel').hidden = true; PR.toast('Anamnese substituída'); }
    if (b.id === 'chatLimpar') { historico.length = 0; $('#chatLog').innerHTML = ''; }
  });
  $('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#chatInput').value.trim(); if (!q || !ativa) return;
    $('#chatInput').value = ''; perguntar(q);
  });
  $('#chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chatForm').requestSubmit(); }
  });

  // orientações para o paciente em linguagem simples (bloco "Para o paciente")
  window.IA = {
    async leigo(ta, c) {
      if (!ativa) return PR.toast('IA desligada — veja a aba Tira-dúvidas (IA)');
      const texto = [PR.paciente(), 'Hipótese: ' + c.nome, 'Rascunho:\n' + ta.value].filter(Boolean).join('\n\n');
      const orig = ta.value; ta.value = 'Reescrevendo em linguagem simples…'; ta.disabled = true;
      try {
        const r = await stream({ tipo: 'leigo', texto: anonimizar(texto) }, (t) => { ta.value = t; });
        if (r.erro) { const msg = ta.value.trim().replace(/^\[|\]$/g, ''); ta.value = orig; PR.toast(msg.slice(0, 140)); }
      } catch (e) {
        ta.value = orig; PR.toast(e.name === 'AbortError' ? 'Interrompido' : 'Falha na IA: ' + String(e.message).slice(0, 80));
      }
      ta.disabled = false;
    },
  };

  status();
})();
