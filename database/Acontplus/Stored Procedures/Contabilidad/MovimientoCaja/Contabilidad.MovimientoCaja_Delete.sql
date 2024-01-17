USE [Acontplus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMovimientoCajaInsert]    Script Date: 16/1/2024 15:46:30 ******/
 

/**
Author: Emilio Senguana
*/
CREATE OR ALTER PROCEDURE Contabilidad.MovimientoCaja_Delete @userRoleId INT ,@id INT 
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
        SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento
                    ,@codDoc          = td.codigo
        FROM dbo.MovimientoCaja      mc WITH (NOLOCK)
        INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = mc.idTipoDocumento
        WHERE mc.idMovimientoCaja = @id

        IF EXISTS (SELECT 1 FROM dbo.MovimientoCaja WITH (NOLOCK) WHERE idMovimientoCaja = @id AND estado = 0)
            BEGIN
                SELECT Common.ufnSpResponse('0', 'Este Comprobante ya se encuentra anulado',  DEFAULT)	
                RETURN 
            END

    END TRY 

    BEGIN CATCH 
        IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END 
        SELECT Common.ufnSpResponse('0', 'Info: Error en el procedimiento',  DEFAULT)
		INSERT INTO ErroresSistema
		    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/MovimientoCaja/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
    END CATCH

END
