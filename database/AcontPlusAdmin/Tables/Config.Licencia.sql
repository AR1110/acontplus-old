CREATE TABLE Config.Licencia(
	idLicencia INT PRIMARY KEY IDENTITY(1,1),
	codigo NVARCHAR(10) NOT NULL UNIQUE,
	titulo NVARCHAR(80) NOT NULL,
	descripcion NVARCHAR(300) NULL,
	total DECIMAL(15,5) NOT NULL,
	descuento DECIMAL(15,5) NOT NULL,
	impuesto DECIMAL(15,5) NOT NULL,
	fechaRegistro DATETIME NOT NULL,
	estado BIT DEFAULT 1 
)

CREATE TABLE Config.LicenciaPlan(
	idLicenciaPlan INT PRIMARY KEY IDENTITY(1,1),
	idLicencia INT FOREIGN KEY REFERENCES Config.Licencia(idLicencia) NOT NULL,
	idAplicacion INT FOREIGN KEY REFERENCES Config.Aplicacion(idAplicacion) NOT NULL,
	codLicencia NVARCHAR(10) NOT NULL,
	codAplicacion NVARCHAR(10) NOT NULL,
	costo DECIMAL(15,5) NOT NULL,
	impuesto DECIMAL(15,5),
	descuento DECIMAL(15,5),
	estado BIT DEFAULT 1 
)