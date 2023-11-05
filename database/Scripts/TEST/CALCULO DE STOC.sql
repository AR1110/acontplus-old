USE [AcontPlus]
GO 

SELECT codTransaccion,codDoc,documento,bodega, transaccion, cantidad,estado FROm v_InventarioTransaccion where idArticulo = 67618 ORDER BY codDoc
--==SALIDAS====
--FACTURA LISTO
--NOTA ENTREGA LISTO

--==ENTRADAS
--Facgura fisica listo
--liquidacion LISTO
--INGRESOS VARIOS en proceso

--select * from inventario.tipodocumento

--update compra.documento_ingreso set estado = 1 where idDocumentoIngreso = 511
