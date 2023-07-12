use AcontPlus
go
--USAR ESTE UNA VEZ ACTUALIZADO TODO
IF OBJECT_ID(N'v_usuario', N'V') IS NOT NULL
	DROP VIEW v_usuario
GO

--CREATE VIEW v_usuario AS (
--	SELECT u.idUsuario
--	,u.nombreUsuario
--	,u.nombreCompleto
--	,u.nroIdentificacion
--	,u.estado estadoUsuario
--	,u.registro registroUsuario
--	,u.actualizacion actualizacionUsuario
--	,ur.idUsuarioRol
--	,ur.idEntidad
--	,ur.idRol
--	,e.razonSocial entidad
--	,r.codigo codRol
--	,r.descripcion rol
--	FROM Seguridad.Usuario u WITH (NOLOCK)
--	INNER JOIN Seguridad.UsuarioRol ur WITH (NOLOCK) ON u.idUsuario = ur.idUsuario
--	INNER JOIN Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
--	INNER JOIN Seguridad.Rol r WITH (NOLOCK) ON ur.idRol = r.idRol
--)

CREATE VIEW v_usuario AS (
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
	,r.codigo codRol
	,r.descripcion rol
	FROM Usuario u WITH (NOLOCK)
	INNER JOIN App.UsuarioRol ur WITH (NOLOCK) ON u.idUsuario = ur.idUsuario
	INNER JOIN Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
	INNER JOIN Politica r WITH (NOLOCK) ON ur.idRol = r.idPolitica
) 