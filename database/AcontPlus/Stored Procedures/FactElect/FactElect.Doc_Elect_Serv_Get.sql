USE [AcontPlus] 
GO
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'FactElect.Doc_Elect_Serv_Get', N'P') IS NOT NULL
	DROP PROCEDURE FactElect.Doc_Elect_Serv_Get
GO

CREATE PROCEDURE FactElect.Doc_Elect_Serv_Get @codEstado INT
	,@cantDocs INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @sql NVARCHAR(MAX)
	DECLARE @params NVARCHAR(MAX) = '@codEstado INT
									,@cantDocs INT'

	IF @codEstado = 1
	BEGIN
		SET @sql = 'SELECT TOP (@cantDocs) idDocumentoElectronico,codDoc,''certificate'' = fe.nombreArchivo,''password'' = fe.contrasenia
						FROM dbo.DocumentoElectronico dc WITH (NOLOCK) 
						INNER JOIN dbo.FirmaElectronica fe WITH (NOLOCK) ON fe.idEntidad = dc.idEntidad 
						WHERE dc.codEstado = @codEstado'
	END

	IF @codEstado = 2
	BEGIN
		SET @sql = 'SELECT TOP (@cantDocs) idDocumentoElectronico,xmlAcontPlus,claveAcceso, convert(varchar,dc.ambiente) ambiente, codEstado
						FROM dbo.DocumentoElectronico dc WITH (NOLOCK) 
 						WHERE dc.codEstado IN (@codEstado, 7) AND dc.xmlAcontPlus IS NOT NULL AND isAutomatic = 1 '
	END

	IF @codEstado = 3
	BEGIN
		SET @sql = 'SELECT TOP (@cantDocs) idDocumentoElectronico,claveAcceso, convert(varchar,dc.ambiente) ambiente
						FROM dbo.DocumentoElectronico dc WITH (NOLOCK) 
 						WHERE dc.codEstado = @codEstado AND isAutomatic = 1 '
	END

	EXEC SP_EXECUTESQL @sql
		,@params
		,@codEstado = @codEstado
		,@cantDocs = @cantDocs
END
GO


