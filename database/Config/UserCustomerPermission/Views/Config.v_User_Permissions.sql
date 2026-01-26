USE Acontplus
GO

CREATE OR ALTER VIEW Config.v_User_Permissions
AS
    SELECT
        userRoleId = up.idUsuarioRol,
        perm.userCustomPermissionId,
        menuCode = m.Code,
        [name] = a.[Name],
        perm.[isActive],
        perm.requiresKey,
        perm.users
    FROM
        Config.UserPermission up
CROSS APPLY 
    OPENJSON (up.permissionsData)
    WITH (
        userCustomPermissionId INT,
        isActive BIT,
        requiresKey BIT,
        users NVARCHAR(MAX) '$.users' AS JSON
    ) AS perm
        INNER JOIN
        Seguridad.UserCustomPermission ucp ON ucp.Id = perm.userCustomPermissionId
        INNER JOIN
        Config.Menu m ON ucp.MenuId = m.Id
        INNER JOIN
        Seguridad.Actions a ON ucp.ActionId = a.Id
    WHERE up.permissionsData IS NOT NULL
