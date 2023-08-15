IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_VehicleCompany_CustomerId')   
    DROP INDEX IX_VehicleCompany_CustomerId ON Mechanical.VehicleCompany;  
GO
CREATE NONCLUSTERED INDEX IX_VehicleCompany_CustomerId
    ON Mechanical.VehicleCompany(CustomerId);   
GO