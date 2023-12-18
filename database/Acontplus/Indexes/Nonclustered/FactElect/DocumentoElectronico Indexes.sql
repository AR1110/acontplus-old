USE Acontplus   
GO  
---ELIMINAR
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Doc_Elect_IdPuntoEmision')   
    DROP INDEX IX_Doc_Elect_IdPuntoEmision ON DocumentoElectronico;  
GO  

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Doc_Elect_IdEntidad')   
    DROP INDEX IX_Doc_Elect_IdEntidad ON DocumentoElectronico;  
GO  

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Doc_Elect_FechaAut')   
    DROP INDEX IX_Doc_Elect_FechaAut ON DocumentoElectronico;  
GO  

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Doc_Elect_FechaAut')   
    DROP INDEX IX_Doc_Elect_FechaAut ON DocumentoElectronico;  
GO  

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Doc_Elect_CodDoc')   
    DROP INDEX IX_Doc_Elect_CodDoc ON DocumentoElectronico;  
GO  

--NUEVOS VALIDOS

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_DocumentoElectronico')   
    DROP INDEX IX_DocumentoElectronico ON dbo.DocumentoElectronico;  
GO 
	CREATE NONCLUSTERED INDEX IX_DocumentoElectronico ON dbo.DocumentoElectronico(codDoc, idDocumento, nroDocumento, idPuntoEmision, claveAcceso, fechaAutorizacion, codEstado);
GO

GO
ALTER TABLE dbo.DocumentoElectronico   
DROP CONSTRAINT UQ__Document__9916D765DE240B58;  
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