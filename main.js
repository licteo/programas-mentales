const cards = document.querySelectorAll('.program-card');
const detailSection = document.getElementById('program-detail');
const mainContent = document.getElementById('main-content');
const backBtn = document.getElementById('back-btn');
const programTitle = document.getElementById('program-title');
const programNotes = document.getElementById('program-notes');
const notesToolbar = document.getElementById('notes-toolbar');

// Nuevo: contenedor para actividades
let programActivities = document.getElementById('program-activities');
if (!programActivities) {
  programActivities = document.createElement('div');
  programActivities.id = 'program-activities';
  programActivities.style.marginBottom = '1.5rem';
  detailSection.insertBefore(programActivities, programNotes);
}

let currentProgram = null;
let quill = null;

const defaultActividades = {
  espiritual: [
    {
      actividad: 'Cantar',
      tarea: 'Expresar la fe mediante música',
      acciones: [
        'Elegir canción espiritual',
        'Entonar con emoción',
        'Reflexionar sobre la letra'
      ]
    },
    {
      actividad: 'Orar',
      tarea: 'Conectarse con Dios mediante oración',
      acciones: [
        'Buscar un momento de silencio',
        'Expresar gratitud, petición, reflexión',
        'Finalizar en calma'
      ]
    },
    {
      actividad: 'Estudiar la Biblia',
      tarea: 'Comprender enseñanzas profundas',
      acciones: [
        'Leer un pasaje',
        'Analizar su significado',
        'Aplicarlo a la vida'
      ]
    }
  ],
  cuerpo: [
    {
      actividad: 'Hacer ejercicio físico',
      tarea: 'Fortalecer y cuidar el cuerpo',
      acciones: [
        'Calentar con estiramiento',
        'Realizar rutina específica',
        'Estirar para finalizar'
      ]
    }
  ],
  familia: [
    {
      actividad: 'Compartir tiempo de calidad',
      tarea: 'Fortalecer vínculos familiares',
      acciones: [
        'Conversar con interés',
        'Jugar o hacer algo juntos',
        'Escuchar activamente'
      ]
    }
  ],
  trabajo: [
    {
      actividad: 'Asistencia y organización transporte',
      tarea: 'Control de entradas y salidas',
      acciones: [
        'Observar y anotar tiempos',
        'Organizar parqueo',
        'Coordinar flujos'
      ]
    },
    {
      actividad: 'Contar monedas o pagos',
      tarea: 'Registrar ingresos',
      acciones: [
        'Separar por valor',
        'Registrar en libreta/app',
        'Guardar con seguridad'
      ]
    }
  ],
  estudio: [
    {
      actividad: 'Leer o aprender un tema',
      tarea: 'Adquirir conocimiento nuevo',
      acciones: [
        'Elegir tema',
        'Tomar apuntes',
        'Aplicar lo aprendido'
      ]
    }
  ],
  recreacion: [
    {
      actividad: 'Jugar videojuegos',
      tarea: 'Estimular mente y creatividad',
      acciones: [
        'Escoger juego adecuado',
        'Establecer duración',
        'Reflexionar después'
      ]
    },
    {
      actividad: 'Ver películas',
      tarea: 'Relajarse e inspirarse',
      acciones: [
        'Seleccionar contenido',
        'Disfrutar con atención',
        'Conversar si es en grupo'
      ]
    }
  ],
  casa: [
    {
      actividad: 'Limpiar y ordenar',
      tarea: 'Mantener espacios organizados',
      acciones: [
        'Escoger zona',
        'Recolectar y clasificar objetos',
        'Limpiar superficies'
      ]
    }
  ],
  social: [
    {
      actividad: 'Saludar y mostrar cortesía',
      tarea: 'Generar conexión con los demás',
      acciones: [
        'Saludar con sonrisa',
        'Usar frases como "gracias", "por favor"',
        'Contacto visual amable'
      ]
    }
  ]
};

const nombres = {
  espiritual: '🌟 Espiritual',
  cuerpo: '💪 Cuerpo',
  familia: '👨‍👩‍👧‍👦 Familia',
  trabajo: '🧰 Trabajo',
  estudio: '📚 Estudio',
  recreacion: '🎮 Recreación',
  casa: '🏠 Casa',
  social: '🤝 Social'
};

function getActividades(program) {
  const data = localStorage.getItem('actividades_' + program);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultActividades[program] || [];
    }
  }
  return defaultActividades[program] || [];
}

function setActividades(program, acts) {
  localStorage.setItem('actividades_' + program, JSON.stringify(acts));
}

document.addEventListener('DOMContentLoaded', function() {
  cards.forEach(card => {
    card.addEventListener('click', () => {
      currentProgram = card.dataset.programa;
      showProgramDetail(currentProgram);
    });
  });
});

backBtn.addEventListener('click', () => {
  detailSection.classList.add('hidden');
  document.querySelector('.programs-grid').style.display = 'grid';
});

// Función para aplicar formato desde el toolbar
if (notesToolbar) {
  notesToolbar.addEventListener('click', function(e) {
    if (e.target.dataset.cmd) {
      document.execCommand(e.target.dataset.cmd, false, null);
    }
  });
}

// Guardar notas como HTML
const programNotesDiv = document.getElementById('program-notes');
if (programNotesDiv) {
  programNotesDiv.addEventListener('input', () => {
    if (currentProgram) {
      localStorage.setItem('notas_' + currentProgram, programNotesDiv.innerHTML);
    }
  });
}

function initQuill() {
  if (quill) return;
  quill = new Quill('#program-notes', {
    modules: {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['clean']
      ]
    },
    theme: 'snow',
    placeholder: 'Escribe tus notas aquí...'
  });
  quill.on('text-change', function() {
    if (currentProgram) {
      localStorage.setItem('notas_' + currentProgram, quill.root.innerHTML);
    }
  });
}

function showProgramDetail(program) {
  programTitle.textContent = nombres[program];
  initQuill();
  if (quill) {
    const saved = localStorage.getItem('notas_' + program) || '';
    quill.root.innerHTML = saved;
  }
  // Mostrar etiquetas de notas
  if (notesTagsInput) {
    notesTagsInput.value = getTagsFromString(localStorage.getItem('tags_notas_' + program) ? JSON.parse(localStorage.getItem('tags_notas_' + program)) : []).join(', ');
    renderTagsList(getTagsFromString(localStorage.getItem('tags_notas_' + program) ? JSON.parse(localStorage.getItem('tags_notas_' + program)) : []), notesTagsList);
  }
  renderActividades(program);
  detailSection.classList.remove('hidden');
  document.querySelector('.programs-grid').style.display = 'none';
}

function renderActividades(program) {
  programActivities.innerHTML = '';
  const acts = getActividades(program);
  acts.forEach((act, idx) => {
    const actDiv = document.createElement('div');
    actDiv.className = 'actividad-bloque';
    actDiv.innerHTML = `
      <strong>Actividad ${idx + 1}:</strong> <span class="actividad-nombre">${act.actividad}</span><br>
      <strong>Tarea:</strong> <span class="actividad-tarea">${act.tarea}</span><br>
      <strong>Acciones:</strong>
      <div class="actividad-acciones">${act.acciones ? act.acciones.join('') : ''}</div>
      <div class="actividad-etiquetas">${(act.tags || []).map(t => `<span class='tag-chip'>${t}</span>`).join('')}</div>
      <div class="actividad-botones">
        <button class="btn-editar" data-idx="${idx}">Editar</button>
        <button class="btn-eliminar" data-idx="${idx}">Eliminar</button>
        <button class="btn-recordatorio" data-idx="${idx}">Recordatorio</button>
        <button class="btn-historial" data-idx="${idx}">Historial</button>
      </div>
      <div class="recordatorio-info" id="recordatorio-info-${idx}"></div>
    `;
    programActivities.appendChild(actDiv);
    // Mostrar info de recordatorio si existe
    const key = `recordatorio_${program}_${idx}`;
    const fechaHora = localStorage.getItem(key);
    if (fechaHora) {
      const infoDiv = actDiv.querySelector(`#recordatorio-info-${idx}`);
      if (infoDiv) {
        const fecha = new Date(parseInt(fechaHora));
        infoDiv.textContent = `Recordatorio programado para: ${fecha.toLocaleString()}`;
      }
    }
  });
  // Botón para agregar nueva actividad
  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Agregar actividad';
  addBtn.className = 'btn-agregar';
  addBtn.onclick = () => mostrarFormularioActividad(program);
  programActivities.appendChild(addBtn);

  // Listeners para editar, eliminar, recordatorio e historial
  programActivities.querySelectorAll('.btn-editar').forEach(btn => {
    btn.onclick = () => mostrarFormularioActividad(program, parseInt(btn.dataset.idx));
  });
  programActivities.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.onclick = () => eliminarActividad(program, parseInt(btn.dataset.idx));
  });
  programActivities.querySelectorAll('.btn-recordatorio').forEach(btn => {
    btn.onclick = () => {
      solicitarPermisoNotificaciones();
      const idx = parseInt(btn.dataset.idx);
      const fechaInput = document.createElement('input');
      fechaInput.type = 'datetime-local';
      fechaInput.style.marginRight = '0.5rem';
      const guardarBtn = document.createElement('button');
      guardarBtn.textContent = 'Guardar';
      guardarBtn.type = 'button';
      guardarBtn.onclick = () => {
        const fechaHora = new Date(fechaInput.value).getTime();
        if (!isNaN(fechaHora) && fechaHora > Date.now()) {
          programarRecordatorio(program, idx, acts[idx].actividad, fechaHora);
          renderActividades(program);
        } else {
          alert('Selecciona una fecha y hora válida en el futuro.');
        }
      };
      const cancelarBtn = document.createElement('button');
      cancelarBtn.textContent = 'Cancelar';
      cancelarBtn.type = 'button';
      cancelarBtn.onclick = () => renderActividades(program);
      const contenedor = btn.parentElement.parentElement;
      contenedor.querySelector('.recordatorio-info').innerHTML = '';
      contenedor.querySelector('.recordatorio-info').appendChild(fechaInput);
      contenedor.querySelector('.recordatorio-info').appendChild(guardarBtn);
      contenedor.querySelector('.recordatorio-info').appendChild(cancelarBtn);
    };
  });
  programActivities.querySelectorAll('.btn-historial').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      showActividadHistory(program, idx);
    };
  });
  updateTagFilter();
  evitarPropagacionBotones();
}

function mostrarFormularioActividad(program, idx = null) {
  const acts = getActividades(program);
  let act = { actividad: '', tarea: '', acciones: [''], tags: [] };
  if (idx !== null) act = { ...acts[idx], acciones: [...acts[idx].acciones], tags: acts[idx].tags || [] };

  // Crear formulario con Quill para tarea y acciones
  const formDiv = document.createElement('div');
  formDiv.className = 'actividad-bloque';
  formDiv.innerHTML = `
    <form class="form-actividad">
      <label>Actividad:<br><input type="text" name="actividad" value="${act.actividad}" required></label><br>
      <label>Tarea:</label>
      <div id="quill-tarea" style="height: 60px;"></div><br>
      <label>Acciones:</label>
      <div id="quill-acciones" style="height: 90px;"></div><br>
      <label>Etiquetas:<br><input type="text" name="tags" value="${act.tags ? act.tags.join(', ') : ''}" placeholder="Etiquetas (separadas por coma)" style="width:100%; border-radius:0.4rem; border:1px solid #ccc; padding:0.4rem;" /></label><br>
      <button type="submit">${idx !== null ? 'Guardar cambios' : 'Agregar actividad'}</button>
      <button type="button" class="btn-cancelar">Cancelar</button>
    </form>
  `;
  programActivities.innerHTML = '';
  programActivities.appendChild(formDiv);

  // Inicializar Quill para tarea y acciones
  const quillTarea = new Quill('#quill-tarea', {
    theme: 'snow',
    modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'indent': '-1'}, { 'indent': '+1' }], ['clean']] },
    placeholder: 'Describe la tarea...'
  });
  const quillAcciones = new Quill('#quill-acciones', {
    theme: 'snow',
    modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'indent': '-1'}, { 'indent': '+1' }], ['clean']] },
    placeholder: 'Lista de acciones...'
  });
  // Cargar valores si existen
  if (act.tarea) quillTarea.root.innerHTML = act.tarea;
  if (act.acciones && act.acciones.length) quillAcciones.root.innerHTML = act.acciones.join('<br>');

  // Cancelar
  formDiv.querySelector('.btn-cancelar').onclick = () => renderActividades(program);

  // Guardar
  formDiv.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const nuevaActividad = {
      actividad: formDiv.querySelector('input[name="actividad"]').value,
      tarea: quillTarea.root.innerHTML,
      acciones: [quillAcciones.root.innerHTML],
      tags: getTagsFromString(formDiv.querySelector('input[name="tags"]').value)
    };
    if (idx !== null) {
      acts[idx] = nuevaActividad;
      setActividades(program, acts);
      saveActividadHistory(program, idx, nuevaActividad);
      renderActividades(program);
      updateTagFilter();
    } else {
      acts.push(nuevaActividad);
      setActividades(program, acts);
      saveActividadHistory(program, acts.length - 1, nuevaActividad);
      renderActividades(program);
      updateTagFilter();
    }
  };
}

function eliminarActividad(program, idx) {
  if (confirm('¿Seguro que quieres eliminar esta actividad?')) {
    const acts = getActividades(program);
    acts.splice(idx, 1);
    setActividades(program, acts);
    renderActividades(program);
  }
}

// Registro del service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

// --- Funcionalidad de respaldo y restauración ---
const backupBtn = document.getElementById('backup-btn');
const restoreBtn = document.getElementById('restore-btn');
const restoreFile = document.getElementById('restore-file');

if (backupBtn) {
  backupBtn.onclick = function() {
    const datos = {};
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave.startsWith('notas_') || clave.startsWith('actividades_')) {
        datos[clave] = localStorage.getItem(clave);
      }
    }
    const blob = new Blob([JSON.stringify(datos, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'respaldo_programas_mentales.json';
    a.click();
    URL.revokeObjectURL(url);
  };
}

if (restoreBtn && restoreFile) {
  restoreBtn.onclick = function() {
    restoreFile.value = '';
    restoreFile.click();
  };
  restoreFile.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const datos = JSON.parse(evt.target.result);
        for (const clave in datos) {
          localStorage.setItem(clave, datos[clave]);
        }
        alert('¡Datos restaurados! Recarga la página para ver los cambios.');
      } catch (err) {
        alert('Error al restaurar los datos: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
}

// --- Recordatorios por actividad ---
function solicitarPermisoNotificaciones() {
  if (Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function programarRecordatorio(program, idx, actividad, fechaHora) {
  const key = `recordatorio_${program}_${idx}`;
  localStorage.setItem(key, fechaHora);
  revisarRecordatorios();
}

function cancelarRecordatorio(program, idx) {
  const key = `recordatorio_${program}_${idx}`;
  localStorage.removeItem(key);
}

function revisarRecordatorios() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const ahora = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);
    if (clave.startsWith('recordatorio_')) {
      const fechaHora = parseInt(localStorage.getItem(clave));
      if (!isNaN(fechaHora) && fechaHora <= ahora) {
        // Obtener info de la actividad
        const partes = clave.split('_');
        const program = partes[1];
        const idx = parseInt(partes[2]);
        const acts = getActividades(program);
        if (acts[idx]) {
          new Notification('¡Recordatorio!', {
            body: `Actividad: ${acts[idx].actividad}`
          });
        }
        localStorage.removeItem(clave);
      }
    }
  }
}
setInterval(revisarRecordatorios, 30000); // Revisar cada 30 segundos

// --- Estadísticas y seguimiento ---
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStats = document.getElementById('close-stats');

if (statsBtn && statsModal && closeStats) {
  statsBtn.onclick = function() {
    mostrarEstadisticas();
    statsModal.style.display = 'flex';
  };
  closeStats.onclick = function() {
    statsModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === statsModal) {
      statsModal.style.display = 'none';
    }
  };
}

function mostrarEstadisticas() {
  // Datos de actividades por programa
  const programas = Object.keys(nombres);
  const actividadesPorPrograma = programas.map(p => getActividades(p).length);
  // Datos de recordatorios por programa
  const recordatoriosPorPrograma = programas.map(p => {
    let count = 0;
    const acts = getActividades(p);
    acts.forEach((_, idx) => {
      if (localStorage.getItem(`recordatorio_${p}_${idx}`)) count++;
    });
    return count;
  });
  // Datos de notas por programa
  const notasPorPrograma = programas.map(p => {
    const notas = localStorage.getItem('notas_' + p);
    return notas ? notas.length : 0;
  });

  // Gráfico de actividades
  const ctx1 = document.getElementById('chart-actividades').getContext('2d');
  if (window.chartActividades) window.chartActividades.destroy();
  window.chartActividades = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: programas.map(p => nombres[p]),
      datasets: [{
        label: 'Actividades por programa',
        data: actividadesPorPrograma,
        backgroundColor: '#6c63ff'
      }]
    },
    options: { responsive: true }
  });

  // Gráfico de recordatorios
  const ctx2 = document.getElementById('chart-recordatorios').getContext('2d');
  if (window.chartRecordatorios) window.chartRecordatorios.destroy();
  window.chartRecordatorios = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: programas.map(p => nombres[p]),
      datasets: [{
        label: 'Recordatorios activos',
        data: recordatoriosPorPrograma,
        backgroundColor: '#ff9800'
      }]
    },
    options: { responsive: true }
  });

  // Gráfico de notas
  const ctx3 = document.getElementById('chart-notas').getContext('2d');
  if (window.chartNotas) window.chartNotas.destroy();
  window.chartNotas = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: programas.map(p => nombres[p]),
      datasets: [{
        label: 'Cantidad de texto en notas',
        data: notasPorPrograma,
        backgroundColor: '#2196f3'
      }]
    },
    options: { responsive: true }
  });
}

// --- Modo oscuro ---
const darkModeBtn = document.getElementById('darkmode-btn');
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    if (darkModeBtn) darkModeBtn.textContent = 'Modo claro';
    localStorage.setItem('modo_oscuro', '1');
  } else {
    document.body.classList.remove('dark-mode');
    if (darkModeBtn) darkModeBtn.textContent = 'Modo oscuro';
    localStorage.setItem('modo_oscuro', '0');
  }
}
if (darkModeBtn) {
  darkModeBtn.onclick = function() {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  };
}
// Al cargar, aplicar preferencia guardada
if (localStorage.getItem('modo_oscuro') === '1') {
  setDarkMode(true);
}

// --- Exportar a PDF ---
const exportAllPdfBtn = document.getElementById('export-all-pdf');
const exportProgramPdfBtn = document.getElementById('export-program-pdf');

function exportarProgramaAPDF(program) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Programa: ${nombres[program]}`, 10, 15);
  let y = 25;
  // Notas
  const notas = localStorage.getItem('notas_' + program);
  if (notas) {
    doc.setFontSize(12);
    doc.text('Notas:', 10, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(stripHtml(notas), 180), 10, y);
    y += 15;
  }
  // Actividades
  const acts = getActividades(program);
  acts.forEach((act, idx) => {
    doc.setFontSize(12);
    doc.text(`Actividad ${idx + 1}: ${act.actividad}`, 10, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize('Tarea: ' + stripHtml(act.tarea), 180), 12, y);
    y += 7;
    doc.text(doc.splitTextToSize('Acciones: ' + (act.acciones ? stripHtml(act.acciones.join(' ')) : ''), 180), 12, y);
    y += 12;
    if (y > 270) { doc.addPage(); y = 15; }
  });
  doc.save(`programa_${program}.pdf`);
}

function exportarTodoAPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 15;
  Object.keys(nombres).forEach(program => {
    doc.setFontSize(16);
    doc.text(`Programa: ${nombres[program]}`, 10, y);
    y += 8;
    // Notas
    const notas = localStorage.getItem('notas_' + program);
    if (notas) {
      doc.setFontSize(12);
      doc.text('Notas:', 10, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(stripHtml(notas), 180), 10, y);
      y += 15;
    }
    // Actividades
    const acts = getActividades(program);
    acts.forEach((act, idx) => {
      doc.setFontSize(12);
      doc.text(`Actividad ${idx + 1}: ${act.actividad}`, 10, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize('Tarea: ' + stripHtml(act.tarea), 180), 12, y);
      y += 7;
      doc.text(doc.splitTextToSize('Acciones: ' + (act.acciones ? stripHtml(act.acciones.join(' ')) : ''), 180), 12, y);
      y += 12;
      if (y > 270) { doc.addPage(); y = 15; }
    });
    y += 10;
    if (y > 270) { doc.addPage(); y = 15; }
  });
  doc.save('programas_mentales.pdf');
}

function stripHtml(html) {
  var tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

if (exportAllPdfBtn) {
  exportAllPdfBtn.onclick = exportarTodoAPDF;
}
if (exportProgramPdfBtn) {
  exportProgramPdfBtn.onclick = function() {
    if (currentProgram) exportarProgramaAPDF(currentProgram);
  };
}

// --- Buscador global ---
const globalSearch = document.getElementById('global-search');
const searchResultsModal = document.getElementById('search-results-modal');
const closeSearchResults = document.getElementById('close-search-results');
const searchResultsList = document.getElementById('search-results-list');

if (globalSearch) {
  globalSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      realizarBusquedaGlobal(globalSearch.value.trim());
    }
  });
}
if (closeSearchResults && searchResultsModal) {
  closeSearchResults.onclick = function() {
    searchResultsModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === searchResultsModal) {
      searchResultsModal.style.display = 'none';
    }
  };
}

function realizarBusquedaGlobal(query) {
  if (!query) return;
  const resultados = [];
  const programas = Object.keys(nombres);
  programas.forEach(program => {
    // Buscar en notas
    const notas = localStorage.getItem('notas_' + program);
    if (notas && stripHtml(notas).toLowerCase().includes(query.toLowerCase())) {
      resultados.push({
        tipo: 'Nota',
        programa,
        texto: resaltarCoincidencia(stripHtml(notas), query)
      });
    }
    // Buscar en actividades
    const acts = getActividades(program);
    acts.forEach((act, idx) => {
      if (act.actividad && act.actividad.toLowerCase().includes(query.toLowerCase())) {
        resultados.push({
          tipo: 'Actividad',
          programa,
          idx,
          texto: resaltarCoincidencia(act.actividad, query)
        });
      }
      if (act.tarea && stripHtml(act.tarea).toLowerCase().includes(query.toLowerCase())) {
        resultados.push({
          tipo: 'Tarea',
          programa,
          idx,
          texto: resaltarCoincidencia(stripHtml(act.tarea), query)
        });
      }
      if (act.acciones && act.acciones.join(' ').toLowerCase().includes(query.toLowerCase())) {
        resultados.push({
          tipo: 'Acciones',
          programa,
          idx,
          texto: resaltarCoincidencia(stripHtml(act.acciones.join(' ')), query)
        });
      }
    });
  });
  mostrarResultadosBusqueda(resultados, query);
}

function resaltarCoincidencia(texto, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return texto.replace(re, '<span class="highlight-search">$1</span>');
}

function mostrarResultadosBusqueda(resultados, query) {
  if (!searchResultsModal || !searchResultsList) return;
  searchResultsList.innerHTML = '';
  if (resultados.length === 0) {
    searchResultsList.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    resultados.forEach(res => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<strong>${res.tipo}</strong> en <b>${nombres[res.programa]}</b>:<br>${res.texto}`;
      div.style.cursor = 'pointer';
      div.onclick = function() {
        searchResultsModal.style.display = 'none';
        showProgramDetail(res.programa);
        setTimeout(() => {
          resaltarEnDetalle(res.texto.replace(/<[^>]+>/g, ''), query);
        }, 300);
      };
      searchResultsList.appendChild(div);
    });
  }
  searchResultsModal.style.display = 'flex';
}

function resaltarEnDetalle(texto, query) {
  // Resalta coincidencias en el detalle del programa
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  // Notas
  const notesDiv = document.getElementById('program-notes');
  if (notesDiv) {
    notesDiv.innerHTML = notesDiv.innerHTML.replace(/<span class="highlight-search">(.*?)<\/span>/g, '$1');
    notesDiv.innerHTML = notesDiv.innerHTML.replace(re, '<span class="highlight-search">$1</span>');
  }
  // Tareas y acciones
  document.querySelectorAll('.actividad-tarea, .actividad-acciones').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/<span class="highlight-search">(.*?)<\/span>/g, '$1');
    el.innerHTML = el.innerHTML.replace(re, '<span class="highlight-search">$1</span>');
  });
}

// --- Etiquetas en notas y actividades ---
const notesTagsInput = document.getElementById('notes-tags');
const notesTagsList = document.getElementById('notes-tags-list');
const tagFilter = document.getElementById('tag-filter');

function getTagsFromString(str) {
  if (Array.isArray(str)) return str;
  if (typeof str === 'string') {
    return str.split(',').map(t => t.trim()).filter(t => t);
  }
  return [];
}
function renderTagsList(tags, container) {
  container.innerHTML = '';
  tags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = tag;
    container.appendChild(chip);
  });
}
function getAllTags() {
  const tagsSet = new Set();
  // Notas
  Object.keys(nombres).forEach(p => {
    const tags = JSON.parse(localStorage.getItem('tags_notas_' + p) || '[]');
    tags.forEach(t => tagsSet.add(t));
    // Actividades
    getActividades(p).forEach((act, idx) => {
      (act.tags || []).forEach(t => tagsSet.add(t));
    });
  });
  return Array.from(tagsSet);
}
function updateTagFilter() {
  if (!tagFilter) return;
  const tags = getAllTags();
  tagFilter.innerHTML = '<option value="">Filtrar por etiqueta</option>' + tags.map(t => `<option value="${t}">${t}</option>`).join('');
}
if (tagFilter) {
  tagFilter.onchange = function() {
    if (!tagFilter.value) {
      document.querySelector('.programs-grid').style.display = 'grid';
      return;
    }
    // Ocultar todas las tarjetas
    document.querySelectorAll('.program-card').forEach(card => card.style.display = 'none');
    // Mostrar solo las que tengan la etiqueta
    Object.keys(nombres).forEach(p => {
      // Notas
      const tags = JSON.parse(localStorage.getItem('tags_notas_' + p) || '[]');
      if (tags.includes(tagFilter.value)) {
        document.querySelector(`.program-card[data-programa="${p}"]`).style.display = 'flex';
      }
      // Actividades
      getActividades(p).forEach((act, idx) => {
        if ((act.tags || []).includes(tagFilter.value)) {
          document.querySelector(`.program-card[data-programa="${p}"]`).style.display = 'flex';
        }
      });
    });
  };
}
// Guardar y mostrar etiquetas en notas
function saveNotesTags(program) {
  if (!notesTagsInput) return;
  const tags = getTagsFromString(notesTagsInput.value);
  localStorage.setItem('tags_notas_' + program, JSON.stringify(tags));
  renderTagsList(tags, notesTagsList);
  updateTagFilter();
}
if (notesTagsInput) {
  notesTagsInput.addEventListener('input', () => {
    if (currentProgram) saveNotesTags(currentProgram);
  });
}

// --- Historial de notas y actividades ---
const notesHistoryBtn = document.getElementById('notes-history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');

function saveNotesHistory(program, contenido) {
  const key = 'history_notas_' + program;
  let hist = JSON.parse(localStorage.getItem(key) || '[]');
  hist.unshift({ fecha: new Date().toLocaleString(), contenido });
  if (hist.length > 10) hist = hist.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(hist));
}
function showNotesHistory(program) {
  if (!historyModal || !historyList) return;
  const key = 'history_notas_' + program;
  const hist = JSON.parse(localStorage.getItem(key) || '[]');
  historyList.innerHTML = '';
  if (hist.length === 0) {
    historyList.innerHTML = '<p>No hay historial.</p>';
  } else {
    hist.forEach((h, i) => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<b>${h.fecha}</b><br><div style='border:1px solid #ccc; border-radius:0.4em; padding:0.5em; margin:0.5em 0; max-height:80px; overflow:auto;'>${h.contenido}</div><button data-idx='${i}'>Restaurar</button>`;
      div.querySelector('button').onclick = function() {
        if (confirm('¿Restaurar esta versión?')) {
          if (quill) quill.root.innerHTML = h.contenido;
          localStorage.setItem('notas_' + program, h.contenido);
          saveNotesHistory(program, h.contenido);
          showNotesHistory(program);
        }
      };
      historyList.appendChild(div);
    });
  }
  historyModal.style.display = 'flex';
}
if (notesHistoryBtn) {
  notesHistoryBtn.onclick = function() {
    if (currentProgram) showNotesHistory(currentProgram);
  };
}
if (closeHistory && historyModal) {
  closeHistory.onclick = function() { historyModal.style.display = 'none'; };
  window.onclick = function(event) {
    if (event.target === historyModal) historyModal.style.display = 'none';
  };
}
// Guardar historial de notas al editar
if (programNotesDiv) {
  programNotesDiv.addEventListener('input', () => {
    if (currentProgram) {
      saveNotesHistory(currentProgram, programNotesDiv.innerHTML);
    }
  });
}
// Historial de actividades
function saveActividadHistory(program, idx, actividad) {
  const key = `history_actividad_${program}_${idx}`;
  let hist = JSON.parse(localStorage.getItem(key) || '[]');
  hist.unshift({ fecha: new Date().toLocaleString(), actividad });
  if (hist.length > 10) hist = hist.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(hist));
}
function showActividadHistory(program, idx) {
  if (!historyModal || !historyList) return;
  const key = `history_actividad_${program}_${idx}`;
  const hist = JSON.parse(localStorage.getItem(key) || '[]');
  historyList.innerHTML = '';
  if (hist.length === 0) {
    historyList.innerHTML = '<p>No hay historial.</p>';
  } else {
    hist.forEach((h, i) => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<b>${h.fecha}</b><br><div style='border:1px solid #ccc; border-radius:0.4em; padding:0.5em; margin:0.5em 0; max-height:80px; overflow:auto;'>${JSON.stringify(h.actividad, null, 2)}</div><button data-idx='${i}'>Restaurar</button>`;
      div.querySelector('button').onclick = function() {
        if (confirm('¿Restaurar esta versión?')) {
          const acts = getActividades(program);
          acts[idx] = h.actividad;
          setActividades(program, acts);
          saveActividadHistory(program, idx, h.actividad);
          renderActividades(program);
          historyModal.style.display = 'none';
        }
      };
      historyList.appendChild(div);
    });
  }
  historyModal.style.display = 'flex';
}

// --- Compartir programa ---
const shareBtn = document.getElementById('share-program-btn');
const shareModal = document.getElementById('share-modal');
const closeShare = document.getElementById('close-share');
const shareCopy = document.getElementById('share-copy');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareEmail = document.getElementById('share-email');

function getProgramaTexto(program) {
  let texto = `Programa: ${nombres[program]}\n`;
  const notas = localStorage.getItem('notas_' + program);
  if (notas) texto += `Notas:\n${stripHtml(notas)}\n`;
  const tags = JSON.parse(localStorage.getItem('tags_notas_' + program) || '[]');
  if (tags.length) texto += `Etiquetas: ${tags.join(', ')}\n`;
  const acts = getActividades(program);
  acts.forEach((act, idx) => {
    texto += `\nActividad ${idx + 1}: ${act.actividad}\n`;
    texto += `Tarea: ${stripHtml(act.tarea)}\n`;
    texto += `Acciones: ${act.acciones ? stripHtml(act.acciones.join(' ')) : ''}\n`;
    if (act.tags && act.tags.length) texto += `Etiquetas: ${act.tags.join(', ')}\n`;
  });
  return texto;
}
if (shareBtn && shareModal && closeShare) {
  shareBtn.onclick = function() {
    shareModal.style.display = 'flex';
  };
  closeShare.onclick = function() {
    shareModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === shareModal) shareModal.style.display = 'none';
  };
}
if (shareCopy) {
  shareCopy.onclick = function() {
    if (currentProgram) {
      const texto = getProgramaTexto(currentProgram);
      navigator.clipboard.writeText(texto);
      alert('¡Copiado al portapapeles!');
    }
  };
}
if (shareWhatsapp) {
  shareWhatsapp.onclick = function() {
    if (currentProgram) {
      const texto = encodeURIComponent(getProgramaTexto(currentProgram));
      window.open(`https://wa.me/?text=${texto}`, '_blank');
    }
  };
}
if (shareEmail) {
  shareEmail.onclick = function() {
    if (currentProgram) {
      const texto = encodeURIComponent(getProgramaTexto(currentProgram));
      window.open(`mailto:?subject=Programa%20Mental&body=${texto}`);
    }
  };
}

// --- Gamificación: puntos y logros ---
const pointsDisplay = document.getElementById('points-display');
const achievementsBtn = document.getElementById('achievements-btn');
const achievementsModal = document.getElementById('achievements-modal');
const closeAchievements = document.getElementById('close-achievements');
const achievementsList = document.getElementById('achievements-list');

const LOGROS = [
  { id: 'primer_actividad', nombre: '¡Primera actividad!', desc: 'Agrega tu primera actividad.', puntos: 10 },
  { id: 'cinco_actividades', nombre: '¡Cinco actividades!', desc: 'Agrega 5 actividades.', puntos: 20 },
  { id: 'primer_nota', nombre: '¡Primera nota!', desc: 'Escribe tu primera nota.', puntos: 10 },
  { id: 'etiquetas', nombre: 'Maestro de etiquetas', desc: 'Usa etiquetas en notas o actividades.', puntos: 10 },
  { id: 'recordatorio', nombre: 'Organizador', desc: 'Programa tu primer recordatorio.', puntos: 10 },
  { id: 'pdf', nombre: 'Exportador', desc: 'Exporta un programa o todo a PDF.', puntos: 10 },
  { id: 'compartir', nombre: 'Comunicador', desc: 'Comparte un programa.', puntos: 10 },
  { id: 'modo_oscuro', nombre: 'Nocturno', desc: 'Activa el modo oscuro.', puntos: 5 }
];
function getPoints() {
  return parseInt(localStorage.getItem('puntos') || '0');
}
function setPoints(p) {
  localStorage.setItem('puntos', p);
  if (pointsDisplay) pointsDisplay.textContent = `🏆 ${p}`;
}
function addPoints(p) {
  setPoints(getPoints() + p);
}
function getAchievements() {
  return JSON.parse(localStorage.getItem('logros') || '[]');
}
function unlockAchievement(id) {
  let logros = getAchievements();
  if (!logros.includes(id)) {
    logros.push(id);
    localStorage.setItem('logros', JSON.stringify(logros));
    const logro = LOGROS.find(l => l.id === id);
    if (logro) addPoints(logro.puntos);
    if (achievementsBtn) achievementsBtn.classList.add('highlight-search');
    setTimeout(() => achievementsBtn && achievementsBtn.classList.remove('highlight-search'), 1500);
  }
}
function updateAchievementsModal() {
  if (!achievementsList) return;
  const logros = getAchievements();
  achievementsList.innerHTML = LOGROS.map(l =>
    `<div style="margin-bottom:0.7em;"><b>${l.nombre}</b> (${l.puntos} pts)<br><span style="font-size:0.95em;">${l.desc}</span><br>${logros.includes(l.id) ? '<span style=\'color:green\'>✔ Desbloqueado</span>' : '<span style=\'color:#aaa\'>❌ Sin desbloquear</span>'}</div>`
  ).join('');
}
if (pointsDisplay) pointsDisplay.textContent = `🏆 ${getPoints()}`;
if (achievementsBtn && achievementsModal && closeAchievements) {
  achievementsBtn.onclick = function() {
    updateAchievementsModal();
    achievementsModal.style.display = 'flex';
  };
  closeAchievements.onclick = function() { achievementsModal.style.display = 'none'; };
  window.onclick = function(event) {
    if (event.target === achievementsModal) achievementsModal.style.display = 'none';
  };
}
// Lógica para sumar puntos y logros en acciones clave
// 1. Agregar actividad
const originalSetActividades = setActividades;
setActividades = function(program, acts) {
  const prev = getActividades(program).length;
  originalSetActividades(program, acts);
  if (acts.length > prev) {
    if (acts.length === 1) unlockAchievement('primer_actividad');
    if (acts.length === 5) unlockAchievement('cinco_actividades');
  }
};
// 2. Escribir nota
if (programNotesDiv) {
  programNotesDiv.addEventListener('input', () => {
    if (currentProgram) {
      if ((quill && quill.getText().trim().length > 0) || programNotesDiv.innerText.trim().length > 0) {
        unlockAchievement('primer_nota');
      }
    }
  });
}
// 3. Usar etiquetas
if (notesTagsInput) {
  notesTagsInput.addEventListener('input', () => {
    if (notesTagsInput.value.trim().length > 0) unlockAchievement('etiquetas');
  });
}
// 4. Programar recordatorio
const originalProgramarRecordatorio = programarRecordatorio;
programarRecordatorio = function(program, idx, actividad, fechaHora) {
  unlockAchievement('recordatorio');
  originalProgramarRecordatorio(program, idx, actividad, fechaHora);
};
// 5. Exportar PDF
if (exportAllPdfBtn) {
  exportAllPdfBtn.addEventListener('click', () => unlockAchievement('pdf'));
}
if (exportProgramPdfBtn) {
  exportProgramPdfBtn.addEventListener('click', () => unlockAchievement('pdf'));
}
// 6. Compartir
if (shareBtn) {
  shareBtn.addEventListener('click', () => unlockAchievement('compartir'));
}
// 7. Modo oscuro
if (darkModeBtn) {
  darkModeBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) unlockAchievement('modo_oscuro');
  });
}

// Evitar que los botones internos de la tarjeta interfieran con el click de la tarjeta
function evitarPropagacionBotones() {
  document.querySelectorAll('.btn-editar, .btn-eliminar, .btn-recordatorio, .btn-historial').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
} 