USE AcontPlus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Ivan Paz
-- Create date: 2022-09-17
-- Description: SP Para insertar los detalles temporales del comprobante importado
-- =============================================

CREATE OR ALTER PROCEDURE Recepcion.Doc_Detail_Temp_Insert_All
    @userRoleId INT
    ,@idDocumento INT
    ,@jsonData VARCHAR(MAX)
    ,@impuestos VARCHAR(MAX)
    ,@method VARCHAR(200) = NULL
AS
BEGIN
    --SET NOCOUNT ON; 

    --DECLARE @idUsuario INT
    --DECLARE @idEntidad INT
    --DECLARE @rucProv VARCHAR(20)
    --DECLARE @idProveedor INT
    --DECLARE @customerId INT

    --DECLARE @tmp TABLE(
    --    idDocumento INT NOT NULL
    --    ,idArticulo INT NULL
    --    ,codigoPrincipal VARCHAR(100) NOT NULL
    --    ,codigoAuxiliar VARCHAR(100) NULL
    --    ,cantidad NUMERIC(18,5) NOT NULL
    --    ,descripcion VARCHAR(300) NOT NULL
    --    ,precioUnitario VARCHAR(15) NOT NULL
    --    ,descuento VARCHAR(15) NULL
    --    ,precioTotalSinImpuesto VARCHAR(15) NULL
    --    ,impuestos XML
    --    ,detallesAdicionales XML
    --    ,idDetalle INT NULL
    --)

    --DECLARE @taxes TABLE(
    --    codArticulo VARCHAR(50)
    --    ,codigo VARCHAR(50)
    --    ,codigoPorcentaje VARCHAR(50)
    --    ,tarifa VARCHAR(50)
    --    ,baseImponible VARCHAR(50)
    --    ,valor VARCHAR(50)
    --    ,idDetalle INT NULL
    --) 

    --BEGIN TRY

        
    --    --INSERT INTO @tmp(idDetalle, idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales, impuestos)
    --    --SELECT idDetalle, @idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, CAST(cantidad AS numeric(18,5)), descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales, impuestos
    --    --FROM OPENJSON(@jsonData) WITH (
    --    --    idDetalle INT '$.idDetalle'
    --    --    ,idArticulo INT '$.idArticulo'
    --    --    ,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
    --    --    ,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
    --    --    ,cantidad VARCHAR(100) '$.cantidad'
    --    --    ,descripcion VARCHAR(300) '$.descripcion'
    --    --    ,precioUnitario VARCHAR(15) '$.precioUnitario'
    --    --    ,descuento VARCHAR(15) '$.descuento'
    --    --    ,precioTotalSinImpuesto VARCHAR(15) '$.precioTotalSinImpuesto'
    --    --    ,detallesAdicionales XML '$.detallesAdicionales'
    --    --    ,impuestos XML
    --    --)

    --    --INSERT INTO @taxes(idDetalle, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
    --    --SELECT idDetalle, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor
    --    --FROM OPENJSON(@impuestos) 
    --    --WITH (
    --    --    idDetalle INT '$.idDetalle'
    --    --    ,codArticulo VARCHAR(100) '$.codArticulo'
    --    --    ,codigo VARCHAR(100) '$.codigo'
    --    --    ,codigoPorcentaje VARCHAR(100) '$.codigoPorcentaje'
    --    --    ,tarifa VARCHAR(100) '$.tarifa'
    --    --    ,baseImponible VARCHAR(300) '$.baseImponible'
    --    --    ,valor VARCHAR(15) '$.valor'
    --    --)

    --    --IF NOT EXISTS (SELECT 1 FROM @tmp)
    --    --BEGIN
    --    --    SELECT '0' code, 'No existe datos para registrar' as 'message'
    --    --    RETURN
    --    --END

    --    --SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

    --    --SELECT @rucProv = rucEmisor FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento 

    --    --SELECT TOP 1 @customerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @rucProv

    --    --SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND CustomerId = @customerId

    --    --BEGIN TRAN

    --    --    IF EXISTS(
    --    --        SELECT TOP 1 1 
    --    --        FROM Recepcion.Doc_Detalle_Temp cpt WITH (NOLOCK)
    --    --        INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento
    --    --    )
    --    --    BEGIN
    --    --        DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
    --    --    END

    --    --    IF EXISTS(
    --    --        SELECT TOP 1 1 
    --    --        FROM Recepcion.Doc_Impuesto_Temp cpt WITH (NOLOCK)
    --    --        INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento
    --    --    )
    --    --    BEGIN
    --    --        DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
    --    --    END

    --    --    IF EXISTS (
    --    --        SELECT TOP 1 1 
    --    --        FROM Recepcion.DocumentoDetalle WITH (NOLOCK) 
    --    --        WHERE idDocumento = @idDocumento
    --    --    )
    --    --    BEGIN 
    --    --        SELECT 
    --    --            ROW_NUMBER() OVER(ORDER BY dd.idDocumentoDetalle ASC) - 1 idDetalle, 
    --    --            dd.idDocumento,
    --    --            @idProveedor idProveedor, 
    --    --            ISNULL(dd.idArticulo , 0) idArticulo, 
    --    --            dd.idMedida, 
    --    --            dd.codigoPrincipal, 
    --    --            dd.codigoAuxiliar,
    --    --            dd.cantidad cantidad, 
    --    --            ISNULL(t.descripcion, a.descripcion) descripcion, 
    --    --            dd.precioUnitario,
    --    --            dd.precioTotalSinImpuesto,
    --    --            CAST((CAST(dd.precioTotalSinImpuesto AS decimal(15,5)) / CAST(dd.cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
    --    --            dd.descuento,
    --    --            CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), dd.detallesAdicionales))))= 0 THEN NULL ELSE dd.detallesAdicionales END detallesAdicionales,
    --    --            dd.impuestos,
    --    --            @idUsuario idUsuario
    --    --        INTO #TEMP
    --    --        FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK)
    --    --        INNER JOIN Articulo a WITH (NOLOCK) ON dd.idArticulo = a.idArticulo
    --    --        LEFT JOIN @tmp t ON a.codigo = t.codigoPrincipal
    --    --        WHERE dd.idDocumento = @idDocumento

    --    --        INSERT INTO #TEMP
    --    --        SELECT 
    --    --            t.idDetalle, 
    --    --            idDocumento, 
    --    --            @idProveedor idProveedor, 
    --    --            ISNULL(ch.idArticulo,0) idArticulo, 
    --    --            ISNULL(m.idMedida,0), 
    --    --            t.codigoPrincipal, 
    --    --            t.codigoAuxiliar,
    --    --            cantidad, 
    --    --            ISNULL(t.descripcion, a.descripcion) descripcion, 
    --    --            precioUnitario, 
    --    --            precioTotalSinImpuesto,
    --    --            IIF(cantidad > 0, CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)), 0) costoNeto,
    --    --            descuento, 
    --    --            CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), detallesAdicionales))))= 0 THEN NULL ELSE detallesAdicionales END detallesAdicionales,
    --    --            impuestos,
    --    --            @idUsuario idUsuario
    --    --        FROM @tmp t
    --    --        LEFT JOIN Recepcion.CompraHabitual ch WITH (NOLOCK) ON t.codigoPrincipal = ch.codArticulo AND ch.idProveedor = @idProveedor
    --    --        LEFT JOIN dbo.Articulo a WITH (NOLOCK) ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad AND a.estado = 1
    --    --        LEFT JOIN dbo.Medida m WITH (NOLOCK) ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
    --    --        WHERE NOT EXISTS(
    --    --            SELECT * 
    --    --            FROM #TEMP tt 
    --    --            WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal
    --    --        )
    --    --        ORDER BY t.idDetalle ASC

    --    --        INSERT INTO Recepcion.Doc_Detalle_Temp(
    --    --            idDetalle, 
    --    --            idDocumento, 
    --    --            idProveedor, 
    --    --            idArticulo, 
    --    --            idMedida, 
    --    --            codigoPrincipal, 
    --    --            codigoAuxiliar,
    --    --            cantidad, 
    --    --            descripcion, 
    --    --            precioUnitario, 
    --    --            precioTotalSinImpuesto, 
    --    --            costoNeto, 
    --    --            descuento, 
    --    --            detallesAdicionales, 
    --    --            impuestos, 
    --    --            idUsuario
    --    --        )
    --    --        SELECT 
    --    --            ROW_NUMBER() OVER(ORDER BY (SELECT NULL)), 
    --    --            idDocumento, 
    --    --            idProveedor, 
    --    --            idArticulo, 
    --    --            idMedida, 
    --    --            codigoPrincipal, 
    --    --            codigoAuxiliar,
    --    --            cantidad, 
    --    --            descripcion, 
    --    --            precioUnitario, 
    --    --            precioTotalSinImpuesto, 
    --    --            costoNeto, 
    --    --            descuento, 
    --    --            detallesAdicionales, 
    --    --            impuestos, 
    --    --            idUsuario
    --    --        FROM #TEMP

    --    --        DROP TABLE #TEMP
    --    --    END
    --    --    ELSE
    --    --    BEGIN
    --    --        SELECT 
    --    --            t.idDetalle, 
    --    --            idDocumento, 
    --    --            @idProveedor idProveedor, 
    --    --            ISNULL(ch.idArticulo , 0) idArticulo, 
    --    --            ISNULL(m.idMedida,0) idMedida, 
    --    --            t.codigoPrincipal, 
    --    --            t.codigoAuxiliar,
    --    --            cantidad, 
    --    --            t.descripcion, 
    --    --            precioUnitario, 
    --    --            precioTotalSinImpuesto,
    --    --            IIF(cantidad > 0, CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)) , 0) costoNeto,
    --    --            descuento, 
    --    --            CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), detallesAdicionales))))= 0 THEN NULL ELSE detallesAdicionales END detallesAdicionales,
    --    --            impuestos,
    --    --            @idUsuario idUsuario
    --    --        INTO #TEMPII
    --    --        FROM @tmp t
    --    --        LEFT JOIN Recepcion.CompraHabitual ch WITH (NOLOCK) ON t.codigoPrincipal = ch.codArticulo AND ch.idProveedor = @idProveedor
    --    --        LEFT JOIN dbo.Articulo a WITH (NOLOCK) ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad AND a.estado = 1
    --    --        LEFT JOIN dbo.Medida m WITH (NOLOCK) ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
    --    --        WHERE NOT EXISTS(
    --    --            SELECT * 
    --    --            FROM Recepcion.Doc_Detalle_Temp tt WITH (NOLOCK)
    --    --            WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal
    --    --        )
    --    --        ORDER BY t.idDetalle ASC

    --    --        INSERT INTO Recepcion.Doc_Detalle_Temp(
    --    --            idDetalle, 
    --    --            idDocumento, 
    --    --            idProveedor, 
    --    --            idArticulo, 
    --    --            idMedida, 
    --    --            codigoPrincipal, 
    --    --            codigoAuxiliar,
    --    --            cantidad, 
    --    --            descripcion, 
    --    --            precioUnitario, 
    --    --            precioTotalSinImpuesto, 
    --    --            costoNeto, 
    --    --            descuento, 
    --    --            detallesAdicionales, 
    --    --            impuestos, 
    --    --            idUsuario
    --    --        )
    --    --        SELECT 
    --    --            ROW_NUMBER() OVER(ORDER BY idDetalle), 
    --    --            idDocumento, 
    --    --            idProveedor, 
    --    --            idArticulo, 
    --    --            idMedida, 
    --    --            codigoPrincipal, 
    --    --            codigoAuxiliar,
    --    --            cantidad, 
    --    --            descripcion, 
    --    --            precioUnitario, 
    --    --            precioTotalSinImpuesto, 
    --    --            costoNeto, 
    --    --            descuento, 
    --    --            detallesAdicionales, 
    --    --            impuestos, 
    --    --            idUsuario
    --    --        FROM #TEMPII

    --    --        DROP TABLE #TEMPII
    --    --    END

    --    --    INSERT INTO Recepcion.Doc_Impuesto_Temp(
    --    --        idDetalle, 
    --    --        idDocumento, 
    --    --        codArticulo, 
    --    --        codigo, 
    --    --        codigoPorcentaje, 
    --    --        tarifa, 
    --    --        baseImponible, 
    --    --        valor
    --    --    )
    --    --    SELECT 
    --    --        idDetalle, 
    --    --        (SELECT TOP 1 idDocumento FROM @tmp), 
    --    --        codArticulo, 
    --    --        codigo, 
    --    --        codigoPorcentaje, 
    --    --        tarifa, 
    --    --        baseImponible, 
    --    --        valor 
    --    --    FROM @taxes tt
    --    --    WHERE NOT EXISTS (
    --    --        SELECT * 
    --    --        FROM Recepcion.Doc_Impuesto_Temp tti 
    --    --        WHERE tti.idDocumento = (SELECT TOP 1 idDocumento FROM @tmp) 
    --    --        AND tti.codArticulo = tt.codArticulo
    --    --    ) 

    --    --    INSERT INTO Recepcion.Doc_Impuesto_Temp(
    --    --        idDetalle, 
    --    --        idDocumento, 
    --    --        codArticulo, 
    --    --        codigo, 
    --    --        codigoPorcentaje, 
    --    --        tarifa, 
    --    --        baseImponible, 
    --    --        valor
    --    --    )
    --    --    SELECT 
    --    --        idDetalle, 
    --    --        (SELECT TOP 1 idDocumento FROM @tmp), 
    --    --        codArticulo, 
    --    --        codigo, 
    --    --        codigoPorcentaje, 
    --    --        tarifa, 
    --    --        baseImponible, 
    --    --        valor 
    --    --    FROM @taxes tt
    --    --    WHERE NOT EXISTS (
    --    --        SELECT * 
    --    --        FROM Recepcion.Doc_Impuesto_Temp tti  WITH (NOLOCK)
    --    --        WHERE tti.idDocumento = (SELECT TOP 1 idDocumento FROM @tmp) 
    --    --        AND tti.codArticulo = tt.codArticulo
    --    --    )

    --    --COMMIT TRAN 
    --END TRY
    --BEGIN CATCH
    --    SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
    --    IF (@@TRANCOUNT > 0)
    --        ROLLBACK TRAN
    --    INSERT INTO ErroresSistema(
    --        [token], 
    --        [method], 
    --        [errorNumber], 
    --        [errorSeverity], 
    --        [errorState], 
    --        [errorProcedure], 
    --        [errorLine], 
    --        [errorMessage], 
    --        [errorDate], 
    --        [idUsuario]
    --    )
    --    VALUES (
    --        NEWID(), 
    --        @method, 
    --        ERROR_NUMBER(), 
    --        ERROR_SEVERITY(), 
    --        ERROR_STATE(), 
    --        ERROR_PROCEDURE(), 
    --        ERROR_LINE(), 
    --        ERROR_MESSAGE(), 
    --        dbo.ufnGetDateEcuador(), 
    --        @idUsuario
    --    )
    --END CATCH
    RETURN
END
GO
