# Plan de Implementación - Módulo Administrativo de Ventas y Suscripciones

## Visión General

Este plan de implementación se enfoca en crear un módulo administrativo de configuraciones para ventas y suscripciones de sistemas multi-industria. El desarrollo seguirá un enfoque incremental, priorizando la reutilización de entidades existentes y la creación mínima de nuevas entidades.

## Tareas de Implementación

- [ ] 1. Configurar estructura base y entidades core compartidas

  - Crear entidades base para módulos compartidos (Customer, Product, Invoice base)
  - Extender entidades existentes (Coupon, SubscriptionType) con nuevas propiedades comerciales
  - Aprovechar Sistema y Aplicacion existentes para jerarquías comerciales
  - Configurar herencia y composición para especialización por industria
  - _Requisitos: 1.1, 1.2, 3.1, 3.2_

- [ ] 2. Configurar catálogo de sistemas y aplicaciones (reutilizando Sistema existente)

  - [ ] 2.1 Extender Sistema y Aplicacion existentes para contexto comercial

    - Agregar propiedades comerciales a Sistema (descripción comercial, target de mercado)
    - Extender Aplicacion con propiedades para ventas (precio base, industria objetivo)
    - Crear enumeraciones IndustryType y SystemType para clasificación comercial
    - Escribir unit tests para extensiones de entidades existentes
    - _Requisitos: 1.1, 1.3_

  - [ ] 2.2 Implementar servicios de gestión de catálogo comercial

    - Extender servicios existentes con operaciones comerciales
    - Crear métodos para consultar sistemas por industria y tamaño de empresa
    - Implementar filtros para aplicaciones disponibles por contexto
    - Escribir unit tests para servicios de catálogo comercial
    - _Requisitos: 1.4, 1.5_

  - [ ] 2.3 Crear DTOs comerciales para sistemas y aplicaciones
    - Implementar SistemaComercialDto con información de ventas
    - Crear AplicacionComercialDto con precios y contexto de mercado
    - Implementar CatalogoDto con estructura completa para ventas
    - Escribir unit tests para DTOs comerciales
    - _Requisitos: 1.4, 1.6_

- [ ] 3. Desarrollar sistema de planes y paquetes comerciales

  - [ ] 3.1 Extender PricingPlan existente para contextos multi-industria

    - Agregar propiedades para industria y tamaño de empresa objetivo
    - Implementar relaciones con sistemas y aplicaciones incluidas
    - Crear configuraciones específicas por contexto de mercado
    - Escribir unit tests para extensiones de PricingPlan
    - _Requisitos: 2.1, 2.2_

  - [ ] 3.2 Implementar paquetes comerciales especializados

    - Crear configuraciones de paquetes por industria (Restaurante, Veterinaria, etc.)
    - Implementar lógica para asociar sistemas y aplicaciones a paquetes
    - Crear validaciones básicas de estructura sin lógica de negocio
    - Escribir unit tests para paquetes comerciales
    - _Requisitos: 2.2, 2.4_

  - [ ] 3.3 Desarrollar servicios de gestión de planes comerciales
    - Extender IPricingPlanService con operaciones específicas por contexto
    - Implementar filtros por industria, tamaño de empresa y tipo de sistema
    - Crear métodos para consultar paquetes disponibles por contexto
    - Escribir unit tests para servicios de planes comerciales
    - _Requisitos: 2.4, 2.6_

- [ ] 4. Configurar módulos compartidos vs especializados

  - [ ] 4.1 Crear entidades base compartidas (Customer, Product, Invoice)

    - Implementar Customer base con propiedades comunes
    - Crear Product base con funcionalidades compartidas
    - Implementar Invoice base para facturación común
    - Escribir unit tests para entidades base
    - _Requisitos: 3.1, 3.2_

  - [ ] 4.2 Implementar especializaciones por industria

    - Crear VeterinaryOwner, RestaurantCustomer (heredan de Customer)
    - Implementar RestaurantTable, VeterinaryPet (entidades especializadas)
    - Crear interfaces para funcionalidades compartidas (IInventoryManagement)
    - Escribir unit tests para especializaciones
    - _Requisitos: 3.2, 3.4_

  - [ ] 4.3 Desarrollar configuración de contextos de sistema
    - Crear SystemContext para configurar módulos por industria
    - Implementar ContextConfigurations con configuraciones predefinidas
    - Crear servicios para gestionar configuraciones de contexto
    - Escribir unit tests para configuraciones de contexto
    - _Requisitos: 3.3, 3.5_

- [ ] 5. Implementar sistema de precios por contexto

  - [ ] 5.1 Extender sistema de cupones y descuentos existente

    - Extender Coupon con propiedades para promociones y contexto
    - Implementar CouponType y DiscountType enumeraciones
    - Agregar condiciones de aplicación por industria y tamaño
    - Escribir unit tests para sistema de cupones extendido
    - _Requisitos: 4.1, 4.3_

  - [ ] 5.2 Crear reglas de precios diferenciadas

    - Implementar precios específicos por industria y tamaño de empresa
    - Crear lógica para descuentos por volumen y contexto
    - Implementar promociones específicas por segmento de mercado
    - Escribir unit tests para reglas de precios contextuales
    - _Requisitos: 4.1, 4.2, 4.4_

  - [ ] 5.3 Desarrollar servicios de cálculo de precios
    - Crear IPricingService con métodos de cálculo por contexto
    - Implementar PricingService con lógica de precios diferenciados
    - Crear métodos para consultar precios aplicables por contexto
    - Escribir unit tests para servicios de precios
    - _Requisitos: 4.4, 4.5_

- [ ] 6. Configurar segmentación de mercado

  - [ ] 6.1 Crear entidades para contextos de mercado

    - Implementar MarketContext con segmentación por industria y tamaño
    - Crear IndustryType y CompanySize enumeraciones
    - Implementar relaciones entre contextos y paquetes comerciales
    - Escribir unit tests para entidades de mercado
    - _Requisitos: 5.1, 5.2_

  - [ ] 6.2 Implementar configuraciones de segmentación

    - Crear configuraciones predefinidas por segmento (Micro, Pequeña, Mediana)
    - Implementar asociaciones entre segmentos y ofertas específicas
    - Crear servicios para gestionar segmentación de mercado
    - Escribir unit tests para configuraciones de segmentación
    - _Requisitos: 5.3, 5.4_

  - [ ] 6.3 Desarrollar APIs de consulta por segmento
    - Crear endpoints para consultar ofertas por industria y tamaño
    - Implementar filtros avanzados por contexto de mercado
    - Crear DTOs específicos para respuestas segmentadas
    - Escribir integration tests para APIs de segmentación
    - _Requisitos: 5.4, 5.5_

- [ ] 7. Implementar configuración de facturación y pagos

  - [ ] 7.1 Extender SubscriptionType para ciclos de facturación

    - Agregar propiedades para configuración de facturación avanzada
    - Implementar BillingConfiguration para configuraciones específicas
    - Crear relaciones entre planes y configuraciones de facturación
    - Escribir unit tests para configuraciones de facturación
    - _Requisitos: 6.1, 6.2_

  - [ ] 7.2 Crear sistema de métodos de pago

    - Implementar PaymentMethod con configuración por región
    - Crear PaymentType enumeración con métodos disponibles
    - Implementar relaciones entre métodos de pago y planes
    - Escribir unit tests para métodos de pago
    - _Requisitos: 6.2, 6.3_

  - [ ] 7.3 Desarrollar servicios de configuración de facturación
    - Crear IBillingConfigService con operaciones CRUD
    - Implementar BillingConfigService con lógica de configuración
    - Crear métodos para consultar configuraciones por plan y región
    - Escribir unit tests para servicios de facturación
    - _Requisitos: 6.4, 6.5_

- [ ] 8. Configurar plantillas de contratos por industria

  - [ ] 8.1 Crear sistema de plantillas de contratos

    - Implementar ContractTemplate con contenido y variables
    - Crear ContractType enumeración para tipos de contrato
    - Implementar SubscriptionTerms para términos por suscripción
    - Escribir unit tests para plantillas de contratos
    - _Requisitos: 7.1, 7.2_

  - [ ] 8.2 Implementar personalización por industria

    - Crear plantillas específicas por industria y contexto
    - Implementar variables de sustitución específicas por negocio
    - Crear versionado de plantillas con aplicabilidad por contexto
    - Escribir unit tests para personalización de plantillas
    - _Requisitos: 7.1, 7.3_

  - [ ] 8.3 Desarrollar servicios de gestión de contratos
    - Crear IContractService con operaciones de plantillas
    - Implementar ContractService con lógica de personalización
    - Crear métodos para consultar plantillas aplicables por contexto
    - Escribir unit tests para servicios de contratos
    - _Requisitos: 7.4, 7.5_

- [ ] 9. Implementar configuración de checkout por contexto

  - [ ] 9.1 Crear sistema de configuración de impuestos

    - Implementar TaxConfiguration con tasas por región
    - Crear TaxType enumeración para tipos de impuestos
    - Implementar relaciones entre impuestos y planes
    - Escribir unit tests para configuración de impuestos
    - _Requisitos: 8.2, 8.3_

  - [ ] 9.2 Desarrollar CheckoutConfiguration personalizada

    - Crear CheckoutConfiguration con configuraciones por industria
    - Implementar flujos de checkout específicos por contexto
    - Crear relaciones entre configuraciones y planes/regiones
    - Escribir unit tests para configuraciones de checkout
    - _Requisitos: 8.1, 8.4_

  - [ ] 9.3 Implementar servicios de checkout contextual
    - Crear ICheckoutService con operaciones por contexto
    - Implementar CheckoutService con lógica de personalización
    - Crear métodos para consultar configuraciones completas
    - Escribir unit tests para servicios de checkout
    - _Requisitos: 8.3, 8.5_

- [ ] 10. Desarrollar APIs REST para módulo administrativo

  - [ ] 10.1 Crear controladores para catálogo comercial

    - Extender controladores existentes de Sistema/Aplicacion con endpoints comerciales
    - Crear endpoints para consultar catálogo por industria y tamaño de empresa
    - Implementar filtros comerciales sin lógica de negocio
    - Escribir integration tests para APIs de catálogo comercial
    - _Requisitos: 1.4, 1.6_

  - [ ] 10.2 Implementar controladores de planes comerciales

    - Crear PricingPlansController extendido con filtros por contexto
    - Implementar endpoints para paquetes comerciales por industria
    - Crear endpoints para consultar precios por segmento
    - Escribir integration tests para APIs de planes
    - _Requisitos: 2.4, 2.6, 4.4_

  - [ ] 10.3 Desarrollar controladores de configuración
    - Crear BillingController para configuraciones de facturación
    - Implementar ContractsController para plantillas por industria
    - Crear CheckoutController para configuraciones contextuales
    - Escribir integration tests para APIs de configuración
    - _Requisitos: 6.4, 7.4, 8.3_

- [ ] 11. Implementar sistema de respuestas estructuradas

  - [ ] 11.1 Crear DTOs completos para respuestas de APIs

    - Implementar CheckoutDataDto con información contextual completa
    - Crear MarketSegmentDto para respuestas de segmentación
    - Implementar PricingContextDto para precios por contexto
    - Escribir unit tests para DTOs de respuesta
    - _Requisitos: 5.4, 8.3_

  - [ ] 11.2 Desarrollar formato de respuesta estándar

    - Implementar ApiResponse<T> para respuestas consistentes
    - Crear ErrorResponse para manejo de errores estructurado
    - Implementar middleware para formateo automático de respuestas
    - Escribir integration tests para formato de respuestas
    - _Requisitos: Todos los requisitos_

  - [ ] 11.3 Crear documentación de APIs
    - Implementar Swagger/OpenAPI para documentación automática
    - Crear ejemplos de respuestas para cada endpoint
    - Documentar filtros y parámetros de consulta por contexto
    - Escribir tests de documentación de APIs
    - _Requisitos: Todos los requisitos_

- [ ] 12. Configurar testing y validación

  - [ ] 12.1 Implementar suite de unit tests

    - Crear tests para todas las entidades y servicios
    - Implementar tests para lógica de herencia y especialización
    - Crear tests para configuraciones de contexto
    - Configurar coverage mínimo del 80%
    - _Requisitos: Todos los requisitos_

  - [ ] 12.2 Desarrollar integration tests

    - Crear tests para todos los endpoints de APIs
    - Implementar tests para flujos completos de configuración
    - Crear tests para consultas complejas por contexto
    - Configurar tests con base de datos en memoria
    - _Requisitos: Todos los requisitos_

  - [ ] 12.3 Implementar tests de performance
    - Crear tests para consultas de catálogo completo
    - Implementar tests para cálculos de precios por contexto
    - Crear tests para respuestas de checkout con múltiples configuraciones
    - Configurar benchmarks de performance
    - _Requisitos: 1.4, 4.4, 8.3_

## Notas de Implementación

### Prioridades de Desarrollo

1. **Fase 1**: Entidades base y jerarquías (Tareas 1-2)
2. **Fase 2**: Planes comerciales y contextos (Tareas 3-4)
3. **Fase 3**: Precios y segmentación (Tareas 5-6)
4. **Fase 4**: Configuraciones avanzadas (Tareas 7-8)
5. **Fase 5**: APIs y testing (Tareas 9-12)

### Consideraciones Técnicas

- Maximizar reutilización de entidades existentes (80% del código)
- Usar herencia para especialización por industria
- Implementar interfaces para funcionalidades compartidas
- Configurar lazy loading para relaciones complejas
- Usar caching para configuraciones estáticas

### Criterios de Aceptación

- Todas las operaciones CRUD funcionan sin validación de negocio
- APIs retornan datos estructurados por contexto
- Configuraciones son consumibles por módulos de ventas
- Performance adecuada para catálogos grandes
- Cobertura de tests mínima del 80%#

# Aclaración sobre ApplicationHierarchy

### **¿Por qué NO necesitamos ApplicationHierarchy?**

Tienes razón al cuestionar `ApplicationHierarchy`. Analizando la estructura existente:

**✅ Ya existe:**

- `Config.Sistema` - Agrupa aplicaciones por sistema (ERP, POS, CRM, etc.)
- `Config.Aplicacion` - Aplicaciones específicas dentro de cada sistema
- Relación `Sistema -> Aplicaciones` ya establecida

**❌ ApplicationHierarchy sería redundante porque:**

- La jerarquía ya existe: `Sistema.Aplicaciones`
- No necesitamos relaciones padre-hijo complejas entre aplicaciones
- La especialización por industria se maneja a nivel de configuración, no de entidad

### **Enfoque Simplificado:**

```csharp
// En lugar de crear ApplicationHierarchy, simplemente extendemos:

public partial class Sistema
{
    // Propiedades comerciales
    public string? CommercialDescription { get; set; }
    public string? TargetMarket { get; set; }
    public SystemType SystemType { get; set; } // ERP, POS, CRM, etc.
}

public partial class Aplicacion
{
    // Propiedades comerciales
    public decimal? BasePrice { get; set; }
    public string? IndustryTarget { get; set; } // "restaurant", "veterinary", etc.
    public bool IsSpecializedByIndustry { get; set; }
}
```

### **Estructura Comercial Resultante:**

```
Sistema ERP
├── Aplicacion: Inventarios
├── Aplicacion: Compras
├── Aplicacion: Ventas ERP
└── Aplicacion: Producción

Sistema POS
├── Aplicacion: POS Restaurante (IndustryTarget: "restaurant")
├── Aplicacion: POS Veterinaria (IndustryTarget: "veterinary")
├── Aplicacion: POS Barbería (IndustryTarget: "barbershop")
└── Aplicacion: POS General

Sistema CRM
├── Aplicacion: Leads
├── Aplicacion: Clientes
└── Aplicacion: Marketing
```

Esta estructura es **más simple, reutiliza entidades existentes y cumple todos los requisitos** sin agregar complejidad innecesaria.

**Resultado:** El plan actualizado elimina `ApplicationHierarchy` y se enfoca en extender `Sistema` y `Aplicacion` existentes con propiedades comerciales.
