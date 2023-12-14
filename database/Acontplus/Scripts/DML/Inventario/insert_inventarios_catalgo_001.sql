USE AcontPlus
GO

--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('E', 'Entrada')
--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('S', 'Salida')
--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('T', 'Transferencia')
--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('A', 'Ajustes')

--GO

--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('FE', '01', 'Factura Electrónica', 1)
--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('FF', '01', 'Factura Física', 2)
--INSERT INTO Inventario.TipoDocumento(codigo, descripcion, orden) VALUES ('IV', 'Ingresos Varios', 3)
--INSERT INTO Inventario.TipoDocumento(codigo, descripcion, orden) VALUES ('NE', 'Nota de Entrega', 4)
--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('NC', '04', 'Nota de Crédito', 5)
--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('LC', '03', 'Liquidación de Compra', 6)
--INSERT INTO Inventario.TipoDocumento(codigo, descripcion, orden) VALUES ('CI','Consolidación', 7)
--INSERT INTO Inventario.TipoDocumento(codigo, descripcion, orden) VALUES ('TB','Transferencia Bodega', 8)

--GO

--INSERT INTO Inventario.Transaccion
--     (idTipoTransaccion
--     ,idArticulo
--     ,idBodega
--     ,idTipoDocumento
--     ,idDocumento
--     ,idMedida
--     ,idTarifa
--     ,cantidad
--     ,precioUnitario
--     ,precioCosto
--     ,total
--     ,fechaRegistro
--     ,idUsuario
--     ,estado)

select COUNT(*) from (

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'S')                            as idTipoTransaccion
      ,fd.idArticulo                                                                                                           as idArticulo
	  ,fd.idBodega                                                                                                             as idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'FE')                               as idTipoDocumento
	  ,fd.idFactura                                                                                                            as idDocumento
	  ,fd.idMedida                                                                                                             as idMedida
	  ,fd.idTarifa                                                                                                             as idTarifa
	  ,CAST(fd.cantidad * dbo.AFTConverFracc(fd.idArticulo,fd.idMedida) AS decimal(15,5))                                      as cantidad
	  ,fd.precioVenta                                                                                                          as precioUnitario
	  ,fd.precioCosto                                                                                                          as precioCosto
	  ,fd.total                                                                                                                as total
	  ,f.fechaEmision                                                                                                          as fechaRegistro
	  ,f.idUsuario                                                                                                             as idUsuario                                    
	  ,IIF((SELECT cc.codEstado FROM v_CuentaPorCobrar cc WHERE cc.idDocumento = fd.idFactura AND cc.codDoc = '01') = 'A',0,1) as estado
FROM FacturaDetalle fd
INNER JOIN Factura f ON fd.idFactura = f.idFactura
INNER JOIN Articulo a On fd.idArticulo = a.idArticulo
WHERE a.llevaInventario = 1
  AND fd.estado = 1

UNION ALL

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'S')                            as idTipoTransaccion
	  ,nd.idArticulo                                                                                                           as idArticulo
	  ,nd.idBodega                                                                                                             as idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'NE')                               as idTipoDocumento
	  ,nd.idNotaEntrega                                                                                                        as idDocumento 
	  ,nd.idMedida                                                                                                             as idMedida
	  ,nd.idTarifa                                                                                                             as idTarifa
	  ,cantidad = CAST(nd.cantidad * dbo.AFTConverFracc(nd.idArticulo,nd.idMedida) AS decimal(15,5))
	  ,nd.precioVenta
	  ,ar.precioCosto
	  ,nd.total
	  ,ne.fechaEmision
	  ,ne.idUsuario
	  ,CASE WHEN (SELECT cc.codEstado FROM v_CuentaPorCobrar cc WHERE cc.idDocumento = nd.idNotaEntrega AND cc.codDoc = 'NE') = 'A' THEN 0 
            WHEN (SELECT cc.codEstado FROM v_CuentaPorCobrar cc WHERE cc.idDocumento = nd.idNotaEntrega AND cc.codDoc = 'NE') = 'TRA' THEN 2
            ELSE 1
       END as estado
FROM dbo.NotaEntregaDetalle nd WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = nd.idArticulo
INNER JOIN dbo.NotaEntrega ne WITH (NOLOCK) ON ne.idNotaEntrega = nd.idNotaEntrega
WHERE ar.llevaInventario = 1
   AND ar.estado = 1


   UNION ALL

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'S') as idTipoTransaccion
	  ,td.idArticulo
	  ,tb.idBodegaOrigen
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'TB') as idTipoDocumento
	  ,idDocumento = tb.idTransferenciaBodega
	  ,td.idMedida
	  ,NULL
	  ,cantidad = CAST(td.cantidad * dbo.AFTConverFracc(td.idArticulo,td.idMedida) AS decimal(15,5))
	  ,td.precioCosto
	  ,td.precioCosto
	  ,td.total
	  ,tb.fechaEmision
	  ,tb.idUsuario
	  ,estado = IIF(ep.codigo = 'A',0,1)
FROM dbo.TransferenciaBodegaDetalle td WITH (NOLOCK)
INNER JOIN dbo.Articulo             ar WITH (NOLOCK) ON ar.idArticulo            = td.idArticulo
INNER JOIN dbo.TransferenciaBodega  tb WITH (NOLOCK) ON tb.idTransferenciaBodega = td.idTransferenciaBodega
INNER JOIN dbo.EstadoPago           ep WITH (NOLOCK) ON ep.idEstadoPago          = tb.idEstadoDocumento
WHERE ar.llevaInventario = 1
  AND td.estado = 1
  
  UNION ALL

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'S') as idTipoTransaccion
	  ,nd.idArticulo
	  ,nd.idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'NC') as idTipoDocumento
	  ,idDocumento = nc.idNotaCredito
	  ,nd.idMedida
	  ,nd.idTarifa
	  ,cantidad = CAST(nd.cantidad * dbo.AFTConverFracc(nd.idArticulo,nd.idMedida) AS decimal(15,5)) * -1
	  ,nd.precioCosto
	  ,nd.precioCosto
	  ,nd.total
	  ,nc.fechaEmision
	  ,nc.idUsuario
	  ,estado = IIF(ep.codigo = 'A',0,1)
FROM dbo.NotaCreditoDetalle nd WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = nd.idArticulo
INNER JOIN dbo.NotaCredito nc WITH (NOLOCK) ON nc.idNotaCredito = nd.idNotaCredito
INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = nc.idEstadoDocumento
WHERE ar.llevaInventario = 1

union all

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'E') as idTipoTransaccion
	  ,td.idArticulo
	  ,tb.idBodegaDestino
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'TB') as idTipoDocumento
	  ,idDocumento = tb.idTransferenciaBodega
	  ,td.idMedida
	  ,NULL
	  ,cantidad = CAST(td.cantidad * dbo.AFTConverFracc(td.idArticulo,td.idMedida) AS decimal(15,5))
	  ,td.precioCosto
	  ,td.precioCosto
	  ,td.total
	  ,tb.fechaEmision
	  ,tb.idUsuario
	  ,estado = IIF(ep.codigo = 'A',0,1)
FROM dbo.TransferenciaBodegaDetalle td WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = td.idArticulo
INNER JOIN dbo.TransferenciaBodega tb WITH (NOLOCK) ON tb.idTransferenciaBodega = td.idTransferenciaBodega
INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento
WHERE ar.llevaInventario = 1
AND td.estado = 1

union all

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'E') as idTipoTransaccion
	   ,dd.idArticulo
	   ,dd.idBodega
	   ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'IV') as idTipoDocumento
       ,idDocumento = dd.idDocumentoIngreso
	   ,dd.idMedida
	   ,NULL
	   ,cantidad = CAST(dd.cantidad * dbo.AFTConverFracc(dd.idArticulo,dd.idMedida) AS decimal(15,5))
	   ,dd.precioUnitario
	   ,dd.costoNeto
	   ,dd.precioTotalSinImpuesto
	   ,di.fechaEmision
	   ,di.idUsuario
	   ,di.estado
FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = dd.idArticulo
INNER JOIN Compra.Documento_Ingreso di WITH (NOLOCK) ON di.idDocumentoIngreso = dd.idDocumentoIngreso
WHERE ar.llevaInventario = 1
and dd.estado = 1

union all

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'E') as idTipoTransaccion
      ,fd.idArticulo
	  ,fd.idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'FF') as idTipoDocumento
	  ,fd.idFacturaCompra
	  ,fd.idMedida
	  ,NULL
	  ,cantidad = CAST(fd.cantidad * dbo.AFTConverFracc(fd.idArticulo,fd.idMedida) AS decimal(15,5))
	  ,fd.precioCostoNeto
	  ,fd.precioCosto
	  ,fd.total
	  ,f.fechaEmision
	  ,f.idUsuario 
	  ,f.estado
FROM FacturaCompraDetalle fd 
INNER JOIN FacturaCompra f ON fd.idFacturaCompra = f.idFacturaCompra 
INNER JOIN Articulo a ON fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
WHERE f.estado = 1 
AND f.isAutomatic = 0
AND f.nroAutorizacion NOT IN (SELECT claveAcceso FROM Recepcion.DocumentoRecibido)

union all

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'E') as idTipoTransaccion
      ,fd.idArticulo
	  ,fd.idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = IIF(f.codDoc = '01','FE','NC')) as idTipoDocumento 
	  ,fd.idDocumento
	  ,fd.idMedida
	  ,NULL
	  ,cantidad = CAST(fd.cantidad * dbo.AFTConverFracc(fd.idArticulo,fd.idMedida) AS decimal(15,5)) * IIF(f.codDoc = '01',1,-1)
	  ,fd.precioUnitario * IIF(f.codDoc = '01',1,-1) as precioUnitario
	  ,costoNeto 
	  ,fd.precioTotalSinImpuesto * IIF(f.codDoc = '01',1,-1) as precioTotalSinImpuesto
	  ,fechaEmision = CONVERT(datetime, f.fechaEmision,103)
	  ,f.idUsuario 
	  ,estado = 1
FROM Recepcion.DocumentoDetalle fd 
INNER JOIN Recepcion.DocumentoRecibido f ON fd.idDocumento = f.idDocumento 
INNER JOIN Articulo a ON fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
WHERE f.complete = 1  
AND f.claveAcceso NOT IN (SELECT nroAutorizacion FROM FacturaCompra)

union all

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'E') as idTipoTransaccion
	  ,ld.idArticulo
	  ,ld.idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'LC') as idTipoDocumento
	  ,lq.idLiquidacionCompra
	  ,ld.idMedida
	  ,NULL
	  ,cantidad = CAST(ld.cantidad * dbo.AFTConverFracc(ld.idArticulo,ld.idMedida) AS decimal(15,5))
	  ,ld.precioCostoNeto
	  ,ld.precioCosto
	  ,ld.total
	  ,lq.fechaEmision
	  ,lq.idUsuario
	  ,estado = IIF((select cp.codEstado from v_cuentaporpagar cp where cp.codDoc = '03' and cp.idDocumento = lq.idLiquidacionCompra) = 'A',0,1)
FROM dbo.LiquidacionCompraDetalle ld WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = ld.idArticulo
INNER JOIN dbo.LiquidacionCompra lq WITH (NOLOCK) ON lq.idLiquidacionCompra = ld.idLiquidacionCompra
WHERE ar.llevaInventario = 1
AND ld.estado = 1

UNION ALL

SELECT (SELECT TOP 1 tt.idTipoTransaccion FROM Inventario.TipoTransaccion tt WHERE tt.codigo = 'A') as idTipoTransaccion
	  ,cd.idArticulo
	  ,cd.idBodega
	  ,(SELECT TOP 1 td.idTipoDocumento FROM Inventario.TipoDocumento td WHERE td.codigo = 'CI') as idTipoDocumento
	  ,cd.idConsolidacionInventario
	  ,cd.idMedida
	  ,NULL
	  ,cantidad = CAST(cd.cantidad * dbo.AFTConverFracc(cd.idArticulo,cd.idMedida) AS decimal(15,5))
	  ,cd.precioActual
	  ,cd.precioCosto
	  ,cd.cantidad * cd.precioCosto
	  ,ci.fechaEmision
	  ,ci.idUsuario
	  ,estado = IIF(ep.codigo = 'A',0,1)
FROM dbo.ConsolidacionInventarioDetalle cd WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = cd.idArticulo
INNER JOIN dbo.ConsolidacionInventario ci WITH (NOLOCK) ON ci.idConsolidacionInventario = cd.idConsolidacionInventario
INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = ci.idEstadoDocumento
WHERE ar.llevaInventario = 1
and cd.estado = 1 ) as dt 



----SELECT * FROM Inventario.Transaccion WITH (NOLOCK)