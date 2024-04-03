USE AcontPlus
GO
CREATE OR ALTER VIEW v_InventarioTransaccion WITH SCHEMABINDING AS (
SELECT tr.idTransaccion
	  ,tr.idTipoTransaccion
	  ,tr.idArticulo
	  ,tr.idBodega
	  ,tr.idTipoDocumento
	  ,tr.idDocumento
	  ,tr.idTarifa
      ,tr.idMedida
      ,tr.cantidad 
      ,tr.cantidadTransaccion
	  ,tr.precioUnitario
	  ,tr.precioCosto
	  ,tr.fechaRegistro
	  ,tr.estado
	  ,tr.idUsuario
      ,tr.serieComprobante as nroDocumento
      ,ISNULL(CASE WHEN tt.codigo = 'E' OR tt.codigo = 'A' THEN tr.cantidad END, 0) as cantidadEntrada
	  ,ISNULL(CASE WHEN tt.codigo = 'S' THEN tr.cantidad END, 0)                    as cantidadSalida
      ,ISNULL(CASE WHEN tt.codigo = 'E' OR tt.codigo = 'A' THEN tr.total END, 0)    as totalEntrada
      ,ISNULL(CASE WHEN tt.codigo = 'S' THEN tr.total END, 0)                       as totalSalida 
      ,CASE WHEN td.codigo = 'CI' THEN tr.idDocumento 
                                  ELSE (
                                            SELECT max(ci.idConsolidacionInventario) 
								            FROM dbo.ConsolidacionInventario              ci WITH (NOLOCK)
									        INNER JOIN dbo.ConsolidacionInventarioDetalle cd WITH (NOLOCK) ON cd.idConsolidacionInventario = ci.idConsolidacionInventario
									        INNER JOIN dbo.EstadoPago                     ep WITH (NOLOCK) ON ep.idEstadoPago              = ci.idEstadoDocumento
									        WHERE ci.fechaEmision < tr.fechaRegistro 
                                              AND cd.idArticulo = tr.idArticulo 
                                              AND cd.idBodega = tr.idBodega
                                              AND ep.codigo = 'AC' 
                                             
                                       ) 
       END as particion
      ,ar.idSubFamilia
	  ,tt.codigo                                                                    as codTransaccion
	  ,tt.descripcion                                                               as transaccion
	  ,td.codigo                                                                    as codDoc
	  ,td.codigoSri
	  ,td.descripcion                                                               as documento
	  ,bo.codEstab
	  ,bo.descripcion                                                               as bodega
	  ,ar.idEntidad
	  ,ar.codigo                                                                    as codArticulo
	  ,ar.codigoAuxiliar
	  ,ar.codigoBarra
	  ,ar.descripcion                                                               as articulo
      ,sf.descripcion                                                               as subFamilia
	
	  ,us.nombreUsuario                                                             as usuario
	  ,cu.TradeName                                                                 as clienteProveedor
      ,cu.IDCard                                                                    as rucClienteProveedor
      ,me.descripcion                                                               as medida
      ,es.nombreComercial                                                           as establecimiento
      ,ta.descripcion                                                               as tarifa
FROM Inventario.Transaccion           tr WITH (NOLOCK)
INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
INNER JOIN dbo.Usuario                us WITH (NOLOCK) ON us.idUsuario         = tr.idUsuario
INNER JOIN dbo.Medida                 me WITH (NOLOCK) ON me.idMedida          = tr.idMedida
INNER JOIN dbo.Bodega                 bo WITH (NOLOCK) ON bo.idBodega          = tr.idBodega
 LEFT JOIN dbo.Tarifa                 ta WITH (NOLOCK) ON ta.idTarifa          = tr.idTarifa
 LEFT JOIN Customer.Customer          cu WITH (NOLOCK) ON cu.Id                = tr.CustomerId
INNER JOIN Sri.Establecimiento        es WITH (NOLOCK) ON bo.codEstab          = es.codEstab
INNER JOIN dbo.Articulo               ar WITH (NOLOCK) ON tr.idArticulo        = ar.idArticulo
 LEFT JOIN dbo.SubFamilia             sf WITH (NOLOCK) ON sf.idSubFamilia      = ar.idSubFamilia
)
