# Project State

## Estado actual

Proyecto configurado con workflow multiagente en OpenCode Go.
El agente primario por defecto es `orchestrator`.

## Workflow V2

El proyecto usa un flujo por fases con gates:

1. Estado inicial.
2. Plan.
3. Aprobación humana explícita.
4. Build controlado.
5. QA.
6. Revisión independiente.
7. Auditoría de diff.
8. Cierre de fase.
9. Commit humano opcional.

Ver:

- `docs/workflow/PHASE_CONTRACT.md`
- `docs/workflow/AGENT_ROUTING.md`

## Comandos útiles

- `/plan-fase <descripción>`: crear plan sin implementar.
- `/build-fase <fase aprobada>`: implementar una fase aprobada con gates.
- `/qa-fase <fase>`: ejecutar QA sin modificar archivos.
- `/review-fase <cierre>`: auditar cierre contra el repo real.
- `/next-prompt <fase>`: generar prompt seguro para la próxima fase.
- `/git-check <fase>`: revisión pre-commit humana.

## Modelos por agente

- orchestrator → Kimi K2.6
- analyst → DeepSeek V4 Flash Free
- ui-designer → MiMo V2.5 Free
- builder → DeepSeek V4 Pro
- qa-tester → DeepSeek V4 Flash Free
- reviewer → Kimi K2.6
- architect → GLM-5.1
- git-guardian → DeepSeek V4 Flash Free
- workflow-auditor → DeepSeek V4 Flash Free
- docs-writer → MiMo V2.5 Free

## Política de costo

- `architect` usa GLM-5.1 y se considera un agente caro.
- `architect` no se usa por defecto: requiere decisión arquitectónica bloqueada y justificación previa del orquestador.
- Migraciones pantalla por pantalla deben pasar primero por `analyst`, `builder`, `qa-tester`, `reviewer` y/o `workflow-auditor`.
- Para tareas locales, bugs puntuales, QA, documentación, revisión de diff o UI aislada, elegir un agente más barato.
- Los roles de bajo impacto usan modelos free mientras estén disponibles, manteniendo modelos potentes en orquestación, build, review y arquitectura.

## Estado de Git

- El directorio raíz del workflow tiene un repositorio Git inicializado.
- La rama inicial puede ser `master`.
- `java_base_app/Weather-Hub` debe quedar ignorado por Git en el repositorio raíz.
- `java_base_app/Weather-Hub` es solo referencia de lectura: puede consultarse para entender la app original, pero no debe modificarse.

## Restricciones permanentes

- No editar sin plan aprobado.
- No agregar dependencias sin aprobación.
- No hacer commit automático.
- No hacer push.
- No tocar credenciales.
- Mantener fases chicas.
- No cerrar una fase sin QA y revisión independiente.
