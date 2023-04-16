USE AcontPlus
--GO

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

--INSERT INTO Inventario.Transaccion(idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, cantidad, precioUnitario, precioCosto, fechaRegistro, idUsuario,estado)

--SELECT 2, 
--       fd.idArticulo,
--	   fd.idBodega,
--	   1,
--	   fd.idFactura,
--	   cantidad = CAST(fd.cantidad * dbo.AFTConverFracc(fd.idArticulo,fd.idMedida) AS decimal(15,5)) ,
--	   fd.precioVenta,
--	   a.precioCosto,
--	   f.fechaEmision,
--	   f.idUsuario
--	   ,estado = IIF(ep.codigo = 'A',0,1)
--FROM FacturaDetalle fd
--INNER JOIN Factura f ON fd.idFactura = f.idFactura
--INNER JOIN Articulo a On fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
--INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = f.idEstadoPago
--WHERE notaCredito = 0 and autorizada = 1
--AND fd.estado = 1

--union all

--SELECT idTipoTransaccion = 2
--	  ,nd.idArticulo
--	  ,nd.idBodega
--	  ,idTipoDocumento = 4
--	  ,idDocumento = nd.idNotaEntrega
--	  ,cantidad = CAST(nd.cantidad * dbo.AFTConverFracc(nd.idArticulo,nd.idMedida) AS decimal(15,5))
--	  ,nd.precioVenta
--	  ,nd.precioCosto
--	  ,ne.fechaEmision
--	  ,ne.idUsuario
--	  ,estado = IIF(ep.codigo = 'A',0,1)
--FROM dbo.NotaEntregaDetalle nd WITH (NOLOCK)
--INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = nd.idArticulo
--INNER JOIN dbo.NotaEntrega ne WITH (NOLOCK) ON ne.idNotaEntrega = nd.idNotaEntrega
--INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = ne.idEstadoPago
--WHERE ar.llevaInventario = 1

--union all

--SELECT idTipoTransaccion = 2
--	  ,td.idArticulo
--	  ,tb.idBodegaOrigen
--	  ,idTipoDocumento = 8
--	  ,idDocumento = tb.idTransferenciaBodega
--	  ,cantidad = CAST(td.cantidad * dbo.AFTConverFracc(td.idArticulo,td.idMedida) AS decimal(15,5))
--	  ,td.precioCosto
--	  ,td.precioCosto
--	  ,tb.fechaEmision
--	  ,tb.idUsuario
--	  ,estado = IIF(ep.codigo = 'A',0,1)
--FROM dbo.TransferenciaBodegaDetalle td WITH (NOLOCK)
--INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = td.idArticulo
--INNER JOIN dbo.TransferenciaBodega tb WITH (NOLOCK) ON tb.idTransferenciaBodega = td.idTransferenciaBodega
--INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento
--WHERE ar.llevaInventario = 1

--union all

--SELECT idTipoTransaccion = 1
--	  ,td.idArticulo
--	  ,tb.idBodegaDestino
--	  ,idTipoDocumento = 8
--	  ,idDocumento = tb.idTransferenciaBodega
--	  ,cantidad = CAST(td.cantidad * dbo.AFTConverFracc(td.idArticulo,td.idMedida) AS decimal(15,5))
--	  ,td.precioCosto
--	  ,td.precioCosto
--	  ,tb.fechaEmision
--	  ,tb.idUsuario
--	  ,estado = IIF(ep.codigo = 'A',0,1)
--FROM dbo.TransferenciaBodegaDetalle td WITH (NOLOCK)
--INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = td.idArticulo
--INNER JOIN dbo.TransferenciaBodega tb WITH (NOLOCK) ON tb.idTransferenciaBodega = td.idTransferenciaBodega
--INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento
--WHERE ar.llevaInventario = 1

--union all

--SELECT idTipoTransaccion = 2
--	   ,dd.idArticulo
--	   ,dd.idBodega
--	   ,idTipoDocumento = 3
--       ,idDocumento = dd.idDocumentoIngreso
--	   ,cantidad = CAST(dd.cantidad * dbo.AFTConverFracc(dd.idArticulo,dd.idMedida) AS decimal(15,5))
--	   ,dd.precioUnitario
--	   ,dd.costoNeto
--	   ,di.fechaEmision
--	   ,di.idUsuario
--	   ,di.estado
--FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK)
--INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = dd.idArticulo
--INNER JOIN Compra.Documento_Ingreso di WITH (NOLOCK) ON di.idDocumentoIngreso = dd.idDocumentoIngreso
--WHERE ar.llevaInventario = 1

--union all


--SELECT 1
--    ,fd.idArticulo
--	  ,fd.idBodega
--	  ,2
--	  ,fd.idFacturaCompra
--	  ,cantidad = CAST(fd.cantidad * dbo.AFTConverFracc(fd.idArticulo,fd.idMedida) AS decimal(15,5))
--	  ,fd.precioCostoNeto
--	  ,fd.precioCosto
--	  ,f.fechaEmision
--	  ,f.idUsuario 
--	  ,f.estado
--FROM FacturaCompraDetalle fd 
--INNER JOIN FacturaCompra f ON fd.idFacturaCompra = f.idFacturaCompra 
--INNER JOIN Articulo a ON fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
--WHERE f.estado = 1 
--AND f.isAutomatic = 0
--AND f.nroAutorizacion NOT IN (SELECT claveAcceso FROM Recepcion.DocumentoRecibido)

--union all

--SELECT idTipoTransaccion = IIF(f.codDoc = '01',1,2)
--    ,fd.idArticulo
--	  ,fd.idBodega
--	  ,idTipoDocumento = IIF(f.codDoc = '01',1,5)
--	  ,fd.idDocumento
--	  ,cantidad = CAST(fd.cantidad * dbo.AFTConverFracc(fd.idArticulo,fd.idMedida) AS decimal(15,5))
--	  ,fd.precioTotalSinImpuesto
--	  ,costoNeto
--	  ,fechaEmision = CONVERT(datetime, f.fechaEmision,103)
--	  ,f.idUsuario 
--	  ,estado = 1
--FROM Recepcion.DocumentoDetalle fd 
--INNER JOIN Recepcion.DocumentoRecibido f ON fd.idDocumento = f.idDocumento 
--INNER JOIN Articulo a ON fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
--WHERE f.complete = 1  
--AND f.claveAcceso NOT IN (SELECT nroAutorizacion FROM FacturaCompra)

--union all

--SELECT idTipoTransaccion = 1
--	  ,ld.idArticulo
--	  ,ld.idBodega
--	  ,idTipoDocumento = 6
--	  ,lq.idLiquidacionCompra
--	  ,cantidad = CAST(ld.cantidad * dbo.AFTConverFracc(ld.idArticulo,ld.idMedida) AS decimal(15,5))
--	  ,ld.precioCostoNeto
--	  ,ld.precioCosto
--	  ,lq.fechaEmision
--	  ,lq.idUsuario
--	  ,estado = IIF(ep.codigo = 'A',0,1)
--FROM dbo.LiquidacionCompraDetalle ld WITH (NOLOCK)
--INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = ld.idArticulo
--INNER JOIN dbo.LiquidacionCompra lq WITH (NOLOCK) ON lq.idLiquidacionCompra = ld.idLiquidacionCompra
--INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = lq.idEstadoPago
--WHERE ar.llevaInventario = 1


SELECT idTipoTransaccion = 7
	  ,cd.idArticulo
	  ,cd.idBodega
	  ,idTipoDocumento = 7
	  ,cd.idConsolidacionInventario
	  ,cantidad = CAST(cd.cantidad * dbo.AFTConverFracc(cd.idArticulo,cd.idMedida) AS decimal(15,5))
	  ,cd.precioActual
	  ,cd.precioCosto
	  ,ci.fechaEmision
	  ,ci.idUsuario
	  ,estado = IIF(ep.codigo = 'A',0,1)
FROM dbo.ConsolidacionInventarioDetalle cd WITH (NOLOCK)
INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = cd.idArticulo
INNER JOIN dbo.ConsolidacionInventario ci WITH (NOLOCK) ON ci.idConsolidacionInventario = cd.idConsolidacionInventario
INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = ci.idEstadoDocumento
WHERE ar.llevaInventario = 1


--SELECT * FROM Inventario.Transaccion WITH (NOLOCK)