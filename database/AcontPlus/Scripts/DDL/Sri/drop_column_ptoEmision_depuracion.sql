USE [AcontPlus]
GO

--ALTER TABLE dbo.PuntoEmision ALTER COLUMN idSucursal INT  NULL
--ALTER TABLE dbo.PuntoEmision DROP COLUMN fechaBaja 
--ALTER TABLE dbo.PuntoEmision DROP COLUMN foto 

--ALTER TABLE dbo.PuntoEmision DROP CONSTRAINT [FK__PuntoEmis__idSuc__1E3A7A34]
--ALTER TABLE dbo.PuntoEmision DROP CONSTRAINT [FK__PuntoEmis__idTip__4C9641C1]

--ALTER TABLE dbo.PuntoEmision DROP COLUMN idSucursal
--ALTER TABLE dbo.PuntoEmision DROP COLUMN idTipoAmbiente

SELECT * FROM dbo.PuntoEmision