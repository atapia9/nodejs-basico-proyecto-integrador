// Manejo de errores centralizado (Manual §4.2, Fig. 4.1, y ejercicio integrador de la Sesión 4).
//
// Ambos middlewares se declaran AL FINAL de src/app.js, después de todas las rutas.

// Se ejecuta cuando ninguna ruta atendió la petición.
function noEncontrada(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// Un middleware de errores se reconoce porque declara CUATRO parámetros (err, req, res, next),
// aunque no use next. Express lo invoca cuando una ruta lanza una excepción, cuando una
// promesa rechazada llega desde una función async (Express 5) o cuando se llama a next(err).
//
// TODO [R6] Maneja aquí los errores propios de tu proyecto (por ejemplo, un error de la base
// de datos) y devuelve el código de estado HTTP apropiado en cada caso.
function manejadorDeErrores(err, req, res, next) {
  // Si la respuesta ya empezó a enviarse, Express debe cerrar la conexión.
  if (res.headersSent) return next(err);

  // Los errores del parser de JSON (cuerpo mal formado) traen status 400. Los de validación del
  // esquema de Mongoose (ValidationError) también son un error del cliente: 400.
  let estado = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (err.name === 'ValidationError') estado = 400;

  if (estado >= 500) console.error(err);

  // En errores 500 no se expone el detalle interno al cliente.
  res.status(estado).json({
    error: estado >= 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = { noEncontrada, manejadorDeErrores };
