
async function loadUsers() {
  const response = await fetch('http://localhost:3000/users');
  const userData = await response.json();

  const card = document.querySelector('.cards');
  card.innerHTML = userData.map((user) => `
    <div class="card">
      <img src="../img/lebron.jpg" alt="cabra">
      <h2>${user.nome}</h2>
      <p>${user.email}</p>
      <button onclick="location.href = './user.html?id=${user.id}'">View Profile</button>
    </div>
  `).join('');
}

loadUsers();


const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('password').value;

  if (!nome || !email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  const user = { nome, email, senha };

  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  if (response.ok) {
    alert('Usuário registrado com sucesso!');
    form.reset();
    window.location.href = 'login.html';
  } else {
    alert('Erro ao registrar usuário');
  }
});