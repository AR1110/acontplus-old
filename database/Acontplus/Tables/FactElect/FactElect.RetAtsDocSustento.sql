USE AcontPlus
IF OBJECT_ID(N'FactElect.RetAtsDocSustento', N'U') IS NOT NULL
DROP TABLE FactElect.RetAtsDocSustento 
GO
CREATE TABLE FactElect.RetAtsDocSustento (
idRetAtsDocSustento INT NOT NULL PRIMARY KEY IDENTITY (1,1)
,idRetencionAts INT NOT NULL FOREIGN KEY (idRetencionAts) REFERENCES FactElect.RetencionAts(idRetencionAts)
,uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
,codSustento VARCHAR(2) NULL
,codDocSustento VARCHAR(2) NULL
,numDocSustento VARCHAR(15) NULL
,fechaEmisionDocSustento DATE NOT NULL
,fechaRegistroContable DATE NULL
,numAutDocSustento VARCHAR(49) NULL
,pagoLocExt VARCHAR(2) NULL
,tipoRegi VARCHAR(2) NULL
,paisEfecPago VARCHAR(3) NULL
,aplicConvDobTrib VARCHAR(2) NULL
,pagExtSujRetNorLeg VARCHAR(2) NULL
,pagoRegFis VARCHAR(2) NULL
,totalComprobantesReembolso NUMERIC(18,5) NULL
,totalBaseImponibleReembolso NUMERIC(18,5) NULL
,totalImpuestoReembolso NUMERIC(18,5) NULL
,totalSinImpuestos NUMERIC(18,5) NOT NULL
,importeTotal NUMERIC(18,5) NOT NULL
)  