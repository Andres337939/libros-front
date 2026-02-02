// src/components/Modal/LoginModal.jsx (actualizado)
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Usuario es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(formData.username, formData.password);
    if (result.success) {
      onClose();
      setFormData({ username: '', password: '' });
      setErrors({});
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setErrors({});
    onClose();
  };

  const handleSwitchToRegister = () => {
    handleClose();
    if (onSwitchToRegister) onSwitchToRegister();
  };

  const styles = {
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    errorMessage: {
      background: '#ffeaea',
      color: '#ff4757',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      textAlign: 'center',
      border: '1px solid #ffcccc'
    },
    formFooter: {
      marginTop: '1rem'
    },
    loginOptions: {
      marginTop: '1.5rem',
      textAlign: 'center'
    },
    demoCredentials: {
      background: '#f8f9fa',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.85rem',
      color: '#666',
      marginBottom: '1rem',
      border: '1px dashed #dee2e6'
    },
    registerLink: {
      color: '#666',
      fontSize: '0.9rem'
    },
    linkBtn: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      cursor: 'pointer',
      fontWeight: 600,
      padding: 0,
      textDecoration: 'underline'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Iniciar Sesión"
      size="small"
    >
      <form onSubmit={handleSubmit} style={styles.loginForm}>
        <InputField
          name="username"
          label="Usuario"
          placeholder="Ingresa tu usuario"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />

        <InputField
          type="password"
          name="password"
          label="Contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        {errors.submit && (
          <div style={styles.errorMessage}>
            ⚠️ {errors.submit}
          </div>
        )}

        <div style={styles.formFooter}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
          >
            Iniciar Sesión
          </Button>

          <div style={styles.loginOptions}>
            <p style={styles.demoCredentials}>
              <strong>Credenciales demo:</strong><br />
              Usuario: <strong>admin</strong><br />
              Contraseña: <strong>123456</strong>
            </p>
            <p style={styles.registerLink}>
              ¿No tienes cuenta?{' '}
              <button 
                type="button" 
                style={styles.linkBtn}
                onClick={handleSwitchToRegister}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;