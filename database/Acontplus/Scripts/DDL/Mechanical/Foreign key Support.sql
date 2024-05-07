use [Acontplus]
go 

-->Support
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

ALTER TABLE [Mechanical].[Support]
ADD CONSTRAINT FK_CompanyId_SupportMechanical
FOREIGN KEY (CompanyId) REFERENCES dbo.Entidad(idEntidad);

-->Support Detail
ALTER TABLE [Mechanical].[SupportDetail]
ADD CONSTRAINT FK_ArticuloId_SupportMechanical
FOREIGN KEY (ArticuloId) REFERENCES dbo.Articulo(idArticulo);

ALTER TABLE [Mechanical].[SupportDetail]
ADD CONSTRAINT FK_TarifaId_SupportMechanical
FOREIGN KEY (TarifaId) REFERENCES dbo.Tarifa(idTarifa);

ALTER TABLE [Mechanical].[SupportDetail]
ADD CONSTRAINT FK_BodegaId_SupportMechanical
FOREIGN KEY (BodegaId) REFERENCES dbo.Bodega(idBodega);

ALTER TABLE [Mechanical].[SupportDetail]
ADD CONSTRAINT FK_MedidaId_SupportMechanical
FOREIGN KEY (MedidaId) REFERENCES dbo.Medida(idMedida);

ALTER TABLE [Mechanical].[SupportDetail]
ADD CONSTRAINT FK_TaxId_SupportMechanical
FOREIGN KEY (TaxId) REFERENCES Sri.Impuesto(idImpuesto);

ALTER TABLE [Mechanical].[SupportDetail]
ADD CONSTRAINT FK_TaxPercentId_SupportMechanical
FOREIGN KEY (TaxPercentId) REFERENCES Sri.TarifaImpuesto(idTarifaImpuesto);



