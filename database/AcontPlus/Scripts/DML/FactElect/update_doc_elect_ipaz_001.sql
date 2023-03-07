GO
UPDATE tbl SET tbl.ruc = d.ruc
,tbl.numeroIdentificacion = d.numeroIdentificacion
,tbl.idSucursal = d.idSucursal
--select *
FROM DocumentoElectronico tbl with (nolock)
JOIN (SELECT idFactura, c.numeroIdentificacion, e.ruc, p.idSucursal FROM Factura f 
INNER JOIN Cliente c On f.idCliente = c.idCliente 
INNER JOIN Entidad e On f.idEntidad = e.idEntidad
INNER JOIN PuntoEmision p On f.idPuntoEmision = p.idPuntoEmision 
) AS d ON tbl.idDocumento = d.idFactura
WHERE tbl.codDoc = '01' --and d.numeroIdentificacion like '%2390039282001%'

GO

UPDATE tbl SET tbl.ruc = d.ruc
,tbl.numeroIdentificacion = d.numeroIdentificacion
,tbl.idSucursal = d.idSucursal

--select *
FROM DocumentoElectronico tbl
JOIN (SELECT idLiquidacionCompra, c.numeroIdentificacion, e.ruc, p.idSucursal FROM LiquidacionCompra f 
INNER JOIN Proveedor c On f.idProveedor = c.idProveedor 
INNER JOIN Entidad e On f.idEntidad = e.idEntidad
INNER JOIN PuntoEmision p On f.idPuntoEmision = p.idPuntoEmision 
) AS d ON tbl.idDocumento = d.idLiquidacionCompra
WHERE tbl.codDoc = '03'

GO


UPDATE tbl SET tbl.ruc = d.ruc
,tbl.numeroIdentificacion = d.numeroIdentificacion
,tbl.idSucursal = d.idSucursal
--select *
FROM DocumentoElectronico tbl
JOIN (SELECT idNotaCredito, c.numeroIdentificacion, e.ruc, p.idSucursal FROM NotaCredito f 
INNER JOIN Cliente c On f.idCliente = c.idCliente
INNER JOIN Entidad e On f.idEntidad = e.idEntidad
INNER JOIN PuntoEmision p On f.idPuntoEmision = p.idPuntoEmision 
) AS d ON tbl.idDocumento = d.idNotaCredito
WHERE tbl.codDoc = '04'

GO
UPDATE tbl SET tbl.ruc = d.ruc
,tbl.numeroIdentificacion = d.numeroIdentificacion
,tbl.idSucursal = d.idSucursal
--select *
FROM DocumentoElectronico tbl
JOIN (SELECT idGuiaRemision, c.numeroIdentificacion, e.ruc, p.idSucursal FROM GuiaRemision f 
INNER JOIN Cliente c On f.idCliente = c.idCliente
INNER JOIN Entidad e On f.idEntidad = e.idEntidad
INNER JOIN PuntoEmision p On f.idPuntoEmision = p.idPuntoEmision 
) AS d ON tbl.idDocumento = d.idGuiaRemision
WHERE tbl.codDoc = '06'

GO

UPDATE tbl SET tbl.ruc = d.ruc
,tbl.numeroIdentificacion = d.numeroIdentificacion
,tbl.idSucursal = d.idSucursal

--select *
FROM DocumentoElectronico tbl
JOIN (SELECT idRetencionCompra, c.numeroIdentificacion, e.ruc, p.idSucursal FROM RetencionCompra f 
INNER JOIN Proveedor c On f.idProveedor = c.idProveedor 
INNER JOIN Entidad e On f.idEntidad = e.idEntidad
INNER JOIN PuntoEmision p On f.idPuntoEmision = p.idPuntoEmision 
) AS d ON tbl.idDocumento = d.idRetencionCompra
WHERE tbl.codDoc = '07' AND versionComp = '1.0.0'

GO 

UPDATE tbl SET tbl.ruc = d.ruc
,tbl.numeroIdentificacion = d.numeroIdentificacion
,tbl.idSucursal = d.idSucursal
--select *
FROM DocumentoElectronico tbl
JOIN (SELECT idRetencionAts, c.numeroIdentificacion, e.ruc, s.idSucursal FROM FactElect.RetencionAts f 
INNER JOIN Proveedor c On f.idProveedor = c.idProveedor 
INNER JOIN Sucursal s ON f.idSucursal = s.idSucursal
INNER JOIN Entidad e On s.idEntidad = e.idEntidad) AS d ON tbl.idDocumento = d.idRetencionAts
WHERE tbl.codDoc = '07' AND versionComp = '2.0.0'

GO 