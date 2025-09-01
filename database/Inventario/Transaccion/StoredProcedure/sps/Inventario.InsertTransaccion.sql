USE [AcontPlus] 
go
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-04-03
-- Description: SP FOR INSERT INVENTARIO
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.InsertTransaccion
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
    ,@idTransaccion INT = 0 OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @code VARCHAR(50) ,@message VARCHAR(300) ,@idFactura INT

    --> Data Json
    DECLARE @transaccion VARCHAR(MAX) ,@detalles VARCHAR(MAX)

    --> Transaccion
	DECLARE @idUsuario INT ,@idEntidad INT

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    DECLARE @tbTransaccion AS TABLE
    (
        idTipoTransaccion INT NOT NULL
       ,idTipoDocumento INT NOT NULL
       ,idDocumento INT NOT NULL
       ,CustomerId INT NOT NULL
       ,idUsuario INT NOT NULL
       ,idEntidad INT NOT NULL
       ,fechaEmision DATETIME2 NOT NULL
       ,serieComprobante VARCHAR(25) NOT NULL
    )

    DECLARE @tbDetailts AS TABLE
    (
        orderIndex INT
       ,idTransaccion INT NOT NULL
       ,idArticulo INT NOT NULL
       ,idBodega INT NOT NULL
       ,idMedida INT NOT NULL
       ,idTarifa INT NOT NULL
       ,cantidad NUMERIC(18,5) NOT NULL
       ,conversion NUMERIC(18,2) NOT NULL
       ,cantidadTransaccion NUMERIC(18,2) NOT NULL
       ,precioUnitario NUMERIC(18,5) NOT NULL
       ,precioCosto NUMERIC(18,5) NOT NULL
       ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
       ,total NUMERIC(18,2) NOT NULL
       ,llevaInventario BIT
    )

    BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @transaccion = transaccion
              ,@detalles    = detalles
        FROM OPENJSON(@json) WITH 
        (
             transaccion NVARCHAR(MAX) as json
            ,detalles    NVARCHAR(MAX) as json 
        )

        --> Data Json
        INSERT INTO @tbTransaccion
               (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
        SELECT  idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,@idUsuario,@idEntidad,serieComprobante 
        FROM OPENJSON(@json) WITH
        (
            idTipoTransaccion INT
           ,fechaEmision DATETIME2
           ,idTipoDocumento INT
           ,idDocumento INT
           ,CustomerId INT
           ,serieComprobante VARCHAR(25)
        )

        INSERT INTO @tbDetailts
              (idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
		SELECT idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total
        FROM OPENJSON(@detalles) WITH
        (
            idArticulo INT
           ,idBodega INT
           ,idMedida INT
           ,idTarifa INT
           ,cantidad NUMERIC(18,5)
           ,conversion NUMERIC(18,5)
           ,cantidadTransaccion NUMERIC(18,5)
           ,precioUnitario NUMERIC(18,5)
           ,precioCosto NUMERIC(18,5)
           ,precioCostoFraccionado NUMERIC(18,5)
           ,total NUMERIC(18,5)
        )

        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbTransaccion)
            BEGIN
                SET @message = 'Error en la info de la transaccion';
            END

         IF NOT EXISTS(SELECT 1 FROM @tbDetailts)
            BEGIN
                SET @message = 'Error en los detalles de la transaccion';
            END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

        --> TRANSACCION
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            INSERT INTO Inventario.Transaccion
                  (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,serieComprobante,idUsuario,idEntidad)
            SELECT idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,serieComprobante,@idUsuario,@idEntidad 
            FROM @tbTransaccion

            SET @idTransaccion = SCOPE_IDENTITY()

            -->Detalles
            INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                   (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total 
            FROM @tbDetailts 
            WHERE llevaInventario = 1
            ORDER BY orderIndex ASC


   --         INSERT INTO [Contabilidad].[Servicio] WITH (ROWLOCK)
   --               (TipoDocumentoId, PuntoEmisionId, ClienteId, UsuarioId,ArticuloId,TarifaId,MedidaId,TipoIvaId,BodegaId,DocumentoId,Secuencial,FechaEmision,Descripcion,Nota,Cantidad,PrecioUnitario,PrecioCosto,PrecioTotalSinImpuesto)
			--SELECT idTipoDocumento,@idPuntoEmision,@idCliente,@idUsuario,idArticulo,idTarifa,idMedida,idTipoIva,idBodega,@idFactura,@secuencial,@fechaEmision,descripcion,nota,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto
   --         FROM @tblDetails 
   --         WHERE llevaInventario = 0
   --         ORDER BY orderIndex ASC

        IF (@@ROWCOUNT > 0)
		    BEGIN
			    SET @code = '0';
			    SET @message = 'Registrado Exitosamente';
		    END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @errorCode = 5001
                SET @errorMessage = 'No se pudo registrar'
				SET @message = @errorMessage;
			END
 
	    IF (@startedTransaction = 1)
		    BEGIN
			    COMMIT;
			    SELECT @code as code, @message as 'message';
		    END

    END TRY

    BEGIN CATCH
        IF @startedTransaction = 1 
            BEGIN
                ROLLBACK TRANSACTION;
                -- Log error details
                INSERT INTO dbo.ErroresSistema
                (
                    [method]
                   ,[errorNumber]
                   ,[errorSeverity]
                   ,[errorState]
                   ,[errorProcedure]
                   ,[errorLine]
                   ,[errorMessage]
                   ,[idUsuario]
                )
                VALUES
                (
                    'Transaccion/Insert'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                THROW 50001, 'Error en el procedimiento: ', 1;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE();
			END    
    END CATCH
END
GO
