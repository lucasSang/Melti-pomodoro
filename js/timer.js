let countdown;
let isPaused = false;
let timeLeft = 0;


const timerDisplay = document.querySelector('#timer p');
const applyBtn = document.querySelector('.settings-modal__btn');
const playBtn = document.querySelector('.button a:first-child');
const usuario_id = localStorage.getItem('usuario_id');


applyBtn.addEventListener('click', async () => {
  const timeNome = document.getElementById('taskInput').value;
  const tempoMin = parseInt(document.getElementById('pomodoro').value);
  const tempo = tempoMin * 60;
  const corSelect = document.getElementById('cor');
  const cor_id = corSelect ? corSelect.value : null;

  if (!timeNome || !tempoMin || !cor_id) {
    alert("Preencha todos os campos!");
    return;
  }


  const res = await fetch('http://localhost:3000/timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      duracao: tempo,
      nome: timeNome,
      is_complete: false,
      hor_inicio: getBrasiliaDatetime(),
      hor_fim: null,
      usuario_id,
      cor_id
    })
  });
  const data = await res.json();
  const timerId = data.id;


  document.getElementById('settings-modal').hidePopover();


  const input = document.getElementById('taskInput');
  const title = document.getElementById('taskTitle');
  title.textContent = timeNome;
  title.style.display = 'block';
  input.style.display = 'none';


  startTimer(tempo, timerId);
});


function startTimer(seconds, timerId) {
  clearInterval(countdown);
  timeLeft = seconds;
  isPaused = false;
  displayTimeLeft(timeLeft);

  countdown = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      displayTimeLeft(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.textContent = "Tempo esgotado!";
        updateTimerComplete(timerId);
      }
    }
  }, 1000);
}


function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  timerDisplay.textContent = `${minutes}:${secondsRemaining < 10 ? "00" : ""}${secondsRemaining}`;
}


document.querySelectorAll('[data-accent-color]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('[data-accent-color]').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  });
});


playBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (timeLeft > 0) {
    isPaused = !isPaused;
    const img = playBtn.querySelector('img');
    if (img) {
      img.src = isPaused ? "Imagens/Play.png" : "Imagens/Pause.png";
    }
  }
});


function getBrasiliaDatetime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}


async function updateTimerComplete(timerId) {
  await fetch(`http://localhost:3000/timer/complete`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: timerId,
      is_complete: true,
      hor_fim: getBrasiliaDatetime()
    })
  });
}


async function loadColors() {
  const resposta = await fetch("http://localhost:3000/cor");
  const dadosCor = await resposta.json();
  const cores = document.getElementById("cor");
  const coresFiltradas = dadosCor.filter(cor => cor.id !== 1);

  cores.innerHTML = coresFiltradas.map(cor =>
    `<option value="${cor.id}">${cor.nome}</option>`
  ).join('');
}

loadColors();