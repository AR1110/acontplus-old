USE AcontPlus
GO
ALTER TABLE DocumentoElectronico ADD idSucursal INT NULL
GO
ALTER TABLE DocumentoElectronico ADD ruc VARCHAR(13)
GO
ALTER TABLE DocumentoElectronico ADD numeroIdentificacion VARCHAR(13)
