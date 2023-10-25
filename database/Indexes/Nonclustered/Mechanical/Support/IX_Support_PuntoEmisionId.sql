USE [Acontplus]
go 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Support_PuntoEmisionId')   
    DROP INDEX IX_Support_PuntoEmisionId ON Mechanical.Support;  
GO
CREATE NONCLUSTERED INDEX IX_Support_PuntoEmisionId
    ON Mechanical.Support(PuntoEmisionId);   
GO