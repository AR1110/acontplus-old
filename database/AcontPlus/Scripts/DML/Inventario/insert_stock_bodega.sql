use [AcontPlus]
go 

--insert into Inventario.Stock(idArticulo,idBodega,cantidad,idUsuario,lastUpdate)
--select a.idArticulo, bo.idBodega,0,a.idUsuario,GETDATE()
--from dbo.Articulo a WITH (NOLOCK)
--INNER JOIN dbo.Entidad e WITH (NOLOCK) ON e.idEntidad = a.idEntidad
--inner join sri.Establecimiento eS WITH (NOLOCK) on es.ruc = e.ruc
--INNER JOIN dbo.Bodega bo WITH (NOLOCK) ON bo.codEstab = es.codEstab
--where a.llevaInventario = 1 and a.estado = 1 