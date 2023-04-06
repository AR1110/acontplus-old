USE AcontPlus
GO
CREATE TABLE Inventario.Stock( 
idStock INT NOT NULL CONSTRAINT pk_Stock PRIMARY KEY IDENTITY(1,1)
,idArticulo INT NOT NULL CONSTRAINT fk_inv_stock_Articulo FOREIGN KEY (idArticulo) REFERENCES Articulo(idArticulo)
,idBodega INT NOT NULL CONSTRAINT fk_inv_stock_Bodega FOREIGN KEY (idBodega) REFERENCES Bodega(idBodega)
,cantidad NUMERIC(18,2) NOT NULL
,lastUpdate DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
)