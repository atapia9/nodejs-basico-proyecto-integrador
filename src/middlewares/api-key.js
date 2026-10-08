// Autenticación simple por API key (Manual §4.2, Ej. 4.2 y Fig. 4.1).
// Si la petición no trae el header x-api-key esperado responde 401 y NO llama a next().
//
// Solo se exige cuando la variable de entorno API_KEY tiene valor; si está vacía, las
// rutas quedan abiertas. La clave se lee en src/config/index.js y nunca se escribe aquí.
//
// TODO [R5] Si tu proyecto necesita proteger rutas, decide cuáles (por ejemplo, solo las
// que modifican datos, como en src/routes/libros.js) y recuerda que el orden importa:
// la autenticación debe ir antes de las rutas que protege.
const config = require('../config');

function requerirApiKey(req, res, next) {
  if (!config.apiKey) return next();

  if (req.get('x-api-key') !== config.apiKey) {
    return res.status(401).json({ error: 'API key inválida o ausente' });
  }
  next();
}

module.exports = requerirApiKey;
