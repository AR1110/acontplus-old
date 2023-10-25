USE AcontPlus
GO
CREATE TABLE Inventario.TipoTransaccion( 
idTipoTransaccion INT NOT NULL CONSTRAINT pk_inv_tipoTransaccion PRIMARY KEY IDENTITY(1,1) 
,codigo VARCHAR(1) NOT NULL UNIQUE
,descripcion VARCHAR(100) NOT NULL
,estado BIT NOT NULL DEFAULT 1
)