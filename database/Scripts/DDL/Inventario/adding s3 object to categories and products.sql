USE Acontplus
GO 

ALTER TABLE dbo.subfamilia ADD s3ObjectKey VARCHAR(500) NULL
GO

--EXEC sp_rename 'dbo.SubFamilia.ImgUrl', 's3ObjectUrl', 'COLUMN';
GO

ALTER TABLE dbo.subfamilia  ADD s3ObjectUrl VARCHAR(800) NULL
GO 

ALTER TABLE dbo.articulo ADD s3ObjectKey VARCHAR(500) NULL
GO

--EXEC sp_rename 'dbo.Articulo.ImgUrl', 's3ObjectUrl', 'COLUMN';
GO

ALTER TABLE dbo.articulo add s3ObjectUrl VARCHAR(800) NULL

GO