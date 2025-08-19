use [Acontplus]
go 

--ALTER TABLE documentoElectronico ADD idTipoDocumento BIGINT CONSTRAINT FK_TipoDoc_DocElect REFERENCES dbo.TipoDocumento(idTipoDocumento)
--
--select top 10 * from documentoElectronico

--UPDATE de set
--    de.idTipoDocumento = (select top 1 idTipoDocumento from tipoDocumento td where td.codigoSri = de.codDoc )
--FROM dbo.DocumentoElectronico de
--ALTER TABLE documentoElectronico ALTER COLUMN idTipoDocumento BIGINT NOT NULL

--> ALTER TABLE DocumentoElectronico ALTER COLUMN idTipoDocumento BIGINT NOT NULL

--ALTER TABLE DocumentoElectronico ADD serieComprobante VARCHAR(50)

--select top 10 * from documentoElectronico

--UPDATE de set
--    de.serieComprobante = es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(de.nroDocumento AS VARCHAR(9)),9)
--FROM DocumentoElectronico de WITH (ROWLOCK)
--INNER JOIN dbo.PuntoEmision pe with (rowlock) on pe.idPuntoEmision = de.idPuntoEmision
--inner join Sri.Establecimiento es with (rowlock) on es.idEstablecimiento= pe.idEstablecimiento

--ALTER TABLE DocumentoElectronico ALTER COLUMN serieComprobante VARCHAR(50) NOT NULL

--ALTER TABLE dbo.DocumentoElectronico DROP COLUMN codDoc

--ALTER TABLE dbo.DocumentoElectronico DROP COLUMN idDocumento
--ALTER TABLE dbo.DocumentoElectronico DROP CONSTRAINT fk_de_entidad

--ALTER TABLE dbo.DocumentoElectronico DROP COLUMN idEntidad


declare @sri_validaciones as table (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo_regla NVARCHAR(20) NOT NULL UNIQUE, -- Código interno para la regla
    nombre_regla NVARCHAR(200) NOT NULL, -- Nombre descriptivo
    descripcion NVARCHAR(500) NOT NULL, -- Explicación para el contador
    
    -- Condiciones (cuándo aplica la regla)
    tipo_documento NVARCHAR(2) NULL, -- Código del tipo de documento
    tipo_identificacion NVARCHAR(2) NULL, -- Código del tipo de identificación
    monto_desde DECIMAL(18,2) NULL, -- Monto mínimo para que aplique
    monto_hasta DECIMAL(18,2) NULL, -- Monto máximo para que aplique
    
    -- Validaciones (qué debe cumplir)
    forma_pago_requerida NVARCHAR(2) NULL, -- Forma de pago obligatoria
    identificacion_requerida NVARCHAR(13) NULL, -- Identificación específica requerida
    campo_obligatorio NVARCHAR(50) NULL, -- Campo que debe estar lleno
    valor_no_permitido NVARCHAR(100) NULL, -- Valor que NO se permite
    valor_requerido NVARCHAR(100) NULL, -- Valor específico requerido
    
    -- Acción cuando no cumple
    bloquear_transaccion BIT DEFAULT 1, -- Si debe bloquear o solo advertir
    mensaje_error NVARCHAR(300) NOT NULL, -- Mensaje para mostrar al usuario
    
    -- Control
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    observaciones NVARCHAR(300) NULL
);

-- =====================================================
-- VALIDACIONES BASADAS EN TUS EJEMPLOS
-- =====================================================

-- 1. Factura (01) o Retención (07) según el caso
INSERT INTO @sri_validaciones (
    codigo_regla, nombre_regla, descripcion, 
    tipo_documento, tipo_identificacion,
    mensaje_error
) VALUES 
(
    'DOC_RETENCION', 
    'Documento para retención',
    'Cuando hay retención usar código 07, para factura normal usar 01',
    '07', -- Retención
    NULL,
    'Para retenciones debe usar el documento tipo 07'
);

-- 2. Monto > $500 requiere forma de pago 10 para facturas
INSERT INTO @sri_validaciones (
    codigo_regla, nombre_regla, descripcion,
    tipo_documento, monto_desde, forma_pago_requerida,
    mensaje_error
) VALUES 
(
    'PAGO_MONTO_ALTO',
    'Forma de pago para montos altos',
    'Si la factura excede $500, la forma de pago debe ser código específico',
    '01', -- Factura
    500.01,
    '20', -- OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO (asumiendo que es el código 10 que mencionas)
    'Para montos superiores a $500.00 debe usar forma de pago sistema financiero'
);

-- 3. Consumidor final debe ser 9999999999999
INSERT INTO @sri_validaciones (
    codigo_regla, nombre_regla, descripcion,
    tipo_identificacion, identificacion_requerida,
    mensaje_error
) VALUES 
(
    'CONSUMIDOR_FINAL',
    'Identificación consumidor final',
    'Para ventas a consumidor final usar identificación 9999999999999',
    '07', -- Venta a Consumidor Final
    '9999999999999',
    'Para consumidor final debe usar la identificación: 9999999999999'
);

-- 4. Consumidor final no puede exceder $50
INSERT INTO @sri_validaciones (
    codigo_regla, nombre_regla, descripcion,
    tipo_documento, tipo_identificacion, monto_hasta,
    mensaje_error
) VALUES 
(
    'MONTO_MAX_CF',
    'Monto máximo consumidor final',
    'Consumidor final no puede exceder $50.00 sin identificación',
    '01', -- Factura
    '07', -- Consumidor Final
    50.00,
    'Consumidor final no puede exceder $50.00. Debe solicitar identificación.'
);

-- 5. No se pueden anular facturas a consumidor final
INSERT INTO @sri_validaciones (
    codigo_regla, nombre_regla, descripcion,
    tipo_documento, tipo_identificacion, valor_no_permitido,
    mensaje_error
) VALUES 
(
    'NO_ANULAR_CF',
    'No anular consumidor final',
    'No se permite anular facturas emitidas a consumidor final',
    '01', -- Factura
    '07', -- Consumidor Final
    'ANULACION',
    'No se puede anular facturas a consumidor final según normativa SRI'
);


select * from @sri_validaciones
