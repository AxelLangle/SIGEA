  /*FUNCIONES PARA CORREGIR LA ORTOGRAFIA Y LAS MAYUSCULAS EN LOS PARRAFOS */
  
  function capitalizeParagraphs(text) {
    return text.replace(/(^|\n)([a-záéíóúñ])/g, (m, sep, letra) => sep + letra.toUpperCase());
  }

  function nombrePropio(str) {
    return str
      .toLowerCase()
      .replace(/(^|\s|\.)([a-záéíóúñ])/g, (m, sep, letra) => sep + letra.toUpperCase());
  }

  
  
  
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
      nombre = nombrePropio(nombre);
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
      nombre = nombrePropio(nombre);
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

  // Mostrar/ocultar lista de docentes eliminables
  document.getElementById('toggle-eliminar-docente').addEventListener('click', function() {
    const lista = document.getElementById('docentes-eliminables');
    lista.style.display = (lista.style.display === 'none' || lista.style.display === '') ? 'block' : 'none';
  });

  // Mostrar/ocultar lista de coordinadores eliminables
  document.getElementById('toggle-eliminar-coordinador').addEventListener('click', function() {
    const lista = document.getElementById('coordinadores-eliminables');
    lista.style.display = (lista.style.display === 'none' || lista.style.display === '') ? 'block' : 'none';
  });

  // Mostrar/ocultar lista de grupos eliminables
  document.getElementById('toggle-eliminar-grupo').addEventListener('click', function() {
    const lista = document.getElementById('grupos-eliminables');
    lista.style.display = (lista.style.display === 'none' || lista.style.display === '') ? 'block' : 'none';
  });

  // Opcional: Ocultar la lista si se hace clic fuera
  document.addEventListener('click', function(e) {
    [
      {btn: 'toggle-eliminar-docente', lista: 'docentes-eliminables'},
      {btn: 'toggle-eliminar-coordinador', lista: 'coordinadores-eliminables'},
      {btn: 'toggle-eliminar-grupo', lista: 'grupos-eliminables'}
    ].forEach(({btn, lista}) => {
      const btnElem = document.getElementById(btn);
      const listaElem = document.getElementById(lista);
      if (listaElem && btnElem && !listaElem.contains(e.target) && e.target !== btnElem) {
        listaElem.style.display = 'none';
      }
    });
  });

  async function guardarBorrador() {
    const btn = document.querySelector('.borrador');
    btn.disabled = true;
    btn.textContent = "Guardando...";

    // Recolecta todos los datos del formulario
    const form = document.querySelector('form');
    const formData = new FormData(form);
    let datos = {};
    formData.forEach((value, key) => {
      datos[key] = value;
    });

    // Arrays dinámicos
    datos['grupos_asignados'] = Array.from(document.querySelectorAll('input[name="grupos_asignados"]:checked')).map(cb => cb.value);
    datos['recursos_solicitados'] = Array.from(document.querySelectorAll('#lista li span')).map(span => span.textContent);

    // FECHAS Y HORAS COMO ARRAYS
    datos['fechas'] = Array.from(document.querySelectorAll('input[name^="fecha-dia-"]'))
      .map(input => input.value)
      .filter(val => val);

    datos['horas'] = Array.from(document.querySelectorAll('input[name^="hora-dia-"]'))
      .map(input => input.value)
      .filter(val => val);

    // Envía los datos al backend como borrador
    const res = await fetch('/api/eventos/borrador', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({datos: datos})
    });

    if (res.ok) {
      // Mensaje visual (puedes usar un div flotante, aquí es simple)
      btn.textContent = "¡Borrador guardado!";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Guardar como borrador";
        window.location.href = "/dashboard"; // Redirige al dashboard
      }, 800);
    } else {
      btn.disabled = false;
      btn.textContent = "Guardar como borrador";
      alert('Error al guardar borrador');
    }
  }

  function rellenarFormulario(datos) {
    // Campos simples (input, textarea, select)
    for (const key in datos) {
      if (!datos.hasOwnProperty(key)) continue;
      const campo = document.querySelector(`[name="${key}"]`);
      if (campo) {
        if (campo.type === 'checkbox') {
          campo.checked = Array.isArray(datos[key]) ? datos[key].includes(campo.value) : !!datos[key];
        } else if (campo.type === 'radio') {
          if (campo.value === datos[key]) campo.checked = true;
        } else {
          campo.value = datos[key];
        }
      }
    }

    // Grupos asignados (checkboxes múltiples)
    if (Array.isArray(datos.grupos_asignados)) {
      document.querySelectorAll('input[name="grupos_asignados"]').forEach(cb => {
        cb.checked = datos.grupos_asignados.includes(cb.value);
      });
      // Actualiza la visualización de seleccionados
      mostrarGruposSeleccionados();
    }

    // Fechas por día (si las guardas como fecha-dia-1, fecha-dia-2, etc.)
    Object.keys(datos).forEach(key => {
      if (key.startsWith('fecha-dia-')) {
        const input = document.getElementById(key);
        if (input) input.value = datos[key];
      }
    });

    // Lista editable de recursos (si guardas como array)
    if (Array.isArray(datos.recursos_solicitados)) {
      const lista = document.getElementById("lista");
      lista.innerHTML = "";
      datos.recursos_solicitados.forEach(valor => {
        const li = document.createElement("li");
        const btnDesplegar = document.createElement("button");
        btnDesplegar.type = "button";
        btnDesplegar.innerHTML = "&#x25B6;";
        btnDesplegar.title = "Mostrar/Ocultar";
        btnDesplegar.className = "desplegar";
        const detalleDiv = document.createElement("div");
        detalleDiv.className = "detalle-div";
        detalleDiv.textContent = valor;
        detalleDiv.style.display = "none";
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
        const span = document.createElement("span");
        span.title = valor;
        span.textContent = valor;
        span.ondblclick = function() {
          editarElemento(span, detalleDiv);
        };
        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.innerHTML = "🗑";
        btnEliminar.title = "Eliminar";
        btnEliminar.onclick = function(e) {
          e.preventDefault();
          lista.removeChild(li);
        };
        li.appendChild(btnDesplegar);
        li.appendChild(span);
        li.appendChild(btnEliminar);
        li.appendChild(detalleDiv);
        lista.appendChild(li);
      });
    }
  }

  async function enviarParaAprobacion(e) {
  e.preventDefault(); // Evita el submit normal del formulario
  const btn = document.querySelector('.aprobar');
  btn.disabled = true;
  btn.textContent = "Enviando...";

  // Recolecta todos los datos del formulario
  const form = document.querySelector('form');
  const formData = new FormData(form);
  let datos = {};
  formData.forEach((value, key) => {
    datos[key] = value;
  });

  // Arrays dinámicos
  datos['grupos_asignados'] = Array.from(document.querySelectorAll('input[name="grupos_asignados"]:checked')).map(cb => cb.value);
  datos['recursos_solicitados'] = Array.from(document.querySelectorAll('#lista li span')).map(span => span.textContent);

  // FECHAS Y HORAS COMO ARRAYS
  datos['fechas'] = Array.from(document.querySelectorAll('input[name^="fecha-dia-"]'))
    .map(input => input.value)
    .filter(val => val);

  datos['horas'] = Array.from(document.querySelectorAll('input[name^="hora-dia-"]'))
    .map(input => input.value)
    .filter(val => val);

  // === VALIDACIÓN ANTES DE ENVIAR ===
  const error = validarEvento(datos);
  if (error) {
    alert(error);
    btn.disabled = false;
    btn.textContent = "Enviar para aprobación";
    return;
  }

  // Envía los datos al backend como aprobado
  const res = await fetch('/api/eventos/aprobar', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({datos: datos})
  });

  if (res.ok) {
    btn.textContent = "¡Enviado!";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Enviar para aprobación";
      window.location.href = "/dashboard";
    }, 800);
  } else {
    btn.disabled = false;
    btn.textContent = "Enviar para aprobación";
    alert('Error al enviar evento');
  }
}

  function regresarABorrador(eventoId) {
    if (!confirm("¿Seguro que deseas regresar este evento a borrador para editarlo?")) return;
    fetch(`/api/eventos/${eventoId}/a_borrador`, {method: 'POST'})
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('El evento ahora es un borrador y puedes editarlo.');
          window.location.href = `/registrar_evento?editar=${eventoId}`;
        } else {
          alert('No se pudo cambiar el estado. Intenta de nuevo.');
        }
      });
  }

  function validarEvento(datos) {
    // 1. Campos obligatorios
    if (!datos.titulo || datos.titulo.trim() === "") return "El título es obligatorio.";
    if (!datos.tematica || datos.tematica.trim() === "") return "La temática es obligatoria.";
    if (!datos.justificacion || datos.justificacion.trim() === "") return "La justificación es obligatoria.";
    if (!datos.objetivo || datos.objetivo.trim() === "") return "El objetivo es obligatorio.";
    if (!datos.dinamica || datos.dinamica.trim() === "") return "La dinámica es obligatoria.";
    if (!datos.lugar || datos.lugar.trim() === "") return "El lugar es obligatorio.";
    if (!datos.docente || datos.docente.trim() === "") return "Selecciona un docente.";
    if (!datos.coordinador || datos.coordinador.trim() === "") return "Selecciona un coordinador.";
    if (!Array.isArray(datos.grupos_asignados) || datos.grupos_asignados.length === 0) return "Selecciona al menos un grupo.";
    if (!Array.isArray(datos.recursos_solicitados) || datos.recursos_solicitados.length === 0) return "Agrega al menos un recurso solicitado.";

    // 2. Validaciones de formato y lógica
    // Justificación y objetivo con longitud mínima
    if (datos.justificacion.trim().length < 20) return "La justificación debe tener al menos 20 caracteres.";
    if (datos.objetivo.trim().length < 10) return "El objetivo debe tener al menos 10 caracteres.";

    // Fechas: al menos una válida y futura
    const hoy = new Date();
    let algunaFechaValida = false;
    Object.keys(datos).forEach(key => {
      if (key.startsWith('fecha-dia-') && datos[key]) {
        const fecha = new Date(datos[key]);
        if (fecha > hoy) algunaFechaValida = true;
      }
    });
    if (!algunaFechaValida) return "Debes ingresar al menos una fecha futura.";

    // 3. Validación de unicidad (título)
    // Esta validación solo puede ser completa en el backend, pero puedes hacer una consulta rápida aquí si tienes los eventos cargados en JS.
    // (Opcional: puedes omitirla aquí y dejarla solo en backend)

    return null; // Sin errores
  }


  /* =======================
    6. INICIALIZACIÓN
    ======================= */
  window.addEventListener('DOMContentLoaded', function() {
    cargarDocentes();
    cargarCoordinadores();
    cargarGrupos();
    generarInputsFechas();


    // Detectar si hay un parámetro ?editar=ID
    const params = new URLSearchParams(window.location.search);
    if (params.has('editar')) {
      const eventoId = params.get('editar');
      fetch(`/api/eventos/${eventoId}`)
        .then(res => res.json())
        .then(data => {
          if (data.datos) {
            rellenarFormulario(data.datos);
          }
        });
    }
  });


  document.querySelector('form').addEventListener('submit', enviarParaAprobacion);
