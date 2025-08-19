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
    DECLARE @userId INT

    --> Movimiento Caja 
    DECLARE @idTipoDocumento INT ,@idComprobanteIngreso INT ,@idControlCaja INT

    --> Contabilidad
    DECLARE @idEstadoPago INT

    BEGIN TRY 
        
        --> Recuperando Variables
        SELECT TOP 1 @idComprobanteIngreso = idComprobanteIngreso FROM dbo.Anticipo WITH (NOLOCK) WHERE idAnticipo = @id 

        SELECT TOP 1 @idControlCaja = idControlCaja FROM dbo.ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @idComprobanteIngreso

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

        --> Validacion de Informacion
        IF EXISTS (SELECT 1 FROM dbo.Anticipo WITH (NOLOCK) WHERE idAnticipo = @id AND estado = 0)
            BEGIN
                SELECT '0' as code, 'Este Comprobante ya se encuentra anulado' as 'message'	
                 
            END

        IF EXISTS (SELECT 1 FROM ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja AND estado = 0)
            BEGIN 
                SELECT '0' as code,'El control de caja se encuentra cerrado no puede ser anulado el comproabnte' as 'message'	
				
            END

        IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = 'A' AND idDocumento = @id AND codEstado NOT IN ('PE'))
            BEGIN 
                SELECT '0' as code,'El anticipo cuenta en un estado contable no puede ser anulado' as 'message'	
				
            END

        BEGIN TRAN 
            UPDATE dbo.Anticipo WITH (ROWLOCK) SET estado = 0 WHERE idAnticipo = @id

            UPDATE dbo.ComprobanteIngreso WITH (ROWLOCK) SET estado = 0,fechaAnulada = dbo.ufnGetDateEcuador() ,idUsuarioAnulado = @userId WHERE idComprobanteIngreso = @idComprobanteIngreso 
        
            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK) SET idEstadoPago = @idEstadoPago WHERE idDocumento = @id AND codDoc = 'A'
        COMMIT TRAN 
        SELECT '1' as code, 'Anulado Correctamente' as 'message'
    END TRY 

    BEGIN CATCH 
        IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END 
        SELECT '0' as code, 'Info: Error en el procedimiento' as 'message'
		 INSERT INTO ErroresSistema
			    (method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,idUsuario, additionalInfo)
		VALUES ('/Anticipo/Get',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),@userId,  N'{' +
            N'"userRoleId": ' + CAST(@userRoleId AS NVARCHAR) + N',' +
            N'"id": ' + CAST(@id AS NVARCHAR) + N'}');
    END CATCH

END
