USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaEntrega WITH SCHEMABINDING AS (

	SELECT ne.idNotaEntrega
		  ,ne.nroDocumento						   as secuencial
		  ,ne.fechaEmision                         as fechaEmision
          ,ne.idEntidad
          ,ne.idTipoDocumento
		  ,ne.idPuntoEmision
          ,ne.idCliente
          ,ne.idUsuario
		  ,ne.subTotalSinImpuestos
		  ,totalDescuento
		  ,porcentajeDescuento
		  ,propina
		  ,recargo
		  ,transporte
		  ,total
          ,ne.estado
          ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento
          ,pe.codEstab
		  ,pe.ptoEmi
          ,cl.nombreFiscal         as razonSocialComprador
          ,cl.numeroIdentificacion as identificacionComprador
          ,us.nombreUsuario
          ,ne.observacion
	FROM dbo.NotaEntrega                    ne WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision
	INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab       = pe.codEstab 
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario      = ne.idUsuario

)