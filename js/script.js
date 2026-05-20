// script.js
// Funcionalidad básica del formulario de registro

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Registro enviado correctamente (borrador)');
    });
  }
});
