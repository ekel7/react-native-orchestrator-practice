# Agent Routing

Usar el agente mínimo suficiente. Más agentes no significa mejor workflow.

## Rutas recomendadas

### Fase simple
Ejemplos: tipos, constantes, helpers, copy, docs simples.

Ruta:
1. orchestrator
2. builder
3. qa-tester
4. workflow-auditor o git-guardian

### Dependencias / navegación / permisos
Ejemplos: React Navigation, Expo Location, NetInfo, cambios en package.json.

Ruta:
1. orchestrator
2. analyst si se requiere documentación externa o revisión de compatibilidad
3. builder
4. qa-tester
5. reviewer
6. workflow-auditor
7. git-guardian antes de commit humano

### UI importante
Ejemplos: pantalla Today, Forecast, layout, estados vacíos.

Ruta:
1. orchestrator
2. ui-designer
3. builder
4. qa-tester
5. reviewer
6. workflow-auditor

### API / servicios / datos
Ejemplos: OpenWeather API, error handling, tipos, mappers.

Ruta:
1. orchestrator
2. analyst
3. builder
4. qa-tester
5. reviewer
6. workflow-auditor

### Arquitectura o refactor transversal
Ejemplos: estado global, cache, offline, estructura de carpetas, data layer compartida.

Ruta:
1. orchestrator justifica por qué architect es necesario
2. architect
3. analyst o reviewer
4. builder solo después de aprobación humana
5. qa-tester
6. reviewer
7. workflow-auditor

## Cuándo NO usar architect

No usar architect para:
- pantalla aislada;
- bug local;
- cambio visual menor;
- documentación;
- revisión de diff;
- QA;
- implementación ya decidida.

## Regla de revisión independiente

El agente que implementa no debe ser el único que aprueba su propio trabajo.
Siempre debe existir al menos una revisión posterior por `qa-tester`, `reviewer`, `workflow-auditor` o `git-guardian`.
