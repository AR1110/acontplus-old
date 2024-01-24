use [Acontplus]
go 

INSERT INTO [Inventario].[ProductPhoto]( [ProductId], [S3ObjectKey], [S3ObjectUrl], [IsDefault], [CreatedAt] ,[Enabled], [UserId] )  
select idArticulo, [S3ObjectKey], [S3ObjectUrl],1,fechaRegistro,estado,idUsuario from dbo.articulo where s3ObjectKey is not null and s3ObjectUrl is not null

INSERT INTO [Inventario].[SubcategoryPhoto] ([SubcategoryId], [S3ObjectKey], [S3ObjectUrl], [IsDefault], [CreatedAt] ,[Enabled], [UserId] ) 
select idSubfamilia, [S3ObjectKey], [S3ObjectUrl],1,fechaRegistro,estado,idUsuario from subfamilia where s3ObjectKey is not null and s3ObjectUrl is not null

ALTER TABLE dbo.Articulo DROP COLUMN IF EXISTS S3ObjectKey
ALTER TABLE dbo.Articulo DROP COLUMN IF EXISTS S3ObjectUrl

ALTER TABLE dbo.subfamilia DROP COLUMN IF EXISTS S3ObjectKey;
ALTER TABLE dbo.subfamilia DROP COLUMN IF EXISTS S3ObjectUrl;

ALTER TABLE Inventario.ProductPhoto ADD constraint fk_article_pp FOREIGN KEY (ProductId) REFERENCES dbo.Articulo (idArticulo)

ALTER TABLE Inventario.SubcategoryPhoto ADD constraint fk_subf_sp FOREIGN KEY (SubcategoryId) REFERENCES dbo.Subfamilia (idSubfamilia)

