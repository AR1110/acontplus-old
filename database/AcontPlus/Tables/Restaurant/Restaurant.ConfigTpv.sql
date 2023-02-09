USE AcontPlus
IF OBJECT_ID(N'Restaurant.ConfigTpv', N'U') IS NOT NULL
DROP TABLE Restaurant.ConfigTpv 
GO
CREATE TABLE Restaurant.ConfigTpv(
idConfigTpv INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,idSucursal INT NOT NULL FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
,codigo VARCHAR(2) NOT NULL
,descripcion VARCHAR(100) NOT NULL
,horaInicio TIME NOT NULL
,horaFin TIME NOT NULL
,estado BIT NOT NULL DEFAULT 1
)