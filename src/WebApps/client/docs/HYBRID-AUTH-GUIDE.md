# 🔄 Guía Completa - Autenticación Híbrida Legacy/Angular

## 📋 Resumen Ejecutivo

Sistema de autenticación híbrida para migración progresiva de **Razor Pages (Legacy)** a **Angular Moderno**.

**Problema resuelto:** Las rutas legacy cargaban el layout de Angular (header, sidebar, footer), causando layouts duplicados y conflictos visuales.

**Solución:** Rutas legacy se cargan **SIN layout** (`/legacy/...`), mientras que rutas modernas mantienen el layout completo.

---

## 🎯 Arquitectura

### Flujo Legacy (Razor Pages → Angular sin Layout)

```
Razor Page
    ↓
Query Params: ?token=xxx&route=Articulo&permission={...}&userRoleData={...}
    ↓
app.ts detecta params
    ↓
handleLegacyAuthentication():
  1. Guarda token en localStorage
  2. Procesa permisos
  3. Redirige a /legacy/{ruta}
    ↓
LegacyLayoutComponent (SIN header, sidebar, footer)
    ↓
Solo el componente se renderiza
```

**URL Ejemplo:**

```
http://localhost:4200/?token=eyJhbGc...&route=Articulo&permission={...}
→ Redirige a: /legacy/inventory/product (SIN layout)
```

### Flujo Moderno (Angular Nativo con Layout)

```
Usuario accede directamente
    ↓
URL: /inventory/product
    ↓
hybridAuthGuard valida token JWT
    ↓
AdminLayoutComponent (CON header, sidebar, footer)
    ↓
Componente dentro del layout completo
```

---

## 📁 Archivos Clave

### 1. `src/app/app.ts`

**Métodos principales:**

```typescript
handleLegacyAuthentication(token, route, permission, userRoleData)
  → Procesa autenticación desde Razor Pages
  → Guarda token y permisos
  → Redirige a /legacy/{ruta}

handleModernFlow()
  → Inicializa app Angular moderna
  → Aplica settings

processPermissions(dataPermission, userRoleData)
  → Procesa permisos legacy
  → Guarda en UserRoleState
```

### 2. `src/app/app.routes.ts`

```typescript
// RUTAS LEGACY (Sin Layout) - SIN guard
{
  path: 'legacy',
  component: LegacyLayoutComponent,
  // NO tiene canActivate - app.ts ya validó
  children: [
    { path: 'purchase', loadChildren: ... },
    { path: 'inventory', loadChildren: ... },
    { path: 'restaurant', loadChildren: ... },
    // ... todos los módulos
  ]
}

// RUTAS MODERNAS (Con Layout) - CON guard
{
  path: '',
  component: AdminLayoutComponent,
  canActivate: [hybridAuthGuard],
  canActivateChild: [hybridAuthGuard],
  children: [
    { path: 'dashboard', ... },
    { path: 'purchase', loadChildren: ... },
    // ... todos los módulos
  ]
}
```

### 3. `src/app/layouts/legacy-layout/legacy-layout.component.ts`

```typescript
@Component({
  template: `<router-outlet />`, // Solo router, SIN layout
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class LegacyLayoutComponent {}
```

### 4. `src/app/core/guards/hybrid-auth.guard.ts`

```typescript
export const hybridAuthGuard: CanActivateFn = (route, state) => {
  // 1. Si tiene query params legacy → permitir
  if (queryParams['token'] && queryParams['route']) {
    return true;
  }

  // 2. Si es ruta /legacy/* → verificar token en localStorage
  if (state.url.startsWith('/legacy/')) {
    return !!localStorage.getItem('access_token');
  }

  // 3. Para rutas modernas → validar token JWT
  const isTokenValid = !tokenUseCase.isTokenExpired();
  if (!isTokenValid) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
```

### 5. `src/app/core/constants/global-routes.ts`

```typescript
export enum GlobalRoutes {
  // La CLAVE es lo que Razor envía en ?route=XXX
  // El VALOR es la ruta Angular
  Articulo = 'inventory/product',
  Cliente = 'customer/company-customer',
  Factura = 'billing/invoice',
  RestaurantConsumoTpv = 'restaurant/meal-consumption-list',
  // ... todas las rutas legacy
}
```

**Funcionamiento:**

- Razor envía: `?route=Articulo`
- `getEnumValueByKey(GlobalRoutes, 'Articulo')` → `'inventory/product'`
- Redirección final: `/legacy/inventory/product`

### 6. `src/app/core/services/route-migration.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class RouteMigrationService {
  // Rutas completamente migradas (solo Angular, sin legacy)
  private modernRoutes = new Set<string>([
    // GlobalRoutes.Articulo, // Descomentar cuando esté migrado
  ]);

  isModernRoute(route: string): boolean {
    return this.modernRoutes.has(route);
  }

  markAsModern(route: string): void {
    this.modernRoutes.add(route);
  }
}
```

---

## 🚀 Cómo Funciona

### Ejemplo: RestaurantConsumoTpv

**1. Razor Page genera URL:**

```html
<a href="http://angular-app/?token=ABC123&route=RestaurantConsumoTpv&permission={...}">
  Consumo TPV
</a>
```

**2. Usuario hace clic → Angular recibe:**

```
http://localhost:4200/?token=ABC123&route=RestaurantConsumoTpv&permission={...}
```

**3. `app.ts` detecta params:**

```typescript
if (token && route) {  // ✅ true
  handleLegacyAuthentication('ABC123', 'RestaurantConsumoTpv', ...)
}
```

**4. Dentro de `handleLegacyAuthentication`:**

```typescript
// Guardar token
localStorage.setItem('access_token', 'ABC123');

// Convertir ruta
const route_page = getEnumValueByKey(GlobalRoutes, 'RestaurantConsumoTpv');
// → 'restaurant/meal-consumption-list'

// Redirigir
router.navigate(['/legacy', 'restaurant', 'meal-consumption-list']);
// → /legacy/restaurant/meal-consumption-list
```

**5. Router carga `/legacy/restaurant/meal-consumption-list`:**

- ✅ Sin guard (ya validado por app.ts)
- ✅ LegacyLayoutComponent (vacío)
- ✅ Solo MealConsumptionListComponent se renderiza

**6. Usuario ve:**

```
┌────────────────────────────────┐
│                                │
│   [Componente de Consumo TPV]  │
│                                │
│   SIN header                   │
│   SIN sidebar                  │
│   SIN footer                   │
│                                │
└────────────────────────────────┘
```

---

## 📊 Comparación: Legacy vs Moderno

| Aspecto         | Legacy                       | Moderno                     |
| --------------- | ---------------------------- | --------------------------- |
| **Acceso**      | Razor Pages con query params | Navegación Angular directa  |
| **URL**         | `/?token=xxx&route=Articulo` | `/inventory/product`        |
| **Redirección** | `/legacy/inventory/product`  | `/inventory/product`        |
| **Layout**      | ❌ Sin layout (LegacyLayout) | ✅ Con layout (AdminLayout) |
| **Guard**       | ❌ No (validado por app.ts)  | ✅ Sí (hybridAuthGuard)     |
| **Header**      | ❌ No                        | ✅ Sí                       |
| **Sidebar**     | ❌ No                        | ✅ Sí                       |
| **Footer**      | ❌ No                        | ✅ Sí                       |
| **Uso**         | Producción actual (Razor)    | Migración futura (Angular)  |

---

## 🔧 Troubleshooting

### Problema 1: Guard redirige a login en rutas legacy

**Síntoma:**

```
?token=xxx&route=RestaurantConsumoTpv → Redirige a /auth/login ❌
```

**Causa:**
El guard estaba aplicado a `/legacy` y perdía los query params en la redirección interna.

**Solución:**

```typescript
// app.routes.ts
{
  path: 'legacy',
  // ✅ SIN canActivate - app.ts ya validó
  children: [...]
}
```

**Verificar:**

```javascript
// En consola del navegador
console.log(localStorage.getItem('access_token')); // Debe existir
console.log(window.location.pathname); // Debe ser /legacy/...
```

### Problema 2: Ruta no encontrada en GlobalRoutes

**Síntoma:**

```
?route=MiRutaNueva → Redirige a /dashboard (ruta por defecto)
```

**Causa:**
La ruta no existe en `GlobalRoutes`.

**Solución:**

```typescript
// global-routes.ts
export enum GlobalRoutes {
  MiRutaNueva = 'modulo/mi-ruta-nueva',
}
```

### Problema 3: Permisos no se cargan

**Síntoma:**
Usuario accede pero no tiene permisos.

**Causa:**
JSON de permisos mal formateado.

**Solución:**

```typescript
// En Razor Page, serializar correctamente
const permission = JSON.stringify(permissionsObject);
const url = `http://angular/?token=xxx&route=xxx&permission=${encodeURIComponent(permission)}`;
```

### Problema 4: Layout se muestra en ruta legacy

**Síntoma:**

```
/legacy/inventory/product muestra header y sidebar ❌
```

**Causa:**
Redirección incorrecta, va a `/inventory/product` en lugar de `/legacy/inventory/product`.

**Solución:**

```typescript
// Verificar en app.ts
router.navigate(['/legacy', ...route_page.split('/')]);
//                 ^^^^^^^ Debe incluir /legacy
```

---

## 🧪 Testing

### Test 1: Autenticación Legacy

```bash
# URL de prueba
http://localhost:4200/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&route=Articulo&permission={"acciones":[]}&userRoleData={"codeRole":"ADMIN"}

# Verificar en consola:
localStorage.getItem('access_token')  // → token completo
localStorage.getItem('permisos')      // → {"acciones":[]}
window.location.pathname              // → /legacy/inventory/product

# En pantalla:
✅ Solo componente visible
✅ SIN header
✅ SIN sidebar
✅ SIN footer
```

### Test 2: Acceso Moderno

```bash
# URL de prueba (con token previo en localStorage)
http://localhost:4200/inventory/product

# Verificar en pantalla:
✅ Header visible
✅ Sidebar visible
✅ Componente en el centro
✅ Footer visible
```

### Test 3: Sin Autenticación

```bash
# URL de prueba (sin token)
http://localhost:4200/inventory/product

# Verificar:
✅ Redirige a /auth/login
✅ Query param: ?returnUrl=/inventory/product
```

---

## 🔄 Proceso de Migración Progresiva

### Fase 1: Todo en Legacy (Estado Actual)

```
Razor Page → Angular (/legacy/*) → Sin layout
```

### Fase 2: Habilitar Ruta Moderna

```typescript
// 1. Crear componente Angular moderno
ng generate component modules/inventory/product

// 2. Ya existe en inventory.routes.ts
{
  path: 'product',
  loadComponent: () => import('./product/product.component')
}

// 3. Usuarios pueden acceder de 2 formas:
//    - Legacy: /?token=xxx&route=Articulo → /legacy/inventory/product (sin layout)
//    - Moderno: /inventory/product (con layout)
```

### Fase 3: Migrar Enlaces de Razor

```html
<!-- Antes (legacy) -->
<a href="/RazorPage/Articulo">Productos</a>

<!-- Después (moderno) -->
<a href="http://angular-app/inventory/product">Productos</a>
```

### Fase 4: Marcar como Migrada

```typescript
// route-migration.service.ts
private modernRoutes = new Set<string>([
  GlobalRoutes.Articulo, // ✅ Completamente migrada
]);
```

### Fase 5: Deprecar Razor Page

Una vez que el 100% del tráfico usa Angular:

1. Remover Razor Page
2. Actualizar documentación
3. Opcional: remover de `/legacy` routes

---

## 📚 Debugging y Logs

### Habilitar Logs de Debug

```typescript
// En app.ts, agregar temporalmente:
private handleLegacyAuthentication(token, route, ...) {
  console.warn('[DEBUG] Legacy Auth:', { token, route });

  localStorage.setItem('access_token', token);
  console.warn('[DEBUG] Token saved');

  const route_page = getEnumValueByKey(GlobalRoutes, route);
  console.warn('[DEBUG] Route converted:', route_page);

  router.navigate(['/legacy', ...route_page.split('/')]);
  console.warn('[DEBUG] Navigation initiated');
}
```

### Verificar en DevTools

```javascript
// Application > Local Storage
access_token    → Debe existir
permisos        → Debe ser JSON válido
userRoleData    → Debe ser JSON válido

// Console
// Buscar errores de:
// - Token expirado
// - Ruta no encontrada
// - JSON mal formado
```

---

## 👥 Para el Equipo

### Backend (Razor Pages)

**Responsabilidades:**

- Mantener formato de query params: `token`, `route`, `permission`, `userRoleData`
- No cambiar claves de `GlobalRoutes` sin coordinar con frontend
- Serializar correctamente permisos en JSON
- Usar `encodeURIComponent` para valores complejos

**Ejemplo correcto:**

```csharp
var url = $"http://angular/?token={token}&route=Articulo&permission={HttpUtility.UrlEncode(permissionJson)}";
```

### Frontend (Angular)

**Responsabilidades:**

- Agregar nuevas rutas en **ambos lugares**: `/legacy` y raíz
- Actualizar `GlobalRoutes` para cada nueva página
- Probar **ambos flujos**: legacy y moderno
- Mantener `LegacyLayoutComponent` simple (solo `<router-outlet>`)

**Checklist nueva ruta:**

```
☐ Agregar a GlobalRoutes
☐ Agregar en /legacy children
☐ Agregar en raíz children (moderno)
☐ Probar con ?token=xxx&route=XXX
☐ Probar acceso directo /ruta
```

### QA

**Test Cases:**

1. ✅ Acceso legacy desde Razor con query params
2. ✅ Acceso moderno directo a ruta
3. ✅ Permisos se cargan correctamente
4. ✅ No se muestra layout en rutas legacy
5. ✅ Sí se muestra layout en rutas modernas
6. ✅ Redirección a login cuando no hay token
7. ✅ Token expirado redirige a login

---

## 📝 Resumen de URLs

### Para Testing

```bash
# Legacy - Articulo (Productos)
http://localhost:4200/?token=XXX&route=Articulo&permission={"acciones":[]}&userRoleData={"codeRole":"ADMIN"}

# Legacy - Cliente
http://localhost:4200/?token=XXX&route=Cliente&permission={"acciones":[]}&userRoleData={"codeRole":"ADMIN"}

# Legacy - RestaurantConsumoTpv
http://localhost:4200/?token=XXX&route=RestaurantConsumoTpv&permission={"acciones":[]}&userRoleData={"codeRole":"ADMIN"}

# Moderno - Con token en localStorage
http://localhost:4200/inventory/product
http://localhost:4200/customer/company-customer
http://localhost:4200/restaurant/meal-consumption-list
```

---

## ⚠️ Notas Importantes

1. **Un componente, dos rutas**
   - El mismo `ProductComponent` se usa en:
     - `/legacy/inventory/product` (sin layout)
     - `/inventory/product` (con layout)

2. **GlobalRoutes es crítico**
   - Cada ruta legacy DEBE estar aquí
   - La clave debe coincidir exactamente con el param `route` de Razor

3. **No eliminar rutas legacy prematuramente**
   - Mantener hasta que Razor Pages esté 100% deprecada
   - Monitorear tráfico antes de remover

4. **El guard NO aplica a /legacy**
   - app.ts ya validó la autenticación
   - El guard solo aplica a rutas modernas

---

**Implementado:** Noviembre 2025
**Mantenedor:** Equipo AcontPlus
**Estado:** ✅ Activo en Producción
**Versión:** 1.0
