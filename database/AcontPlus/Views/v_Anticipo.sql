USE AcontPlus
GO
IF OBJECT_ID(N'v_Anticipo', N'V') IS NOT NULL
DROP VIEW v_Anticipo
GO
CREATE VIEW v_Anticipo AS (
	SELECT 
		entidad    = e.razonSocial
		,establecimiento  = s.nombreComercial
		,e.ruc
		,s.dirEstablecimiento
		,s.estab
		,a.idAnticipo
		,a.fechaEmision
		,a.valor
		,a.observaciones
		,a.nroDoc
		,cl.numeroIdentificacion
		,cliente = cl.nombreFiscal
		,direccionCliente = cl.direccion
		,entidadFinanciera = sef.descripcion
		,estadoDoc = ep.descripcion
		,codDoc = ep.codigo
		,u.nombreUsuario
	FROM dbo.Anticipo a WITH (NOLOCK)
	INNER JOIN dbo.Entidad e WITH(NOLOCK) ON e.idEntidad = a.idEntidad 
	INNER JOIN dbo.EstadoPago            ep WITH (NOLOCK) ON ep.idEstadoPago            = a.idEstadoDocumento
	INNER JOIN Sri.Establecimiento        s WITH (NOLOCK) ON s.codEstab                 = a.codEstab
	INNER JOIN dbo.TipoDocumento         td WITH (NOLOCK) ON td.idTipoDocumento         = a.idTipoDocumento
	INNER JOIN dbo.Cliente               cl WITH (NOLOCK) ON cl.idCliente               = a.idCliente
	INNER JOIN dbo.SubEntidadFinanciera sef WITH (NOLOCK) ON sef.idSubEntidadFinanciera = a.idSubEntidadFinanciera
	INNER JOIN dbo.Usuario                u WITH (NOLOCK) ON u.idUsuario                = a.idUsarioRegister
							 
 )
