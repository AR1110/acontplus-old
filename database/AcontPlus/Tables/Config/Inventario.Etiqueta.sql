
USE AcontPlus;

IF OBJECT_ID('Inventario.Etiqueta','U') IS NOT NULL
	DROP TABLE Inventario.Etiqueta
GO
--tb Compras.InfoAdicionalArticulo 
CREATE TABLE Inventario.Etiqueta (	
	idEtiqueta INT IDENTITY(1,1) PRIMARY KEY NOT NULL, 	
	descripcion VARCHAR(300) NOT NULL,
	etiquetas VARCHAR(MAX) NOT NULL,
	estado BIT DEFAULT 1,
	fechaRegistro DATETIME NOT NULL,
	idUsuario INT NOT NULL	
);
