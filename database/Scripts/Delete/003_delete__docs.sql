use Acontplus
go
--select * from dbo.Entidad order by idEntidad desc

--select * from FactElect.v_DocElectronico where identidad = 294

--select top 10  *  from ConsolidacionInventario where identidad = 294

--delete from ConsolidacionInventarioDetalle where idConsolidacionInventario = 43377


--delete f


--delete fd
--from dbo.FormaPagoFactura fd with(rowlock)
--inner join dbo.Factura f On fd.idFactura = f.idFactura
--inner join dbo.documentoelectronico de on f.idDocumentoelectronico = de.idDocumentoelectronico
--where de.idDocumentoElectronico in (
--535674,
--535702,
--535739
--)

--delete fd
--from Ventas.FacturaImpuesto fd with(rowlock)
--inner join dbo.Factura f On fd.FacturaId = f.idFactura
--inner join dbo.documentoelectronico de on f.idDocumentoelectronico = de.idDocumentoelectronico
--where de.idDocumentoElectronico in (
--535674,
--535702,
--535739
--)

--delete fd
--from dbo.FacturaDetalle fd with(rowlock)
--inner join dbo.Factura f On fd.idFactura = f.idFactura
--inner join dbo.documentoelectronico de on f.idDocumentoelectronico = de.idDocumentoelectronico
--where de.idDocumentoElectronico in (
--535674,
--535702,
--535739
--)

--delete f
--from dbo.Factura f with(rowlock)
--inner join dbo.documentoelectronico de on f.idDocumentoelectronico = de.idDocumentoelectronico
--where de.idDocumentoElectronico in (
--535674,
--535702,
--535739
--)


--delete from dbo.documentoelectronico where idDocumentoElectronico in (
--535674,
--535702,
--535739
--)


--delete from Ventas.ProformaDocumento where ProformaId = 19220
--go
--delete from Ventas.ProformaImpuesto where ProformaId = 19220
--go
--delete from dbo.ProformaDetalle where idProforma = 19220
--go
--delete from dbo.Proforma where idEntidad = 294
--go
--select * from Ventas.ProformaImpuesto where ProformaId

--select top 1 * from Ventas.ProformaDocumento where ProformaId = 19220
--delete from Inventario.TransaccionDetalle where idTransaccion = 595367
--GO
--delete from Inventario.Transaccion where idTransaccion = 595367
--GO
--delete from ConsolidacionInventarioDetalle where idConsolidacionInventario = 43377
--GO
--delete from ConsolidacionInventario where idConsolidacionInventario = 43377
--go
select top 10 * from Inventario.v_Articulo_Transaccion where idDocumento = 43377 and codTransaccion = 'A'