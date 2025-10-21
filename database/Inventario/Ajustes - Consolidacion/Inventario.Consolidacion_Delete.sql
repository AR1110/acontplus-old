	USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPConsolidacionInventarioDelete]    Script Date: 12/8/2022 4:28:19 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Consolidacion_Delete @userRoleId INT, @id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    --> Global 
	DECLARE @idUsuario INT 
	
    --> Consolidacion
    DECLARE @idEstadoDocumento INT ,@codEstado VARCHAR(10) ,@idTipoDocumento INT

    --> Transaccion 
    DECLARE @idTransaccion INT ,@codDoc VARCHAR(50) ,@codTran VARCHAR(50) ,@detalles VARCHAR(MAX)

    DECLARE @tblDetails AS TABLE (
         idArticulo INT NOT NULL
        ,idBodega INT NOT NULL
        ,idMedida INT NULL
        ,cantidad NUMERIC (18,5) NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,precioUnitario NUMERIC (18,5) NOT NULL
        ,precioCosto NUMERIC (18,5) NOT NULL
        ,total NUMERIC (18,5) NOT NULL
        ,nota VARCHAR(100) NULL
        ,descripcion VARCHAR(255) NOT NULL 
        ,conversion NUMERIC(15,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(15,5) NOT NULL
	)

	BEGIN TRY
        --> Global
		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data json
		SELECT @detalles = detalles FROM OPENJSON (@json) WITH (detalles NVARCHAR(MAX) AS JSON)

        INSERT INTO @tblDetails
              (idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,conversion,precioCostoFraccionado)
		SELECT idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,conversion,precioCostoFraccionado 
		FROM OPENJSON (@detalles) WITH 
        (
			 idArticulo                       INT           
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
		)

		SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.ConsolidacionInventario WITH (NOLOCK) WHERE idConsolidacionInventario =  @id

        SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idDocumento = @id AND idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @codDoc = td.codigo, @codTran = tt.codigo
        FROM Inventario.Transaccion           tr WITH (NOLOCK) 
        INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idTransaccion = @idTransaccion

		SELECT TOP 1 @codEstado = ep.codigo 
        FROM dbo.ConsolidacionInventario ci WITH (NOLOCK) 
        INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = ci.idEstadoDocumento
		WHERE ci.idConsolidacionInventario = @id
		 
		IF @codEstado = 'A'
			BEGIN 
                SELECT '0'code,'La Consolidacion se encuentra <b> Anulada </b>'[message]
				RETURN 
			END

        IF EXISTS (SELECT 1 FROM Inventario.TransaccionDetalle WHERE AjusteId = @idTransaccion)
            BEGIN
                SELECT '0'code,'No puedes anular este ajuste ya tiene movimietos vinculados.'[message]
                RETURN
            END
 
		BEGIN TRAN 

			UPDATE ConsolidacionInventario SET idEstadoDocumento = @idEstadoDocumento,lastChange = dbo.ufnGetDateEcuador(),idUserUpdate = @idUsuario WHERE idConsolidacionInventario = @id

			UPDATE Inventario.Transaccion WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

            IF @codDoc = 'CI'
                BEGIN
                    UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion
                END
            ELSE
                BEGIN
                    INSERT INTO Inventario.TransaccionDetalle WITH(ROWLOCK)
				           (idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioCosto,precioCostoFraccionado,precioUnitario,total)
			        SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioCosto,precioCostoFraccionado,precioUnitario,total
                    FROM @tblDetails
                    WHERE cantidadTransaccion <> 0 

                    EXEC dbo.Transaccion_Handler_Init @idTransaccion
                END 

            EXEC dbo.Transaccion_Handler_Init @idTransaccion

		COMMIT TRAN 
		SELECT '1'code,'Documento Anulado'[message]
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Consolidacion/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT  '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 
END
