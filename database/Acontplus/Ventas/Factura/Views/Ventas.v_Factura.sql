USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_Factura WITH SCHEMABINDING AS (

	SELECT fa.idFactura 
          ,fa.idCliente
          ,fa.idUsuario
          ,fa.emision
		  ,fa.subTotalSinImpuestos
          ,fa.totalDescuento
		  ,fa.porcentajeDescuento
		  ,0 as totalIce
		  ,fa.propina
		  ,fa.recargo
		  ,fa.transporte
		  ,fa.total
		  ,ISNULL(fa.observacion,'') as observacion
          ,fa.notaCredito
          ,fa.guiaRemision
          ,fa.estado 
          ,de.idDocumentoElectronico 
          ,de.idPuntoEmision
          ,de.claveAcceso
          ,de.fechaEmision
          ,de.nroDocumento		       as secuencial
          ,de.serieComprobante
          ,de.fechaAutorizacion
          ,cu.BusinessName             as razonSocialComprador
          ,cu.IDCard                   as identificacionComprador
          ,cl.correo                        
          ,cl.telefono
          ,es.idEntidad
          ,es.estab
          ,es.codEstab
          ,es.nombreComercial
          ,es.idEstablecimiento
		  ,pe.ptoEmi
          ,pe.ambiente
          ,us.nombreUsuario
          ,cc.idCuentaPorCobrar
          ,cc.idEstadoPago
          ,cc.fechaVencimiento
          ,cc.abono                                             
          ,cc.saldo
          ,ep.descripcion          as estadoCuenta
          ,ep.codigo               as codCuenta
          ,sf.codigo               as codEstado
          ,sf.descripcion          as estadoSri
          ,us.nombreUsuario        as usuario
          ,tc.tipo                 as tipoTiempoCredito
          ,tc.descripcion          as tiempoCredito
	FROM dbo.Factura                        fa WITH (NOLOCK)
	INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente              = fa.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario              = fa.idUsuario
     LEFT JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idDocumento            = fa.idFactura AND cc.codDoc = '01'
    INNER JOIN dbo.DocumentoElectronico     de WITH (NOLOCK) ON de.idDocumentoElectronico = fa.idDocumentoElectronico
    INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN FactElect.EstadoServicio     sf WITH (NOLOCK) ON sf.idEstadoServicio       = de.idEstadoServicio
    INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
     LEFT JOIN dbo.EstadoPago               ep WITH (NOLOCK) ON ep.idEstadoPago           = cc.idEstadoPago 
     LEFT JOIN dbo.TiempoCredito            tc WITH (NOLOCK) ON tc.idTiempoCredito        = cc.idTiempoCredito
    INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
     
    

)