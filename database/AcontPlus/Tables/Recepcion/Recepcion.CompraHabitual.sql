--DROP TABLE [Recepcion].[CompraHabitual]
CREATE TABLE Recepcion.CompraHabitual (
idCompraHabitual INT NOT NULL IDENTITY(1,1)
,codEstab VARCHAR(50) NOT NULL CONSTRAINT fk_CH_Estab FOREIGN KEY (codEstab) REFERENCES Sri.Establecimiento(codEstab)
,idProveedor INT NOT NULL CONSTRAINT fk_CH_Prov FOREIGN KEY (idProveedor) REFERENCES dbo.Proveedor(idProveedor)
,ruc VARCHAR(20) NULL
,idArticulo INT NOT NULL CONSTRAINT fk_CH_Articulo FOREIGN KEY (idProveedor) REFERENCES dbo.Articulo(idArticulo)
,codArticulo VARCHAR(20) NOT NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
CONSTRAINT pk_CompraHabitual PRIMARY KEY CLUSTERED (idCompraHabitual)
)