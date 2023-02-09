USE AcontPlus
IF OBJECT_ID(N'FactElect.RetencionAtsRet', N'U') IS NOT NULL
DROP TABLE FactElect.RetencionAtsRet 
GO
CREATE TABLE FactElect.RetencionAtsRet (
idRetencionAtsRet INT NOT NULL PRIMARY KEY IDENTITY (1,1)
,idRetencionAts INT NOT NULL FOREIGN KEY (idRetencionAts) REFERENCES FactElect.RetencionAts(idRetencionAts)
,idRetAtsDocSustento INT NULL FOREIGN KEY (idRetAtsDocSustento) REFERENCES FactElect.RetAtsDocSustento(idRetAtsDocSustento)
,uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
,codigo TINYINT NOT NULL
,codigoRetencion VARCHAR(5) NOT NULL
,baseImponible NUMERIC(18,5) NULL
,porcentajeRetener NUMERIC(18,5) NULL
,valorRetenido NUMERIC(18,5) NULL
,fechaPagoDiv DATE NULL
,imRentaSoc NUMERIC(18,5) NULL
,ejerFisUtDiv INT NULL
,numCajBan INT NULL
,precCajBan NUMERIC(18,5) NULL
)