use [AcontPlus]
go 

INSERT INTO Inventario.Stock(idArticulo,idBodega,cantidad,idUsuario,lastUpdate)
SELECT a.idArticulo, bo.idBodega,stock = dbo.AFTStockBodega(a.idArticulo,bo.idBodega),a.idUsuario,GETDATE()
FROM dbo.Articulo a 
INNER JOIN dbo.Entidad e ON e.idEntidad = a.idEntidad
INNER JOIN sri.Establecimiento eS on es.ruc = e.ruc
INNER JOIN dbo.Bodega bo  ON bo.codEstab = es.codEstab
WHERE a.llevaInventario = 1 and a.estado = 1 
and e.ruc = '0703386623001'

--select * from dbo.Bodega where ruc = '0703386623001'
