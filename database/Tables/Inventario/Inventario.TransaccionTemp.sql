USE AcontPlus
GO
IF OBJECT_ID('Inventario.TransaccionTemp') IS NOT NULL
DROP TABLE Inventario.TransaccionTemp
GO
CREATE TABLE Inventario.TransaccionTemp(
Id BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1)
,TipoTransaccionId INT NOT NULL FOREIGN KEY (TipoTransaccionId) REFERENCES Inventario.TipoTransaccion(idTipoTransaccion)
,ProductId INT NOT NULL FOREIGN KEY (ProductId) REFERENCES Articulo(idArticulo)
,BodegaId INT NOT NULL FOREIGN KEY (BodegaId) REFERENCES Bodega(idBodega)
,TipoDocumentoId INT NOT NULL FOREIGN KEY (TipoDocumentoId) REFERENCES Inventario.TipoDocumento(idTipoDocumento)
,DocumentoId INT NOT NULL
,MedidaId INT NOT NULL FOREIGN KEY (MedidaId) REFERENCES Medida(idMedida)
,TarifaId INT NULL FOREIGN KEY (TarifaId) REFERENCES Tarifa(idTarifa)
,Cantidad NUMERIC(18,5) NOT NULL
,CantidadStock NUMERIC(18,5) NOT NULL
,CantidadAnulada NUMERIC(18,5) NOT NULL DEFAULT 0
,PrecioUnitario NUMERIC(18,2) NOT NULL
,PrecioCosto NUMERIC(18,2) NOT NULL
,Total NUMERIC(18,2) NOT NULL
,FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,estado INT NOT NULL DEFAULT 1
,Accion VARCHAR(5) NOT NULL DEFAULT 'A'
,idUsuario INT NOT NULL
)