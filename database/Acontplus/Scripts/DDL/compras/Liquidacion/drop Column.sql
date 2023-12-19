USE [AcontPlus]
GO 
--alter table LiquidacionCompra drop column [subTotalIva]
--alter table LiquidacionCompra drop column [subTotalNetoIva]
--alter table LiquidacionCompra drop column [subTotalIvaCero]
--alter table LiquidacionCompra drop column [subTotalNetoIvaCero]
--alter table LiquidacionCompra drop column [subTotalNoObjetoIva]
--alter table LiquidacionCompra drop column [subTotalNetoNoObjetoIva]
--alter table LiquidacionCompra drop column [subTotalExentoIva]
--alter table LiquidacionCompra drop column [subTotalNetoExentoIva]
--alter table LiquidacionCompra drop column [totalIce]
--alter table LiquidacionCompra drop column iva
--alter table LiquidacionCompra drop column irbpnr
--alter table LiquidacionCompra drop column codigoPorcentaje
--alter table LiquidacionCompra drop column tarifa

--> Liquidacion Detalle

--alter table LiquidacionCompraDetalle drop column precioCostoNeto

--EXEC sp_RENAME 'LiquidacionCompraDetalle.total' , 'precioTotalSinImpuesto', 'COLUMN'
--EXEC sp_RENAME 'LiquidacionCompraDetalle.precioCosto' , 'precioUnitario', 'COLUMN'

--ALTER TABLE LiquidacionCompraDetalle ADD codigoPorcentaje VARCHAR(5)
--ALTER TABLE LiquidacionCompraDetalle ADD tarifa NUMERIC(18,5)
--ALTER TABLE LiquidacionCompraDetalle ADD valorImpuesto NUMERIC(18,5)

--UPDATE ne set
--    ne.codigoPorcentaje = ti.codigoPorcentaje
--   ,ne.tarifa           = ti.porcentaje
--   ,ne.valorImpuesto    = (ne.precioTotalSinImpuesto * ti.porcentaje) / 100 
--FROM LiquidacionCompraDetalle ne 
--inner join dbo.TipoIva ti on ti.idTipoIva = ne.idTipoIva

--ALTER TABLE ProformaDetalle ALTER COLUMN codigoPorcentaje VARCHAR(5) NOT NULL
--ALTER TABLE ProformaDetalle ALTER COLUMN tarifa NUMERIC(18,5) NOT NULL
--ALTER TABLE ProformaDetalle ALTER COLUMN valorImpuesto NUMERIC(18,5) NOT NULL


select subTotalSinImpuestos,totalDescuento,total from LiquidacionCompra where idLiquidacionCompra = 1

select sum(precioTotalSinImpuesto) as subTotalSinImpuestos
      ,sum(valorImpuesto) as impuesto 
      ,sum(precioTotalSinImpuesto + valorImpuesto) as importeTotal
from dbo.LiquidacionCompraDetalle where idLiquidacionCompra = 1
