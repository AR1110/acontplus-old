USE master
GO
CREATE DATABASE AcontplusHist
GO

USE AcontplusHist
GO
CREATE SCHEMA FactElect
GO
CREATE TABLE FactElect.DocumentoElectronico(
	Id INT NOT NULL CONSTRAINT pk_Documento_Electronico PRIMARY KEY  IDENTITY(1,1)
    ,Ambiente INT NOT NULL
    ,AutomaticSriAuth BIT NOT NULL
    ,CompanyId INT NOT NULL
    ,ClaveAcceso VARCHAR(49) NOT NULL
    ,CodDoc VARCHAR(2) NOT NULL
    ,CodEstado INT NOT NULL
    ,ComprobanteId INT NOT NULL
    ,EstablecimientoId INT NOT NULL
    ,Estab  VARCHAR(3)
    ,FechaEmision DATETIME2 NOT NULL
    ,FechaAutorizacion DATETIME2 NULL
    ,CustomerId INT NOT NULL
    ,PuntoEmisionId INT NOT NULL
    ,PtoEmi VARCHAR(3)
    ,Secuencial INT NOT NULL
    ,VersionComp VARCHAR(5) NOT NULL
    ,XmlSri XML NULL
    ,CreatedAt DATETIME2 NOT NULL
    ,UpdatedAt DATETIME2 NULL
    ,UserId INT NULL
)
GO

IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'UI_DocumentoElectronico_ClaveAcceso'
           AND object_id = OBJECT_ID(N'FactElect.DocumentoElectronico', N'U'))   
   DROP INDEX UI_DocumentoElectronico_ClaveAcceso ON FactElect.DocumentoElectronico;   
GO
CREATE UNIQUE INDEX UI_DocumentoElectronico_ClaveAcceso  
   ON FactElect.DocumentoElectronico(claveAcceso);  
GO