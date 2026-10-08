# Lista de verificación de entrega

Marca cada punto antes de entregar. Los requisitos R1 a R7 son los de la sección 10 del manual; los detalles están en [ESPECIFICACION.md](ESPECIFICACION.md).

## Qué debes entregar

Según la Actividad 5 del manual, la entrega es el **repositorio de tu API** con README, base de datos y variables de entorno y, si es posible, la URL de despliegue.

| Dato | Tu respuesta |
|---|---|
| URL del repositorio en GitHub | |
| URL de despliegue (opcional, punto extra E1) | |
| Integrantes (si trabajaron en equipo, hasta 3 personas) | |

El manual no indica el canal ni la fecha límite para enviar estos datos: el instructor te lo informará. La Sesión 5 cierra con «Evaluación final y entrega del proyecto integrador».

## Requisitos mínimos

- [ ] **R1.** Elegí un dominio propio y reemplacé el ejemplo «libros».
- [ ] **R2.** El recurso principal tiene GET, GET por id, POST, PUT y DELETE.
- [ ] **R3.** Los datos se guardan en MongoDB o SQLite; al reiniciar el servidor siguen ahí.
- [ ] **R4.** Toda configuración sensible se lee de variables de entorno con dotenv.
- [ ] **R5.** Hay al menos un middleware personalizado (logging, validación o autenticación simple).
- [ ] **R6.** Los errores se manejan en un middleware central y las rutas devuelven los códigos de estado apropiados (200, 201, 204, 400, 404).
- [ ] **R7.** El README explica cómo instalar, configurar las variables de entorno y ejecutar, e incluye la lista de endpoints.

## Higiene del repositorio

- [ ] `npm install`, `npm test` y `npm start` funcionan en un clon limpio.
- [ ] `.env` y `node_modules/` no están en el repositorio (comprueba con `git ls-files`).
- [ ] `.env.example` lista todas las variables que lee el código, sin valores reales.
- [ ] No hay contraseñas, claves ni cadenas de conexión en el código ni en el historial de Git.
- [ ] No quedan marcas `TODO [` por resolver en `src/`, o las que quedan están explicadas en el README.
- [ ] Eliminé la «Parte A» del README (la guía de uso de la plantilla) y completé la «Parte B».

## Puntos extra (opcionales)

- [ ] **E1.** Desplegué la API y la URL pública responde.
- [ ] **E2.** Hay una vista EJS en al menos una ruta.
- [ ] **E3.** El endpoint de listado admite paginación o filtros con query params.

## Antes de enviar

- [ ] Abrí el repositorio en una ventana de incógnito o con otra cuenta para confirmar que el instructor puede verlo (o lo compartí con la cuenta que indicó).
- [ ] Revisé la [rúbrica](RUBRICA.md).

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.
