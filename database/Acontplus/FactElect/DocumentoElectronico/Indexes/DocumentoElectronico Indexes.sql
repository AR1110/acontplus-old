USE Acontplus   
GO  
--NUEVOS VALIDOS

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_DocumentoElectronico')   
    DROP INDEX IX_DocumentoElectronico ON dbo.DocumentoElectronico;  
GO 
	--CREATE NONCLUSTERED INDEX IX_DocumentoElectronico ON dbo.DocumentoElectronico(codDoc, idDocumento, nroDocumento, claveAcceso, fechaAutorizacion, idEstadoServicio);
GO
IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'UX_DocumentoElectronico_ClaveAcceso'
           AND object_id = OBJECT_ID(N'dbo.DocumentoElectronico', N'U'))   
   DROP INDEX UX_DocumentoElectronico_ClaveAcceso ON dbo.DocumentoElectronico;   
GO
--CREATE UNIQUE INDEX UX_DocumentoElectronico_ClaveAcceso  
--   ON dbo.DocumentoElectronico(claveAcceso);  
--GO

IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'UX_DocumentoElectronico_CodigoAutorizacion'
           AND object_id = OBJECT_ID(N'dbo.DocumentoElectronico', N'U'))   
   DROP INDEX UX_DocumentoElectronico_CodigoAutorizacion ON dbo.DocumentoElectronico;   
GO  
--CREATE UNIQUE INDEX UX_DocumentoElectronico_CodigoAutorizacion  
--   ON dbo.DocumentoElectronico(codigoAutorizacion);  
GO

 --UPDATE STATISTICS dbo.DocumentoElectronico WITH FULLSCAN;

ALTER INDEX ALL ON dbo.DocumentoElectronico REBUILD;

GO

---- Index on EstadoServicio table
--CREATE NONCLUSTERED INDEX idx_EstadoServicio_Codigo
--ON FactElect.EstadoServicio (codigo);

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_DocumentoElectronico_Filtering')   
    DROP INDEX idx_DocumentoElectronico_Filtering ON dbo.DocumentoElectronico;  
GO 
CREATE NONCLUSTERED INDEX idx_DocumentoElectronico_Filtering
ON dbo.DocumentoElectronico (idEstadoServicio, isAutomatic, idDocumentoElectronico, idEntidad, idPuntoEmision, customerId, idUsuario)
INCLUDE (xmlAcontPlus, codDoc, fechaEmision, idDocumento, nroDocumento, claveAcceso, fechaAutorizacion, versionComp);
GO