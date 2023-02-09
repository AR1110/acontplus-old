use [AcontPlus]
go

ALTER TABLE dbo.PuntoEmision ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)
ALTER TABLE dbo.PuntoEmision ADD ambiente VARCHAR(5) FOREIGN KEY REFERENCES Sri.Ambiente(codigo)
ALTER TABLE dbo.PuntoEmision ADD usuario VARCHAR(100) FOREIGN KEY REFERENCES dbo.Usuario(nombreUsuario)


ALTER TABLE dbo.PuntoEmision ALTER COLUMN codEstab VARCHAR(50) NOT NULL
ALTER TABLE dbo.PuntoEmision ALTER COLUMN ambiente VARCHAR(5) NOT NULL
ALTER TABLE dbo.PuntoEmision ALTER COLUMN usuario VARCHAR(100) NOT NULL

ALTER TABLE dbo.PuntoEmision ALTER COLUMN idSucursal INT NULL
ALTER TABLE dbo.PuntoEmision ALTER COLUMN idTipoAmbiente INT NULL
