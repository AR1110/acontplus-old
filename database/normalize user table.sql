--USE Acontplus
--GO
------ANALIZAR BIEN EN PRODUCCION ANTES DE EJECUTAR
-----*****
----select * from dbo.usuario where nombrecompleto is null
----select * from dbo.usuario where nroIdentificacion is null
----delete indexes usuario/indexes and views

--IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Usuario_Rol')   
--    DROP INDEX IX_Usuario_Rol ON App.UsuarioRol;  
--GO

--IF NOT EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'fechaRegistro' AND Object_ID = Object_ID(N'Usuario'))
--	BEGIN
--		ALTER TABLE Acontplus.dbo.Usuario ADD fechaRegistro DATETIME2 NULL; 
--	END
--GO

--IF EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'nroIdentificacion' AND Object_ID = Object_ID(N'dbo.Usuario'))
--BEGIN
--    update u SET u.nroIdentificacion = ur.nroIdentificacion 
--    FROM dbo.usuario u WITH(ROWLOCK)
--	    INNER JOIN App.UsuarioRol ur WITH(NOLOCK) ON u.idUsuario = ur.idUsuario
--    WHERE u.nroIdentificacion IS NULL OR LEN(LTRIM(RTRIM(u.nroIdentificacion))) = 0
--end
--GO

--UPDATE u SET u.fechaRegistro = ur.fechaRegistro
--FROM Acontplus.dbo.Usuario u WITH(ROWLOCK)
--INNER JOIN Acontplus.App.UsuarioRol ur ON u.idUsuario = ur.idUsuario
--WHERE u.fechaRegistro IS NULL
--GO

--ALTER TABLE App.UsuarioRol ALTER COLUMN idUsuario INT NOT NULL
--GO

--ALTER TABLE App.UsuarioRol ALTER COLUMN idEntidad INT NOT NULL
--GO
--IF NOT EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'fromMobile' AND Object_ID = Object_ID(N'App.UsuarioRol'))
--	BEGIN
--        ALTER TABLE Acontplus.App.UsuarioRol ADD fromMobile BIT NULL
--    END
--GO

--DECLARE @sql NVARCHAR(MAX);

--IF EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'codigo' AND Object_ID = Object_ID(N'App.UsuarioRol'))
--BEGIN
--    SET @sql = 'ALTER TABLE Acontplus.App.UsuarioRol DROP COLUMN codigo';
--    EXEC sp_executesql @sql;
--END
--GO



--IF NOT EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'firstName' AND Object_ID = Object_ID(N'Usuario'))
--	BEGIN
--		ALTER TABLE Acontplus.dbo.Usuario ADD firstName VARCHAR(150) NULL; 
--	END
--GO

--IF NOT EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'lastName' AND Object_ID = Object_ID(N'Usuario'))
--	BEGIN
--		ALTER TABLE Acontplus.dbo.Usuario ADD lastName VARCHAR(150) NULL; 
--	END
--GO

--IF NOT EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'customerId' AND Object_ID = Object_ID(N'Usuario'))
--	BEGIN
--		ALTER TABLE Acontplus.dbo.Usuario ADD customerId INT NULL; 
--	END
--GO
--IF EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'nroIdentificacion' AND Object_ID = Object_ID(N'dbo.Usuario'))
--BEGIN
--    UPDATE u SET u.customerId = c.Id
--    FROM Acontplus.dbo.Usuario u WITH(ROWLOCK)
--    INNER JOIN Acontplus.Customer.Customer c WITH(NOLOCK) ON LTRIM(RTRIM(u.nroIdentificacion)) = c.IDCard
--    WHERE customerId IS NULL
--END
--GO

--IF EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.Usuario  WHERE customerId IS NULL)
--	BEGIN
--    INSERT INTO Acontplus.Customer.Customer([IDType], [IDCard], [BusinessName], [Email], [CreatedAt])
--	    SELECT CASE WHEN LEN(LTRIM(RTRIM(u.nroIdentificacion))) = 10 THEN '05'
--			    WHEN LEN(LTRIM(RTRIM(u.nroIdentificacion))) = 13 THEN '04'
--			    ELSE '06'
--			    END,
--			    nroIdentificacion,
--			    nombreCompleto,
--			    correo,
--			    fechaRegistro
--	    FROM Acontplus.dbo.Usuario u 
--	    WHERE customerId IS NULL
--    END
--GO
--IF EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'nroIdentificacion' AND Object_ID = Object_ID(N'dbo.Usuario'))
--BEGIN
--    UPDATE u SET u.customerId = c.Id
--    FROM Acontplus.dbo.Usuario u WITH(ROWLOCK)
--    INNER JOIN Acontplus.Customer.Customer c WITH(NOLOCK) ON LTRIM(RTRIM(u.nroIdentificacion)) = c.IDCard
--    WHERE customerId IS NULL
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.foreign_keys
--    WHERE name = 'fk_customer_user'
--)
--BEGIN
--    ALTER TABLE Acontplus.dbo.Usuario
--    ADD CONSTRAINT fk_customer_user
--    FOREIGN KEY (customerId)
--    REFERENCES Acontplus.Customer.Customer(Id);
--END
--GO

--IF NOT EXISTS (SELECT 1 FROM Acontplus.dbo.usuario WHERE customerId IS NULL)
--    BEGIN
--        IF EXISTS (SELECT 1 
--                   FROM sys.columns 
--                   WHERE Name = N'nombreCompleto' AND Object_ID = Object_ID(N'dbo.Usuario'))
--        BEGIN
--             ALTER TABLE Acontplus.dbo.Usuario DROP COLUMN nombreCompleto;
--        END
--        IF EXISTS (SELECT 1 
--                   FROM sys.columns 
--                   WHERE Name = N'nroIdentificacion' AND Object_ID = Object_ID(N'dbo.Usuario'))
--        BEGIN
--             ALTER TABLE Acontplus.dbo.Usuario DROP COLUMN nroIdentificacion;
--        END
--    END
--GO

--IF EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'ruc' AND Object_ID = Object_ID(N'App.UsuarioRol'))
--BEGIN
--	ALTER TABLE Acontplus.App.UsuarioRol DROP column ruc
--END
--GO


--IF EXISTS (SELECT 1 
--           FROM sys.columns 
--           WHERE Name = N'nroIdentificacion' AND Object_ID = Object_ID(N'App.UsuarioRol'))
--BEGIN
--	ALTER TABLE Acontplus.App.UsuarioRol DROP column nroIdentificacion
--END
--GO


--IF EXISTS (
--    SELECT 1 FROM sys.default_constraints
--    WHERE parent_object_id = OBJECT_ID('Usuario')
--    AND parent_column_id = COLUMNPROPERTY(OBJECT_ID('Usuario'), 'fechaRegistro', 'fechaRegistro')
--    AND type = 'D' -- 'D' stands for Default constraint
--)
--BEGIN
--    ALTER TABLE Acontplus.dbo.Usuario 
--	ADD CONSTRAINT user_default_fr 
--	DEFAULT GETDATE() 
--	FOR fechaRegistro
--END
--GO

--DROP PROC IF EXISTS App.Usuario_Get
--GO

--DROP PROC IF EXISTS App.Usuario_Get_Search
--GO


--DROP PROC IF EXISTS App.Usuario_Insert
--GO

--DROP PROC IF EXISTS App.Usuario_Search
--GO

--DROP PROC IF EXISTS App.Usuario_Update
--GO

--DROP PROC IF EXISTS dbo.ASPTipoDocumentoGetAll
--GO

--DROP PROC IF EXISTS ASPGenerarNroDc
--GO

--DROP FUNCTION IF EXISTS AFTCodigoTipoDocumento
--GO

--DROP FUNCTION IF EXISTS AFTIdTipoDocumento
--GO

