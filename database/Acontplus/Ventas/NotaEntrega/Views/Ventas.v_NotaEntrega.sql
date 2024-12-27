USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaEntrega WITH SCHEMABINDING AS (

	SELECT ne.idNotaEntrega
		  ,ne.nroDocumento						   as secuencial
		  ,ne.fechaEmision                        
          ,ne.idEntidad
          ,ne.idTipoDocumento
		  ,ne.idPuntoEmision
          ,ne.idCliente
          ,ne.idUsuario
		  ,ne.subTotalSinImpuestos
		  ,ne.totalDescuento
		  ,ne.porcentajeDescuento
		  ,ne.propina
		  ,ne.recargo
		  ,ne.transporte
		  ,ne.total
          ,ne.estado
          ,ne.convertToDoc
          ,es.codEstab
          ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento
		  ,pe.ptoEmi
          ,cu.BusinessName                                                                                as razonSocialComprador
          ,cu.IDCard                                                                                      as identificacionComprador
          ,us.nombreUsuario
          ,ne.observacion
          ,cc.idCuentaPorCobrar
          ,cc.idEstadoPago
          ,cc.fechaVencimiento
          ,cc.abono                                             
          ,cc.saldo
          ,ep.descripcion                                                                                 as estadoCuenta
          ,ep.codigo                                                                                      as codCuenta
          ,es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(ne.nroDocumento AS VARCHAR(9)), 9) as serieComprobante
          ,us.nombreUsuario                                                                               as usuario
          ,tc.tipo                                                                                        as tipoTiempoCredito
          ,tc.descripcion                                                                                 as tiempoCredito
	FROM dbo.NotaEntrega                    ne WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision    = ne.idPuntoEmision
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente         = ne.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario         = ne.idUsuario
     LEFT JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idDocumento       = ne.idNotaEntrega AND cc.codDoc = 'NE'
     LEFT JOIN dbo.EstadoPago               ep WITH (NOLOCK) ON ep.idEstadoPago      = cc.idEstadoPago
     LEFT JOIN dbo.TiempoCredito            tc WITH (NOLOCK) ON tc.idTiempoCredito   = cc.idTiempoCredito
    INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
    INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
    

)