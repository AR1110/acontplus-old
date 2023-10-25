USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- Restaurant.Promotion_Get 139, '', ''
-- =============================================
-- Restaurant.Promotion_Menu_Get_By_Id 139, 6, '{"id":6,"tipo":2}', ''
CREATE OR ALTER PROCEDURE Restaurant.Promotion_Menu_Get_By_Id
@userRoleId     INT
,@id            INT
,@json          VARCHAR(MAX)
,@tableNames    VARCHAR(MAX) OUTPUT
AS
BEGIN
SET NOCOUNT ON;
DECLARE @tipo INT 
    
SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT '$.tipo')

IF @tipo = 1
    BEGIN
        SET @tableNames = 'promotionMenus'
	    SELECT pm.Id
                ,pm.PromotionId
                ,pm.MenuId
                ,m.Title
                ,iv.s3ObjectUrl
	    FROM Restaurant.PromotionMenu pm WITH (NOLOCK)
        INNER JOIN Restaurant.Menu m ON m.Id = pm.MenuId
        INNER JOIN Inventario.v_Articulo iv ON iv.idArticulo = m.ProductId
        WHERE pm.PromotionId = @id
        AND ISNULL(pm.Deleted, 0) != 1
    END

IF @tipo = 2
    BEGIN
        SET @tableNames = 'promotionMenus'
        SELECT
             m.*
            ,s3ObjectUrl		    = a.s3ObjectUrl
			,stockMinimo		= a.stockMinimo
			,stock				= a.stock
			,codigo				= a.codigo
			,codigoAuxiliar		= a.codigoAuxiliar
			,tipoIva			= CAST(CAST(a.porcentaje AS DECIMAL(15,0)) AS VARCHAR)+'%'
			,tipoArticulo		= ISNULL(a.tipoArticulo,'Ninguna')
			,style				= a.colorRow
            ,summary            = m.Summary
            ,pvp				= (SELECT idArticuloPvP = ap.idArticuloPvP
										    ,idTarifa = ap.idTarifa
										    ,precioVenta = ap.precioVenta
										    ,precioConIva = ap.precioConIva
										    ,porcentajeUtilidad = ap.porcentajeUtilidad
										    ,precioPredeterminado = ta.predeterminada
										    ,tarifa = ta.descripcion
										    ,porcentajeIva = ti.porcentaje
								    FROM ArticuloPvP ap
								    INNER JOIN Tarifa ta ON ta.idTarifa = ap.idTarifa								
								    LEFT JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
								    WHERE ap.idArticulo = a.idArticulo AND ta.predeterminada = 1
								    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            ,descripcion         = a.descripcion
            ,itemTypeCode        = 'MENU'
            ,totalRecords        = COUNT(*) OVER()
        FROM Restaurant.PromotionMenu rpm
        INNER JOIN Restaurant.Menu m WITH(NOLOCK) ON m.Id = rpm.MenuId
        INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo        
        WHERE rpm.PromotionId = @Id
        AND ISNULL(rpm.Deleted, 0) != 1
    END
END
GO  