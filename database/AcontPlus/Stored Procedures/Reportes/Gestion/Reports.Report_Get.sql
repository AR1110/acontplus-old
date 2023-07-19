


USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPReporteParametroGetByCode]    Script Date: 27/1/2023 15:19:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('Reporte.Report_Get') IS NOT NULL
BEGIN 
	DROP PROCEDURE Reporte.Report_Get
END 
GO
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 09-03-2023
-- Description:	SP PARA OBTENER LOS DATOS DEL ARCHIVO RDLC
-- =============================================
--Reporte.Report_Get '{"hasParams":true,"codigo":"FVRG","format":"pdf","aditionalParams":[]}'
CREATE PROCEDURE Reporte.Report_Get @json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50)
	,@fileName VARCHAR(200)
	--,@contentType NVARCHAR(25)
	,@codigo NVARCHAR(50)
	,@format VARCHAR(60)
	,@imagen VARBINARY(MAX)
	,@mimeType NVARCHAR(30) 
	,@aditionalParams NVARCHAR(MAX)
	,@idUsuarioRol INT
	,@hasParams BIT = 0

	SELECT @codEstab = codEstab, @idUsuarioRol = idUsuarioRol, @hasParams = hasParams FROM OPENJSON(@json) WITH (codEstab VARCHAR(50) '$.codEstab', idUsuarioRol INT '$.idUsuarioRol', hasParams BIT '$.hasParams')
	
	print @codestab
	IF(@codEstab IS NULL OR LEN(LTRIM(RTRIM(@codEstab))) = 0)
		BEGIN
		print 'yes'
			SET @codEstab = (selecT TOP 1 codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idUsuarioRol and predeterminado = 1) 
		END
			print @codestab

	SELECT @imagen = imagen, @mimeType = mimeType FROM Config.Estab_Logo WHERE codEstab = @codEstab AND estado = 1
	
	
	SELECT @codigo = codigo, @format = formato, @aditionalParams = aditionalParams FROM dbo.AFTGetReportParamsFromJson(@json)

	IF NOT EXISTS (SELECT 1 FROM Config.Reporte WHERE codigo = @codigo)
		BEGIN
			SELECT '0','No existen datos para este reporte',''
			RETURN
		END

	IF @format = 'pdf'
		BEGIN
			SET @fileName = (SELECT nombreReporte + '.pdf' FROM Config.Reporte WHERE codigo = @codigo)
			--SET @contentType = 'application/pdf';
		END
	IF @format = 'excel'
		BEGIN
			SET @format = 'EXCELOPENXML'
			SET @fileName = (SELECT nombreReporte + '.xlsx' FROM Config.Reporte WHERE codigo = @codigo)
			--SET @contentType = 'application/vnd.ms-excel';
		END
	IF @format = 'word'
		BEGIN
			SET @fileName = (SELECT nombreReporte + '.doc' FROM Config.Reporte WHERE codigo = @codigo)
			--SET @contentType = 'application/msword';
		END

	--REPORT DATA RDLC
	SELECT '1',''
	--,'AcontPlus/' + reportPath  reportPath
	,reportPath
	,ISNULL(@format, '') as 'format'
	,storedProcedure 
	,LTRIM(RTRIM(@fileName)) as 'fileName'
	,ISNULL(@hasParams, 0) hasParams
	FROM Config.Reporte r
	WHERE codigo = @codigo

	--DATASOURCES
	SELECT rd.position
	,rd.dataSource
	FROM Config.ReporteDataSource rd 
	INNER JOIN Config.Reporte r ON r.idReporte = rd.idReporte
	WHERE codigo = @codigo
	
	DECLARE @totalParams INT = 2 --DEFAULT PARAMS

	CREATE TABLE #Params(position INT, paramName NVARCHAR(100), isByte BIT, paramValue NVARCHAR(MAX), paramByte VARBINARY(MAX))
	INSERT INTO #Params(position, paramName, isByte, paramValue, paramByte)
	EXEC Reporte.Report_Params @aditionalParams

	IF (SELECT ISNULL(COUNT(1),0) FROM  #Params) > 0
		BEGIN
			SELECT @totalParams = @totalParams + ISNULL(COUNT(1),0) FROM #Params
		END
		 

	SELECT 0 position, 'logo' paramName, CAST(1 AS BIT) isByte, 'not' paramValue, ISNULL(@imagen, CAST(NEWID()AS VARBINARY(MAX))) paramByte,  @totalParams totalParams

	UNION ALL 

	SELECT 1 position, 'mimeType' paramName,CAST(0 AS BIT) isByte, ISNULL(@mimeType, 'image/png') paramValue,CAST(NEWID() AS VARBINARY(MAX))  paramByte, @totalParams totalParams
	
	UNION ALL 

	SELECT position, paramName,isByte, paramValue, paramByte, @totalParams totalParams FROM #Params

	DROP TABLE dbo.#Params
END



