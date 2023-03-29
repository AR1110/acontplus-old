use [AcontPlus] 
go 

INSERT INTO [Contabilidad].[CuentaPorPagar]
           ([idEstablecimiento]
           ,[idTiempoCredito]
           ,[idProveedor]
           ,[idEstadoPago]
           ,[codDoc]
           ,[uniqueId]
           ,[serieComprobante]
           ,[identificacion]
           ,[fechaEmision]
           ,[fechaVencimiento]
           ,[importeTotal]
           ,[abono]
           ,[idEntidad]
           ,[idUsuario])
 SELECT 
	 e.idEstablecimiento
	,lc.idTiempoCredito 
	,lc.idProveedor
	,lc.idEstadoPago
	,codDoc = '03'
	,uniqueId
	,serieComprobante = e.estab+'-'+pto.ptoEmi+'-'+Helper.F_Auto_Sequential(lc.nroDocumento)
	,p.numeroIdentificacion
	,fechaEmision
	,fechaVencimiento
	,total
	,abono
	,lc.idEntidad
	,lc.idUsuario
FROM LiquidacionCompra lc
INNER JOIN Proveedor p ON p.idProveedor = lc.idProveedor
INNER JOIN dbo.PuntoEmision pto ON pto.idPuntoEmision = lc.idPuntoEmision
INNER JOIN Sri.Establecimiento e ON e.codEstab = pto.codEstab

UNION ALL

SELECT e.idEstablecimiento
      ,ib.idTiempoCredito
	  ,ib.idProveedor
	  ,ib.idEstadoPago
	  ,codDoc = 'DH'
	  ,ib.uniqueId
	  ,serieComprobante = e.estab+'-'+ptoEmi+'-'+Helper.F_Auto_Sequential(ib.nroDocumento)
	  ,identificacion = p.numeroIdentificacion
	  ,ib.fechaEmision
	  ,ib.fechaVencimiento
	  ,ib.total
	  ,ib.abono
	  ,ib.idEntidad
	  ,ib.idUsuario
FROM IngresoBodega ib 
INNER JOIN PuntoEmision pe ON pe.idPuntoEmision = ib.idPuntoEmision
INNER JOIN sri.Establecimiento e ON e.codEstab = pe.codEstab
INNER JOIN dbo.Proveedor p ON p.idproveedor  = ib.idProveedor


 UNION ALL

 SELECT 
	 e.idEstablecimiento
	,fc.idTiempoCredito 
	,fc.idProveedor
	,fc.idEstadoPago
	,codDoc = 'FC'
	,uniqueId
	,serieComprobante = fc.puntoEmision+'-'+Helper.F_Auto_Sequential(fc.nroDocumento)
	,p.numeroIdentificacion
	,fechaEmision
	,fechaVencimiento
	,total
	,abono
	,fc.idEntidad
	,fc.idUsuario
FROM FacturaCompra fc
INNER JOIN Proveedor p ON p.idProveedor = fc.idProveedor
INNER JOIN Sri.Establecimiento e ON e.codEstab = fc.codEstab