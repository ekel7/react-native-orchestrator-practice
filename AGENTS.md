# Reglas del proyecto

## Principio principal

Este proyecto se trabaja por fases pequeñas, auditables y aprobadas por el humano.
El objetivo es migrar o modificar la app sin mezclar alcance, sin tocar archivos sensibles y sin perder control del diff.

## Workflow obligatorio V2

Todo cambio debe seguir estos gates:

1. **Estado inicial**
   - Leer `AGENTS.md`.
   - Leer `docs/PROJECT_STATE.md`.
   - Leer `docs/workflow/PHASE_CONTRACT.md`.
   - Revisar `git status --short`.
   - Alertar si hay cambios pendientes no relacionados.

2. **Plan**
   - Proponer objetivo.
   - Definir alcance permitido.
   - Definir fuera de alcance.
   - Listar archivos esperados.
   - Listar dependencias permitidas, si aplica.
   - Listar QA requerido.
   - Esperar aprobación humana explícita.

3. **Build**
   - Implementar solo lo aprobado.
   - No agregar features extra.
   - No hacer refactors grandes no aprobados.
   - Si aparece la necesidad de tocar un archivo no previsto, pausar y explicar.

4. **QA**
   - Ejecutar checks apropiados.
   - Para TypeScript, usar el binario local con el `tsconfig` del proyecto correspondiente, por ejemplo `react_native_app/weather-rn/node_modules/.bin/tsc -p react_native_app/weather-rn/tsconfig.json --noEmit`.
   - Ejecutar lint/tests si existen y son razonables.
   - No inventar resultados.

5. **Revisión independiente**
   - El agente que implementó no debe ser el único que aprueba.
   - Usar `qa-tester`, `reviewer`, `workflow-auditor` o `git-guardian` según corresponda.

6. **Diff review**
   - Revisar `git status --short`.
   - Revisar `git diff --stat`.
   - Revisar archivos untracked.
   - Confirmar que el diff coincide con el alcance aprobado.

7. **Documentación**
   - Actualizar documentación persistente cuando la fase cambie estado, dependencias, riesgos, workflow o decisiones.
   - Usar `docs/PHASE_LOG.md` como registro breve de fases e hitos.
   - Usar `docs/PROJECT_STATE.md` para el estado vivo del proyecto.
   - No documentar features que no existen.
   - Si no se actualiza documentación, explicar por qué en el cierre.

8. **Cierre**
   - Resumen de cambios.
   - Archivos creados/modificados/eliminados.
   - Comandos ejecutados.
   - Resultado de QA.
   - Revisión de diff.
   - Riesgos pendientes.
   - Pasos manuales de prueba.
   - Documentación actualizada o motivo para no actualizarla.
   - Mensaje de commit sugerido.
   - Próxima fase propuesta sin implementarla.

9. **Commit**
   - No hacer commit automáticamente.
   - No hacer push.
   - Solo sugerir mensaje de commit.

## Reglas de seguridad

- No tocar archivos `.env`.
- No crear archivos `.env`.
- No imprimir secretos.
- No modificar `java_base_app/Weather-Hub/`; es solo referencia de lectura.
- No agregar `java_base_app/Weather-Hub/` al índice Git.
- No borrar carpetas completas.
- No agregar dependencias sin aprobación explícita.
- No modificar configuración crítica sin explicar el motivo.
- No hacer `git push`.
- No hacer `git commit` automáticamente.
- No ejecutar comandos destructivos.
- No cambiar arquitectura sin aprobación.

## Reglas de implementación

- Una fase = un objetivo concreto.
- No mezclar feature + refactor grande en la misma fase.
- `java_base_app/Weather-Hub/` puede leerse para entender la app original, pero no se debe editar, formatear, mover ni borrar.
- Todo cambio debe incluir pasos de prueba manual.
- Si se toca UI, revisar responsividad y estados vacíos/error/loading.
- Si se toca lógica, revisar regresiones.
- Si se toca API o credenciales, explicar riesgos y no hardcodear secretos.
- Si se toca dependencias, justificar por qué son necesarias.

## Aprobación humana explícita

Solo se puede implementar después de frases claras como:

- `Aprobado para Fase N`
- `Aprobado para implementar`
- `Aprobado con este alcance: ...`

No cuenta como aprobación:

- “ok” ambiguo;
- una pregunta;
- pedir opinión;
- pedir explicación;
- pedir un plan.

## Cierre de cada fase

Cada fase debe cerrar con semáforo:

- `APROBADO`: QA pasa y diff coincide con alcance.
- `APROBADO CON OBSERVACIONES`: QA pasa, pero hay riesgos menores.
- `BLOQUEADO`: QA falla, hay cambios inesperados, o falta decisión humana.

Formato obligatorio:

1. Estado: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO
2. Resumen de cambios
3. Archivos creados/modificados/eliminados
4. Comandos ejecutados
5. Resultado de QA
6. Revisión de diff
7. Riesgos pendientes
8. Pasos manuales para probar
9. Documentación actualizada o motivo para no actualizarla
10. Mensaje de commit sugerido
11. Próxima fase propuesta

Si el estado es `BLOQUEADO`, no proponer avanzar como si estuviera listo.
