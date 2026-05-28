---
description: Ejecutar QA de una fase sin modificar archivos
agent: qa-tester
---

Verificá la fase: $ARGUMENTS

No edites archivos.
No hagas commit.
No hagas push.

Revisá:
- git status --short;
- git diff --stat;
- TypeScript con el binario local y el tsconfig del proyecto correspondiente, por ejemplo react_native_app/weather-rn/node_modules/.bin/tsc -p react_native_app/weather-rn/tsconfig.json --noEmit;
- lint/tests si existen y son razonables;
- dependencias nuevas si package.json o lockfile cambiaron;
- archivos sensibles;
- pasos manuales necesarios.

Entregá:
1. Estado: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO
2. Comandos ejecutados
3. Resultado de cada comando
4. Bugs encontrados
5. Regresiones potenciales
6. Pasos manuales para probar
7. Riesgos pendientes
8. Recomendación para el orquestador
