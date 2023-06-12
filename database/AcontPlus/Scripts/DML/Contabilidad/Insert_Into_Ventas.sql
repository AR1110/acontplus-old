use [acontplus]
go 

select COUNT(*) from Contabilidad.CuentaPorCobrar where codDoc = '01'

select COUNT(*) from NotaEntrega 

--INSERT INTO Contabilidad.CuentaPorCobrar
--	  (	
--	    idEstablecimiento
--		,idTiempoCredito
--		,idCliente
--		,idEstadoDocumento
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
select es.idEstablecimiento
      ,f.idTiempoCredito
	  ,f.idCliente
	  ,idEstadoDOcumento = (select ed.idEstadoDocumento from Catalogo.estadodocumento ed with (nolock) where ed.codigo = ep.codigo)
	  ,codDoc = '01'
	  ,idDocumento = f.idFactura
	  ,uniqueId = 'FE' + CAST(YEAR(f.fechaRegistro) AS varchar) + Helper.F_Auto_Sequential( CAST(ROW_NUMBER() OVER(PARTITION BY YEAR(f.fechaRegistro) ORDER BY f.fechaRegistro ASC) AS varchar))
	  ,serieComprobante = es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(f.nroFactura)
	  ,f.fechaEmision
	  ,f.fechaVencimiento
	  ,f.total
	  ,f.abono
	  ,f.idEntidad
	  ,f.idUsuario
from dbo.Factura f with (nolock)
INNER JOIN dbo.PuntoEmision pt with (nolock) on pt.idPuntoEmision = f.idPuntoEmision
INNER JOIN sri.Establecimiento es with (nolock) on es.codEstab = pt.codEstab
INNER JOIN dbo.EstadoPago ep with (nolock) on ep.idEstadoPago = f.idEstadoPago
order by f.fechaRegistro asc
