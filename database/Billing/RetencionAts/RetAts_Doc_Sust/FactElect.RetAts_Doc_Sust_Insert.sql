USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for insert sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Insert @userRoleId INT  
,@json VARCHAR(MAX)
,@errorCode INT = 0 OUT
,@errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	DECLARE @userId INT,
        @id INT;

    BEGIN TRY
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        BEGIN TRAN
            IF NOT EXISTS (
                SELECT 1
                FROM OPENJSON(@json)
                WITH (idRetencionAts INT)
                WHERE idRetencionAts > 0
            )
            BEGIN
                SET @errorCode = 1;
                SET @errorMessage = 'Primero debe guardar la retención';
                ROLLBACK TRAN;
                SELECT '0' AS code, @errorMessage AS message;
                RETURN;
            END

            -- Resto del código de inserción y llamadas a SPs...

            
            INSERT INTO FactElect.RetAtsDocSustento (
                idRetencionAts, uniqueIdDoc, documentoSustentoTributarioId,
                numDocSustento, fechaEmisionDocSustento, fechaRegistroContable,
                numAutDocSustento, pagoLocExt, tipoRegimenFiscalExteriorId, paisEfecPago,
                aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis,
                totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso,
                totalSinImpuestos, importeTotal, idUsuario
            )
            SELECT
                idRetencionAts,
                uniqueIdDoc,
                documentoSustentoTributarioId,
                REPLACE(numDocSustento, '-', ''),
                fechaEmisionDocSustento,
                fechaRegistroContable,
                numAutDocSustento,
                NULLIF(pagoLocExt, ''),
                tipoRegimenFiscalExteriorId,
                NULLIF(paisEfecPago, ''),
                NULLIF(aplicConvDobTrib, ''),
                NULLIF(pagExtSujRetNorLeg, ''),
                NULLIF(pagoRegFis, ''),
                totalComprobantesReembolso,
                totalBaseImponibleReembolso,
                totalImpuestoReembolso,
                totalSinImpuestos,
                importeTotal,
                @userId
            FROM OPENJSON(@json)
            WITH (
                idRetencionAts INT,
                uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
                documentoSustentoTributarioId INT '$.documentoSustentoTributarioId',
                numDocSustento VARCHAR(17) '$.numDocSustento',
                fechaEmisionDocSustento DATETIME2 '$.fechaEmisionDocSustento',
                fechaRegistroContable DATETIME2 '$.fechaRegistroContable',
                numAutDocSustento VARCHAR(49) '$.numAutDocSustento',
                pagoLocExt VARCHAR(2) '$.pagoLocExt',
                tipoRegimenFiscalExteriorId INT '$.tipoRegi',
                paisEfecPago VARCHAR(3) '$.paisEfecPago',
                aplicConvDobTrib VARCHAR(2) '$.aplicConvDobTrib',
                pagExtSujRetNorLeg VARCHAR(2) '$.pagExtSujRetNorLeg',
                pagoRegFis VARCHAR(2) '$.pagoRegFis',
                totalComprobantesReembolso NUMERIC(18,5) '$.totalComprobantesReembolso',
                totalBaseImponibleReembolso NUMERIC(18,5) '$.totalBaseImponibleReembolso',
                totalImpuestoReembolso NUMERIC(18,5) '$.totalImpuestoReembolso',
                totalSinImpuestos NUMERIC(18,5) '$.totalSinImpuestos',
                importeTotal NUMERIC(18,5) '$.importeTotal'
            ) 
            WHERE idRetencionAts > 0;

            SET @id = (SELECT SCOPE_IDENTITY());

            DECLARE @taxes NVARCHAR(MAX),
                @retenciones NVARCHAR(MAX),
                @payments NVARCHAR(MAX);

            SELECT @taxes = taxes, 
                @retenciones = retenciones, 
                @payments = payments 
            FROM OPENJSON(@json) WITH (
                                        taxes NVARCHAR(MAX) AS JSON,
                                        retenciones NVARCHAR(MAX) AS JSON,
                                        payments NVARCHAR(MAX) AS JSON
                                       )

            SET @taxes = (
                SELECT '[' + STRING_AGG(
                    JSON_MODIFY(value, '$.idRetAtsDocSustento', @id), ','
                ) + ']'
                FROM OPENJSON(@taxes)
            )

            SET @retenciones = (
                SELECT '[' + STRING_AGG(
                    JSON_MODIFY(value, '$.idRetAtsDocSustento', @id), ','
                ) + ']'
                FROM OPENJSON(@retenciones)
            )

            SET @payments = (
                SELECT '[' + STRING_AGG(
                    JSON_MODIFY(value, '$.idRetAtsDocSustento', @id), ','
                ) + ']'
                FROM OPENJSON(@payments)
            )
            
           EXEC FactElect.RetAts_Doc_Sust_Imp_Insert @userRoleId, @taxes, @errorCode = @errorCode OUT, @errorMessage = @errorMessage OUT
            
           IF (@errorCode <> 0)
                BEGIN
                    SET @errorMessage = 'sp Acontplus.FactElect.RetAts_Doc_Sust_Imp_Insert failed: ' + ISNULL(@errorMessage, '')
				    RAISERROR(@errorMessage,16,1)
                END
           
           EXEC FactElect.RetAts_Doc_Sust_Ret_Insert @userRoleId, @retenciones, @errorCode = @errorCode OUT, @errorMessage = @errorMessage OUT
            
           IF (@errorCode <> 0)
                BEGIN
                    SET @errorMessage = 'sp Acontplus.FactElect.RetAts_Doc_Sust_Ret_Insert failed: ' + ISNULL(@errorMessage, '')
				    RAISERROR(@errorMessage,16,1)
                END

           EXEC FactElect.RetAts_Doc_Sust_Pago_Insert @userRoleId, @payments, @errorCode = @errorCode OUT, @errorMessage = @errorMessage OUT
            
           IF (@errorCode <> 0)
                BEGIN
                    SET @errorMessage = 'sp Acontplus.FactElect.RetAts_Doc_Sust_Pago_Insert failed: ' + ISNULL(@errorMessage, '')
				    RAISERROR(@errorMessage,16,1)
                END

		COMMIT TRAN
        SELECT '1' code, 'Documento de sustento guardado con exito'  as 'message', payload = (SELECT @id idRetAtsDocSustento FOR JSON PATH);
	END TRY
	BEGIN CATCH
	    SELECT '0' code, 'Error en el procedimiento!' as 'message';

		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN;

		INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario,
        additionalInfo)
		VALUES ('RetAtsDocumentoSustento/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId, 
        N'{"userRoleId": ' + CAST(@userRoleId AS NVARCHAR) + N',"params": ' + CAST(@json AS NVARCHAR(MAX)) + N'}'
        )
	END CATCH
END
GO
