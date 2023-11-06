USE Acontplus;
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Usuario')   
    DROP INDEX IX_Usuario ON dbo.Usuario;  
GO
CREATE NONCLUSTERED INDEX IX_Usuario ON dbo.Usuario(nombreUsuario, contrasenia)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Usuario_Rol')   
    DROP INDEX IX_Usuario_Rol ON App.UsuarioRol;  
GO
CREATE NONCLUSTERED INDEX IX_Usuario_Rol ON App.UsuarioRol(idUsuario, idEntidad, ruc, codRol)
GO

