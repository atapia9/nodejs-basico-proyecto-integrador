# Especificación del proyecto integrador

Esta especificación reproduce el texto de la sección 10 del manual del curso («Proyecto integrador final») y explica dónde la resuelve esta plantilla. Si hay diferencias entre este documento y el manual, manda el manual.

> Como cierre del curso, cada participante (o equipo de hasta 3 personas) desarrollará una API REST completa que integre los temas de las cinco sesiones. Este proyecto constituye la base de la evaluación final (20 puntos).

## Especificación mínima

El texto de la columna «Requisito» es el del manual. Las etiquetas R1 a R7 aparecen como `TODO [R#]` en el código, en los lugares donde debes completar o adaptar algo.

| Id | Requisito (texto del manual, sección 10) | Dónde se resuelve en la plantilla |
|---|---|---|
| R1 | Elegir un dominio propio: por ejemplo, gestión de una biblioteca, control de gastos personales, catálogo de recetas, seguimiento de hábitos, etc. | La plantilla trae el ejemplo «libros» solo para mostrar el patrón. Sustitúyelo por tu dominio en `src/routes/`, `src/db/` y `src/middlewares/validar-libro.js`. |
| R2 | Definir al menos un recurso principal con operaciones CRUD completas (GET, GET por id, POST, PUT, DELETE). | `src/routes/libros.js` implementa las cinco operaciones del ejemplo. |
| R3 | Persistir los datos en MongoDB o SQLite (no se acepta almacenamiento únicamente en memoria). | `src/db/` usa MongoDB con Mongoose. La rama `main` usa SQLite (better-sqlite3). |
| R4 | Usar variables de entorno (dotenv) para toda configuración sensible. | `src/config/index.js` lee `process.env`; los nombres están en `.env.example` y `.env` está en `.gitignore`. |
| R5 | Incluir al menos un middleware personalizado (logging, validación o autenticación simple). | `src/middlewares/`: `logger.js`, `validar-libro.js` y `api-key.js`. |
| R6 | Manejar errores de forma centralizada y devolver códigos de estado HTTP apropiados. | `src/middlewares/errores.js`, declarado al final de `src/app.js`, y los códigos de la tabla de más abajo. |
| R7 | Documentar en un archivo README.md cómo instalar dependencias, configurar variables de entorno y ejecutar el proyecto, junto con la lista de endpoints disponibles. | La «Parte B» de `README.md`, que debes completar con los datos de tu proyecto. |

## Puntos extra (opcionales)

Están desactivados por defecto. El manual no indica cuántos puntos valen.

| Id | Punto extra (texto del manual, sección 10) | Cómo activarlo |
|---|---|---|
| E1 | Desplegar la API en Render, Railway o Vercel y compartir la URL pública. | Sigue [docs/despliegue-render.md](docs/despliegue-render.md) y anota la URL en el README. |
| E2 | Agregar una vista renderizada con EJS para al menos una de las rutas. | Sigue [src/views/README.md](src/views/README.md). |
| E3 | Incluir paginación o filtros mediante query params en el endpoint de listado. | Busca `TODO [E3]` en `src/routes/libros.js` y `src/db/libros.js`. |

## Códigos de estado esperados

Del manual (sección 4.3, Fig. 4.2), aplicados a tu recurso:

| Operación | Ruta | Respuestas |
|---|---|---|
| Listar | `GET /recurso` | 200 |
| Obtener por id | `GET /recurso/:id` | 200 o 404 |
| Crear | `POST /recurso` | 201 o 400 |
| Actualizar | `PUT /recurso/:id` | 200 o 404 |
| Eliminar | `DELETE /recurso/:id` | 204 |

Si agregas autenticación por API key, la respuesta cuando falta la clave es 401 (sección 4.2, Ej. 4.2).

## Marcas TODO en el código

| Marca | Archivo principal |
|---|---|
| `TODO [R1]` | `src/routes/libros.js` |
| `TODO [R2]` | `src/routes/libros.js` |
| `TODO [R3]` | `src/db/index.js` |
| `TODO [R4]` | `src/config/index.js` |
| `TODO [R5]` | `src/middlewares/logger.js`, `validar-libro.js`, `api-key.js` |
| `TODO [R6]` | `src/middlewares/errores.js`, `src/routes/libros.js` |
| `TODO [R7]` | `README.md` |
| `TODO [E1]` | `README.md` y `docs/despliegue-render.md` |
| `TODO [E2]` | `src/app.js`, `src/routes/libros.js` y `src/views/` |
| `TODO [E3]` | `src/routes/libros.js`, `src/db/libros.js` |

Para encontrarlas todas, busca el texto `TODO [` en tu editor.

## Cómo se evalúa

Los criterios y sus porcentajes están en [RUBRICA.md](RUBRICA.md). Lo que debes revisar antes de entregar está en [ENTREGA.md](ENTREGA.md).

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.
