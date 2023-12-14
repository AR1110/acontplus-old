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
		  ,propina
		  ,recargo
		  ,transporte
		  ,total
		  ,ISNULL(fa.observacion, '')       as observacion
          ,fa.notaCredito
          ,fa.estado 
          ,fa.autorizada
          ,cl.nombreFiscal as razonSocialComprador
          ,cl.numeroIdentificacion as identificacionComprador
          ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento
          ,pe.codEstab
		  ,pe.ptoEmi
          ,us.nombreUsuario
          ,(SELECT de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.idDocumentoElectronico = fa.idFactura AND de.codDoc = '01') as codEstado
	FROM dbo.Factura                        fa WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision = fa.idPuntoEmision
	INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab       = pe.codEstab 
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente      = fa.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario      = fa.idUsuario

)