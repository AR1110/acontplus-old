USE [AcontPlus]
GO

CREATE TABLE Sri.Establecimiento
(
	idEstablecimiento INT IDENTITY(1,1) NOT NULL PRIMARY KEY 
   ,codEstab VARCHAR(50) UNIQUE NOT NULL 
   ,canton VARCHAR(10) NULL FOREIGN KEY REFERENCES Catalogo.Canton(codigo) ON UPDATE CASCADE 
   ,actividad VARCHAR(5) NOT NULL FOREIGN KEY REFERENCES Sri.ActividadEconomica(codigo) ON UPDATE CASCADE
   ,agenteRetencion VARCHAR(150) NULL FOREIGN KEY REFERENCES Sri.AgenteRetencion(resolucion) ON UPDATE CASCADE
   ,contribuyente VARCHAR(5) NOT NULL FOREIGN KEY REFERENCES Sri.Contribuyente(codigo) ON UPDATE CASCADE
   ,ruc VARCHAR(15) NOT NULL
   ,estab VARCHAR(5) NOT NULL
   ,contribuyenteEspecial VARCHAR(10) NULL
   ,obligadoContabilidad VARCHAR(5) NOT NULL
   ,nombreComercial VARCHAR(150) NOT NULL
   ,dirEstablecimiento VARCHAR(300) NOT NULL
   ,contribuyenteRimpe VARCHAR(150) NULL
   ,fechaRegistro DATETIME NOT NULL
   ,usuario VARCHAR(100) NOT NULL FOREIGN KEY REFERENCES dbo.Usuario(nombreUsuario) ON UPDATE CASCADE
   ,estado BIT DEFAULT 1 

)
