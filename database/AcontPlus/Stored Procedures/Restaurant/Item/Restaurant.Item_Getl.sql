USE AcontPlus
GO
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14 
-- Description:	Get Item
-- =============================================
IF OBJECT_ID(N'Restaurant.Item_Get', N'P') IS NOT NULL
	DROP PROCEDURE Restaurant.Item_Get
GO
CREATE PROCEDURE Restaurant.Item_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @pageIndex INT
	DECLARE @pageSize INT	

	SET @tableNames = 'items'
	SELECT ri.*
			,a.descripcion
			,pa.Description
	FROM Restaurant.Item ri
	INNER JOIN Articulo a ON a.idArticulo = ri.ProductId
	LEFT JOIN Restaurant.ProductionArea pa ON pa.Id = ri.ProductionAreaId
	
END
GO