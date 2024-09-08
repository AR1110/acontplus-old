use Acontplus
go

--UPDATE Restaurant.Item set productionAreaId = NULL where ProductionAreaId is not null
--GO

--DELETE FROM Restaurant.ProductionArea
--GO

update f set f.EstablecimientoId = e.idEstablecimiento
from restaurant.[floor] f 
inner join sri.establecimiento e on f.codestab = e.codestab
go 

update f set f.EstablecimientoId = e.idEstablecimiento
from restaurant.Promotion f 
inner join sri.establecimiento e on f.codestab = e.codestab

DROP PROC IF EXISTS Restaurant.Ingredient_Update