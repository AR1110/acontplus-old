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
CREATE OR ALTER PROCEDURE Inventario.Consolidacion_Delete @userRoleId INT, @id INT 
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
    DECLARE @idTransaccion INT ,@codDoc VARCHAR(50) ,@codTran VARCHAR(50)
     

	BEGIN TRY 
        

		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

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
 
		BEGIN TRAN 

			UPDATE ConsolidacionInventario SET idEstadoDocumento = @idEstadoDocumento,lastChange = dbo.ufnGetDateEcuador(),idUserUpdate = @idUsuario WHERE idConsolidacionInventario = @id

			UPDATE Inventario.Transaccion WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion
                    
            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0, AjusteId = NULL WHERE idTransaccion = @idTransaccion

            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET AjusteId = NULL WHERE AjusteId = @idTransaccion
           
            EXEC dbo.Transaccion_Handler_Init @codTran, @codDoc, @id, DEFAULT

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
