CREATE TABLE Config.PlanCliente(
	idPlanCliente INT PRIMARY KEY IDENTITY(1,1),
	idEntidad INT FOREIGN KEY REFERENCES App.Entidad(idEntidad) NOT NULL,
	idLicencia INT FOREIGN KEY REFERENCES Config.Licencia(idLicencia) NOT NULL,
	idSuscripcion INT FOREIGN KEY REFERENCES Config.Suscripcion(idSuscripcion) NOT NULL,
	ruc NVARCHAR(100) UNIQUE,
	codLicencia NVARCHAR(20),
	codSuscripcion NVARCHAR(20),
	valor DECIMAL(15,5) NOT NULL,
	fechaRegistro DATETIME NOT NULL,
	estado BIT DEFAULT 1
)

