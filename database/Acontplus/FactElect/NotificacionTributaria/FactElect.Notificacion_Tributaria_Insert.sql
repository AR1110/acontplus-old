USE [AcontPlus]
GO

CREATE OR ALTER PROCEDURE FactElect.Notificacion_Tributaria_Insert @userRoleId INT, @json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
    SET XACT_ABORT ON;
	SET LANGUAGE SPANISH;
	
	DECLARE @idDocumentoElectronico BIGINT;
	DECLARE @receptor NVARCHAR(MAX);
	DECLARE @estado VARCHAR(3);
    DECLARE @userId INT;


	BEGIN TRY
        SELECT @idDocumentoElectronico = idDocumentoElectronico
        ,@receptor = receptor
        ,@estado = 'NE'
	    FROM OPENJSON(@json)
	        WITH(
                    idDocumentoElectronico BIGINT '$.idDocumentoElectronico',
                    receptor NVARCHAR(150) '$.receptor'
            );

        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN
			INSERT INTO FactElect.NotificacionTributaria (idDocumentoElectronico, receptor, estado)
			VALUES(@idDocumentoElectronico,@receptor, @estado)
		COMMIT TRAN 
		SELECT '1' code, 'Reenviado el Correo Correctamente' as'message';
	END TRY
	BEGIN CATCH
		 -- Rollback transaction if an error occurs
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRANSACTION;

        -- Log error details
        INSERT INTO dbo.ErroresSistema (
            [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario]
        )
        VALUES (
            'NotificationTributaria/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId
        );

        -- Return error message
        SELECT '0' AS code, 'Error en el procedimiento!' AS message;
	END CATCH

END

