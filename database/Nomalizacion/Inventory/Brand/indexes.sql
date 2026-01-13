use [Acontplus]
go

CREATE NONCLUSTERED INDEX IX_Brand_CompanyId_Code
ON Inventory.Brand (CompanyId, Code)
WHERE IsDeleted = 0;

CREATE NONCLUSTERED INDEX IX_Brand_IsActive
ON Inventory.Brand (IsActive)
INCLUDE (Code, [Description])
WHERE IsDeleted = 0 AND IsActive = 1;



