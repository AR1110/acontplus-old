use [AcontPlus]
go 

insert into Inventario.Stock(idArticulo,idBodega,cantidad,idUsuario,lastUpdate)
select a.idArticulo, bo.idBodega,stock = dbo.AFTStockBodega(a.idArticulo,bo.idBodega),a.idUsuario,GETDATE()
from dbo.Articulo a
INNER JOIN dbo.Entidad e ON e.idEntidad = a.idEntidad
inner join sri.Establecimiento eS on es.ruc = e.ruc
INNER JOIN dbo.Bodega bo ON bo.codEstab = es.codEstab
where a.llevaInventario = 1 and a.estado = 1