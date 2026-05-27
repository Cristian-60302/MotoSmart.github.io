const API_BASE_URL = 'https://motosmart-api-vercel-github-io.vercel.app/api';

const MOTO_SPECS = [
  {
    brand: 'yamaha',
    modelKeywords: ['fz', 'fz 2.0', 'fzs'],
    specs: {
      'Motor': '149 cc, 4 tiempos, monocilindrico, refrigerado por aire',
      'Potencia maxima': '12.2 HP @ 7,250 RPM',
      'Torque maximo': '12.8 Nm @ 5,500 RPM',
      'Transmision': '5 velocidades',
      'Freno delantero': 'Disco 267 mm',
      'Freno trasero': 'Tambor 130 mm',
      'Peso': '137 kg aprox.',
      'Capacidad tanque': '13 litros',
      'Rendimiento estimado': '40 - 45 km/l',
      'Tipo de aceite': '20W-40 para motor 4T'
    }
  },
  {
    brand: 'honda',
    modelKeywords: ['cb 125', 'cb125', 'cb 125f'],
    specs: {
      'Motor': '124.7 cc, 4 tiempos, monocilindrico, refrigerado por aire',
      'Potencia maxima': '10.4 HP aprox.',
      'Torque maximo': '10.2 Nm aprox.',
      'Transmision': '5 velocidades',
      'Freno delantero': 'Disco',
      'Freno trasero': 'Tambor',
      'Capacidad tanque': '10.1 litros aprox.',
      'Rendimiento estimado': '45 - 55 km/l',
      'Tipo de aceite': '10W-30 o 20W-50 para motor 4T segun manual'
    }
  },
  {
    brand: 'suzuki',
    modelKeywords: ['gixxer', 'gixxer 150'],
    specs: {
      'Motor': '155 cc, 4 tiempos, monocilindrico, refrigerado por aire',
      'Potencia maxima': '13.6 HP aprox.',
      'Torque maximo': '13.8 Nm aprox.',
      'Transmision': '5 velocidades',
      'Freno delantero': 'Disco',
      'Freno trasero': 'Disco o tambor segun version',
      'Capacidad tanque': '12 litros aprox.',
      'Rendimiento estimado': '40 - 50 km/l',
      'Tipo de aceite': '10W-40 para motor 4T'
    }
  },
  {
    brand: 'bajaj',
    modelKeywords: ['pulsar ns 200', 'ns 200', 'ns200'],
    specs: {
      'Motor': '199.5 cc, 4 tiempos, monocilindrico, refrigerado por liquido',
      'Potencia maxima': '24.5 HP aprox.',
      'Torque maximo': '18.7 Nm aprox.',
      'Transmision': '6 velocidades',
      'Freno delantero': 'Disco',
      'Freno trasero': 'Disco',
      'Capacidad tanque': '12 litros aprox.',
      'Rendimiento estimado': '30 - 40 km/l',
      'Tipo de aceite': '20W-50 para motor 4T'
    }
  },
  {
    brand: 'ktm',
    modelKeywords: ['duke 200', '200 duke'],
    specs: {
      'Motor': '199.5 cc, 4 tiempos, monocilindrico, refrigerado por liquido',
      'Potencia maxima': '25 HP aprox.',
      'Torque maximo': '19.3 Nm aprox.',
      'Transmision': '6 velocidades',
      'Freno delantero': 'Disco',
      'Freno trasero': 'Disco',
      'Capacidad tanque': '13.4 litros aprox.',
      'Rendimiento estimado': '30 - 38 km/l',
      'Tipo de aceite': '10W-50 sintetico para motor 4T'
    }
  },
  {
    brand: 'akt',
    modelKeywords: ['nkd', 'nkd 125'],
    specs: {
      'Motor': '124 cc aprox., 4 tiempos, monocilindrico',
      'Potencia maxima': '10 HP aprox.',
      'Transmision': '5 velocidades',
      'Freno delantero': 'Disco',
      'Freno trasero': 'Tambor',
      'Capacidad tanque': '12 litros aprox.',
      'Rendimiento estimado': '40 - 50 km/l',
      'Tipo de aceite': '20W-50 para motor 4T'
    }
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  const logoutBtn = document.querySelector('#logoutBtn');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#mainNav');
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

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function formatNumber(value) {
    const number = Number(value || 0);
    return number.toLocaleString('es-CO');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getMotoLabel(user) {
    const brand = user.marca || 'Marca no registrada';
    const model = user.modelo || 'Modelo no registrado';
    const year = user.anio || 'Ano no registrado';
    return `${brand} ${model} - ${year}`;
  }

  function findCatalogSpecs(user) {
    const brand = normalizeText(user.marca);
    const model = normalizeText(user.modelo);

    return MOTO_SPECS.find(function(item) {
      const sameBrand = brand === item.brand;
      const sameModel = item.modelKeywords.some(function(keyword) {
        return model.includes(normalizeText(keyword));
      });

      return sameBrand && sameModel;
    });
  }

  function renderMotoSpecs(user) {
    const specsDescription = document.querySelector('#specsDescription');
    const specsTableBody = document.querySelector('#specsTableBody');
    const dashboardDescription = document.querySelector('#dashboardDescription');
    const accessoryNotice = document.querySelector('#accessoryNotice');

    if (!specsTableBody || !user) return;

    const motoLabel = getMotoLabel(user);
    const catalog = findCatalogSpecs(user);
    const rows = {
      'Marca registrada': user.marca || 'No registrada',
      'Modelo registrado': user.modelo || 'No registrado',
      'Ano': user.anio || 'No registrado',
      'Kilometraje actual': `${formatNumber(user.kilometraje)} km`
    };

    if (catalog) {
      Object.assign(rows, catalog.specs);
      specsDescription.textContent = `Ficha tecnica de tu moto registrada: ${motoLabel}.`;
    } else {
      rows['Ficha tecnica exacta'] = 'No disponible para este modelo en el catalogo actual.';
      rows['Sugerencia'] = 'Agrega manualmente las especificaciones del manual del fabricante para este modelo.';
      specsDescription.textContent = `Datos registrados de tu moto: ${motoLabel}.`;
    }

    specsTableBody.innerHTML = Object.entries(rows)
      .map(function([label, value]) {
        return `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`;
      })
      .join('');

    if (dashboardDescription) {
      dashboardDescription.textContent = `Vista previa del estado de los componentes de tu moto (${motoLabel} - ${formatNumber(user.kilometraje)} km).`;
    }

    if (accessoryNotice) {
      accessoryNotice.textContent = `Nuevo accesorio disponible para tu ${user.marca || 'moto'} ${user.modelo || ''}.`;
    }
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

  const currentUser = getStoredUser();

  if (protectedPage && !currentUser) {
    window.location.href = './login.html';
    return;
  }

  if (protectedPage) {
    renderMotoSpecs(currentUser);
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

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
