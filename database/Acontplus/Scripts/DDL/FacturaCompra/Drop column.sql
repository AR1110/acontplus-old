USE [Acontplus]
GO 

--ALTER TABLE FacturaCompra DROP CONSTRAINT [FK__FacturaCo__idTie__4AF81212]
--ALTER TABLE FacturaCompra DROP COLUMN [idTiempoCredito]

--ALTER TABLE FacturaCompra DROP CONSTRAINT [DF__FacturaCo__abono__43A1D464]
--ALTER TABLE FacturaCompra DROP COLUMN [saldo]
--ALTER TABLE FacturaCompra DROP COLUMN [abono]

--ALTER TABLE FacturaCompra DROP COLUMN [idEstadoPago]
--ALTER TABLE FacturaCompra DROP COLUMN fechaVencimiento
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalIva]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalNetoIva]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalIvaCero]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalNetoIvaCero]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalNoObjetoIva]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalNetoNoobjetoIva]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalExentoIva]
--ALTER TABLE FacturaCompra DROP COLUMN [subTotalNetoExentoIva]
--ALTER TABLE FacturaCompra DROP COLUMN [totalIce]
--ALTER TABLE FacturaCompra DROP COLUMN [irbpnr]
--ALTER TABLE FacturaCompra DROP COLUMN [iva]


--EXEC sp_rename 'FacturaCompraDetalle.precioCosto', 'precioUnitario'
--EXEC sp_rename 'FacturaCompraDetalle.total', 'precioTotalSinImpuesto'
--EXEC sp_rename 'FacturaCompraDetalle.porcentajeIva', 'tarifa'
--EXEC sp_rename 'FacturaCompraDetalle.iva', 'valorImpuesto'

--> DETALLES 

--ALTER TABLE FacturaCompraDetalle DROP COLUMN [precioCostoNeto]
--ALTER TABLE FacturaCompraDetalle DROP COLUMN [codigoPrincipal]
--ALTER TABLE FacturaCompraDetalle DROP COLUMN [codigoAuxiliar]

--ALTER TABLE FacturaCompraDetalle ADD codigoPorcentaje VARCHAR(5)

--UPDATE f  set
--    f.precioTotalSinImpuesto = (f.cantidad * f.precioUnitario) - f.valorDescuento
--FROM facturaCompraDetalle f
--where f.precioTotalSinImpuesto is null


--UPDATE f  set
--    f.idTipoIva = (select idTipoIva from Articulo a where a.idArticulo =  f.idArticulo)
--FROM facturaCompraDetalle f
--where f.codigoPorcentaje is null


--UPDATE f  set
--    f.codigoPorcentaje = t.codigoPorcentaje
--   ,f.tarifa           = t.porcentaje
--   ,f.valorImpuesto    = (f.precioTotalSinImpuesto * t.porcentaje ) / 100
--FROM facturaCompraDetalle f
--inner join tipoiva t on t.idTipoIva = f.idTipoIva

--ALTER TABLE FacturaCompraDetalle ALTER COLUMN codigoPorcentaje VARCHAR(5) NOT NULL
--ALTER TABLE FacturaCompraDetalle ALTER COLUMN valorImpuesto NUMERIC(18,5) NOT NULL
--ALTER TABLE FacturaCompraDetalle ALTER COLUMN tarifa NUMERIC(18,5) NOT NULL
--ALTER TABLE FacturaCompraDetalle ALTER COLUMN [precioTotalSinImpuesto] NUMERIC(18,5) NOT NULL
--ALTER TABLE FacturaCompraDetalle ALTER COLUMN  [idTipoIva] INT NOT NULL
--ALTER TABLE FacturaCompraDetalle ALTER COLUMN [descripcion] VARCHAR(300) NOT NULL

--> Impuestos
--DROP TABLE  Compra.FacturaCompraImpuesto