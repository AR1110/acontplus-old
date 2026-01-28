# Documento de Requisitos - Módulo Administrativo de Ventas y Suscripciones

## Introducción

Este módulo administrativo se enfoca exclusivamente en proporcionar **configuraciones centralizadas** para la gestión de ventas y suscripciones de sistemas multi-industria (ERP, POS, CRM, Contabilidad, E-commerce). El módulo proporciona operaciones CRUD básicas **sin validación de reglas de negocio**, ya que estas serán manejadas por los aplicativos finales que consuman las APIs.

### Alcance del Módulo

**✅ LO QUE SÍ HACE:**
- Configurar catálogo de sistemas y aplicaciones disponibles para venta
- Definir planes de precios y paquetes comerciales
- Configurar jerarquías de productos (ERP, POS por industria, CRM, etc.)
- Gestionar reglas de precios, descuentos y promociones
- Configurar ciclos de facturación y métodos de pago
- Administrar plantillas de contratos y términos
- Proporcionar APIs estructuradas para módulos de ventas

**❌ LO QUE NO HACE:**
- Validar reglas de negocio o elegibilidad de clientes
- Crear o provisionar sistemas/aplicaciones reales
- Procesar pagos o facturación real
- Gestionar usuarios finales de los sistemas
- Implementar lógica específica de cada industria

El objetivo es crear un **catálogo administrativo centralizado** que permita a los módulos de ventas, checkout y facturación consumir configuraciones consistentes para ofrecer y vender soluciones especializadas por industria.

## Requisitos

### Requisito 1: Configuración de Catálogo de Sistemas y Aplicaciones

**Historia de Usuario:** Como administrador del sistema, quiero configurar el catálogo de sistemas disponibles (ERP, POS, CRM, Contabilidad, E-commerce) y sus aplicaciones específicas, para que los módulos de ventas puedan presentar ofertas organizadas por industria y tamaño de empresa.

#### Criterios de Aceptación

1. WHEN un administrador configura propiedades comerciales de un sistema THEN el sistema SHALL almacenar información comercial adicional (descripción comercial, mercado objetivo, tipo de sistema)
2. WHEN un administrador configura aplicaciones comerciales THEN el sistema SHALL permitir agregar propiedades de ventas (precio base, industria objetivo, especialización)
3. WHEN un administrador define especializaciones por industria THEN el sistema SHALL permitir configurar aplicaciones específicas (ej: POS_RESTAURANTE con IndustryTarget: "restaurant")
4. WHEN se consulta el catálogo comercial THEN el sistema SHALL retornar estructura completa con sistemas y aplicaciones incluyendo información comercial
5. WHEN un administrador modifica configuraciones comerciales THEN el sistema SHALL actualizar propiedades sin validar compatibilidad de negocio
6. WHEN se consultan aplicaciones por industria THEN el sistema SHALL filtrar aplicaciones usando la propiedad IndustryTarget

### Requisito 2: Gestión CRUD de Planes de Precios y Paquetes Comerciales

**Historia de Usuario:** Como administrador del sistema, quiero gestionar planes de precios y paquetes comerciales para diferentes industrias y tamaños de empresa, para que los módulos de ventas puedan ofrecer soluciones especializadas.

#### Criterios de Aceptación

1. WHEN un administrador crea un plan de precios THEN el sistema SHALL almacenar información básica (código, nombre, descripción, precio base, sistemas incluidos, aplicaciones incluidas)
2. WHEN un administrador configura paquetes por industria THEN el sistema SHALL permitir definir paquetes específicos (ej: Paquete Restaurante, Paquete Veterinaria)
3. WHEN un administrador actualiza un plan existente THEN el sistema SHALL modificar únicamente los campos especificados sin validar reglas de negocio
4. WHEN se consultan planes THEN el sistema SHALL retornar datos estructurados con filtros por industria, tamaño de empresa y tipo de sistema
5. WHEN un administrador elimina un plan THEN el sistema SHALL realizar eliminación lógica manteniendo integridad referencial
6. WHEN se consultan paquetes comerciales THEN el sistema SHALL incluir información de sistemas, aplicaciones y precios asociados

### Requisito 3: Configuración de Módulos Compartidos vs Especializados

**Historia de Usuario:** Como administrador del sistema, quiero configurar qué módulos son compartidos entre sistemas (clientes, productos, facturación) y cuáles son especializados por industria, para optimizar la reutilización de código y ofrecer experiencias específicas.

#### Criterios de Aceptación

1. WHEN un administrador configura módulos core THEN el sistema SHALL permitir definir módulos compartidos (configuraciones, clientes, proveedores, productos, facturación, seguridad, notificaciones)
2. WHEN un administrador configura especializaciones THEN el sistema SHALL permitir definir módulos específicos por industria (ej: mesas para restaurantes, mascotas para veterinarias)
3. WHEN se consultan configuraciones de módulos THEN el sistema SHALL retornar qué módulos están disponibles para cada sistema e industria usando las relaciones Sistema->Aplicacion existentes
4. WHEN un administrador define herencias THEN el sistema SHALL permitir configurar qué entidades especializadas heredan de entidades base sin crear nuevas tablas de jerarquía
5. WHEN se consulta la estructura de módulos THEN el sistema SHALL retornar mapeo completo de módulos core vs especializados usando propiedades de configuración

### Requisito 4: Configuración de Reglas de Precios por Contexto

**Historia de Usuario:** Como administrador del sistema, quiero configurar reglas de precios diferenciadas por industria, tamaño de empresa y tipo de sistema, para que los módulos de checkout puedan calcular precios correctamente según el contexto del cliente.

#### Criterios de Aceptación

1. WHEN un administrador define precios por industria THEN el sistema SHALL permitir configurar precios específicos (ej: Restaurante $80/mes, Veterinaria $90/mes)
2. WHEN un administrador configura descuentos por volumen THEN el sistema SHALL permitir definir descuentos por cantidad de usuarios o locales
3. WHEN un administrador crea promociones por contexto THEN el sistema SHALL almacenar condiciones específicas por industria o tamaño de empresa
4. WHEN se consultan reglas de precios THEN el sistema SHALL retornar precios aplicables según contexto (industria, tamaño, sistemas incluidos)
5. WHEN un administrador modifica reglas existentes THEN el sistema SHALL actualizar información sin validar aplicabilidad de negocio

### Requisito 5: Configuración de Contextos de Mercado y Segmentación

**Historia de Usuario:** Como administrador del sistema, quiero configurar contextos de mercado y segmentación de clientes por industria y tamaño, para que los módulos de ventas puedan presentar ofertas personalizadas.

#### Criterios de Aceptación

1. WHEN un administrador configura contextos de mercado THEN el sistema SHALL permitir definir segmentos (Micro, Pequeña, Mediana empresa) con características específicas
2. WHEN un administrador define industrias objetivo THEN el sistema SHALL permitir configurar industrias específicas (Servicios Personales, Alimentación, Salud, Retail) con sus características
3. WHEN un administrador configura ofertas por segmento THEN el sistema SHALL permitir asociar paquetes específicos a combinaciones de industria y tamaño
4. WHEN se consultan contextos THEN el sistema SHALL retornar configuraciones completas de segmentación con paquetes aplicables
5. WHEN un administrador modifica segmentaciones THEN el sistema SHALL actualizar configuraciones sin validar lógica de negocio

### Requisito 6: Configuración de Ciclos de Facturación y Métodos de Pago

**Historia de Usuario:** Como administrador del sistema, quiero configurar ciclos de facturación y métodos de pago disponibles por región y tipo de plan, para que los módulos de facturación y checkout puedan procesar suscripciones correctamente.

#### Criterios de Aceptación

1. WHEN un administrador configura ciclos de facturación THEN el sistema SHALL permitir definir frecuencias (mensual, trimestral, anual) con configuraciones específicas por plan
2. WHEN un administrador configura métodos de pago THEN el sistema SHALL permitir definir métodos disponibles por país/región (tarjetas, transferencias, PayPal, etc.)
3. WHEN un administrador asocia métodos a planes THEN el sistema SHALL permitir configurar qué métodos están disponibles para cada tipo de plan
4. WHEN se consultan configuraciones de facturación THEN el sistema SHALL retornar estructura completa con ciclos, métodos de pago y configuraciones por región
5. WHEN un administrador modifica configuraciones THEN el sistema SHALL actualizar información sin validar procesamiento de pagos

### Requisito 7: Configuración de Plantillas de Contratos y Términos por Industria

**Historia de Usuario:** Como administrador del sistema, quiero configurar plantillas de contratos y términos específicos por industria y tipo de plan, para que los módulos de ventas puedan generar documentos personalizados según el contexto del cliente.

#### Criterios de Aceptación

1. WHEN un administrador crea plantillas por industria THEN el sistema SHALL permitir definir plantillas específicas (ej: contrato para restaurantes, contrato para veterinarias)
2. WHEN un administrador configura términos por contexto THEN el sistema SHALL permitir asociar términos específicos a combinaciones de industria y tamaño de empresa
3. WHEN se consultan plantillas THEN el sistema SHALL retornar plantillas aplicables según contexto del cliente (industria, plan, región)
4. WHEN un administrador versiona plantillas THEN el sistema SHALL mantener historial de versiones con aplicabilidad por contexto
5. WHEN se configuran variables de plantillas THEN el sistema SHALL permitir definir variables específicas por industria y tipo de negocio

### Requisito 8: Configuración de Esquemas de Checkout por Contexto

**Historia de Usuario:** Como administrador del sistema, quiero configurar esquemas de checkout personalizados por industria y región, incluyendo impuestos, métodos de pago y configuraciones específicas, para que los módulos de checkout puedan ofrecer experiencias optimizadas.

#### Criterios de Aceptación

1. WHEN un administrador configura checkout por industria THEN el sistema SHALL permitir definir configuraciones específicas (ej: checkout simplificado para barberías, checkout con citas para veterinarias)
2. WHEN un administrador configura impuestos por región THEN el sistema SHALL permitir definir tasas específicas por país/estado sin validar jurisdicciones fiscales
3. WHEN se consultan configuraciones de checkout THEN el sistema SHALL retornar estructura completa (plan + precios + impuestos + métodos de pago + configuraciones específicas) según contexto
4. WHEN un administrador configura flujos de checkout THEN el sistema SHALL permitir definir pasos específicos por tipo de plan e industria
5. WHEN se modifican configuraciones THEN el sistema SHALL actualizar esquemas inmediatamente sin validar lógica de procesamiento de pagos