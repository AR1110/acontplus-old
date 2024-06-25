USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_Factura WITH SCHEMABINDING AS (

	SELECT fa.idFactura
		  ,fa.nroFactura						   as secuencial
		  ,fa.fechaEmision                         
          ,fa.idEntidad
          ,fa.idTipoDocumento
		  ,fa.idPuntoEmision
          ,fa.idCliente
          ,fa.idUsuario
          ,fa.claveAcceso
          ,fa.emision
          ,fa.fechaAutorizacion
		  ,fa.subTotalSinImpuestos
          ,fa.totalDescuento
		  ,fa.porcentajeDescuento
		  ,0 as totalIce
		  ,fa.propina
		  ,fa.recargo
		  ,fa.transporte
		  ,fa.total
		  ,ISNULL(fa.observacion, '')       as observacion
          ,fa.notaCredito
          ,fa.guiaRemision
          ,fa.estado 
          ,fa.autorizada
          ,cl.nombreFiscal                  as razonSocialComprador
          ,cl.numeroIdentificacion          as identificacionComprador
          ,cl.correo                        
          ,cl.telefono
          ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento
          ,pe.codEstab
		  ,pe.ptoEmi
          ,us.nombreUsuario
          ,cc.idCuentaPorCobrar
          ,cc.idEstadoPago
          ,cc.fechaVencimiento
          ,cc.abono                                             
          ,cc.saldo
          ,ep.descripcion                                                                              as estadoCuenta
          ,ep.codigo                                                                                   as codCuenta
          ,sf.codigo                                                                                   as estadoSri
          ,es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(fa.nroFactura AS VARCHAR(9)),9) as serieComprobante
          ,us.nombreUsuario                                                                            as usuario
          ,tc.tipo                                                                                     as tipoTiempoCredito
	FROM dbo.Factura                        fa WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision   = fa.idPuntoEmision
	INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente        = fa.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario        = fa.idUsuario
     LEFT JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idDocumento      = fa.idFactura AND cc.codDoc = '01'
     LEFT JOIN dbo.DocumentoElectronico     de WITH (NOLOCK) ON de.idDocumento      = fa.idFactura AND de.codDoc = '01'
    INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab         = pe.codEstab
     LEFT JOIN dbo.EstadoPago               ep WITH (NOLOCK) ON ep.idEstadoPago     = cc.idEstadoPago 
     LEFT JOIN dbo.TiempoCredito            tc WITH (NOLOCK) ON tc.idTiempoCredito  = cc.idTiempoCredito 
     LEFT JOIN FactElect.EstadoServicio     sf WITH (NOLOCK) ON sf.idEstadoServicio = de.idEstadoServicio
    

)