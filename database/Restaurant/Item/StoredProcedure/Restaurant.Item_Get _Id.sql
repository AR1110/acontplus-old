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
-- Restaurant.Item_Get 139, '{"idSubFamilia":0,"pageIndex":1,"pageSize":100,"tipo":1}', ''
-- Restaurant.Item_Get 139, '{"tipo":2}', ''
-- Restaurant.Item_Get 139, '{"tipo":4, "pageIndex":1,"pageSize":10 }', ''
-- Restaurant.Item_Get 139, '{"tipo":3,"checkSubFamilia":false,"idSubFamilia":0,"pageIndex":1,"pageSize":25,"checkBySearch":true,"code":"COM"}', ''

CREATE OR ALTER PROCEDURE Restaurant.Item_Get_Id @userRoleId INT ,@id INT ,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    SET @tableNames = 'item,recipes'

    SELECT it.Id
          ,it.Summary
          ,it.Recipe
          ,it.Instructions
    FROM Restaurant.Item it WITH (NOLOCK)
    WHERE it.Id =  @id

    SELECT re.Id
          ,re.Quantity
	      ,re.Unit
	      ,re.Instructions
	      ,re.[Weight]
	      ,re.[NetWeight]
	      ,ISNULL(re.ExtentId, 0) ExtentId 
	      ,ig.Summary
	      ,ISNULL
           ((
              SELECT af.idMedida
                    ,IIF(af.gestionVenta = 1,1,3) as orden
                    ,af.conversion
                    ,af.precioCostoFraccionado
                    ,ar.precioCosto
			        ,me.descripcion               as descripcion
			        ,(
                        SELECT pv.idTarifa
                                ,pv.precioVenta
                                ,pv.precioConIva
                                ,UPPER(ta.descripcion) as tarifa
                                ,ta.ventaPorMayor
					    FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
					    INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
					    WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
					    ORDER BY ta.predeterminada DESC 
                        FOR JSON PATH

                    ) as tarifas
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
            INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
			WHERE af.idArticulo = ia.idArticulo 
            FOR JSON PATH
                
         ),'[]') as fraccionado

        ,ISNULL
         ((
                SELECT sc.idMedida
                      ,2              as orden
                      ,1              as conversion
			          ,sc.precioCosto as precioCostoFraccionado
                      ,sc.precioCosto
                      ,me.descripcion
			          ,(
                            SELECT ap.idTarifa
                                  ,ap.precioVenta
                                  ,ap.precioConIva
                                  ,UPPER(ta.descripcion) as tarifa
                                  ,ta.ventaPorMayor 
					        FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
					        INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
					        WHERE ap.idArticulo = sc.idArticulo
					        ORDER BY ta.predeterminada DESC 
                            FOR JSON PATH

                       ) as tarifas
			    FROM dbo.Articulo     sc WITH (NOLOCK)
			    INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			    WHERE sc.idArticulo = ia.idArticulo 
                FOR JSON PATH

        ),'[]') as principal
    FROM Restaurant.Recipe             re 
    INNER JOIN Restaurant.Ingredient   ig ON ig.Id         = re.IngredientId
    INNER JOIN dbo.Articulo            ia ON ia.idArticulo = ig.ProductId
    
    WHERE re.IsActive = 1
      AND re.ItemId = @id

END
GO
