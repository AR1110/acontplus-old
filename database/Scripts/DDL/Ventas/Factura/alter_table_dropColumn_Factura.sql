USE [AcontPlus]
GO 


--alter table factura drop constraint [FK__Factura__idTipoI__28E2F130]
--alter table factura drop constraint [FK__Factura__idAmbie__2ACB39A2]
--alter table factura drop constraint [FK__Factura__idTipoC__73D337CF]

-->
--alter table factura drop constraint [FK__Factura__idTiemp__475C8B58]
--alter table factura drop constraint [DF__Factura__abono__4B42F62C]
--alter table factura drop constraint [FK__Factura__idEstad__4C371A65]


--alter table factura drop column idTipoIva 
--alter table factura drop column idTipoAmbiente 
--alter table factura drop column idTipoContribuyente
--alter table factura drop column actividad

-->
--alter table factura drop column idTiempoCredito
--alter table factura drop column [fechaVencimiento]
--alter table factura drop column [subTotalIva]
--alter table factura drop column [subTotalNetoIva]
--alter table factura drop column [subTotalIvaCero]
--alter table factura drop column [subTotalNetoIvaCero]
--alter table factura drop column [subTotalNoObjetoIva]
--alter table factura drop column [subTotalNetoNoObjetoIva]
--alter table factura drop column [subTotalExentoIva]
--alter table factura drop column [subTotalNetoExentoIva]
--alter table factura drop column [totalIce]
--alter table factura drop column [saldo]
--alter table factura drop column [abono]
--alter table factura drop column [idEstadoPago]
--alter table factura drop column iva
--alter table factura drop column irbpnr
--alter table factura drop column porcentaje

--alter table FacturaDetalle drop column precioVentaNeto
--alter table FacturaDetalle drop column ganancia
--alter table FacturaDetalle drop column porcentajeIva
--alter table FacturaDetalle drop column precioConIva

--SELECT top 10 * FROM Dbo.Factura order by idFactura desc

--EXEC sp_RENAME 'FacturaDetalle.total' , 'precioTotalSinImpuesto', 'COLUMN'

--EXEC sp_RENAME 'FacturaDetalle.precioVenta' , 'precioUnitario', 'COLUMN'

--ALTER TABLE FacturaDetalle ALTER COLUMN valorImpuesto NUMERIC(18,5) NOT NULL

--ALTER TABLE FacturaDetalle ALTER COLUMN cantidad NUMERIC(18,5) NOT NULL

--ALTER TABLE FacturaDetalle ALTER COLUMN descripcion VARCHAR(300) NOT NULL

select top 10 * from dbo.FacturaDetalle 
