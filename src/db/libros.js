// Esquema, modelo y capa de acceso a datos del recurso «libros» con Mongoose (Manual §5.1).
//
// Las funciones tienen la misma forma que en la rama principal (SQLite): son async y devuelven
// el libro, undefined o null si no existe, y un booleano al eliminar. Por eso las rutas apenas
// cambian entre las dos variantes.
const mongoose = require('mongoose');

// TODO [R3] Adapta el esquema a tu dominio: el Schema define los campos, sus tipos y sus
// validaciones; el Model, creado a partir de él, ofrece create(), find(), etc.
const libroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    autor: { type: String, required: true, trim: true },
    anio: { type: Number, default: null },
    disponible: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    toJSON: {
      // MongoDB usa _id (un ObjectId); la API expone un campo id de tipo texto.
      transform: (documento, resultado) => {
        const { _id, ...resto } = resultado;
        return { id: _id.toString(), ...resto };
      },
    },
  }
);

const Libro = mongoose.model('Libro', libroSchema);

const CAMPOS = ['titulo', 'autor', 'anio', 'disponible'];

// Se queda solo con los campos del esquema que vengan definidos en la petición.
function soloCampos(datos) {
  return Object.fromEntries(CAMPOS.filter((c) => datos[c] !== undefined).map((c) => [c, datos[c]]));
}

// TODO [E3] Punto extra: paginación o filtros. Recibe aquí pagina, limite o un filtro
// (por ejemplo autor) y úsalo con .find(filtro).skip(...).limit(...); luego léelo de req.query en la ruta.
async function listar() {
  return Libro.find().sort({ _id: 1 });
}

async function obtener(id) {
  return Libro.findById(id);
}

async function crear(datos) {
  return Libro.create(soloCampos(datos));
}

// Actualiza solo los campos recibidos; devuelve null si el libro no existe.
async function actualizar(id, cambios) {
  return Libro.findByIdAndUpdate(id, soloCampos(cambios), { returnDocument: 'after', runValidators: true });
}

// Devuelve true si se eliminó un libro y false si no existía.
async function eliminar(id) {
  return Boolean(await Libro.findByIdAndDelete(id));
}

module.exports = { Libro, listar, obtener, crear, actualizar, eliminar };
