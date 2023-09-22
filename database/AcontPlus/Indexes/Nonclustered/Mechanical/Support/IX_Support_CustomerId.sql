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