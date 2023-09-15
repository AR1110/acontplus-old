USE [Acontplus]
GO 


ALTER TABLE Mechanical.Support ADD CONSTRAINT FK_Support_Usuario_idUsuario FOREIGN KEY (UserAssignedId) REFERENCES dbo.Usuario(idUsuario) 
