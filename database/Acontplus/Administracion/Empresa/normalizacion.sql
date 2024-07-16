use [Acontplus]
go


--ALTER TABLE Administrador.Empresa ADD CustomerId INT CONSTRAINT FK_Empresa_Customer FOREIGN KEY(CustomerId)REFERENCES Customer.Customer(Id)

--ALTER TABLE Administrador.Empresa ADD [UpdatedAt] DATETIME2

--ALTER TABLE Administrador.Empresa ADD CONSTRAINT FK_Entidad_Empresa FOREIGN KEY(idEntidad)REFERENCES dbo.Entidad(idEntidad)

--ALTER TABLE Administrador.Empresa ADD CONSTRAINT FK_Usuario_Empresa FOREIGN KEY(idUsuario)REFERENCES dbo.Usuario(idUsuario)



--update e set
--      e.CustomerId = (select top 1 c.Id from Customer.Customer c where c.IDCard = e.ruc)
--from Administrador.Empresa e

--ALTER TABLE Administrador.Empresa ALTER COLUMN CustomerId INT NOT NULL

--ALTER TABLE Administrador.Empresa ALTER COLUMN idEntidad INT NOT NULL

select * from Administrador.Empresa

--INSERT INTO [Customer].[Customer]
--           ([IDType]
--           ,[IDCard]
--           ,[BusinessName]
--           ,[TradeName]
--           ,[Email]
--           ,[Telephone]
--           ,[Address]
--           ,[SriValidation]
--           ,[CreatedAt])
--SELECT '04',ruc,razonSocial,nombreComercial,null,null,null,1,GETDATE() FROM Administrador.Empresa where CustomerId IS NULL

--ALTER TABLE Administrador.Empresa DROP CONSTRAINT UQ__Empresa__C2B74E6162BF3B1B

--ALTER TABLE Administrador.Empresa DROP COLUMN ruc

--ALTER TABLE Administrador.Empresa DROP COLUMN razonSocial

--ALTER TABLE Administrador.Empresa DROP COLUMN nombreComercial

--ALTER TABLE Administrador.Empresa ADD telefono VARCHAR(800)

--ALTER TABLE Administrador.Empresa ADD correo VARCHAR(800)

--ALTER TABLE Administrador.Empresa ADD direccion VARCHAR(800)
