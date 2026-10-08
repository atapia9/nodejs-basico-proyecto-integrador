# Despliegue en Render

Esta guía sigue los seis pasos generales de la sección 5.4 del manual («Introducción al despliegue») para publicar una API Express en Render. Corresponde al punto extra E1.

> **Verifica en la documentación vigente.** La interfaz de Render, sus planes y sus límites cambian con el tiempo y esta guía no hace afirmaciones sobre ellos. Consulta la documentación oficial en <https://render.com/docs> antes de desplegar. El manual indica lo mismo para la plataforma. Railway y Vercel también se mencionan en el manual, pero esta guía no los cubre.

TODO [E1] Cuando tu API esté desplegada, escribe la URL pública en la sección «Despliegue» del README.

## Antes de empezar

- Tu proyecto funciona en local: `npm install`, `npm test` y `npm start` terminan bien.
- Tienes una cuenta en GitHub y otra en Render.
- Tu API necesita una base MongoDB accesible desde Internet y su cadena de conexión. La base de datos es un servicio aparte de tu aplicación; consulta la documentación de tu proveedor para obtenerla.

## Los seis pasos

1. **Sube el proyecto a un repositorio de GitHub**, asegurando que `.env` y `node_modules` estén en `.gitignore`. Esta plantilla ya los ignora; comprueba con `git ls-files` que no aparezcan.

2. **Verifica que `package.json` tenga un script `start`** que ejecute la app. En esta plantilla es `"start": "node src/index.js"`, porque el arranque está en `src/`. El manual muestra `node index.js` para proyectos con el archivo en la raíz.

3. **Crea un nuevo «Web Service» en Render** y conéctalo al repositorio.

4. **Configura las variables de entorno desde el panel de Render**, no en el código. Define las mismas que aparecen en `.env.example`:

   | Variable | Qué poner |
   |---|---|
   | `PORT` | Normalmente no hace falta definirla: el código usa `process.env.PORT` si la plataforma la entrega. Verifica en la documentación de Render. |
   | `MONGODB_URI` | La cadena de conexión a tu base MongoDB. Contiene credenciales: ponla solo en el panel. |
   | `API_KEY` | La clave que exigirá la API en las rutas que modifican datos. Invéntala tú y no la publiques. |

5. **Define el comando de build y el de arranque**: el de build es `npm install` y el de arranque es `npm start`.

6. **Despliega y verifica los logs.** Prueba los endpoints con la URL pública que te asigna la plataforma, con Postman, Thunder Client o `curl`:

   ```bash
   curl https://TU-SERVICIO.onrender.com/libros
   ```

   Cambia `TU-SERVICIO` por el nombre de tu servicio y `/libros` por el recurso de tu dominio.

## Si algo falla

- Revisa los logs del servicio en el panel de Render: casi siempre indican la variable de entorno que falta o el comando de arranque incorrecto.
- Confirma que el puerto se lee con `process.env.PORT` (está en `src/config/index.js`).
- Prueba el mismo comando de arranque en tu equipo: `npm start`.

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic).
