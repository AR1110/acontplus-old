USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update pagos del sustento
-- =============================================
IF OBJECT_ID(N'FactElect.RetAts_InfoAdicional_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_InfoAdicional_Update
GO
CREATE PROCEDURE FactElect.RetAts_InfoAdicional_Update @idUsuarioRol INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN 
			
			UPDATE rp SET rp.nombre = t.nombre
			,rp.valor = t.valor 
			FROM FactElect.RetAtsInfoAdicional rp WITH (ROWLOCK)
			JOIN (SELECT @id idRetAtsInfoAdicional, nombre, valor
			FROM OPENJSON(@json)
			WITH(
				nombre VARCHAR(300) '$.nombre'
				,valor  VARCHAR(300) '$.valor'
			)) as t ON t.idRetAtsInfoAdicional = rp.idRetAtsInfoAdicional
			WHERE rp.idRetAtsInfoAdicional = @id

			SELECT '1' code, 'Información adicional actualizada con exito'  as 'message'
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
