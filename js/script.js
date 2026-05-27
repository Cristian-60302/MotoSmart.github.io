// Cambia esta URL por la URL real de tu API en Vercel.
const API_BASE_URL = 'https://motosmart-api-vercel-github-io.vercel.app/api';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  const logoutBtn = document.querySelector('#logoutBtn');
  const loginMessage = document.querySelector('#loginMessage');
  const registerMessage = document.querySelector('#registerMessage');
  const protectedPage = document.body.dataset.protected === 'true';

  function setMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = 'form-message ' + (type || '');
  }

  function getStoredUser() {
    const savedUser = localStorage.getItem('motosmart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  }

  function saveStoredUser(user) {
    if (user) {
      localStorage.setItem('motosmart_user', JSON.stringify(user));
      return;
    }

    localStorage.removeItem('motosmart_user');
  }

  async function apiRequest(path, data) {
    const response = await fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const payload = await response.json().catch(function() {
      return { ok: false, message: 'Respuesta invalida del servidor.' };
    });

    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || 'No se pudo completar la solicitud.');
    }

    return payload;
  }

  if (protectedPage && !getStoredUser()) {
    window.location.href = './login.html';
    return;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      setMessage(loginMessage, 'Verificando usuario...', '');

      const formData = new FormData(loginForm);

      try {
        const payload = await apiRequest('/login', {
          email: formData.get('email'),
          password: formData.get('password')
        });

        saveStoredUser(payload.user);
        setMessage(loginMessage, 'Sesion iniciada correctamente. Redirigiendo...', 'success');
        loginForm.reset();

        setTimeout(function() {
          window.location.href = './app.html';
        }, 700);
      } catch (error) {
        saveStoredUser(null);
        setMessage(loginMessage, error.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      setMessage(registerMessage, 'Creando usuario...', '');

      const formData = new FormData(registerForm);

      if (formData.get('password') !== formData.get('confirmPassword')) {
        setMessage(registerMessage, 'Las contrasenas no coinciden.', 'error');
        return;
      }

      try {
        await apiRequest('/register', {
          nombre: formData.get('nombre'),
          email: formData.get('email'),
          password: formData.get('password'),
          marca: formData.get('marca'),
          modelo: formData.get('modelo'),
          anio: formData.get('anio'),
          kilometraje: formData.get('kilometraje')
        });

        setMessage(registerMessage, 'Usuario registrado. Ahora puedes iniciar sesion.', 'success');
        registerForm.reset();

        setTimeout(function() {
          window.location.href = './login.html';
        }, 1000);
      } catch (error) {
        setMessage(registerMessage, error.message, 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      saveStoredUser(null);
      window.location.href = '../index.html';
    });
  }
});
