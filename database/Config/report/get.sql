USE Acontplus
GO
/****** Object:  StoredProcedure [Config].[Reporte_Get]    Script Date: 27/5/2024 16:08:42 ******/
 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [Config].[Report_Get] @userId INT,@json VARCHAR(500), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SET @tableNames = 'reports'

	SELECT r.*
	,nextDs = CASE WHEN (SELECT COUNT(*) FROM Config.ReporteDataSource ds WHERE  ds.idReporte = r.idReporte) > 0 THEN
	(SELECT TOP 1 position + 1 FROM Config.ReporteDataSource ds WHERE  ds.idReporte = r.idReporte ORDER BY position DESC)
	ELSE 0
	END
	,dataSources = (SELECT * FROM Config.ReporteDataSource ds WHERE  ds.idReporte = r.idReporte  FOR JSON PATH)
	FROM Config.Reporte r WITH(NOLOCK) ORDER BY r.idReporte DESC
	
END
