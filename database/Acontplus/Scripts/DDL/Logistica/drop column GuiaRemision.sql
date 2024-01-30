use [Acontplus]
go 

--ALTER TABLE dbo.GuiaRemision DROP CONSTRAINT [FK__GuiaRemis__idTip__32375140]
--ALTER TABLE dbo.GuiaRemision DROP COLUMN idTipoAmbiente 

--ALTER TABLE dbo.GuiaRemision DROP CONSTRAINT [FK__GuiaRemis__idTip__77A3C8B3]
--ALTER TABLE dbo.GuiaRemision DROP COLUMN idTipoContribuyente 

--ALTER TABLE dbo.GuiaRemision DROP COLUMN actividad 
--ALTER TABLE dbo.GuiaRemision DROP COLUMN ambiente 

--select * from dbo.GuiaRemision

--> Detalles

select * from dbo.GuiaRemisionDetalle