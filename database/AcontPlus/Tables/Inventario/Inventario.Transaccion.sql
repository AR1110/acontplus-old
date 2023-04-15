USE AcontPlus
GO
IF OBJECT_ID('Inventario.Transaccion') IS NOT NULL
DROP TABLE Inventario.Transaccion
GO
CREATE TABLE Inventario.Transaccion(
idTransaccion INT NOT NULL CONSTRAINT pk_inventory_transaction PRIMARY KEY IDENTITY(1,1)
,idTipoTransaccion INT NOT NULL CONSTRAINT fk_inv_type_trans FOREIGN KEY (idTipoTransaccion) REFERENCES Inventario.TipoTransaccion(idTipoTransaccion)
,idArticulo INT NOT NULL CONSTRAINT fk_inv_trans_Articulo FOREIGN KEY (idArticulo) REFERENCES Articulo(idArticulo)
,idBodega INT NOT NULL CONSTRAINT fk_inv_trans_Bodega FOREIGN KEY (idBodega) REFERENCES Bodega(idBodega)
,idTipoDocumento INT NOT NULL CONSTRAINT fk_inv_tipo_doc FOREIGN KEY (idTipoDocumento) REFERENCES Inventario.TipoDocumento(idTipoDocumento)
,idDocumento INT NOT NULL
,cantidad NUMERIC(18,5) NOT NULL
,precioUnitario NUMERIC(18,2) NOT NULL
,precioCosto NUMERIC(18,2) NOT NULL 
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,estado INT NOT NULL DEFAULT 1
,idUsuario INT NOT NULL
)