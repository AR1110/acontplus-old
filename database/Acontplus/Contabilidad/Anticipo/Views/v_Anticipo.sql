USE AcontPlus
GO
CREATE OR ALTER VIEW v_Anticipo AS (
	SELECT en.razonSocial     as entidad
		  ,es.nombreComercial as establecimiento
		  ,en.ruc
		  ,es.dirEstablecimiento
		  ,es.estab
		  ,an.idAnticipo
		  ,an.fechaEmision
		  ,an.valor
		  ,an.observaciones
		  ,an.nroDoc
		  ,cu.IDCard                                                                                                                     as numeroIdentificacion
		  ,cu.BusinessName                                                                                                               as nombreFiscal
		  ,(SELECT TOP 1 cl.direccion FROM Cliente cl WITH (NOLOCK) WHERE cl.CustomerId = ci.CustomerId AND cl.idEntidad = ci.idEntidad) as direccionCliente
		  ,(SELECT TOP 1 cl.telefono  FROM Cliente cl WITH (NOLOCK) WHERE cl.CustomerId = ci.CustomerId AND cl.idEntidad = ci.idEntidad) as telefonoCliente
		  ,ef.descripcion                                                                                                                as entidadFinanciera
		  ,us.nombreUsuario                                                                                                              
		  ,uc.IDCard                                                                                                                     as identificacionUsuario
          ,CASE WHEN ci.estado = 0 THEN 'Anulado' ELSE 'Activo' END                                                                      as estadoDoc
	FROM dbo.Anticipo                    an WITH (NOLOCK)
	INNER JOIN dbo.Entidad               en WITH(NOLOCK)  ON en.idEntidad              = an.idEntidad 
	INNER JOIN Sri.Establecimiento       es WITH (NOLOCK) ON es.idEstablecimiento      = an.idEstablecimiento
	INNER JOIN dbo.SubEntidadFinanciera  ef WITH (NOLOCK) ON ef.idSubEntidadFinanciera = an.idSubEntidadFinanciera
	INNER JOIN dbo.Usuario               us WITH (NOLOCK) ON us.idUsuario              = an.idUsarioRegister
    INNER JOIN dbo.ComprobanteIngreso    ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = an.idComprobanteIngreso
    INNER JOIN Customer.Customer         cu WITH (NOLOCK) ON cu.Id                     = ci.CustomerId
    INNER JOIN Customer.Customer         uc WITH (NOLOCK) ON uc.Id                     = us.customerId
							 
 )
