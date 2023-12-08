USE [AcontPlus]
GO 


--alter table NotaEntrega drop constraint [FK__NotaEntre__idTip__46735417]
--alter table NotaEntrega drop column idTipoIva 

--alter table NotaEntrega drop constraint [FK__NotaEntre__idTie__1C3D2329]
--alter table NotaEntrega drop column idTiempoCredito

--alter table NotaEntrega drop constraint [FK__NotaEntre__idEst__4E1F62D7]
--alter table NotaEntrega drop column idEstadoPago

--alter table NotaEntrega drop [DF__NotaEntre__abono__4D2B3E9E]
--alter table NotaEntrega drop column [abono]

-->
--alter table NotaEntrega drop column [fechaVencimiento]
--alter table NotaEntrega drop column [saldo]
--alter table NotaEntrega drop column [subTotalIva]
--alter table NotaEntrega drop column [subTotalNetoIva]
--alter table NotaEntrega drop column [subTotalIvaCero]
--alter table NotaEntrega drop column [subTotalNetoIvaCero]
--alter table NotaEntrega drop column [subTotalNoObjetoIva]
--alter table NotaEntrega drop column [subTotalNetoNoObjetoIva]
--alter table NotaEntrega drop column [subTotalExentoIva]
--alter table NotaEntrega drop column [subTotalNetoExentoIva]
--alter table NotaEntrega drop column [totalIce]
--alter table NotaEntrega drop column [iva]
--alter table NotaEntrega drop column [tarifa]
--alter table NotaEntrega drop column [irbpnr]

--EXEC sp_RENAME 'NotaEntregaDetalle.iva' , 'valorImpuesto', 'COLUMN'
--EXEC sp_RENAME 'NotaEntregaDetalle.total' , 'precioTotalSinImpuesto', 'COLUMN'
--EXEC sp_RENAME 'NotaEntregaDetalle.precioVenta' , 'precioUnitario', 'COLUMN'


--alter table NotaEntregaDetalle drop column precioVentaNeto
--alter table NotaEntregaDetalle drop column ganancia
--alter table NotaEntregaDetalle drop column porcentajeIva
--alter table NotaEntregaDetalle drop column idPresentacion
--alter table NotaEntregaDetalle drop column precioConIva
--alter table NotaEntregaDetalle drop column idPresentacion

select top 1 * from dbo.NotaEntregaDetalle where valorDescuento > 0
