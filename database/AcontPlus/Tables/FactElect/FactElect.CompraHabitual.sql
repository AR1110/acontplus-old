--DROP TABLE [FactElect].[CompraHabitual]
CREATE TABLE FactElect.CompraHabitual (
idCompraHabitual INT NOT NULL IDENTITY(1,1)
,idSucursal INT NOT NULL CONSTRAINT fk_CH_Sucursal FOREIGN KEY (idSucursal) REFERENCES dbo.Sucursal(idSucursal)
,idProveedor INT NOT NULL CONSTRAINT fk_CH_Prov FOREIGN KEY (idProveedor) REFERENCES dbo.Proveedor(idProveedor)
,ruc VARCHAR(20) NULL
,idArticulo INT NOT NULL CONSTRAINT fk_CH_Articulo FOREIGN KEY (idProveedor) REFERENCES dbo.Articulo(idArticulo)
,codArticulo VARCHAR(20) NOT NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
CONSTRAINT pk_CompraHabitual PRIMARY KEY CLUSTERED (idCompraHabitual)
)