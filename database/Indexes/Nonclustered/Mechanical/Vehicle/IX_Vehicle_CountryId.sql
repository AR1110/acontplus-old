USE [Acontplus]
go 

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Vehicle_CountryId')   
    DROP INDEX IX_Vehicle_CountryId ON Mechanical.Vehicle;  
GO
CREATE NONCLUSTERED INDEX IX_Vehicle_CountryId
    ON Mechanical.Vehicle(CountryId);   
GO