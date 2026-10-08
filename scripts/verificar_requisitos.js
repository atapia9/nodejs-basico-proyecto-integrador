#!/usr/bin/env node
'use strict';

// Verificación de la plantilla: imprime una tabla «requisito -> evidencia -> resultado».
//
// Uso:
//   node scripts/verificar_requisitos.js            verificación completa
//   node scripts/verificar_requisitos.js --rapido   omite la instalación en limpio y el humo con curl
//   node scripts/verificar_requisitos.js --md       imprime la tabla en formato Markdown
//
// Requiere git, npm y curl. Para comparar con el texto original del manual necesita además
// `unzip` y el archivo fuentes/Manual_NodeJS_Basico_ilustrado_v3.docx; si no están, usa
// docs/REQUISITOS_DEL_MANUAL.md como fuente (con menos fuerza como evidencia).
//
// Sale con código 1 si alguna comprobación falla.

const { execFileSync, spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');
const OPCIONES = new Set(process.argv.slice(2));
const OK = 'OK';
const FALLA = 'FALLA';
const AVISO = 'AVISO';
const OMITIDO = 'OMITIDO';
const filas = [];

// ---------------------------------------------------------------- utilidades

function fila(requisito, resultado, evidencia) {
  filas.push({ requisito, evidencia, resultado });
}

function ruta(rel) {
  return path.join(RAIZ, rel);
}

function existe(rel) {
  return fs.existsSync(ruta(rel));
}

function leer(rel) {
  return fs.readFileSync(ruta(rel), 'utf8');
}

function git(...argumentos) {
  return execFileSync('git', argumentos, {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 512 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// git check-ignore termina con código 1 cuando la ruta no está ignorada.
function estaIgnorado(rel) {
  try {
    git('check-ignore', '-q', rel);
    return true;
  } catch {
    return false;
  }
}

function recortar(texto, maximo) {
  const limpio = String(texto).replace(/\s+/g, ' ').trim();
  return limpio.length > maximo ? `${limpio.slice(0, maximo - 1)}…` : limpio;
}

// Divide un texto en líneas de como máximo `ancho` caracteres, cortando entre palabras.
function ajustar(texto, ancho) {
  const lineas = [];
  let actual = '';
  for (const palabra of String(texto).replace(/\s+/g, ' ').trim().split(' ')) {
    if (actual && `${actual} ${palabra}`.length > ancho) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = actual ? `${actual} ${palabra}` : palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

// Archivos del proyecto: versionados y no versionados que no están ignorados.
function archivosDelProyecto() {
  return git('ls-files', '-co', '--exclude-standard').split('\n').filter(Boolean).filter(existe);
}

function esBinario(buffer) {
  return buffer.subarray(0, 8000).includes(0);
}

// Calcula el ancla que GitHub genera para un encabezado de Markdown.
function ancla(encabezado) {
  return encabezado
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

// Quita los bloques de código para no interpretar su contenido como enlaces o encabezados.
function sinBloquesDeCodigo(markdown) {
  return markdown.replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
}

// ------------------------------------------- sección 10 del manual (fuente de verdad)

function decodificar(xml) {
  return xml
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function parrafosDelDocx(archivo) {
  const xml = execFileSync('unzip', ['-p', archivo, 'word/document.xml'], {
    encoding: 'utf8',
    maxBuffer: 512 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)]
    .map((p) =>
      decodificar([...p[0].matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((t) => t[1]).join(''))
    )
    .map((texto) => texto.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function seccion10DesdeDocx() {
  const carpeta = ruta('fuentes');
  if (!fs.existsSync(carpeta)) return null;
  const manual = fs.readdirSync(carpeta).find((f) => /^Manual_NodeJS_Basico.*\.docx$/.test(f));
  if (!manual) return null;

  let parrafos;
  try {
    parrafos = parrafosDelDocx(path.join(carpeta, manual));
  } catch {
    return null; // por ejemplo, unzip no está instalado
  }

  const i0 = parrafos.indexOf('Especificación mínima');
  const i1 = parrafos.indexOf('Puntos extra (opcionales)');
  const i2 = parrafos.indexOf('Criterios de evaluación del proyecto');
  const i3 = parrafos.findIndex((t, i) => i > i2 && /^11\. Anexos/.test(t));
  if ([i0, i1, i2, i3].some((i) => i < 0)) return null;

  const celdas = parrafos.slice(i2 + 1, i3);
  const criterios = [];
  for (let i = 0; i + 1 < celdas.length; i += 2) {
    criterios.push({ nombre: celdas[i], porcentaje: parseInt(celdas[i + 1], 10) });
  }
  return {
    origen: `texto original de ${manual}`,
    especificacion: parrafos.slice(i0 + 1, i1),
    extras: parrafos.slice(i1 + 1, i2),
    criterios,
  };
}

function seccion10DesdeMarkdown() {
  const md = leer('docs/REQUISITOS_DEL_MANUAL.md');
  const bloque = (titulo) => (md.split(`### ${titulo}`)[1] || '').split(/\n##/)[0];
  const celdas = (texto) =>
    [...texto.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gm)].map((m) => [m[1], m[2]]);

  return {
    origen: 'docs/REQUISITOS_DEL_MANUAL.md (no se encontró el .docx)',
    especificacion: celdas(bloque('Especificación mínima'))
      .filter(([id]) => /^\d+$/.test(id))
      .map(([, texto]) => texto),
    extras: celdas(bloque('Puntos extra (opcionales)'))
      .filter(([id]) => /^E\d+$/.test(id))
      .map(([, texto]) => texto),
    criterios: celdas(bloque('Criterios de evaluación del proyecto'))
      .filter(([, peso]) => /^\d+\s*%$/.test(peso))
      .map(([nombre, peso]) => ({ nombre, porcentaje: parseInt(peso, 10) })),
  };
}

// ------------------------------------------- 1. requisitos de la sección 10

// Busca la marca «TODO [etiqueta]» en los archivos de texto del proyecto. `donde` limita la
// búsqueda a rutas que empiecen con alguno de esos prefijos (por ejemplo, 'src/' para el código).
function marcasTodo(etiqueta, donde = ['']) {
  const buscada = `TODO [${etiqueta}]`;
  return archivosDelProyecto().filter((archivo) => {
    if (archivo === 'scripts/verificar_requisitos.js') return false;
    if (!donde.some((prefijo) => archivo.startsWith(prefijo))) return false;
    if (!/\.(js|md|ejs|json|yml|yaml)$/.test(archivo)) return false;
    return leer(archivo).includes(buscada);
  });
}

function archivosDeSrc(carpeta) {
  const base = ruta(carpeta);
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith('.js'))
    .map((f) => `${carpeta}/${f}`);
}

// Dónde debe aparecer la marca TODO de cada requisito: en el código (src/) para R1 a R6 y E2 a E3,
// en el README para R7 y en el README y la guía de despliegue para E1.
const DONDE_EL_TODO = {
  R1: ['src/'],
  R2: ['src/'],
  R3: ['src/'],
  R4: ['src/'],
  R5: ['src/'],
  R6: ['src/'],
  R7: ['README.md'],
  E1: ['README.md', 'docs/despliegue-render.md'],
  E2: ['src/'],
  E3: ['src/'],
};

// Cada función devuelve un texto con la evidencia de que el requisito está implementado o
// habilitado (o null si no se cumple). Las marcas TODO se comprueban aparte.
const evidenciaDeCodigo = {
  R1() {
    const rutas = archivosDeSrc('src/routes');
    return rutas.length > 0 ? `recurso de ejemplo en ${rutas.join(', ')}` : null;
  },
  R2() {
    const patrones = {
      'GET lista': /\.get\(\s*['"]\/['"]/,
      'GET por id': /\.get\(\s*['"]\/:\w+['"]/,
      POST: /\.post\(\s*['"]\/['"]/,
      PUT: /\.put\(\s*['"]\/:\w+['"]/,
      DELETE: /\.delete\(\s*['"]\/:\w+['"]/,
    };
    for (const archivo of archivosDeSrc('src/routes')) {
      const codigo = leer(archivo);
      if (Object.values(patrones).every((patron) => patron.test(codigo))) {
        return `5 de 5 operaciones CRUD en ${archivo}`;
      }
    }
    return null;
  },
  R3() {
    const codigo = archivosDeSrc('src/db').map(leer).join('\n');
    if (/require\(['"]better-sqlite3['"]\)/.test(codigo)) return 'src/db usa better-sqlite3 (SQLite)';
    if (/require\(['"]mongoose['"]\)/.test(codigo)) return 'src/db usa mongoose (MongoDB)';
    return null;
  },
  R4() {
    const config = existe('src/config/index.js') ? leer('src/config/index.js') : '';
    const usaDotenv = /require\(['"]dotenv['"]\)\.config/.test(config) && /process\.env\./.test(config);
    return usaDotenv && estaIgnorado('.env') ? 'src/config usa dotenv y process.env; .env está ignorado' : null;
  },
  R5() {
    const propios = archivosDeSrc('src/middlewares').map((f) => path.basename(f));
    const usados = ['src/app.js', ...archivosDeSrc('src/routes')]
      .map(leer)
      .join('\n')
      .match(/require\(['"]\.{1,2}\/middlewares\//g);
    return propios.length > 0 && usados
      ? `${propios.length} middlewares en src/middlewares (${propios.join(', ')}), usados en app y rutas`
      : null;
  },
  R6() {
    const errores = existe('src/middlewares/errores.js') ? leer('src/middlewares/errores.js') : '';
    const cuatroParametros = /function\s+\w+\(\s*err\s*,\s*req\s*,\s*res\s*,\s*next\s*\)/.test(errores);
    const app = existe('src/app.js') ? leer('src/app.js') : '';
    const usos = [...app.matchAll(/app\.use\(([^)]*)\)/g)].map((m) => m[1].trim());
    const alFinal = usos.length > 0 && /manejador/i.test(usos[usos.length - 1]);
    return cuatroParametros && alFinal
      ? 'middleware (err, req, res, next) declarado como último app.use() de src/app.js'
      : null;
  },
  R7() {
    const readme = existe('README.md') ? leer('README.md') : '';
    const secciones = ['Instalación', 'Variables de entorno', 'Ejecución', 'Endpoints'];
    const faltan = secciones.filter((s) => !new RegExp(`^#{2,4} ${s}`, 'm').test(readme));
    return faltan.length === 0 ? `README.md con las secciones ${secciones.join(', ')}` : null;
  },
  E1() {
    return existe('docs/despliegue-render.md') ? 'guía docs/despliegue-render.md; opcional' : null;
  },
  E2() {
    const app = existe('src/app.js') ? leer('src/app.js') : '';
    const activado = /^\s*app\.set\(\s*['"]view engine['"]/m.test(app);
    return existe('src/views/libros.ejs') && existe('src/views/README.md') && !activado
      ? 'plantilla src/views/libros.ejs y guía src/views/README.md; desactivado por defecto'
      : null;
  },
  E3() {
    const rutas = existe('src/routes/libros.js') ? leer('src/routes/libros.js') : '';
    const activado = /req\.query/.test(rutas.replace(/^\s*\/\/.*$/gm, ''));
    return rutas && !activado ? 'desactivado por defecto; punto de extensión en src/routes/libros.js' : null;
  },
};

function verificarRequisitos(seccion10) {
  const especificacion = leer('ESPECIFICACION.md');
  const grupos = [
    ['R', seccion10.especificacion],
    ['E', seccion10.extras],
  ];

  fila(
    '1. Fuente de la sección 10',
    seccion10.especificacion.length === 7 && seccion10.extras.length === 3 ? OK : FALLA,
    `${seccion10.especificacion.length} requisitos y ${seccion10.extras.length} puntos extra leídos de ${seccion10.origen}`
  );

  for (const [letra, textos] of grupos) {
    textos.forEach((texto, i) => {
      const id = `${letra}${i + 1}`;
      const igual = especificacion.includes(texto);
      const implementacion = evidenciaDeCodigo[id] ? evidenciaDeCodigo[id]() : null;
      const todo = DONDE_EL_TODO[id] ? marcasTodo(id, DONDE_EL_TODO[id]) : [];
      const evidencia = [
        igual ? 'ESPECIFICACION.md con el mismo texto' : 'texto distinto en ESPECIFICACION.md',
        implementacion || 'sin implementación o habilitación en el código',
        todo.length > 0 ? `TODO [${id}] en ${todo.join(', ')}` : `sin TODO [${id}] en ${(DONDE_EL_TODO[id] || ['?']).join(', ')}`,
      ].join('; ');
      fila(`1. ${id}: ${recortar(texto, 44)}`, igual && implementacion && todo.length > 0 ? OK : FALLA, evidencia);
    });
  }
}

// ------------------------------------------- 2. instalación, pruebas, arranque y humo

function puertoLibre() {
  return new Promise((resolver, rechazar) => {
    const servidor = net.createServer();
    servidor.once('error', rechazar);
    servidor.listen(0, '127.0.0.1', () => {
      const { port } = servidor.address();
      servidor.close(() => resolver(port));
    });
  });
}

function pausa(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function curl(metodo, url, cuerpo) {
  const argumentos = ['-s', '--max-time', '10', '-w', '\n%{http_code}', '-X', metodo];
  if (cuerpo !== undefined) {
    argumentos.push('-H', 'Content-Type: application/json', '-d', JSON.stringify(cuerpo));
  }
  argumentos.push(url);
  const salida = execFileSync('curl', argumentos, { encoding: 'utf8' });
  const corte = salida.lastIndexOf('\n');
  const texto = salida.slice(0, corte);
  let json;
  try {
    json = texto ? JSON.parse(texto) : undefined;
  } catch {
    json = undefined;
  }
  return { estado: Number(salida.slice(corte + 1)), cuerpo: json };
}

function iniciarServidor(directorio, puerto, archivoBd) {
  const windows = process.platform === 'win32';
  const hijo = spawn('npm', ['start'], {
    cwd: directorio,
    env: { ...process.env, PORT: String(puerto), DB_FILE: archivoBd, API_KEY: '' },
    stdio: 'ignore',
    shell: windows,
    detached: !windows,
  });
  return hijo;
}

async function detenerServidor(hijo) {
  if (!hijo || hijo.exitCode !== null) return;
  const terminado = new Promise((resolver) => hijo.once('exit', resolver));
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(hijo.pid), '/t', '/f']);
  } else {
    try {
      process.kill(-hijo.pid, 'SIGTERM');
    } catch {
      /* ya había terminado */
    }
  }
  await Promise.race([terminado, pausa(5000)]);
}

async function esperarServidor(puerto) {
  for (let intento = 0; intento < 60; intento += 1) {
    try {
      if (curl('GET', `http://127.0.0.1:${puerto}/`).estado === 200) return true;
    } catch {
      /* todavía no responde */
    }
    await pausa(250);
  }
  return false;
}

function ejecutar(comando, argumentos, directorio) {
  const windows = process.platform === 'win32';
  return spawnSync(comando, argumentos, {
    cwd: directorio,
    encoding: 'utf8',
    shell: windows,
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, CI: 'true' },
  });
}

async function verificarEjecucion() {
  if (OPCIONES.has('--rapido')) {
    fila('2. npm ci, npm test, npm start y humo con curl', OMITIDO, 'opción --rapido');
    return;
  }
  if (spawnSync('curl', ['--version'], { stdio: 'ignore' }).error) {
    fila('2. humo con curl', FALLA, 'curl no está instalado');
    return;
  }
  // La variante con Mongoose necesita una base MongoDB en marcha; se toma de MONGODB_URI.
  if (JSON.parse(leer('package.json')).dependencies?.mongoose && !process.env.MONGODB_URI) {
    fila(
      '2. npm ci, npm test, npm start y humo con curl',
      OMITIDO,
      'variante Mongoose: define MONGODB_URI con una base MongoDB para ejecutar esta comprobación'
    );
    return;
  }

  // Copia limpia: solo los archivos que se versionarían, sin node_modules ni .env.
  const temporal = fs.mkdtempSync(path.join(os.tmpdir(), 'verificar-plantilla-'));
  let servidor;
  try {
    for (const archivo of archivosDelProyecto()) {
      const destino = path.join(temporal, archivo);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.copyFileSync(ruta(archivo), destino);
    }

    const instalacion = ejecutar('npm', ['ci', '--no-audit', '--no-fund'], temporal);
    fila(
      '2. npm install (npm ci) en limpio',
      instalacion.status === 0 ? OK : FALLA,
      instalacion.status === 0 ? 'copia limpia sin node_modules; npm ci terminó bien' : recortar(instalacion.stderr, 90)
    );
    if (instalacion.status !== 0) return;

    const pruebas = ejecutar('npm', ['test'], temporal);
    const aprobadas = (pruebas.stdout.match(/^ℹ pass (\d+)/m) || [])[1];
    const falladas = (pruebas.stdout.match(/^ℹ fail (\d+)/m) || [])[1];
    fila(
      '2. npm test en limpio',
      pruebas.status === 0 ? OK : FALLA,
      `${aprobadas ?? '?'} pruebas aprobadas, ${falladas ?? '?'} falladas`
    );

    const puerto = await puertoLibre();
    const archivoBd = path.join(temporal, 'humo.sqlite');
    const base = `http://127.0.0.1:${puerto}`;
    servidor = iniciarServidor(temporal, puerto, archivoBd);
    const arriba = await esperarServidor(puerto);
    fila('2. npm start en limpio', arriba ? OK : FALLA, arriba ? `el servidor responde 200 en GET / (puerto ${puerto})` : 'el servidor no respondió en 15 s');
    if (!arriba) return;

    const crear = curl('POST', `${base}/libros`, { titulo: 'Libro de humo', autor: 'Autor de humo', anio: 2026 });
    const id = crear.cuerpo && crear.cuerpo.id;
    const pasos = [
      ['GET /', 200, () => curl('GET', `${base}/`)],
      ['GET /libros', 200, () => curl('GET', `${base}/libros`)],
      ['POST /libros válido', 201, () => crear],
      ['POST /libros sin titulo', 400, () => curl('POST', `${base}/libros`, { autor: 'Sin título' })],
      ['GET /libros/:id existente', 200, () => curl('GET', `${base}/libros/${id}`)],
      ['GET /libros/:id inexistente', 404, () => curl('GET', `${base}/libros/999999`)],
      ['PUT /libros/:id existente', 200, () => curl('PUT', `${base}/libros/${id}`, { disponible: false })],
      ['PUT /libros/:id inexistente', 404, () => curl('PUT', `${base}/libros/999999`, { disponible: false })],
    ];
    for (const [nombre, esperado, accion] of pasos) {
      const { estado } = accion();
      fila(`2. curl ${nombre}`, estado === esperado ? OK : FALLA, `código ${estado}, esperado ${esperado}`);
    }

    // Persistencia: se reinicia el servidor y el libro debe seguir existiendo.
    await detenerServidor(servidor);
    servidor = iniciarServidor(temporal, puerto, archivoBd);
    const reinicio = await esperarServidor(puerto);
    const tras = reinicio ? curl('GET', `${base}/libros/${id}`) : { estado: 'sin respuesta' };
    fila(
      '2. Persistencia tras reiniciar el servidor',
      tras.estado === 200 ? OK : FALLA,
      `GET /libros/${id} después del reinicio: código ${tras.estado}`
    );

    const borrar = curl('DELETE', `${base}/libros/${id}`);
    fila('2. curl DELETE /libros/:id', borrar.estado === 204 ? OK : FALLA, `código ${borrar.estado}, esperado 204`);
    const despues = curl('GET', `${base}/libros/${id}`);
    fila('2. curl GET tras DELETE', despues.estado === 404 ? OK : FALLA, `código ${despues.estado}, esperado 404`);
  } finally {
    await detenerServidor(servidor);
    fs.rmSync(temporal, { recursive: true, force: true });
  }
}

// ------------------------------------------- 3. rúbrica

function verificarRubrica(seccion10) {
  const rubrica = leer('RUBRICA.md');
  const bloque = (rubrica.split('## Criterios de evaluación')[1] || '').split(/\n## /)[0];
  const tabla = [...bloque.matchAll(/^\|\s*([^|*]+?)\s*\|\s*(\d+)\s*%\s*\|\s*$/gm)].map((m) => ({
    nombre: m[1],
    porcentaje: Number(m[2]),
  }));

  for (const criterio of seccion10.criterios) {
    const propio = tabla.find((c) => c.nombre === criterio.nombre);
    fila(
      `3. Rúbrica: ${recortar(criterio.nombre, 44)}`,
      propio && propio.porcentaje === criterio.porcentaje ? OK : FALLA,
      propio ? `RUBRICA.md ${propio.porcentaje} %, manual ${criterio.porcentaje} %` : 'no aparece en RUBRICA.md'
    );
  }

  const suma = tabla.reduce((total, c) => total + c.porcentaje, 0);
  fila('3. Los porcentajes de RUBRICA.md suman 100', suma === 100 ? OK : FALLA, `suma = ${suma} %`);

  const propuesta = (rubrica.split('## Propuesta')[1] || '').split(/\n## /)[0];
  const puntos = [...propuesta.matchAll(/^\|\s*([^|*]+?)\s*\|\s*(\d+)\s*%\s*\|\s*(\d+)\s*\|\s*$/gm)];
  const totalPuntos = puntos.reduce((total, m) => total + Number(m[3]), 0);
  const coincide = puntos.every((m) => Number(m[3]) === (Number(m[2]) * 20) / 100);
  fila(
    '3. Propuesta de conversión a 20 puntos',
    puntos.length === tabla.length && totalPuntos === 20 && coincide ? AVISO : FALLA,
    `suma ${totalPuntos} puntos, proporcional a los porcentajes; marcada como propuesta pendiente de confirmación`
  );
}

// ------------------------------------------- 4. secretos y datos personales

const PATRONES = [
  ['clave privada', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['token de GitHub', /\b(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
  ['clave de AWS', /\bAKIA[0-9A-Z]{16}\b/],
  ['token de Slack', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['clave de API (sk-)', /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ['cadena de conexión con contraseña', /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@'"<>]+:[^\s/@'"<>]+@/i],
  [
    'asignación de secreto',
    /\b(?:password|passwd|contraseña|secret|token|api[_-]?key)\w*\s*[:=]\s*['"][^'"\s]{8,}['"]/i,
    /prueba|ejemplo|cambia|tu[_-]|xxx|\*\*\*|placeholder/i,
  ],
  [
    'correo electrónico',
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/,
    /^(noreply@anthropic\.com|[^@]*@users\.noreply\.github\.com)$/i,
  ],
  [
    'teléfono',
    /(?<![\d.])(?:\+?\d{1,3}[\s.-])?(?:\(\d{2,3}\)|\d{2,3})[\s.-]\d{3,4}[\s.-]\d{4}(?![\d.])/,
  ],
  ['ruta local', /(?:\/Users\/|\/home\/[a-z]|[A-Za-z]:\\Users\\|\/private\/tmp|\/var\/folders|\/tmp\/claude)/],
];

function buscarEnTexto(texto, origen, hallazgos) {
  texto.split('\n').forEach((linea, indice) => {
    for (const [nombre, patron, permitido] of PATRONES) {
      const coincidencia = linea.match(patron);
      if (!coincidencia) continue;
      if (permitido && permitido.test(coincidencia[0])) continue;
      if (permitido && nombre === 'asignación de secreto' && permitido.test(linea)) continue;
      hallazgos.push(`${nombre} en ${origen}:${indice + 1} (${coincidencia[0].slice(0, 6)}…)`);
    }
  });
}

function verificarSecretos() {
  const hallazgos = [];
  let revisados = 0;

  for (const archivo of archivosDelProyecto()) {
    if (archivo === 'scripts/verificar_requisitos.js') continue; // contiene los patrones de búsqueda
    const buffer = fs.readFileSync(ruta(archivo));
    if (esBinario(buffer)) continue;
    revisados += 1;
    // El lockfile solo tiene URLs y hashes de integridad: el patrón de teléfono daría falsos positivos.
    const texto = buffer.toString('utf8');
    buscarEnTexto(archivo === 'package-lock.json' ? texto.replace(/"integrity": "[^"]*"/g, '') : texto, archivo, hallazgos);
  }
  fila(
    '4. Sin secretos ni datos personales en los archivos',
    hallazgos.length === 0 ? OK : FALLA,
    hallazgos.length === 0
      ? `${revisados} archivos revisados (claves, tokens, cadenas de conexión, correos, teléfonos y rutas locales)`
      : hallazgos.slice(0, 3).join('; ')
  );

  let commits = 0;
  const enHistorial = [];
  try {
    const historial = git(
      'log', '--all', '-p', '--no-color',
      '--pretty=format:commit %h%nAuthor: %an <%ae>%nCommitter: %cn <%ce>%n%B',
      '--', '.', ':(exclude)scripts/verificar_requisitos.js', ':(exclude)package-lock.json'
    );
    commits = git('rev-list', '--all', '--count').trim();
    const relevantes = historial.split('\n').filter((l) => !l.startsWith('-') && !l.startsWith(' '));
    buscarEnTexto(relevantes.join('\n'), 'historial de Git', enHistorial);

    const archivosEnv = git('log', '--all', '--name-only', '--pretty=format:')
      .split('\n')
      .filter((a) => /(^|\/)\.env$/.test(a));
    if (archivosEnv.length) enHistorial.push('.env aparece en el historial');
  } catch (error) {
    enHistorial.push(`no se pudo leer el historial: ${recortar(error.message, 60)}`);
  }
  const autores = new Set(
    git('log', '--all', '--pretty=format:%an <%ae>').split('\n').filter(Boolean)
  );
  fila(
    '4. Sin secretos ni datos personales en el historial de Git',
    enHistorial.length === 0 ? OK : FALLA,
    enHistorial.length === 0
      ? `${commits} commits revisados; identidades: ${[...autores].join(', ')}`
      : enHistorial.slice(0, 3).join('; ')
  );
}

// ------------------------------------------- 5. variables de entorno

function verificarVariablesDeEntorno() {
  const usadas = new Set();
  const recorrer = (carpeta) => {
    for (const entrada of fs.readdirSync(ruta(carpeta), { withFileTypes: true })) {
      const rel = `${carpeta}/${entrada.name}`;
      if (entrada.isDirectory()) recorrer(rel);
      else if (entrada.name.endsWith('.js')) {
        for (const m of leer(rel).matchAll(/process\.env(?:\.([A-Z][A-Z0-9_]*)|\[['"]([A-Z][A-Z0-9_]*)['"]\])/g)) {
          usadas.add(m[1] || m[2]);
        }
      }
    }
  };
  recorrer('src');

  const ejemplo = leer('.env.example');
  const declaradas = new Set([...ejemplo.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]));
  const faltan = [...usadas].filter((v) => !declaradas.has(v));
  const sobran = [...declaradas].filter((v) => !usadas.has(v));
  const conValor = [...ejemplo.matchAll(/^([A-Z][A-Z0-9_]*)=(.+)$/gm)].map((m) => m[1]);

  fila(
    '5. .env.example lista todas las variables que lee el código',
    faltan.length === 0 ? OK : FALLA,
    faltan.length === 0
      ? `código lee ${[...usadas].join(', ')}; todas están en .env.example`
      : `faltan en .env.example: ${faltan.join(', ')}`
  );
  fila(
    '5. .env.example no trae valores',
    conValor.length === 0 ? OK : FALLA,
    conValor.length === 0 ? 'todas las variables están vacías' : `con valor: ${conValor.join(', ')}`
  );
  if (sobran.length) {
    fila('5. Variables de .env.example que el código no lee', AVISO, sobran.join(', '));
  }

  const ignorado = estaIgnorado('.env');
  const versionado = git('ls-files', '.env', 'node_modules').trim() !== '';
  const ejemploVersionado = git('ls-files', '.env.example').trim() === '.env.example';
  fila(
    '5. .env y node_modules ignorados; .env.example versionado',
    ignorado && !versionado && ejemploVersionado ? OK : FALLA,
    `.env ignorado: ${ignorado ? 'sí' : 'no'}; .env o node_modules versionados: ${versionado ? 'sí' : 'no'}; .env.example versionado: ${ejemploVersionado ? 'sí' : 'no'}`
  );
}

// ------------------------------------------- 6. enlaces internos

function verificarEnlaces() {
  const documentos = archivosDelProyecto().filter((a) => a.endsWith('.md'));
  const rotos = [];
  let total = 0;
  const anclasDe = (rel) =>
    new Set(
      [...sinBloquesDeCodigo(leer(rel)).matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)].map((m) => ancla(m[1]))
    );

  for (const documento of documentos) {
    const texto = sinBloquesDeCodigo(leer(documento));
    for (const m of texto.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const destino = m[1];
      if (/^(https?:|mailto:)/i.test(destino)) continue;
      total += 1;
      const [archivoRelativo, fragmento] = destino.split('#');
      const objetivo = archivoRelativo
        ? path.normalize(path.join(path.dirname(documento), decodeURI(archivoRelativo)))
        : documento;
      if (!existe(objetivo)) {
        rotos.push(`${documento} -> ${destino}`);
      } else if (fragmento && objetivo.endsWith('.md') && !anclasDe(objetivo).has(decodeURI(fragmento))) {
        rotos.push(`${documento} -> ${destino} (ancla)`);
      }
    }
  }
  fila(
    '6. Los enlaces internos de la documentación resuelven',
    rotos.length === 0 ? OK : FALLA,
    rotos.length === 0 ? `${total} enlaces revisados en ${documentos.length} documentos` : rotos.slice(0, 3).join('; ')
  );
}

// ------------------------------------------- 7. cómo entregar

function verificarEntrega() {
  const readme = leer('README.md');
  const entrega = existe('ENTREGA.md') ? leer('ENTREGA.md') : '';
  const puntos = (entrega.match(/^- \[ \]/gm) || []).length;
  const elementos = [
    ['sección «Cómo entregar»', /^#{2,4} Cómo entregar/m.test(readme)],
    ['URL del repositorio', /URL del repositorio/.test(readme)],
    ['URL de despliegue (opcional)', /URL de despliegue \(opcional\)/.test(readme)],
    ['enlace a ENTREGA.md', /\]\(ENTREGA\.md\)/.test(readme)],
  ];
  const faltan = elementos.filter(([, cumple]) => !cumple).map(([nombre]) => nombre);
  fila(
    '7. El README explica cómo entregar',
    faltan.length === 0 && puntos > 0 ? OK : FALLA,
    faltan.length === 0
      ? `README con URL del repositorio, URL de despliegue y enlace a ENTREGA.md (${puntos} puntos de verificación)`
      : `falta: ${faltan.join(', ')}`
  );
}

// ------------------------------------------- extras de la plantilla

function verificarPlantilla() {
  const paquete = JSON.parse(leer('package.json'));
  const scripts = ['start', 'dev', 'test'].filter((s) => paquete.scripts && paquete.scripts[s]);
  fila(
    'P. package.json con scripts start, dev y test',
    scripts.length === 3 ? OK : FALLA,
    `scripts: ${scripts.join(', ')}; dev usa ${paquete.scripts.dev}`
  );

  const permitidas = new Set(['express', 'dotenv', 'better-sqlite3', 'mongoose', 'ejs']);
  const fuera = Object.keys(paquete.dependencies || {}).filter((d) => !permitidas.has(d));
  const soloNodemon = Object.keys(paquete.devDependencies || {}).every((d) => d === 'nodemon');
  fila(
    'P. Dependencias dentro del temario del curso',
    fuera.length === 0 && soloNodemon ? OK : FALLA,
    `dependencies: ${Object.keys(paquete.dependencies || {}).join(', ')}; devDependencies: ${Object.keys(paquete.devDependencies || {}).join(', ')}`
  );

  const nvmrc = leer('.nvmrc').trim();
  const flujo = leer('.github/workflows/ci.yml');
  fila(
    'P. El CI usa la versión de Node de .nvmrc',
    /node-version-file:\s*\.nvmrc/.test(flujo) && /npm test/.test(flujo) && /\.env\|node_modules/.test(flujo) ? OK : FALLA,
    `.nvmrc = ${nvmrc}; ci.yml usa node-version-file, ejecuta npm test y revisa .env y node_modules`
  );

  fila(
    'P. Nota de divulgación en los documentos principales',
    ['README.md', 'ESPECIFICACION.md', 'RUBRICA.md', 'GUIA_POR_SESION.md'].every((a) => /asistencia de Claude/.test(leer(a))) ? OK : FALLA,
    'README, ESPECIFICACION, RUBRICA y GUIA_POR_SESION mencionan la asistencia de Claude'
  );
}

// ------------------------------------------- salida

function imprimir() {
  const modoMarkdown = OPCIONES.has('--md');
  if (modoMarkdown) {
    console.log('| Requisito | Evidencia | Resultado |');
    console.log('|---|---|---|');
    for (const f of filas) {
      const celda = (t) => String(t).replace(/\|/g, '\\|');
      console.log(`| ${celda(f.requisito)} | ${celda(f.evidencia)} | ${f.resultado} |`);
    }
  } else {
    const anchoRequisito = 46;
    const anchoEvidencia = 84;
    const linea = `${'-'.repeat(anchoRequisito + 1)}+${'-'.repeat(anchoEvidencia + 2)}+${'-'.repeat(11)}`;
    console.log(`${'Requisito'.padEnd(anchoRequisito)} | ${'Evidencia'.padEnd(anchoEvidencia)} | Resultado`);
    console.log(linea);
    for (const f of filas) {
      const izquierda = ajustar(f.requisito, anchoRequisito);
      const derecha = ajustar(f.evidencia, anchoEvidencia);
      const lineas = Math.max(izquierda.length, derecha.length);
      for (let i = 0; i < lineas; i += 1) {
        const resultado = i === 0 ? f.resultado : '';
        console.log(`${(izquierda[i] || '').padEnd(anchoRequisito)} | ${(derecha[i] || '').padEnd(anchoEvidencia)} | ${resultado}`);
      }
    }
  }
  const cuenta = (r) => filas.filter((f) => f.resultado === r).length;
  console.log(`\nResumen: ${cuenta(OK)} OK, ${cuenta(AVISO)} aviso(s), ${cuenta(OMITIDO)} omitido(s), ${cuenta(FALLA)} falla(s).`);
  if (cuenta(AVISO)) {
    console.log('AVISO: la propuesta de conversión a 20 puntos de RUBRICA.md espera confirmación de la persona responsable del curso.');
  }
}

async function principal() {
  const seccion10 = seccion10DesdeDocx() || seccion10DesdeMarkdown();
  verificarRequisitos(seccion10);
  await verificarEjecucion();
  verificarRubrica(seccion10);
  verificarSecretos();
  verificarVariablesDeEntorno();
  verificarEnlaces();
  verificarEntrega();
  verificarPlantilla();
  imprimir();
  process.exitCode = filas.some((f) => f.resultado === FALLA) ? 1 : 0;
}

principal().catch((error) => {
  console.error('La verificación terminó con un error inesperado:', error);
  process.exitCode = 1;
});
