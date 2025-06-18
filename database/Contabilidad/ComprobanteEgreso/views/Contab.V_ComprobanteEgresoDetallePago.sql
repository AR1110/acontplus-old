USE AcontPlus;
GO

-- =============================================
-- Autor: Emilio Senguana
-- Fecha de Creación: 5/6/2025
-- Descripción: Vista que consolida información de comprobantes de egreso
--              con detalles de clientes, documentos y métodos de pago
-- Última Modificación: [Fecha] - [Descripción del cambio]
-- =============================================

CREATE OR ALTER VIEW Contab.V_ComprobanteEgresoDetallePago
AS
    SELECT
        -- ==========================================
        -- IDENTIFICADORES PRINCIPALES
        -- ==========================================
        ce.idEntidad,
        ce.idComprobanteEgreso,
        ce.CustomerId,
        ce.nroDocumento,

        -- ==========================================
        -- INFORMACIÓN DEL ESTABLECIMIENTO
        -- ==========================================
        est.nombreComercial AS nombreEstab,
        est.idEstablecimiento,
        CONCAT('CE-', est.estab, '-', Helper.F_Auto_Sequential(ce.nroDocumento)) AS serieComprobante,

        -- ==========================================
        -- FECHAS FORMATEADAS
        -- ==========================================
        FORMAT(ce.fechaRegistro, 'dd/MM/yyyy HH:mm') AS fechaRegistro,
        FORMAT(pag.fechaEmision, 'dd/MM/yyyy HH:mm') AS fechaPago,

        -- ==========================================
        -- MONTOS DEL COMPROBANTE
        -- ==========================================
        CAST(ce.total AS DECIMAL(18,2)) AS totalComprobante,
        ce.observacion,

        -- ==========================================
        -- INFORMACIÓN DEL PROVEEDOR
        -- ==========================================
        cli.BusinessName AS razonSocialProveedor,
        cli.IDCard AS cedulaRucProveedor,

        -- ==========================================
        -- INFORMACIÓN DEL DOCUMENTO POR PAGAR
        -- ==========================================
        cpp.idCuentaPorPagar,
        cpp.idProveedor,
        cpp.serieComprobante AS serieDocumento,

        -- Código de documento normalizado
        CASE cpp.codDoc 
        WHEN '01' THEN 'FV'
        ELSE cpp.codDoc 
    END AS codDoc,

        -- Montos del documento
        CAST(cpp.importeTotal AS DECIMAL(18,2)) AS totalDocumento,
        CAST(cpp.abono AS DECIMAL(18,2)) AS abonoDocumento,
        CAST(cpp.saldo AS DECIMAL(18,2)) AS saldoDocumento,

        -- ==========================================
        -- INFORMACIÓN DE MÉTODOS DE PAGO
        -- ==========================================
        ef.descripcion AS metodoPago,
        ef.codigo AS codigoMetodoPago,

        -- ==========================================
        -- INFORMACIÓN BANCARIA
        -- ==========================================
        COALESCE(ban.descripcion, '') AS nombreBanco,
        pag.idBanco,
        pag.idSubEntidadFinanciera,

        -- ==========================================
        -- DETALLES DEL PAGO
        -- ==========================================
        pag.nro,
        pag.aprobacion,
        pag.referencia,
        pag.lote,
        cpag.nroCuota

    FROM dbo.ComprobanteEgreso AS ce WITH(NOLOCK)

        -- Joins principales
        INNER JOIN Sri.Establecimiento AS est WITH(NOLOCK)
        ON est.idEstablecimiento = ce.idEstablecimiento

        INNER JOIN Customer.Customer AS cli WITH(NOLOCK)
        ON cli.id = ce.CustomerId

        INNER JOIN dbo.Pago AS pag WITH(NOLOCK)
        ON pag.idComprobanteEgreso = ce.idComprobanteEgreso

        INNER JOIN dbo.PagoDetalle AS pd WITH(NOLOCK)
        ON pd.idPago = pag.idPago

        INNER JOIN Contabilidad.CuotaPorPagar AS cpag WITH(NOLOCK)
        ON cpag.idCuotaPorPagar = pd.idCuotaPorPagar

        INNER JOIN Contabilidad.CuentaPorPagar AS cpp WITH(NOLOCK)
        ON cpp.idCuentaPorPagar = cpag.idCuentaPorPagar

        INNER JOIN dbo.EntidadFinanciera AS ef WITH(NOLOCK)
        ON ef.idEntidadFinanciera = pag.idEntidadFinanciera

        -- Joins opcionales
        LEFT JOIN dbo.Banco AS ban WITH(NOLOCK)
        ON ban.idBanco = pag.idBanco

    WHERE 
    ce.estado = 1;

GO

-- -- =============================================
-- -- CONSULTA DE PRUEBA
-- -- =============================================

-- SELECT TOP 100
--     -- Identificadores
--     idComprobanteEgreso,
--     nroDocumento,
--     serieComprobante,

--     -- Información del proveedor
--     razonSocialProveedor,
--     cedulaRucProveedor,

--     -- Fechas
--     fechaRegistro,
--     fechaPago,

--     -- Montos
--     totalComprobante,
--     totalDocumento,
--     abonoDocumento,
--     saldoDocumento,

--     -- Método de pago
--     metodoPago,
--     nombreBanco,

--     -- Detalles del pago
--     nro,
--     referencia,
--     nroCuota

-- FROM Contab.V_ComprobanteEgresoDetallePago

-- ORDER BY 
--     fechaRegistro DESC,
--     idComprobanteEgreso DESC;