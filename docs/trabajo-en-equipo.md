# Trabajo en equipo

El manual permite que el proyecto integrador lo desarrolle un equipo de hasta 3 personas (sección 10). Este documento propone un flujo sencillo con Git y GitHub para repartir el trabajo sin pisarse. Es una recomendación del curso; el manual no exige un flujo concreto.

## Reglas básicas

1. **Un repositorio para todo el equipo.** Una persona crea el repositorio a partir de la plantilla y agrega a las otras como colaboradoras (Settings, Collaborators).
2. **No se hace push directo a `main`.** Cada cambio se trabaja en una rama y entra por pull request.
3. **Ramas cortas.** Una rama por tarea; se borra cuando se fusiona.
4. **Commits pequeños y con mensaje claro.** Usa Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
5. **Todo pull request lo revisa otra persona del equipo** antes de fusionarse.

## Cómo repartir el trabajo

Una forma de dividir un proyecto de tres personas es por los criterios de la [rúbrica](../RUBRICA.md):

| Persona | Área sugerida | Requisitos |
|---|---|---|
| A | Rutas y CRUD del recurso, códigos de estado | R1, R2, R6 |
| B | Base de datos, variables de entorno y despliegue | R3, R4, E1 |
| C | Middlewares, pruebas y README | R5, R7 |

Todas las personas deben conocer todo el proyecto: rotar las revisiones de código ayuda a conseguirlo. Cada tarea se anota como issue (hay una plantilla en `.github/ISSUE_TEMPLATE/`).

## Flujo de una tarea

```bash
# 1. Actualiza main y crea tu rama
git switch main
git pull
git switch -c feat/ruta-prestamos

# 2. Trabaja, prueba y haz commits pequeños
npm test
git add src/routes/prestamos.js
git commit -m "feat: agrega las rutas de préstamos"

# 3. Sube la rama y abre el pull request en GitHub
git push -u origin feat/ruta-prestamos
```

En GitHub, abre el pull request hacia `main`. La plantilla de pull request trae una lista de verificación; complétala. Cuando otra persona lo apruebe, fusiónalo y borra la rama.

## Conflictos de fusión

Si dos personas cambian las mismas líneas, Git marca un conflicto al fusionar. Para resolverlo:

1. Trae los cambios de `main` a tu rama: `git switch tu-rama` y luego `git merge main`.
2. Abre los archivos marcados con `<<<<<<<`, decide qué versión queda y borra las marcas.
3. Ejecuta `npm test`, haz commit y vuelve a subir la rama.

Para reducir conflictos, evita que dos personas editen el mismo archivo a la vez; `package.json`, `src/app.js` y el README son los más propensos.

## Qué no se comparte por Git

- El archivo `.env`: cada integrante crea el suyo a partir de `.env.example`. Si hay que compartir un valor, usa un canal privado, nunca el repositorio.
- La carpeta `node_modules/` y la base de datos local (`data/`).

## Evidencia de la aportación de cada integrante

El manual no dice cómo se evalúa la aportación individual. El historial de commits, los pull requests y los issues dejan constancia de quién hizo cada cosa; conviene que cada integrante haga commits con su propia cuenta de GitHub.

---

Nota de divulgación: este material fue elaborado con asistencia de Claude (Anthropic).
