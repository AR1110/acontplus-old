use [Acontplus]
go 


INSERT INTO Inventario.TransaccionTemp
  (TipoTransaccionId,ProductId ,BodegaId,TipoDocumentoId,DocumentoId,MedidaId,TarifaId,Cantidad,CantidadStock,PrecioUnitario,PrecioCosto,Total,FechaRegistro,idUsuario,estado,Accion)

select idTipoTransaccion,idArticulo,idBodega,idTipoDocumento,idDocumento,idMedida,idTarifa,cantidadSalida, cantidadSalida * -1,precioUnitario,precioCosto,total,fechaRegistro,idUsuario
,CASE estado when 2 then 0
		     when 0 then 0
			 when 1 then 2 
 end 
,CASE estado when 2 then 'R' 
			 WHEN 0 THEN 'R'
 end

from Inventario.v_Articulo_Transaccion where codDoc in ('FE','NE') AND codTransaccion = 'S'

select * from Inventario.TransaccionTemp

