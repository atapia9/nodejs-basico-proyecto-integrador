// Configuración de la aplicación Express. Aquí NO se llama a listen(): el arranque está en
// src/index.js, así las pruebas pueden importar la app sin abrir el puerto 3000.
const express = require('express');
const logger = require('./middlewares/logger');
const { noEncontrada, manejadorDeErrores } = require('./middlewares/errores');
const rutasLibros = require('./routes/libros');

const app = express();

// 1. Middlewares generales. Se ejecutan en el orden en que se declaran (Manual §4.2, Fig. 4.1).
app.use(logger);
app.use(express.json()); // convierte el cuerpo JSON en req.body

// TODO [E2] Punto extra: para renderizar vistas con EJS (Manual §4.4), instala ejs y agrega
//   app.set('view engine', 'ejs');
//   app.set('views', path.join(__dirname, 'views'));   // con const path = require('node:path')
// Pasos completos en src/views/README.md.

// 2. Rutas.
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de la biblioteca', recursos: ['/libros'] });
});
app.use('/libros', rutasLibros);

// 3. Siempre al final: primero «ruta no encontrada» y por último el manejador de errores
// de cuatro parámetros (err, req, res, next).
app.use(noEncontrada);
app.use(manejadorDeErrores);

module.exports = app;
