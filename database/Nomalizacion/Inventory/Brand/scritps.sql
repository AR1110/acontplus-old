use [Acontplus]
go 

CREATE TABLE Inventory.Brand
(
   Id BIGINT IDENTITY(1,1) PRIMARY KEY
  ,CompanyId INT NULL CONSTRAINT FK_Brand_Company_CompanyId FOREIGN KEY (CompanyId) REFERENCES dbo.Entidad(idEntidad)
  ,Code NVARCHAR(20) NOT NULL CONSTRAINT UQ_Brand_Code UNIQUE (Code)
  ,[Description] NVARCHAR(300) NOT NULL
  ,IsExternallySourced BIT NOT NULL CONSTRAINT DF_Brand_IsExternallySourced DEFAULT 0 
  ,CreatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_Brand_CreatedAt DEFAULT GETUTCDATE()
  ,CreatedByUserId INT NULL CONSTRAINT FK_Brand_User_CreatedByUserId FOREIGN KEY (CreatedByUserId) REFERENCES dbo.Usuario(idUsuario)
  ,UpdatedAt DATETIME2(7) NULL
  ,UpdatedByUserId INT NULL CONSTRAINT FK_Brand_User_UpdatedByUserId FOREIGN KEY (UpdatedByUserId) REFERENCES dbo.Usuario(idUsuario)
  ,IsActive BIT NOT NULL CONSTRAINT DF_Brand_IsActive DEFAULT 1
  ,IsDeleted BIT NOT NULL CONSTRAINT DF_Brand_IsDeleted DEFAULT 0
  ,DeletedAt DATETIME2(7) NULL
  ,DeletedByUserId INT NULL CONSTRAINT FK_Brand_User_DeletedByUserId FOREIGN KEY (DeletedByUserId) REFERENCES dbo.Usuario(idUsuario)
  ,IsMobileRequest BIT NOT NULL CONSTRAINT DF_Brand_IsMobileRequest DEFAULT 0
)

SELECT * FROM Inventory.Brand

--insert into Inventory.Brand([CompanyId],[Code],[Description],[IsExternallySourced],[CreatedAt],[CreatedByUserId],IsActive,IsDeleted)
--select idEntidad 
--     ,codigo
--     ,descripcion
--     ,importacion
--     ,fechaRegistro
--     ,(select top 1 us.idUsuario from Usuario us where us.idUsuario = ma.idUsuario)
--     ,estado
--     ,iif(estado =1,0,1)
--from dbo.Marca ma
