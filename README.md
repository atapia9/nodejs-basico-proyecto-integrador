# Proyecto integrador final · Node.js Básico

Plantilla (starter) del proyecto integrador final del curso **Node.js Básico**, REDEC-UNAM / Educación Continua FESC, del 19 al 23 de octubre de 2026. El proyecto lo desarrolla cada participante, o un equipo de hasta 3 personas, y es la base de la evaluación final (manual, sección 10).

La plantilla incluye una API de ejemplo mínima y funcional sobre el recurso «libros», con Express y **MongoDB (Mongoose)**. Esta es la rama `variante-mongoose`; la rama `main` es la misma API con SQLite. **No es la solución**: es el punto de partida que debes reemplazar por tu propio dominio.

> Este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.

Este README tiene dos partes:

- **Parte A. Cómo usar esta plantilla.** Es una guía para empezar. Bórrala cuando termines.
- **Parte B. Documentación del proyecto.** Es el README de tu proyecto: complétala con tus datos (requisito R7).

| Documento | Para qué sirve |
|---|---|
| [ESPECIFICACION.md](ESPECIFICACION.md) | Qué debe cumplir tu proyecto (sección 10 del manual). |
| [RUBRICA.md](RUBRICA.md) | Cómo se evalúa. |
| [GUIA_POR_SESION.md](GUIA_POR_SESION.md) | Qué avanzar al terminar cada una de las 5 sesiones. |
| [ENTREGA.md](ENTREGA.md) | Lista de verificación antes de entregar. |
| [docs/despliegue-render.md](docs/despliegue-render.md) | Pasos para desplegar en Render (punto extra). |
| [docs/trabajo-en-equipo.md](docs/trabajo-en-equipo.md) | Ramas y pull requests para equipos de hasta 3 personas. |

---

## Parte A. Cómo usar esta plantilla

### 1. Crea tu repositorio

1. En GitHub, abre esta plantilla y pulsa **Use this template** y luego **Create a new repository**. Si el botón no aparece, pídele al instructor que active la opción de plantilla.
2. Ponle el nombre de tu proyecto. El repositorio puede ser público o privado (manual, Ej. 5.4).
3. Clónalo en tu equipo:

   ```bash
   git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   cd TU-REPOSITORIO
   ```

### 2. Prepara el entorno

Necesitas **Node.js 24** (la versión LTS que instalan en la Sesión 1), npm, Git y una **base de datos MongoDB**: instalada en tu equipo o en un servicio en la nube. Con NVM:

```bash
nvm install 24
nvm use
node -v
```

`nvm use` lee el archivo `.nvmrc` de la plantilla. En Windows con nvm-windows usa `nvm use 24`.

### 3. Instala, configura y ejecuta

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows (cmd) copia el archivo con `copy .env.example .env`. Antes de arrancar, abre `.env` y escribe en `MONGODB_URI` la cadena de conexión de tu base de datos, por ejemplo `mongodb://127.0.0.1:27017/biblioteca` para una base local. Con el servidor en marcha, <http://localhost:3000/libros> muestra una lista vacía. `npm test` ejecuta las pruebas (necesitan MongoDB, ver «Pruebas»).

> **Aviso sobre `npm audit`.** Al instalar, npm puede mostrar «3 high severity vulnerabilities» en `nodemon`. Es un aviso de una dependencia de desarrollo sin versión corregida y no afecta a la API en ejecución. **No ejecutes `npm audit fix --force`**: instalaría una versión de `nodemon` de hace años y rompería `npm run dev`.

### 4. Reemplaza el ejemplo por tu dominio

El código marca con `TODO [R#]` los lugares donde debes completar o adaptar algo. Busca el texto `TODO [` en tu editor (en VS Code, **Ctrl+Mayús+F** o **Cmd+Mayús+F**):

| Marca | Qué debes hacer | Archivo |
|---|---|---|
| `TODO [R1]` | Elegir tu dominio y sustituir «libros» | `src/routes/libros.js` |
| `TODO [R2]` | Completar el CRUD de tu recurso | `src/routes/libros.js` |
| `TODO [R3]` | Adaptar el esquema de la base de datos | `src/db/index.js` |
| `TODO [R4]` | Agregar tus variables de entorno | `src/config/index.js` |
| `TODO [R5]` | Tener al menos un middleware propio | `src/middlewares/` |
| `TODO [R6]` | Manejar errores y códigos de estado | `src/middlewares/errores.js` |
| `TODO [R7]` | Completar este README | `README.md` |
| `TODO [E1]`, `[E2]`, `[E3]` | Puntos extra (opcionales) | ver [ESPECIFICACION.md](ESPECIFICACION.md) |

### 5. Sigue la guía por sesión

[GUIA_POR_SESION.md](GUIA_POR_SESION.md) indica qué avanzar al terminar cada sesión y qué ejercicios del manual se relacionan.

### 6. Variante con SQLite

Esta rama usa **MongoDB y Mongoose** (manual §5.1, opción A). La rama `main` es la misma API con **SQLite** (opción B), que no necesita ningún servicio externo. Si prefieres SQLite, al crear tu repositorio desde la plantilla marca la opción **Include all branches** y cambia a esa rama con `git switch main`.

### 7. Cuando termines

Elimina esta Parte A, completa la Parte B y revisa [ENTREGA.md](ENTREGA.md).

---

## Parte B. Documentación del proyecto

TODO [R7] Completa esta parte con los datos de tu proyecto. El manual pide documentar cómo instalar dependencias, configurar variables de entorno y ejecutar el proyecto, junto con la lista de endpoints disponibles.

### Descripción

TODO [R7] Escribe aquí de qué trata tu API, cuál es tu dominio y quiénes la desarrollaron.

Ejemplo de la plantilla: API de una biblioteca con el recurso `libros` (`id`, `titulo`, `autor`, `anio`, `disponible`).

### Requisitos

- Node.js 24 o superior (`.nvmrc` indica la versión) y npm.
- Una base de datos MongoDB y su cadena de conexión.
- Git.
- Una herramienta para probar la API: Postman, Thunder Client (extensión de VS Code) o `curl`.

### Instalación

```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO
npm install
```

### Variables de entorno

Copia `.env.example` como `.env` y completa los valores. `.env` está en `.gitignore` y nunca se sube al repositorio.

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto en el que escucha el servidor | `3000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB. Es obligatoria y contiene credenciales: nunca la subas a Git | ninguno |
| `API_KEY` | Si tiene valor, `POST`, `PUT` y `DELETE` exigen el header `x-api-key` con ese valor | vacía (sin autenticación) |

TODO [R4] Actualiza esta tabla con las variables de tu proyecto.

### Ejecución

| Comando | Qué hace |
|---|---|
| `npm start` | Arranca el servidor con Node (`node src/index.js`). |
| `npm run dev` | Arranca el servidor con nodemon, que lo reinicia al guardar cambios. |
| `npm test` | Ejecuta las pruebas con el ejecutor integrado de Node. |

### Endpoints

TODO [R7] Sustituye esta tabla por los endpoints de tu proyecto.

| Método | Ruta | Descripción | Cuerpo (JSON) | Respuestas |
|---|---|---|---|---|
| GET | `/` | Mensaje de bienvenida | | 200 |
| GET | `/libros` | Lista todos los libros | | 200 |
| GET | `/libros/:id` | Obtiene un libro por su id (un ObjectId de 24 caracteres hexadecimales) | | 200, 404 |
| POST | `/libros` | Crea un libro | `{ "titulo": "...", "autor": "...", "anio": 1955, "disponible": true }` (`titulo` y `autor` obligatorios) | 201, 400, 401 |
| PUT | `/libros/:id` | Actualiza los campos enviados | cualquiera de los campos anteriores | 200, 400, 401, 404 |
| DELETE | `/libros/:id` | Elimina un libro | | 204, 401 |

El código 401 solo aparece si `API_KEY` tiene valor.

Ejemplos con `curl` (con el servidor en `http://localhost:3000`):

```bash
curl http://localhost:3000/libros

curl -X POST http://localhost:3000/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Pedro Páramo","autor":"Juan Rulfo","anio":1955}'

# Usa el campo id que devolvió el POST
curl -X PUT http://localhost:3000/libros/ID_DEL_LIBRO \
  -H "Content-Type: application/json" \
  -d '{"disponible":false}'

curl -X DELETE http://localhost:3000/libros/ID_DEL_LIBRO
```

Si definiste `API_KEY`, agrega `-H "x-api-key: TU_CLAVE"` a las peticiones `POST`, `PUT` y `DELETE`.

### Estructura del proyecto

```text
src/
  index.js         Arranque del servidor (lee PORT desde la configuración)
  app.js           Configuración de Express, sin listen()
  config/          Variables de entorno con dotenv
  db/              Conexión a MongoDB, esquema (Schema) y funciones de acceso a datos
  middlewares/     Logger, validación, API key y manejo de errores
  routes/          Rutas del recurso
  views/           Vistas EJS (solo si activas el punto extra E2)
test/              Pruebas de la API
docs/              Documentación del curso y guías
```

### Pruebas

```bash
npm test
```

Las pruebas usan el ejecutor integrado de Node y el `fetch` incorporado, pero **necesitan una base MongoDB en marcha**. Se conectan a `mongodb://127.0.0.1:27017/biblioteca_test` (o a la que indiques en la variable de entorno `MONGODB_URI_PRUEBAS` de tu terminal) y **borran los libros de esa base al empezar**; nunca usan la base de tu `.env`. Cubren los códigos de estado de cada ruta (200, 201, 204, 400, 401, 404 y 500).

### Depuración

Node incluye un depurador integrado (manual §5.3):

```bash
node --inspect src/index.js
```

Abre `chrome://inspect` en Chrome para conectarte. En Visual Studio Code, crea el archivo `.vscode/launch.json` con esta configuración y pulsa F5:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Depurar src/index.js",
      "program": "${workspaceFolder}/src/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

Coloca un breakpoint haciendo clic en el margen izquierdo del editor, junto al número de línea.

### Despliegue

TODO [E1] (Punto extra, opcional.) Si desplegaste tu API, escribe aquí la URL pública. Los pasos están en [docs/despliegue-render.md](docs/despliegue-render.md).

URL de despliegue: _pendiente_

### Cómo entregar

Entrega los siguientes datos, por el canal que indique el instructor:

1. **URL del repositorio** en GitHub.
2. **URL de despliegue** (opcional, punto extra).
3. La **lista de verificación completa** de [ENTREGA.md](ENTREGA.md).

| Dato | Valor |
|---|---|
| URL del repositorio | _pendiente_ |
| URL de despliegue (opcional) | _pendiente_ |
| Integrantes | _pendiente_ |

### Puntos extra

Desactivados por defecto (manual, sección 10):

- **E1.** Desplegar la API y compartir la URL pública: [docs/despliegue-render.md](docs/despliegue-render.md).
- **E2.** Vista renderizada con EJS: [src/views/README.md](src/views/README.md).
- **E3.** Paginación o filtros con query params en el listado: busca `TODO [E3]`.

### Licencia

El código se distribuye con la licencia MIT (archivo [LICENSE](LICENSE)). Los documentos de texto no tienen una licencia asignada por ahora.
