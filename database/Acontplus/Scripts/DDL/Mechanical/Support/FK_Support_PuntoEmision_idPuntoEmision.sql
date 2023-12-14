USE [Acontplus]
GO 


ALTER TABLE Mechanical.Support ADD CONSTRAINT FK_Support_PuntoEmision_idPuntoEmision FOREIGN KEY (PuntoEmisionId) REFERENCES dbo.PuntoEmision(idPuntoEmision) 
