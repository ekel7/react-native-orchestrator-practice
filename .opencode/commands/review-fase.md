---
description: Auditar cierre de fase contra git status y diff real
agent: workflow-auditor
---

Auditá esta fase o cierre: $ARGUMENTS

No edites archivos.
No arregles problemas.
No hagas commit.
No hagas push.

Compará el cierre reportado contra el estado real del repo.

Revisá:
- git status --short;
- git diff --stat;
- archivos untracked;
- archivos modificados;
- archivos eliminados;
- cambios en package.json o lockfiles;
- presencia de .env;
- cambios en java_base_app/Weather-Hub/;
- si el cierre omitió archivos;
- si el QA declarado fue realmente comprobable.

Entregá:
1. Estado: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO
2. Coincidencia con el cierre reportado
3. Archivos reales modificados/nuevos/eliminados
4. Cambios fuera de alcance
5. Archivos sensibles tocados
6. QA comprobado
7. Riesgos pendientes
8. Recomendación: avanzar / corregir / pedir decisión humana
