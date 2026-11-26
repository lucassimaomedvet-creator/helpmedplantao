// Mescla segura dos pacotes de conteúdo (ubs, ps, gest, ped) nas bases globais.
// - condição com id repetido: a mais nova substitui a anterior (no mesmo lugar)
// - PROIBE: soma as listas (não apaga as existentes)
// - tags e regras corrigidas: aplicadas sobre os itens existentes
window.mesclarPacote = function (p) {
  const W = window;
  if (p.remover) p.remover.forEach((id) => { const i = W.CONDICOES.findIndex((c) => c.id === id); if (i >= 0) W.CONDICOES.splice(i, 1); });
  (p.NOVAS_CONDICOES || []).forEach((c) => {
    const i = W.CONDICOES.findIndex((x) => x.id === c.id);
    if (i >= 0) W.CONDICOES[i] = c; else W.CONDICOES.push(c);
  });
  Object.assign(W.MEDS, p.NOVOS_MEDS || {});
  // sintoma já existente: mantém rótulo e soma sinônimos
  for (const [id, arr] of Object.entries(p.NOVOS_SINTOMAS || {})) {
    if (W.SINTOMAS[id]) arr.slice(1).forEach((x) => { if (!W.SINTOMAS[id].includes(x)) W.SINTOMAS[id].push(x); });
    else W.SINTOMAS[id] = arr;
  }
  for (const [id, extra] of Object.entries({ ...(p.SINONIMOS_EXTRA || {}), ...(p.SINONIMOS_EXISTENTES || {}) })) if (W.SINTOMAS[id]) extra.forEach((s) => { if (!W.SINTOMAS[id].includes(s)) W.SINTOMAS[id].push(s); });
  for (const [k, mud] of Object.entries(p.TAGS_EM_MEDS_EXISTENTES || {})) {
    const m = W.MEDS[k]; if (!m) continue;
    m.t = (m.t || []).filter((t) => !(mud.remover || []).includes(t)).concat((mud.adicionar || []).filter((t) => !(m.t || []).includes(t)));
  }
  (p.REGRAS_CORRIGIDAS || []).forEach(({ atual, novo }) => {
    const i = W.REGRAS.findIndex((r) => r[0] === atual[0] && r[1] === atual[1] && r[3] === atual[3]);
    if (i >= 0) W.REGRAS[i] = novo; else W.REGRAS.push(novo);
  });
  (p.NOVAS_REGRAS || []).forEach((r) => { if (!W.REGRAS.some((x) => x[0] === r[0] && x[1] === r[1] && x[3] === r[3])) W.REGRAS.push(r); });
  for (const [id, lista] of Object.entries(p.NOVAS_PROIBE || {})) W.PROIBE[id] = (W.PROIBE[id] || []).concat(lista);
  if (p.NOVOS_PED && W.PEDIATRIA) p.NOVOS_PED.forEach((x) => { const i = W.PEDIATRIA.findIndex((y) => y.id === x.id); if (i >= 0) W.PEDIATRIA[i] = x; else W.PEDIATRIA.push(x); });
};
