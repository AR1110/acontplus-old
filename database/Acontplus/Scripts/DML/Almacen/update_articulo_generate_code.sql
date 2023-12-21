use [AcontPlus]
go

DECLARE @table TABLE (id INT IDENTITY(1,1), idArticulo INT UNIQUE)

INSERT INTO @table (idArticulo)
select idArticulo from dbo.Articulo ORDER BY idArticulo ASC

update a set 
	a.code_unique = 'A'+Helper.F_Auto_Sequential(t.id)
from Articulo a 
inner join  @table t on a.idArticulo = t.idArticulo

select id, idArticulo from @table ORDER BY id asc