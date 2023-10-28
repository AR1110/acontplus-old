use [acontplus]
go 

select COUNT(*) from Contabilidad.CuentaPorCobrar where codDoc = '01'

select COUNT(*) from factura 

select COUNT(*) from Contabilidad.CuentaPorCobrar where codDoc = 'NE'

select COUNT(*) from NotaEntrega 


--INSERT INTO Contabilidad.CuentaPorCobrar
--	  (	
--	    idPuntoEmision
--		,idTiempoCredito
--		,idCliente
--		,idEstadoPago
--		,codDoc
--		,idDocumento
--		,uniqueId
--		,serieComprobante
--		,fechaEmision
--		,fechaVencimiento
--		,importeTotal
--		,abono
--		,idEntidad
--		,idUsuario
--	  )
--select f.idPuntoEmision
--      ,f.idTiempoCredito
--	  ,f.idCliente
--	  ,idEstadoDocumento = f.idEstadoPago
--	  ,codDoc = '01'
--	  ,idDocumento = f.idFactura
--	  ,uniqueId = '01' + '-' + CAST(f.idFactura as varchar)
--	  ,serieComprobante = es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(f.nroFactura)
--	  ,f.fechaEmision
--	  ,f.fechaVencimiento
--	  ,f.total
--	  ,f.abono
--	  ,f.idEntidad
--	  ,f.idUsuario
--from dbo.Factura f with (nolock)
--INNER JOIN dbo.PuntoEmision pt with (nolock) on pt.idPuntoEmision = f.idPuntoEmision
--INNER JOIN sri.Establecimiento es with (nolock) on es.codEstab = pt.codEstab
--INNER JOIN dbo.EstadoPago ep with (nolock) on ep.idEstadoPago = f.idEstadoPago
--order by f.fechaRegistro asc


--INSERT INTO Contabilidad.CuentaPorCobrar
--	  (	
--	    idPuntoEmision
--		,idTiempoCredito
--		,idCliente
--		,idEstadoPago
--		,codDoc
--		,idDocumento
--		,uniqueId
--		,serieComprobante
--		,fechaEmision
--		,fechaVencimiento
--		,importeTotal
--		,abono
--		,idEntidad
--		,idUsuario
--	  )

--select ne.idPuntoEmision
--      ,ne.idTiempoCredito
--	  ,ne.idCliente
--	  ,idEstadoDocumento = ne.idEstadoPago
--	  ,codDoc = 'NE'
--	  ,idDocumento = ne.idNotaEntrega
--	  ,uniqueId = 'NE' + '-' + CAST(ne.idNotaEntrega as varchar)
--	  ,serieComprobante = es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(ne.nroDocumento)
--	  ,ne.fechaEmision
--	  ,ne.fechaVencimiento
--	  ,ne.total
--	  ,ne.abono
--	  ,ne.idEntidad
--	  ,ne.idUsuario
--from dbo.NotaEntrega ne with (nolock)
--INNER JOIN dbo.PuntoEmision pt with (nolock) on pt.idPuntoEmision = ne.idPuntoEmision
--INNER JOIN sri.Establecimiento es with (nolock) on es.codEstab = pt.codEstab
--INNER JOIN dbo.EstadoPago ep with (nolock) on ep.idEstadoPago = ne.idEstadoPago
--order by ne.fechaRegistro asc