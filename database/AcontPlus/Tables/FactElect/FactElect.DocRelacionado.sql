USE [AcontPlus]
GO 

CREATE TABLE FactElect.DocRelacionado
(
	 idDocRelacionado INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,idDocumentoElectronico INT NULL
	,idDocumentoRecibido INT FOREIGN KEY REFERENCES Recepcion.DocumentoRecibido(idDocumento) 
	,codDocSustento VARCHAR(5)
	,numDocSustento VARCHAR(20)
	,fechaEmisionDocSustento VARCHAR(50)
	,baseImponible NUMERIC(18,2)
	,porcentajeRetener NUMERIC(18,2)
	,valorRetenido NUMERIC(18,2)
	,claveAcceso VARCHAR(49) NULL
	,fechaRegistro DATETIME DEFAULT GETDATE() NOT NULL
	,estado VARCHAR(10) DEFAULT 'PE'
)