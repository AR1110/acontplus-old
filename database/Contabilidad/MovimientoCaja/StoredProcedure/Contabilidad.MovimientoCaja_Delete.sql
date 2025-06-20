USE [Acontplus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMovimientoCajaInsert]    Script Date: 16/1/2024 15:46:30 ******/


/**
Author: Emilio Senguana
*/
CREATE OR ALTER PROCEDURE Contabilidad.MovimientoCaja_Delete
    @userRoleId INT ,
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idUsuario INT

    --> ComprobanteIngreso 
    DECLARE @idComprobanteIngreso INT

    --> ComprobanteEgreso 
    DECLARE @idComprobanteEgreso INT

    --> ControlCaja
    DECLARE @idControlCaja INT

    BEGIN TRY 
        
        --> Recuperando Variables
        SELECT TOP 1
        @idComprobanteIngreso = idComprobanteIngreso , @idComprobanteEgreso = idComprobanteEgreso
    FROM dbo.MovimientoCaja WITH (NOLOCK)
    WHERE idMovimientoCaja = @id

        IF @idComprobanteIngreso > 0
            BEGIN
        SELECT TOP 1
            @idControlCaja = idControlCaja
        FROM dbo.ComprobanteIngreso WITH (NOLOCK)
        WHERE idComprobanteIngreso = @idComprobanteIngreso
    END 
        
        IF @idComprobanteEgreso > 0
            BEGIN
        SELECT TOP 1
            @idControlCaja = idControlCaja
        FROM dbo.ComprobanteEgreso WITH (NOLOCK)
        WHERE idComprobanteEgreso = @idComprobanteEgreso
    END 

        --> Validaciones
        IF EXISTS (SELECT 1
    FROM dbo.MovimientoCaja WITH (NOLOCK)
    WHERE idMovimientoCaja = @id AND estado = 0)
            BEGIN
        SELECT '0'code, 'Este Comprobante ya se encuentra anulado' as [message]
        RETURN
    END

    --    IF EXISTS (SELECT 1 FROM ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja AND estado = 0)
    --        BEGIN 
    --            SELECT '0' as code,'El control de caja se encuentra cerrado no puede ser anulado el comproabnte' as 'message'
				--RETURN
    --        END

        BEGIN TRAN 
            
            UPDATE dbo.MovimientoCaja WITH (ROWLOCK) SET estado = 0 WHERE idMovimientoCaja = @id

            IF @idComprobanteIngreso > 0
                BEGIN
        UPDATE dbo.ComprobanteIngreso WITH (ROWLOCK) SET estado = 0,fechaAnulada = dbo.ufnGetDateEcuador() ,idUsuarioAnulado = @idUsuario WHERE idComprobanteIngreso = @idComprobanteIngreso
    END
                
            IF @idComprobanteEgreso > 0
                BEGIN
        UPDATE dbo.ComprobanteEgreso WITH (ROWLOCK) SET estado = 0,fechaAnulada = dbo.ufnGetDateEcuador() ,idUsuarioAnulado = @idUsuario WHERE idComprobanteEgreso = @idComprobanteEgreso
    END

        COMMIT TRAN 
        SELECT '1'code, 'Anulado Correctamente' as [message]
    END TRY 

    BEGIN CATCH 
        IF @@TRANCOUNT > 0 
		    BEGIN
        ROLLBACK TRAN;
    END 
        
		INSERT INTO ErroresSistema
        (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
    SELECT NEWID(), '/MovimientoCaja/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @idUsuario

        SELECT '0'code, 'Info: Error en el procedimiento' as [message]
    END CATCH

END
