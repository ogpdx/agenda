// ======= ELEMENTOS DO DOM =======
const addHorarioBtn = document.getElementById("addHorario");
const viewHorariosBtn = document.getElementById("viewHorario");
const viewRendimentosBtn = document.getElementById("viewRendimentos");

const closeModal = document.getElementById("closeModal");
const saveHorarioBtn = document.getElementById("saveHorario");
const modal = document.getElementById("agendaModal");

const horariosList = document.getElementById("horariosList");
const rendimentosList = document.getElementById("rendimentosList");

const horariosGrid = document.getElementById("horariosGrid");
const mesSelector = document.getElementById("mesSelector");

// Modal de detalhes (já existe no HTML)
const detalhesModal = document.getElementById("detalhesModal");
const detalhesInfo = document.getElementById("detalhesInfo");
const closeDetalhes = document.getElementById("closeDetalhes");

// ======= VARIÁVEL GLOBAL =======
// Recupera os horários do localStorage ou inicia com array vazio.
let horarios = JSON.parse(localStorage.getItem("horarios")) || [];

// ======= FUNÇÃO: DEFINIR O DIA DA SEMANA =======
const definirDiaSemana = (date) => {
  const dias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];
  return dias[new Date(date).getDay()];
};

// ======= FUNÇÃO: MOSTRAR DETALHES DO HORÁRIO =======
function showDetails(item) {
  detalhesInfo.innerHTML = `
    <strong>Cliente:</strong> ${item.cliente} <br>
    <strong>Data:</strong> ${item.data} (${definirDiaSemana(item.data)}) <br>
    <strong>Horário:</strong> ${item.horario} <br>
    <strong>Tipo de Unha:</strong> ${item.tipo}
  `;
  detalhesModal.classList.remove("hidden");
}

// Fechar o modal de detalhes
closeDetalhes.addEventListener("click", () => {
  detalhesModal.classList.add("hidden");
});

// ======= FUNÇÕES DE RENDERIZAÇÃO DO GRID COM PAGINAÇÃO =======
// Renderiza uma página do grid de itens (horários ou rendimentos)
// items: array de itens a serem exibidos
// pageIndex: página atual (0-indexada)
// container: elemento HTML onde o grid será injetado
function renderGridPage(items, pageIndex, container) {
  const itemsPerPage = 9;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = items.slice(startIndex, endIndex);

  // Monta o HTML da grade utilizando uma div com classe "grid"
  let html = '<div class="grid">';
  pageItems.forEach((item, idx) => {
    // Cada célula exibe a preview: nome da cliente e o dia da semana
    html += `<div class="grid-item" data-index="${startIndex + idx}">
               <p class="cliente">${item.cliente}</p>
               <p class="dia">${definirDiaSemana(item.data)}</p>
             </div>`;
  });
  html += '</div>';

  // Se houver mais de uma página, adiciona os botões de navegação
  if (totalPages > 1) {
    html += '<div class="pagination">';
    if (pageIndex > 0) {
      html += '<button class="prev-page">←</button>';
    }
    html += `<span> Página ${pageIndex + 1} de ${totalPages} </span>`;
    if (pageIndex < totalPages - 1) {
      html += '<button class="next-page">→</button>';
    }
    html += '</div>';
  }

  container.innerHTML = html;

  // Adiciona event listeners para cada item do grid (para mostrar detalhes)
  container.querySelectorAll('.grid-item').forEach(div => {
    div.addEventListener("click", () => {
      const itemIndex = parseInt(div.getAttribute("data-index"));
      showDetails(items[itemIndex]);
    });
  });

  // Adiciona event listeners para os botões de paginação
  const prevBtn = container.querySelector(".prev-page");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      renderGridPage(items, pageIndex - 1, container);
    });
  }
  const nextBtn = container.querySelector(".next-page");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      renderGridPage(items, pageIndex + 1, container);
    });
  }
}

// ======= EVENTOS PARA O MODAL DE ADICIONAR HORÁRIO =======
// Abrir o modal de agendamento
addHorarioBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  // Esconde as outras seções
  horariosList.classList.add("hidden");
  rendimentosList.classList.add("hidden");
});

// Fechar o modal de agendamento
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Salvar horário (adiciona no array global e atualiza o localStorage)
saveHorarioBtn.addEventListener("click", () => {
  const cliente = document.getElementById("cliente").value.trim();
  const data = document.getElementById("data").value.trim();
  const horarioValue = document.getElementById("horario").value.trim();
  const tipo = document.getElementById("tipoUnha").value.trim();

  if (cliente && data && horarioValue && tipo) {
    horarios.push({ cliente, data, horario: horarioValue, tipo });
    localStorage.setItem("horarios", JSON.stringify(horarios));
    alert("Horário adicionado com sucesso!");
    modal.classList.add("hidden");
    // Limpa os campos do formulário
    document.getElementById("cliente").value = "";
    document.getElementById("data").value = "";
    document.getElementById("horario").value = "";
    document.getElementById("tipoUnha").value = "";
  } else {
    alert("Preencha todos os campos!");
  }
});

// ======= EXIBIR HORÁRIOS DA SEMANA COM PAGINAÇÃO =======
viewHorariosBtn.addEventListener("click", () => {
  // Exibe a seção de horários e esconde as demais
  horariosList.classList.remove("hidden");
  rendimentosList.classList.add("hidden");
  modal.classList.add("hidden");

  const hoje = new Date();

  // Calcula o início (domingo) e fim (sábado) da semana atual
  const inicioSemana = new Date(hoje);
  inicioSemana.setHours(0, 0, 0, 0);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);

  // Filtra os horários que caem dentro desta semana
  const horariosDaSemana = horarios.filter(h => {
    const dataHorario = new Date(h.data);
    return dataHorario >= inicioSemana && dataHorario <= fimSemana;
  });

  // Renderiza os horários da semana no grid (página 0)
  renderGridPage(horariosDaSemana, 0, horariosGrid);
});

// ======= EXIBIR RENDIMENTOS MENSAIS COM PAGINAÇÃO E BREAKDOWN =======
viewRendimentosBtn.addEventListener("click", () => {
  // Exibe a seção de rendimentos e esconde as demais
  rendimentosList.classList.remove("hidden");
  horariosList.classList.add("hidden");
  modal.classList.add("hidden");

  // Agrupa os horários por mês (chave no formato "YYYY-MM")
  const rendimentosPorMes = {};
  horarios.forEach(h => {
    const [ano, mes] = h.data.split("-");
    const chave = `${ano}-${mes}`;
    if (!rendimentosPorMes[chave]) rendimentosPorMes[chave] = [];
    rendimentosPorMes[chave].push(h);
  });

  // Atualiza as opções do seletor de mês
  let opcoes = "";
  for (const chave in rendimentosPorMes) {
    opcoes += `<option value="${chave}">${chave}</option>`;
  }
  mesSelector.innerHTML = opcoes;

  // Função para atualizar a exibição dos agendamentos do mês selecionado
  const updateRendimentos = () => {
    const selectedMonth = mesSelector.value;
    const agendamentos = rendimentosPorMes[selectedMonth] || [];
    const rendimentosGrid = document.getElementById("rendimentosGrid");
    // Renderiza os itens do mês selecionado (página 0)
    renderGridPage(agendamentos, 0, rendimentosGrid);

    // ======= CÁLCULO DOS RENDIMENTOS =======
    // Mapeamento dos preços por tipo de unha
    const priceMap = {
      "Pé e Mão": 55.00,
      "Mão": 35.00,
      "Pé": 40.00,
      "SPA": 60.00
    };

    // Inicializa a contagem e o total para cada tipo
    const breakdown = {
      "Pé e Mão": { count: 0, total: 0 },
      "Mão": { count: 0, total: 0 },
      "Pé": { count: 0, total: 0 },
      "SPA": { count: 0, total: 0 }
    };

    // Itera sobre os agendamentos para acumular os valores
    agendamentos.forEach(item => {
      if (breakdown[item.tipo] !== undefined) {
        breakdown[item.tipo].count++;
        breakdown[item.tipo].total += priceMap[item.tipo];
      }
    });

    // Calcula o total geral dos rendimentos do mês
    let grandTotal = 0;
    for (const key in breakdown) {
      grandTotal += breakdown[key].total;
    }

    // Monta o HTML com o breakdown dos rendimentos
    let breakdownHTML = "";
    for (const type in breakdown) {
      if (breakdown[type].count > 0) {
        breakdownHTML += `${type}: ${breakdown[type].count} x R$ ${priceMap[type].toFixed(2)} = R$ ${breakdown[type].total.toFixed(2)}<br>`;
      }
    }

    // Atualiza o elemento "totalFaturamento" com o total geral e o breakdown
    document.getElementById("totalFaturamento").innerHTML =
      `R$ ${grandTotal.toFixed(2)}<br>${breakdownHTML}`;
  };

  // Atualiza quando o usuário muda o mês
  mesSelector.onchange = updateRendimentos;
  // Atualiza imediatamente (se houver algum mês selecionado)
  if (mesSelector.value) {
    updateRendimentos();
  } else {
    document.getElementById("rendimentosGrid").innerHTML = "<p>Nenhum agendamento neste mês.</p>";
    document.getElementById("totalFaturamento").innerText = "0,00";
  }
});
