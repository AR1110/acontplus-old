use [Acontplus]
go 



--alter table NotaCredito drop constraint [FK__NotaCredi__idTip__61274A53]
--alter table NotaCredito drop column idTipoIva 

--alter table NotaCredito drop constraint [FK__NotaCredi__idTip__74C75C08]
--alter table NotaCredito drop column idTipoContribuyente

--alter table NotaCredito drop constraint [FK__NotaCredi__idTip__621B6E8C]
--alter table NotaCredito drop column idTipoAmbiente 

--alter table NotaCredito drop column actividad

--alter table NotaCredito drop column [subTotalIva]
--alter table NotaCredito drop column [subTotalNetoIva]
--alter table NotaCredito drop column [subTotalIvaCero]
--alter table NotaCredito drop column [subTotalNetoIvaCero]
--alter table NotaCredito drop column [subTotalNoObjetoIva]
--alter table NotaCredito drop column [subTotalNetoNoObjetoIva]
--alter table NotaCredito drop column [subTotalExentoIva]
--alter table NotaCredito drop column [subTotalNetoExentoIva]
--alter table NotaCredito drop column [totalIce]

--alter table NotaCreditoDetalle add valorImpuesto NUMERIC(18,5)

--UPDATE NotaCreditoDetalle SET valorImpuesto = iva

--alter table NotaCreditoDetalle drop column precioVentaNeto
--alter table NotaCreditoDetalle drop column ganancia
--alter table NotaCreditoDetalle drop column porcentajeIva
--alter table NotaCreditoDetalle drop column iva
--alter table NotaCreditoDetalle drop column idPresentacion


--> Detalles 


--SELECT top 10 * FROM Dbo.Factura order by idFactura desc

select  * from dbo.NotaCreditoDetalle 
