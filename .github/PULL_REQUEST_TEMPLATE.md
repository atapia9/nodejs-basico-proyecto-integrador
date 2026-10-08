## Qué cambia

<!-- Describe el cambio en una o dos frases y enlaza el issue si existe (por ejemplo: Cierra #3). -->

## Cómo probarlo

<!-- Comandos o peticiones que permiten comprobar el cambio. -->

## Lista de verificación

El archivo ENTREGA.md de la raíz del repositorio detalla cada punto.

- [ ] `npm install` y `npm test` funcionan en limpio.
- [ ] El servidor arranca con `npm start` y las rutas responden con los códigos de estado esperados (200, 201, 204, 400, 404).
- [ ] No se versionan `.env`, `node_modules/` ni la base de datos local.
- [ ] No hay contraseñas, claves ni cadenas de conexión en el código.
- [ ] Si se agregó una variable de entorno, su nombre (sin valor) está en `.env.example`.
- [ ] Si cambió un endpoint, se actualizó la tabla de endpoints del README.
- [ ] Las pruebas cubren el cambio.
- [ ] Otra persona del equipo revisó el pull request (si el proyecto es en equipo).
