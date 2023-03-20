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
IF OBJECT_ID(N'Config.Reporte_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.Reporte_Get 
GO
CREATE PROCEDURE Config.Reporte_Get @idUsuarioRol INT
,@json VARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM Config.Reporte WITH(NOLOCK)
END
GO
