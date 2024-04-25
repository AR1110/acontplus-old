USE Acontplus
GO

ALTER TABLE Sri.Establecimiento ADD idEntidad INT NULL
GO

UPDATE e SET e.idEntidad = en.idEntidad
FROM Sri.Establecimiento e WITH (ROWLOCK)
	INNER JOIN dbo.Entidad en WITH (NOLOCK) ON e.ruc = en.ruc
GO

ALTER TABLE Sri.Establecimiento ADD CONSTRAINT fk_entidad_estab FOREIGN KEY (idEntidad) REFERENCES dbo.Entidad(idEntidad)
GO

ALTER TABLE Sri.Establecimiento ALTER COLUMN idEntidad INT NOT NULL
GO

ALTER TABLE TechnicalSupport.[Order] ADD CONSTRAINT fk_estab_ts_order FOREIGN KEY (EstablecimientoId) REFERENCES Sri.Establecimiento(idEstablecimiento)
GO

ALTER TABLE TechnicalSupport.[Order] ADD CONSTRAINT fk_pto_emi_ts_order FOREIGN KEY (PuntoEmisionId) REFERENCES dbo.PuntoEmision(idPuntoEmision)
GO

--- DONT FORGET EXECUTE SPS OF CRUD