use [AcontPlus]
go
--alter table dbo.SubFamilia ALTER COLUMN codigo VARCHAR(20) NOT NULL
--ALTER TABLE dbo.SubFamilia ADD UNIQUE (codigo)

select * from dbo.SubFamilia