USE [AcontPlus]
GO


CREATE TABLE Config.PtoEmi_Asig 
(
	idPtoEmi_Asig INT IDENTITY(1,1) PRIMARY KEY NOT NULL
   ,codEstab_Asig VARCHAR(150) NOT NULL FOREIGN KEY REFERENCES Config.Estab_Asig(codEstab_Asig) ON DELETE CASCADE 
   ,idPuntoEmision INT FOREIGN KEY REFERENCES dbo.PuntoEmision(idPuntoEmision) NOT NULL
   ,ptoEmi VARCHAR(5) NOT NULL
   ,predeterminado BIT NOT NULL
   ,estado BIT DEFAULT 1 
   ,usuario VARCHAR(150) NOT NULL
   ,fechaRegistro DATETIME NOT NULL
)