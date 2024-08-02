USE [Acontplus]
go 

--ALTER TABLE dbo.ComprobanteEgreso ADD movimiento BIT

--UPDATE ComprobanteEgreso SET movimiento = 0 

--ALTER TABLE dbo.ComprobanteEgreso ALTER COLUMN movimiento BIT NOT NULL

--ALTER TABLE dbo.ComprobanteEgreso ADD DEFAULT 0 FOR movimiento

SELECT COUNT(*) FROM MovimientoCaja mc WHERE idComprobanteEgreso > 0

--UPDATE c set
--       c.movimiento = 1
--from ComprobanteEgreso c 
--inner join MovimientoCaja mc on mc.idComprobanteEgreso = c.idComprobanteEgreso

SELECT COUNT(*) FROM dbo.ComprobanteEgreso where movimiento = 1

