CREATE TABLE Config.Suscripcion(
	idSuscripcion INT PRIMARY KEY IDENTITY(1,1),
	codigo VARCHAR(10) NOT NULL UNIQUE,
	descripcion NVARCHAR(300) NOT NULL,
	cantidad INT NOT NULL,
	tiempo NVARCHAR(10) NOT NULL,
	fechaRegistro DATETIME,
	estado BIT DEFAULT 1
)