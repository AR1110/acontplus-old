use [AcontPlus]
go


CREATE TABLE Config.Bodeg_Asig
(
	idBodeg_Asig INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codEstab_Asig VARCHAR(150) NOT NULL FOREIGN KEY REFERENCES Config.Estab_Asig(codEstab_Asig) ON DELETE CASCADE
   ,idBodega INT FOREIGN KEY REFERENCES dbo.Bodega(idBodega) NOT NULL
   ,predeterminado BIT NOT NULL
   ,usuario VARCHAR(150) NOT NULL
   ,estado BIT DEFAULT 1 NOT NULL
   ,fechaRegistro DATETIME NOT NULL
)