USE [Acontplus]
GO
/****** Object:  StoredProcedure [Config].[UserPermission_Get]    Script Date: 1/4/2024 12:21:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Config.UserCustomerPermission_Get 
CREATE OR ALTER PROCEDURE Config.UserCustomerPermission_Get
    @userRoleId INT,
    @json VARCHAR(300),
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @idUsuarioRol INT
    DECLARE @tipo INT
    DECLARE @idEntidad INT

    SELECT top 1
        @idEntidad = idEntidad
    FROM v_usuario
    WHERE idUsuarioRol = @userRoleId

    SELECT
        @tipo = tipo 
		, @idUsuarioRol = idUsuarioRol
    FROM OPENJSON(@json)
	WITH(
		idUsuarioRol INT '$.idUsuarioRol'
		,tipo INT 
	)


    IF @tipo = 1
		BEGIN
        SET @tableNames ='userPermissionData,usersCustomerAdmin,permissions'


        SELECT TOP 1
            idUserPermission
        FROM Config.UserPermission
        WHERE idUsuarioRol = @idUsuarioRol


        -- Obtener datos de usuarios y roles
        SELECT
            idUsuarioRol = ur.idUsuarioRol,
            idUsuario = ur.idUsuario,
            c.businessName nombreCompleto,
            c.idCard nroIdentificacion
        FROM
            App.UsuarioRol ur
            INNER JOIN
            dbo.Usuario u ON u.idUsuario = ur.idUsuario
            INNER JOIN
            Seguridad.[Role] sr WITH(NOLOCK) ON sr.Id = ur.RoleId
            LEFT JOIN
            Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
        WHERE 
                ur.idEntidad = @idEntidad AND ur.idUsuarioRol != @idUsuarioRol AND sr.Code = 'ADM';

        -- Obtener permisos de usuario
        SELECT
            idUserPermission,
            codModule,
            permission = jsonPermission
        FROM
            Config.UserPermission
        WHERE 
                idUsuarioRol = @idUsuarioRol;

        -- Obtener permisos de UserCustomPermission no en PermissionsData
        --SELECT
        --    tb1.Id,
        --    menuId = m.Id,
        --    actionId = a.Id,
        --    nomMenu = m.[name],
        --    nomAction = a.[name],
        --    descAction = a.[Description],
        --    tb1.SecurityType
        --FROM
        --    Seguridad.UserCustomPermission AS tb1
        --    INNER JOIN
        --    Config.Menu m ON tb1.MenuId = m.Id
        --    INNER JOIN
        --    Seguridad.Actions a ON tb1.ActionId = a.Id
        --WHERE 
        --        tb1.Id NOT IN (SELECT userCustomPermissionId
        --FROM Config.v_User_Permissions v_up
        --WHERE v_up.userRoleId = @idUsuarioRol AND v_up.userCustomPermissionId = tb1.Id);

        -- Obtener permisos de UserCustomPermission en PermissionsData
        --SELECT
        --    tb1.Id,
        --    menuId = m.Id,
        --    actionId = a.Id,
        --    nomMenu = m.[name],
        --    nomAction = a.[name],
        --    descAction = a.[Description],
        --    tb1.SecurityType,
        --    pd.isActive,
        --    pd.requiresKey,
        --    pd.users
        --FROM
        --    Config.v_User_Permissions AS pd
        --    INNER JOIN
        --    Seguridad.UserCustomPermission AS tb1 ON tb1.Id = pd.userCustomPermissionId
        --    INNER JOIN
        --    Config.Menu m ON tb1.MenuId = m.Id
        --    INNER JOIN
        --    Seguridad.Actions a ON tb1.ActionId = a.Id
        --WHERE pd.userRoleId = @idUsuarioRol



    END

    IF @tipo = 2
		BEGIN
        SET @tableNames ='sales,cashAccountig,product'
        SELECT comprobante,
            detalle,
            adicionales
        FROM Config.v_user_permission_sale v_ups WITH(NOLOCK)
        WHERE v_ups.idUsuarioRol = @userRoleId

        SELECT *
        FROM Config.v_User_Permission_CashAccounting v_upca WITH(NOLOCK)
        WHERE v_upca.idUsuarioRol = @userRoleId

        SELECT *
        FROM Config.v_User_Permission_Product v_upp WITH(NOLOCK)
        WHERE v_upp.idUsuarioRol = @userRoleId
    END

END 
