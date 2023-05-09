USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-05-08
-- Description:	 
-- =============================================
IF OBJECT_ID(N'Config.WhatsAppSession_Update', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsAppSession_Update
GO
CREATE PROCEDURE Config.WhatsAppSession_Update @idUsuarioRol INT
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	
	BEGIN TRY
		BEGIN TRAN
			UPDATE Config.WhatsAppSession SET estado = 0 WHERE idUsuarioRol = @idUsuarioRol AND id = @id
			SELECT '1' code, 'Exitos' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), '', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
