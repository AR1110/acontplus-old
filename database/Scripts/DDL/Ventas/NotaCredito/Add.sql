use [Acontplus]
go 

--INSERT INTO Ventas.NotaCreditoImpuesto
--(
--        NotaCreditoId
--       ,TaxId
--       ,TaxPercentId
--       ,[Percent]
--       ,TaxBase
--       ,TaxValue
--       ,Discount
--)   

SELECT  nd.idNotaCredito
       ,ti.idImpuesto
       ,ti.idTipoIva
       ,porcentajeIva as [Percent] 
       ,total as TaxBase
       ,iva as TaxValue
       ,nd.valorDescuento as Discount
FROM NotaCreditoDetalle nd WITH (NOLOCK)
INNER JOIN TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva = nd.idTipoIva
order by idNotaCredito asc