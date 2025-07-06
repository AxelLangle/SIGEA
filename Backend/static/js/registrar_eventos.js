

  /* =======================
    1. LISTA EDITABLE DE RECURSOS
    ======================= */
  function agregarElemento() {
    const entrada = document.getElementById("entrada");
    const valor = entrada.value.trim();
    if (valor !== "") {
      const lista = document.getElementById("lista");
      const li = document.createElement("li");

      // Botón desplegable ">"
      const btnDesplegar = document.createElement("button");
      btnDesplegar.type = "button";
      btnDesplegar.innerHTML = "&#x25B6;";
      btnDesplegar.title = "Mostrar/Ocultar";
      btnDesplegar.className = "desplegar";
      btnDesplegar.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (detalleDiv.style.display === "none") {
          detalleDiv.style.display = "block";
          btnDesplegar.innerHTML = "&#9662;";
        } else {
          detalleDiv.style.display = "none";
          btnDesplegar.innerHTML = "&#x25B6;";
        }
      };

      // Crear span para mostrar el texto (resumido)
      const span = document.createElement("span");
      span.title = valor;
      span.textContent = valor;
      span.ondblclick = function() {
        editarElemento(span, detalleDiv);
      };

      // Crear botón de eliminar con ícono
      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.innerHTML = "🗑";
      btnEliminar.title = "Eliminar";
      btnEliminar.onclick = function(e) {
        e.preventDefault();
        lista.removeChild(li);
      };

      // Área de detalle (desplegable)
      const detalleDiv = document.createElement("div");
      detalleDiv.className = "detalle-div";
      detalleDiv.textContent = valor;
      detalleDiv.style.display = "none";

      li.appendChild(btnDesplegar);
      li.appendChild(span);
      li.appendChild(btnEliminar);
      li.appendChild(detalleDiv);
      lista.appendChild(li);
      entrada.value = "";
    }
  }

  function editarElemento(span, detalleDiv) {
    const textoOriginal = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = textoOriginal;
    input.className = "edicion";

    input.onblur = function() {
      const nuevoValor = input.value.trim() || textoOriginal;
      span.textContent = nuevoValor;
      span.title = nuevoValor;
      if (detalleDiv) detalleDiv.textContent = nuevoValor;
      span.ondblclick = function() {
        editarElemento(span, detalleDiv);
      };
      span.style.display = "inline";
      input.remove();
    };

    span.parentNode.insertBefore(input, span);
    span.style.display = "none";
    input.focus();
  }

  // Permitir agregar con Enter
  document.getElementById("entrada").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarElemento();
    }
  });

  /* =======================
    2. FECHAS DINÁMICAS POR DÍA
    ======================= */
  function generarInputsFechas() {
    const numDias = parseInt(document.getElementById("num-dias").value) || 1;
    const contenedor = document.getElementById("fechas-dias");
    contenedor.innerHTML = "";
    for (let i = 1; i <= numDias; i++) {
      const label = document.createElement("label");
      label.setAttribute("for", "fecha-dia-" + i);
      label.style.display = "block";
      label.style.marginTop = "10px";
      label.style.fontWeight = "700";
      label.style.color = "var(--guinda)";
      label.textContent = `Fecha y hora del día ${i}:`;

      const input = document.createElement("input");
      input.type = "datetime-local";
      input.id = "fecha-dia-" + i;
      input.name = "fecha-dia-" + i;
      input.style.width = "100%";
      input.style.padding = "10px 14px";
      input.style.marginTop = "5px";
      input.style.boxSizing = "border-box";
      input.style.border = "1.5px solid #C8C8C8";
      input.style.borderRadius = "8px";
      input.style.fontSize = "1rem";
      input.style.background = "var(--gris-claro)";
      input.style.fontFamily = "'Open Sans', Arial, sans-serif";
      input.style.marginBottom = "8px";
      input.style.color = "var(--negro)";

      contenedor.appendChild(label);
      contenedor.appendChild(input);
    }
  }
  document.getElementById("num-dias").addEventListener("input", generarInputsFechas);
  window.addEventListener("DOMContentLoaded", generarInputsFechas);

  /* =======================
    3. DOCENTES (CRUD via API)
    ======================= */
  async function cargarDocentes() {
    const res = await fetch('/api/docentes');
    const docentes = await res.json();
    actualizarSelect('docente', docentes);
    // Si tienes un segundo select de docente, descomenta la siguiente línea:
    // actualizarSelect('docente2', docentes);
    renderDocentesEliminables(docentes);
  }

  async function agregarDocente() {
    const input = document.getElementById('nuevo-docente');
    const nombre = input.value.trim();
    if (nombre) {
      const res = await fetch('/api/docentes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre})
      });
      if (res.ok) {
        input.value = '';
        cargarDocentes();
      } else {
        alert('No se pudo agregar docente');
      }
    }
  }

  async function eliminarDocente(id) {
    await fetch(`/api/docentes/${id}`, {method: 'DELETE'});
    cargarDocentes();
  }

  function renderDocentesEliminables(docentes) {
    const cont = document.getElementById('docentes-eliminables');
    if (!cont) return;
    cont.innerHTML = '';
    docentes.forEach(({id, nombre}) => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.gap = '8px';
      div.style.marginBottom = '2px';
      div.innerHTML = `<span>${nombre}</span>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.title = 'Eliminar';
      btn.innerHTML = '🗑️';
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = () => eliminarDocente(id);
      div.appendChild(btn);
      cont.appendChild(div);
    });
  }

  function actualizarSelect(id, opciones) {
    const select = document.getElementById(id);
    if (!select) return;
    const placeholder = select.options[0];
    select.innerHTML = '';
    select.appendChild(placeholder);
    opciones.forEach(({id, nombre}) => {
      const opt = document.createElement('option');
      opt.value = nombre;
      opt.textContent = nombre;
      select.appendChild(opt);
    });
  }

  /* =======================
    4. COORDINADORES (CRUD via API)
    ======================= */
  async function cargarCoordinadores() {
    const res = await fetch('/api/coordinadores');
    const coordinadores = await res.json();
    actualizarSelect('coordinador', coordinadores);
    renderCoordinadoresEliminables(coordinadores);
  }

  async function agregarCoordinador() {
    const input = document.getElementById('nuevo-coordinador');
    const nombre = input.value.trim();
    if (nombre) {
      const res = await fetch('/api/coordinadores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre})
      });
      if (res.ok) {
        input.value = '';
        cargarCoordinadores();
      } else {
        alert('No se pudo agregar coordinador');
      }
    }
  }

  async function eliminarCoordinador(id) {
    await fetch(`/api/coordinadores/${id}`, {method: 'DELETE'});
    cargarCoordinadores();
  }

  function renderCoordinadoresEliminables(coordinadores) {
    const cont = document.getElementById('coordinadores-eliminables');
    if (!cont) return;
    cont.innerHTML = '';
    coordinadores.forEach(({id, nombre}) => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.gap = '8px';
      div.style.marginBottom = '2px';
      div.innerHTML = `<span>${nombre}</span>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.title = 'Eliminar';
      btn.innerHTML = '🗑️';
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = () => eliminarCoordinador(id);
      div.appendChild(btn);
      cont.appendChild(div);
    });
  }

  /* =======================
    5. GRUPOS (CRUD via API, CHECKBOXES Y DESPLEGABLE)
    ======================= */
  async function cargarGrupos() {
    const res = await fetch('/api/grupos');
    const grupos = await res.json();
    actualizarListaGrupos(grupos);
    renderGruposEliminables(grupos);
  }

  async function agregarGrupo() {
    const input = document.getElementById('nuevo-grupo');
    const nombre = input.value.trim();
    if (nombre) {
      const res = await fetch('/api/grupos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre})
      });
      if (res.ok) {
        input.value = '';
        cargarGrupos();
      } else {
        alert('No se pudo agregar grupo');
      }
    }
  }

  async function eliminarGrupo(id) {
    await fetch(`/api/grupos/${id}`, {method: 'DELETE'});
    cargarGrupos();
  }

  function actualizarListaGrupos(grupos) {
    const lista = document.getElementById('lista-grupos');
    lista.innerHTML = '';
    grupos.forEach(({id, nombre}) => {
      const checkboxId = 'grupo_' + id;
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = nombre;
      checkbox.id = checkboxId;
      checkbox.name = 'grupos_asignados';
      checkbox.onchange = mostrarGruposSeleccionados;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + nombre));
      lista.appendChild(label);
    });
  }

  function renderGruposEliminables(grupos) {
    const cont = document.getElementById('grupos-eliminables');
    if (!cont) return;
    cont.innerHTML = '';
    grupos.forEach(({id, nombre}) => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.gap = '8px';
      div.style.marginBottom = '2px';
      div.innerHTML = `<span>${nombre}</span>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.title = 'Eliminar';
      btn.innerHTML = '🗑️';
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = () => eliminarGrupo(id);
      div.appendChild(btn);
      cont.appendChild(div);
    });
  }

  function mostrarGruposSeleccionados() {
    const checkboxes = document.querySelectorAll('#lista-grupos input[type="checkbox"]:checked');
    const seleccionados = Array.from(checkboxes).map(cb => cb.value);
    document.getElementById('grupos-seleccionados').textContent =
      seleccionados.length ? 'Seleccionados: ' + seleccionados.join(', ') : '';
  }

  // Mostrar/ocultar lista de grupos
  document.getElementById('toggle-grupos').addEventListener('click', function() {
    const lista = document.getElementById('lista-grupos');
    lista.style.display = (lista.style.display === 'none' || lista.style.display === '') ? 'block' : 'none';
  });

  // Cerrar el desplegable si se hace clic fuera
  document.addEventListener('click', function(e) {
    const lista = document.getElementById('lista-grupos');
    const toggle = document.getElementById('toggle-grupos');
    if (!lista.contains(e.target) && e.target !== toggle) {
      lista.style.display = 'none';
    }
  });

  /* =======================
    6. INICIALIZACIÓN
    ======================= */
  window.addEventListener('DOMContentLoaded', function() {
    cargarDocentes();
    cargarCoordinadores();
    cargarGrupos();
    generarInputsFechas();
  });
