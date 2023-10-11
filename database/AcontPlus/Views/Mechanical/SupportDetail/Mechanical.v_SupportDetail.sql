USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_SupportDetail WITH SCHEMABINDING AS(
   SELECT sd.Id
        ,sd.[Description]
        ,sd.Quantity        
        ,sd.Price
        ,sd.Total
        ,sd.Obs
        ,sd.CodePercentage
        ,sd.[Percentage]
        ,sd.ArticuloId
        ,sd.TarifaId
        ,sd.BodegaId
        ,sd.MedidaId
        ,sd.SupportId
        ,a.descripcion  AS Articulo
        ,a.codigo
        ,m.descripcion  AS Medida
    FROM Mechanical.SupportDetail       sd WITH (NOLOCK)
    INNER JOIN Inventario.v_Articulo    a  WITH (NOLOCK) ON a.idArticulo = sd.ArticuloId
    INNER JOIN dbo.Medida               m  WITH (NOLOCK) ON m.idMedida   = sd.MedidaId
)



