USE AcontPlus
IF OBJECT_ID(N'FactElect.RetencionAtsPago', N'U') IS NOT NULL
DROP TABLE FactElect.RetencionAtsPago 
GO
CREATE TABLE FactElect.RetencionAtsPago (
idRetencionAtsPago INT NOT NULL PRIMARY KEY IDENTITY (1,1)
,idRetencionAts INT NOT NULL FOREIGN KEY (idRetencionAts) REFERENCES FactElect.RetencionAts(idRetencionAts)
,idRetAtsDocSustento INT NULL FOREIGN KEY (idRetAtsDocSustento) REFERENCES FactElect.RetAtsDocSustento(idRetAtsDocSustento)
,uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
,formaPago VARCHAR(2) NOT NULL
,total NUMERIC(18,5) NOT NULL
)