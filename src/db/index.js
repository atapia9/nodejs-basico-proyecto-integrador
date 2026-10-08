// Conexión y esquema de la base de datos (Manual §5.1, opción B: SQLite con better-sqlite3).
// SQLite guarda todo en un solo archivo y no necesita un servidor externo.
const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const config = require('../config');

function abrirBaseDeDatos(archivo) {
  // Crea la carpeta del archivo (por ejemplo data/) si todavía no existe.
  if (archivo !== ':memory:') {
    fs.mkdirSync(path.dirname(archivo), { recursive: true });
  }

  const db = new Database(archivo);

  // TODO [R3] Adapta el esquema a tu dominio: nombre de la tabla, columnas y restricciones.
  // SQLite no tiene tipo booleano: se guarda como INTEGER (0 o 1) y src/db/libros.js lo convierte.
  db.exec(`
    CREATE TABLE IF NOT EXISTS libros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      anio INTEGER,
      disponible INTEGER NOT NULL DEFAULT 1
    )
  `);

  return db;
}

module.exports = abrirBaseDeDatos(config.archivoBd);
