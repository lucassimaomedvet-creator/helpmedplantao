// Cidades atendidas: muda a origem dos remédios (UBS da cidade, Farmácia 24h, Farmácia Popular, compra).
// Pedreira: REMUME 2026 completa (data/remume.js) + origens já definidas em cada item.
// Jaguariúna: por enquanto só a lista pública da Farmácia 24h (receitas da UPA Dra. Ana Olívia Bentivoglio
// e do Hospital Municipal Walter Ferrari) — Anexo 1 do Termo de Referência do Chamamento Público 01/2023/SES.
// A lista completa das UBS (~275 itens) é restrita a moradores (Cartão Cidadão + CPF) no portal da prefeitura:
// quando o médico enviar o arquivo, preencher JAGUARIUNA_UBS abaixo.
(function () {
  const W = window;
  const f24 = (nome, forma) => ({ nome, forma, classe: 'Farmácia 24h (UPA/Hospital)', fin: 'Jaguariúna' });
  const JAGUARIUNA_24H = [
    f24('Acetilcisteína 100 mg/5 mL', 'Xarope'), f24('Ácido acetilsalicílico 100 mg', 'Comprimido'), f24('Ambroxol 30 mg/5 mL', 'Xarope adulto'),
    f24('Amoxicilina 500 mg + Clavulanato 125 mg', 'Comprimido'), f24('Amoxicilina 250 mg/5 mL', 'Suspensão 150 mL'), f24('Amoxicilina 500 mg', 'Comprimido'),
    f24('Amoxicilina 400 mg + Clavulanato 57 mg/5 mL', 'Suspensão 70 mL'), f24('Azitromicina 40 mg/mL (900 mg)', 'Suspensão 22,5 mL'), f24('Azitromicina 500 mg', 'Comprimido'),
    f24('Betaistina 24 mg', 'Comprimido'), f24('Betametasona + Gentamicina', 'Creme 30 g'), f24('Bromoprida 4 mg/mL', 'Gotas 20 mL'),
    f24('Captopril 25 mg', 'Comprimido'), f24('Cefalexina 250 mg/5 mL', 'Suspensão'), f24('Cefalexina 500 mg', 'Comprimido'),
    f24('Ceftriaxona 1 g', 'Frasco-ampola EV/IM'), f24('Ciprofloxacino 500 mg', 'Comprimido'), f24('Dextrano 70 0,1% + Hipromelose 0,3%', 'Colírio 15 mL'),
    f24('Dexametasona + associações (Dexa-Citoneurin)', 'Ampola 2 mL'), f24('Dexametasona 0,1 mg/mL', 'Elixir 120 mL'), f24('Dexametasona 1 mg/g', 'Creme 10 g'),
    f24('Dexclorfeniramina 0,4 mg/mL', 'Xarope 100 mL'), f24('Dexclorfeniramina 2 mg', 'Comprimido'), f24('Diclofenaco sódico 50 mg', 'Comprimido'),
    f24('Digoxina 0,25 mg', 'Comprimido'), f24('Dimenidrinato + Piridoxina', 'Gotas'), f24('Dimenidrinato 50 mg + Piridoxina 10 mg', 'Comprimido'),
    f24('Dipirona 500 mg', 'Comprimido'), f24('Dipirona 500 mg/mL', 'Gotas 10 mL'), f24('Doxiciclina 100 mg', 'Comprimido'),
    f24('Fluocinolona + associações', 'Solução otológica 5 mL'), f24('Furosemida 40 mg', 'Comprimido'), f24('Glibenclamida 5 mg', 'Comprimido'),
    f24('Hidroclorotiazida 25 mg', 'Comprimido'), f24('Hidróxido de alumínio', 'Suspensão 100 mL'), f24('Hidroxiquinolina + Trolamina (Cerumin)', 'Solução otológica'),
    f24('Hioscina 10 mg', 'Comprimido'), f24('Hioscina 10 mg/mL', 'Gotas 20 mL'), f24('Levofloxacino 500 mg', 'Comprimido'),
    f24('Loratadina 10 mg', 'Comprimido'), f24('Loratadina 1 mg/mL', 'Xarope 100 mL'), f24('Mebendazol 100 mg', 'Comprimido'),
    f24('Mebendazol 20 mg/mL', 'Suspensão'), f24('Metildopa 250 mg', 'Comprimido'), f24('Metoclopramida 10 mg', 'Comprimido'),
    f24('Metoclopramida 4 mg/mL', 'Gotas 10 mL'), f24('Metronidazol 250 mg', 'Comprimido'), f24('Metronidazol 40 mg/mL', 'Suspensão'),
    f24('Metronidazol 10% vaginal', 'Gel 50 g'), f24('Nifedipino 20 mg', 'Comprimido'), f24('Nimesulida 100 mg', 'Comprimido'),
    f24('Nimesulida 50 mg/mL', 'Gotas 15 mL'), f24('Nistatina 25.000 UI/g vaginal', 'Creme vaginal'), f24('Nitrofurantoína 100 mg', 'Cápsula'),
    f24('Norfloxacino 400 mg', 'Comprimido'), f24('Omeprazol 20 mg', 'Cápsula'), f24('Oseltamivir 30 mg', 'Cápsula'),
    f24('Oseltamivir 45 mg', 'Cápsula'), f24('Oseltamivir 75 mg', 'Cápsula'), f24('Paracetamol + Cafeína + Carisoprodol + Diclofenaco', 'Comprimido'),
    f24('Paracetamol 200 mg/mL', 'Gotas 15 mL'), f24('Paracetamol 500 mg', 'Comprimido'), f24('Prednisolona 3 mg/mL', 'Solução oral 100 mL'),
    f24('Prednisona 20 mg', 'Comprimido'), f24('Prednisona 5 mg', 'Comprimido'), f24('Prometazina 25 mg', 'Comprimido'),
    f24('Sais para reidratação oral 27,9 g', 'Envelope'), f24('Salbutamol 2 mg/5 mL', 'Solução oral 120 mL'), f24('Simeticona 75 mg/mL', 'Gotas 10 mL'),
    f24('Cloreto de sódio 0,9% (soro fisiológico)', 'Frasco 100 mL'), f24('Sulfametoxazol 200 mg + Trimetoprima 40 mg/5 mL', 'Suspensão 100 mL'), f24('Sulfametoxazol 400 mg + Trimetoprima 80 mg', 'Comprimido'),
    f24('Tiamina + Piridoxina + Cianocobalamina (Citoneurin)', 'Ampola'), f24('Tobramicina 0,3%', 'Colírio 5 mL'),
  ];
  // lista completa da rede de Jaguariúna (07/2025) — data/jaguariuna-ubs.js
  const LOCAL = { U: 'Unidades Básicas de Saúde', P: 'Farmácia Popular / UBS', C: 'Farmácia de Controlados', E: 'Enfermagem (aplicado na UBS)', S: 'Farmácia SAE', A: 'Farmácia de Alto Custo' };
  const JAGUARIUNA_UBS = String(W.JAGUARIUNA_UBS_BRUTA || '').trim().split('\n').filter(Boolean).map((l) => {
    const [nome, forma, loc] = l.split('|');
    return { nome, forma, classe: LOCAL[loc] || loc, fin: 'Jaguariúna', loc };
  });

  W.CIDADES = {
    pedreira: { nome: 'Pedreira', ubs: W.REMUME, f24h: [] },
    jaguariuna: { nome: 'Jaguariúna', ubs: JAGUARIUNA_UBS, f24h: JAGUARIUNA_24H },
  };

  // ---------- comparação de nomes (princípio ativo + concentração) ----------
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const PARAR = new Set(['de', 'do', 'da', 'e', 'com', 'sodica', 'potassica', 'potassio', 'enantato', 'valerato', 'emulsao', 'xampu', 'shampoo', 'gel', 'locao', 'granulado', 'envelope', 'otologica', 'otologicas', 'otologico', 'dermatologico', 'pediatrico', 'cloridrato', 'maleato', 'acetato', 'besilato',
    'mg', 'ml', 'mcg', 'ui', 'g', 'gotas', 'gota', 'xarope', 'suspensao', 'comprimido', 'comprimidos', 'capsula', 'capsulas', 'cp', 'solucao', 'oral', 'creme',
    'pomada', 'injetavel', 'ampola', 'frasco', 'colirio', 'spray', 'nasal', 'aerossol', 'elixir', 'adulto', 'infantil', 'liberacao', 'prolongada', 'retard',
    'acao', 'rapida', 'uso', 'topico', 'vaginal', 'dose', 'elementar', 'ferro', 'humana', 'associacoes', 'sal', 'po', 'para', 'im', 'ev', 'sc', 'vo', 'mensal', 'trimestral']);
  // ciprofloxacino = ciprofloxacina; norfloxacino = norfloxacina etc.
  const raiz = (w) => w.replace(/(ina|ino)$/, 'in').replace(/(ona|ono)$/, 'on');
  function chave(nome) {
    const n = norm(nome).replace(/\(.*?\)/g, ' ');
    const palavras = n.split(/[^a-z0-9.,]+/).filter(Boolean);
    const drogas = new Set(palavras.filter((w) => /^[a-z]{4,}$/.test(w) && !PARAR.has(w)).map(raiz));
    const nums = (n.match(/\d+(?:[.,]\d+)?/g) || []).map((x) => parseFloat(x.replace(/\.(?=\d{3}\b)/g, '').replace(',', '.')));
    return { drogas, nums };
  }
  function bate(a, b) {
    if (!a.drogas.size || a.drogas.size !== b.drogas.size) return false;
    for (const d of a.drogas) if (!b.drogas.has(d)) return false;
    if (!a.nums.length || !b.nums.length) return true;
    if (a.nums.length === 1 || b.nums.length === 1) return a.nums[0] === b.nums[0];
    const x = [...a.nums].sort((m, n) => m - n); const y = [...b.nums].sort((m, n) => m - n);
    return x.length === y.length && x.every((v, i) => v === y[i]);
  }
  const acha = (nome, lista) => { const k = chave(nome); return lista.find((r) => bate(k, chave(r.nome))); };
  const naLista = (nome, lista) => Boolean(acha(nome, lista));

  W.ORIGENS.F24 = { label: 'Farmácia 24h', cls: 'o-u', title: 'Farmácia 24h de Jaguariúna — receitas da UPA e do Hospital' };
  W.ORIGENS.CT = { label: 'Farm. Controlados', cls: 'o-r', title: 'Farmácia de Controlados de Jaguariúna (receita de controle especial)' };
  W.ORIGENS.AC = { label: 'Alto Custo', cls: 'o-fp', title: 'Farmácia de Alto Custo (componente especializado) — precisa de processo/LME' };
  W.ORIGENS.SAE = { label: 'Farmácia SAE', cls: 'o-fp', title: 'Farmácia do SAE de Jaguariúna' };
  W.ORIGENS.V = { label: 'Verificar UBS', cls: 'o-c', title: 'A lista completa das UBS de Jaguariúna ainda não foi carregada no app' };

  // aplica a cidade: recalcula a origem de cada remédio (sem perder a original de Pedreira)
  W.aplicarCidade = function (id) {
    const cid = W.CIDADES[id] || W.CIDADES.pedreira;
    const itens = [...Object.values(W.MEDS), ...(W.PEDIATRIA || [])];
    for (const m of itens) {
      if (m.o0 == null) m.o0 = m.o;
      if (id !== 'jaguariuna') { m.o = m.o0; continue; }
      const nome = m.n || m.nome;
      if (m.o0 === 'U') { m.o = 'U'; continue; } // estoque de sala de urgência (injetáveis) — igual em qualquer UPA
      const u = cid.ubs.length && acha(nome, cid.ubs);
      if (u) m.o = { C: 'CT', A: 'AC', S: 'SAE' }[u.loc] || 'R';
      else if (naLista(nome, cid.f24h)) m.o = 'F24';
      else if (m.o0 === 'FP' || m.o0 === 'C') m.o = m.o0;
      else m.o = cid.ubs.length ? 'C' : 'V'; // era da UBS de Pedreira: em Jaguariúna, sem a lista, fica "verificar"
    }
    W.ORIGENS.R.label = 'UBS ' + cid.nome;
    W.ORIGENS.R.title = 'Disponível na UBS de ' + cid.nome;
    W.ORIGENS.FP.title = 'Farmácia Popular ou programa federal (não está na lista da UBS de ' + cid.nome + ')';
    W.ORIGENS.C.title = 'Não disponível na rede de ' + cid.nome + ' — paciente compra';
    W.REMUME = [...cid.ubs, ...cid.f24h];
    W.CIDADE = { id: id in W.CIDADES ? id : 'pedreira', nome: cid.nome, temUbs: cid.ubs.length > 0 };
  };
})();
