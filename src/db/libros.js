// Capa de acceso a datos del recurso «libros».
//
// better-sqlite3 es síncrono, pero estas funciones se declaran async para que las rutas
// usen async/await (Manual §3.2) y no cambien si más adelante pasas a Mongoose, cuyas
// operaciones sí son asíncronas (rama variante-mongoose).
const db = require('./index');

// Convierte la fila de SQLite (disponible = 0 o 1) en el objeto que devuelve la API.
function aLibro(fila) {
  return fila && { ...fila, disponible: Boolean(fila.disponible) };
}

// Las consultas usan parámetros (? y @nombre): nunca concatenes datos del cliente en el SQL.
const sentencias = {
  listar: db.prepare('SELECT * FROM libros ORDER BY id'),
  obtener: db.prepare('SELECT * FROM libros WHERE id = ?'),
  crear: db.prepare(
    'INSERT INTO libros (titulo, autor, anio, disponible) VALUES (@titulo, @autor, @anio, @disponible)'
  ),
  actualizar: db.prepare(
    'UPDATE libros SET titulo = @titulo, autor = @autor, anio = @anio, disponible = @disponible WHERE id = @id'
  ),
  eliminar: db.prepare('DELETE FROM libros WHERE id = ?'),
};

// TODO [E3] Punto extra: paginación o filtros. Recibe aquí limite, desplazamiento o un
// filtro (por ejemplo autor) y agrégalo al SQL con parámetros; luego léelo de req.query en la ruta.
async function listar() {
  return sentencias.listar.all().map(aLibro);
}

async function obtener(id) {
  return aLibro(sentencias.obtener.get(id));
}

async function crear({ titulo, autor, anio = null, disponible = true }) {
  const resultado = sentencias.crear.run({
    titulo,
    autor,
    anio,
    disponible: disponible ? 1 : 0,
  });
  return obtener(Number(resultado.lastInsertRowid));
}

// Actualiza solo los campos recibidos; devuelve undefined si el libro no existe.
async function actualizar(id, cambios) {
  const actual = await obtener(id);
  if (!actual) return undefined;

  const nuevo = {
    id,
    titulo: cambios.titulo ?? actual.titulo,
    autor: cambios.autor ?? actual.autor,
    anio: cambios.anio ?? actual.anio,
    disponible: cambios.disponible ?? actual.disponible,
  };
  sentencias.actualizar.run({ ...nuevo, disponible: nuevo.disponible ? 1 : 0 });
  return obtener(id);
}

// Devuelve true si se eliminó un libro y false si no existía.
async function eliminar(id) {
  return sentencias.eliminar.run(id).changes > 0;
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
