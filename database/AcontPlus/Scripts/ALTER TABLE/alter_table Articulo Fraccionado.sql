USE [AcontPlus]

ALTER TABLE dbo.ArticuloFraccionado add codigo as CAST(idArticulo as varchar)+CONVERT(varchar,fechaRegistro,12) 
