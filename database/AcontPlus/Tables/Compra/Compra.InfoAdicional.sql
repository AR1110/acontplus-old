
USE AcontPlus;
CREATE TABLE Compra.InfoAdicional (
     idInfoAdicional INT NOT NULL PRIMARY KEY IDENTITY(1,1)
    ,uniqueId VARCHAR(50) NOT NULL
    ,idArticulo INT NOT NULL CONSTRAINT FK_CompraInfoAdicional_Articulo FOREIGN KEY (idArticulo) REFERENCES Articulo(idArticulo)
    ,idEtiqueta INT NOT NULL CONSTRAINT FK_CompraInfoAdicional_Etiqueta FOREIGN KEY (idEtiqueta) REFERENCES Inventario.Etiqueta(idEtiqueta)
    ,jsonAdicional VARCHAR(MAX) NOT NULL
    ,estado INT DEFAULT 1
    ,fechaVenta DATE NULL
    ,fechaRegisto DATETIME NOT NULL
)