USE AcontPlus
--GO

--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('E', 'Entrada')
--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('S', 'Salida')
--INSERT INTO Inventario.TipoTransaccion(codigo, descripcion) VALUES ('T', 'Transferencia')

--GO

--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('FE', '01', 'Factura Electrónica', 1)
--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('FF', '01', 'Factura Física', 2)
--INSERT INTO Inventario.TipoDocumento(codigo, descripcion, orden) VALUES ('IV', 'Ingresos Varios', 3)
--INSERT INTO Inventario.TipoDocumento(codigo, descripcion, orden) VALUES ('NE', 'Nota de Entrega', 4)
--INSERT INTO Inventario.TipoDocumento(codigo, codigoSri, descripcion, orden) VALUES ('NC', '04', 'Nota de Crédito', 5)

--GO

--INSERT INTO Inventario.Transaccion(idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, cantidad, precioVenta, precioCosto, fechaRegistro, idUsuario)
--SELECT 2, fd.idArticulo, fd.idBodega, 1, fd.idFactura, fd.cantidad, fd.precioVenta, a.precioCosto, fd.fechaRegistro, 1 
--FROM FacturaDetalle fd
--INNER JOIN Factura f ON fd.idFactura = f.idFactura
--INNER JOIN Articulo a On fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
--WHERE notaCredito = 0 and autorizada = 1
--AND fd.estado = 1
--ORDER BY f.idFactura
--GO
--INSERT INTO Inventario.Transaccion(idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, cantidad, precioCosto, fechaRegistro, idUsuario)
--SELECT 1, fd.idArticulo, fd.idBodega, 2, fd.idFacturaCompra, fd.cantidad, fd.precioCostoNeto, f.fechaEmision, 1 
--FROM FacturaCompraDetalle fd 
--INNER JOIN FacturaCompra f ON fd.idFacturaCompra = f.idFacturaCompra 
--INNER JOIN Articulo a ON fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
--WHERE f.estado = 1 
--AND f.isAutomatic = 0
--AND f.nroAutorizacion NOT IN (SELECT claveAcceso FROM Recepcion.DocumentoRecibido)
--ORDER BY f.idFacturaCompra
--GO
--SET LANGUAGE SPANISH
--INSERT INTO Inventario.Transaccion(idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, cantidad, precioCosto, fechaRegistro, idUsuario)
--SELECT 1, fd.idArticulo, fd.idBodega, 2, fd.idDocumento, fd.cantidad, fd.precioTotalSinImpuesto, CONVERT(datetime2, f.fechaEmision), 1 
--FROM Recepcion.DocumentoDetalle fd 
--INNER JOIN Recepcion.DocumentoRecibido f ON fd.idDocumento = f.idDocumento 
--INNER JOIN Articulo a ON fd.idArticulo = a.idArticulo AND a.llevaInventario = 1
--WHERE f.complete = 1  
--AND f.claveAcceso NOT IN (SELECT nroAutorizacion FROM FacturaCompra)


--SELECT * FROM Inventario.Transaccion WITH (NOLOCK)