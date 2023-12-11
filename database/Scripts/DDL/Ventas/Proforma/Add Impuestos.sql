use [Acontplus]
go 

INSERT INTO Ventas.ProformaImpuesto
(
        ProformaId
       ,TaxId
       ,TaxPercentId
       ,[Percent]
       ,TaxBase
       ,TaxValue
       ,Discount
)   

SELECT  nd.idProforma
       ,ti.idImpuesto
       ,ti.idTipoIva
       ,tarifa as [Percent] 
       ,precioTotalSinImpuesto as TaxBase
       ,valorImpuesto as TaxValue
       ,nd.valorDescuento as Discount
FROM ProformaDetalle nd WITH (NOLOCK)
INNER JOIN TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva = nd.idTipoIva
order by idProforma asc