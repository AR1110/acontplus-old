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

--EXEC sp_RENAME 'NotaEntregaDetalle.iva' , 'valorImpuesto', 'COLUMN'
--alter table NotaEntregaDetalle drop column precioVentaNeto
--alter table NotaEntregaDetalle drop column ganancia
--alter table NotaEntregaDetalle drop column porcentajeIva
--alter table NotaEntregaDetalle drop column idPresentacion

select * from dbo.NotaEntregaDetalle 
