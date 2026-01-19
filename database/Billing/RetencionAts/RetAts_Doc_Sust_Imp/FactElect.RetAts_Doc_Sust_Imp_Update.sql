USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update tax sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Update @userRoleId INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT 
	,@idRetAtsDocSustento INT
	,@totalSinImpuestos NUMERIC(18,2) = 0
	,@totalImpuestos NUMERIC(18,2) = 0
	,@importeTotal NUMERIC (18,2) = 0

	BEGIN TRY
        
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN  

			UPDATE rid SET rid.idTarifaImpuesto = t.idTarifaImpuesto
			,rid.baseImponible = t.baseImponible
			,rid.valorImpuesto = t.valorImpuesto
			FROM FactElect.RetAtsImpDocSustento rid WITH (ROWLOCK)
			JOIN (SELECT @id idRetAtsImpDocSustento, idTarifaImpuesto,
			 baseImponible, valorImpuesto
			FROM OPENJSON(@json)
			WITH(
				idTarifaImpuesto INT '$.idTarifaImpuesto',
				baseImponible  NUMERIC(18,5) '$.baseImponible',
				valorImpuesto  NUMERIC(18,5) '$.valorImpuesto' 
			)) as t ON t.idRetAtsImpDocSustento = rid.idRetAtsImpDocSustento
			WHERE rid.idRetAtsImpDocSustento = @id
			
			--OBTENGO EL id del documento de sustento para actualizar totales
			SET @idRetAtsDocSustento = (SELECT idRetAtsDocSustento FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK)
																	WHERE idRetAtsImpDocSustento = @id)

			SELECT @totalSinImpuestos = SUM(baseImponible), @totalImpuestos = SUM(valorImpuesto) FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK)
																				WHERE idRetAtsDocSustento = @idRetAtsDocSustento
			
			SET @importeTotal = @totalSinImpuestos + @totalImpuestos
			
			UPDATE FactElect.RetAtsDocSustento SET totalSinImpuestos = @totalSinImpuestos
			,importeTotal = @importeTotal
			WHERE idRetAtsDocSustento = @idRetAtsDocSustento

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet ratr
            INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
            WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE ratr SET baseImponible = @totalSinImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalSinImpuestos

                    FROM FactElect.RetencionAtsRet ratr
                     INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
					WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet ratr
                 INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
            WHERE codigo = '2' AND idRetAtsDocSustento = @idRetAtsDocSustento)
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

			SELECT '1' code, 'Impuesto de sustento actualizado con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	    SELECT '0' code, 'Error en el procedimiento!' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES ('DocSustentoImpuesto/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO
