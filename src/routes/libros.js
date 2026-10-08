// Rutas del recurso «libros» (Manual §4.3, Fig. 4.2).
//
// | Método | Ruta         | Respuestas        |
// |--------|--------------|-------------------|
// | GET    | /libros      | 200               |
// | GET    | /libros/:id  | 200, 404          |
// | POST   | /libros      | 201, 400          |
// | PUT    | /libros/:id  | 200, 404          |
// | DELETE | /libros/:id  | 204               |
//
// Los manejadores son async (Manual §3.2). En Express 5, si una función async lanza un
// error o una promesa se rechaza, Express lo envía al middleware de errores
// (src/middlewares/errores.js) sin necesidad de try/catch ni next(err).
// Con Express 4 sí harían falta try/catch y next(err).
//
// TODO [R1] Sustituye «libros» por el recurso principal de tu dominio (archivo, rutas,
// nombres y campos) y registra la ruta nueva en src/app.js.
// TODO [R2] Verifica que tu recurso tenga las cinco operaciones del CRUD con los códigos
// de estado de la tabla anterior.
const { Router } = require('express');
const libros = require('../db/libros');
const validarLibro = require('../middlewares/validar-libro');
const requerirApiKey = require('../middlewares/api-key');

const router = Router();

// Convierte el parámetro de ruta en un entero; devuelve null si no es un número válido.
function leerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) ? id : null;
}

// GET /libros -> 200
// TODO [E3] Punto extra: paginación o filtros con req.query (Manual §4.3), por ejemplo
// GET /libros?pagina=1&limite=10 o GET /libros?autor=Borges.
router.get('/', async (req, res) => {
  res.json(await libros.listar());
});

// TODO [E2] Punto extra: vista EJS. Esta ruta debe declararse ANTES de '/:id'; si no,
// Express interpretaría «vista» como un id. Pasos en src/views/README.md.
//
// router.get('/vista', async (req, res) => {
//   res.render('libros', { libros: await libros.listar() });
// });

// GET /libros/:id -> 200 o 404
router.get('/:id', async (req, res) => {
  const id = leerId(req);
  const libro = id === null ? undefined : await libros.obtener(id);
  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }
  res.json(libro);
});

// POST /libros -> 201 o 400 (la validación ocurre en validarLibro)
router.post('/', requerirApiKey, validarLibro(), async (req, res) => {
  const libro = await libros.crear(req.body);
  res.status(201).json(libro);
});

// PUT /libros/:id -> 200 o 404
router.put('/:id', requerirApiKey, validarLibro({ parcial: true }), async (req, res) => {
  const id = leerId(req);
  const libro = id === null ? undefined : await libros.actualizar(id, req.body);
  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }
  res.json(libro);
});

// DELETE /libros/:id -> 204
// El manual (§4.3 y Fig. 4.2) solo contempla 204, incluso si el id no existe.
// TODO [R6] Decide si tu API debe responder 404 cuando el id no existe y, si lo cambias,
// actualiza también la tabla de endpoints del README y las pruebas.
router.delete('/:id', requerirApiKey, async (req, res) => {
  const id = leerId(req);
  if (id !== null) await libros.eliminar(id);
  res.status(204).send();
});

module.exports = router;
