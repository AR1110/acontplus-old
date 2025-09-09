USE AcontPlus
GO
CREATE OR ALTER VIEW Inventario.v_Articulo_Transaccion WITH SCHEMABINDING AS (
	SELECT ts.idTransaccion
		  ,ts.idTipoDocumento
          ,ts.idTipoTransaccion
          ,ts.idDocumento
          ,ts.idUsuario
		  ,ts.fechaRegistro 
		  ,ts.fechaEmision 
          ,dt.estado
		  ,dt.idArticulo
		  ,dt.idBodega
          ,dt.idMedida
          ,dt.idTarifa
          ,dt.precioCosto
		  ,dt.precioUnitario
          ,dt.total
		  ,IIF(mt.Code =  'E' OR mt.Code = 'A',dt.cantidad,0)            as cantidadEntrada 
		  ,IIF(mt.Code =  'S',dt.cantidad,0)                             as cantidadSalida 
          ,IIF(mt.Code =  'E' OR mt.Code = 'A',dt.cantidadTransaccion,0) as stockEntrada 
		  ,IIF(mt.Code =  'S',dt.cantidadTransaccion,0)                  as stockSalida 
          ,cantidadTransaccion
		  ,td.codigo                                                     as codDoc
		  ,mt.Code                                                       as codMovimiento
	FROM Inventario.Transaccion              ts WITH (NOLOCK) 
    INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = ts.idTransaccion
	INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = ts.idTipoDocumento
	INNER JOIN Inventario.MovementType       mt WITH (NOLOCK) ON mt.Id                = dt.MovementTypeId	 
 )
