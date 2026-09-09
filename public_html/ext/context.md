# Contexto y Registro de Cambios

## Cambios Realizados
1. **[page.tsx](file:///c:/Users/anonb/Desktop/kitchen/kitchen-frontend/src/app/page.tsx)**:
   - Se corrigió el error `Property 'message' does not exist on type 'Promise<any>'` agregando el operador `await` a `response.json()`.
   - Se corrigió la URL del endpoint de deducción de `https://localhost:3000/...` a `http://localhost:3000/...`.
   - Se corrigió el nombre de la propiedad en el payload de `{ amoun: 1 }` a `{ amount: 1 }`.
   - Se eliminó la importación no utilizada de `@faker-js/faker`.

2. **[deduct-inventory.service.ts](file:///c:/Users/anonb/Desktop/kitchen/kitchen-saas/src/modules/inventory/use-cases/deduct-inventory.service.ts)**:
   - Se corrigió el typo en la excepción `INVALID_DEDUCTION_AMOUN` a `INVALID_DEDUCTION_AMOUNT` para que coincida con el controlador.

## Rutas Involucradas
- [kitchen-frontend/src/app/page.tsx](file:///c:/Users/anonb/Desktop/kitchen/kitchen-frontend/src/app/page.tsx)
- [kitchen-saas/src/modules/inventory/use-cases/deduct-inventory.service.ts](file:///c:/Users/anonb/Desktop/kitchen/kitchen-saas/src/modules/inventory/use-cases/deduct-inventory.service.ts)

## Consultas SQL
- N/A

## Pendientes
- Ninguno para esta corrección.
