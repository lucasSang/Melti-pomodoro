const usuario_id = localStorage.getItem('usuario_id');

async function loadHistory() {

  const res = await fetch(`http://localhost:3000/timer?usuario_id=${usuario_id}`);
  const timers = await res.json();


  const resCor = await fetch("http://localhost:3000/cor");
  const cores = await resCor.json();

  const historicoSection = document.getElementById('historico-timers');
  historicoSection.innerHTML = "";

  timers.forEach(timer => {

    const cor = cores.find(c => c.id === timer.cor_id);

    historicoSection.innerHTML += `
      <div class="timer-item">
        <span class="timer-nome">${timer.nome}</span>
        <span>${formatarData(timer.hor_inicio)}</span>
        <span>${formatarDuracao(timer.duracao)}</span>
        <span class="timer-status ${timer.is_complete ? "complete" : "incomplete"}">
          ${timer.is_complete ? "Completo" : "Incompleto"}
        </span>
        <span class="timer-cor" style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${cor ? cor.hex : "#ccc"};border:1px solid #51A8D5;" title="${cor ? cor.nome : "Sem cor"}"></span>
      </div>
    `;
  });
}

function formatarData(dataStr) {
  const d = new Date(dataStr);
  return d.toLocaleString("pt-BR");
}

function formatarDuracao(segundos) {
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min}m ${sec}s`;
}

loadHistory();