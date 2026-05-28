---
description: Revisar estado de Git antes de commit humano
agent: git-guardian
---

Revisá el estado de Git para: $ARGUMENTS

No edites archivos.
No hagas git add.
No hagas commit.
No hagas push.

Ejecutá/verificá:
- git status --short;
- git diff --stat;
- git diff --name-status;
- archivos untracked;
- archivos sensibles;
- cambios en dependencias;
- si el diff corresponde a una sola fase.

Entregá:
1. Estado: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO
2. Archivos listos para commit
3. Archivos que NO deberían commitearse
4. Riesgos
5. Mensaje de commit sugerido
