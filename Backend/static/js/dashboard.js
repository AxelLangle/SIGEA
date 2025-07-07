
function registrarEvento() {
    alert('Funcionalidad de registro de evento aún no implementada.');
}
function mostrarNombreArchivo() {
    const input = document.getElementById('archivo');
    const nombreDiv = document.getElementById('archivo-nombre');
    if (input.files.length > 0) {
    nombreDiv.textContent = "Archivo seleccionado: " + input.files[0].name;
    } else {
    nombreDiv.textContent = "";
    }
}

async function cargarBorradores() {
  const res = await fetch('/api/eventos/borrador');
  if (!res.ok) return;
  const eventos = await res.json();
  const lista = document.getElementById('borradores-list');
  lista.innerHTML = '';
  if (eventos.length === 0) {
    lista.innerHTML = '<li style="color:gray;">No hay borradores</li>';
    return;
  }
  eventos.forEach(ev => {
    const li = document.createElement('li');
    li.style.marginBottom = '8px';
    li.innerHTML = `<a href="/evento/${ev.id}" style="color:var(--guinda);font-weight:600;text-decoration:underline;cursor:pointer;">${ev.titulo}</a>`;
    lista.appendChild(li);
  });
}
window.addEventListener('DOMContentLoaded', cargarBorradores);


