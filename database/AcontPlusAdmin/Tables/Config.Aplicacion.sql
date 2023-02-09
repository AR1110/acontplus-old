create table Config.Aplicacion (
	idAplicacion INT PRIMARY KEY IDENTITY(1,1),
	idSistema INT FOREIGN KEY REFERENCES Config.Sistema(idSistema),
	codigo NVARCHAR(10) NOT NULL UNIQUE,
	codSistema NVARCHAR(10) NOT NULL,
	descripcion NVARCHAR(300) NOT NULL,
	fechaRegistro DATETIME NOT NULL,
	estado BIT DEFAULT 1
)


CREATE TABLE Config.AplicacionMenu(
	idAplicacionMenu INT PRIMARY KEY IDENTITY(1,1),
	idAplicacion INT FOREIGN KEY REFERENCES Config.Aplicacion(idAplicacion) NOT NULL,
	idMenu INT FOREIGN KEY REFERENCES Config.Menu(idMenu),
	idSubMenu INT FOREIGN KEY REFERENCES Config.SubMenu(idSubMenu),
	codAplicacion NVARCHAR(10) NOT NULL,
	codMenu NVARCHAR(10) NOT NULL,
	codSubMenu NVARCHAR(10) NOT NULL,
	estado BIT DEFAULT 1 
)

