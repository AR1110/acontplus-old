USE ACONTPLUS
GO
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_TipoIceId')   
    DROP INDEX IX_Articulo_TipoIceId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_TipoIceId
    ON Articulo(idTipoIce);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_TipoArticuloId')   
    DROP INDEX IX_Articulo_TipoArticuloId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_TipoArticuloId
    ON Articulo(idTipoArticulo);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_ModeloId')   
    DROP INDEX IX_Articulo_ModeloId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_ModeloId
    ON Articulo(idModelo);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_MarcaId')   
    DROP INDEX IX_Articulo_MarcaId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_MarcaId
    ON Articulo(idMarca);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_TipoIvaId')   
    DROP INDEX IX_Articulo_TipoIvaId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_TipoIvaId
    ON Articulo(idTipoIva);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_MedidaId')   
    DROP INDEX IX_Articulo_MedidaId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_MedidaId
    ON Articulo(idMedida);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_FamiliaId')   
    DROP INDEX IX_Articulo_FamiliaId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_FamiliaId
    ON Articulo(idFamilia);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_EtiquetaId')   
    DROP INDEX IX_Articulo_EtiquetaId ON Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo_EtiquetaId
    ON Articulo(idEtiqueta);   
GO
