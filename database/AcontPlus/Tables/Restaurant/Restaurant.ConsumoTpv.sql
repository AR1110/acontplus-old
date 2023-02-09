USE AcontPlus
IF OBJECT_ID(N'Restaurant.ConsumoTpv', N'U') IS NOT NULL
DROP TABLE Restaurant.ConsumoTpv 
GO
CREATE TABLE Restaurant.ConsumoTpv(
idConsumoTpv INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,idConfigTpv INT NOT NULL FOREIGN KEY (idConfigTpv)  REFERENCES Restaurant.ConfigTpv(idConfigTpv)
,idCliente INT NOT NULL FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
,cantidad INT NOT NULL
,fechaRegistro DATETIME NOT NULL
,idUsuario INT NULL
,estado BIT NOT NULL DEFAULT 1
)