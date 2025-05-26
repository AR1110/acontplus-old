USE AcontPlus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Modified:    2025-05-26 - Improved version
-- Description: sp for insert tax retentions - Enhanced with better error handling and validation
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Insert 
    @userRoleId INT,
    @json VARCHAR(MAX),
    @errorCode INT = 0 OUT,
    @errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @userId INT,
            @idRetencionAts INT,
            @idRetAtsDocSustento INT,
            @recordCount INT = 0;

    DECLARE @code CHAR(1),
            @message VARCHAR(MAX),
            @trancount BIT = 0;

    BEGIN TRY
        -- Input validation
        IF @userRoleId IS NULL OR @userRoleId <= 0
        BEGIN
            SET @code = '0';
            SET @message = 'ID de rol de usuario inválido';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        IF @json IS NULL OR LEN(TRIM(@json)) = 0
        BEGIN
            SET @code = '0';
            SET @message = 'JSON de entrada es requerido';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Get user ID with validation
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId);
        
        IF @userId IS NULL
        BEGIN
            SET @code = '0';
            SET @message = 'Usuario no encontrado para el rol especificado';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Extract and validate idRetAtsDocSustento
        SET @idRetAtsDocSustento = (
            SELECT TOP 1 idRetAtsDocSustento 
            FROM OPENJSON(@json) 
            WITH(idRetAtsDocSustento INT '$.idRetAtsDocSustento')
        );

        IF @idRetAtsDocSustento IS NULL
        BEGIN
            SET @code = '0';
            SET @message = 'idRetAtsDocSustento no encontrado en el JSON';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Validate that the document exists
        SET @idRetencionAts = (
            SELECT idRetencionAts 
            FROM FactElect.RetAtsDocSustento 
            WHERE idRetAtsDocSustento = @idRetAtsDocSustento
        );

        IF @idRetencionAts IS NULL
        BEGIN
            SET @code = '0';
            SET @message = 'Documento de sustento no encontrado';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Validate JSON structure and retention tax IDs
        IF NOT EXISTS (
            SELECT 1 
            FROM OPENJSON(@json)
            WITH( 
                uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
                impuestoRetencionId INT '$.impuestoRetencionId',
                codigoRetencion VARCHAR(5) '$.codigoRetencion',
                baseImponible NUMERIC(18,5) '$.baseImponible',
                porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener',
                valorRetenido NUMERIC(18,5) '$.valorRetenido'
            ) j
        )
        BEGIN
            SET @code = '0';
            SET @message = 'JSON inválido o IDs de impuesto retención no encontrados';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Start transaction
        IF (@@TRANCOUNT = 0)
        BEGIN
            BEGIN TRANSACTION;
            SET @trancount = 1;
        END

        -- Check for existing records with same combination of impuestoRetencionId, codigoRetencion, and idRetAtsDocSustento
        IF EXISTS (
            SELECT 1 
            FROM OPENJSON(@json)
            WITH( 
                impuestoRetencionId INT '$.impuestoRetencionId',
                codigoRetencion VARCHAR(5) '$.codigoRetencion'
            ) j
            INNER JOIN FactElect.RetencionAtsRet existing 
                ON existing.impuestoRetencionId = j.impuestoRetencionId 
                AND existing.codigoRetencion = j.codigoRetencion
                AND existing.idRetAtsDocSustento = @idRetAtsDocSustento
        )
        BEGIN
            DECLARE @existingRetentions NVARCHAR(MAX);
            
            SELECT @existingRetentions = STRING_AGG(
                CONCAT('ImpuestoId: ', j.impuestoRetencionId, ', Código: ', j.codigoRetencion), 
                ' | '
            )
            FROM OPENJSON(@json)
            WITH( 
                impuestoRetencionId INT '$.impuestoRetencionId',
                codigoRetencion VARCHAR(5) '$.codigoRetencion'
            ) j
            INNER JOIN FactElect.RetencionAtsRet existing 
                ON existing.impuestoRetencionId = j.impuestoRetencionId 
                AND existing.codigoRetencion = j.codigoRetencion
                AND existing.idRetAtsDocSustento = @idRetAtsDocSustento;

            SET @code = '0';
            SET @message = CONCAT('Ya existen retenciones con las siguientes combinaciones: ', @existingRetentions);
            
            IF (@trancount = 1 AND @@TRANCOUNT > 0)
                ROLLBACK TRANSACTION;
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Insert retention details with validation (only new records)
        INSERT INTO FactElect.RetencionAtsRet(
            idRetencionAts, 
            idRetAtsDocSustento, 
            uniqueIdDoc, 
            impuestoRetencionId, 
            codigoRetencion,
            baseImponible, 
            porcentajeRetener, 
            valorRetenido, 
            idUsuario
        )
        SELECT 
            @idRetencionAts, 
            @idRetAtsDocSustento, 
            uniqueIdDoc, 
            impuestoRetencionId, 
            codigoRetencion,
            baseImponible, 
            porcentajeRetener, 
            valorRetenido, 
            @userId
        FROM OPENJSON(@json)
        WITH(
            uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
            impuestoRetencionId INT '$.impuestoRetencionId',
            codigoRetencion VARCHAR(5) '$.codigoRetencion',
            baseImponible NUMERIC(18,5) '$.baseImponible',
            porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener',
            valorRetenido NUMERIC(18,5) '$.valorRetenido'
        ) j
        WHERE NOT EXISTS (
            SELECT 1 
            FROM FactElect.RetencionAtsRet existing 
            WHERE existing.impuestoRetencionId = j.impuestoRetencionId 
            AND existing.codigoRetencion = j.codigoRetencion
            AND existing.idRetAtsDocSustento = @idRetAtsDocSustento
        );

        SET @recordCount = @@ROWCOUNT;

        IF @recordCount = 0
        BEGIN
            SET @code = '0';
            SET @message = 'No se insertaron registros - todos ya existen o verifique los datos';
            IF (@trancount = 1 AND @@TRANCOUNT > 0)
                ROLLBACK TRANSACTION;
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Update account payable with total retained amount
        UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
        SET importeTotal = (
            SELECT ISNULL(SUM(valorRetenido), 0) 
            FROM FactElect.RetencionAtsRet WITH (NOLOCK) 
            WHERE idRetencionAts = @idRetencionAts
        )
        WHERE idDocumento = @idRetencionAts
        AND codDoc = '07';

        -- Success response
        SET @code = '1'; 
        SET @message = CONCAT('Retenciones del documento registradas exitosamente! (', @recordCount, ' registros insertados)');

        IF (@trancount = 1)
        BEGIN
            COMMIT TRANSACTION;
            SELECT @code as code, @message as 'message';
        END

    END TRY
    BEGIN CATCH
        IF (@trancount = 1)
        BEGIN
            IF (@@TRANCOUNT > 0)
                ROLLBACK TRANSACTION;  

            -- Enhanced error logging
            INSERT INTO ErroresSistema(
                method, 
                errorNumber, 
                errorSeverity, 
                errorState, 
                errorProcedure, 
                errorLine, 
                errorMessage, 
                idUsuario,
                additionalInfo
            )
            VALUES (
                'DocSustentoRetencion/Insert', 
                ERROR_NUMBER(), 
                ERROR_SEVERITY(), 
                ERROR_STATE(), 
                ERROR_PROCEDURE(), 
                ERROR_LINE(), 
                ERROR_MESSAGE(), 
                @userId,
                CONCAT('userRoleId: ', @userRoleId, ', idRetAtsDocSustento: ', @idRetAtsDocSustento)
            );

            SELECT '0' as code, 'Error en el procedimiento. Verifique los logs del sistema.' as 'message';
        END
        ELSE
        BEGIN
            SET @errorCode = ERROR_NUMBER();
            SET @errorMessage = ERROR_MESSAGE();
        END
    END CATCH
END
GO