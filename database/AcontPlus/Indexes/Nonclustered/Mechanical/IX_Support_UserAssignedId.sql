USE [Acontplus]
go 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Support_UserAssignedId')   
    DROP INDEX IX_Support_UserAssignedId ON Mechanical.Support;  
GO
CREATE NONCLUSTERED INDEX IX_Support_UserAssignedId
    ON Mechanical.Support(UserAssignedId);   
GO