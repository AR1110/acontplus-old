USE [Acontplus]
GO
--- Config.WhatsAppMessage_Insert_v2 28, '{"bname": "","bversion": "androidInfo.version.release","oname":"","oversion": "androidInfo.version.release","emisor": "","receptor": "phone","mensaje": "message","totalMensajes": 34,"params": "paramSend"}'
CREATE OR ALTER PROCEDURE [Config].[WhatsAppMessage_Insert_v2] 
@idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	,@idSession INT

	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	
	DECLARE @tbl AS TABLE (
	bname VARCHAR(100),
	bversion NVARCHAR(100),
	oname VARCHAR(100),
	oversion VARCHAR(100),
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


	INSERT INTO @tbl(bname, bversion, oname, oversion, emisor, receptor, mensaje, totalMensajes, params)
	SELECT bname, bversion, oname, oversion, emisor, receptor, mensaje, totalMensajes, params 
	FROM  OPENJSON(@JSON) 
	WITH (bname VARCHAR(100) '$.bname'
			,bversion VARCHAR(100) '$.bversion'
			,oname VARCHAR(100) '$.oname'
			,oversion VARCHAR(100) '$.oversion'			
			,emisor VARCHAR(100) '$.emisor'
			,receptor VARCHAR(50) '$.receptor'
			,mensaje VARCHAR(100) '$.mensaje'
			,totalMensajes INT '$.totalMensajes'
			,params VARCHAR(500) '$.params'		
		)		
	
	SET @browserName = (SELECT bname  + '_' + bversion FROM @tbl)
	SET @osName = (SELECT oname  + '_' + oversion FROM @tbl)


	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Config.WhatsappMessage(idUsuarioRol, browser, os, emisor, receptor, mensaje, totalMensajes, params)
			SELECT @idUsuarioRol, @browserName, @osName, emisor, receptor, mensaje,totalMensajes, NULL FROM @tbl
			
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
