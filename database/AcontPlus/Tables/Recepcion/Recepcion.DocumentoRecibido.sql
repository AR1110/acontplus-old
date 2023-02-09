USE AcontPlus
GO
CREATE SCHEMA Recepcion
GO
CREATE TABLE Recepcion.DocumentoRecibido (
	uniqueId UNIQUEIDENTIFIER NOT NULL,
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
	idUsuario INT NULL,
	fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
	CONSTRAINT DocumentoRecibido_PK PRIMARY KEY (uniqueId)
);