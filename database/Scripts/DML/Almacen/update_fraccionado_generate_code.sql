--USE [AcontPlus]
--go

--DECLARE @table TABLE (id INT IDENTITY(1,1), idArticuloFraccionado INT UNIQUE)

--INSERT INTO @table (idArticuloFraccionado)
--select idArticuloFraccionado from dbo.ArticuloFraccionado ORDER BY idArticuloFraccionado ASC

--update a set 
--	a.codigo = 'F'+Helper.F_Auto_Sequential(t.id)
--   ,uniqueId = NEWID()
--from ArticuloFraccionado a 
--inner join @table t on a.idArticuloFraccionado = t.idArticuloFraccionado

select id, idArticuloFraccionado from @table ORDER BY id asc