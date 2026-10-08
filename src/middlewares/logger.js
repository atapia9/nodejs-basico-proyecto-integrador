// Middleware de registro de peticiones (Manual §4.2 y Ej. 4.2).
// Imprime fecha, método, URL, código de estado y el tiempo que tardó la respuesta.
//
// TODO [R5] Este es un middleware personalizado de ejemplo. El proyecto debe incluir al
// menos uno propio (logging, validación o autenticación simple): puedes ajustar este,
// el de validación (validar-libro.js) o el de API key (api-key.js), o escribir uno nuevo.
function logger(req, res, next) {
  const inicio = process.hrtime.bigint();

  // 'finish' se emite cuando la respuesta ya se envió, así que aquí conocemos el estado final.
  res.on('finish', () => {
    const milisegundos = Number(process.hrtime.bigint() - inicio) / 1e6;
    const marca = new Date().toISOString();
    console.log(
      `[${marca}] ${req.method} ${req.originalUrl} ${res.statusCode} ${milisegundos.toFixed(1)} ms`
    );
  });

  next(); // IMPORTANTE: cede el control al siguiente middleware o ruta (Manual §4.2).
}

module.exports = logger;
