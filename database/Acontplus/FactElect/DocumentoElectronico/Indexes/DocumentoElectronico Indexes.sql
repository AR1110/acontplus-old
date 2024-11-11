USE Acontplus   
GO 


IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_EstadoServicio_Codigo')   
    DROP INDEX idx_EstadoServicio_Codigo ON FactElect.EstadoServicio;  
GO

UPDATE STATISTICS FactElect.EstadoServicio;
GO

CREATE NONCLUSTERED INDEX idx_EstadoServicio_Codigo
ON FactElect.EstadoServicio (idEstadoServicio, codigo);
GO

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_Filtering')   
    DROP INDEX idx_DocumentoElectronico_Filtering ON dbo.DocumentoElectronico;  
GO

CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_Filtering
ON dbo.DocumentoElectronico (idEstadoServicio, idTipoDocumento, idDocumentoElectronico, idPuntoEmision, customerId, idUsuario)
INCLUDE (xmlAcontPlus, fechaEmision, isAutomatic, nroDocumento, claveAcceso, fechaAutorizacion, versionComp);
GO

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_Pending')   
    DROP INDEX idx_DocumentoElectronico_Pending ON dbo.DocumentoElectronico;  
GO
CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_Pending
ON dbo.DocumentoElectronico (idDocumentoElectronico, idTipoDocumento, idPuntoEmision, customerId, idUsuario)
INCLUDE (xmlAcontPlus, fechaEmision, isAutomatic, nroDocumento, claveAcceso, fechaAutorizacion, versionComp)
WHERE idEstadoServicio = 2;
GO
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_Authorized')   
    DROP INDEX idx_DocumentoElectronico_Authorized ON dbo.DocumentoElectronico;  
GO

CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_Authorized
ON dbo.DocumentoElectronico (idDocumentoElectronico, idTipoDocumento, idPuntoEmision, customerId, idUsuario)
INCLUDE (xmlAcontPlus, fechaEmision, isAutomatic, nroDocumento, claveAcceso, fechaAutorizacion, versionComp)
WHERE idEstadoServicio = 5;

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_Canceled')   
    DROP INDEX idx_DocumentoElectronico_Canceled ON dbo.DocumentoElectronico;  
GO

CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_Canceled
ON dbo.DocumentoElectronico (idDocumentoElectronico, idTipoDocumento, idPuntoEmision, customerId, idUsuario)
INCLUDE (xmlAcontPlus, fechaEmision, isAutomatic, nroDocumento, claveAcceso, fechaAutorizacion, versionComp)
WHERE idEstadoServicio = 7;

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_NonAuthorized')   
    DROP INDEX idx_DocumentoElectronico_NonAuthorized ON dbo.DocumentoElectronico;  
GO
CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_NonAuthorized
ON dbo.DocumentoElectronico (idDocumentoElectronico, idTipoDocumento, idPuntoEmision, customerId, idUsuario)
INCLUDE (xmlAcontPlus, fechaEmision, isAutomatic, nroDocumento, claveAcceso, fechaAutorizacion, versionComp)
WHERE idEstadoServicio = 9;
GO

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_PtoEmision')   
    DROP INDEX idx_DocumentoElectronico_PtoEmision ON dbo.DocumentoElectronico;  
GO
CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_PtoEmision
ON dbo.DocumentoElectronico (idPuntoEmision)
INCLUDE (claveAcceso, fechaEmision, fechaAutorizacion, idUsuario, versionComp, customerId, idEstadoServicio, idTipoDocumento, serieComprobante)
GO

UPDATE STATISTICS dbo.DocumentoElectronico WITH FULLSCAN;
GO

ALTER INDEX ALL ON dbo.DocumentoElectronico REBUILD;
GO
