// Middleware de validación del cuerpo de la petición (Manual §4.3, Ej. 4.3).
// Si el cuerpo no es válido responde 400 con un mensaje claro y NO llama a next().
//
// TODO [R5] Adapta las reglas a los campos de tu dominio.
// TODO [R6] Los mensajes de error deben ayudar a quien consume la API a corregir su petición.

function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// parcial = false (POST): titulo y autor son obligatorios.
// parcial = true (PUT): solo se validan los campos que vengan en el cuerpo.
function validarLibro({ parcial = false } = {}) {
  return (req, res, next) => {
    // En Express 5, req.body es undefined si la petición no trae cuerpo JSON.
    const { titulo, autor, anio, disponible } = req.body ?? {};
    const errores = [];

    if (!parcial || titulo !== undefined) {
      if (!esTextoNoVacio(titulo)) errores.push('titulo es obligatorio y debe ser un texto no vacío');
    }
    if (!parcial || autor !== undefined) {
      if (!esTextoNoVacio(autor)) errores.push('autor es obligatorio y debe ser un texto no vacío');
    }
    if (anio !== undefined && !Number.isInteger(anio)) {
      errores.push('anio debe ser un número entero');
    }
    if (disponible !== undefined && typeof disponible !== 'boolean') {
      errores.push('disponible debe ser true o false');
    }

    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }
    next();
  };
}

module.exports = validarLibro;
