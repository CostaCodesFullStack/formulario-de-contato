require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Rota de teste
app.get('/ping', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Configuração do rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // limite de 5 requisições por janela de tempo
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  // Configuração do transportador de email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: email, // Email do remetente
      to: process.env.EMAIL_USER,
      subject: `Nova mensagem de ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
      replyTo: email // Para respostas irem diretamente para o remetente
    });

    res.send('Mensagem enviada com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao enviar email.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
