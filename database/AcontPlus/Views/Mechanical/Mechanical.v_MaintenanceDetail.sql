USE Acontplus 
GO
CREATE OR ALTER VIEW Mechanical.v_MaintenanceDetail WITH SCHEMABINDING AS (
    SELECT md.Id
        ,md.[Description]
        ,md.Quantity        
        ,md.Price
        ,md.Total
        ,md.Obs
        ,md.CodePercentage
        ,md.[Percentage]
        ,md.ArticuloId
        ,md.TarifaId
        ,md.BodegaId
        ,md.MedidaId
        ,md.MaintenanceId
        ,a.descripcion  AS Articulo
    FROM Mechanical.MaintenanceDetail   md WITH (NOLOCK)
    INNER JOIN Inventario.v_Articulo    a  WITH (NOLOCK) ON a.idArticulo = md.ArticuloId
)

