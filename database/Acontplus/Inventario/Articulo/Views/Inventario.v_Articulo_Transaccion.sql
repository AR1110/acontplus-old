USE AcontPlus
GO
CREATE OR ALTER VIEW Inventario.v_Articulo_Transaccion WITH SCHEMABINDING AS (
	SELECT ts.idTransaccion
		  ,ts.idTipoDocumento
          ,ts.idDocumento
		  ,ts.idTipoTransaccion
          ,ts.idUsuario
		  ,ts.fechaEmision as fechaRegistro
          ,dt.estado
		  ,dt.idArticulo
		  ,dt.idBodega
          ,dt.idMedida
          ,dt.idTarifa
          ,dt.precioCosto
		  ,dt.precioUnitario
          ,dt.total
		  ,IIF(tt.codigo =  'E' OR tt.codigo = 'A',dt.cantidad,0)            as cantidadEntrada 
		  ,IIF(tt.codigo =  'S',dt.cantidad,0)                               as cantidadSalida 
          ,IIF(tt.codigo =  'E' OR tt.codigo = 'A',dt.cantidadTransaccion,0) as stockEntrada 
		  ,IIF(tt.codigo =  'S',dt.cantidadTransaccion,0)                    as stockSalida 
          ,cantidadTransaccion
		  ,td.codigo                                                         as codDoc
		  ,tt.codigo                                                         as codTransaccion
	FROM Inventario.Transaccion              ts WITH (NOLOCK) 
    INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = ts.idTransaccion
	INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = ts.idTipoDocumento
	INNER JOIN Inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = ts.idTipoTransaccion	 
 )
