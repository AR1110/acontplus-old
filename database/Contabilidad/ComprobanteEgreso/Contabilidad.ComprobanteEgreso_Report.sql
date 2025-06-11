USE [AcontPlus]
GO

/****** Object:  StoredProcedure [Contabilidad].[ComprobanteEgreso_Report]    Script Date: 26/4/2023 15:41:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Sistema Contable
-- Create date:   26/04/2023
-- Description:   Genera reporte de comprobante de egreso
-- Usage:         EXEC Contabilidad.ComprobanteEgreso_Report '{"tipo":2,"establecimientoId":553,"userId":null,"userRoleId":307,"documentCode":null,"paymentMethodId":null,"bankId":null,"startDate":"2025-06-09 10:56:05","endDate":"2025-06-09 10:56:05","useDateFilter":false,"reportTypeCode":null}',''
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteEgreso_Report
    @json VARCHAR(MAX),
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    -- =============================================
    -- DECLARACIÓN DE VARIABLES
    -- =============================================
    DECLARE 
        @userRoleId INT,
        @idComprobanteEgreso INT,
        @byEgreso BIT = 0,
        @tipo INT,
        @idEntidad INT,
        @userId INT,
        @estabId INT,
        @codDoc CHAR(5),
        @paymentMethodId INT,
        @bankId INT, 
        @startDate DATETIME2,
        @endDate   DATETIME2,
        @useDateFilter BIT,
        @supplierId INT,
        @reference VARCHAR(20),
        @lote VARCHAR(20)

    --> Sql
    DECLARE @sql NVARCHAR(MAX), @params NVARCHAR(MAX)



    BEGIN TRY 
        -- =============================================
        -- PARSEAR JSON Y EXTRAER PARÁMETROS
        -- =============================================
        SELECT
        @idComprobanteEgreso = id,
        @tipo = tipo,
        @userRoleId = userRoleId
    FROM OPENJSON(@json) WITH(id INT, tipo INT, userRoleId INT);


     -- =============================================
    -- OBTENER DATOS DEL USUARIO
    -- =============================================
    SELECT
        @idEntidad = idEntidad,
        @userId = idUsuario
    FROM v_usuario
    WHERE idUsuarioRol = @userRoleId;
    

        -- =============================================
        -- VALIDAR TIPO DE PROCESO
        -- =============================================
        IF @tipo = 1
        BEGIN
        -- Verificar si existe movimiento de caja asociado
        IF EXISTS (SELECT 1
        FROM MovimientoCaja WITH (NOLOCK)
        WHERE idComprobanteEgreso = @idComprobanteEgreso)
            BEGIN
            SET @byEgreso = 1;
        END

        SET @tableNames = 'comprobanteEgresoDs,comprobanteDetalleDs';

        -- =============================================
        -- CONSULTA PRINCIPAL - DATOS DEL COMPROBANTE
        -- =============================================
        SELECT
            'Nro.:' + 'CE' + dbo.AFTAutoComplete(ce.nroDocumento) AS nroComprobante,
            @byEgreso AS byEgreso,
            cu.BusinessName AS proveedor,
            cu.IdCard AS nroIdentificacion,
            FORMAT(ce.fechaRegistro, 'dd/MM/yyyy HH:mm') AS fechaEmision,
            CAST(ce.total AS NUMERIC(18,2)) AS total,
            en.nombreComercial,
            en.ruc,
            en.telefono,
            en.direccion,
            ce.observacion
        FROM dbo.ComprobanteEgreso ce WITH (NOLOCK)
            INNER JOIN Customer.Customer cu WITH (NOLOCK)
            ON cu.Id = ce.CustomerId
            INNER JOIN dbo.Entidad en WITH (NOLOCK)
            ON en.idEntidad = ce.idEntidad
        WHERE ce.idComprobanteEgreso = @idComprobanteEgreso;

        -- =============================================
        -- CONSULTA CONDICIONAL - MOVIMIENTOS DE CAJA
        -- =============================================
        IF @byEgreso = 1
            BEGIN
            SELECT
                'EC' AS tipoDoc,
                'EC' + '-' + es.estab + '-' + dbo.AFTAutoComplete(mc.nroDoc) AS nroDoc,
                FORMAT(ce.fechaRegistro, 'dd/MM/yyyy HH:mm') AS fechaEmision,
                CAST(mc.valor AS NUMERIC(18,2)) AS total,
                sf.descripcion AS formaCobro
            FROM dbo.MovimientoCaja mc WITH (NOLOCK)
                INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK)
                ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
                LEFT JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK)
                ON ce.idComprobanteEgreso = mc.idComprobanteEgreso
                LEFT JOIN Sri.Establecimiento es WITH (NOLOCK)
                ON es.idEstablecimiento = ce.idEstablecimiento
            WHERE mc.idComprobanteEgreso = @idComprobanteEgreso;
        END
            ELSE
            BEGIN
            -- =============================================
            -- CONSULTA ALTERNATIVA - CUENTAS POR PAGAR
            -- =============================================
            SELECT
                cuenta_pp.idCuentaPorPagar AS 'unique',
                cuenta_pp.codDoc AS tipoDoc,
                cuenta_pp.serieComprobante AS nroDoc,
                FORMAT(cuenta_pp.fechaEmision, 'dd/MM/yyyy hh:mm') AS fechaEmision,
                CAST(cuenta_pp.importeTotal AS DECIMAL(18,2)) AS total,
                ISNULL(se.descripcion, ef.descripcion) AS formaPago,
                IIF(p.posfechado = 1, 'SI', 'NO') AS posfechado,
                CASE 
                        WHEN ef.codigo = 'CHE' THEN b.descripcion 
                        ELSE NULL
                    END AS entidadFinanciera,
                p.nro AS comprobantePago,
                FORMAT(p.fechaEmision, 'dd/MM/yyyy hh:mm') AS fechaPago,
                cuota_pp.nroCuota AS cuota,
                CAST(cuota_pp.cuota AS DECIMAL(16, 2)) AS valorCuota,
                CAST(pde.abono AS DECIMAL(16, 2)) AS abono,
                CAST(pde.saldo - IIF(p.cobro = 1, pde.abono, 0) AS DECIMAL(16, 2)) AS saldo
            FROM dbo.ComprobanteEgreso ce WITH (NOLOCK)
                INNER JOIN dbo.Pago p WITH (NOLOCK)
                ON p.idComprobanteEgreso = ce.idComprobanteEgreso
                INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK)
                ON ef.idEntidadFinanciera = p.idEntidadFinanciera
                LEFT JOIN dbo.SubEntidadFinanciera se WITH (NOLOCK)
                ON se.idSubEntidadFinanciera = p.idSubEntidadFinanciera
                LEFT JOIN dbo.Banco b WITH (NOLOCK)
                ON p.idBanco = b.idBanco
                INNER JOIN dbo.PagoDetalle pde WITH (NOLOCK)
                ON pde.idPago = p.idPago
                INNER JOIN Contabilidad.CuotaPorPagar cuota_pp WITH (NOLOCK)
                ON cuota_pp.idCuotaPorPagar = pde.idCuotaPorPagar
                INNER JOIN Contabilidad.CuentaPorPagar cuenta_pp WITH (NOLOCK)
                ON cuenta_pp.idCuentaPorPagar = cuota_pp.idCuentaPorPagar
            WHERE ce.idComprobanteEgreso = @idComprobanteEgreso;
        END

        RETURN;
    END

        -- Reporte Listado de comprobantes de egreso
        IF @tipo = 2
        BEGIN
        SET @tableNames = 'headerDs,listDs';

        SELECT
            @estabId = estabId,
            @userId = userId,
            @codDoc = codDoc,
            @paymentMethodId = paymentMethodId,
            @bankId = bankId,
            @startDate = startDate,
            @endDate = endDate,
            @useDateFilter = useDateFilter,
            @supplierId = supplierId
        FROM OPENJSON(@json)
                WITH(
                    estabId INT 
                    ,userId INT 
                    ,codDoc CHAR(5)
                    ,paymentMethodId INT 
                    ,bankId INT 
                    ,startDate DATETIME2
                    ,endDate DATETIME2
                    ,useDateFilter BIT 
                    ,supplierId INT
                )

        SET @params = '@idEntidad INT 
                              ,@paymentMethodId INT
                              ,@estabId INT
                              ,@codDoc CHAR(5)
                              ,@supplierId INT 
                              ,@startDate DATETIME2
                              ,@endDate DATETIME2
                              ,@bankId INT 
                              ,@reference VARCHAR(30)
                              ,@lote VARCHAR(30)'

        SET @sql = N'
                            SELECT top 100 
                                idProveedor
                                ,codDoc
                                ,serieComprobante
                                ,razonSocialProveedor
                                ,fechaRegistro
                                ,serieDocumento
                                ,metodoPago
                                ,nombreBanco
                                ,nro
                                ,aprobacion
                                ,referencia
                                ,lote
                            FROM Contab.V_ComprobanteEgreso 
                            WHERE idEntidad > 0 
                '

        -- SET @sql = @sql + ' AND idEstablecimiento = @estabId '

        -- IF @codDoc IS NOT NULL
        --     BEGIN
        --     SET @sql = @sql + ' AND codDoc = @codDoc '
        -- END

        -- IF @paymentMethodId > 0
        --     BEGIN
        --     SET @sql = @sql + ' AND idSubEntidadFinanciera = @paymentMethodId '
        -- END

        -- IF @supplierId > 0
        --     BEGIN
        --     SET @sql = @sql + ' AND idProveedor = @supplierId '
        -- END

        -- IF @bankId > 0
        --     BEGIN
        --     SET @sql = @sql + ' AND idBanco = @bankId '
        -- END

        -- IF @useDateFilter = 1
        --     BEGIN
        --     SET @sql = @sql + ' AND CAST(fechaRegistro AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) '
        -- END

        ---> Header
        SELECT TOP 1
            nameBusiness = entidad
                    , rucBusiness = rucEmpresa
                    , telBusiness = telefono
                    , emailBusiness = email
                    , addressBusiness = direccion       
                    , userName = nombreUsuario 
                    , dateRange =  FORMAT(@startDate, 'dd/MM/yyyy')  + '-' +  FORMAT(@endDate, 'dd/MM/yyyy')
        FROM v_usuario WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId

        ---> Details
        EXEC sp_executesql @sql
                              ,@params 
                              ,@idEntidad = @idEntidad
                              ,@paymentMethodId = @paymentMethodId
                              ,@estabId = @estabId
                              ,@codDoc = @codDoc
                              ,@supplierId = @supplierId 
                              ,@startDate = @startDate
                              ,@endDate = @endDate
                              ,@bankId = @bankId 
                              ,@reference = @reference
                              ,@lote = @lote



        RETURN;
    END

        -- Reporte Listado de comprobantes de egreso con detalles de pago
        IF @tipo = 3
        BEGIN
        -- Aquí iría la lógica para el tipo 3
        RETURN;
    END

    END TRY
    BEGIN CATCH
        -- =============================================
        -- MANEJO DE ERRORES
        -- =============================================
        INSERT INTO ErroresSistema WITH (ROWLOCK)
        (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
    SELECT NEWID(), '/ComprobanteEgreso/Report', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ISNULL(ERROR_PROCEDURE(),''), ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @userId
         THROW;
    END CATCH

END