# Plan de Migración AngularJS a Angular Modern - AcontPlus

## Resumen Ejecutivo

Este documento presenta un plan detallado de migración del código legacy AngularJS ubicado en `src/webapps/webui` hacia la aplicación Angular moderna en `src/webapps/client`. El plan está estructurado para completarse en **3 meses** (hasta fin de noviembre) con **2 desarrolladores** trabajando **4 horas diarias** en promedio.

## Estado Actual del Proyecto

### Módulos ya implementados en Angular Modern (`src/webapps/client`)

✅ **Completamente implementados:**
- **Configuración** (`/config`) - Módulo base con funcionalidades de configuración general
- **Compras** (`/purchase`) - Funcionalidades básicas de compras implementadas
- **Inventario** (`/inventory`) - Gestión de productos, categorías, marcas, modelos
- **Facturación** (`/billing`) - Facturación electrónica y documentos
- **Contabilidad** (`/accounting`) - Gestión contable completa
- **Ventas** (`/sale`) - Funcionalidades básicas de ventas
- **Autenticación** (`/auth`) - Sistema de autenticación
- **Soporte Técnico** (`/technical-support`) - Módulo de soporte
- **Restaurante** (`/restaurant`) - Módulo de restaurante
- **Mecánica** (`/mechanical`) - Módulo de mecánica
- **Veterinaria** (`/vet`) - Módulo de veterinaria
- **Barber Shop** (`/barber-shop`) - Módulo de barbería
- **Loyalty** (`/loyalty`) - Módulo de lealtad

### Módulos legacy que requieren migración (`src/webapps/webui`)

🔄 **Pendientes de migración:**
- **APIs Base/Críticas** - Servicios core y configuración
- **Configuración** - Funcionalidades avanzadas de configuración
- **Compras** - Funcionalidades avanzadas y reportes
- **Inventario** - Funcionalidades avanzadas de inventario
- **Facturación** - Funcionalidades avanzadas de facturación
- **Contabilidad** - Funcionalidades avanzadas contables
- **Ventas** - Funcionalidades avanzadas de ventas
- **Identity** - Gestión de identidad y usuarios

## Plan de Migración - 3 Meses

### **FASE 1: APIs Base/Críticas (Semanas 1-2)**

**Objetivo:** Establecer la base sólida para la migración

#### Semana 1 (Agosto 12-16)
- **Día 1-2:** Análisis y documentación de APIs base críticas
  - Revisar servicios core en `src/Services/Common`
  - Documentar endpoints y funcionalidades críticas
  - Identificar dependencias entre módulos

- **Día 3-4:** Migración de servicios base
  - Migrar servicios de autenticación y autorización
  - Implementar interceptors HTTP para manejo de tokens
  - Configurar manejo de errores global

- **Día 5:** Testing y validación
  - Pruebas unitarias de servicios base
  - Validación de integración con backend

#### Semana 2 (Agosto 19-23)
- **Día 1-2:** Configuración de arquitectura
  - Implementar patrón de arquitectura limpia
  - Configurar inyección de dependencias
  - Establecer estructura de carpetas estándar

- **Día 3-4:** Servicios de configuración
  - Migrar servicios de configuración general
  - Implementar gestión de parámetros del sistema
  - Configurar manejo de configuraciones por ambiente

- **Día 5:** Documentación y revisión
  - Documentar APIs base
  - Revisión de código y estándares

**Entregables Fase 1:**
- APIs base críticas migradas y documentadas
- Arquitectura base establecida
- Servicios de configuración implementados

### **FASE 2: Configuración (Semanas 3-4)**

**Objetivo:** Completar la migración del módulo de configuración

#### Semana 3 (Agosto 26-30)
- **Día 1-2:** Análisis de funcionalidades de configuración
  - Revisar `src/WebApps/WebUI/wwwroot/js/config`
  - Identificar funcionalidades faltantes en Angular modern
  - Documentar requerimientos específicos

- **Día 3-4:** Migración de componentes de configuración
  - Implementar gestión de usuarios y perfiles
  - Migrar configuración de establecimientos
  - Implementar gestión de permisos

- **Día 5:** Testing y validación
  - Pruebas de funcionalidades de configuración
  - Validación de integración

#### Semana 4 (Septiembre 2-6)
- **Día 1-2:** Configuración avanzada
  - Migrar configuración de documentos
  - Implementar gestión de impresoras
  - Migrar configuración de tiempo de crédito

- **Día 3-4:** Reportes y validaciones
  - Implementar reportes de configuración
  - Migrar validaciones y reglas de negocio
  - Testing de funcionalidades completas

- **Día 5:** Documentación y entrega
  - Documentar módulo de configuración
  - Revisión final y entrega

**Entregables Fase 2:**
- Módulo de configuración completamente migrado
- Funcionalidades avanzadas implementadas
- Documentación completa del módulo

### **FASE 3: Compras (Semanas 5-6)**

**Objetivo:** Completar la migración del módulo de compras

#### Semana 5 (Septiembre 9-13)
- **Día 1-2:** Análisis de funcionalidades de compras
  - Revisar `src/WebApps/WebUI/wwwroot/js/compras`
  - Identificar funcionalidades faltantes
  - Documentar procesos de compras

- **Día 3-4:** Migración de componentes principales
  - Implementar gestión de proveedores
  - Migrar órdenes de compra
  - Implementar recepción de mercancías

- **Día 5:** Testing y validación
  - Pruebas de flujos de compras
  - Validación de integración con inventario

#### Semana 6 (Septiembre 16-20)
- **Día 1-2:** Funcionalidades avanzadas
  - Migrar reportes de compras
  - Implementar gestión de facturas físicas
  - Migrar retenciones ATS

- **Día 3-4:** Integración y optimización
  - Integrar con módulo de inventario
  - Optimizar performance de consultas
  - Implementar validaciones avanzadas

- **Día 5:** Documentación y entrega
  - Documentar módulo de compras
  - Revisión final y entrega

**Entregables Fase 3:**
- Módulo de compras completamente migrado
- Integración con inventario
- Reportes y funcionalidades avanzadas

### **FASE 4: Inventario (Semanas 7-8)**

**Objetivo:** Completar la migración del módulo de inventario

#### Semana 7 (Septiembre 23-27)
- **Día 1-2:** Análisis de funcionalidades de inventario
  - Revisar `src/WebApps/WebUI/wwwroot/js/inventario`
  - Identificar funcionalidades faltantes
  - Documentar procesos de inventario

- **Día 3-4:** Migración de componentes principales
  - Implementar gestión de productos avanzada
  - Migrar control de lotes
  - Implementar transferencias entre bodegas

- **Día 5:** Testing y validación
  - Pruebas de flujos de inventario
  - Validación de integración

#### Semana 8 (Septiembre 30 - Octubre 4)
- **Día 1-2:** Funcionalidades avanzadas
  - Migrar ajustes de inventario
  - Implementar reportes de inventario
  - Migrar gestión de precios por lote

- **Día 3-4:** Integración y optimización
  - Integrar con módulos de compras y ventas
  - Optimizar consultas de inventario
  - Implementar validaciones avanzadas

- **Día 5:** Documentación y entrega
  - Documentar módulo de inventario
  - Revisión final y entrega

**Entregables Fase 4:**
- Módulo de inventario completamente migrado
- Integración con compras y ventas
- Reportes y funcionalidades avanzadas

### **FASE 5: Facturación (Semanas 9-10)**

**Objetivo:** Completar la migración del módulo de facturación

#### Semana 9 (Octubre 7-11)
- **Día 1-2:** Análisis de funcionalidades de facturación
  - Revisar `src/WebApps/WebUI/wwwroot/js/factElect`
  - Identificar funcionalidades faltantes
  - Documentar procesos de facturación

- **Día 3-4:** Migración de componentes principales
  - Implementar facturación electrónica
  - Migrar gestión de documentos electrónicos
  - Implementar guías de remisión

- **Día 5:** Testing y validación
  - Pruebas de flujos de facturación
  - Validación de integración con SRI

#### Semana 10 (Octubre 14-18)
- **Día 1-2:** Funcionalidades avanzadas
  - Migrar reportes tributarios
  - Implementar gestión de ATS
  - Migrar validaciones SRI

- **Día 3-4:** Integración y optimización
  - Integrar con módulos de ventas y contabilidad
  - Optimizar performance de facturación
  - Implementar validaciones avanzadas

- **Día 5:** Documentación y entrega
  - Documentar módulo de facturación
  - Revisión final y entrega

**Entregables Fase 5:**
- Módulo de facturación completamente migrado
- Integración con SRI
- Reportes tributarios y funcionalidades avanzadas

### **FASE 6: Contabilidad (Semanas 11-12)**

**Objetivo:** Completar la migración del módulo de contabilidad

#### Semana 11 (Octubre 21-25)
- **Día 1-2:** Análisis de funcionalidades de contabilidad
  - Revisar `src/WebApps/WebUI/wwwroot/js/contabilidad`
  - Identificar funcionalidades faltantes
  - Documentar procesos contables

- **Día 3-4:** Migración de componentes principales
  - Implementar gestión de cuentas por cobrar/pagar
  - Migrar comprobantes de ingreso/egreso
  - Implementar gestión de caja

- **Día 5:** Testing y validación
  - Pruebas de flujos contables
  - Validación de integración

#### Semana 12 (Octubre 28 - Noviembre 1)
- **Día 1-2:** Funcionalidades avanzadas
  - Migrar reportes contables
  - Implementar resumen contable
  - Migrar gestión de categorías y subcategorías

- **Día 3-4:** Integración y optimización
  - Integrar con módulos de facturación y ventas
  - Optimizar consultas contables
  - Implementar validaciones avanzadas

- **Día 5:** Documentación y entrega
  - Documentar módulo de contabilidad
  - Revisión final y entrega

**Entregables Fase 6:**
- Módulo de contabilidad completamente migrado
- Integración con facturación y ventas
- Reportes contables y funcionalidades avanzadas

### **FASE 7: Ventas e Identity (Semana 13)**

**Objetivo:** Completar la migración de ventas e identity

#### Semana 13 (Noviembre 4-8)
- **Día 1-2:** Migración de ventas avanzadas
  - Revisar `src/WebApps/WebUI/wwwroot/js/ventas`
  - Implementar funcionalidades avanzadas de ventas
  - Migrar reportes de ventas

- **Día 3-4:** Migración de identity
  - Revisar `src/Services/Identity`
  - Implementar gestión avanzada de usuarios
  - Migrar gestión de roles y permisos

- **Día 5:** Testing final e integración
  - Testing completo de todos los módulos
  - Validación de integración general
  - Documentación final

**Entregables Fase 7:**
- Módulos de ventas e identity completamente migrados
- Testing completo de la aplicación
- Documentación final del proyecto

## Recursos y Herramientas

### Equipo
- **2 Desarrolladores** trabajando 4 horas diarias
- **1 Tech Lead** para supervisión y arquitectura
- **1 QA** para testing y validación

### Herramientas
- **IDE:** Visual Studio Code / Visual Studio
- **Control de versiones:** Git
- **Testing:** Jest + Angular Testing Utilities
- **Documentación:** Markdown + Swagger
- **CI/CD:** Azure DevOps / GitHub Actions

### Tecnologías
- **Frontend:** Angular 20.x, TypeScript, RxJS
- **UI Framework:** Angular Material, Bootstrap 5
- **State Management:** NgRx Signals
- **HTTP Client:** Angular HttpClient
- **Testing:** Jest, Angular Testing Utilities

## Riesgos y Mitigaciones

### Riesgos Identificados
1. **Complejidad de integración** entre módulos legacy y modernos
2. **Dependencias externas** no documentadas
3. **Performance** de la aplicación migrada
4. **Compatibilidad** con navegadores
5. **Testing** de funcionalidades complejas

### Estrategias de Mitigación
1. **Análisis detallado** antes de cada fase
2. **Testing continuo** durante el desarrollo
3. **Documentación** exhaustiva de cada módulo
4. **Code reviews** regulares
5. **Backup** y versionado de código legacy

## Métricas de Éxito

### Técnicas
- ✅ **100% de módulos** migrados exitosamente
- ✅ **0 errores críticos** en producción
- ✅ **Performance** igual o mejor que la versión legacy
- ✅ **Cobertura de testing** > 80%

### Funcionales
- ✅ **Todas las funcionalidades** legacy implementadas
- ✅ **UX mejorada** en la nueva aplicación
- ✅ **Documentación completa** de todos los módulos
- ✅ **Entrenamiento** del equipo en Angular modern

## Cronograma Resumido

| Fase | Semanas | Módulos | Entregables |
|------|---------|---------|-------------|
| 1 | 1-2 | APIs Base/Críticas | Arquitectura base, servicios core |
| 2 | 3-4 | Configuración | Módulo de configuración completo |
| 3 | 5-6 | Compras | Módulo de compras completo |
| 4 | 7-8 | Inventario | Módulo de inventario completo |
| 5 | 9-10 | Facturación | Módulo de facturación completo |
| 6 | 11-12 | Contabilidad | Módulo de contabilidad completo |
| 7 | 13 | Ventas + Identity | Módulos completos + testing final |

## Conclusión

Este plan de migración está diseñado para completar exitosamente la transición de AngularJS a Angular modern en un período de 3 meses, manteniendo la funcionalidad completa de la aplicación mientras se mejora la arquitectura, performance y mantenibilidad del código.

La estrategia de migración por fases permite:
- **Reducción de riesgos** mediante entregas incrementales
- **Validación continua** de funcionalidades
- **Flexibilidad** para ajustes según necesidades
- **Trazabilidad** clara del progreso

El equipo tendrá la capacidad de completar esta migración exitosamente, entregando una aplicación moderna, robusta y mantenible para AcontPlus.
