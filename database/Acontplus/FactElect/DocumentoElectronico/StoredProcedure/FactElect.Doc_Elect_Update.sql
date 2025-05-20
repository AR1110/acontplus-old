USE [AcontPlus]
GO

CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Update 
    @userRoleId INT,
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    DECLARE @idEntidad INT;
    DECLARE @message VARCHAR(100) = 'No actualizado';
    DECLARE @codeResponse VARCHAR(1) = '0';
    DECLARE @idEstadoServicio INT;
    DECLARE @userId INT;

    BEGIN TRY
        -- Get entity ID associated with the user role
        SELECT @idEntidad = idEntidad
        ,@userId = idUsuario
        FROM App.UsuarioRol WITH (NOLOCK) 
        WHERE idUsuarioRol = @userRoleId;

        -- Validate electronic signature
        IF NOT EXISTS (
            SELECT 1 
            FROM dbo.FirmaElectronica WITH (NOLOCK) 
            WHERE idEntidad = @idEntidad AND fechaCaducidad > GETDATE()
        )
        BEGIN
            SELECT '0' AS code, 'No existe firma válida o la firma ha expirado' AS message;
            RETURN;
        END

        -- Check if the document is already authorized
        IF EXISTS (
            SELECT 1 
            FROM FactElect.v_DocElectronico WITH (NOLOCK) 
            WHERE idDocumentoElectronico = @id AND codEstado = 4
        )
        BEGIN
            SELECT '0' AS code, 'El comprobante ya se encuentra autorizado' AS message;
            RETURN;
        END

        -- Validate document issuance date
        IF EXISTS (
            SELECT 1 
            FROM dbo.DocumentoElectronico WITH (NOLOCK) 
            WHERE idDocumentoElectronico = @id AND DATEDIFF(DAY, fechaEmision, GETDATE()) > 4
        )
        BEGIN
            SELECT '0' AS code, 'El documento se encuentra fuera de la fecha permitida por el SRI' AS message;
            RETURN;
        END

        -- Temporary message (Consider removing if unnecessary)
        --SELECT '0' AS code, 'Este mensaje es temporal, factura autorizada fail' AS message;
        --RETURN;

        -- Begin transaction
        BEGIN TRANSACTION;

        -- Update document status based on conditions
        IF EXISTS (
            SELECT 1 
            FROM FactElect.v_DocElectronico WITH (NOLOCK) 
            WHERE idDocumentoElectronico = @id AND codEstado = 2 AND isAutomatic = 0
        )
        BEGIN
            UPDATE DocumentoElectronico 
            SET isAutomatic = 1 
            WHERE idDocumentoElectronico = @id;

            SET @codeResponse = '1';
            SET @message = 'Enviado a autorizar en el SRI';
        END

        IF EXISTS (
            SELECT 1 
            FROM FactElect.v_DocElectronico WITH (NOLOCK) 
            WHERE idDocumentoElectronico = @id AND codEstado = 2 AND isAutomatic = 1
        )
        BEGIN
            SELECT TOP 1 @idEstadoServicio = idEstadoServicio 
            FROM FactElect.EstadoServicio WITH (NOLOCK) 
            WHERE codigo = 1;

            UPDATE DocumentoElectronico 
            SET idEstadoServicio = @idEstadoServicio 
            WHERE idDocumentoElectronico = @id;

            SET @codeResponse = '1';
            SET @message = 'Enviado a autorizar en el SRI';
        END

        IF EXISTS (
            SELECT 1 
            FROM FactElect.v_DocElectronico WITH (NOLOCK) 
            WHERE idDocumentoElectronico = @id AND codEstado IN (0,5)
        )
        BEGIN
            SELECT TOP 1 @idEstadoServicio = idEstadoServicio 
            FROM FactElect.EstadoServicio WITH (NOLOCK) 
            WHERE codigo = 1;

            UPDATE DocumentoElectronico 
            SET idEstadoServicio = @idEstadoServicio 
            WHERE idDocumentoElectronico = @id;

            SET @codeResponse = '1';
            SET @message = 'El XML se está actualizando';
        END

        -- Commit transaction
        COMMIT TRANSACTION;

        -- Return response
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