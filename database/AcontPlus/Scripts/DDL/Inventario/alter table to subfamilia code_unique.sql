use acontplus
go

drop view Inventario.v_Subfamilia
go

alter table subfamilia add oldcode varchar(20) 
go
update SubFamilia set oldcode = codigo 
go
ALTER TABLE dbo.SubFamilia ALTER COLUMN codigo VARCHAR(36) NOT NULL
go
UPDATE dbo.SubFamilia WITH (ROWLOCK) SET codigo = newid()
go 
DROP INDEX UQ__SubFamil__40F9A206E518BCA9 ON dbo.SubFamilia   ;  
GO 
ALTER TABLE dbo.subfamilia ALTER COLUMN codigo UNIQUEIDENTIFIER NOT NULL
go
SELECT TOP 10 * FROM dbo.SubFamilia WITH (NOLOCK)

