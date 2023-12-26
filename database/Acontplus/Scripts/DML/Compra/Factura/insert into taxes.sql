use [Acontplus]
go 

INSERT INTO [Compra].[FacturaImpuesto]
(
	[FacturaCompraId]
   ,[TaxId]
   ,[TaxPercentId]
   ,[TaxBase]
   ,[Percent]
   ,[TaxValue]
   ,[Discount]
)

select fd.idFacturaCompra
      ,ti.idImpuesto
      ,fd.idTipoIva
	  ,fd.precioTotalSinImpuesto
	  ,tarifa
	  ,valorImpuesto
	  ,valorDescuento
from FacturaCompraDetalle fd
inner join dbo.TipoIva ti on ti.idTipoIva = fd.idTipoIva 