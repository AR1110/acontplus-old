USE [Acontplus]
go 

DECLARE @table as table (idCobro INT UNIQUE NOT NULL, infoCobro VARCHAR(MAX) NULL)

--ALTER TABLE Cobro add infoCobro VARCHAR(MAX) NULL


INSERT INTO @table (idCobro,infoCobro)
select cp.idCobro, infoCobro = (SELECT cs.nro,cs.lote,cs.aprobacion,cs.referencia from Cobro cs where cs.idCobro = cp.idCobro FOR JSON PATH) from Cobro cp 


UPDATE c set
	c.infoCobro = t.infoCobro
from Cobro c
inner join @table t ON t.idCobro = c.idCobro



--ALTER TABLE Cobro drop column nro
--ALTER TABLE Cobro drop column lote
--ALTER TABLE Cobro drop column aprobacion
--ALTER TABLE Cobro drop column referencia

select * from Cobro