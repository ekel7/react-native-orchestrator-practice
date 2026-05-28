---
description: Implementar una fase ya aprobada, respetando gates
agent: orchestrator
---

Implementá esta fase aprobada: $ARGUMENTS

Modo: BUILD CONTROLADO.
Solo se puede avanzar si el mensaje contiene aprobación humana explícita como "Aprobado para Fase N" o equivalente claro.

Restricciones permanentes:
- No tocar .env.
- No crear .env.
- No tocar java_base_app/Weather-Hub/ salvo lectura.
- No instalar dependencias salvo que estén explícitamente aprobadas en el alcance.
- No hacer commit.
- No hacer push.
- No ejecutar comandos destructivos.
- No implementar fuera del alcance aprobado.

Flujo obligatorio:
1. Confirmá alcance aprobado.
2. Listá archivos esperados antes de editar.
3. Delegá implementación a builder.
4. Después de builder, delegá QA a qa-tester.
5. Después de QA, delegá revisión a reviewer o workflow-auditor según corresponda.
6. Revisá git status --short y git diff --stat.
7. Cerrá usando el formato de docs/workflow/PHASE_CONTRACT.md.

Cierre obligatorio:
1. Estado: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO
2. Resumen de cambios
3. Archivos creados/modificados/eliminados
4. Comandos ejecutados
5. Resultado de QA
6. Revisión de diff
7. Riesgos pendientes
8. Pasos manuales para probar
9. Mensaje de commit sugerido
10. Próxima fase propuesta, sin implementarla
