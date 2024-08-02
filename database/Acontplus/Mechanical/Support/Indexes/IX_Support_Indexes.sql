USE [Acontplus]
go 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Support_CustomerId')   
    DROP INDEX IX_Support_CustomerId ON Mechanical.Support;  
GO
CREATE NONCLUSTERED INDEX IX_Support_CustomerId
    ON Mechanical.Support(CustomerId);   
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Support_PuntoEmisionId')   
    DROP INDEX IX_Support_PuntoEmisionId ON Mechanical.Support;  
GO
CREATE NONCLUSTERED INDEX IX_Support_PuntoEmisionId
    ON Mechanical.Support(PuntoEmisionId);   
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Support_UserAssignedId')   
    DROP INDEX IX_Support_UserAssignedId ON Mechanical.Support;  
GO
CREATE NONCLUSTERED INDEX IX_Support_UserAssignedId
    ON Mechanical.Support(UserAssignedId);   
GO