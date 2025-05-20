USE Acontplus
GO
CREATE OR ALTER VIEW Config.vw_Solicitud_Auth_Admin_Role WITH SCHEMABINDING AS (
SELECT 
	 sa.Id as idSolicitudAutorizacion
	,ur.idUsuarioRol
	,u.idUsuario
	,u.nombreUsuario
	,cc.BusinessName 
    ,u.correo
FROM Config.SolicitudAutorizacion sa
CROSS APPLY OPENJSON(sa.AdminRolesJson) j
INNER JOIN App.UsuarioRol ur ON j.value = ur.idUsuarioRol
INNER JOIN dbo.Usuario u ON u.idUsuario = ur.idUsuario
 INNER JOIN Customer.Customer cc WITH(NOLOCK) ON cc.Id = u.customerId
  )