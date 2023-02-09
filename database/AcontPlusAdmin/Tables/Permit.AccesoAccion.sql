--CREATE TABLE Permit.AccesoAccion(
--	idAccesoAccion INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
--	idAccesoMenu INT FOREIGN KEY REFERENCES Permit.AccesoMenu(idAccesoMenu) NOT NULL,
--	idAsignacion INT FOREIGN KEY REFERENCES Config.Asignacion(idAsignacion) NOT NULL,
--	codAsignacion NVARCHAR(150) NOT NULL,
--	estado BIT DEFAULT 0 NOT NULL,
--	fechaRegistro DATETIME NOT NULL
--)

