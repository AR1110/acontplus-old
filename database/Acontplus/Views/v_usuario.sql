use AcontPlus
GO
CREATE OR ALTER VIEW v_usuario AS (
	SELECT u.idUsuario
	,u.nombreUsuario
	,u.nombreCompleto
	,u.nroIdentificacion
	,u.estado estadoUsuario
	,ur.idUsuarioRol
	,ur.idEntidad
	,ur.idRol
	,e.ruc rucEmpresa
	,e.razonSocial entidad
    ,e.nombreComercial
    ,e.telefono
    ,e.direccion
	,r.Code codRol
	,r.[Name] rol
	FROM dbo.Usuario u WITH (NOLOCK)
	INNER JOIN App.UsuarioRol ur WITH (NOLOCK) ON u.idUsuario = ur.idUsuario
	INNER JOIN dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
	INNER JOIN AcontplusAdmin.Seguridad.[Role] r WITH (NOLOCK) ON ur.RoleId = r.Id
) 