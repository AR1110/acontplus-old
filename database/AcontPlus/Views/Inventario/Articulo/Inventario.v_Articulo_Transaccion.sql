USE AcontPlus
GO
CREATE OR ALTER VIEW Inventario.v_Articulo_Transaccion WITH SCHEMABINDING AS (
	SELECT ts.idTransaccion
		  ,ts.idTipoDocumento
		  ,ts.idTipoTransaccion
		  ,ts.idArticulo
		  ,ts.idBodega
		  ,ts.fechaRegistro
          ,ts.estado
		  ,ts.precioCosto
		  ,ts.precioUnitario
		  ,IIF(tt.codigo =  'E' OR tt.codigo = 'A',ts.cantidad,0) as cantidadEntrada 
		  ,IIF(tt.codigo =  'S',ts.cantidad,0) as cantidadSalida 
		  ,td.codigo as codDoc
		  ,tt.codigo as codTransaccion
	FROM Inventario.Transaccion           ts WITH (NOLOCK) 
	INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = ts.idTipoDocumento
	INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = ts.idTipoTransaccion	 
 )
