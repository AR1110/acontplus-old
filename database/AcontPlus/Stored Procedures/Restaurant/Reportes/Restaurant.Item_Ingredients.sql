USE [AcontPlus]
GO
/****** Object:  StoredProcedure [ReporteIngresos].[CarteraCliente]    Script Date: 3/5/2023 11:08:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC Restaurant.Report_Item_Ingredients
@userRoleId INT
,@json      VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    DECLARE @idEntidad INT
                
    SELECT * FROM Restaurant.Recipe rr
    INNER JOIN Restaurant.Item ri ON ri.Id = rr.ItemId
    INNER JOIN Restaurant.Ingredient rin ON rin.Id = rr.IngredientId
    
END

