USE AcontPlus;  
GO
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_EntidadId')   
    DROP INDEX IX_Factura_EntidadId ON Factura;  
GO
CREATE NONCLUSTERED INDEX IX_Factura_EntidadId
    ON Factura(idEntidad);   
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_PuntoEmisionId')   
    DROP INDEX IX_Factura_PuntoEmisionId ON Factura;  
GO
CREATE NONCLUSTERED INDEX IX_Factura_PuntoEmisionId
    ON Factura(idPuntoEmision);   
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_TipoDocumentoId')   
    DROP INDEX IX_Factura_TipoDocumentoId ON Factura;  
GO
CREATE NONCLUSTERED INDEX IX_Factura_TipoDocumentoId
    ON Factura(idTipoDocumento);   
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_TiempoCreditoId')   
    DROP INDEX IX_Factura_TiempoCreditoId ON Factura;  
GO
CREATE NONCLUSTERED INDEX IX_Factura_TiempoCreditoId
    ON Factura(idTiempoCredito);   
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_EstadoPagoId')   
    DROP INDEX IX_Factura_EstadoPagoId ON Factura;  
GO
CREATE NONCLUSTERED INDEX IX_Factura_EstadoPagoId
    ON Factura(idEstadoPago);   
GO 
