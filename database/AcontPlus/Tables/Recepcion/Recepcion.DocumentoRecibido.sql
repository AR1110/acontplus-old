 
USE AcontPlus
GO
--DROP TABLE Recepcion.DocumentoRecibido
CREATE TABLE Recepcion.DocumentoRecibido (
	idDocumento INT NOT NULL CONSTRAINT DocumentoRecibido_PK PRIMARY KEY (idDocumento) IDENTITY(1,1),
	idEstablecimiento INT NOT NULL,
	codEstab VARCHAR(50) NOT NULL,
	comprobante varchar(50) NULL,
	codDoc varchar(2) NULL,
	serieComprobante varchar(50) NOT NULL,
	rucEmisor varchar(15) NOT NULL,
	razonSocialEmisior varchar(250) NULL,
	fechaEmision varchar(50) NOT NULL,
	fechaAutorizacion varchar(50) NOT NULL,
	tipoEmision varchar(20) NOT NULL,
	identificacionReceptor varchar(15) NOT NULL,
	claveAcceso varchar(50) NOT NULL UNIQUE,
	numeroAutorizacion varchar(50) NOT NULL,
	importeTotal decimal(18,5) NOT NULL,
	xmlDoc XML NULL,
	downloaded VARCHAR(2) NOT NULL,
	complete BIT NOT NULL DEFAULT 0,
	obs VARCHAR(MAX) NULL,
	fechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
	idUsuario INT NULL
);

--DROP TABLE Recepcion.DocumentoRecibido