use [AcontPlus]
go

--DECLARE @table TABLE (id INT IDENTITY(1,1), idSubFamilia INT UNIQUE)

--INSERT INTO @table (idSubFamilia)
--select idSubFamilia from dbo.SubFamilia ORDER BY idSubFamilia ASC

--update sm set 
--	sm.codigo = 'F'+Helper.F_Auto_Sequential(t.id)
--from SubFamilia sm 
--inner join  @table t on sm.idSubFamilia = t.idSubFamilia

select * from dbo.SubFamilia