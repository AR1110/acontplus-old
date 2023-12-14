use [AcontPlus]
go

DECLARE @table TABLE (id INT IDENTITY(1,1), idMedida INT UNIQUE)

INSERT INTO @table (idMedida)
select idMedida from dbo.Medida ORDER BY idMedida ASC

--update m set 
--	m.codigo = 'ME'+Helper.F_Auto_Sequential(t.id)
--from Medida m 
--inner join  @table t on t.idMedida = m.idMedida

select * from dbo.Medida