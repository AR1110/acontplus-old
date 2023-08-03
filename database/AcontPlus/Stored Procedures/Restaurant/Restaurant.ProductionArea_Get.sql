USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Tables_Get]    Script Date: 3/8/2023 13:35:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--AUTOR: IVAN PAZ
--DATE: 2023-07-17
--DESCRIPTION: SP FOR GET TABLES
-- Restaurant.Tables_Get 0
-- Restaurant.ProductionArea_Get '{}', ''
CREATE OR ALTER PROCEDURE [Restaurant].[ProductionArea_Get]
@json NVARCHAR(MAX)
,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SET @tableNames = 'productionArea'
	SELECT * FROM Restaurant.ProductionArea WHERE Deleted IS NULL
END

