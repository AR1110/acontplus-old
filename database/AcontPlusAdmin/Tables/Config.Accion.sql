--CREATE TABLE Config.Accion(
--	idAccion INT PRIMARY KEY IDENTITY(1,1),
--	codigo NVARCHAR(10) NOT NULL UNIQUE,
--	descripcion NVARCHAR(200) NOT NULL,
--	fechaRegistro DATETIME NOT NULL,
--	estado BIT DEFAULT 1 
--)


--CREATE TABLE Config.Asignacion(
--	idAsignacion INT PRIMARY KEY IDENTITY(1,1),
--	idMenu INT FOREIGN KEY REFERENCES Config.Menu(idMenu) NULL,
--	idSubMenu INT FOREIGN KEY REFERENCES Config.SubMenu(idSubMenu) NOT NULL,
--	idAccion INT FOREIGN KEY REFERENCES Config.Accion(idAccion) NOT NULL,
--	codMenu NVARCHAR(10) NOT NULL,
--	codSubMenu NVARCHAR(10) NOT NULL,
--	codAccion NVARCHAR(10) NOT NULL,
--	estado BIT DEFAULT 1 
--)

