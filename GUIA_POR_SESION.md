# Guía por sesión

La plantilla ya funciona desde el primer día: con un ejemplo de API de libros que guarda datos en SQLite. En cada sesión no empiezas desde cero; **lees, entiendes y adaptas** una parte más al dominio que elijas.

Las referencias «Manual §x.y» y «Ej. x.y» remiten a las secciones y ejercicios del manual del curso. Un resumen de lo que dice cada sección está en [docs/REQUISITOS_DEL_MANUAL.md](docs/REQUISITOS_DEL_MANUAL.md). Los ejercicios y las actividades de cada sesión (por ejemplo, `info-entorno.js` o `inventario.js`) se entregan aparte del proyecto, según indica el manual.

Las siglas R1 a R7 y E1 a E3 son las de [ESPECIFICACION.md](ESPECIFICACION.md).

## Sesión 1. Entorno y primer script (lunes 19 de octubre)

Manual §5: §1.2 Instalación y NVM, §1.3 REPL y ejecución de archivos, §1.4 objetos globales. Estas subsecciones no se resumen en `docs/REQUISITOS_DEL_MANUAL.md` porque el proyecto no las aplica directamente.

**Avances esperados del proyecto**

- [ ] Creaste tu repositorio a partir de la plantilla y lo clonaste.
- [ ] Instalaste Node.js 24 con NVM y compruebas `node -v` y `npm -v` (Ej. 1.2). Al ejecutar `nvm use` dentro del proyecto se lee `.nvmrc`.
- [ ] Ejecutaste `npm install` y `npm start`, y viste el mensaje del servidor en la terminal.
- [ ] Elegiste el dominio de tu proyecto y sus campos principales (R1) y los anotaste en la sección «Descripción» del README.
- [ ] Leíste `src/index.js` y `src/config/index.js` e identificaste dónde se usa `process`.

**Ejercicios del manual relacionados:** Ej. 1.2, Ej. 1.3 y el ejercicio integrador de la Sesión 1.

## Sesión 2. `npm init`, scripts y módulos (martes 20 de octubre)

Manual §6: [§2.1 NPM: package.json y scripts](docs/REQUISITOS_DEL_MANUAL.md#21-npm-packagejson-dependencias-y-scripts), §2.2 CommonJS y ES Modules, §2.3 módulos core (Path, FS y OS).

**Avances esperados del proyecto**

- [ ] Entiendes cada parte de `package.json`: `scripts`, `dependencies` y `devDependencies` (nodemon va en desarrollo).
- [ ] Ejecutaste `npm run dev` y comprobaste que nodemon reinicia el servidor al guardar un archivo.
- [ ] Cambiaste `name` y `description` en `package.json` por los de tu proyecto.
- [ ] Agregaste un script propio (Ej. 2.1).
- [ ] Reconoces que la plantilla usa CommonJS (`require` y `module.exports`) y que no se mezcla con `import` (§2.2).
- [ ] Ubicaste el uso de `path` en `src/config/index.js` y de `fs` en `src/db/index.js` (§2.3).

**Ejercicios del manual relacionados:** Ej. 2.1, Ej. 2.2 y el ejercicio integrador de la Sesión 2.

## Sesión 3. async/await (miércoles 21 de octubre)

Manual §7: [§3.2 Callbacks y promesas](docs/REQUISITOS_DEL_MANUAL.md#32-callbacks-y-promesas-asyncawait), §3.1 Event Loop, §3.3 EventEmitter, §3.4 Streams.

**Avances esperados del proyecto**

- [ ] Leíste `src/db/libros.js` y `src/routes/libros.js`: las funciones de datos son `async` y las rutas usan `await`.
- [ ] Sabes explicar por qué las rutas no necesitan `try/catch` en Express 5 y qué harías con Express 4 (`try/catch` y `next(err)`).
- [ ] Escribiste en tu proyecto al menos una función `async` con `await` y manejo de errores (Ej. 3.2).
- [ ] Provocaste un error a propósito (por ejemplo, `throw new Error('prueba')` en una ruta) y viste cómo responde la API.

EventEmitter y streams (§3.3 y §3.4) no se usan en el proyecto mínimo.

**Ejercicios del manual relacionados:** Ej. 3.1, Ej. 3.2, Ej. 3.3 y el ejercicio integrador de la Sesión 3.

## Sesión 4. Rutas, middleware y errores (jueves 22 de octubre)

Manual §8: [§4.2 Express y middleware](docs/REQUISITOS_DEL_MANUAL.md#42-introducción-a-express-y-middleware), [§4.3 Enrutamiento y API REST](docs/REQUISITOS_DEL_MANUAL.md#43-enrutamiento-verbos-http-y-parámetros), [§4.4 Plantillas frente a APIs](docs/REQUISITOS_DEL_MANUAL.md#44-motores-de-plantillas-frente-a-apis), §4.1 módulo HTTP.

**Avances esperados del proyecto**

- [ ] Sustituiste el ejemplo «libros» por el recurso de tu dominio, con las cinco rutas del CRUD (R1 y R2).
- [ ] Cada ruta devuelve los códigos de estado del manual: 200, 201, 204, 400 y 404 (R6).
- [ ] Tu proyecto tiene al menos un middleware propio (R5): ajustaste `logger.js`, `validar-libro.js` o `api-key.js`, o escribiste uno nuevo.
- [ ] El manejador de errores de cuatro parámetros sigue declarado al final de `src/app.js` (R6).
- [ ] Probaste todas las rutas con Postman, Thunder Client o `curl`, y documentaste método, URL, cuerpo y respuesta esperada.
- [ ] Ajustaste las pruebas de `test/` a tu recurso y `npm test` pasa.
- [ ] Opcional: vista EJS (E2) o filtros con `req.query` (E3).

**Ejercicios del manual relacionados:** Ej. 4.1, Ej. 4.2, Ej. 4.3 y el ejercicio integrador de la Sesión 4.

## Sesión 5. Base de datos, variables de entorno, depuración y despliegue (viernes 23 de octubre)

Manual §9: [§5.1 Bases de datos](docs/REQUISITOS_DEL_MANUAL.md#51-conexión-a-bases-de-datos-mongodb-mongoose-o-sqlite), [§5.2 dotenv](docs/REQUISITOS_DEL_MANUAL.md#52-variables-de-entorno-con-dotenv), [§5.3 Depuración](docs/REQUISITOS_DEL_MANUAL.md#53-debugging-herramientas-de-inspección), [§5.4 Despliegue](docs/REQUISITOS_DEL_MANUAL.md#54-introducción-al-despliegue).

**Avances esperados del proyecto**

- [ ] El esquema de la base de datos corresponde a tu dominio (R3) y los datos persisten tras reiniciar el servidor (Ej. 5.1).
- [ ] Toda configuración sensible sale de `process.env`; `.env` está en `.gitignore` y `.env.example` lista las variables sin valores (R4, Ej. 5.2).
- [ ] Depuraste una ruta con un breakpoint, en VS Code o con `node --inspect` (§5.3 y Ej. 5.3).
- [ ] Opcional: desplegaste la API siguiendo [docs/despliegue-render.md](docs/despliegue-render.md) (E1, Ej. 5.4).
- [ ] El README tiene instalación, variables de entorno, ejecución y endpoints de tu proyecto (R7).
- [ ] Revisaste [ENTREGA.md](ENTREGA.md) punto por punto.

El cierre de la sesión (12:20 a 13:00) es la «Evaluación final y entrega del proyecto integrador».

**Ejercicios del manual relacionados:** Ej. 5.1, Ej. 5.2, Ej. 5.3, Ej. 5.4 y la Actividad 5 (proyecto integrador).

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.
