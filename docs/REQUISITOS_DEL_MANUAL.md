# Requisitos extraídos del manual

Fuente única de verdad: `fuentes/Manual_NodeJS_Basico_ilustrado_v3.docx` («Manual del curso Node.js Básico», REDEC · UNAM FES Cuautitlán, Educación Continua FESC; sesiones del 19 al 23 de octubre de 2026).

Este documento resume lo que el manual pide al proyecto integrador, sin interpretar más allá del texto.

**Convención de citas.** El manual numera sus secciones principales del 1 al 12 (por ejemplo, «§10 Proyecto integrador final») y numera las subsecciones de cada sesión con el número de la sesión: «§2.1» es la subsección 2.1 (Sesión 2, NPM). «Ej. 4.3» es el ejercicio 4.3 y «Fig. 4.2» es la figura 4.2.

## 1. Proyecto integrador final (§10)

### Descripción general

> Como cierre del curso, cada participante (o equipo de hasta 3 personas) desarrollará una API REST completa que integre los temas de las cinco sesiones. Este proyecto constituye la base de la evaluación final (20 puntos).

### Especificación mínima

| N.º | Requisito (texto del manual, §10) |
|---|---|
| 1 | Elegir un dominio propio: por ejemplo, gestión de una biblioteca, control de gastos personales, catálogo de recetas, seguimiento de hábitos, etc. |
| 2 | Definir al menos un recurso principal con operaciones CRUD completas (GET, GET por id, POST, PUT, DELETE). |
| 3 | Persistir los datos en MongoDB o SQLite (no se acepta almacenamiento únicamente en memoria). |
| 4 | Usar variables de entorno (dotenv) para toda configuración sensible. |
| 5 | Incluir al menos un middleware personalizado (logging, validación o autenticación simple). |
| 6 | Manejar errores de forma centralizada y devolver códigos de estado HTTP apropiados. |
| 7 | Documentar en un archivo README.md cómo instalar dependencias, configurar variables de entorno y ejecutar el proyecto, junto con la lista de endpoints disponibles. |

### Puntos extra (opcionales)

| N.º | Punto extra (texto del manual, §10) |
|---|---|
| E1 | Desplegar la API en Render, Railway o Vercel y compartir la URL pública. |
| E2 | Agregar una vista renderizada con EJS para al menos una de las rutas. |
| E3 | Incluir paginación o filtros mediante query params en el endpoint de listado. |

El manual no indica cuántos puntos vale cada punto extra.

### Criterios de evaluación del proyecto

| Criterio (texto del manual, §10) | Peso |
|---|---|
| Funcionalidad CRUD completa | 40 % |
| Persistencia y configuración (BD + variables de entorno) | 25 % |
| Calidad del código (organización, manejo de errores, middleware) | 20 % |
| Documentación (README y claridad de instrucciones) | 15 % |
| **Total** | **100 %** |

## 2. Secciones que el proyecto debe aplicar

Para cada sección se anota lo que el manual dice, el ejercicio asociado y dónde lo aplica la plantilla.

### §2.1 NPM: package.json, dependencias y scripts

- Comandos que muestra el manual: `npm init`, `npm init -y`, `npm install express`, `npm install --save-dev nodemon`, `npm uninstall express`.
- Ejemplo de `package.json`: `scripts` con `start` (`node index.js`), `dev` (`nodemon index.js`) y `test`; `dependencies` con `express`; `devDependencies` con `nodemon`.
- «Los scripts se ejecutan con `npm run <nombre>` (`start` y `test` tienen atajos: `npm start` y `npm test`).» `package-lock.json` fija las versiones exactas y no debe editarse manualmente.
- **Ej. 2.1:** inicializar con `npm init -y`, instalar nodemon como dependencia de desarrollo, crear `npm run dev` con nodemon y un script personalizado.
- **En la plantilla:** `package.json` con `start`, `dev` (nodemon) y `test`; `nodemon` solo en `devDependencies`.

### §3.2 Callbacks y promesas (async/await)

- Callback hell frente a promesas y `async/await`; manejo de errores con `try/catch`; `Promise.all` para tareas en paralelo.
- **Ej. 3.2:** convertir un callback a `Promise`, consumirla con `await` y `try/catch`, y ejecutar tres funciones con `Promise.all` midiendo el tiempo con `console.time`.
- **En la plantilla:** los manejadores de ruta que consultan la base de datos usan `async/await` con `try/catch` o delegan el error al manejador central.

### §4.2 Introducción a Express y middleware

- Un middleware es una función con acceso a `req`, `res` y `next()`. Se ejecutan en el orden en que se declaran con `app.use()`.
- «Un middleware que no llama a `next()` (y tampoco envía una respuesta) deja la petición “colgada”.»
- Ejemplos del manual: `express.json()` y un logger que imprime fecha, método y URL.
- **Fig. 4.1** (canal de middlewares): logger, `express.json()`, autenticación con API key (responde 401 y no llama a `next()` si falla), ruta final y, al final de todo, el middleware de errores con cuatro parámetros.
- **Ej. 4.2:** medir el tiempo de cada petición y escribir un middleware de API key que responda 401 si falta el header `x-api-key` con el valor esperado.
- **En la plantilla:** logger, validación y/o API key en `src/middlewares/`; el middleware de errores se declara al final de `src/app.js`.

### §4.3 Enrutamiento: verbos HTTP y parámetros

- GET (leer), POST (crear), PUT (actualizar) y DELETE (eliminar); `req.params` para parámetros de ruta, `req.body` para el JSON enviado y `req.query` para parámetros de consulta.
- **Fig. 4.2** (recurso `/tareas`, campos `id: número`, `titulo: texto`, `completada: booleano`):

| Método | Ruta | Respuestas |
|---|---|---|
| GET | `/tareas` | 200 OK |
| GET | `/tareas/:id` | 200 OK, 404 Not Found |
| POST | `/tareas` | 201 Created, 400 Bad Request |
| PUT | `/tareas/:id` | 200 OK, 404 Not Found |
| DELETE | `/tareas/:id` | 204 No Content |

- **Ej. 4.3:** API REST completa de «tareas»; si el POST no incluye `titulo`, responder 400 con un mensaje de error claro; probar las rutas con Postman o Thunder Client documentando método, URL, cuerpo y respuesta esperada.
- **En la plantilla:** `src/routes/` implementa el CRUD con estos códigos de estado.

### §4.4 Motores de plantillas frente a APIs

- Express puede renderizar HTML con un motor de plantillas (EJS) o exponer una API que devuelve JSON.
- Configuración que muestra el manual: `npm install ejs`, `app.set('view engine', 'ejs')`, `app.set('views', './views')`, `res.render('reporte', { productos })`.
- **Ejercicio integrador de la Sesión 4:** ruta `GET /tareas/vista` que renderiza una tabla HTML, con una clase CSS distinta para las tareas completadas; como reto, middleware de errores de 4 argumentos `(err, req, res, next)` al final de la cadena.
- **En la plantilla:** la vista EJS es el punto extra E2 y está desactivada por defecto (`src/views/`).

### §5.1 Conexión a bases de datos: MongoDB (Mongoose) o SQLite

- Dos opciones: MongoDB con Mongoose (`npm install mongoose`, `mongoose.connect(process.env.MONGODB_URI)`, `Schema` y `Model`) o SQLite con `better-sqlite3` (`npm install better-sqlite3`, `new Database('datos.sqlite')`, `db.exec('CREATE TABLE IF NOT EXISTS ...')`, `db.prepare(...).run()/.all()`).
- **Ej. 5.1:** conectar la API de tareas, sustituir el arreglo en memoria por operaciones reales en GET, POST, PUT y DELETE, y confirmar que los datos persisten tras reiniciar el servidor.
- **En la plantilla:** `src/db/` contiene la conexión y el esquema de la variante elegida.

### §5.2 Variables de entorno con dotenv

- Las credenciales no se escriben en el código ni se suben al repositorio. `npm install dotenv`; `require('dotenv').config()` como primera línea del archivo principal; `const PUERTO = process.env.PORT || 3000`.
- `.gitignore` con `node_modules/` y `.env`. «Es buena práctica incluir un archivo `.env.example` con las variables necesarias pero sin valores reales.»
- **Ej. 5.2:** crear `.env` con al menos `PORT` y la cadena de conexión, leer toda la configuración sensible desde `process.env`, agregar `.env` al `.gitignore` y crear `.env.example`.
- **En la plantilla:** `src/config/` lee las variables; `.env.example` versionado; `.env` ignorado.

### §5.3 Debugging: herramientas de inspección

- `node --inspect index.js` y `node --inspect-brk index.js`; `chrome://inspect`; configuración `.vscode/launch.json` con `"type": "node"`, `"request": "launch"` y `"program": "${workspaceFolder}/index.js"`.
- Breakpoints, panel de variables, consola de depuración y stack de llamadas.
- **Ej. 5.3:** depurar un script con un error que entrega el instructor y documentar la causa raíz.
- **En la plantilla:** guía de depuración en el README y configuración de VS Code apuntando a `src/index.js`.

### §5.4 Introducción al despliegue

Pasos generales para desplegar una API Express en Render (texto del manual):

1. Subir el proyecto a un repositorio de GitHub, asegurando que `.env` y `node_modules` estén en `.gitignore`.
2. Verificar que `package.json` tenga un script `start` que ejecute la app: `"start": "node index.js"`.
3. Crear un nuevo «Web Service» en Render y conectarlo al repositorio.
4. Configurar las variables de entorno (`MONGODB_URI`, etc.) desde el panel de Render, no en el código.
5. Definir el comando de build (`npm install`) y de arranque (`npm start`).
6. Desplegar y verificar los logs; probar los endpoints con la URL pública asignada.

- Render y Railway se conectan a GitHub y despliegan en cada push; Vercel ejecuta funciones serverless y no mantiene un proceso permanente.
- **Ej. 5.4:** subir el proyecto a GitHub, desplegar en Render o Railway con la base de datos conectada, configurar variables desde el panel y verificar la URL pública.
- **En la plantilla:** `docs/despliegue-render.md` reproduce estos seis pasos.

## 3. El ejemplo de la API de «tareas»

El manual construye una API de tareas a lo largo de las sesiones 4 y 5. Es el dominio de los ejercicios de clase; la plantilla usa «biblioteca» para no coincidir con él.

| Dónde | Qué define |
|---|---|
| Fig. 4.2 | Recurso `/tareas` con `id` (número), `titulo` (texto) y `completada` (booleano); rutas y códigos de estado de la tabla anterior. |
| Ej. 4.3 | CRUD completo con `GET /tareas`, `GET /tareas/:id`, `POST /tareas`, `PUT /tareas/:id`, `DELETE /tareas/:id`; el POST sin `titulo` responde 400. |
| Ejercicio integrador S4 | `GET /tareas/vista` con EJS; manejo centralizado de errores como reto. |
| §5.1 (Mongoose) | Esquema con `titulo` (`String`, requerido), `completada` (`Boolean`, por defecto `false`) y `creadaEn` (`Date`, por defecto `Date.now`). |
| §5.1 (SQLite) | Tabla `tareas` con `id INTEGER PRIMARY KEY AUTOINCREMENT`, `titulo TEXT NOT NULL` y `completada INTEGER DEFAULT 0`. |
| Ej. 5.1, 5.2, 5.4 | Persistir la API, externalizar la configuración y desplegarla. |

## 4. Datos del curso que afectan la entrega

- Curso presencial de 20 horas, cinco sesiones de cuatro horas, del 19 al 23 de octubre de 2026, de 09:00 a 13:00 hrs (portada y §5 a §9).
- Cierre de la Sesión 5 (12:20 a 13:00): «Evaluación final y entrega del proyecto integrador» (§9).
- Actividad 5 (§12): «entrega el repositorio de tu API con README, base de datos, variables de entorno y, si es posible, la URL de despliegue.»
- Requisitos previos (§4): cuenta de GitHub recomendable «para el proyecto integrador y control de versiones».

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.
