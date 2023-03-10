


USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPReporteParametroGetByCode]    Script Date: 27/1/2023 15:19:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('Reports.Report_Get') IS NOT NULL
BEGIN 
	DROP PROCEDURE Reporte.Report_Get
END 
GO
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 09-03-2023
-- Description:	SP PARA OBTENER LOS DATOS DEL ARCHIVO RDLC
-- =============================================
--Reports.Report_Get '{"codigo":"RNE","format":"pdf","aditionalParams":[]}'
CREATE PROCEDURE Reporte.Report_Get @json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50)
	,@fileName NVARCHAR(100)
	--,@contentType NVARCHAR(25)
	,@codigo NVARCHAR(50)
	,@format NVARCHAR(60)
	,@imagen VARBINARY(MAX)
	,@mimeType NVARCHAR(30) 
	,@aditionalParams NVARCHAR(MAX)

	SELECT @codEstab = codEstab FROM OPENJSON(@json) WITH (codEstab VARCHAR(50) '$.codEstab')

	SELECT @imagen = imagen, @mimeType = mimeType FROM Config.Estab_Logo WHERE codEstab = @codEstab AND estado = 1

	SELECT @codigo = codigo, @format = formato, @aditionalParams = aditionalParams FROM dbo.AFTGetReportParamsFromJson(@json)

	IF NOT EXISTS (SELECT 1 FROM dbo.ReporteParametro WHERE codigo = @codigo)
		BEGIN
			SELECT '0','No existen datos para este reporte',''
			RETURN
		END

	IF @format = 'pdf'
		BEGIN
			SET @fileName = (SELECT nombreReporte + '.pdf' FROM dbo.ReporteParametro WHERE codigo = @codigo)
			--SET @contentType = 'application/pdf';
		END
	IF @format = 'excel'
		BEGIN
			SET @fileName = (SELECT nombreReporte + '.xls' FROM dbo.ReporteParametro WHERE codigo = @codigo)
			--SET @contentType = 'application/vnd.ms-excel';
		END
	IF @format = 'word'
		BEGIN
			SET @fileName = (SELECT nombreReporte + '.doc' FROM dbo.ReporteParametro WHERE codigo = @codigo)
			--SET @contentType = 'application/msword';
		END

	--REPORT DATA RDLC
	SELECT '1',''
	--,'AcontPlus/' + reportPath  reportPath
	,reportPath
	,ISNULL(@format, '') format
	,storedProcedure 
	,LTRIM(RTRIM(@fileName)) fileName
	FROM dbo.ReporteParametro r
	WHERE codigo = @codigo

	--DATASOURCES
	SELECT rd.position
	,rd.dataSource
	FROM dbo.ReporteDataSource rd 
	INNER JOIN dbo.ReporteParametro r ON r.idReporteParametro = rd.idReporteParametro
	WHERE codigo = @codigo
	
	DECLARE @totalParams INT = 2 --DEFAULT PARAMS

	CREATE TABLE #Params(position INT, paramName NVARCHAR(100), isByte BIT, paramValue NVARCHAR(MAX), paramByte VARBINARY(MAX))
	INSERT INTO #Params(position, paramName, isByte, paramValue, paramByte)
	EXEC ASPReportParamsGet @aditionalParams

	IF (SELECT ISNULL(COUNT(1),0) FROM dbo.#Params) > 0
		BEGIN
			SELECT @totalParams = @totalParams + ISNULL(COUNT(1),0) FROM dbo.#Params
		END
		 

	SELECT 0 position, 'logo' paramName, CAST(1 AS BIT) isByte, 'not' paramValue, ISNULL(@imagen, CAST(NEWID()AS VARBINARY(MAX))) paramByte,  @totalParams totalParams

	UNION ALL 

	SELECT 1 position, 'mimeType' paramName,CAST(0 AS BIT) isByte, @mimeType paramValue,CAST(NEWID() AS VARBINARY(MAX))  paramByte, @totalParams totalParams
	
	UNION ALL 

	SELECT position, paramName,isByte, paramValue, paramByte, @totalParams totalParams FROM dbo.#Params

	DROP TABLE dbo.#Params
END



