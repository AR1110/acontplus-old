USE AcontPlus

IF OBJECT_ID(N'v_Cliente', N'V')IS NOT NULL
	DROP VIEW v_Cliente
GO 

CREATE VIEW v_Cliente AS (
	SELECT cl.idCliente
		  ,cl.idEntidad
		  ,cl.idUsuario
		  ,cl.CustomerId
		  ,cl.correo
		  ,cl.direccion
		  ,cl.telefono
		  ,IIF(cs.IDType IS NULL,ti.codigoSri,cs.IDType) as IDType
		  ,IIF(cs.IDCard IS NULL,cl.numeroIdentificacion,cs.IDCard) as IDCard
		  ,IIF(cs.BusinessName IS NULL, cl.nombreComercial,cs.BusinessName) as BusinessName
		  ,IIF(cs.TradeName IS NULL, cl.nombreFiscal,cs.TradeName) as TradeName
	FROM Cliente                  cl WITH (NOLOCK)
	INNER JOIN TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
	LEFT JOIN Customer.Customer   cs WITH (NOLOCK) ON cs.Id = cl.CustomerId
)

