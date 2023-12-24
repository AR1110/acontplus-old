use [Acontplus]
go 


INSERT INTO Compra.LiquidacionImpuesto(LiquidacionId,TaxId,TaxPercentId,[Percent],TaxBase,Discount,TaxValue)

SELECT ld.idLiquidacionCompra as idLiquidacion
      ,ti.idImpuesto	      as TaxId
	  ,ld.idTipoIva           as TaxPerentId
	  ,ld.tarifa			  as [Percent]
	  ,ld.precioTotalSinImpuesto as TaxBase
	  ,ld.valorDescuento
	  ,ld.valorImpuesto
FROM LiquidacionCompraDetalle ld WITH (NOLOCK)
INNER JOIN TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = ld.idTipoIva