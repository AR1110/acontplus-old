USE AcontPlus
GO
CREATE OR ALTER VIEW TechnicalSupport.v_OrderMantenaince
WITH SCHEMABINDING AS (
SELECT i.Id         AS id
,i.BodegaId         AS bodegaId
,i.FeeId            AS feeId
,i.MedidaId         AS medidaId
,i.OrderDetailId    AS orderDetailId
,i.TaxId            AS taxId
,i.TaxPercentId     AS taxPercentId
,i.Quantity         AS quantity
,i.Cost             AS cost
,i.TaxValue         AS taxValue
,i.Price            AS price
,i.Discount         AS discount
,i.Total            AS total
,i.Obs              AS obs
,a.idArticulo       
,a.descripcion productName
FROM TechnicalSupport.OrderMaintenance i WITH (NOLOCK)
INNER JOIN dbo.Articulo a WITH (NOLOCK) ON i.ProductId = a.idArticulo
)
