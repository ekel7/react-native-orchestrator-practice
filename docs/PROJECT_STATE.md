# Project State

## Estado actual

Proyecto en configuración inicial de workflow multiagente con OpenCode Go.
El agente primario por defecto es `orchestrator`.

## Modelos por agente

- orchestrator → Kimi K2.6
- analyst → Qwen3.6 Plus
- ui-designer → MiniMax M2.7
- builder → DeepSeek V4 Pro
- qa-tester → DeepSeek V4 Flash
- reviewer → Kimi K2.6
- architect → GLM-5.1
- git-guardian → DeepSeek V4 Flash
- docs-writer → Qwen3.6 Plus

## Workflow

1. El usuario habla principalmente con orchestrator.
2. orchestrator analiza la tarea y delega.
3. builder solo implementa después de aprobación.
4. qa-tester verifica funcionamiento.
5. reviewer revisa calidad técnica.
6. git-guardian revisa diff antes del commit.
7. docs-writer actualiza documentación.

## Política de costo

- `architect` usa GLM-5.1 y se considera un agente caro.
- `architect` no se usa por defecto: requiere una decisión arquitectónica bloqueada y una justificación previa del orquestador.
- Migraciones pantalla por pantalla deben pasar primero por `analyst`, `builder`, `qa-tester` y `reviewer`.
- Para tareas locales, bugs puntuales, QA, documentación, revisión de diff o UI aislada, se debe elegir un agente más barato.

## Estado de Git

- El directorio raíz del workflow ya tiene un repositorio Git inicializado.
- Todavía no hay commits iniciales.
- La rama inicial creada por `git init` es `master`.
- `java_base_app/Weather-Hub` queda ignorado por Git en el repositorio raíz.
- `java_base_app/Weather-Hub` es solo referencia de lectura: puede consultarse para entender la app original, pero no debe modificarse.

## Restricciones permanentes

- No editar sin plan aprobado.
- No agregar dependencias sin aprobación.
- No hacer commit automático.
- No hacer push.
- No tocar credenciales.
- Mantener fases chicas.
