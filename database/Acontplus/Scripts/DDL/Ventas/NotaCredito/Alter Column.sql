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
--alter table NotaCredito drop column iva
--alter table NotaCredito drop column irbpnr
--alter table NotaCredito drop column codigoPorcentaje
--alter table NotaCredito drop column tarifa


--EXEC sp_RENAME 'NotaCreditoDetalle.porcentajeIva' , 'tarifa', 'COLUMN'
--EXEC sp_RENAME 'NotaCreditoDetalle.total' , 'precioTotalSinImpuesto', 'COLUMN'

--alter table NotaCreditoDetalle drop column precioVentaNeto
--alter table NotaCreditoDetalle drop column ganancia
--alter table NotaCreditoDetalle drop column idPresentacion
--alter table NotaCreditoDetalle drop column precioConIva
--alter table NotaCreditoDetalle drop column recargo
--alter table NotaCreditoDetalle drop column transporte

--alter table NotaCreditoDetalle ADD valorImpuesto NUMERIC(18,5)
--update nc set 
--    nc.valorImpuesto = nc.iva
--from NotaCreditoDetalle nc 
--alter table NotaCreditoDetalle ALTER COLUMN valorImpuesto NUMERIC(18,5) NOT NULL
--alter table NotaCreditoDetalle drop column iva

--alter table NotaCreditoDetalle add codigoPorcentaje VARCHAR(5)
--UPDATE ne set
--    ne.codigoPorcentaje = ti.codigoPorcentaje
--FROM NotaCreditoDetalle ne 
--inner join dbo.TipoIva ti on ti.idTipoIva = ne.idTipoIva
--alter table NotaCreditoDetalle alter column codigoPorcentaje VARCHAR(5) not null


--> Detalles 


select  * from dbo.NotaCreditoDetalle 


