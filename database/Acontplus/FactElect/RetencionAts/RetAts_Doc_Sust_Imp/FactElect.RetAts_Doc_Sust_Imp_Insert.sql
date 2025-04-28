USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for insert tax sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Insert @userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT
	,@idRetencionAts INT 
	,@totalSinImpuestos NUMERIC(18,2) = 0
	,@totalImpuestos NUMERIC(18,2) = 0
	,@importeTotal NUMERIC (18,2) = 0
    ,@idRetAtsDocSustento INT;

    BEGIN TRY
                
        SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
        SET @idRetAtsDocSustento = (SELECT TOP 1 idRetAtsDocSustento FROM OPENJSON (@json) WITH(idRetAtsDocSustento INT))
	    SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idRetAtsDocSustento)

		BEGIN TRAN

			INSERT INTO FactElect.RetAtsImpDocSustento(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, idTarifaImpuesto
			, baseImponible, valorImpuesto, idUsuario)
			SELECT @idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, idTarifaImpuesto, baseImponible, valorImpuesto, @idUsuario
			FROM OPENJSON(@json)
			WITH( 
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
                idRetAtsDocSustento INT,
				idTarifaImpuesto INT '$.idTarifaImpuesto',
				baseImponible  NUMERIC(18,5) '$.baseImponible',
				valorImpuesto  NUMERIC(18,5) '$.valorImpuesto' 
			)

			SELECT @totalSinImpuestos = SUM(baseImponible), @totalImpuestos = SUM(valorImpuesto) FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK)
																				WHERE idRetAtsDocSustento = @idRetAtsDocSustento
			
			SET @importeTotal = @totalSinImpuestos + @totalImpuestos
			
			UPDATE FactElect.RetAtsDocSustento SET totalSinImpuestos = @totalSinImpuestos
			,importeTotal = @importeTotal
			WHERE idRetAtsDocSustento = @idRetAtsDocSustento

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE ratr SET baseImponible = @totalSinImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalSinImpuestos
                     FROM FactElect.RetencionAtsRet ratr
                     INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
					WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id WHERE codigo = '2' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE ratr SET baseImponible = @totalImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalImpuestos
                     FROM FactElect.RetencionAtsRet ratr
                     INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
					WHERE codigo = '2' AND idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsPago WHERE idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE FactElect.RetencionAtsPago SET total = @importeTotal
					WHERE  idRetAtsDocSustento = @idRetAtsDocSustento
				END

			SELECT '1' code, 'Impuesto de sustento guardado con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/POST', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
