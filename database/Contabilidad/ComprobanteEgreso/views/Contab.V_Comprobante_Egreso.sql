USE AcontPlus;
GO

-- =============================================
-- Autor: Emilio Senguana
-- Fecha de Creación: 5/6/2025
-- Descripción: Vista que consolida información de comprobantes de egreso
--              con detalles de clientes, documentos y métodos de pago
-- Última Modificación: [Fecha] - [Descripción del cambio]
-- =============================================

CREATE OR ALTER VIEW Contab.V_ComprobanteEgreso
AS
    SELECT
        ce.idEntidad,
        -- Identificadores principales
        ce.idComprobanteEgreso,
        ce.CustomerId,
        ce.nroDocumento,

        -- Información del establecimiento
        est.nombreComercial AS nombreEstab,
        est.idEstablecimiento,

        -- Serie calculada del comprobante
        CONCAT('CE-', est.estab, '-', Helper.F_Auto_Sequential(ce.nroDocumento)) AS serieComprobante,

        -- Fechas formateadas
        FORMAT(ce.fechaRegistro, 'dd/MM/yyyy HH:mm') AS fechaRegistro,
        ce.fechaRegistro AS fechaRegistroTimestamp,

        -- Montos del comprobante
        CAST(ce.total AS DECIMAL(18,2)) AS totalComprobante,
        ce.observacion,

        -- Información del proveedor
        cli.BusinessName AS razonSocialProveedor,
        cli.IDCard AS cedulaRucProveedor,

        -- Información del documento por pagar
        cpp.serieComprobante AS serieDocumento,
        cpp.idProveedor,

        -- Código de documento normalizado
        -- CASE cpp.codDoc 
        --     WHEN '01' THEN 'FV'
        --     ELSE cpp.codDoc
        -- END AS codigoDocumento,
        cpp.codDoc,

        -- Montos del documento
        CAST(cpp.importeTotal AS DECIMAL(18,2)) AS totalDocumento,
        CAST(hp.abono AS DECIMAL(18,2)) AS abonoDocumento,
        CAST(hp.saldo - hp.abono AS DECIMAL(18,2)) AS saldoPendiente,

        -- Información de la entidad financiera
        ef.descripcion AS metodoPago,
        ef.codigo AS codigoMetodoPago,

        -- Información bancaria (opcional)
        COALESCE(ban.descripcion, '') AS nombreBanco,
        pag.idBanco,
        pag.idSubEntidadFinanciera,

        -- Información del pago 
        FORMAT(pag.fechaEmision, 'dd/MM/yyyy  HH:mm') AS fechaPago,
        pag.fechaEmision AS fechaPagoTimestamp,
        pag.nro,
        pag.aprobacion,
        pag.referencia,
        pag.lote

    FROM dbo.ComprobanteEgreso AS ce
        INNER JOIN Sri.Establecimiento AS est ON est.idEstablecimiento = ce.idEstablecimiento
        INNER JOIN Customer.Customer AS cli ON cli.id = ce.CustomerId
        INNER JOIN Contabilidad.Historial_Pago AS hp ON hp.idComprobanteEgreso = ce.idComprobanteEgreso
        INNER JOIN Contabilidad.CuentaPorPagar AS cpp ON cpp.idCuentaPorPagar = hp.idCuentaPorPagar
        INNER JOIN dbo.Pago AS pag ON pag.idPago = hp.idPago
        INNER JOIN dbo.EntidadFinanciera AS ef ON ef.idEntidadFinanciera = pag.idEntidadFinanciera
        LEFT JOIN dbo.Banco AS ban ON ban.idBanco = pag.idBanco

    WHERE ce.estado = 1;
GO

-- Consulta de prueba
-- SELECT TOP 100
--     *
-- FROM Contab.V_ComprobanteEgreso;
-- SELECT TOP 1
--     *
-- FROM dbo.ComprobanteEgreso
-- SELECT top 1 * FROM PagoDetalle