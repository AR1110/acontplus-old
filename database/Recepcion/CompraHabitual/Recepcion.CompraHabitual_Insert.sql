USE [AcontPlus]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Ivan Paz
-- Create date: 2022-09-01
-- Description: SP FOR INSERT COMPRA HABITUAL
--ALTER TABLE Inventario.TransaccionDetalle  ADD descuento NUMERIC(18,5)
--ALTER TABLE Recepcion.CompraHabitual  ADD idMedida INT
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.CompraHabitual_Insert
     @idUsuarioRol INT
    ,@json NVARCHAR(MAX)
    ,@method VARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idUsuario INT ,@idEntidad INT

    --> Data Json
    DECLARE @infoComprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@compraHabitual AS VARCHAR(MAX) ,@proceso NVARCHAR(100)

    --> Inventario
    DECLARE @idTipoTransaccion  INT ,@idTipoDocumento INT ,@idTransaccion INT ,@fechaEmision DATETIME2 ,@CustomerId INT

    --> Recepcion
    DECLARE @Id INT

    DECLARE @TbCompraHabitual AS TABLE(
         idProveedor INT NOT NULL
        ,idMedida INT NOT NULL
        ,codEstab VARCHAR(50) NOT NULL
        ,ruc VARCHAR(13) NULL
        ,idArticulo INT NOT NULL
        ,codArticulo VARCHAR(100) NULL
    )

    DECLARE @Transaccion AS TABLE
    (
        idTipoTransaccion INT NOT NULL
       ,idTipoDocumento INT NOT NULL
       ,idDocumento INT NOT NULL
       ,CustomerId INT NOT NULL
       ,idUsuario INT NOT NULL
       ,idEntidad INT NOT NULL
       ,fechaEmision DATETIME2
       ,serieComprobante NVARCHAR(25) NOT NULL
    )

    DECLARE @TransaccionDetalle AS TABLE
    (
        idArticulo INT NOT NULL
       ,idBodega INT NOT NULL
       ,idMedida INT NOT NULL
       ,cantidad NUMERIC(18,5) NOT NULL
       ,conversion NUMERIC(18,5) NOT NULL
       ,cantidadTransaccion NUMERIC(18,5) NOT NULL
       ,precioUnitario NUMERIC(18,5) NOT NULL
       ,descuento NUMERIC(18,5) NOT NULL
       ,precioCosto NUMERIC(18,5) NOT NULL
       ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
       ,total NUMERIC(18,5) NOT NULL
       ,llevaInventario BIT NOT NULL
    )

    BEGIN TRY
         --> Data Json
        SELECT @infoComprobante = infoComprobante
              ,@detalles        = detalles
              ,@compraHabitual  = compraHabitual
              ,@proceso         = proceso
        FROM OPENJSON(@json) WITH 
        (
             infoComprobante NVARCHAR(MAX) as json
            ,detalles        NVARCHAR(MAX) as json 
            ,compraHabitual  NVARCHAR(MAX) as json
            ,proceso         NVARCHAR(20)
        )

        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        IF @proceso = 'ADD_INVENTORY'
            BEGIN
                --> variables
                SELECT @Id = idDocumento FROM OPENJSON(@infoComprobante) WITH(idDocumento INT)

                SELECT TOP 1 @CustomerId = customerId FROM Recepcion.DocumentoRecibido WHERE idDocumento = @Id

                SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

                IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE codDoc = '01' AND idDocumento = @Id)
                    BEGIN
                        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FE'
                    END

                IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE codDoc = '04' AND idDocumento = @Id)
                    BEGIN
                        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC'
                    END

                --> Data Json
                INSERT INTO @Transaccion
                       (idTipoTransaccion ,idTipoDocumento,idDocumento ,CustomerId ,idUsuario ,idEntidad,fechaEmision,serieComprobante)
                SELECT @idTipoTransaccion,@idTipoDocumento,idDocumento,@CustomerId,@idUsuario,@idEntidad,fechaEmision,serieComprobante
                FROM OPENJSON(@infoComprobante) WITH
                (
                    idDocumento      INT
                   ,fechaEmision     DATETIME2
                   ,serieComprobante NVARCHAR(25)
                )

                INSERT INTO @TransaccionDetalle
                      (idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,descuento,precioCosto,precioCostoFraccionado,total,llevaInventario)
                SELECT idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,descuento,precioCosto,precioCostoFraccionado,total,llevaInventario
                FROM OPENJSON(@detalles) WITH
                (
                    idArticulo             INT
                   ,idBodega               INT
                   ,idMedida               INT
                   ,cantidad               NUMERIC(18,5)
                   ,conversion             NUMERIC(18,5)
                   ,cantidadTransaccion    NUMERIC(18,5)
                   ,precioUnitario         NUMERIC(18,5)
                   ,descuento              NUMERIC(18,5)
                   ,precioCosto            NUMERIC(18,5)
                   ,precioCostoFraccionado NUMERIC(18,5)
                   ,total                  NUMERIC(18,5) '$.precioTotalSinImpuesto'
                   ,llevaInventario        BIT
                )

                --> Variables tablas temporales
                SELECT TOP 1 @fechaEmision = fechaEmision FROM @Transaccion 

                --> Validaciones
                IF NOT EXISTS (SELECT 1 FROM @Transaccion)
                    BEGIN
                        SELECT '0' code, 'Error en la informacion del comprobante' AS 'message'
                        RETURN
                    END

                IF NOT EXISTS (SELECT 1 FROM @TransaccionDetalle)
                    BEGIN
                        SELECT '0' code, 'Error en la informacion de los detalles' AS 'message'
                        RETURN
                    END

                IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE complete = 1 AND idDocumento = @Id)
                    BEGIN
                        SELECT '0' code, 'Este documento ya fue cargado el inventario' AS 'message'
                        RETURN
                    END

                IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory != 'SI')
		            BEGIN
                        SELECT '0' code, 'Tu empresa debe estar configurada para llevar inventario' AS 'message'
                        RETURN
                    END
            END 

        IF @proceso = 'ADD_HISTORY'
            BEGIN
                --> Data Json
                INSERT INTO @TbCompraHabitual
                      (idProveedor,idMedida,codEstab,ruc,idArticulo,codArticulo)
                SELECT idProveedor,idMedida,codEstab,ruc,idArticulo,codArticulo
                FROM OPENJSON(@compraHabitual) WITH
                (
                     idProveedor INT          '$.idProveedor'
                    ,idMedida INT
                    ,codEstab VARCHAR(50)     '$.codEstab'
                    ,ruc VARCHAR(13)          '$.ruc'
                    ,idArticulo INT           '$.idArticulo'
                    ,codArticulo VARCHAR(100) '$.codArticulo'
                )

                --> Validaciones
                IF NOT EXISTS (SELECT 1 FROM @TbCompraHabitual)
                    BEGIN
                        SELECT '0' code, 'Error en la informacion de compra no habitual' AS 'message'
                        RETURN
                    END
            END 

        

        BEGIN TRAN
            IF @proceso = 'ADD_HISTORY'
                BEGIN
                    IF EXISTS (SELECT 1 FROM @TbCompraHabitual)
                        BEGIN 
                            INSERT INTO Recepcion.CompraHabitual
                                  (codEstab,idProveedor,idMedida,ruc,idArticulo,codArticulo, idUsuario)
                            SELECT codEstab,idProveedor,idMedida,ruc,idArticulo,codArticulo, @idUsuario 
                            FROM @TbCompraHabitual
                        END
                END 

            IF @proceso = 'ADD_INVENTORY'
                BEGIN
                    --> Transaccion
                    INSERT INTO Inventario.Transaccion
                          (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                    SELECT idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante 
                    FROM @Transaccion 

                    SET @idTransaccion = SCOPE_IDENTITY()

                    --> Detalles
                    INSERT INTO Inventario.TransaccionDetalle 
                           (idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,descuento,precioCosto,precioCostoFraccionado,total)
			        SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,descuento,precioCosto,precioCostoFraccionado,total 
                    FROM @TransaccionDetalle 
                    WHERE llevaInventario = 1

                    EXEC dbo.Transaccion_Handler_Init @idTransaccion

                    IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE codMetodoValoracion = 'UEPS' AND idEntidad = @idEntidad)
                        BEGIN
                            UPDATE ar SET
                                    ar.fechaUltimoCosto = CASE WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.fechaUltimoCosto
                                                                                                        ELSE @fechaEmision
                                                            END
                                    ,ar.precioCosto     =  CASE WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.precioCosto
                                                                                                        ELSE IIF((SELECT TOP 1 MAX(td.precioUnitario) FROM @TransaccionDetalle td WHERE td.llevaInventario = 1 and td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida) >= (ar.precioCosto / 2)
                                                                                                                ,(SELECT TOP 1 MAX(td.precioUnitario) FROM @TransaccionDetalle td WHERE td.llevaInventario = 1 and td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida)
                                                                                                                ,ar.precioCosto) 
                                                                                                                 
                                                            END
                            FROM dbo.Articulo ar WITH (ROWLOCK)
                            WHERE ar.idArticulo IN (SELECT idArticulo FROM @TransaccionDetalle td WHERE td.llevaInventario = 1)  

                            UPDATE pv SET
                                    pv.porcentajeUtilidad = ((pv.precioVenta / ar.precioCosto) * 100) - 100
                            FROM dbo.ArticuloPvP    pv WITH (ROWLOCK)
                            INNER JOIN dbo.Articulo ar WITH (ROWLOCK) ON ar.idArticulo = pv.idArticulo
                            WHERE ar.idArticulo IN (SELECT idArticulo FROM @TransaccionDetalle td WHERE td.llevaInventario = 1)
                        END

                    UPDATE Recepcion.DocumentoRecibido SET complete = 1, fechaEdicion = GETDATE() ,idUsuarioEdicion = @idUsuario WHERE idDocumento = @Id
                END 
        COMMIT TRAN
        SELECT '1' code, 'Exitos al guardar' AS 'message'
    END TRY
    BEGIN CATCH
        SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() AS 'message'
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN
        INSERT INTO ErroresSistema(
            [token], 
            [method], 
            [errorNumber], 
            [errorSeverity], 
            [errorState], 
            [errorProcedure], 
            [errorLine], 
            [errorMessage], 
            [errorDate], 
            [idUsuario]
        )
        VALUES (
            NEWID(), 
            'CompraHabitual/Post', 
            ERROR_NUMBER(), 
            ERROR_SEVERITY(), 
            ERROR_STATE(), 
            ERROR_PROCEDURE(), 
            ERROR_LINE(), 
            ERROR_MESSAGE(), 
            dbo.ufnGetDateEcuador(), 
            @idUsuario
        )
    END CATCH
END
GO
