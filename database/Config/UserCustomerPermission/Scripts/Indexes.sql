USE Acontplus
GO

IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_UserPermission')   
    DROP INDEX IX_UserPermission ON Config.UserPermission;  
GO 
	CREATE NONCLUSTERED INDEX IX_UserPermission
	ON Config.UserPermission (idUsuarioRol)
	INCLUDE (codModule, jsonPermission, estado);
GO