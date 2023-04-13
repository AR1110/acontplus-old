USE Acontplus
GO
IF OBJECT_ID(N'v_DocElectronico', N'V') IS NOT NULL
DROP VIEW v_DocElectronico
GO
CREATE VIEW v_DocElectronico AS (SELECT
de.idDocumentoElectronico
,e.idEntidad
,e.razonSocial entidad
,e.ruc
,de.ambiente as codAmbiente
,ambiente = CASE WHEN de.ambiente = 2 THEN  'PRODUCCIÓN' ELSE 'PRUEBAS' END
,de.codDoc
,de.idDocumento
,de.versionComp
,comprobante = (CASE 
					WHEN de.codDoc = '01' THEN 'Factura' 
					WHEN de.codDoc = '03' THEN 'Liquidación de Compras' 
					WHEN de.codDoc = '04' THEN 'Nota de Crédito' 
					WHEN de.codDoc = '05' THEN 'Nota de Débito' 
					WHEN de.codDoc = '06' THEN 'Guía de Remisíon' 
					WHEN de.codDoc = '07' THEN 'Comprobante de Retención'
				END)
,se.codEstab
,de.numEstab estab
,de.ptoEmision ptoEmi
,de.nroDocumento secuencial
,de.numEstab + '-' + de.ptoEmision + '-' + RIGHT('000000000' + CAST(de.nroDocumento AS varchar(100)), 9) serieComprobante
,de.fechaEmision
,de.xmlAcontPlus
,de.xmlSri
,de.codigoAutorizacion
,de.fechaAutorizacion
,de.claveAcceso
,de.numeroIdentificacion identClienteProv
,cliente = (CASE 
					WHEN de.codDoc = '01' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE LTRIM(RTRIM(c.numeroIdentificacion)) = LTRIM(RTRIM(de.numeroIdentificacion)))
					WHEN de.codDoc = '04' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE LTRIM(RTRIM(c.numeroIdentificacion)) = LTRIM(RTRIM(de.numeroIdentificacion)))
					WHEN de.codDoc = '05' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE LTRIM(RTRIM(c.numeroIdentificacion)) = LTRIM(RTRIM(de.numeroIdentificacion)))
					WHEN de.codDoc = '06' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE LTRIM(RTRIM(c.numeroIdentificacion)) = LTRIM(RTRIM(de.numeroIdentificacion)))
				END)
,proveedor = (CASE 
					WHEN de.codDoc = '03' THEN (SELECT TOP 1 p.nombreFiscal FROM Proveedor p WITH(NOLOCK) WHERE LTRIM(RTRIM(p.numeroIdentificacion)) = LTRIM(RTRIM(de.numeroIdentificacion)))
					WHEN de.codDoc = '07' THEN (SELECT TOP 1 p.nombreFiscal FROM Proveedor p WITH(NOLOCK) WHERE LTRIM(RTRIM(p.numeroIdentificacion)) = LTRIM(RTRIM(de.numeroIdentificacion)))
				END)
,razonSocial = (CASE 
					WHEN de.codDoc = '01' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '03' THEN (SELECT TOP 1 p.nombreFiscal FROM Proveedor p WITH(NOLOCK) WHERE p.idProveedor = de.idContribuyente)
					WHEN de.codDoc = '04' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '05' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '06' THEN (SELECT TOP 1 c.nombreFiscal FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '07' THEN (SELECT TOP 1 p.nombreFiscal FROM Proveedor p WITH(NOLOCK) WHERE p.idProveedor = de.idContribuyente)
				END)
,rucReceptor = (CASE 
					WHEN de.codDoc = '01' THEN (SELECT TOP 1 c.numeroIdentificacion FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '03' THEN (SELECT TOP 1 p.numeroIdentificacion FROM Proveedor p WITH(NOLOCK) WHERE p.idProveedor = de.idContribuyente)
					WHEN de.codDoc = '04' THEN (SELECT TOP 1 c.numeroIdentificacion FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '05' THEN (SELECT TOP 1 c.numeroIdentificacion FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '06' THEN (SELECT TOP 1 c.numeroIdentificacion FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '07' THEN (SELECT TOP 1 p.numeroIdentificacion FROM Proveedor p WITH(NOLOCK) WHERE p.idProveedor = de.idContribuyente)
				END)
,correo = (CASE 
					WHEN de.codDoc = '01' THEN (SELECT TOP 1 c.correo FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '03' THEN (SELECT TOP 1 p.correo FROM Proveedor p WITH(NOLOCK) WHERE p.idProveedor = de.idContribuyente)
					WHEN de.codDoc = '04' THEN (SELECT TOP 1 c.correo FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '05' THEN (SELECT TOP 1 c.correo FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '06' THEN (SELECT TOP 1 c.correo FROM Cliente c WITH(NOLOCK) WHERE c.idCliente = de.idContribuyente)
					WHEN de.codDoc = '07' THEN (SELECT TOP 1 p.correo FROM Proveedor p WITH(NOLOCK) WHERE p.idProveedor = de.idContribuyente)
				END) 
,de.codEstado
,estado = (SELECT descripcion FROM FactElect.EstadoServicio es  WITH(NOLOCK) WHERE es.codigo = de.codEstado)
,de.fechaRegistro
,de.idUsuario

FROM DocumentoElectronico de WITH(NOLOCK)
INNER JOIN Entidad e WITH(NOLOCK) ON de.idEntidad = e.idEntidad
LEFT JOIN Sri.Establecimiento se ON de.codEstab = se.codEstab
)