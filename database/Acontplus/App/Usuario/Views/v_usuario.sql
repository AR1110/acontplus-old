use AcontPlus
GO
CREATE OR ALTER VIEW v_usuario AS (
	SELECT us.idUsuario
	      ,us.nombreUsuario
	      ,us.nombreCompleto
	      ,us.nroIdentificacion
	      ,us.estado          as estadoUsuario
	      ,ur.idUsuarioRol
	      ,ur.idEntidad
	      ,en.ruc             as rucEmpresa
	      ,en.razonSocial     as entidad
          ,en.nombreComercial
          ,en.telefono
          ,en.direccion
	      ,ro.Code            as codRol
	      ,ro.[Name]          as rol
          ,ro.Id              as RoleId
	FROM dbo.Usuario                           us WITH (NOLOCK)
	INNER JOIN App.UsuarioRol                  ur WITH (NOLOCK) ON ur.idUsuario = us.idUsuario
	INNER JOIN dbo.Entidad                     en WITH (NOLOCK) ON en.idEntidad = ur.idEntidad
	INNER JOIN AcontplusAdmin.Seguridad.[Role] ro WITH (NOLOCK) ON ro.Id        = ur.RoleId 
) 