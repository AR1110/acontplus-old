use [Acontplus]
go 

--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalIva]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalNetoIva]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalIvaCero]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalNetoIvaCero]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalNoObjetoIva]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalExentoIva]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalNetoExentoIva]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [totalIce]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [irbpnr]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [iva]
--ALTER TABLE dbo.OrdenCompra DROP COLUMN [subTotalNetoNoobjetoIva]

--select  * from dbo.OrdenCompra

--DETALLES

--EXEC sp_rename 'OrdenCompraDetalle.precioCosto', 'precioUnitario'
--EXEC sp_rename 'OrdenCompraDetalle.total', 'precioTotalSinImpuesto'

--ALTER TABLE dbo.OrdenCompraDetalle DROP COLUMN precioCostoNeto
--ALTER TABLE dbo.OrdenCompraDetalle ALTER COLUMN precioTotalSinImpuesto NUMERIC(18,5) NOT NULL

--ALTER TABLE dbo.OrdenCompraDetalle add codigoPorcentaje VARCHAR(10)
--ALTER TABLE dbo.OrdenCompraDetalle add tarifa NUMERIC(18,5)
--ALTER TABLE dbo.OrdenCompraDetalle add valorImpuesto NUMERIC(18,5)


--UPDATE dd SET
--     dd.codigoPorcentaje     = ti.codigoPorcentaje
--    ,dd.tarifa        = ti.porcentaje 
--    ,dd.valorImpuesto = (dd.precioTotalSinImpuesto * ti.porcentaje) / 100 
--FROM dbo.OrdenCompraDetalle dd
--INNER JOIN dbo.TipoIva ti ON ti.idTipoIva = dd.idTipoIva

--ALTER TABLE dbo.OrdenCompraDetalle alter column codigoPorcentaje VARCHAR(10) not null 
--ALTER TABLE dbo.OrdenCompraDetalle alter column tarifa NUMERIC(18,5) not null
--ALTER TABLE dbo.OrdenCompraDetalle alter column valorImpuesto NUMERIC(18,5) not null

select * from dbo.OrdenCompraDetalle