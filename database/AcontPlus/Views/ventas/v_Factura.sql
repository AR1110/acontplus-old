
USE AcontPlus

IF OBJECT_ID(N'v_Factura', N'V')IS NOT NULL
	DROP VIEW v_Factura
GO 

CREATE VIEW v_Factura AS (
	SELECT 	
		e.codEstab 
		,f.idCliente
		,f.idPuntoEmision
		,f.idEstadoPago
		,e.estab
		,pe.ptoEmi
		,f.nroFactura		
		,f.nroAutorizacion
		,f.claveAcceso
		,f.fechaEmision
		,f.fechaVencimiento
		,f.subTotalSinImpuestos
		,f.subTotalIva 
		,f.subTotalNetoIva
		,f.subTotalIvaCero
		,f.subTotalNetoIvaCero
		,f.subTotalNoObjetoIva		
		,f.subTotalExentoIva  
		,f.subTotalNetoNoObjetoIva  	
		,f.porcentajeDescuento
		,f.totalDescuento 
		,f.totalIce 
		,f.iva  
		,f.total  
		,f.observacion
		,f.autorizada
		,f.anuladaSri
		,f.guiaRemision
		,f.retencion
		,f.notaCredito
		,f.idTipoIva
		,f.porcentaje
		,f.abono
		,f.saldo

		,establecimientos = e.nombreComercial
		,razonSocialComprador = cl.nombreFiscal
		,nombreComercialComprador = cl.nombreFiscal
		,identificacionComprador = cl.numeroIdentificacion
		,estadoDocumento = ep.descripcion
		,usuario = u.nombreUsuario
	FROM Factura f
	INNER JOIN PuntoEmision       pe WITH(NOLOCK) ON pe.idPuntoEmision = f.idPuntoEmision
	INNER JOIN Sri.Establecimiento e WITH(NOLOCK) ON e.codEstab        = pe.codEstab
	INNER JOIN Cliente cl WITH(NOLOCK)  ON cl.idCliente = f.idCliente
	INNER JOIN EstadoPago         ep WITH(NOLOCK) ON ep.idEstadoPago   = f.idEstadoPago
	INNER JOIN Usuario u WITH(NOLOCK) ON u.idUsuario = f.idUsuario
)