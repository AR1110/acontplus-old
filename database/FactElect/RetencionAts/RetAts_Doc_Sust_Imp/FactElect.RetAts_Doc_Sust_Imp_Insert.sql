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
-- Description: sp for insert tax sustentos - Enhanced with better error handling and validation
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Insert 
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
            @totalSinImpuestos NUMERIC(18,2) = 0,
            @totalImpuestos NUMERIC(18,2) = 0,
            @importeTotal NUMERIC(18,2) = 0,
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
            FROM OPENJSON (@json) 
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

        -- Validate JSON structure and tax rates
        IF NOT EXISTS (
            SELECT 1 
            FROM OPENJSON(@json)
            WITH( 
                uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
                idTarifaImpuesto INT '$.idTarifaImpuesto',
                baseImponible NUMERIC(18,5) '$.baseImponible',
                valorImpuesto NUMERIC(18,5) '$.valorImpuesto' 
            ) j
            INNER JOIN Sri.TarifaImpuesto t ON j.idTarifaImpuesto = t.idTarifaImpuesto
        )
        BEGIN
            SET @code = '0';
            SET @message = 'JSON inválido o tarifas de impuesto no encontradas';
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Start transaction
        IF (@@TRANCOUNT = 0)
        BEGIN
            BEGIN TRANSACTION;
            SET @trancount = 1;
        END

        -- Check for existing records with same idTarifaImpuesto
        IF EXISTS (
            SELECT 1 
            FROM OPENJSON(@json)
            WITH( 
                idTarifaImpuesto INT '$.idTarifaImpuesto'
            ) j
            INNER JOIN FactElect.RetAtsImpDocSustento existing 
                ON existing.idTarifaImpuesto = j.idTarifaImpuesto 
                AND existing.idRetAtsDocSustento = @idRetAtsDocSustento
        )
        BEGIN
            DECLARE @existingTarifas NVARCHAR(MAX);
            
            SELECT @existingTarifas = STRING_AGG(CAST(j.idTarifaImpuesto AS NVARCHAR), ', ')
            FROM OPENJSON(@json)
            WITH( 
                idTarifaImpuesto INT '$.idTarifaImpuesto'
            ) j
            INNER JOIN FactElect.RetAtsImpDocSustento existing 
                ON existing.idTarifaImpuesto = j.idTarifaImpuesto 
                AND existing.idRetAtsDocSustento = @idRetAtsDocSustento;

            SET @code = '0';
            SET @message = CONCAT('Ya existen registros con las siguientes tarifas de impuesto: ', @existingTarifas);
            
            IF (@trancount = 1 AND @@TRANCOUNT > 0)
                ROLLBACK TRANSACTION;
            SELECT @code as code, @message as 'message';
            RETURN;
        END

        -- Insert tax details with validation (only new records)
        INSERT INTO FactElect.RetAtsImpDocSustento(
            idRetencionAts, 
            idRetAtsDocSustento, 
            uniqueIdDoc, 
            idTarifaImpuesto,
            baseImponible, 
            valorImpuesto, 
            idUsuario
        )
        SELECT 
            @idRetencionAts, 
            @idRetAtsDocSustento, 
            uniqueIdDoc, 
            j.idTarifaImpuesto, 
            baseImponible, 
            valorImpuesto, 
            @userId
        FROM OPENJSON(@json)
        WITH( 
            uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
            idTarifaImpuesto INT '$.idTarifaImpuesto',
            baseImponible NUMERIC(18,5) '$.baseImponible',
            valorImpuesto NUMERIC(18,5) '$.valorImpuesto' 
        ) j
        WHERE NOT EXISTS (
            SELECT 1 
            FROM FactElect.RetAtsImpDocSustento existing 
            WHERE existing.idTarifaImpuesto = j.idTarifaImpuesto 
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

        -- Calculate totals with better precision handling
        SELECT 
            @totalSinImpuestos = ISNULL(SUM(baseImponible), 0), 
            @totalImpuestos = ISNULL(SUM(valorImpuesto), 0) 
        FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK)
        WHERE idRetAtsDocSustento = @idRetAtsDocSustento;
        
        SET @importeTotal = @totalSinImpuestos + @totalImpuestos;
        
        -- Update document totals
        UPDATE FactElect.RetAtsDocSustento 
        SET totalSinImpuestos = @totalSinImpuestos,
            importeTotal = @importeTotal
        WHERE idRetAtsDocSustento = @idRetAtsDocSustento;

        -- Update retention for tax code '1' (Income tax)
        IF EXISTS (
            SELECT 1 
            FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id 
            WHERE i.codigo = '1' AND ratr.idRetAtsDocSustento = @idRetAtsDocSustento
        )
        BEGIN
            UPDATE ratr 
            SET baseImponible = @totalSinImpuestos,
                valorRetenido = ROUND((ratr.porcentajeRetener / 100.0) * @totalSinImpuestos, 2)
            FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
            WHERE i.codigo = '1' AND ratr.idRetAtsDocSustento = @idRetAtsDocSustento;
        END

        -- Update retention for tax code '2' (VAT)
        IF EXISTS (
            SELECT 1 
            FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id 
            WHERE i.codigo = '2' AND ratr.idRetAtsDocSustento = @idRetAtsDocSustento
        )
        BEGIN
            UPDATE ratr 
            SET baseImponible = @totalImpuestos,
                valorRetenido = ROUND((ratr.porcentajeRetener / 100.0) * @totalImpuestos, 2)
            FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
            WHERE i.codigo = '2' AND ratr.idRetAtsDocSustento = @idRetAtsDocSustento;
        END

        -- Update payment total
        IF EXISTS (
            SELECT 1 
            FROM FactElect.RetencionAtsPago 
            WHERE idRetAtsDocSustento = @idRetAtsDocSustento
        )
        BEGIN
            UPDATE FactElect.RetencionAtsPago 
            SET total = @importeTotal
            WHERE idRetAtsDocSustento = @idRetAtsDocSustento;
        END

        -- Success response
        SET @code = '1'; 
        SET @message = CONCAT('Impuestos del documento registrados exitosamente! (', @recordCount, ' registros insertados)');

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
                'DocSustentoImpuesto/Insert', 
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