USE [Acontplus]
GO

--ALTER TABLE LiquidacionCompraDetalle ADD ice NUMERIC(18,5)
--UPDATE LiquidacionCompraDetalle SET ice = 0
--ALTER TABLE LiquidacionCompraDetalle ALTER COLUMN ice NUMERIC(18,5) NOT NULL
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalIva]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalNetoIva]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalIvaCero]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalNetoIvaCero]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalNoObjetoIva]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalNetoNoobjetoIva]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalExentoIva]
--ALTER TABLE LiquidacionCompra DROP COLUMN [subTotalNetoExentoIva]
--ALTER TABLE LiquidacionCompra DROP COLUMN [totalIce]
--ALTER TABLE LiquidacionCompra DROP COLUMN [irbpnr]
--ALTER TABLE LiquidacionCompra DROP COLUMN [iva]
--ALTER TABLE LiquidacionCompra DROP COLUMN ambiente
--ALTER TABLE LiquidacionCompra DROP COLUMN codigoPorcentaje
--ALTER TABLE LiquidacionCompra DROP COLUMN tarifa

--> Detalles
--EXEC sp_rename 'LiquidacionCompraDetalle.precioCosto', 'precioUnitario'
--EXEC sp_rename 'LiquidacionCompraDetalle.total', 'precioTotalSinImpuesto'


--ALTER TABLE LiquidacionCompraDetalle DROP COLUMN [precioCostoNeto]

--ALTER TABLE LiquidacionCompraDetalle ADD codigoPorcentaje VARCHAR(5)
--ALTER TABLE LiquidacionCompraDetalle ADD tarifa NUMERIC(18,5)
--ALTER TABLE LiquidacionCompraDetalle ADD valorImpuesto NUMERIC(18,5)

--UPDATE f  set
--    f.codigoPorcentaje = t.codigoPorcentaje
--   ,f.tarifa           = t.porcentaje
--   ,f.valorImpuesto    = (f.precioTotalSinImpuesto * t.porcentaje ) / 100
--FROM LiquidacionCompraDetalle f
--inner join tipoiva t on t.idTipoIva = f.idTipoIva


--ALTER TABLE LiquidacionCompraDetalle ALTER COLUMN codigoPorcentaje VARCHAR(5) NOT NULL
--ALTER TABLE LiquidacionCompraDetalle ALTER COLUMN valorImpuesto NUMERIC(18,5) NOT NULL
--ALTER TABLE LiquidacionCompraDetalle ALTER COLUMN tarifa NUMERIC(18,5) NOT NULL

SELECT * FROM LiquidacionCompra