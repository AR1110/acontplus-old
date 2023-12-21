USE AcontPlus;  
GO  
-- Find an existing index named IX_Articulo_IdEntidad and delete it if found.   
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CH_IdProveedor')   
    DROP INDEX IX_CH_IdProveedor ON Recepcion.CompraHabitual;  
GO  

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Compra_Habitual')   
    DROP INDEX IX_Compra_Habitual ON Recepcion.CompraHabitual;  
GO  
CREATE NONCLUSTERED INDEX IX_Compra_Habitual ON Recepcion.CompraHabitual(idProveedor, codEstab, idArticulo, codArticulo) INCLUDE (ruc)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Compra_DocumentoRecibido')   
    DROP INDEX IX_Compra_DocumentoRecibido ON Recepcion.DocumentoRecibido;  
GO  
CREATE NONCLUSTERED INDEX IX_Compra_DocumentoRecibido ON Recepcion.DocumentoRecibido(idDocumento, idEstablecimiento, codEstab, codDoc, rucEmisor, fechaEmision) INCLUDE (claveAcceso)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Compra_Documento_Detalle')   
    DROP INDEX IX_Compra_Documento_Detalle ON Recepcion.DocumentoDetalle;
GO  
CREATE NONCLUSTERED INDEX IX_Compra_Documento_Detalle ON Recepcion.DocumentoDetalle(idDocumento, idBodega, idArticulo, idMedida, codigoPrincipal)
GO