const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors()); // Permitir que se possa acessar a base de dados desde qualquer página
app.use(express.json()); // Middleware para processar JSON

// Função para conectar ao banco de dados
async function connectToDatabase() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "study_manager",
    });
    console.log("Conectado a la base de datos MySQL");
    return db;
  } catch (err) {
    console.error("Error al conectar al MySQL:", err);
    process.exit(1); // Encerra o processo em caso de erro na conexão
  }
}

let db; // Variável global para armazenar a conexão

// Inicializa a conexão com o banco de dados
(async () => {
  try {
    db = await connectToDatabase(); // Inicializa a conexão com o banco de dados
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1); // Encerra o processo em caso de erro
  }
})();

// #region Endpoint para registrar usuario
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validações básicas no backend (mínimo necessário)
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 8 caracteres" });
  }

  try {
    // Verifica se o email já existe
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?", 
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    // Cria hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insere novo usuário
    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    res.status(201).json({ 
      message: "Usuário creado con éxito",
      userId: result.insertId 
    });

  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ 
      error: "Error al crear usuário",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
//#endregion

// #region Endpoint para comparar datos de login con database
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validações básicas
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña obligatórios" });
  }

  try {
    // Verifica se o usuário existe
    const [users] = await db.query(
      "SELECT id, email, password_hash FROM users WHERE email = ?", 
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Email e/o contraseña incorrecto(s)" });
    }

    const user = users[0];

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Email e/o contraseña incorrecto(s)" });
    }

    // Login bem-sucedido
    res.status(200).json({ 
      message: "Login hecho con éxito",
      userId: user.id,
      email: user.email,
    });

  } catch (err) {
    console.error("Error al hacer login:", err);
    res.status(500).json({ 
      error: "Error al hacer login:",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
//#endregion

// #region Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
// #endregion