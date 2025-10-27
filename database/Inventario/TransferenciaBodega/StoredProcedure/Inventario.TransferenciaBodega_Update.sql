    USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[TransferenciaBodega_Update]    Script Date: 12/9/2022 12:06:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.TransferenciaBodega_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	 
    --> Global
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) 

    --> Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@transaccionDetalle VARCHAR(MAX)
    
    --> Transferencia
	DECLARE @idEstadoDocumento INT ,@fechaEmision DATETIME2 

    --> Transaccion 
    DECLARE @idTipoTransaccion  INT ,@idTipoDocumento INT ,@idTransaccion INT

    DECLARE @tbTranferencia TABLE (
        idTransferenciaBodega INT NOT NULL
	   ,fechaEmision DATETIME2 NOT NULL
	   ,observacion VARCHAR(300) NULL
	   ,total NUMERIC(18,5) NOT NULL
    )

	DECLARE @tblDetails AS TABLE (
         orderIndex INT NOT NULL
        ,idTransferenciaBodegaDetalle INT NOT NULL
        ,idArticulo INT NOT NULL
	    ,idMedida INT NOT NULL
	    ,cantidad NUMERIC(18,5) NOT NULL
	    ,descripcion VARCHAR(300) NOT NULL
	    ,precioCosto NUMERIC(18,5) NOT NULL
	    ,total NUMERIC(18,5) NOT NULL
        ,estado BIT NOT NULL
	)

    DECLARE @tbTransaccionDetalle AS TABLE (
        idTipoTransaccion INT NOT NULL
       ,idTipoDocumento INT NOT NULL
       ,idArticulo INT NOT NULL
       ,idBodega INT NOT NULL
       ,idMedida INT NOT NULL
       ,cantidad NUMERIC(18,5) NOT NULL 
       ,cantidadTransaccion NUMERIC(18,5) NOT NULL
       ,precioUnitario NUMERIC(18,5) NOT NULL
       ,precioCosto NUMERIC(18,5) NOT NULL
       ,conversion NUMERIC(15,5) NOT NULL
       ,precioCostoFraccionado NUMERIC(15,5) NOT NULL
       ,total NUMERIC(18,5) NOT NULL
       ,estado BIT NOT NULL
    )

	BEGIN TRY
	    
		--> Global 
        SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante        = comprobante
              ,@detalles           = detalles
              ,@transaccionDetalle = transaccionDetalles
              
        FROM OPENJSON(@json) WITH 
        (
             comprobante        NVARCHAR(MAX) as json
            ,detalles           NVARCHAR(MAX) as json 
            ,transaccionDetalles NVARCHAR(MAX) as json
            
        )

        INSERT INTO @tbTranferencia 
              (idTransferenciaBodega,fechaEmision,observacion,total)
        SELECT @id                  ,fechaEmision,observacion,total 
        FROM OPENJSON(@comprobante) WITH 
        (
            fechaEmision    DATETIME2
	       ,observacion     VARCHAR(300)
	       ,total           NUMERIC(18,5)
        )

		INSERT INTO @tblDetails
              (orderIndex,idTransferenciaBodegaDetalle,idArticulo,idMedida,cantidad,descripcion,precioCosto,total,estado)
		SELECT orderIndex,idTransferenciaBodegaDetalle,idArticulo,idMedida,cantidad,descripcion,precioCosto,total,estado
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex                   INT 
            ,idTransferenciaBodegaDetalle INT
            ,idArticulo                   INT 
		    ,idMedida                     INT 
		    ,cantidad                     NUMERIC(15,5)
            ,descripcion                  VARCHAR(300)
		    ,precioCosto                  NUMERIC(15,5) 
		    ,total                        NUMERIC(15,5)
            ,estado                       BIT
		)

        INSERT INTO @tbTransaccionDetalle 
              (idTipoTransaccion,idTipoDocumento,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,conversion,precioCostoFraccionado,estado)
        SELECT idTipoTransaccion,idTipoDocumento,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,conversion,precioCostoFraccionado,estado
        FROM OPENJSON(@transaccionDetalle) WITH 
        (
             idTipoTransaccion      INT 
            ,idTipoDocumento        INT 
            ,idArticulo             INT 
            ,idBodega               INT 
            ,idMedida               INT 
            ,cantidad               NUMERIC(18,5)  
            ,cantidadTransaccion    NUMERIC(18,5) 
            ,precioUnitario         NUMERIC(18,5) 
            ,precioCosto            NUMERIC(18,5) 
            ,total                  NUMERIC(18,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
            ,estado                 BIT
        )

        --> Recuperando Datos
        SELECT TOP 1 @fechaEmision = fechaEmision FROM @tbTranferencia 

        SELECT TOP 1 @idEstadoDocumento = idEstadoDocumento FROM dbo.TransferenciaBodega WITH (NOLOCK) WHERE idTransferenciaBodega = @id

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'TB'

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @tbTranferencia) = 0 
            BEGIN
                SELECT '0'code,'Error en el comprobante'[message]
                RETURN
            END 

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT '0'code,'Error en los detalles'[message]
                RETURN
            END
           
        IF (SELECT COUNT(*) FROM @tbTransaccionDetalle) = 0 
            BEGIN
                SELECT '0'code,'Error en la transaccion'[message]
                RETURN
            END

        IF (SELECT TOP 1 codigo FROM dbo.EstadoPago WHERE idEstadoPago = @idEstadoDocumento) = 'A'
            BEGIN
                SELECT '0'code,'El Documento se encuentra Anulado'[message]
                RETURN
            END 
        
		BEGIN TRAN
            
            --> Comprobante
			UPDATE tb SET 
				   tb.fechaEmision    = tt.fechaEmision
				  ,tb.total           = tt.total
				  ,tb.observacion     = tt.observacion
            FROM dbo.TransferenciaBodega tb WITH (ROWLOCK)
            INNER JOIN @tbTranferencia   tt ON tt.idTransferenciaBodega = tb.idTransferenciaBodega

            --> Detalles
			UPDATE tb SET 
				   tb.idMedida    = js.idMedida
				  ,tb.cantidad    = js.cantidad
				  ,tb.descripcion = js.descripcion
			      ,tb.precioCosto = js.precioCosto
				  ,tb.total       = js.total
				  ,tb.estado      = js.estado
			FROM dbo.TransferenciaBodegaDetalle tb WITH (ROWLOCK)
			INNER JOIN @tblDetails              js ON js.idTransferenciaBodegaDetalle = tb.idTransferenciaBodegaDetalle

			INSERT INTO TransferenciaBodegaDetalle
				   (idTransferenciaBodega,idArticulo,idMedida,cantidad,descripcion,precioCosto,total)
			SELECT @id                   ,idArticulo,idMedida,cantidad,descripcion,precioCosto,total
			FROM @tblDetails
            WHERE idTransferenciaBodegaDetalle = 0
            ORDER BY orderIndex ASC

            DELETE FROM dbo.TransferenciaBodegaDetalle WHERE idTransferenciaBodega = @id AND estado = 0

            --> Transaccion
            UPDATE Inventario.Transaccion WITH (ROWLOCK)
               SET fechaEmision = @fechaEmision
            WHERE idTipoDocumento = @idTipoDocumento
              AND idDocumento     = @id  

            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) 
               SET estado = 0
                 ,cantidadTransaccion = 0
            WHERE idTransaccion IN( SELECT idTransaccion FROM Inventario.Transaccion WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento AND idDocumento = @id )

            INSERT INTO Inventario.TransaccionDetalle 
                  (idTransaccion
                  ,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total)
			SELECT (
                        SELECT TOP 1 tr.idTransaccion 
                        FROM Inventario.Transaccion tr 
                        WHERE tr.idTipoDocumento   = td.idTipoDocumento
                          AND tr.idTipoTransaccion = td.idTipoTransaccion
                          AND tr.idDocumento       = @id
                            
                    )
                  ,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total 
            FROM @tbTransaccionDetalle td
            WHERE td.estado = 1

            UPDATE td SET td.cantidadTransaccion = td.cantidadTransaccion * -1
            FROM Inventario.TransaccionDetalle    td
            INNER JOIN Inventario.Transaccion     tr ON tr.idTransaccion     = td.idTransaccion
            INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
            INNER JOIN Inventario.TipoDocumento   dt ON dt.idTipoDocumento   = tr.idTipoDocumento
            WHERE dt.codigo = 'TB'
              AND tt.codigo = 'S'
              AND tr.idDocumento = @id

            EXEC dbo.Transaccion_Handler_Init 'SN', 'TB', @id, DEFAULT

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente'[message],@payload as payload
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Transferencia/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT '0'code,'Info: Error en el procedimiento'[message]
	END CATCH

END
