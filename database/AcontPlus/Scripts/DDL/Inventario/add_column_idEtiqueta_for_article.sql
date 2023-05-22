USE AcontPlus


ALTER TABLE Articulo
ADD idEtiqueta INT NULL,
CONSTRAINT FK_Articulo_Etiqueta FOREIGN KEY (idEtiqueta) REFERENCES Inventario.Etiqueta (idEtiqueta);

