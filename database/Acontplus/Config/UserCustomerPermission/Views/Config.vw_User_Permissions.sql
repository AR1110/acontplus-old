USE Acontplus
GO 

CREATE OR ALTER VIEW Config.vw_User_Permissions
AS
SELECT  
    userRoleId = up.idUsuarioRol,
    perm.userCustomPermissionId,
    menuCode = m.Code,
    subMenuCode = sm.Code,
    [name] = a.[Name],  
    perm.[enabled],
    perm.requiresKey,
    perm.users
FROM 
    Config.UserPermission up
CROSS APPLY 
    OPENJSON (up.permissionsData)
    WITH (
        userCustomPermissionId INT,
        [enabled] BIT,
        requiresKey BIT,
        users NVARCHAR(MAX) '$.users' AS JSON
    ) AS perm
INNER JOIN 
    AcontplusAdmin.Seguridad.UserCustomPermission ucp ON ucp.Id = perm.userCustomPermissionId
INNER JOIN 
    AcontplusAdmin.Config.Menu m ON ucp.MenuId = m.Id
LEFT JOIN  
    AcontplusAdmin.Config.SubMenu sm ON ucp.SubMenuId = sm.Id
INNER JOIN 
    AcontplusAdmin.Seguridad.Actions a ON ucp.ActionId = a.Id
WHERE up.permissionsData IS NOT NULL
