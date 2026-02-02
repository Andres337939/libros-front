// src/components/Modal/RegisterModal.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar usuario
    if (!formData.username.trim()) {
      newErrors.username = 'Usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo letras, números y guiones bajos';
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    }
    
    // Validar confirmación
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://200.7.102.135:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      // Registro exitoso
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ username: '', password: '', confirmPassword: '' });
        // Opcional: Cambiar automáticamente a login
        if (onSwitchToLogin) onSwitchToLogin();
      }, 2000);

    } catch (error) {
      console.error('Register error:', error);
      setErrors({ 
        submit: error.message || 'Error al registrar. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '', confirmPassword: '' });
    setErrors({});
    setSuccess(false);
    onClose();
  };

  const handleSwitchToLogin = () => {
    handleClose();
    if (onSwitchToLogin) onSwitchToLogin();
  };

  const styles = {
    registerForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    successMessage: {
      background: '#d4edda',
      color: '#155724',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      textAlign: 'center',
      border: '1px solid #c3e6cb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
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
    registerOptions: {
      marginTop: '1.5rem',
      textAlign: 'center'
    },
    requirements: {
      background: '#f8f9fa',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.85rem',
      color: '#666',
      marginBottom: '1rem',
      border: '1px dashed #dee2e6'
    },
    loginLink: {
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
    },
    passwordStrength: {
      fontSize: '0.8rem',
      marginTop: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    strengthWeak: { color: '#ff4757' },
    strengthMedium: { color: '#f39c12' },
    strengthStrong: { color: '#2ecc71' }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { text: '', className: '' };
    
    const length = formData.password.length;
    if (length < 6) return { text: 'Débil', className: styles.strengthWeak };
    if (length < 8) return { text: 'Media', className: styles.strengthMedium };
    return { text: 'Fuerte', className: styles.strengthStrong };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Cuenta"
      size="small"
    >
      {success ? (
        <div style={styles.successMessage}>
          <span>✅</span>
          <div>
            <strong>¡Registro exitoso!</strong><br />
            Tu cuenta ha sido creada correctamente.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.registerForm}>
          <InputField
            name="username"
            label="Nombre de Usuario"
            placeholder="Ej: juanperez"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <div>
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
            {formData.password && (
              <div style={styles.passwordStrength}>
                <span>Seguridad: </span>
                <span style={passwordStrength.className}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          <InputField
            type="password"
            name="confirmPassword"
            label="Confirmar Contraseña"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
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
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <div style={styles.registerOptions}>
              <div style={styles.requirements}>
                <strong>Requisitos:</strong>
                <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                  <li>Usuario: mínimo 3 caracteres</li>
                  <li>Contraseña: mínimo 6 caracteres</li>
                  <li>Solo letras, números y _</li>
                </ul>
              </div>

              <p style={styles.loginLink}>
                ¿Ya tienes cuenta?{' '}
                <button 
                  type="button" 
                  style={styles.linkBtn}
                  onClick={handleSwitchToLogin}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RegisterModal;