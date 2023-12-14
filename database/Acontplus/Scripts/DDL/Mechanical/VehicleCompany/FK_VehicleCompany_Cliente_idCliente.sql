use [Acontplus]
GO 


ALTER TABLE Mechanical.VehicleCompany ADD CONSTRAINT FK_VehicleCompany_Cliente_idCliente FOREIGN KEY (CustomerId) REFERENCES dbo.Cliente(idCliente) 