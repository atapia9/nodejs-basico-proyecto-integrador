// Punto de arranque. La primera línea carga la configuración (y con ella dotenv) antes de
// cualquier otro módulo, como pide el Manual §5.2.
const config = require('./config');
const app = require('./app');
const { conectar } = require('./db');

async function iniciar() {
  // Primero se conecta a MongoDB y solo entonces se empieza a atender peticiones.
  await conectar();

  // En Express 5 el callback de listen también recibe los errores del servidor (por ejemplo,
  // puerto ocupado).
  app.listen(config.puerto, (error) => {
    if (error) {
      console.error('No se pudo iniciar el servidor:', error.message);
      process.exit(1);
    }
    console.log(`Servidor escuchando en http://localhost:${config.puerto}`);
  });
}

iniciar().catch((error) => {
  console.error('No se pudo iniciar la aplicación:', error.message);
  process.exit(1);
});
