USE Acontplus
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Articulo')   
    DROP INDEX IX_Articulo ON dbo.Articulo;  
GO
    CREATE NONCLUSTERED INDEX IX_Articulo ON dbo.Articulo(idSubfamilia, idTipoIce, idTipoArticulo, idModelo, idEntidad, idMarca, idTipoIva, idFamilia, idEtiqueta)
    INCLUDE(codigo, codigoAuxiliar, codigoBarra, llevaInventario, estado)
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