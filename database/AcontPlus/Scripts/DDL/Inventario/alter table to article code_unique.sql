USE Acontplus
GO
ALTER TABLE dbo.Articulo ADD old_codArticulo VARCHAR(36) NULL
go
update dbo.Articulo SET old_codArticulo = code_unique
go
ALTER TABLE dbo.Articulo ALTER COLUMN code_unique VARCHAR(36) NOT NULL
GO
ALTER TABLE Ventas.Aprob_Document_Detailt ADD idArticulo INT NULL
GO
ALTER TABLE Ventas.Aprob_Document_Detailt ADD old_codArticulo VARCHAR(20) NULL
GO
UPDATE Ventas.Aprob_Document_Detailt SET old_codArticulo = codArticulo
GO
UPDATE vad SET vad.idArticulo = a.idArticulo  FROM Ventas.Aprob_Document_Detailt vad 
                                    JOIN (SELECT idArticulo, code_unique, old_codArticulo FROM dbo.Articulo WITH(NOLOCK) ) AS a ON vad.codArticulo = a.old_codArticulo
GO

UPDATE dbo.Articulo WITH (ROWLOCK) SET code_unique = newid()
GO
ALTER TABLE dbo.Articulo   
DROP CONSTRAINT UQ__Articulo__9AB98123691B77D8;  
GO 

ALTER TABLE dbo.Articulo ALTER COLUMN code_unique UNIQUEIDENTIFIER NOT NULL
GO


ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN codArticulo VARCHAR(36) NOT NULL
GO

UPDATE vad SET vad.codArticulo = CONVERT(VARCHAR(36), a.code_unique)  FROM Ventas.Aprob_Document_Detailt vad 
                                    JOIN (SELECT idArticulo, code_unique FROM dbo.Articulo WITH(NOLOCK) ) AS a ON vad.idArticulo = a.idArticulo

GO

ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN codArticulo UNIQUEIDENTIFIER NOT NULL
GO

select top 1 * from Ventas.Aprob_Document_Detailt

SELECT TOP 10 * FROM dbo.Articulo WITH (NOLOCK)
 

 