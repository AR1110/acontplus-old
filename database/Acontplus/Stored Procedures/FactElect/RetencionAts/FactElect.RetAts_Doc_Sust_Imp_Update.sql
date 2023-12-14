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
IF OBJECT_ID(N'FactElect.RetAts_Doc_Sust_Imp_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Update
GO
CREATE PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Update @idUsuarioRol INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	,@idRetAtsDocSustento INT
	,@totalSinImpuestos NUMERIC(18,2) = 0
	,@totalImpuestos NUMERIC(18,2) = 0
	,@importeTotal NUMERIC (18,2) = 0


	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN  

			UPDATE rid SET rid.codImpuestoDocSustento = t.codImpuestoDocSustento
			,rid.codigoPorcentaje = t.codigoPorcentaje
			,rid.baseImponible = t.baseImponible
			,rid.tarifa = t.tarifa
			,rid.valorImpuesto = t.valorImpuesto
			FROM FactElect.RetAtsImpDocSustento rid WITH (ROWLOCK)
			JOIN (SELECT @id idRetAtsImpDocSustento, codImpuestoDocSustento,
			 codigoPorcentaje, baseImponible, tarifa, valorImpuesto
			FROM OPENJSON(@json)
			WITH(
				codImpuestoDocSustento VARCHAR(1) '$.codImpuestoDocSustento',
				codigoPorcentaje VARCHAR(4) '$.codigoPorcentaje',
				baseImponible  NUMERIC(18,5) '$.baseImponible',
				tarifa NUMERIC(18,5) '$.tarifa',
				valorImpuesto  NUMERIC(18,5) '$.valorImpuesto' 
			)) as t ON t.idRetAtsImpDocSustento = rid.idRetAtsImpDocSustento
			WHERE rid.idRetAtsImpDocSustento = @id
			
			--OBTENGO EL id del documento de sustento para actualizar totales
			SET @idRetAtsDocSustento = (SELECT idRetAtsDocSustento FROM FactElect.RetAtsImpDocSustento  
																	WHERE idRetAtsImpDocSustento = @id)

			SELECT @totalSinImpuestos = SUM(baseImponible), @totalImpuestos = SUM(valorImpuesto) FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK)
																				WHERE idRetAtsDocSustento = @idRetAtsDocSustento
			
			SET @importeTotal = @totalSinImpuestos + @totalImpuestos
			
			UPDATE FactElect.RetAtsDocSustento SET totalSinImpuestos = @totalSinImpuestos
			,importeTotal = @importeTotal
			WHERE idRetAtsDocSustento = @idRetAtsDocSustento

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE FactElect.RetencionAtsRet SET baseImponible = @totalSinImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalSinImpuestos
					WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet WHERE codigo = '2' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE FactElect.RetencionAtsRet SET baseImponible = @totalImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalImpuestos
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
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/PUT', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
