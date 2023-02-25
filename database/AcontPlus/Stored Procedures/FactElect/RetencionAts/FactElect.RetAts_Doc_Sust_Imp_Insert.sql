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
IF OBJECT_ID(N'FactElect.RetAts_Doc_Sust_Imp_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Insert
GO
CREATE PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Insert @idUsuarioRol INT  
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN 
			
			INSERT INTO FactElect.RetAtsImpDocSustento(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, codImpuestoDocSustento
			, codigoPorcentaje, baseImponible, tarifa, valorImpuesto)
			SELECT idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, codImpuestoDocSustento, codigoPorcentaje, baseImponible, tarifa, valorImpuesto
			FROM OPENJSON(@json)
			WITH(
				idRetencionAts INT '$.idRetencionAts',
				idRetAtsDocSustento INT '$.idRetAtsDocSustento',
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				codImpuestoDocSustento TINYINT '$.codImpuestoDocSustento',
				codigoPorcentaje VARCHAR(4) '$.codigoPorcentaje',
				baseImponible  NUMERIC(18,5) '$.baseImponible',
				tarifa NUMERIC(18,5) '$.tarifa',
				valorImpuesto  NUMERIC(18,5) '$.valorImpuesto' 
			)

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
