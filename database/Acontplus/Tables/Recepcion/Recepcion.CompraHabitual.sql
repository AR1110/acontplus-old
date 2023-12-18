--DROP TABLE  Recepcion.CompraHabitual
CREATE TABLE Recepcion.CompraHabitual (
idCompraHabitual INT NOT NULL IDENTITY (1,1)
,idProveedor INT NOT NULL CONSTRAINT fk_CH_Prov FOREIGN KEY (idProveedor) REFERENCES dbo.Proveedor(idProveedor)
,codEstab VARCHAR(50) NOT NULL CONSTRAINT fk_r_ch_estab FOREIGN KEY (codEstab) REFERENCES Sri.Establecimiento(codEstab)
,ruc VARCHAR(20) NULL
,idArticulo INT NOT NULL CONSTRAINT fk_r_ch_Articulo FOREIGN KEY (idArticulo) REFERENCES dbo.Articulo(idArticulo)
,codArticulo VARCHAR(25) NOT NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
CONSTRAINT pk_r_CompraHabitual PRIMARY KEY (idCompraHabitual)
)