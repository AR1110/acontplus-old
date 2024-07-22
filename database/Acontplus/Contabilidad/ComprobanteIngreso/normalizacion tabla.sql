USE [Acontplus]
go 

--ALTER TABLE dbo.ComprobanteIngreso ADD movimiento BIT

--UPDATE ComprobanteIngreso SET movimiento = 0 

--ALTER TABLE dbo.ComprobanteIngreso ALTER COLUMN movimiento BIT NOT NULL

--ALTER TABLE dbo.ComprobanteIngreso ADD DEFAULT 0 FOR movimiento

SELECT COUNT(*) FROM MovimientoCaja mc WHERE idComprobanteIngreso > 0

--UPDATE c set
--       c.movimiento = 1
--from ComprobanteIngreso c 
--inner join MovimientoCaja mc on mc.idComprobanteIngreso = c.idComprobanteIngreso

SELECT COUNT(*) FROM dbo.ComprobanteIngreso where movimiento = 1

select COUNT(*) from dbo.Anticipo
--UPDATE c set
--       c.movimiento = 1
--from ComprobanteIngreso c 
--inner join Anticipo a on a.idComprobanteIngreso = c.idComprobanteIngreso