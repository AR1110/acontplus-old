USE [AcontPlus]
GO 


--alter table factura drop constraint [FK__Factura__idTipoI__28E2F130]

--alter table factura drop constraint [FK__Factura__idAmbie__2ACB39A2]

--alter table factura drop constraint [FK__Factura__idTipoC__73D337CF]

--alter table factura drop column idTipoIva 
--alter table factura drop column idTipoAmbiente 
--alter table factura drop column idTipoContribuyente
--alter table factura drop column actividad
SELECT TOP 100  * FROM Dbo.Factura order by idFactura desc