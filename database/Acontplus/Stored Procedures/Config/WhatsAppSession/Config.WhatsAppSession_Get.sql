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
IF OBJECT_ID(N'Config.WhatsAppSession_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsAppSession_Get
GO
CREATE PROCEDURE Config.WhatsAppSession_Get @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
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
	--print @json
	SELECT @browser = browser, @os = os FROM @tbl

	SET @browserName = (SELECT bname  + '_' + bversion FROM OPENJSON (@browser) WITH (bname VARCHAR(300) '$.name', bversion VARCHAR(300) '$.version'))
	SET @osName = (SELECT oname  + '_' + oversion FROM OPENJSON (@os) WITH (oname VARCHAR(300) '$.name', oversion VARCHAR(300) '$.version'))

	SELECT TOP 1 idSession id
	FROM Config.WhatsAppSession
	WHERE idUsuarioRol = @idUsuarioRol
	AND browser = @browserName
	AND os = @osName
	AND estado = 1 ORDER BY idSession DESC
END
