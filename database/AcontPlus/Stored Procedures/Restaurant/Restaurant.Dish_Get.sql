-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 15:41 3/8/2023 
-- Description:	Get dish. 
-- =============================================
-- Restaurant.Dish_Get 0,'{}', ''
CREATE OR ALTER PROC Restaurant.Dish_Get
@userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	 
	SET @tableNames = 'dishes'
	SELECT rd.*
		, va.idArticulo
		, va.descripcion
		, rp.Id
		, rp.Description  AS 'ProductionArea'
	FROM Restaurant.[Dish] rd
	INNER JOIN dbo.v_Articulo va ON va.idArticulo = rd.ProductId
	INNER JOIN Restaurant.[ProductionArea] rp ON rp.Id = rd.ProductionAreaId
END
GO