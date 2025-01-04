// Elementos
const addHorarioBtn = document.getElementById("addHorario");
const viewHorariosBtn = document.getElementById("viewHorario");
const viewRendimentosBtn = document.getElementById("viewRendimentos");
const closeModal = document.getElementById("closeModal");
const saveHorarioBtn = document.getElementById("saveHorario");
const modal = document.getElementById("agendaModal");
const horariosList = document.getElementById("horariosList");
const rendimentosList = document.getElementById("rendimentosList");
const horariosUl = document.getElementById("horarios");
const monthsDiv = document.getElementById("months");

let horarios = JSON.parse(localStorage.getItem("horarios")) || []; // Recupera ou inicializa horários

// Função auxiliar para obter o nome do dia da semana
const definirDiaSemana = (date) => {
  const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return dias[new Date(date).getDay()];
};

// Abrir Modal para adicionar horário
addHorarioBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  horariosList.classList.add("hidden");
  rendimentosList.classList.add("hidden");
});

// Fechar Modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Salvar Horário
saveHorarioBtn.addEventListener("click", () => {
  const cliente = document.getElementById("cliente").value.trim();
  const horario = document.getElementById("horario").value.trim();
  const data = document.getElementById("data").value.trim();

  if (cliente && horario && data) {
    horarios.push({ cliente, horario, data });
    localStorage.setItem("horarios", JSON.stringify(horarios));
    alert("Horário adicionado com sucesso!");
    modal.classList.add("hidden");
    document.getElementById("cliente").value = "";
    document.getElementById("horario").value = "";
    document.getElementById("data").value = "";
  } else {
    alert("Preencha todos os campos!");
  }
});

// Exibir Horários da Semana
viewHorariosBtn.addEventListener("click", () => {
  horariosList.classList.remove("hidden");
  rendimentosList.classList.add("hidden");
  modal.classList.add("hidden");

  if (horarios.length === 0) {
    horariosUl.innerHTML = "<li>Nenhum horário cadastrado.</li>";
  } else {
    horariosUl.innerHTML = horarios
      .map(
        (h) =>
          `<li><strong>${h.data} (${definirDiaSemana(h.data)})</strong> - ${h.horario} - ${h.cliente}</li>`
      )
      .join("");
  }
});

// Exibir Rendimentos por mês
viewRendimentosBtn.addEventListener("click", () => {
  rendimentosList.classList.remove("hidden");
  horariosList.classList.add("hidden");
  modal.classList.add("hidden");

  const rendimentosPorMes = horarios.reduce((acc, h) => {
    const [ano, mes] = h.data.split("-");
    const chave = `${ano}-${mes}`;

    if (!acc[chave]) acc[chave] = [];
    acc[chave].push(h);
    return acc;
  }, {});

  monthsDiv.innerHTML = Object.keys(rendimentosPorMes)
    .sort()
    .map((mes) => {
      const [ano, mesNum] = mes.split("-");
      const mesNome = new Date(ano, mesNum - 1).toLocaleString("pt-BR", { month: "long" });
      const agendamentos = rendimentosPorMes[mes]
        .map(
          (h) =>
            `<li><strong>${h.data} (${definirDiaSemana(h.data)})</strong> - ${h.horario} - ${h.cliente}</li>`
        )
        .join("");
      return `<div><h3>${mesNome} de ${ano}</h3><ul>${agendamentos}</ul></div>`;
    })
    .join("");
});
