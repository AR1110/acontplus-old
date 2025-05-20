USE Acontplus
GO


--IF EXISTS (SELECT name
--FROM sys.indexes
--WHERE name = N'IX_ArticuloPvp')   
--    DROP INDEX IX_ArticuloPvp ON dbo.ArticuloPvP;  
--GO
--    CREATE NONCLUSTERED INDEX IX_ArticuloPvp ON dbo.ArticuloPvP(idArticulo, idTarifa);
--GO

--IF EXISTS (SELECT name
--FROM sys.indexes
--WHERE name = N'IX_ArticuloFraccionado')   
--    DROP INDEX IX_ArticuloFraccionado ON dbo.ArticuloFraccionado;  
--GO
--    CREATE NONCLUSTERED INDEX IX_ArticuloFraccionado ON dbo.ArticuloFraccionado(idArticulo, idMedida);
--GO

--IF EXISTS (SELECT name
--FROM sys.indexes
--WHERE name = N'IX_ArticuloFraccionadoPvp')   
--    DROP INDEX IX_ArticuloFraccionadoPvp ON dbo.ArticuloFraccionadoPvP;  
--GO
--    CREATE NONCLUSTERED INDEX IX_ArticuloFraccionadoPvp ON dbo.ArticuloFraccionadoPvP(idArticuloFraccionado, idTarifa);
--GO

--IF EXISTS (SELECT name
--FROM sys.indexes
--WHERE name = N'IX_ArticuloUbicacion')   
--    DROP INDEX IX_ArticuloUbicacion ON dbo.ArticuloFraccionadoPvP;  
--GO
--    CREATE NONCLUSTERED INDEX IX_ArticuloUbicacion ON dbo.ArticuloUbicacion(idArticulo, idBodega);
--GO


--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Articulo_Inventory_Status')   
--    DROP INDEX idx_Articulo_Inventory_Status ON dbo.Articulo;  
--GO

--CREATE NONCLUSTERED INDEX idx_Articulo_Inventory_Status
--ON dbo.Articulo(codigo,estado,idEntidad)

--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Articulo_Inventory_Barcode')   
--    DROP INDEX idx_Articulo_Inventory_Barcode ON dbo.Articulo;  
--GO

--CREATE NONCLUSTERED INDEX idx_Articulo_Inventory_Barcode
--ON dbo.Articulo(estado,idEntidad,codigoBarra)

--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Articulo_Filter_Entidad')   
--    DROP INDEX idx_Articulo_Filter_Entidad ON dbo.Articulo;  
--GO

--CREATE NONCLUSTERED INDEX idx_Articulo_Filter_Entidad
--ON dbo.Articulo(estado,idEntidad)
--INCLUDE(idSubfamilia,codigo,codigoAuxiliar,descripcion,productoFraccionable,stockMinimo,idMarca,idTipoIva,idMedida,codigoBarra,stock)


--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Articulo_Reporte_Stock')   
--    DROP INDEX idx_Articulo_Reporte_Stock ON dbo.Articulo;  
--GO

--CREATE NONCLUSTERED INDEX idx_Articulo_Reporte_Stock
--ON dbo.Articulo(estado,idEntidad)
--INCLUDE(idSubfamilia,codigo,fechaCaducidad,stock);


--IF EXISTS (SELECT name
--    FROM sys.indexes
--    WHERE name = N'IX_Articulo')   
--    DROP INDEX IX_Articulo ON dbo.Articulo;  
--GO
--    CREATE NONCLUSTERED INDEX IX_Articulo ON dbo.Articulo(idArticulo, idSubfamilia, idTipoIce, idTipoArticulo, idModelo, idEntidad, idMarca, idTipoIva, idFamilia, idEtiqueta)
--    INCLUDE(codigo, codigoAuxiliar, codigoBarra, llevaInventario, estado)
--GO


--UPDATE STATISTICS dbo.Articulo WITH FULLSCAN;
--GO

--ALTER INDEX ALL ON dbo.Articulo REBUILD;
--GO
