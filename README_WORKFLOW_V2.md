# Workflow V2 para OpenCode

Esta versión agrega una capa de workflow reutilizable sobre tu configuración actual:

- contratos de fase en `docs/workflow/PHASE_CONTRACT.md`;
- reglas de ruteo de agentes en `docs/workflow/AGENT_ROUTING.md`;
- comandos reutilizables en `commands/`;
- agente nuevo `workflow-auditor` para comparar cierre contra el repo real;
- orquestador más estricto con gates.

## Cómo usar

Copiar estas carpetas/archivos dentro de tu carpeta `.opencode/` o donde tengas actualmente esta configuración:

- `agents/`
- `commands/`
- `docs/`
- `AGENTS.md`
- `opencode.jsonc`

Comandos principales:

- `/plan-fase <descripción>`
- `/build-fase <descripción aprobada>`
- `/qa-fase <qué validar>`
- `/review-fase <cierre o fase>`
- `/next-prompt <siguiente fase>`

Uso recomendado:

1. `/plan-fase Fase 4 Today Screen`
2. Aprobás manualmente el alcance.
3. `/build-fase Aprobado para Fase 4 ...`
4. `/qa-fase Fase 4`
5. `/review-fase Cierre de Fase 4`
6. `/next-prompt Fase 5 Forecast`
