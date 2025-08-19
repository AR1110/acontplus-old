USE AcontPlus;
GO

-- =============================================
-- Autor: Emilio Senguana
-- Fecha de Creación: 5/6/2025
-- Descripción: Vista que consolida información de comprobantes de egreso
--              con detalles de clientes, documentos y métodos de pago
-- Última Modificación: [Fecha] - [Descripción del cambio]
-- =============================================

CREATE OR ALTER VIEW Contabilidad.V_ComprobanteEgresoDetallePago
AS
        SELECT
                -- Información de la Cuenta por Pagar
                cpp.idEntidad,
                cpp.idCuentaPorPagar,
                -- CASE cpp.codDoc 
                --     WHEN '01' THEN 'FE'
                --     ELSE cpp.codDoc
                -- END AS codDoc,
                cpp.codDoc,
                cpp.serieComprobante AS serieDoc,
                cpp.fechaEmision as fechaEmisionDoc,
                cpp.identificacionProveedor,
                cpp.razonSocialProveedor,
                CAST(cpp.importeTotal AS DECIMAL(18,2)) AS importeTotal,
                CAST(cpp.abono AS DECIMAL(18,2)) AS abonoTotal,
                CAST(cpp.saldo AS DECIMAL(18,2)) AS saldoPendiente,

                -- Información del Comprobante de Egreso
                ce.idComprobanteEgreso,
              --  FORMAT(ce.fechaRegistro, 'dd/MM/yyyy hh:mm') AS fechaRegistroEgreso,
                ce.fechaRegistro as fechaRegistroEgreso,
                'CE' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ce.nroDocumento) AS serieComprobanteEgreso,
                ce.total AS totalEgreso,
                CASE ce.estado WHEN 1 THEN 'ACTIVO' ELSE 'ANULADO' END AS estadoEgreso,
                es.idEstablecimiento,

                -- Información del Pago
                p.idPago,
                CASE p.posfechado WHEN 1 THEN 'SI' ELSE 'NO' END AS esPosfechado,
                FORMAT(p.fechaEmision, 'dd/MM/yyyy hh:mm') AS fechaPago,
                ISNULL(sf.descripcion, ef.descripcion) AS formaPago,
                ISNULL(bc.descripcion, '-------------') AS banco,
                ef.codigo AS codigoFormaPago,
                p.valor AS valorPago,
                p.abono AS abonoPago,
                p.vuelto,
                p.nro AS numeroTransaccion,
                p.lote,
                p.aprobacion,
                p.referencia,

                -- Información del Detalle de Cuotas
                cxp.nroCuota,
                FORMAT(cxp.fechaVencimiento, 'dd/MM/yyyy') AS fechaVencimientoCuota,
                CAST(cxp.cuota AS DECIMAL(18,2)) AS montoCuota,
                CAST(pd.abono AS DECIMAL(18,2)) AS abonoCuota,
                CAST((pd.saldo - pd.abono) AS DECIMAL(18,2)) AS saldoCuota,

                -- Campos calculados útiles para el reporte
                CASE 
                    WHEN cpp.saldo = 0 THEN 'PAGADO'
                    WHEN cpp.saldo > 0 AND cpp.abono > 0 THEN 'PAGO PARCIAL'
                    WHEN cpp.abono = 0 THEN 'PENDIENTE'
                    ELSE 'ESTADO INDEFINIDO'
                END AS estadoPago,

                CASE
                    WHEN cxp.fechaVencimiento < GETDATE() AND (pd.saldo - pd.abono) > 0 THEN 'VENCIDA'
                    WHEN cxp.fechaVencimiento >= GETDATE() AND (pd.saldo - pd.abono) > 0 THEN 'VIGENTE'
                    ELSE 'PAGADA'
                END AS estadoCuota,

                -- Cálculo de días de vencimiento
                CASE
                    WHEN cxp.fechaVencimiento < GETDATE() AND (pd.saldo - pd.abono) > 0
                    THEN DATEDIFF(DAY, cxp.fechaVencimiento, GETDATE())
                    ELSE 0
                END AS diasVencidos

        FROM v_CuentaPorPagar cpp WITH(NOLOCK)
        -- Join con Historial de Pagos
        INNER JOIN Contabilidad.Historial_Pago hp WITH(NOLOCK)
                ON hp.idCuentaPorPagar = cpp.idCuentaPorPagar

        -- Join con Comprobantes de Egreso
        INNER JOIN dbo.ComprobanteEgreso ce WITH(NOLOCK)
                ON ce.idComprobanteEgreso = hp.idComprobanteEgreso AND ce.estado = 1

        -- Join con Establecimiento
        LEFT JOIN Sri.Establecimiento es WITH(NOLOCK)
                ON es.idEstablecimiento = ce.idEstablecimiento

                -- Join con Pagos
        LEFT JOIN dbo.Pago p WITH(NOLOCK)
                ON p.idPago = hp.idPago

        -- Join con Entidades Financieras
        LEFT JOIN dbo.EntidadFinanciera ef WITH(NOLOCK)
                ON ef.idEntidadFinanciera = p.idEntidadFinanciera

        -- Join con Sub Entidades Financieras
        LEFT JOIN dbo.SubEntidadFinanciera sf WITH(NOLOCK)
                ON sf.idSubEntidadFinanciera = p.idSubEntidadFinanciera

        -- Join con Bancos
        LEFT JOIN dbo.Banco bc WITH(NOLOCK)
                ON bc.idBanco = p.idBanco

        -- Join con Detalle de Pagos
        LEFT JOIN dbo.PagoDetalle pd WITH(NOLOCK)
                ON pd.idPago = p.idPago

        -- Join con Cuotas por Pagar
        LEFT JOIN Contabilidad.CuotaPorPagar cxp WITH(NOLOCK)
                ON cxp.idCuotaPorPagar = pd.idCuotaPorPagar
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