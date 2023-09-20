use [Acontplus]
GO 


ALTER TABLE Mechanical.Support ADD CONSTRAINT FK_Support_Cliente_idCliente FOREIGN KEY (CustomerId) REFERENCES dbo.Cliente(idCliente) 