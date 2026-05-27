# Reglas del proyecto

## Workflow obligatorio

Todo cambio debe seguir este flujo:

1. Analizar el estado actual.
2. Proponer plan.
3. Esperar aprobación humana.
4. Implementar solo lo aprobado.
5. Ejecutar QA.
6. Revisar diff.
7. Actualizar documentación.
8. Sugerir commit.
9. No hacer commit automáticamente.

## Reglas de seguridad

- No tocar archivos `.env`.
- No modificar `java_base_app/Weather-Hub/`; es solo referencia de lectura.
- No agregar `java_base_app/Weather-Hub/` al índice Git.
- No borrar carpetas completas.
- No agregar dependencias sin aprobación.
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
- Si se toca base de datos, explicar migración.
- Si se toca UI, revisar responsividad.
- Si se toca lógica, revisar regresiones.

## Cierre de cada fase

Cada fase debe cerrar con:

- resumen de cambios;
- archivos modificados;
- comandos ejecutados;
- resultado de QA;
- riesgos pendientes;
- mensaje de commit sugerido.
