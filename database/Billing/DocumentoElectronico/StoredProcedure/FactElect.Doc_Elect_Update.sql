USE [AcontPlus]
GO

CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Update @userRoleId INT ,@id INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    DECLARE @idEntidad INT
           ,@message VARCHAR(100) = 'No actualizado'
           ,@codeResponse VARCHAR(1) = '0'
           ,@userId INT
           ,@codDoc VARCHAR(10)
           ,@fechaEmision DATETIME2 
           ,@serieComprobante VARCHAR(20)

    BEGIN TRY
        -- Get entity ID associated with the user role
        SELECT @idEntidad = idEntidad ,@userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId;

        SELECT TOP 1 @codDoc = codDoc ,@fechaEmision = fechaEmision ,@serieComprobante = serieComprobante FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id

        --> Validate 
        IF NOT EXISTS (SELECT 1 FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad AND fechaCaducidad > GETDATE())
            BEGIN
                SELECT '0' AS code, 'No existe firma válida o la firma ha expirado' AS message;
                RETURN;
            END

        IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado = 4)
            BEGIN
                SELECT '0' AS code, 'El comprobante ya se encuentra autorizado' AS message;
                RETURN;
            END

        IF DATEDIFF(DAY, @fechaEmision, GETDATE()) > IIF(@codDoc = '07',0,0)
            BEGIN
                SELECT '0' AS code, 'El documento ' + @serieComprobante + ' se encuentra fuera de la fecha permitida por el SRI' AS message;
                RETURN;
            END
        BEGIN TRANSACTION;

            --> Actualizar si el documento esta en estado firmado
            IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado = 2)
                BEGIN
                    UPDATE DocumentoElectronico SET isAutomatic = 1 WHERE idDocumentoElectronico = @id;

                    SET @codeResponse = '1';
                    SET @message = 'Enviado a autorizar en el SRI';
                END

            --> En caso de Error volvera al estado en proceso
            IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado IN (0,5))
                BEGIN
                    DECLARE @idEstadoServicio INT

                    SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1;

                    UPDATE DocumentoElectronico  SET idEstadoServicio = @idEstadoServicio, xmlAcontPlus = NULL WHERE idDocumentoElectronico = @id;

                    SET @codeResponse = '1';
                    SET @message = 'El XML se está actualizando';
                END

        COMMIT TRANSACTION;
        SELECT @codeResponse AS code, @message AS message;
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
            'DocumentoElectronico/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId
        );

        -- Return error message
        SELECT '0' AS code, 'Error en el procedimiento!' AS message;
    END CATCH
END
