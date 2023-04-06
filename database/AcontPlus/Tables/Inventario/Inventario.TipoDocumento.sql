USE AcontPlus
GO
CREATE TABLE Inventario.TipoDocumento(
idTipoDocumento INT NOT NULL CONSTRAINT pk_inv_tipo_documento PRIMARY KEY IDENTITY(1,1)
,codigo VARCHAR(10) NOT NULL UNIQUE
,codigoSri VARCHAR(2) NULL
,descripcion VARCHAR(100) NOT NULL
,estado BIT NOT NULL DEFAULT 1
,orden INT NULL
)
