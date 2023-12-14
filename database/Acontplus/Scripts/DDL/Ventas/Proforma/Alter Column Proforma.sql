use [Acontplus]
go 

--alter table proforma drop constraint [FK__Proforma__idTipo__6BA4D8C6]
--alter table proforma drop column idTipoIva 

--alter table proforma drop column [subTotalIva]
--alter table proforma drop column [subTotalNetoIva]
--alter table proforma drop column [subTotalIvaCero]
--alter table proforma drop column [subTotalNetoIvaCero]
--alter table proforma drop column [subTotalNoObjetoIva]
--alter table proforma drop column [subTotalNetoNoObjetoIva]
--alter table proforma drop column [subTotalExentoIva]
--alter table proforma drop column [subTotalNetoExentoIva]
--alter table proforma drop column [totalIce]
--alter table proforma drop column iva
--alter table proforma drop column irbpnr
--alter table proforma drop column tarifa

--alter table proforma alter column idCliente INT NOT NULL



--EXEC sp_RENAME 'ProformaDetalle.total' , 'precioTotalSinImpuesto', 'COLUMN'

--ALTER table ProformaDetalle DROP constraint [DF__ProformaD__estad__593122D0]
--ALTER TABLE ProformaDetalle ALTER COLUMN estado BIT NOT NULL
--ALTER TABLE ProformaDetalle ADD CONSTRAINT df_Estado DEFAULT  1 FOR estado


--alter table ProformaDetalle drop column idPresentacion
--alter table ProformaDetalle drop column precioConIva

--ALTER TABLE ProformaDetalle ADD codigoPorcentaje VARCHAR(5)
--ALTER TABLE ProformaDetalle ADD tarifa NUMERIC(18,5)
--ALTER TABLE ProformaDetalle ADD valorImpuesto NUMERIC(18,5)

--UPDATE ne set
--    ne.codigoPorcentaje = ti.codigoPorcentaje
--   ,ne.tarifa           = ti.porcentaje
--   ,ne.valorImpuesto    = (ne.precioTotalSinImpuesto * ti.porcentaje) / 100 
--FROM ProformaDetalle ne 
--inner join dbo.TipoIva ti on ti.idTipoIva = ne.idTipoIva

--ALTER TABLE ProformaDetalle ALTER COLUMN codigoPorcentaje VARCHAR(5) NOT NULL
--ALTER TABLE ProformaDetalle ALTER COLUMN tarifa NUMERIC(18,5) NOT NULL
--ALTER TABLE ProformaDetalle ALTER COLUMN valorImpuesto NUMERIC(18,5) NOT NULL

select  * from dbo.ProformaDetalle 


