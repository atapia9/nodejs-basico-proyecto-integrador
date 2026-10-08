// Lectura de la configuración desde variables de entorno (Manual §5.2).
//
// dotenv carga el archivo .env hacia process.env y debe ejecutarse antes de leer
// cualquier variable. Este módulo es lo primero que carga src/index.js.
// quiet: true evita el mensaje informativo que dotenv 18 imprime al cargar.
require('dotenv').config({ quiet: true });

const path = require('node:path');

const config = {
  // Valor por defecto para desarrollo local (Manual §5.2: process.env.PORT || 3000).
  puerto: Number(process.env.PORT) || 3000,

  // Archivo de la base de datos SQLite. ':memory:' crea una base temporal (solo para pruebas).
  archivoBd:
    process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'biblioteca.sqlite'),

  // Si tiene valor, las rutas que modifican datos exigen el header x-api-key.
  apiKey: process.env.API_KEY || '',
};

// TODO [R4] Agrega aquí las variables de entorno que necesite tu proyecto.
// Regla del manual (§5.2 y §10): toda configuración sensible se lee de process.env y
// nunca se escribe en el código. Cada variable nueva también debe aparecer, sin valor,
// en .env.example.

module.exports = config;
