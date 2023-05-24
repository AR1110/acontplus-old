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
IF OBJECT_ID(N'Config.WhatsAppMessage_Insert', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsAppMessage_Insert
GO
CREATE PROCEDURE Config.WhatsAppMessage_Insert @idUsuarioRol INT
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
	os VARCHAR(MAX),
	emisor VARCHAR(100),
	receptor VARCHAR(50),
	mensaje VARCHAR(100),
	totalMensajes INT,
	params VARCHAR(2000) NULL
	)
	declare @browser VARCHAR(300)
	declare @os VARCHAR(300)
	
	declare @browserName VARCHAR(300)
	declare @osName VARCHAR(300)


	INSERT INTO @tbl(browser, os, emisor, receptor, mensaje, totalMensajes, params)
	SELECT browser, os, emisor, receptor, mensaje, totalMensajes, params FROM  OPENJSON(@JSON) 
	WITH (browser VARCHAR(MAX) '$.browser'
		, os VARCHAR(MAX) '$.os'
				, emisor VARCHAR(100) '$.emisor'
		, receptor VARCHAR(50) '$.receptor'
		, mensaje VARCHAR(100) '$.mensaje'
		,totalMensajes INT '$.totalMensajes'
		,params VARCHAR(2000) '$.params'
		)

	SELECT @browser = browser, @os = os FROM @tbl

	SET @browserName = (SELECT bname  + '_' + bversion FROM OPENJSON (@browser) WITH (bname VARCHAR(300) '$.name', bversion VARCHAR(300) '$.version'))
	SET @osName = (SELECT oname  + '_' + oversion FROM OPENJSON (@os) WITH (oname VARCHAR(300) '$.name', oversion VARCHAR(300) '$.version'))


	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Config.WhatsappMessage(idUsuarioRol, browser, os, emisor, receptor, mensaje, totalMensajes, params)
			SELECT @idUsuarioRol, @browserName, @osName, emisor, receptor, mensaje,totalMensajes, params FROM @tbl
			
			UPDATE Config.WhatsappUsage SET used = used + (SELECT totalMensajes FROM @tbl) WHERE ruc = (SELECT ruc FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol AND ilimitado = 0)
			
			IF EXISTS(SELECT 1 FROM Config.WhatsappUsage  WHERE ruc = (SELECT ruc FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol) AND limite = used AND ilimitado = 0)
				BEGIN
					UPDATE Config.WhatsappUsage SET fechaFin = dbo.ufnGetDateEcuador(), estado = 0 WHERE ruc = (SELECT ruc FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol)
				END

			--UPDATE Config.WhatsAppSession SET estado = 0 WHERE idUsuarioRol = @idUsuarioRol AND idSession != @idSession

 			SELECT '1' code, 'El mensaje se envio correctamente' as 'message'--, (SELECT idSession id FROM Config.WhatsAppSession WHERE idSession = @idSession for json path) as payload
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
