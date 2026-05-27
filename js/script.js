// script.js
// Frontend para GitHub Pages. Cambia esta URL cuando tengas publicada tu API.
const API_BASE_URL = 'https://motosmart-api-vercel-github-io.vercel.app/api';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  const logoutBtn = document.querySelector('#logoutBtn');

  const loginMessage = document.querySelector('#loginMessage');
  const registerMessage = document.querySelector('#registerMessage');
  const sessionBox = document.querySelector('#sessionBox');
  const sessionName = document.querySelector('#sessionName');
  const sessionEmail = document.querySelector('#sessionEmail');

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
    const options = data
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      }
      : { method: 'GET' };

    const url = API_BASE_URL + path;
    const response = await fetch(url, options);
    const payload = await response.json().catch(function() {
      return { ok: false, message: 'Respuesta invalida del servidor.' };
    });

    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || 'No se pudo completar la solicitud.');
    }

    return payload;
  }

  function renderSession(user) {
    const hasUser = Boolean(user);

    if (loginForm) loginForm.hidden = hasUser;
    if (sessionBox) sessionBox.hidden = !hasUser;

    if (hasUser) {
      sessionName.textContent = user.nombre;
      sessionEmail.textContent = user.email;
      setMessage(loginMessage, 'Sesion iniciada correctamente.', 'success');
    }
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
        renderSession(payload.user);
        loginForm.reset();
      } catch (error) {
        renderSession(null);
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

        setMessage(registerMessage, 'Usuario registrado. Ya puedes iniciar sesion.', 'success');
        registerForm.reset();
      } catch (error) {
        setMessage(registerMessage, error.message, 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      saveStoredUser(null);
      renderSession(null);
      setMessage(loginMessage, 'Sesion cerrada.', 'success');
    });
  }

  renderSession(getStoredUser());
});
