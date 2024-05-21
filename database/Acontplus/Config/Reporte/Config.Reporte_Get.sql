USE ACONTPLUS
GO

DROP PROCEDURE IF EXISTS ASPReporteGet
GO
DROP PROCEDURE IF EXISTS [Reporte].[R_Get]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-20
-- Description: SP FOR GET REPORTS CONFIG
-- =============================================
-- Config.Reporte_Get 25, '{\"codigo\":\"RCCL\",\"format\":\"pdf\",\"aditionalParams\":[]}'
IF OBJECT_ID(N'Config.Reporte_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.Reporte_Get 
GO
CREATE PROCEDURE Config.Reporte_Get @idUsuarioRol INT
,@json VARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT r.*
	,nextDs = CASE WHEN (SELECT COUNT(*) FROM Config.ReporteDataSource ds WHERE  ds.idReporte = r.idReporte) > 0 THEN
	(SELECT TOP 1 position + 1 FROM Config.ReporteDataSource ds WHERE  ds.idReporte = r.idReporte ORDER BY position DESC)
	ELSE 0
	END
	,dataSources = (SELECT * FROM Config.ReporteDataSource ds WHERE  ds.idReporte = r.idReporte  FOR JSON PATH)
	FROM Config.Reporte r WITH(NOLOCK)
	
END
GO
