USE [Acontplus]
go 

INSERT INTO Ventas.AprobVentasImpuesto
(
        AprobDocumentId
       ,TaxId
       ,TaxPercentId
       ,[Percent]
       ,TaxBase
       ,TaxValue
       ,Discount
)   

SELECT ad.idAprob_Document
       ,ti.idImpuesto
       ,ti.idTipoIva
       ,tarifa as [Percent] 
       ,precioTotalSinImpuesto as TaxBase
       ,valorImpuesto as TaxValue
       ,nd.descuento as Discount
FROM Ventas.Aprob_Document_Detailt nd WITH (NOLOCK)
INNER JOIN Ventas.Aprob_Document ad on ad.uniqueId = nd.uniqueId
INNER JOIN TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva = nd.idTipoIva
order by idAprob_Document asc