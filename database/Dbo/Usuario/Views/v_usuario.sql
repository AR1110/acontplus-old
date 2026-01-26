USE AcontPlus
GO
CREATE OR ALTER VIEW v_usuario AS (
	SELECT u.idUsuario
	,u.nombreUsuario
	,c.BusinessName nombreCompleto
	,c.IDCard nroIdentificacion
	,ur.estado estadoUsuario
	,ur.idUsuarioRol
	,ur.idEntidad
    ,e.uuid
	,e.ruc rucEmpresa
	,e.razonSocial entidad
    ,e.nombreComercial
    ,e.telefono
    ,e.direccion
	,r.Code codRol
	,r.[Name] rol
    ,r.Id RoleId
    ,u.correo email
    ,u.customerId
    ,ur.accesses
	FROM dbo.Usuario u WITH (NOLOCK)
	INNER JOIN App.UsuarioRol ur WITH (NOLOCK) ON u.idUsuario = ur.idUsuario
	INNER JOIN dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
	INNER JOIN Seguridad.[Role] r WITH (NOLOCK) ON ur.RoleId = r.Id
    LEFT JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
)