# Rúbrica del proyecto integrador

## Criterios de evaluación (texto del manual, sección 10)

| Criterio | Peso |
|---|---|
| Funcionalidad CRUD completa | 40 % |
| Persistencia y configuración (BD + variables de entorno) | 25 % |
| Calidad del código (organización, manejo de errores, middleware) | 20 % |
| Documentación (README y claridad de instrucciones) | 15 % |
| **Total** | **100 %** |

Los puntos extra (despliegue, vista EJS y paginación o filtros) son opcionales. El manual no dice cuánto valen ni si se suman a este 100 %.

## Dónde se ve cada criterio en el repositorio

Esta tabla orienta a quien desarrolla y a quien revisa; la redacción es de esta plantilla, no del manual.

| Criterio | Qué mirar |
|---|---|
| Funcionalidad CRUD completa | Las cinco rutas del recurso (`src/routes/`), los códigos de estado de [ESPECIFICACION.md](ESPECIFICACION.md) y `npm test`. |
| Persistencia y configuración | Que los datos sobrevivan a un reinicio del servidor, que no haya valores sensibles en el código, que `.env` esté ignorado y que `.env.example` liste las variables. |
| Calidad del código | Organización en carpetas (`config`, `db`, `middlewares`, `routes`), al menos un middleware propio y el manejador de errores de cuatro parámetros al final de `src/app.js`. |
| Documentación | Que el README explique cómo instalar, configurar las variables de entorno, ejecutar y qué endpoints existen. |

## Propuesta: conversión a los 20 puntos de la evaluación final

> **Propuesta pendiente de confirmación.** No forma parte del manual y no debe aplicarse hasta que la persona responsable del curso la confirme.

El manual dice que el proyecto es «la base de la evaluación final (20 puntos)». Existe además un examen de 10 reactivos que vale 2 puntos por acierto (máximo 20) como rubro «Evaluación final». Mientras no se aclare cómo se combinan, esta propuesta supone que **el proyecto equivale a los 20 puntos** y aplica los porcentajes del manual:

| Criterio | Peso | Puntos propuestos |
|---|---|---|
| Funcionalidad CRUD completa | 40 % | 8 |
| Persistencia y configuración | 25 % | 5 |
| Calidad del código | 20 % | 4 |
| Documentación | 15 % | 3 |
| **Total** | **100 %** | **20** |

Si los 20 puntos se reparten entre el examen y el proyecto, o si los puntos extra suman aparte, la tabla cambia. Ver las notas N2 y N3 en [docs/NOTAS_DE_REVISION.md](docs/NOTAS_DE_REVISION.md).

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.
