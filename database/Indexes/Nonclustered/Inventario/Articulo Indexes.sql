USE ACONTPLUS
GO
--ELIMINARRRRRRRRRRRRR---------
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_IdSubfamilia')   
    DROP INDEX IX_Articulo_IdSubfamilia ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_TipoIceId
--    ON Articulo(idTipoIce);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_TipoIceId')   
    DROP INDEX IX_Articulo_TipoIceId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_TipoIceId
--    ON Articulo(idTipoIce);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_TipoArticuloId')   
    DROP INDEX IX_Articulo_TipoArticuloId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_TipoArticuloId
--    ON Articulo(idTipoArticulo);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_ModeloId')   
    DROP INDEX IX_Articulo_ModeloId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_ModeloId
--    ON Articulo(idModelo);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_MarcaId')   
    DROP INDEX IX_Articulo_MarcaId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_MarcaId
--    ON Articulo(idMarca);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_TipoIvaId')   
    DROP INDEX IX_Articulo_TipoIvaId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_TipoIvaId
--    ON Articulo(idTipoIva);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_MedidaId')   
    DROP INDEX IX_Articulo_MedidaId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_MedidaId
--    ON Articulo(idMedida);   
GO 


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_FamiliaId')   
    DROP INDEX IX_Articulo_FamiliaId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_FamiliaId
--    ON Articulo(idFamilia);   
GO 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_EtiquetaId')   
    DROP INDEX IX_Articulo_EtiquetaId ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_EtiquetaId
--    ON Articulo(idEtiqueta);   
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo_IdEntidad')   
    DROP INDEX IX_Articulo_IdEntidad ON Articulo;  
GO
--CREATE NONCLUSTERED INDEX IX_Articulo_EtiquetaId
--    ON Articulo(idEtiqueta);   
GO

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_ArticuloPvp_IdTarifa')   
    DROP INDEX IX_ArticuloPvp_IdTarifa ON dbo.ArticuloPvp;   
GO  

-- Find an existing index named IX_Articulo_IdEntidad and delete it if found.   
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_ArticuloPvp_idArticulo')   
    DROP INDEX IX_ArticuloPvp_idArticulo ON dbo.ArticuloPvp;   
GO  

---NUEVO---------------------

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo')   
    DROP INDEX IX_Articulo ON dbo.Articulo;  
GO
CREATE NONCLUSTERED INDEX IX_Articulo ON dbo.Articulo(idSubfamilia, idTipoIce, idTipoArticulo, idModelo, idEntidad, idMarca, idTipoIva, idFamilia, idEtiqueta);
 
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_ArticuloPvp')   
    DROP INDEX IX_ArticuloPvp ON dbo.ArticuloPvP;  
GO
    CREATE NONCLUSTERED INDEX IX_ArticuloPvp ON dbo.ArticuloPvP(idArticulo, idTarifa);
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_ArticuloFraccionado')   
    DROP INDEX IX_ArticuloFraccionado ON dbo.ArticuloFraccionado;  
GO
    CREATE NONCLUSTERED INDEX IX_ArticuloFraccionado ON dbo.ArticuloFraccionado(idArticulo, idMedida);
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_ArticuloFraccionadoPvp')   
    DROP INDEX IX_ArticuloFraccionadoPvp ON dbo.ArticuloFraccionadoPvP;  
GO
    CREATE NONCLUSTERED INDEX IX_ArticuloFraccionadoPvp ON dbo.ArticuloFraccionadoPvP(idArticuloFraccionado, idTarifa);
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_ArticuloUbicacion')   
    DROP INDEX IX_ArticuloUbicacion ON dbo.ArticuloFraccionadoPvP;  
GO
    CREATE NONCLUSTERED INDEX IX_ArticuloUbicacion ON dbo.ArticuloUbicacion(idArticulo, idBodega);
GO