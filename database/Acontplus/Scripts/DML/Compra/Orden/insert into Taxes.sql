use [Acontplus]
go 


INSERT INTO Compra.OrdenImpuesto(OrdenId,TaxId,TaxPercentId,[Percent],TaxBase,Discount,TaxValue)

SELECT ld.idOrdenCompra 
      ,ti.idImpuesto	      as TaxId
	  ,ld.idTipoIva           as TaxPerentId
	  ,ld.tarifa			  as [Percent]
	  ,ld.precioTotalSinImpuesto as TaxBase
	  ,ld.valorDescuento
	  ,ld.valorImpuesto
FROM dbo.OrdenCompraDetalle ld WITH (NOLOCK)
INNER JOIN TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = ld.idTipoIva
