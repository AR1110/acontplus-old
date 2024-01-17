use [Acontplus]
go 

--ALTER TABLE dbo.Articulo ADD  fechaUltimoCosto DATETIME2

select top 1  * from dbo.Articulo 

update ar  set  
		fechaUltimoCosto = (SELECT TOP 1 tr.fechaRegistro 
							FROM Inventario.Transaccion tr
							INNER JOIN Inventario.TipoDocumento td ON td.idTipoDocumento = tr.idTipoDocumento
							INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
							WHERE td.estado = 1
							  and tt.codigo = 'E'
							  and td.codigo in ('fe','ff','lc','iv')
							  and tr.idArticulo = ar.idArticulo
							ORDER BY tr.fechaRegistro DESC) 

FROM Articulo ar WHERE ar.llevaInventario = 1

select * from Articulo where fechaUltimoCosto is not null

alter table Inventario.Stock drop column fechaUltimoCosto

alter table Inventario.Stock drop column ultimoCosto

select * from Inventario.Stock