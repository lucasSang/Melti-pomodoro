const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    const user = {
        email,
        senha
    };

    const resposta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const data = await resposta.json();
    if (data.user && data.user.id) {
        localStorage.setItem('usuario_id', data.user.id);
        window.location.href = './timer.html';
    } else {
        alert('Login inválido!');
    }

});
