USE [AcontPlus]
GO

SELECT * FROM dbo.notacredito

--ALTER TABLE dbo.NotaCredito ADD ambiente VARCHAR(5)
--							     ,codigoPorcentaje VARCHAR(5)	
--							     ,tarifa DECIMAL(15,5)

--UPDATE n SET	
--	n.ambiente = ta.codigo
--  ,codigoPorcentaje = '2'
--  ,tarifa = 12
--FROM dbo.NotaCredito n 
--INNER JOIN dbo.TipoAmbiente ta ON ta.idTipoAmbiente = n.idTipoAmbiente


--ALTER TABLE dbo.NotaCredito ALTER COLUMN ambiente VARCHAR(5) NOT NULL
--ALTER TABLE dbo.NotaCredito ALTER COLUMN codigoPorcentaje VARCHAR(5) NOT NULL
--ALTER TABLE dbo.NotaCredito ALTER COLUMN tarifa DECIMAL(15,5) NOT NULL

--ALTER TABLE dbo.NotaCredito ALTER COLUMN idTipoIva INT NULL
--ALTER TABLE dbo.NotaCredito ALTER COLUMN idTipoAmbiente INT NULL
--ALTER TABLE dbo.NotaCredito ALTER COLUMN idTipoContribuyente INT NULL