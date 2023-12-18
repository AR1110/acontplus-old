CREATE TABLE FactElect.Comprobante_Sri_Config
(
	idComprobante_Sri_Config INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,idSucursal INT FOREIGN KEY REFERENCES dbo.Sucursal(idSucursal) NOT NULL
   ,idSubContribuyente INT FOREIGN KEY REFERENCES dbo.SubContribuyente(idSubContribuyente) NULL
   ,idAnioFiscal INT FOREIGN KEY REFERENCES dbo.AnioFiscal(idAnioFiscal) NULL
   ,idActividad INT NULL
   ,estab VARCHAR(10) NOT NULL
   ,codContribuyente VARCHAR(20) NULL
   ,codActividad VARCHAR(20) NULL
   ,llevaContabilidad BIT DEFAULT 0
   ,nroContribuyente VARCHAR(50) NULL
   ,isAutomatic INT DEFAULT 0
   ,estado BIT DEFAULT 1 
)

--drop table FactElect.Comprobante_Sri_Config

--insert into FactElect.Comprobante_Sri_Config(idSucursal,estab)
--select idSucursal,serie from dbo.Sucursal
