USE AcontPlus
CREATE TABLE Restaurant.ConfigPrinter(
idConfigPrinter INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,idSucursal INT NOT NULL FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
,estado BIT NOT NULL
,idUsuario INT NULL
)