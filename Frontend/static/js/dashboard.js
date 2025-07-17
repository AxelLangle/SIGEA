
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

/*
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
*/

async function cargarEventosEnTabla() {
  const res = await fetch('/api/eventos/usuario');
  if (!res.ok) return;
  const eventos = await res.json();

  // Prepara arrays para cada estado
  const columnas = {
    'borrador': [],
    'pendiente': [],
    'terminado': [],
    'reporte enviado': []
  };

  eventos.forEach(ev => {
    const estado = ev.estado.toLowerCase();
    let col = '';
    if (estado === 'borrador') col = 'borrador';
    else if (estado === 'pendiente' || estado === 'aprobado') col = 'pendiente';
    else if (estado === 'terminado') col = 'terminado';
    else if (estado === 'reporte enviado') col = 'reporte enviado';
    else return;

    columnas[col].push(
      `<a href="/evento/${ev.id}" style="color:#811B49;font-weight:600;text-decoration:underline;cursor:pointer;">${ev.titulo}</a>`
    );
  });

  // Llena la tabla (solo una fila, cada celda con los eventos de ese estado)
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = `
    <tr>
      <td>${columnas['borrador'].join('<br>') || '<span style="color:gray;">Sin eventos</span>'}</td>
      <td>${columnas['pendiente'].join('<br>') || '<span style="color:gray;">Sin eventos</span>'}</td>
      <td>${columnas['terminado'].join('<br>') || '<span style="color:gray;">Sin eventos</span>'}</td>
      <td>${columnas['reporte enviado'].join('<br>') || '<span style="color:gray;">Sin eventos</span>'}</td>
    </tr>
  `;
}

window.addEventListener('DOMContentLoaded', cargarEventosEnTabla);