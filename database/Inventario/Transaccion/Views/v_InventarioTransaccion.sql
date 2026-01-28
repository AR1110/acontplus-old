USE AcontPlus
GO
CREATE OR ALTER VIEW v_InventarioTransaccion WITH SCHEMABINDING AS (
SELECT tr.idTransaccion
      ,tr.idTransaccionOriginal
	  ,tr.idTipoTransaccion
	  ,tr.idTipoDocumento
	  ,tr.idDocumento
	  ,tr.idUsuario
      ,tr.serieComprobante as nroDocumento
      ,CASE WHEN tt.codigo = 'A' THEN tr.fechaEmision ELSE tr.fechaRegistro END AS fechaRegistro
      ,dt.idTransaccionDetalle
      ,dt.estado
      ,dt.idArticulo
	  ,dt.idBodega
	  ,dt.idTarifa
      ,dt.idMedida
      ,dt.cantidad 
      ,dt.cantidadTransaccion
	  ,dt.precioUnitario
	  ,dt.precioCosto
      ,dt.precioCostoFraccionado
      ,dt.AjusteId                                                                  as particion
      ,dt.saldo
      ,ISNULL(CASE WHEN dt.cantidadTransaccion > 0 THEN dt.cantidad END, 0) as cantidadEntrada
	  ,ISNULL(CASE WHEN dt.cantidadTransaccion < 0 THEN dt.cantidad END, 0) as cantidadSalida
      ,ISNULL(CASE WHEN dt.cantidadTransaccion > 0 THEN dt.total END, 0)    as totalEntrada
      ,ISNULL(CASE WHEN dt.cantidadTransaccion < 0 THEN dt.total END, 0)    as totalSalida 
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
	  ,cu.BusinessName                                                              as clienteProveedor
      ,cu.IDCard                                                                    as rucClienteProveedor
      ,me.descripcion                                                               as medida
      ,es.nombreComercial                                                           as establecimiento
      ,ta.descripcion                                                               as tarifa
FROM Inventario.Transaccion              tr
INNER JOIN Inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
INNER JOIN dbo.Usuario                   us WITH (NOLOCK) ON us.idUsuario         = tr.idUsuario
INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = tr.idTransaccion
INNER JOIN dbo.Articulo                  ar WITH (NOLOCK) ON ar.idArticulo        = dt.idArticulo
INNER JOIN dbo.Medida                    me WITH (NOLOCK) ON me.idMedida          = dt.idMedida
INNER JOIN dbo.Bodega                    bo WITH (NOLOCK) ON bo.idBodega          = dt.idBodega
INNER JOIN Sri.Establecimiento           es WITH (NOLOCK) ON bo.codEstab          = es.codEstab
 LEFT JOIN dbo.Tarifa                    ta WITH (NOLOCK) ON ta.idTarifa          = dt.idTarifa
 LEFT JOIN Customer.Customer             cu WITH (NOLOCK) ON cu.Id                = tr.CustomerId
 LEFT JOIN dbo.SubFamilia                sf WITH (NOLOCK) ON sf.idSubFamilia      = ar.idSubFamilia
)
