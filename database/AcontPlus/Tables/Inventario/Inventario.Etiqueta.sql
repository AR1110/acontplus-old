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


declare @etiquetas as varchar(max)

--SELECT * FROM ManejoArticulo
--SELECT * FROM ManejoArticuloDetalle
--SELECT TOP 10 * FROM Etiqueta
-- SELECT * FROM ActividadEmpresa
---Datos adicionales del Articulo 
DECLARE @tbAdicional AS TABLE(	
	idEtiqueta INT NOT NULL, 
	descripcion VARCHAR(300) NOT NULL,
	etiquetas VARCHAR(MAX) NOT NULL,
	estado BIT DEFAULT 1,
	fechaRegistro DATETIME NOT NULL
)

DECLARE @tbManejo AS TABLE (
	 idManejo INT 
    ,uniqueId VARCHAR(50)  unique
	,idEtiqueta INT 
	,info VARCHAR(MAX)
	,estado INT 
) 

SELECT TOP 1 uniqueId FROM dbo.FacturaCompra 
select top 1 uniqueId from Compra.Documento_Ingreso
select top 1 claveAcceso from Recepcion.DocumentoRecibido