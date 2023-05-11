use AcontPlus

--IF OBJECT_ID('Inventario.Etiqueta','U') IS NOT NULL
--	DROP TABLE Inventario.Etiqueta
--GO
----tb Inventario.Etiqueta
--CREATE TABLE Inventario.Etiqueta (	
--	idEtiqueta INT IDENTITY(1,1) PRIMARY KEY NOT NULL, 	
--	descripcion VARCHAR(300) NOT NULL,
--	etiquetas VARCHAR(MAX) NOT NULL,
--	estado BIT DEFAULT 1,
--	fechaRegistro DATETIME NOT NULL,
--	idUsuario INT NOT NULL	
--);

IF OBJECT_ID('Compra.CompEtiquetaArticulo','U') IS NOT NULL
	DROP TABLE Compra.CompEtiquetaArticulo
GO

CREATE TABLE Compra.CompEtiquetaArticulo (
	 idCompEtiquetaArticulo INT IDENTITY(1,1) PRIMARY KEY NOT NULL	
    ,uniqueId VARCHAR(50)  UNIQUE NOT NULL
	--,idEtiqueta INT NOT NULL CONSTRAINT FK_CompEtiquetaArticulo_Etiqueta FOREIGN KEY (idEtiqueta) REFERENCES Inventario.Etiqueta(idEtiqueta)
	,info VARCHAR(MAX) NOT NULL
	,estado BIT DEFAULT 1 
) 

--declare @etiquetas as varchar(max)

--SELECT * FROM ManejoArticulo
--SELECT * FROM ManejoArticuloDetalle
--SELECT TOP 10 * FROM Etiqueta
-- SELECT * FROM ActividadEmpresa
---Datos adicionales del Articulo 
--DECLARE @tbAdicional AS TABLE(	
--	idEtiqueta INT NOT NULL, 
--	descripcion VARCHAR(300) NOT NULL,
--	etiquetas VARCHAR(MAX) NOT NULL,
--	estado BIT DEFAULT 1,
--	fechaRegistro DATETIME NOT NULL
--)

--DECLARE @tbManejo AS TABLE (
--	 idManejo INT 
--    ,uniqueId VARCHAR(50)  unique
--	,idEtiqueta INT 
--	,info VARCHAR(MAX)
--	,estado INT 
--) 

--SELECT TOP 1 uniqueId FROM dbo.FacturaCompra 
--select top 1 uniqueId from Compra.Documento_Ingreso
--select top 1 claveAcceso from Recepcion.DocumentoRecibido
