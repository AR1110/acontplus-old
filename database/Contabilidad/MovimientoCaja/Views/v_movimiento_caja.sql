USE AcontPlus
GO
CREATE OR ALTER VIEW v_movimiento_caja AS (
	SELECT mc.idMovimientoCaja
	      ,mc.fechaEmision							
	      ,mc.nroDoc
          ,mc.valor
	      ,mc.observaciones as observacion
          ,en.razonSocial
	      ,en.ruc
	      ,es.nombreComercial
	      ,es.dirEstablecimiento
	      ,es.estab 
	      ,td.descripcion                                   as tipoDoc
	      ,td.codigo                                        as codDoc
	      ,ef.descripcion                                   as entidadFinanciera
	      ,us.nombreUsuario	                                as usuario
	      ,CASE td.codigo WHEN 'EC' THEN se.BusinessName
						  WHEN 'IC' THEN si.BusinessName
		   END											    as empleado
		  ,CASE td.codigo WHEN 'EC' THEN se.IDCard
						  WHEN 'IC' THEN si.IDCard
		  END											    as nroIdentificacion
	FROM dbo.MovimientoCaja             mc WITH (NOLOCK)
	INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = mc.idEntidad
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = mc.idEstablecimiento
	INNER JOIN dbo.SubEntidadFinanciera ef WITH (NOLOCK) ON ef.idSubEntidadFinanciera = mc.idSubEntidadFinanciera	
	INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.idTipoDocumento        = mc.idTipoDocumento 
	INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario              = mc.idUsuarioRegister
     LEFT JOIN dbo.ComprobanteIngreso   ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = mc.idComprobanteIngreso
	 LEFT JOIN dbo.ComprobanteEgreso    ce WITH (NOLOCK) ON ce.idComprobanteEgreso    = mc.idComprobanteEgreso
	 LEFT JOIN Customer.Customer        si WITH (NOLOCK) ON si.Id					  = ci.CustomerId
	 LEFT JOIN Customer.Customer		se WITH (NOLOCK) ON se.Id					  = ce.CustomerId
 )
