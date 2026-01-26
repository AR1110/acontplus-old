USE [Acontplus]
GO
/****** Object:  StoredProcedure [App].[aspUsuarioRol_GetId]    Script Date: 30/3/2024 23:35:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================

CREATE OR ALTER PROCEDURE Config.UserCustomerRole_Get
    @userRoleId INT,
    @json NVARCHAR(MAX),
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT

    -->Filters 
    DECLARE @idUsuario INT ,@idUsuarioRol INT ,@idEntidad INT

    -->Variables
    SELECT @tipo = tipo
    FROM OPENJSON(@json) WITH(idUsuario INT, tipo INT)

    SELECT TOP 1
        @idEntidad = idEntidad
    FROM App.UsuarioRol WITH (NOLOCK)
    WHERE idUsuarioRol = @userRoleId

    IF @tipo = 1
		BEGIN
        SET @tableNames='userCustomerRoles'

        SELECT @idUsuario = idUsuario
        FROM OPENJSON(@json) WITH(idUsuario INT)

        SELECT ur.idUsuarioRol
				  , ur.idUsuario
				  , ur.idEntidad
				  , u.nombreUsuario
				  , c.IDCard nroIdentificacion
				  , e.ruc
				  , e.razonSocial
				  , ur.estado
                  , sr.[Name] as roleName
        FROM App.UsuarioRol ur
            INNER JOIN dbo.Usuario                      u WITH(NOLOCK) ON u.idUsuario = ur.idUsuario
            INNER JOIN Seguridad.[Role] sr WITH(NOLOCK) ON sr.Id       = ur.RoleId
            INNER JOIN dbo.Entidad                      e WITH(NOLOCK) ON e.idEntidad = ur.idEntidad
            LEFT JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
        WHERE ur.idUsuario = @idUsuario
            AND ur.idEntidad = @idEntidad
            AND ur.estado = 1

        RETURN
    END

    --> Suscripcion
    IF @tipo = 2
        BEGIN
        SET @tableNames = 'menus,actions'

        SELECT @idUsuarioRol = idUsuarioRol
        FROM OPENJSON(@json) WITH(idUsuarioRol INT)

        DECLARE @CurrentSubscriptionId INT;
        -- Tabla temporal para almacenar las acciones habilitadas y no habilitadas
        DECLARE @tbParsedActions TABLE (
            menuId INT,
            id INT,
            code VARCHAR(30),
            [name] NVARCHAR(100),
            [description] NVARCHAR(100),
            [enabled] BIT
            );

        -- Obtener la suscripción más reciente habilitada
        SELECT TOP 1
            @CurrentSubscriptionId = s.Id
        FROM Sales.Suscripcion s WITH (NOLOCK)
            INNER JOIN Config.Company ccc WITH (NOLOCK)
            ON s.CompanyId = ccc.Id
            INNER JOIN dbo.Entidad enn WITH (NOLOCK)
            ON enn.Uuid = ccc.Uuid
        WHERE enn.idEntidad = @idEntidad
            AND s.[IsActive] = 1
        ORDER BY s.Id DESC;

        -- Insertar las acciones habilitadas desde el JSON de acceso del usuario
        INSERT INTO @tbParsedActions
            (menuId, id, code, [name],[description], [enabled])
        SELECT
            TRY_CAST(JSON_VALUE(j.value, '$.menuId') AS INT),
            TRY_CAST(JSON_VALUE(actions.value, '$.id') AS INT),
            TRY_CAST(JSON_VALUE(actions.value, '$.code') AS VARCHAR(30)),
            JSON_VALUE(actions.value, '$.name'),
            JSON_VALUE(actions.value, '$.description'),
            1
        -- Habilitado
        FROM App.UsuarioRol AS t
            CROSS APPLY OPENJSON(t.accesses) AS j
           -- CROSS APPLY OPENJSON(JSON_VALUE(j.value, '$.actions')) AS actions
             OUTER APPLY OPENJSON(NULLIF(JSON_VALUE(j.value, '$.actions'), '[]')) AS actions
        WHERE t.idUsuarioRol = @idUsuarioRol
            AND t.Accesses IS NOT NULL;

        -- Todas las acciones activas y no activas de la Licencia por usuario rol 
        INSERT INTO @tbParsedActions
            (menuId, id, code, [name],[description], [enabled])
        SELECT
            lad.menuId,
            TRY_CAST(JSON_VALUE(action.value, '$.id') AS INT),
            TRY_CAST(JSON_VALUE(action.value, '$.code') AS VARCHAR(30)),
            JSON_VALUE(action.value, '$.name'),
            JSON_VALUE(action.value, '$.description'),
            CAST(CASE WHEN urr.Accesses IS NULL THEN 1 ELSE 0 END AS BIT)
        FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)
            INNER JOIN Config.Menu m WITH (NOLOCK)
            ON lad.MenuId = m.Id
            INNER JOIN Config.Aplicacion a WITH (NOLOCK)
            ON m.AplicacionId = a.Id
            INNER JOIN Seguridad.LicenciaAcceso la WITH (NOLOCK)
            ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
            INNER JOIN Config.LicenciaDetalle ld WITH (NOLOCK)
            ON a.Id = ld.AplicacionId AND ld.LicenciaId = la.LicenciaId
            INNER JOIN Sales.SuscripcionDetalle sd WITH (NOLOCK)
            ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
            INNER JOIN Sales.Suscripcion s WITH (NOLOCK)
            ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
            INNER JOIN Config.Company cc WITH (NOLOCK)
            ON s.CompanyId = cc.Id
            INNER JOIN dbo.Entidad en WITH (NOLOCK)
            ON cc.Uuid = en.Uuid
            INNER JOIN App.UsuarioRol urr WITH (NOLOCK)
            ON la.RoleId = urr.RoleId AND urr.idEntidad = en.idEntidad
          --  CROSS APPLY OPENJSON(lad.Actions) AS action
          OUTER APPLY 
        -- Si Actions es NULL o [], se genera una fila con NULL:
        (SELECT *
            FROM OPENJSON(NULLIF(lad.Actions, '[]'))) AS action
        WHERE urr.idUsuarioRol = @idUsuarioRol
            AND sd.SuscripcionId = @CurrentSubscriptionId
            AND NOT EXISTS (
                  SELECT 1
            FROM @tbParsedActions tba
            WHERE tba.code = JSON_VALUE(action.[value], '$.code')
                AND tba.menuId = m.Id
              )
        ORDER BY m.[Order];


        -- Insertar las acciones no habilitadas desde la licencia por session usuario rol
        INSERT INTO @tbParsedActions
            (menuId, id, code, [name],[description], [enabled])
        SELECT
            lad.menuId,
            TRY_CAST(JSON_VALUE(action.value, '$.id') AS INT),
            TRY_CAST(JSON_VALUE(action.value, '$.code') AS VARCHAR(30)),
            JSON_VALUE(action.value, '$.name'),
            JSON_VALUE(action.value, '$.description'),
            0
        -- No habilitado
        FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)
            INNER JOIN Config.Menu m WITH (NOLOCK)
            ON lad.MenuId = m.Id
            INNER JOIN Config.Aplicacion a WITH (NOLOCK)
            ON m.AplicacionId = a.Id
            INNER JOIN Seguridad.LicenciaAcceso la WITH (NOLOCK)
            ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
            INNER JOIN Config.LicenciaDetalle ld WITH (NOLOCK)
            ON a.Id = ld.AplicacionId AND ld.LicenciaId = la.LicenciaId
            INNER JOIN Sales.SuscripcionDetalle sd WITH (NOLOCK)
            ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
            INNER JOIN Sales.Suscripcion s WITH (NOLOCK)
            ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
            INNER JOIN Config.Company cc WITH (NOLOCK)
            ON s.CompanyId = cc.Id
            INNER JOIN dbo.Entidad en WITH (NOLOCK)
            ON cc.Uuid = en.Uuid
            INNER JOIN App.UsuarioRol urr WITH (NOLOCK)
            ON la.RoleId = urr.RoleId AND urr.idEntidad = en.idEntidad
        --    CROSS APPLY OPENJSON(lad.Actions) AS action
         OUTER APPLY 
        -- Si Actions es NULL o [], se genera una fila con NULL:
        (SELECT *
            FROM OPENJSON(NULLIF(lad.Actions, '[]'))) AS action
        WHERE urr.idUsuarioRol = @userRoleId
            AND sd.SuscripcionId = @CurrentSubscriptionId
            AND NOT EXISTS (
                  SELECT 1
            FROM @tbParsedActions tba
            WHERE tba.code = JSON_VALUE(action.[value], '$.code')
                AND tba.menuId = m.Id
              )
        ORDER BY m.[Order];

        -- Resultado final agrupado por submenú y menú
        SELECT
            m.id AS menuId,
            m.code,
            m.[Name],
            Actions = (
                       SELECT *
            FROM @tbParsedActions tba
            WHERE tba.menuId = m.Id
            FOR JSON PATH
                   ),
            m.code AS menuCode,
            m.[Name] AS menuName,
            m.parentId
        FROM Seguridad.LicenciaAccesoDetalle lad
            INNER JOIN Config.Menu m ON lad.MenuId = m.Id
            INNER JOIN Config.Aplicacion a ON m.AplicacionId = a.Id
            INNER JOIN Seguridad.LicenciaAcceso la ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
            INNER JOIN Config.LicenciaDetalle ld ON a.Id = ld.AplicacionId AND ld.LicenciaId = la.LicenciaId
            INNER JOIN Sales.SuscripcionDetalle sd ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
            INNER JOIN Sales.Suscripcion s ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
            INNER JOIN Config.Company cc ON s.CompanyId = cc.Id
            INNER JOIN dbo.Entidad en ON cc.Uuid = en.Uuid
            INNER JOIN App.UsuarioRol urr ON la.RoleId = urr.RoleId AND urr.idEntidad = en.idEntidad
        WHERE urr.idUsuarioRol = @userRoleId
            AND sd.SuscripcionId = @CurrentSubscriptionId
            AND lad.menuId IN (SELECT menuId
            FROM @tbParsedActions)
        ORDER BY m.[Order];


        SELECT Id, Code, Name, Description
        FROM [Seguridad].[Actions] WITH (NOLOCK)
        WHERE [IsActive] = 1
            AND IsDeleted =0

        RETURN
    END
END
