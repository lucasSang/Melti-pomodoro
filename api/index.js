import express from 'express'
  import knex from 'knex'
  import cors from 'cors'
  import bcrypt from 'bcrypt'

  const app = express()
  const port = 3000

  app.use(express.json())
  app.use(cors())


  const KnexDb = knex({
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'wLXGm.r>3',
      database: 'melti_db',
    },
  });


//////////////////////////////////////////////////////////////////////////


  app.get('/Login', async (req, res) => {

      const Login = await KnexDb("usuario").select("*");
      res.json(Login);

  });


  app.post("/login/", async (req, res) => {
    const { email, senha } = req.body;

  try {
    const user = await KnexDb('usuario').where({ email }).first();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const issenhaValid = await bcrypt.compare(senha, user.senha);

    if (!issenhaValid) {
      return res.status(401).json({ error: 'Invalid senha' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});


//////////////////////////////////////////////////////////////////////////


  app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }
  
    const senhaCriptografada = await bcrypt.hash(password, 10);
  
    try {
      await KnexDb("usuario").insert({ nome: name, email, senha: senhaCriptografada });
      res.send("Você registrou com sucesso!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao registrar usuário.");
    }
  });

//////////////////////////////////////////////////////////////////////////

  app.post("/categoria/timer", async (req, res) => {

    const { nome, usuario_id, cor_id } = req.body;

    try {
      await KnexDb("categoria").insert({ nome, usuario_id, cor_id });
      res.send("Categoria criada com sucesso!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao criar categoria.");
    }
  });

//////////////////////////////////////////////////////////////////////////

  app.get("/cor", async (req, res) => {

    const cores = await KnexDb("cor").select("*");
    res.json(cores);  
    
});


  // POST /categoria
  app.post("/categoria", async (req, res) => {
    const { nome, cor_id, usuario_id } = req.body;
    let categoria = await KnexDb("categoria").where({ nome, usuario_id }).first();
    if (!categoria) {
      const [id] = await KnexDb("categoria").insert({ nome, cor_id, usuario_id });
      categoria = { id };
    }
    res.json(categoria);
  });

  // POST /timer
  app.post("/timer", async (req, res) => {
  let { duracao, nome, is_complete, hor_inicio, hor_fim, usuario_id, cor_id } = req.body;

  // Converte para formato MySQL
  function toMysqlDatetime(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }

  hor_inicio = toMysqlDatetime(hor_inicio);
  hor_fim = hor_fim ? toMysqlDatetime(hor_fim) : null;

  const [id] = await KnexDb("timers").insert({
    duracao,
    nome,
    is_complete,
    hor_inicio,
    hor_fim,
    usuario_id,
    cor_id
  });
  res.json({ id });
});


  // GET /timer?usuario_id=1
  app.get("/timer", async (req, res) => {
    const { usuario_id } = req.query;
    const timers = await KnexDb("timers").where({ usuario_id }).select("*");
    res.json(timers);
  });

app.put("/timer/complete", async (req, res) => {
  const { id, is_complete, hor_fim } = req.body;
  function toMysqlDatetime(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }
  const horFimMysql = toMysqlDatetime(hor_fim);

  await KnexDb("timers")
    .where({ id })
    .update({ is_complete: is_complete ? 1 : 0, hor_fim: horFimMysql });

  res.json({ success: true });
});

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

  //////////////////////////////////////////////////////////////////////////