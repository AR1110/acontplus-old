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

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Pago_Insert @userRoleId INT  
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT
	,@idRetencionAts INT
	,@totalOld NUMERIC (18,2)
    ,@idRetAtsDocSustento INT;


	BEGIN TRY

            SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)

            SET @idRetAtsDocSustento = (SELECT TOP 1 idRetAtsDocSustento FROM OPENJSON(@json) WITH (idRetAtsDocSustento INT))

			SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idRetAtsDocSustento)

			IF EXISTS(SELECT 1 FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts)
				BEGIN
					SET @totalOld = (SELECT SUM(importeTotal) FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts)
				END

		BEGIN TRAN

			INSERT INTO FactElect.RetencionAtsPago(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, formaPagoId, total)
			SELECT @idRetencionAts, @idRetAtsDocSustento, uniqueIdDoc, formaPagoId, total
			FROM OPENJSON(@json)
			WITH	( 
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				formaPagoId INT '$.formaPagoId', 
				total  NUMERIC(18,5) '$.total'
			)

			SELECT '1' code, 'Forma de pago guardada con exito'  as 'message'
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
