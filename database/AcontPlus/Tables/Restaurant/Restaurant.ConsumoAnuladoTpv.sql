USE AcontPlus
IF OBJECT_ID(N'Restaurant.ConsumoAnuladoTpv', N'U') IS NOT NULL
DROP TABLE Restaurant.ConsumoAnuladoTpv 
GO
CREATE TABLE Restaurant.ConsumoAnuladoTpv(
idConsumoAnuladoTpv INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,idConsumoTpv INT NOT NULL FOREIGN KEY (idConsumoTpv)  REFERENCES Restaurant.ConsumoTpv(idConsumoTpv) 
,motivo VARCHAR(300) NOT NULL
,fechaRegistro DATETIME NOT NULL
,idUsuario INT NOT NULL
,estado BIT NOT NULL DEFAULT 1
)