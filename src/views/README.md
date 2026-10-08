# Vistas EJS (punto extra E2)

Esta carpeta solo se usa si activas el punto extra «Agregar una vista renderizada con EJS para al menos una de las rutas» (Manual §10 y §4.4). Por defecto está desactivado: la plantilla no instala `ejs` ni configura el motor de vistas.

`libros.ejs` es una plantilla de ejemplo que muestra los libros en una tabla y marca con otra clase CSS los que no están disponibles (el mismo patrón del ejercicio integrador de la Sesión 4).

## Cómo activarlo

1. Instala el motor de plantillas:

   ```bash
   npm install ejs
   ```

2. En `src/app.js`, agrega `const path = require('node:path');` y, antes de las rutas:

   ```js
   app.set('view engine', 'ejs');
   app.set('views', path.join(__dirname, 'views'));
   ```

3. En `src/routes/libros.js`, descomenta la ruta `GET /vista`. Debe quedar **antes** de `GET /:id`; si no, Express interpreta «vista» como un id.

4. Reinicia el servidor y abre `http://localhost:3000/libros/vista`.

5. Al adaptar la plantilla a tu dominio, cambia los campos de `libros.ejs` y el nombre de la vista.
