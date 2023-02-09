CREATE TABLE Inventario.MetodoValoracion
(
	idMetodoValoracion INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	descripcion VARCHAR(200) NOT NULL,
	codigo VARCHAR(10) UNIQUE NOT NULL,
	estado BIT DEFAULT 1 NOT NULL,
	fechaRegistro DATETIME NOT NULL
)



