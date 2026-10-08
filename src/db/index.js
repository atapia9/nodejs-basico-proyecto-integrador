// Conexión a la base de datos (Manual §5.1, opción A: MongoDB con Mongoose).
// El esquema y el modelo del recurso están en src/db/libros.js.
const mongoose = require('mongoose');
const config = require('../config');

async function conectar() {
  if (!config.mongodbUri) {
    throw new Error('Falta la variable de entorno MONGODB_URI (consulta .env.example).');
  }
  // Si MongoDB no responde en 5 segundos se lanza un error en lugar de esperar 30 s.
  await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 5000 });
  console.log('Conectado a MongoDB');
}

async function desconectar() {
  await mongoose.disconnect();
}

module.exports = { conectar, desconectar };
