const cards = document.querySelectorAll('.program-card');
const detailSection = document.getElementById('program-detail');
const mainContent = document.getElementById('main-content');
const backBtn = document.getElementById('back-btn');
const programTitle = document.getElementById('program-title');
const programNotes = document.getElementById('program-notes');

// Nuevo: contenedor para actividades
let programActivities = document.getElementById('program-activities');
if (!programActivities) {
  programActivities = document.createElement('div');
  programActivities.id = 'program-activities';
  programActivities.style.marginBottom = '1.5rem';
  detailSection.insertBefore(programActivities, programNotes);
}

// Global variables
let currentProgram = null;
let summernoteInitialized = false;

const defaultActividades = {
  espiritual: [
    { actividad: 'Cantar', tareas: ['Expresar la fe mediante música'], acciones: ['Elegir canción espiritual', 'Entonar con emoción', 'Reflexionar sobre la letra'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null },
    { actividad: 'Orar', tareas: ['Conectarse con Dios mediante oración'], acciones: ['Buscar un momento de silencio', 'Expresar gratitud, petición, reflexión', 'Finalizar en calma'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null },
    { actividad: 'Estudiar la Biblia', tareas: ['Comprender enseñanzas profundas'], acciones: ['Leer un pasaje', 'Analizar su significado', 'Aplicarlo a la vida'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ],
  cuerpo: [
    { actividad: 'Hacer ejercicio físico', tareas: ['Fortalecer y cuidar el cuerpo'], acciones: ['Calentar con estiramiento', 'Realizar rutina específica', 'Estirar para finalizar'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ],
  familia: [
    { actividad: 'Compartir tiempo de calidad', tareas: ['Fortalecer vínculos familiares'], acciones: ['Conversar con interés', 'Jugar o hacer algo juntos', 'Escuchar activamente'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ],
  trabajo: [
    { actividad: 'Asistencia y organización transporte', tareas: ['Control de entradas y salidas'], acciones: ['Observar y anotar tiempos', 'Organizar parqueo', 'Coordinar flujos'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null },
    { actividad: 'Contar monedas o pagos', tareas: ['Registrar ingresos'], acciones: ['Separar por valor', 'Registrar en libreta/app', 'Guardar con seguridad'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ],
  estudio: [
    { actividad: 'Leer o aprender un tema', tareas: ['Adquirir conocimiento nuevo'], acciones: ['Elegir tema', 'Tomar apuntes', 'Aplicar lo aprendido'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ],
  recreacion: [
    { actividad: 'Jugar videojuegos', tareas: ['Estimular mente y creatividad'], acciones: ['Escoger juego adecuado', 'Establecer duración', 'Reflexionar después'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null },
    { actividad: 'Ver películas', tareas: ['Relajarse e inspirarse'], acciones: ['Seleccionar contenido', 'Disfrutar con atención', 'Conversar si es en grupo'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ],
  casa: [
    { actividad: 'Limpiar y ordenar', tareas: ['Mantener espacios organizados'], acciones: ['Escoger zona', 'Recolectar y clasificar objetos', 'Limpiar superficies'], activo: true, tareasActivas: [true], accionesActivas: [true, true, true], tareasCompletadas: [false], accionesCompletadas: [false, false, false], fechaCompletado: null }
  ]
};

const nombres = {
  espiritual: '🌟 Espiritual',
  cuerpo: '💪 Cuerpo',
  familia: '👨‍👩‍👧‍👦 Familia',
  trabajo: '🧰 Trabajo',
  estudio: '📚 Estudio',
  recreacion: '🎮 Recreación',
  casa: '🏠 Casa'
};

function getActividades(program) {
  const data = localStorage.getItem('actividades_' + program);
  try {
    return data ? JSON.parse(data) : (defaultActividades[program] || []);
  } catch {
    return defaultActividades[program] || [];
  }
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

function initSummernote() {
  if (summernoteInitialized) {
    $('#program-notes').summernote('destroy');
  }
  $('#program-notes').summernote({
    height: 180,
    lang: 'es-ES',
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['view', ['codeview', 'undo', 'redo']]
    ],
    callbacks: {
        onInit: function() {
            summernoteInitialized = true;
        },
        onChange: function(contents, $editable) {
            if (currentProgram) {
                localStorage.setItem('notas_' + currentProgram, contents);
            }
        }
    }
  });
}

function showProgramDetail(program) {
  programTitle.textContent = nombres[program];
  initSummernote();

  let saved = localStorage.getItem('notas_' + program) || '';
  if (program === 'cuerpo' && !saved.includes('<table')) {
    saved = `<table style="width:100%; text-align:center; border-collapse:collapse;">
      <tr><th>Día</th><th>Desayuno</th><th>Almuerzo</th><th>Cena</th></tr>
      <tr><td style="background:#e53935; color:white; font-weight:bold;">Domingo<br><small>Rojo</small></td><td></td><td></td><td></td></tr>
      <tr><td style="background:#ff9800; color:white; font-weight:bold;">Lunes<br><small>Naranja</small></td><td></td><td></td><td></td></tr>
      <tr><td style="background:#ffd600; color:#23234a; font-weight:bold;">Martes<br><small>Amarillo</small></td><td></td><td></td><td></td></tr>
      <tr><td style="background:#4caf50; color:white; font-weight:bold;">Miércoles<br><small>Verde</small></td><td></td><td></td><td></td></tr>
      <tr><td style="background:#2196f3; color:white; font-weight:bold;">Jueves<br><small>Azul</small></td><td></td><td></td><td></td></tr>
      <tr><td style="background:#3f51b5; color:white; font-weight:bold;">Viernes<br><small>Índigo</small></td><td></td><td></td><td></td></tr>
      <tr><td style="background:#a084e8; color:white; font-weight:bold;">Sábado<br><small>Violeta</small></td><td></td><td></td><td></td></tr>
    </table>`;
  }
  $('#program-notes').summernote('code', saved);
  
  renderActividades(program);
  detailSection.classList.remove('hidden');
  document.querySelector('.programs-grid').style.display = 'none';

  const suggestBtn = document.getElementById('suggest-dishes-btn');
  if (suggestBtn) {
    suggestBtn.style.display = (program === 'cuerpo') ? 'block' : 'none';
  }
}

function renderActividades(program) {
    programActivities.innerHTML = '';
    const acts = getActividades(program);
    acts.forEach((act, idx) => {
        const actDiv = document.createElement('div');
        actDiv.className = 'actividad-bloque';
        
        const tareasHtml = (act.tareas || []).map(tarea => `<div>- ${tarea}</div>`).join('');
        const accionesHtml = (act.acciones || []).map(accion => `<li>${accion}</li>`).join('');

        actDiv.innerHTML = `
            <strong>${act.actividad}</strong>
            <div style="margin-top:0.5rem;"><strong>Tareas:</strong>${tareasHtml}</div>
            <div style="margin-top:0.5rem;"><strong>Acciones:</strong><ul style="margin:0;padding-left:1.5rem;">${accionesHtml}</ul></div>
            <div class="actividad-botones" style="margin-top:1rem;">
                <button class="btn-editar" data-idx="${idx}">Editar</button>
                <button class="btn-eliminar" data-idx="${idx}">Eliminar</button>
            </div>
        `;
        programActivities.appendChild(actDiv);
    });

    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Agregar actividad';
    addBtn.className = 'btn-agregar';
    addBtn.onclick = () => mostrarFormularioActividad(program);
    programActivities.appendChild(addBtn);

    programActivities.querySelectorAll('.btn-editar').forEach(btn => {
        btn.onclick = () => mostrarFormularioActividad(program, parseInt(btn.dataset.idx));
    });
    programActivities.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.onclick = () => eliminarActividad(program, parseInt(btn.dataset.idx));
    });
}

function mostrarFormularioActividad(program, idx = null) {
  const acts = getActividades(program);
  let act = { actividad: '', tareas: [''], acciones: [''] };
  if (idx !== null && acts[idx]) {
    act = acts[idx];
  }

  const formDiv = document.createElement('div');
  formDiv.className = 'actividad-bloque';
  formDiv.innerHTML = `
    <form class="form-actividad">
      <div class="form-section"><label>Actividad:<br><input type="text" name="actividad" value="${act.actividad || ''}" required></label></div>
      <div class="form-section" id="tareas-section">
        <label>Tareas:</label>
        ${(act.tareas && act.tareas.length > 0 ? act.tareas : ['']).map(t => `<div class="tarea-item"><textarea name="tarea" rows="2" style="width:90%;">${t}</textarea><button type="button" class="btn-eliminar-item">🗑️</button></div>`).join('')}
        <button type="button" class="btn-agregar-item" data-tipo="tarea">+ Agregar tarea</button>
      </div>
      <div class="form-section" id="acciones-section">
        <label>Acciones:</label>
        ${(act.acciones && act.acciones.length > 0 ? act.acciones : ['']).map(a => `<div class="accion-item"><textarea name="accion" rows="2" style="width:90%;">${a}</textarea><button type="button" class="btn-eliminar-item">🗑️</button></div>`).join('')}
        <button type="button" class="btn-agregar-item" data-tipo="accion">+ Agregar acción</button>
      </div>
      <div class="form-buttons"><button type="submit">Guardar</button><button type="button" class="btn-cancelar">Cancelar</button></div>
    </form>`;
  programActivities.innerHTML = '';
  programActivities.appendChild(formDiv);

  formDiv.querySelectorAll('.btn-agregar-item').forEach(btn => {
    btn.onclick = (e) => {
      const tipo = e.target.dataset.tipo;
      const newItem = document.createElement('div');
      newItem.className = `${tipo}-item`;
      newItem.innerHTML = `<textarea name="${tipo}" rows="2" style="width:90%;"></textarea><button type="button" class="btn-eliminar-item">🗑️</button>`;
      const section = formDiv.querySelector(`#${tipo}s-section`);
      section.insertBefore(newItem, btn);
      newItem.querySelector('.btn-eliminar-item').onclick = () => newItem.remove();
    };
  });
  
  formDiv.querySelectorAll('.btn-eliminar-item').forEach(btn => {
    btn.onclick = () => btn.parentElement.remove();
  });

  formDiv.querySelector('.btn-cancelar').onclick = () => renderActividades(program);

  formDiv.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const tareasArray = Array.from(formDiv.querySelectorAll('textarea[name="tarea"]')).map(t => t.value).filter(t => t.trim() !== '');
    const accionesArray = Array.from(formDiv.querySelectorAll('textarea[name="accion"]')).map(a => a.value).filter(a => a.trim() !== '');
    const nuevaActividad = {
      actividad: formDiv.querySelector('input[name="actividad"]').value,
      tareas: tareasArray,
      acciones: accionesArray
    };
    if (idx !== null) { acts[idx] = nuevaActividad; } else { acts.push(nuevaActividad); }
    setActividades(program, acts);
    renderActividades(program);
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

const platosPorSemana = [
  [
    { dia: 'Domingo', color: 'Rojo', desayuno: 'Fresas con yogur', almuerzo: 'Lasaña de carne', cena: 'Sopa de remolacha' },
    { dia: 'Lunes', color: 'Naranja', desayuno: 'Jugo de naranja', almuerzo: 'Pollo al curry', cena: 'Crema de calabaza' },
    { dia: 'Martes', color: 'Amarillo', desayuno: 'Piña y plátano', almuerzo: 'Pollo con maíz', cena: 'Omelette de queso' },
    { dia: 'Miércoles', color: 'Verde', desayuno: 'Batido de espinaca', almuerzo: 'Ensalada de aguacate', cena: 'Crema de calabacín' },
    { dia: 'Jueves', color: 'Azul', desayuno: 'Arándanos con yogur', almuerzo: 'Pescado al vapor', cena: 'Queso azul' },
    { dia: 'Viernes', color: 'Índigo', desayuno: 'Uvas moradas', almuerzo: 'Ensalada de berenjena', cena: 'Crema de col lombarda' },
    { dia: 'Sábado', color: 'Violeta', desayuno: 'Batido de mora', almuerzo: 'Arroz con remolacha', cena: 'Ensalada de repollo morado' }
  ],
  [
    { dia: 'Domingo', color: 'Rojo', desayuno: 'Sandía y jugo de frutos rojos', almuerzo: 'Pasta con salsa de tomate', cena: 'Ensalada de remolacha' },
    { dia: 'Lunes', color: 'Naranja', desayuno: 'Papaya y jugo de zanahoria', almuerzo: 'Pollo a la naranja', cena: 'Sopa de calabaza' },
    { dia: 'Martes', color: 'Amarillo', desayuno: 'Mango y pan de maíz', almuerzo: 'Tortilla española', cena: 'Puré de papa amarilla' },
    { dia: 'Miércoles', color: 'Verde', desayuno: 'Kiwis y batido de espinaca', almuerzo: 'Sopa de brócoli', cena: 'Ensalada de lechuga' },
    { dia: 'Jueves', color: 'Azul', desayuno: 'Uvas azules y yogur', almuerzo: 'Pasta con queso azul', cena: 'Ensalada de col morada' },
    { dia: 'Viernes', color: 'Índigo', desayuno: 'Ciruelas y jugo de uva', almuerzo: 'Berenjenas rellenas', cena: 'Sopa de lombarda' },
    { dia: 'Sábado', color: 'Violeta', desayuno: 'Uvas negras y batido de mora', almuerzo: 'Ensalada de repollo morado', cena: 'Arroz integral con remolacha' }
  ],
  [
    { dia: 'Domingo', color: 'Rojo', desayuno: 'Jugo de fresa', almuerzo: 'Pollo al pimentón', cena: 'Sopa de tomate' },
    { dia: 'Lunes', color: 'Naranja', desayuno: 'Melón y jugo de naranja', almuerzo: 'Pasta con calabaza', cena: 'Tortilla de zanahoria' },
    { dia: 'Martes', color: 'Amarillo', desayuno: 'Plátano y jugo de piña', almuerzo: 'Pollo con curry', cena: 'Ensalada de maíz' },
    { dia: 'Miércoles', color: 'Verde', desayuno: 'Manzana verde', almuerzo: 'Ensalada de espinaca', cena: 'Sopa de guisantes' },
    { dia: 'Jueves', color: 'Azul', desayuno: 'Arándanos y leche', almuerzo: 'Pescado con salsa azul', cena: 'Ensalada de col morada' },
    { dia: 'Viernes', color: 'Índigo', desayuno: 'Jugo de uva', almuerzo: 'Berenjenas al horno', cena: 'Sopa de lombarda' },
    { dia: 'Sábado', color: 'Violeta', desayuno: 'Batido de arándanos', almuerzo: 'Arroz con col morada', cena: 'Ensalada de repollo' }
  ],
  [
    { dia: 'Domingo', color: 'Rojo', desayuno: 'Jugo de sandía', almuerzo: 'Carne guisada con pimientos', cena: 'Ensalada de remolacha' },
    { dia: 'Lunes', color: 'Naranja', desayuno: 'Papaya y jugo de naranja', almuerzo: 'Pollo con zanahoria', cena: 'Sopa de calabaza' },
    { dia: 'Martes', color: 'Amarillo', desayuno: 'Mango y pan de maíz', almuerzo: 'Tortilla de patata', cena: 'Ensalada de huevo' },
    { dia: 'Miércoles', color: 'Verde', desayuno: 'Kiwis y batido de espinaca', almuerzo: 'Sopa de brócoli y pollo', cena: 'Ensalada de pepino' },
    { dia: 'Jueves', color: 'Azul', desayuno: 'Uvas azules y yogur', almuerzo: 'Pasta con queso azul', cena: 'Ensalada de nueces' },
    { dia: 'Viernes', color: 'Índigo', desayuno: 'Ciruelas y jugo de uva', almuerzo: 'Berenjenas rellenas', cena: 'Pan integral' },
    { dia: 'Sábado', color: 'Violeta', desayuno: 'Uvas negras y batido de mora', almuerzo: 'Ensalada de zanahoria', cena: 'Arroz con remolacha' }
  ]
];

let semanaActual = 0;

function renderSuggestDishes() {
  const suggestList = document.getElementById('suggest-dishes-list');
  suggestList.innerHTML = '';
  const selector = document.createElement('div');
  selector.style.marginBottom = '1rem';
  selector.innerHTML = 'Semana: ' + [1,2,3,4].map((n,i) => `<button type="button" class="btn-semana" data-semana="${i}" style="margin-right:0.5rem;${i===semanaActual?'font-weight:bold;background:#e0e7ff;':''}">${n}</button>`).join('');
  suggestList.appendChild(selector);

  selector.querySelectorAll('.btn-semana').forEach(btn => {
    btn.onclick = () => {
      semanaActual = parseInt(btn.dataset.semana);
      renderSuggestDishes();
    };
  });

  platosPorSemana[semanaActual].forEach(({dia, color, desayuno, almuerzo, cena}) => {
    const section = document.createElement('div');
    section.style.marginBottom = '1rem';
    section.innerHTML = `<strong style="color:#333;">${dia} <span style="color:gray;">(${color})</span></strong>`;
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.marginTop = '0.5rem';
    table.innerHTML = `
      <tr><th>Desayuno</th><th>Almuerzo</th><th>Cena</th></tr>
      <tr>
        <td class="suggest-cell" style="cursor:pointer;">${desayuno}</td>
        <td class="suggest-cell" style="cursor:pointer;">${almuerzo}</td>
        <td class="suggest-cell" style="cursor:pointer;">${cena}</td>
      </tr>
    `;
    table.querySelectorAll('.suggest-cell').forEach(cell => {
      cell.onclick = () => {
        navigator.clipboard.writeText(cell.textContent);
        cell.style.background = '#e0e7ff';
        setTimeout(() => { cell.style.background = ''; }, 700);
      };
      cell.title = 'Haz clic para copiar';
    });
    section.appendChild(table);
    suggestList.appendChild(section);
  });
}

const suggestBtn = document.getElementById('suggest-dishes-btn');
const suggestModal = document.getElementById('suggest-dishes-modal');
const closeSuggest = document.getElementById('close-suggest-dishes');

if (suggestBtn && suggestModal && closeSuggest) {
  suggestBtn.onclick = function() {
    renderSuggestDishes();
    suggestModal.style.display = 'flex';
  };
  closeSuggest.onclick = function() {
    suggestModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === suggestModal) suggestModal.style.display = 'none';
  };
}