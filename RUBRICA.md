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

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic) y revisado por Armando.
