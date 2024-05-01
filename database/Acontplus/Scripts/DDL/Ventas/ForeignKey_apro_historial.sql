use [Acontplus]
go 

ALTER TABLE Ventas.Aprob_Document_Hist ADD idUsuario INT 

ALTER TABLE Ventas.Aprob_Document_Hist ADD fechaRegistro DATETIME2


ALTER TABLE Ventas.Aprob_Document_Hist
ADD CONSTRAINT FK_idUsuario_Aprob_Document_Hist
FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)

--select * from Ventas.Aprob_Document_Hist