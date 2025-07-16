const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const user = {
    name,
    email,
    password
  };

  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
    
  });

  if (response.ok) {
    alert('Usuário registrado com sucesso!');
    form.reset();
  } else {
    alert('Erro ao registrar usuário');
  }

  console.log(name, email, password);
});
