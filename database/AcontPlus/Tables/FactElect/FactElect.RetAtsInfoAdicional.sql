USE AcontPlus
IF OBJECT_ID(N'FactElect.RetAtsInfoAdicional', N'U') IS NOT NULL
DROP TABLE FactElect.RetAtsInfoAdicional 
GO
CREATE TABLE FactElect.RetAtsInfoAdicional (
idRetAtsInfoAdicional INT NOT NULL PRIMARY KEY IDENTITY (1,1)
,idRetencionAts INT NOT NULL FOREIGN KEY (idRetencionAts) REFERENCES FactElect.RetencionAts(idRetencionAts)
,nombre VARCHAR(100) NOT NULL
,valor VARCHAR(300) NOT NULL
)