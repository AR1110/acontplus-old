USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[TransferenciaBodega_Delete]    Script Date: 12/9/2022 12:11:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.TransferenciaBodega_Delete @userRoleId INT,@id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    --> Global
	DECLARE @idUsuario INT ,@idTipoDocumento INT

    --> Transferencia
    DECLARE @idEstadoDocumento INT,@codDOc VARCHAR(5)
	
	BEGIN TRY 

		--> Variables 
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'TB'
		
		SELECT TOP 1 @codDOc = ep.codigo 
		FROM TransferenciaBodega tb WITH (NOLOCK)
		INNER JOIN EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento
		WHERE tb.idTransferenciaBodega = @id

		IF @codDOC = 'A'
			BEGIN
				SELECT  '0'code,'La Transferencia se encuenentra <b> Anulada <b> no puede ser editada'[message]
				RETURN 
			END 


		BEGIN TRAN 
			
			UPDATE dbo.TransferenciaBodega WITH (ROWLOCK) 
               SET idEstadoDocumento = @idEstadoDocumento
                  ,idUsuario         = @idUsuario
            WHERE idTransferenciaBodega = @id

            --> Transaccion
            UPDATE Inventario.Transaccion WITH (ROWLOCK)
               SET estado = 0
            WHERE idTipoDocumento = @idTipoDocumento
              AND idDocumento     = @id  

            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) 
               SET estado = 0
            WHERE idTransaccion IN (SELECT idTransaccion FROM Inventario.Transaccion WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento AND idDocumento = @id )

            EXEC dbo.Transaccion_Handler_Init 'SN', 'TB', @id, DEFAULT

		COMMIT TRAN 
		SELECT '1'code,'Anulado Correctamente'[message]
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Transferencia/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT  '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 
END
