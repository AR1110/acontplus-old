DECLARE @uuid UNIQUEIDENTIFIER = 'C7DEF417-8B71-4EAB-B89C-B41B690C16A1'

DELETE sd FROM AcontplusAdmin.Sales.SuscripcionDetalle sd WITH (ROWLOCK)
WHERE SuscripcionId in (
    SELECT s.Id FROM AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK)
    INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON s.CompanyId = c.Id
    WHERE c.Uuid = @uuid
) 

DELETE s FROM AcontplusAdmin.Sales.Suscripcion s WITH (ROWLOCK)
    INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON s.CompanyId = c.Id
    WHERE c.Uuid = @uuid

DELETE FROM AcontplusAdmin.Config.CompanyDemoStep WHERE Uuid = @uuid
 
DELETE FROM AcontplusAdmin.Config.Company WHERE Uuid  = @uuid
 

DELETE up FROM 
Acontplus.Config.UserPermission up WITH (ROWLOCK)
INNER JOIN Acontplus.App.UsuarioRol ur WITH (NOLOCK) ON up.idUsuarioRol = ur.idUsuarioRol 
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid
 
DELETE ur FROM Acontplus.App.UsuarioRol ur WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad 
WHERE e.Uuid = @uuid


--DELETE u FROM Acontplus.dbo.Usuario u WITH (ROWLOCK)
--WHERE u.idUsuario NOT IN (SELECT idUsuario FROM Acontplus.App.UsuarioRol WITH (NOLOCK)) and idUsuario <> 12
 
DELETE s FROM Acontplus.Config.Sistema s WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON s.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid

DELETE s FROM Acontplus.dbo.ConfigVentaDetalle s WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON s.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid

DELETE s FROM Acontplus.dbo.Tarifa s WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON s.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid

DELETE FROM Acontplus.dbo.Entidad WHERE Uuid = @uuid