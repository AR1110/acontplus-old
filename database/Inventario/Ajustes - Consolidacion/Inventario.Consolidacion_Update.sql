USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPConsolidacionInventarioUpdate]    Script Date: 12/8/2022 4:22:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Consolidacion_Update @userRoleId INT ,@id INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	--> Global
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) 
    
    --> Data Json
    DECLARE @consolidacion VARCHAR(MAX) ,@detalles VARCHAR(MAX)

    --> Consolidacion
    DECLARE @fechaEmision DATETIME2 ,@idEstadoDocumento INT 

    --> Transaccion 
    DECLARE @idTipoTransaccion  INT ,@idTipoDocumento INT ,@idTransaccion INT ,@codDoc VARCHAR(50) ,@codTran VARCHAR(50) ,@valor INT = 1

    DECLARE @tbComprobante AS TABLE(
         idConsolidacionInventario INT NOT NULL
        ,idTipoDocumento INT NOT NULL
        ,idTipoTransaccion INT NOT NULL
        ,observacion VARCHAR(300) NULL
        ,total NUMERIC(18,5) NOT NULL
    )

    DECLARE @tblDetails AS TABLE (
         orderIndex INT NOT NULL
        ,idConsolidacionInventarioDetalle INT NOT NULL
        ,idArticulo INT NOT NULL
        ,idBodega INT NOT NULL
        ,idMedida INT NULL
        ,cantidad NUMERIC (18,5) NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,precioUnitario NUMERIC (18,5) NOT NULL
        ,precioCosto NUMERIC (18,5) NOT NULL
        ,total NUMERIC (18,5) NOT NULL
        ,nota VARCHAR(100) NULL
        ,descripcion VARCHAR(255) NOT NULL 
        ,estado BIT NOT NULL
        ,conversion NUMERIC(15,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(15,5) NOT NULL
	)

	BEGIN TRY
        --> Global 
        SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data json
		SELECT @consolidacion = consolidacion
              ,@detalles      = detalles 
        FROM OPENJSON (@json) WITH 
        (
            consolidacion NVARCHAR(MAX) AS JSON
           ,detalles      NVARCHAR(MAX) AS JSON
        )

        INSERT INTO @tbComprobante 
              (idConsolidacionInventario,idTipoDocumento,idTipoTransaccion,total,observacion)
		SELECT @id                      ,idTipoDocumento,idTipoTransaccion,total,observacion
		FROM OPENJSON (@consolidacion) WITH 
        (
		     idTipoDocumento   INT
            ,idTipoTransaccion INT
            ,fechaEmision      DATETIME2 
		    ,total             NUMERIC(18,5) 
		    ,observacion       VARCHAR(150) 
		)

		INSERT INTO @tblDetails
              (orderIndex,idConsolidacionInventarioDetalle,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,estado,conversion,precioCostoFraccionado)
		SELECT orderIndex,idConsolidacionInventarioDetalle,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,estado,conversion,precioCostoFraccionado 
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex                       INT            
			,idConsolidacionInventarioDetalle INT
            ,idArticulo                       INT           
			,idBodega                         INT           
			,idMedida                         INT           
			,cantidad                         NUMERIC(15,5) 
			,cantidadTransaccion              NUMERIC(15,5) 
			,precioUnitario                   NUMERIC(15,5) 
			,precioCosto                      NUMERIC(15,5) 
			,total                            NUMERIC(15,5) 
			,nota                             NVARCHAR(100) 
			,descripcion                      NVARCHAR(255)
            ,conversion                       NUMERIC(15,5)
            ,precioCostoFraccionado           NUMERIC(15,5)
            ,estado                           BIT 
		)
        
        --> Variables
        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.ConsolidacionInventario WITH (NOLOCK) WHERE idConsolidacionInventario =  @id

        SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idDocumento = @id AND idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @codDoc = td.codigo, @codTran = tt.codigo
        FROM Inventario.Transaccion           tr WITH (NOLOCK) 
        INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idTransaccion = @idTransaccion

	    SELECT TOP 1 @idEstadoDocumento = idEstadoDocumento ,@fechaEmision = fechaEmision FROM ConsolidacionInventario WITH (NOLOCK) WHERE idConsolidacionInventario = @id

        IF @codTran = 'S'
            BEGIN
                SET @valor = -1
            END

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @tbComprobante) = 0 
            BEGIN
                SELECT '0'code, 'Error en el comprobante'[message]
                RETURN
            END 

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT '0'code, 'Error en los detalles'[message]
                RETURN
            END

	    IF (SELECT TOP 1 codigo FROM dbo.EstadoPago WHERE idEstadoPago = @idEstadoDocumento) = 'A'
            BEGIN
                SELECT '0'code, 'El Documento se encuentra Anulado'[message]
                RETURN
            END 

		BEGIN TRAN 
            --> Comprobante
			UPDATE ci 
               SET ci.observacion = tc.observacion
                  ,ci.total       = tc.total
            FROM ConsolidacionInventario ci WITH (ROWLOCK)
            INNER JOIN @tbComprobante    tc ON tc.idConsolidacionInventario = ci.idConsolidacionInventario

            --> Detalles
			UPDATE cd 
               SET cd.idBodega     = js.idBodega
				  ,cd.idMedida     = js.idMedida
				  ,cd.cantidad     = js.cantidad
				  ,cd.descripcion  = js.descripcion
				  ,cd.precioActual = js.precioUnitario
				  ,cd.estado       = js.estado
			FROM ConsolidacionInventarioDetalle cd WITH (ROWLOCK)
			INNER JOIN @tblDetails              js ON js.idConsolidacionInventarioDetalle = cd.idConsolidacionInventarioDetalle

			INSERT INTO dbo.ConsolidacionInventarioDetalle
				   (idConsolidacionInventario,idArticulo,idBodega,idMedida,cantidad,descripcion,precioCosto,precioActual)
			SELECT @id                       ,idArticulo,idBodega,idMedida,cantidad,descripcion,precioCosto,precioUnitario
			FROM @tblDetails 
            WHERE idConsolidacionInventarioDetalle = 0
            ORDER BY orderIndex ASC

            DELETE FROM ConsolidacionInventarioDetalle WHERE idConsolidacionInventario = @id AND estado = 0

            --> Transaccion
            UPDATE Inventario.Transaccion WITH (ROWLOCK)
               SET fechaEmision = @fechaEmision
            WHERE idTransaccion = @idTransaccion

            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 ,cantidadTransaccion = 0 WHERE idTransaccion = @idTransaccion

            INSERT INTO Inventario.TransaccionDetalle WITH(ROWLOCK)
				   (idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioCosto,precioCostoFraccionado,precioUnitario,total)
			SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion * @valor,precioCosto,precioCostoFraccionado,precioUnitario,total
            FROM @tblDetails
            WHERE estado = 1

            EXEC dbo.Transaccion_Handler_Init @codTran, @codDoc, @id, DEFAULT

		COMMIT TRAN 
		SELECT '1'code, 'Actualizado Correctamente'[message],@payload as payload
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Consolidacion/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT '0'code, 'Info: Error en el procedimiento'[message]
	END CATCH 
END
