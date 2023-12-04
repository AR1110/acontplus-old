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

--alter table FacturaDetalle drop column precioVentaNeto
--alter table FacturaDetalle drop column ganancia
--alter table FacturaDetalle drop column porcentajeIva


--SELECT top 10 * FROM Dbo.Factura order by idFactura desc

select top 10 * from dbo.FacturaDetalle 
