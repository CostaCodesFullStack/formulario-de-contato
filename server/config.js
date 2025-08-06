require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  email: {
    service: 'gmail',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  cors: {
    origin: 'http://localhost:5173',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5 // limite de 5 requisições por janela de tempo
  }
};
