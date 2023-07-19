USE [AcontPlus]
GO
DROP PROCEDURE IF EXISTS [Reporte].[DataSource_Save]
GO
/****** Object:  StoredProcedure [Reporte].[DataSource_Save]    Script Date: 03/20/2023 5:44:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-03-20
-- Description:	ASP PARA UPDATE REPORTES DS
-- =============================================
IF OBJECT_ID(N'Config.ReporteDS_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.ReporteDS_Get
GO
CREATE PROCEDURE Config.ReporteDS_Get @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @params AS TABLE(
		idReporte INT
		,idReporteDataSource INT
	)

	INSERT INTO @params(idReporte, idReporteDataSource)
	SELECT idReporte, idReporteDataSource FROM OPENJSON(@json) WITH(idReporte INT '$.idReporte', idReporteDataSource INT '$.idReporteDataSource')
	IF EXISTS (SELECT 1 FROM @params WHERE idReporte > 0)
		BEGIN
			SELECT * FROM Config.ReporteDataSource WHERE idReporte = (SELECT TOP 1 idReporte FROM @params)
		END

END 
