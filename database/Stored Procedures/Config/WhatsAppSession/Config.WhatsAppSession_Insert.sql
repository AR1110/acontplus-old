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
IF OBJECT_ID(N'Config.WhatsAppSession_Insert', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsAppSession_Insert
GO
CREATE PROCEDURE Config.WhatsAppSession_Insert @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	,@idSession INT

	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	
		DECLARE @tbl AS TABLE (
	browser VARCHAR(MAX),
	os VARCHAR(MAX) 
	)
	declare @browser VARCHAR(300)
	declare @os VARCHAR(300)
	
	declare @browserName VARCHAR(300)
		declare @osName VARCHAR(300)


	INSERT INTO @tbl(browser, os)
	SELECT browser, os FROM  OPENJSON(@JSON) WITH (browser VARCHAR(MAX) '$.browser', os VARCHAR(MAX) '$.os')

	SELECT @browser = browser, @os = os FROM @tbl

	SET @browserName = (SELECT bname  + '_' + bversion FROM OPENJSON (@browser) WITH (bname VARCHAR(300) '$.name', bversion VARCHAR(300) '$.version'))
	SET @osName = (SELECT oname  + '_' + oversion FROM OPENJSON (@os) WITH (oname VARCHAR(300) '$.name', oversion VARCHAR(300) '$.version'))


	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Config.WhatsAppSession(idUsuarioRol, browser, os)
			VALUES(@idUsuarioRol, @browserName, @osName)
			SET @idSession = @@IDENTITY

			--UPDATE Config.WhatsAppSession SET estado = 0 WHERE idUsuarioRol = @idUsuarioRol AND idSession != @idSession

 			SELECT '1' code, 'Exitos' as 'message', (SELECT idSession id FROM Config.WhatsAppSession WHERE idSession = @idSession for json path) as payload
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
