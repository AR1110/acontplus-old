-- db_a7a679_acontplusdev.dbo.ComprobanteImportacion definition


-- DROP TABLE FactElect.ComprobanteImportacion;

CREATE TABLE FactElect.ComprobanteImportacion (
	uniqueId UNIQUEIDENTIFIER NOT NULL,
	idSucursal INT NOT NULL,
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
	fechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
	complete BIT NOT NULL DEFAULT 0
	CONSTRAINT ComprobanteImportacion_PK PRIMARY KEY (uniqueId)
);