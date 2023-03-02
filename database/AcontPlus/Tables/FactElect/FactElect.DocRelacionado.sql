USE [AcontPlus]
GO 


CREATE TABLE FactElect.DocRelacionado
(
	 idDocRelacionado INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,idDocumentoElectronico INT NULL
	,idDocumentoRecibido INT FOREIGN KEY REFERENCES Recepcion.DocumentoRecibido(idDocumento) 
	,codDocSustento VARCHAR(5)
	,numDocSustento VARCHAR(15)
	,fechaEmisionDocSustento VARCHAR(50)
	,codigo VARCHAR(5)
	,baseImponible NUMERIC(15,5)
	,porcentajeRetener NUMERIC(15,5)
	,valorRetenido NUMERIC(15,5)
	,claveAcceso VARCHAR(49) NULL
)