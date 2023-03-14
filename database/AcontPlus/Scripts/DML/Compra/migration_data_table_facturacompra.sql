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

-- SELECT 
--	 e.idEstablecimiento
--	,fc.idTiempoCredito 
--	,fc.idProveedor
--	,fc.idEstadoPago
--	,codDoc = 'FC'
--	,uniqueId
--	,serieComprobante = fc.puntoEmision+'-'+Helper.F_Auto_Sequential(fc.nroDocumento)
--	,p.numeroIdentificacion
--	,fechaEmision
--	,fechaVencimiento
--	,total
--	,abono
--	,fc.idEntidad
--	,fc.idUsuario
--FROM FacturaCompra fc
--INNER JOIN Proveedor p ON p.idProveedor = fc.idProveedor
--INNER JOIN Sri.Establecimiento e ON e.codEstab = fc.codEstab

SELECT * FROM Contabilidad.CuentaPorPagar
