use [AcontPlus]
go

--DECLARE @table TABLE (id INT IDENTITY(1,1), idModelo INT UNIQUE)

--INSERT INTO @table (idModelo)
--select idModelo from dbo.Modelo ORDER BY idModelo ASC

--update mo set 
--	mo.codigo = 'MO'+Helper.F_Auto_Sequential(t.id)
--from Modelo mo 
--inner join  @table t on t.idModelo = mo.idModelo

select * from dbo.Modelo