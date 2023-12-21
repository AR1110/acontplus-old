USE Acontplus   
GO  
--NUEVOS VALIDOS

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_DocumentoElectronico')   
    DROP INDEX IX_DocumentoElectronico ON dbo.DocumentoElectronico;  
GO 
	CREATE NONCLUSTERED INDEX IX_DocumentoElectronico ON dbo.DocumentoElectronico(codDoc, idDocumento, nroDocumento, numEstab, ptoEmision, idPuntoEmision, claveAcceso, fechaAutorizacion, codEstado);
GO
IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'UX_DocumentoElectronico_ClaveAcceso'
           AND object_id = OBJECT_ID(N'dbo.DocumentoElectronico', N'U'))   
   DROP INDEX UX_DocumentoElectronico_ClaveAcceso ON dbo.DocumentoElectronico;   
GO
CREATE UNIQUE INDEX UX_DocumentoElectronico_ClaveAcceso  
   ON dbo.DocumentoElectronico(claveAcceso);  
GO

IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'UX_DocumentoElectronico_CodigoAutorizacion'
           AND object_id = OBJECT_ID(N'dbo.DocumentoElectronico', N'U'))   
   DROP INDEX UX_DocumentoElectronico_CodigoAutorizacion ON dbo.DocumentoElectronico;   
GO  
CREATE UNIQUE INDEX UX_DocumentoElectronico_CodigoAutorizacion  
   ON dbo.DocumentoElectronico(codigoAutorizacion);  
GO