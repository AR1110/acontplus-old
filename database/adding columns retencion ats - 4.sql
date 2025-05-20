--USE Acontplus
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'idUsuario'
--        AND Object_ID = Object_ID(N'FactElect.RetAtsDocSustento')
--)
--BEGIN
--	ALTER TABLE FactElect.RetAtsDocSustento 
--	ADD idUsuario INT NULL CONSTRAINT rat_doc_sustento_user FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'fechaRegistro'
--        AND Object_ID = Object_ID(N'FactElect.RetAtsDocSustento')
--)
--BEGIN
--	ALTER TABLE FactElect.RetAtsDocSustento 
--	ADD fechaRegistro DATETIME2 NULL CONSTRAINT rat_doc_sustento_created_at DEFAULT GETDATE()
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'idUsuario'
--        AND Object_ID = Object_ID(N'FactElect.RetAtsImpDocSustento')
--)
--BEGIN
--	ALTER TABLE FactElect.RetAtsImpDocSustento 
--	ADD idUsuario INT NULL CONSTRAINT rat_tax_user FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'fechaRegistro'
--        AND Object_ID = Object_ID(N'FactElect.RetAtsImpDocSustento')
--)
--BEGIN
--	ALTER TABLE FactElect.RetAtsImpDocSustento 
--	ADD fechaRegistro DATETIME2 NULL CONSTRAINT rat_tax_created_at DEFAULT GETDATE()
--END
--GO


--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'idUsuario'
--        AND Object_ID = Object_ID(N'FactElect.RetAtsInfoAdicional')
--)
--BEGIN
--	ALTER TABLE FactElect.RetAtsInfoAdicional 
--	ADD idUsuario INT NULL CONSTRAINT rat_info_adicional_user FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'fechaRegistro'
--        AND Object_ID = Object_ID(N'FactElect.RetAtsInfoAdicional')
--)
--BEGIN
--	ALTER TABLE FactElect.RetAtsInfoAdicional 
--	ADD fechaRegistro DATETIME2 NULL CONSTRAINT rat_info_adicional_created_at DEFAULT GETDATE()
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'idUsuario'
--        AND Object_ID = Object_ID(N'FactElect.RetencionAtsPago')
--)
--BEGIN
--	ALTER TABLE FactElect.RetencionAtsPago 
--	ADD idUsuario INT NULL CONSTRAINT rat_payment_user FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'fechaRegistro'
--        AND Object_ID = Object_ID(N'FactElect.RetencionAtsPago')
--)
--BEGIN
--	ALTER TABLE FactElect.RetencionAtsPago 
--	ADD fechaRegistro DATETIME2 NULL CONSTRAINT rat_payment_created_at DEFAULT GETDATE()
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'idUsuario'
--        AND Object_ID = Object_ID(N'FactElect.RetencionAtsRet')
--)
--BEGIN
--	ALTER TABLE FactElect.RetencionAtsRet 
--	ADD idUsuario INT NULL CONSTRAINT rat_retencion_user FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)
--END
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns
--    WHERE Name = N'fechaRegistro'
--        AND Object_ID = Object_ID(N'FactElect.RetencionAtsRet')
--)
--BEGIN
--	ALTER TABLE FactElect.RetencionAtsRet 
--	ADD fechaRegistro DATETIME2 NULL CONSTRAINT rat_retencion_created_at DEFAULT GETDATE()
--END
--GO

--UPDATE ds SET ds.idUsuario = r.idUsuario
--,ds.fechaRegistro = r.fechaRegistro

--FROM FactElect.RetAtsDocSustento ds
--    INNER JOIN FactElect.RetencionAts r ON ds.idRetencionAts = r.idRetencionAts

--GO

--UPDATE ds SET ds.idUsuario = r.idUsuario
--,ds.fechaRegistro = r.fechaRegistro

--FROM FactElect.RetAtsImpDocSustento ds
--    INNER JOIN FactElect.RetencionAts r ON ds.idRetencionAts = r.idRetencionAts

--GO

--UPDATE ds SET ds.idUsuario = r.idUsuario
--,ds.fechaRegistro = r.fechaRegistro

--FROM FactElect.RetAtsInfoAdicional ds
--    INNER JOIN FactElect.RetencionAts r ON ds.idRetencionAts = r.idRetencionAts

--GO

--UPDATE ds SET ds.idUsuario = r.idUsuario
--,ds.fechaRegistro = r.fechaRegistro

--FROM FactElect.RetencionAtsPago ds
--    INNER JOIN FactElect.RetencionAts r ON ds.idRetencionAts = r.idRetencionAts

--GO

--UPDATE ds SET ds.idUsuario = r.idUsuario
--,ds.fechaRegistro = r.fechaRegistro

--FROM FactElect.RetencionAtsRet ds
--    INNER JOIN FactElect.RetencionAts r ON ds.idRetencionAts = r.idRetencionAts

--GO

--ALTER TABLE FactElect.RetAtsDocSustento ALTER COLUMN idUsuario INT NOT NULL
--GO
--ALTER TABLE FactElect.RetAtsDocSustento ALTER COLUMN fechaRegistro DATETIME2 NOT NULL
--GO

--ALTER TABLE FactElect.RetAtsImpDocSustento ALTER COLUMN idUsuario INT NOT NULL
--GO
--ALTER TABLE FactElect.RetAtsImpDocSustento ALTER COLUMN fechaRegistro DATETIME2 NOT NULL
--GO

--ALTER TABLE FactElect.RetAtsInfoAdicional ALTER COLUMN idUsuario INT NOT NULL
--GO
--ALTER TABLE FactElect.RetAtsInfoAdicional ALTER COLUMN fechaRegistro DATETIME2 NOT NULL
--GO

--ALTER TABLE FactElect.RetencionAtsPago ALTER COLUMN idUsuario INT NOT NULL
--GO
--ALTER TABLE FactElect.RetencionAtsPago ALTER COLUMN fechaRegistro DATETIME2 NOT NULL
--GO

--ALTER TABLE FactElect.RetencionAtsRet ALTER COLUMN idUsuario INT NOT NULL
--GO
--ALTER TABLE FactElect.RetencionAtsRet ALTER COLUMN fechaRegistro DATETIME2 NOT NULL
--GO