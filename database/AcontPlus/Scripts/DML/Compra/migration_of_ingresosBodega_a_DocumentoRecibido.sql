use [AcontPlus]
go 


--INSERT INTO Compra.Documento_Ingreso
--      (uniqueId,idEstablecimiento,idPuntoEmision,idProveedor,codDoc,estab,ptoEmi,fechaEmision,secuencial,totalSinImpuestos,importeTotal,fechaRegistro,idUsuario,idEntidad,estado)
--SELECT uniqueId,idEstablecimiento,ib.idPuntoEmision,ib.idProveedor,'DH',estab,ptoEmi,fechaEmision,nroDocumento,subTotalSinImpuestos,total,ib.fechaRegistro,idUsuario,idEntidad,estado = IIF(ep.codigo = 'A',0,1)
--FROM IngresoBodega ib
--INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = ib.idPuntoEmision
--INNER JOIN sri.Establecimiento es ON es.codEstab = pe.codEstab
--INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = ib.idEstadoPago

--INSERT INTO Compra.Documento_Ingreso_Detail
--	   (idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje,estado)
--SELECT di.idDocumentoIngreso,d.idArticulo,d.idMedida,d.idBodega,ar.codigo,ar.codigoAuxiliar,d.descripcion,d.cantidad,d.precioCosto,costoNeto = ar.precioCosto,d.valorDescuento,d.total,iv.codigoPorcentaje,d.estado
--FROM IngresoBodegaDetalle d
--INNER JOIN Compra.Documento_Ingreso di ON di.uniqueId = d.uniqueId
--INNER JOIN dbo.Articulo ar ON ar.idArticulo = d.idArticulo
--INNER JOIN dbo.TipoIva iv ON iv.idTipoIva = d.idTipoIva



--INSERT INTO Compra.Documento_Ingreso_Taxes
--                  (idDocumentoIngreso,idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor)

--SELECT di.idDocumentoIngreso,d.idArticulo,codigo = '2', codigoPorcentaje, tarifa = porcentaje, baseImponible =  total, valor = cast((porcentaje/100) * total as numeric(18,5))
--from IngresoBodegaDetalle d
--INNER JOIN Compra.Documento_Ingreso di ON di.uniqueId = d.uniqueId
--INNER JOIN dbo.TipoIva iv ON iv.idTipoIva = d.idTipoIva


SELECT * FROM Compra.Documento_Ingreso
select * from Compra.Documento_Ingreso_Detail
select * from Compra.Documento_Ingreso_Taxes