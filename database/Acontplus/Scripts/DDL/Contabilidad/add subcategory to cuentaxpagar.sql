use Acontplus
go
ALTER TABLE Contabilidad.CuentaPorPagar ADD subcategoryId INT NULL
GO
ALTER TABLE Recepcion.DocumentoRecibido ADD subcategoryId INT NULL
GO

GO
ALTER TABLE Contabilidad.CuentaPorPagar ADD CONSTRAINT fk_contabilidad_ccp_subcategory FOREIGN KEY (subcategoryId) REFERENCES Contabilidad.Subcategory(Id)
GO


