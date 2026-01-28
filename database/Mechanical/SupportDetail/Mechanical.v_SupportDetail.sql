USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_SupportDetail WITH SCHEMABINDING AS(
   SELECT sd.Id
        ,sd.[Description]
        ,sd.Quantity        
        ,sd.Price
        ,sd.TaxValue
        ,sd.Total
        ,sd.Obs
        ,sd.ArticuloId
        ,sd.TarifaId
        ,sd.BodegaId
        ,sd.MedidaId
        ,sd.SupportId
        ,a.descripcion  AS Articulo
        ,a.codigo
        ,m.descripcion  AS Medida
        ,sd.[Enabled]
        ,sd.Deleted
    FROM Mechanical.SupportDetail       sd WITH (NOLOCK)
    INNER JOIN dbo.Articulo             a  WITH (NOLOCK) ON a.idArticulo = sd.ArticuloId
    INNER JOIN dbo.Medida               m  WITH (NOLOCK) ON m.idMedida   = sd.MedidaId
)



