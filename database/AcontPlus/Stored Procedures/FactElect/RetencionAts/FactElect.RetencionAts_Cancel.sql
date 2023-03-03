USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-02
-- Description: sp for cancel in sri retencion ats
-- =============================================
IF OBJECT_ID(N'FactElect.RetencionAts_Cancel', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetencionAts_Cancel 
GO
CREATE PROCEDURE FactElect.RetencionAts_Cancel @idUsuarioRol INT
,@id INT 
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idUsuario INT

	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	BEGIN TRY
		BEGIN TRAN 
			UPDATE FactElect.RetencionAts SET anuladaSri = 1 WHERE idRetencionAts = @id
			SELECT '1' code, 'Retencion anulada en el SRI con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/CANCEL', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
