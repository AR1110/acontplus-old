use [AcontPlus] 
go 

--INSERT INTO [Contabilidad].[CuentaPorPagar]
--           ([idEstablecimiento]
--           ,[idTiempoCredito]
--           ,[idProveedor]
--           ,[idEstadoPago]
--           ,[codDoc]
--           ,[uniqueId]
--           ,[serieComprobante]
--           ,[identificacion]
--           ,[fechaEmision]
--           ,[fechaVencimiento]
--           ,[importeTotal]
--           ,[abono]
--           ,[idEntidad]
--           ,[idUsuario])
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