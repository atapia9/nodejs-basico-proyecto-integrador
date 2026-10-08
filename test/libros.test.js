// Pruebas de la API con el ejecutor integrado de Node (node:test) y el fetch incorporado.
// Ejecuta: npm test
const { describe, it, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');

// Las pruebas necesitan una base MongoDB en marcha. Usan MONGODB_URI si está definida (por ejemplo,
// en el CI) y, si no, una base local llamada biblioteca_test: nunca la base de tu proyecto.
// ATENCIÓN: al empezar se borran todos los libros de esa base de pruebas.
// Estas variables deben definirse ANTES de cargar la app; dotenv no sobrescribe las que ya existen.
process.env.MONGODB_URI = process.env.MONGODB_URI_PRUEBAS || 'mongodb://127.0.0.1:27017/biblioteca_test';
process.env.API_KEY = '';

const app = require('../src/app');
const libros = require('../src/db/libros');
const { conectar, desconectar } = require('../src/db');

let servidor;
let base;

before(async () => {
  // Silencia el logger para que la salida de las pruebas sea legible.
  mock.method(console, 'log', () => {});
  await conectar();
  await libros.Libro.deleteMany({});
  await new Promise((resolver) => {
    servidor = app.listen(0, '127.0.0.1', resolver); // puerto 0: el sistema asigna uno libre
  });
  base = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  servidor.close();
  await desconectar();
  mock.restoreAll();
});

// Envía una petición y devuelve el código de estado y el cuerpo ya interpretado.
async function pedir(metodo, ruta, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo !== undefined) {
    opciones.headers['content-type'] = 'application/json';
    opciones.body = typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo);
  }
  const respuesta = await fetch(base + ruta, opciones);
  const texto = await respuesta.text();
  return { estado: respuesta.status, cuerpo: texto ? JSON.parse(texto) : undefined };
}

describe('GET /', () => {
  it('responde 200', async () => {
    const { estado } = await pedir('GET', '/');
    assert.equal(estado, 200);
  });
});

describe('GET /libros', () => {
  it('responde 200 con un arreglo', async () => {
    const { estado, cuerpo } = await pedir('GET', '/libros');
    assert.equal(estado, 200);
    assert.ok(Array.isArray(cuerpo));
  });
});

describe('POST /libros', () => {
  it('con datos válidos responde 201 y devuelve el libro creado', async () => {
    const { estado, cuerpo } = await pedir('POST', '/libros', {
      titulo: 'Pedro Páramo',
      autor: 'Juan Rulfo',
      anio: 1955,
    });
    assert.equal(estado, 201);
    assert.equal(cuerpo.titulo, 'Pedro Páramo');
    assert.equal(cuerpo.disponible, true);
    assert.ok(cuerpo.id !== undefined);
  });

  it('sin titulo responde 400 con un mensaje de error claro', async () => {
    const { estado, cuerpo } = await pedir('POST', '/libros', { autor: 'Juan Rulfo' });
    assert.equal(estado, 400);
    assert.match(cuerpo.detalles.join(' '), /titulo/);
  });

  it('sin cuerpo responde 400', async () => {
    const { estado } = await pedir('POST', '/libros');
    assert.equal(estado, 400);
  });

  it('con JSON mal formado responde 400 desde el manejador de errores', async () => {
    const { estado, cuerpo } = await pedir('POST', '/libros', '{"titulo": ');
    assert.equal(estado, 400);
    assert.ok(cuerpo.error);
  });
});

describe('GET /libros/:id', () => {
  it('responde 200 si el libro existe', async () => {
    const { cuerpo: creado } = await pedir('POST', '/libros', { titulo: 'Rayuela', autor: 'Julio Cortázar' });
    const { estado, cuerpo } = await pedir('GET', `/libros/${creado.id}`);
    assert.equal(estado, 200);
    assert.equal(cuerpo.titulo, 'Rayuela');
  });

  it('responde 404 si el libro no existe', async () => {
    const { estado } = await pedir('GET', '/libros/000000000000000000000000');
    assert.equal(estado, 404);
  });

  it('responde 404 si el id no tiene formato de ObjectId', async () => {
    const { estado } = await pedir('GET', '/libros/abc');
    assert.equal(estado, 404);
  });
});

describe('PUT /libros/:id', () => {
  it('responde 200 y devuelve el libro actualizado', async () => {
    const { cuerpo: creado } = await pedir('POST', '/libros', { titulo: 'Ficciones', autor: 'Jorge Luis Borges' });
    const { estado, cuerpo } = await pedir('PUT', `/libros/${creado.id}`, { disponible: false });
    assert.equal(estado, 200);
    assert.equal(cuerpo.disponible, false);
    assert.equal(cuerpo.titulo, 'Ficciones'); // los campos no enviados se conservan
  });

  it('responde 404 si el libro no existe', async () => {
    const { estado } = await pedir('PUT', '/libros/000000000000000000000000', { titulo: 'Nada' });
    assert.equal(estado, 404);
  });

  it('responde 400 si el cuerpo trae un tipo inválido', async () => {
    const { cuerpo: creado } = await pedir('POST', '/libros', { titulo: 'El Aleph', autor: 'Jorge Luis Borges' });
    const { estado } = await pedir('PUT', `/libros/${creado.id}`, { anio: 'mil novecientos' });
    assert.equal(estado, 400);
  });
});

describe('DELETE /libros/:id', () => {
  it('responde 204 y el libro deja de existir', async () => {
    const { cuerpo: creado } = await pedir('POST', '/libros', { titulo: 'Temporal', autor: 'Anónimo' });
    const eliminado = await pedir('DELETE', `/libros/${creado.id}`);
    assert.equal(eliminado.estado, 204);
    assert.equal(eliminado.cuerpo, undefined);

    const consulta = await pedir('GET', `/libros/${creado.id}`);
    assert.equal(consulta.estado, 404);
  });

  // El manual (§4.3 y Fig. 4.2) solo contempla 204. Si decides responder 404 cuando el id
  // no existe (TODO [R6] en src/routes/libros.js), cambia también esta prueba.
  it('responde 204 aunque el id no exista (como en el manual)', async () => {
    const { estado } = await pedir('DELETE', '/libros/000000000000000000000000');
    assert.equal(estado, 204);
  });
});

describe('Rutas desconocidas y errores internos', () => {
  it('una ruta que no existe responde 404 en JSON', async () => {
    const { estado, cuerpo } = await pedir('GET', '/no-existe');
    assert.equal(estado, 404);
    assert.ok(cuerpo.error);
  });

  it('un error inesperado responde 500 sin exponer el detalle interno', async () => {
    mock.method(console, 'error', () => {});
    mock.method(libros, 'listar', async () => {
      throw new Error('fallo simulado de la base de datos');
    });

    const { estado, cuerpo } = await pedir('GET', '/libros');
    assert.equal(estado, 500);
    assert.equal(cuerpo.error, 'Error interno del servidor');

    libros.listar.mock.restore();
    console.error.mock.restore();
  });
});
