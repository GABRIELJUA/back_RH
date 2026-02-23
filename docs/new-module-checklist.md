# Checklist para agregar un nuevo módulo (manteniendo la estructura actual)

## 1) Estructura base
- [ ] Crear `src/models/<modulo>Model.js`
- [ ] Crear `src/controllers/<modulo>Controller.js`
- [ ] Crear `src/routes/<modulo>Routes.js`
- [ ] Registrar la ruta en `src/app.js`

## 2) Seguridad y validaciones
- [ ] Agregar middleware de validación de payload en `src/middlewares/validationMiddleware.js` (si aplica)
- [ ] Proteger rutas con `verifyToken` y `allowRoles` según reglas de negocio
- [ ] Si hay carga de archivos, aplicar límites de tamaño y filtro de tipos de archivo

## 3) Errores y respuestas
- [ ] Devolver códigos HTTP consistentes (`400`, `401`, `403`, `404`, `500`)
- [ ] Usar mensajes claros para frontend y logs descriptivos para backend
- [ ] Permitir que errores no controlados lleguen a `errorMiddleware`

## 4) Datos y consultas
- [ ] Verificar índices/llaves únicas necesarias en DB
- [ ] Usar queries parametrizadas
- [ ] Evitar updates masivos si no se reciben todos los campos

## 5) Pruebas mínimas
- [ ] Caso feliz del endpoint principal
- [ ] Validación de payload inválido
- [ ] Prueba de autorización por rol
- [ ] Prueba de error de recurso no encontrado
