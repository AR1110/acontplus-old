USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for insert additional info
-- =============================================
IF OBJECT_ID(N'FactElect.RetAts_InfoAdicional_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_InfoAdicional_Insert
GO
CREATE PROCEDURE FactElect.RetAts_InfoAdicional_Insert @idUsuarioRol INT  
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN 
			
			INSERT INTO FactElect.RetAtsInfoAdicional(idRetencionAts, nombre, valor)
			SELECT idRetencionAts, nombre, valor
			FROM OPENJSON(@json)
			WITH(
				idRetencionAts INT '$.idRetencionAts'
				,nombre VARCHAR(100) '$.nombre'
				,valor VARCHAR(300) '$.valor'
			)

			SELECT '1' code, 'Información adicional guardada con exito'  as 'message'
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
