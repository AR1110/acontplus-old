USE AcontPlus
IF OBJECT_ID(N'FactElect.RetAtsImpDocSustento', N'U') IS NOT NULL
DROP TABLE FactElect.RetAtsImpDocSustento 
GO
CREATE TABLE FactElect.RetAtsImpDocSustento (
idRetAtsImpDocSustento INT NOT NULL PRIMARY KEY IDENTITY (1,1)
,idRetencionAts INT NOT NULL FOREIGN KEY (idRetencionAts) REFERENCES FactElect.RetencionAts(idRetencionAts)
,idRetAtsDocSustento INT NULL FOREIGN KEY (idRetAtsDocSustento) REFERENCES FactElect.RetAtsDocSustento(idRetAtsDocSustento)
,uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
,codImpuestoDocSustento VARCHAR(1) NOT NULL
,codigoPorcentaje VARCHAR(4) NOT NULL
,baseImponible NUMERIC(18,5) NULL
,tarifa NUMERIC(18,5) NULL
,valorImpuesto NUMERIC(18,5) NULL
)