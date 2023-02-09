--DECLARE @table TABLE (id INT IDENTITY(1,1), idMarca INT UNIQUE)

--INSERT INTO @table (idMarca)
--select idMarca from dbo.Marca ORDER BY idMarca ASC

--update ma set 
--	ma.codigo = 'MA'+Helper.F_Auto_Sequential(t.id)
--from Marca ma 
--inner join  @table t on t.idMarca = ma.idMarca

select * from dbo.Marca