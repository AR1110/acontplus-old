USE AcontPlus
IF OBJECT_ID(N'FactElect.RetencionAts', N'U') IS NOT NULL
DROP TABLE FactElect.RetencionAts 
GO
CREATE TABLE FactElect.RetencionAts (
idRetencionAts INT NOT NULL PRIMARY KEY IDENTITY (1,1)
,ambiente TINYINT NOT NULL
,tipoEmision TINYINT NOT NULL
,codEstab VARCHAR(50) NOT NULL
,claveAcceso VARCHAR(49) NOT NULL
,codDoc VARCHAR(2) NOT NULL DEFAULT '07'
,estab VARCHAR(3) NOT NULL
,ptoEmi VARCHAR(3) NOT NULL
,secuencial VARCHAR(10) NOT NULL
,fechaEmision DATE NOT NULL
,contribuyentEspecial VARCHAR(13) NULL
,obligadoContabilidad VARCHAR(2) NULL
,tipoIdentificacionSujetoRetenido VARCHAR(2) NULL
,tipoSujetoRetenido VARCHAR(2) NULL
,parteRel VARCHAR(2) NOT NULL
,idCliente INT NULL
,razonSocialSujetoRetenido VARCHAR(300) NULL
,identificacionSujetoRetenido VARCHAR(13) NULL
,periodoFiscal VARCHAR(8) NULL
,anulada BIT NOT NULL DEFAULT 0
,anuladaSri BIT NOT NULL DEFAULT 0
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
)