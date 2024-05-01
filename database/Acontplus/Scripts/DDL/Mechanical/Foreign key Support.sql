use [Acontplus]
go 

ALTER TABLE [Mechanical].[Support]
ADD CONSTRAINT FK_PuntoEmisionId_SupportMechanical
FOREIGN KEY (PuntoEmisionId) REFERENCES dbo.PuntoEmision(idPuntoEmision);

ALTER TABLE [Mechanical].[Support]
ADD CONSTRAINT FK_CustomerId_SupportMechanical
FOREIGN KEY (CustomerId) REFERENCES dbo.Cliente(idCliente);

ALTER TABLE [Mechanical].[Support]
ADD CONSTRAINT FK_UserId_SupportMechanical
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario);

ALTER TABLE [Mechanical].[Support]
ADD CONSTRAINT FK_UserAssignedId_SupportMechanical
FOREIGN KEY (UserAssignedId) REFERENCES dbo.Usuario(idUsuario);


