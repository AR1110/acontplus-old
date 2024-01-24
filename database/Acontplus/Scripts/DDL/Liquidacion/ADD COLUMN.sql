USE [Acontplus]
GO

--ALTER TABLE LiquidacionCompraDetalle ADD ice NUMERIC(18,5)
--ALTER TABLE LiquidacionCompraDetalle ALTER COLUMN ice NUMERIC(18,5) NOT NULL

--UPDATE LiquidacionCompraDetalle SET ice = 0

--ALTER TABLE LiquidacionCompra DROP CONSTRAINT [FK__Liquidaci__idTie__1FD8A9E3]
--ALTER TABLE LiquidacionCompra DROP COLUMN idTiempoCredito

--ALTER TABLE LiquidacionCompra DROP CONSTRAINT [FK__Liquidaci__idEst__3A8CA01F]
--ALTER TABLE LiquidacionCompra DROP COLUMN idEstadoPago

--ALTER TABLE LiquidacionCompra DROP CONSTRAINT[FK__Liquidaci__idTip__75BB8041]
--ALTER TABLE LiquidacionCompra DROP COLUMN idTipoContribuyente


--ALTER TABLE LiquidacionCompra DROP COLUMN fechaBaja
--ALTER TABLE LiquidacionCompra DROP COLUMN idTipoIva
--ALTER TABLE LiquidacionCompra DROP COLUMN idTipoAmbiente
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
--ALTER TABLE LiquidacionCompra DROP COLUMN fechaVencimiento
--ALTER TABLE LiquidacionCompra DROP COLUMN saldo
--ALTER TABLE LiquidacionCompra DROP CONSTRAINT[DF__Liquidaci__abono__4F138710] 
--ALTER TABLE LiquidacionCompra DROP COLUMN abono
--ALTER TABLE LiquidacionCompra DROP COLUMN actividad



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

SELECT * FROM LiquidacionCompradetalle