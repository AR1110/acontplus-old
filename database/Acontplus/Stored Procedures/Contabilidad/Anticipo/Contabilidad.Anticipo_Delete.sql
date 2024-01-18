USE [Acontplus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMovimientoCajaInsert]    Script Date: 16/1/2024 15:46:30 ******/
 

/**
Author: Emilio Senguana
*/
CREATE OR ALTER PROCEDURE Contabilidad.Anticipo_Delete @userRoleId INT ,@id INT 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idUsuario INT

    --> Movimiento Caja 
    DECLARE @idTipoDocumento INT ,@codDoc VARCHAR(10) ,@idComprobante INT

    BEGIN TRY 
        
        --> Recuperando Variables
        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.Anticipo WITH (NOLOCK) WHERE idAnticipo = @id

        SELECT TOP 1 @idComprobante = idComprobanteIngreso FROM dbo.CobroDocumento WITH (NOLOCK) WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

        --> Validacion de Informacion
        IF EXISTS (SELECT 1 FROM dbo.Anticipo WITH (NOLOCK) WHERE idAnticipo = @id AND estado = 0)
            BEGIN
                SELECT Common.ufnSpResponse('0', 'Este Comprobante ya se encuentra anulado',  DEFAULT)	
                RETURN 
            END

        BEGIN TRAN 
            UPDATE dbo.Anticipo WITH (ROWLOCK) SET estado = 0 WHERE idAnticipo = @id

            UPDATE dbo.ComprobanteIngreso WITH (ROWLOCK) SET estado = 0,fechaAnulada = dbo.ufnGetDateEcuador() ,idUsuarioAnulado = @idUsuario WHERE idComprobanteIngreso = @idComprobante 
        COMMIT TRAN 
        SELECT Common.ufnSpResponse('1', 'Anulado Correctamente',  DEFAULT)
    END TRY 

    BEGIN CATCH 
        IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END 
        SELECT Common.ufnSpResponse('0', 'Info: Error en el procedimiento',  DEFAULT)
		INSERT INTO ErroresSistema
		    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Anticipo/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
    END CATCH

END
