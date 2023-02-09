USE [AcontPlus]
GO
--alter table dbo.ArticuloFraccionado add codigo VARCHAR(20)
--alter table dbo.ArticuloFraccionado alter column codigo VARCHAR(20) NOT NULL
--alter table dbo.ArticuloFraccionado add unique(codigo)

--alter table dbo.ArticuloFraccionado add uniqueId VARCHAR(150) DEFAULT NEWID()
--alter table dbo.ArticuloFraccionado alter column uniqueId VARCHAR(150) NOT NULL
--alter table dbo.ArticuloFraccionado add unique(uniqueId)

select * from dbo.ArticuloFraccionado 