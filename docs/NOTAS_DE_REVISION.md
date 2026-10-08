# Notas de revisión

Registro de ambigüedades, discrepancias y decisiones pendientes detectadas al leer el manual (Paso 0) y al consultar versiones. Cada nota indica qué dice la fuente, por qué importa, qué se propone y en qué estado está.

Estados: **Pendiente** (requiere decisión de la persona responsable del curso), **Informativo** (no requiere decisión) y **Resuelto**.

Fecha de la revisión: 7 de octubre de 2026.

## Discrepancias y ambigüedades del manual

### N1. Dos copias distintas del manual v3

- **Qué se encontró:** la copia de Descargas tiene las fechas «del 7 al 11 de septiembre» y la sede con calle; la copia del proyecto `nodejs-basico-redec-fesc` tiene «del 19 al 23 de octubre». El resto del texto es idéntico (se comparó párrafo por párrafo).
- **Decisión tomada:** se usa la copia de octubre, que coincide con el calendario del curso.
- **Estado:** Resuelto.

### N2. ¿Qué es la «evaluación final» de 20 puntos: el proyecto o el examen?

- **Manual §10:** «Este proyecto constituye la base de la evaluación final (20 puntos).»
- **Manual §3 y §9:** la evaluación final vale 20 puntos y el cierre de la Sesión 5 es «Evaluación final y entrega del proyecto integrador» (dos actividades).
- **Instrumento `Evaluacion_Diagnostica_Final_NodeJS.docx`:** examen de 10 reactivos, cada acierto vale 2 puntos, «máximo 20 puntos (rubro “Evaluación final” del curso)».
- **Por qué importa:** si el examen ya completa los 20 puntos, el proyecto no puede valer otros 20; si el proyecto es «la base», no está claro qué parte del puntaje corresponde al examen. `RUBRICA.md` necesita este dato para la conversión a 20 puntos.
- **Propuesta:** en `RUBRICA.md` reproducir solo los porcentajes del manual (40/25/20/15) y dejar la conversión a puntos como «propuesta» (por ejemplo 8, 5, 4 y 3 puntos si el proyecto vale 20), sin aplicarla hasta que se confirme.
- **Estado:** Pendiente.

### N3. Peso de los puntos extra

- **Manual §10:** lista tres puntos extra «opcionales» y no dice cuánto valen ni si se suman al 100 % del proyecto o a la calificación del curso.
- **Propuesta:** documentarlos como opcionales y sin puntaje hasta que se defina.
- **Estado:** Pendiente.

### N4. Fecha y medio de entrega

- **Manual §9 y §12:** la entrega ocurre al cierre de la Sesión 5 (12:20 a 13:00) y la Actividad 5 pide «el repositorio de tu API con README, base de datos, variables de entorno y, si es posible, la URL de despliegue». No dice a quién ni por qué canal se envía la URL, ni si hay prórroga.
- **Propuesta:** `ENTREGA.md` pide URL del repositorio y URL de despliegue (opcional) y remite a lo que indique el instructor para el canal y la fecha límite.
- **Estado:** Pendiente.

### N5. Equipos de hasta 3 personas

- **Manual §10:** admite equipos, pero no dice si la calificación es individual o grupal ni cómo se evidencia la aportación de cada integrante.
- **Propuesta:** `docs/trabajo-en-equipo.md` recomienda ramas y pull requests por integrante; el historial de commits sirve de evidencia, sin afirmar que se use para calificar.
- **Estado:** Pendiente.

### N6. DELETE de un id que no existe

- **Manual §4.3 y Fig. 4.2:** DELETE responde solo 204; el código de ejemplo responde 204 aunque el id no exista.
- **Por qué importa:** muchas guías responden 404 en ese caso, pero el manual no lo pide.
- **Propuesta:** seguir el manual literalmente (204 siempre) y dejar un TODO opcional que invite a decidir si se devuelve 404.
- **Estado:** Pendiente.

### N7. PUT con cuerpo inválido

- **Manual Fig. 4.2:** PUT responde 200 o 404; el Ej. 4.3 solo pide validar el POST.
- **Plantilla:** el PUT acepta cuerpos parciales y valida solo los campos que vienen; si un campo trae un tipo inválido responde 400 en lugar de un 500 de la base de datos. Es una desviación menor de la Fig. 4.2, que solo lista 200 y 404.
- **Estado:** Pendiente de confirmación.

### N8. `start` apunta a `src/index.js`, no a `index.js`

- **Manual §2.1 y §5.4 (paso 2):** `"start": "node index.js"` con el archivo en la raíz.
- **Plantilla:** el árbol pedido coloca el arranque en `src/index.js`, por lo que el script será `node src/index.js`. Es una adaptación de estructura, no un cambio de criterio. El README y `docs/despliegue-render.md` lo aclaran.
- **Estado:** Informativo.

### N9. Las pruebas automatizadas no forman parte de §10

- **Manual:** el script `test` aparece solo como marcador (`echo "Error: no hay pruebas configuradas"`); §10 no exige pruebas.
- **Plantilla:** incluye pruebas de la API de ejemplo y CI porque así se pidió, pero ni las pruebas ni el CI son criterio de evaluación del manual.
- **Estado:** Informativo.

### N10. Afirmaciones sobre planes gratuitos

- **Manual §5.4:** afirma que Render, Railway y Vercel tienen «planes gratuitos o de bajo costo»; la ficha 5.4 (§12) advierte que los planes gratuitos y la interfaz de Render cambian con frecuencia y que se verifique contra la documentación vigente.
- **Plantilla:** `docs/despliegue-render.md` no hace afirmaciones de planes ni precios y remite a la documentación vigente de la plataforma.
- **Estado:** Informativo.

### N11. Railway y Vercel no tienen guía paso a paso

- **Manual §5.4:** los seis pasos están redactados para Render; Railway se menciona junto con Render y Vercel se describe como plataforma de funciones serverless. La ficha 5.4 indica que Railway y Vercel no están cubiertos por el video de apoyo.
- **Propuesta:** documentar solo Render; en el README indicar que Railway y Vercel son válidas para el punto extra pero cada equipo sigue su documentación. Vercel requiere adaptar la app a funciones serverless, algo que el manual no desarrolla.
- **Estado:** Pendiente.

### N12. Ejercicio 5.3 depende de material del instructor

- **Manual Ej. 5.3:** el script con el error lo comparte el instructor; no está en el manual.
- **Propuesta:** la plantilla no inventa ese script; `GUIA_POR_SESION.md` enlaza el ejercicio y la configuración de depuración se prueba sobre el propio proyecto.
- **Estado:** Informativo.

### N22. Orden de las rutas en §4.3

En el manual, `GET /productos/:id` y `GET /productos/buscar` se muestran en dos bloques de código separados. Si un alumno los combina en un mismo archivo tal como están (primero `/:id`), Express interpreta «buscar» como un id y la búsqueda nunca se ejecuta. Lo mismo ocurre con la ruta `GET /tareas/vista` del ejercicio integrador de la Sesión 4. La plantilla lo advierte en `src/routes/libros.js` y en `src/views/README.md`.

- **Estado:** Informativo (sugerencia para el instructor).

## Versiones consultadas (7 de octubre de 2026)

Fuentes: `https://nodejs.org/dist/index.json`, calendario oficial `nodejs/Release` (`schedule.json`) y `npm view` contra el registro de npm. No se fijó ninguna versión de memoria.

### N13. Versión de Node.js

| Línea | Última versión | Estado según el calendario oficial |
|---|---|---|
| 22 («Jod») | 22.23.3 | LTS en mantenimiento; fin de soporte 30-abr-2027 |
| 24 («Krypton») | 24.21.0 | LTS activa; pasa a mantenimiento el 20-oct-2026 (durante el curso); fin de soporte 30-abr-2028 |
| 26 | 26.11.1 | Current; **entra a LTS el 28-oct-2026**, cinco días después del curso |

- **Manual §1.2:** el Ej. 1.2 pide «instala la versión LTS más reciente» y el ejemplo usa `nvm use 24`. El 19 de octubre, `nvm install --lts` instalará la 24.x.
- **Decisión tomada:** Node 24. `.nvmrc` con `24` y `engines.node >= 24` (también cubre `better-sqlite3`, que exige Node 22 o superior, y Mongoose, que exige 20.19 o superior).
- **Estado:** Resuelto.

### N14. Versiones de dependencias

| Paquete | Manual | Última en npm | Observación |
|---|---|---|---|
| express | `^4.19.2` | 5.2.1 (`latest`); 4.22.3 (`latest-4`) | Cambio de versión mayor, ver N15 |
| nodemon | `^3.1.0` | 3.1.14 | Misma versión mayor; compatible |
| dotenv | sin versión | 18.0.6 | Ver N16 |
| better-sqlite3 | sin versión | 13.0.3 (Node >= 22) | Ver N17 |
| mongoose | sin versión | 9.11.1 (Node >= 20.19) | Solo variante Mongoose |

- **Decisión tomada:** `express ^5.2.1`, `nodemon ^3.1.14`, `dotenv ^18.0.6`, `better-sqlite3 ^13.0.3` y, en la variante, `mongoose ^9.11.1`.
- **Estado:** Resuelto.

### N15. Express 5 frente al 4 del manual

`npm install express` instala hoy la versión 5. Cambios relevantes de la guía oficial de migración (`expressjs.com/en/guide/migrating-5.html`):

- Los rechazos de promesas y errores lanzados en funciones `async` se envían al middleware de errores sin escribir `try/catch` ni `next(err)`.
- `req.body` es `undefined` si no hay un parser (en Express 4 era `{}`); `express.json()` sigue siendo necesario.
- El comodín `*` en rutas debe llevar nombre (`/*splat`).
- `req.query` es de solo lectura y el parser por defecto pasa de «extended» a «simple».
- El callback de `app.listen` recibe los errores del servidor.

**Verificado:** el código de los ejemplos del manual (§4.2: `express.json()`, logger y ruta `/`; §4.3: GET, GET por id, POST, PUT, DELETE y búsqueda con `req.query`) se ejecutó sin cambios con Express 5.2.1 y devolvió los códigos esperados (200, 404, 201, 200, 404, 204 y 200).

- **Decisión tomada:** Express 5.2.1 (`^5.2.1`).
- **Estado:** Resuelto.

### N16. dotenv 18 imprime un mensaje al cargar

Con `require('dotenv').config()` la versión 18.0.6 escribe en consola `injected env (N) from .env`. Se suprime con `config({ quiet: true })`. El manual muestra la llamada sin opciones; la plantilla usa `quiet: true` en `src/config/` para que las salidas de las pruebas y del arranque queden limpias.

- **Estado:** Informativo.

### N17. better-sqlite3 13 y binarios precompilados

- Instalado en una carpeta temporal con Node 24.14.0 en macOS (arm64): 3 segundos, sin compilar, y una base en memoria respondió una consulta (SQLite 3.53.4).
- El paquete incluye `prebuilds/` para `darwin`, `linux`, `linuxmusl` y `win32` (x64 y arm64), por lo que no debería requerir herramientas de compilación en los equipos de los participantes.
- **Sin verificar:** Windows (no hay equipo disponible). La verificación en Linux queda cubierta por el CI de la plantilla. Se recomienda que el instructor pruebe `npm install` en un equipo Windows antes del curso.
- **Estado:** Informativo.

### N23. `npm audit` reporta 3 vulnerabilidades altas en `nodemon`

- **Qué se encontró (7 de octubre de 2026):** `npm audit` marca `braces` (aviso GHSA-vfj7-8cjw-p6xm, denegación de servicio por patrones anidados, publicado el 18 de septiembre de 2026), que llega por `nodemon` y `chokidar`. El aviso no tiene versión corregida (`braces` 3.0.3 es la última y está afectada).
- **Alcance:** solo dependencias de desarrollo. `npm audit --omit=dev` reporta 0 vulnerabilidades.
- **Riesgo para el curso:** `npm audit fix --force` «arregla» el aviso instalando `nodemon` 1.14.10, que es una versión mucho más antigua. El README advierte que no se ejecute ese comando.
- **Estado:** Informativo. Conviene revisar de nuevo antes del 19 de octubre.

### N24. El CI fija la imagen `ubuntu-24.04`

GitHub avisó el 8 de octubre de 2026 que la etiqueta `ubuntu-latest` migrará a Ubuntu 26 a partir del 19 de octubre, primer día del curso. Para que el CI no cambie de entorno durante la semana, `ci.yml` fija `ubuntu-24.04`. Más adelante habrá que actualizar esa versión; conviene revisarlo después del curso.

- **Estado:** Informativo.

### N25. La variante Mongoose se ejecutó solo en el CI

- **Qué se verificó:** las 21 pruebas de la rama `variante-mongoose` pasan en GitHub Actions contra un servicio `mongo:8`. En el equipo de desarrollo no había MongoDB ni Docker, así que allí solo se comprobaron el esquema, la serialización de `id`, la validación del modelo y los mensajes de error sin base de datos.
- **Qué no se ejecutó contra MongoDB:** el humo con `curl` y la persistencia tras reiniciar el servidor. `npm run verificar` lo hace si se define `MONGODB_URI` con una base de pruebas.
- **Recomendación:** antes del curso, ejecutar `MONGODB_URI=... npm run verificar` en la rama `variante-mongoose` con una base MongoDB de pruebas (local o en la nube).
- **Estado:** Pendiente.

### N26. Solución de referencia: el punto extra E1 no está realizado

El repositorio privado `nodejs-basico-proyecto-integrador-solucion` (catálogo de recetas) resuelve R1 a R7 y los puntos extra E2 (vista EJS) y E3 (filtros y paginación), con 27 pruebas. No está desplegada: E1 requiere una cuenta y un servicio propios. Usa SQLite; no incluye la variante Mongoose.

- **Estado:** Informativo.

## Decisiones de diseño que salen del prompt

### N18. La plantilla no versiona `.vscode/launch.json`

El árbol pedido no lo menciona y se decidió no incluirlo. La configuración de depuración del §5.3 se muestra en el README, como fragmento que cada alumno crea en su equipo, apuntando a `src/index.js`.

- **Estado:** Resuelto.

### N19. `fuentes/` no se versiona

El manual y la evaluación (esta incluye la clave de respuestas) son material del curso, no de la plantilla del alumno. `fuentes/` está en el `.gitignore`; la evaluación contiene la clave de respuestas y no debe llegar a los alumnos.

- **Estado:** Resuelto.

### N20. El README cumple dos funciones

La plantilla necesita explicar cómo usarla (para el alumno que la recibe) y, a la vez, §10 exige que el README del proyecto documente instalación, variables de entorno, ejecución y endpoints. Se propone un `README.md` con dos bloques: «Cómo usar esta plantilla» (se elimina al terminar) y «Documentación del proyecto» (se completa).

- **Estado:** Pendiente.

### N21. Nota de divulgación del uso de Claude

Los documentos generados incluyen una nota de divulgación. Línea sugerida para la portada del README: «Este material fue elaborado con asistencia de Claude (Anthropic) y revisado por [nombre].» Falta el nombre de la persona que lo revisa.

- **Estado:** Pendiente.

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic). Pendiente de revisión por la persona responsable del curso.
