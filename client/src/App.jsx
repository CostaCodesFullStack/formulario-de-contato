import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'O nome é obrigatório' : '';
      case 'email':
        return !value.trim() 
          ? 'O email é obrigatório' 
          : !value.includes('@') 
          ? 'Email inválido' 
          : '';
      case 'message':
        return !value.trim() 
          ? 'A mensagem é obrigatória' 
          : value.length < 10 
          ? 'A mensagem deve ter pelo menos 10 caracteres' 
          : '';
      default:
        return '';
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatus({ message: 'Por favor, corrija os erros no formulário.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/contact', formData);
      setStatus({ message: 'Mensagem enviada com sucesso!', type: 'success' });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus({
        message: 'Erro ao enviar mensagem. Por favor, tente novamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <h2>Entre em Contato</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="name"
            placeholder="Nome"
            onChange={handleChange}
            value={formData.name}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <textarea
            name="message"
            placeholder="Mensagem"
            onChange={handleChange}
            value={formData.message}
            className={errors.message ? 'error' : ''}
          />
          {errors.message && <div className="error-text">{errors.message}</div>}
        </div>

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </form>
      
      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default App;
