# Phase Contract

Este contrato se aplica a toda fase del workflow.

## Objetivo
Cada fase debe tener un único objetivo verificable.

Ejemplos válidos:
- Crear capa API tipada sin integrarla en pantallas.
- Implementar pantalla Today usando servicio existente.
- Agregar navegación base con tabs.

Ejemplos inválidos:
- Mejorar la app completa.
- Migrar todo lo que falta.
- Refactorizar y agregar features al mismo tiempo.

## Gates obligatorios

### Gate 0 — Estado inicial
Antes de proponer o implementar:
- leer `AGENTS.md`;
- leer `docs/PROJECT_STATE.md`;
- revisar `git status --short`;
- detectar si hay cambios pendientes no relacionados.

Si hay cambios pendientes, pedir decisión humana antes de mezclar fases.

### Gate 1 — Plan
Antes de editar:
- explicar objetivo;
- listar alcance permitido;
- listar fuera de alcance;
- listar archivos esperados;
- listar dependencias nuevas, si aplica;
- listar QA requerido;
- listar riesgos.

No implementar hasta aprobación humana explícita.

### Gate 2 — Build
Durante la implementación:
- modificar solo archivos aprobados o justificar cualquier archivo extra antes de tocarlo;
- no tocar `.env`;
- no tocar `java_base_app/Weather-Hub/` salvo lectura;
- no hacer commit;
- no agregar dependencias no aprobadas.

### Gate 3 — QA
Después de implementar:
- ejecutar checks baratos primero;
- ejecutar el binario local de TypeScript con el `tsconfig` del proyecto correspondiente, por ejemplo `react_native_app/weather-rn/node_modules/.bin/tsc -p react_native_app/weather-rn/tsconfig.json --noEmit`;
- ejecutar lint/tests si existen y son razonables;
- documentar checks no ejecutados y por qué.

Nunca inventar resultados de QA.

### Gate 4 — Diff Review
Antes del cierre:
- revisar `git status --short`;
- revisar `git diff --stat`;
- revisar archivos untracked;
- revisar si se tocaron archivos sensibles;
- revisar si el diff coincide con el alcance aprobado.

### Gate 5 — Evidencia y documentacion
Antes del cierre, decidir si la fase requiere evidencia persistente en docs.

Actualizar `docs/PHASE_LOG.md` o `docs/PROJECT_STATE.md` cuando:
- se completa una fase funcional relevante;
- se agrega o cambia una dependencia;
- cambia arquitectura, workflow o contrato de fase;
- queda QA manual pendiente;
- queda un riesgo o decision tecnica abierta;
- el cambio afecta el estado actual o la proxima fase.

No crear reportes `.md` por cada microcambio si el cierre del chat y el commit describen suficiente contexto.

Si no se actualiza documentacion, explicar brevemente en el cierre por que no hizo falta.

### Gate 6 — Cierre
Toda fase debe cerrar con:
1. resumen de cambios;
2. archivos creados/modificados/eliminados;
3. comandos ejecutados;
4. resultado de QA;
5. revisión de diff;
6. riesgos pendientes;
7. pasos manuales para probar;
8. documentacion actualizada o motivo para no actualizarla;
9. mensaje de commit sugerido;
10. propuesta de próxima fase, sin implementarla.

## Reglas de aprobación

Se considera aprobación válida solo si el humano responde explícitamente algo como:
- `Aprobado para Fase N`
- `Aprobado para implementar`
- `Aprobado con este alcance: ...`

No se considera aprobación:
- preguntas;
- comentarios generales;
- “ok” ambiguo;
- pedir explicación;
- pedir opinión.

## Semáforo de cierre

Usar uno de estos estados:

- `APROBADO`: QA pasa y diff coincide con alcance.
- `APROBADO CON OBSERVACIONES`: QA pasa, pero hay riesgos menores documentados.
- `BLOQUEADO`: QA falla, hay cambios inesperados, o falta decisión humana.

Si está `BLOQUEADO`, no proponer avanzar de fase como si estuviera listo.
