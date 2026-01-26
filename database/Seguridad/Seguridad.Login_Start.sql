USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Seguridad].[Login_Start]    Script Date: 06/30/2023 8:49:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--[Seguridad].[Login_Start] 'davilaj', 'ALEX123*'

CREATE OR ALTER PROCEDURE [Seguridad].[Login_Start] @username NVARCHAR(150) ,@password NVARCHAR(150)
AS
BEGIN
	SET NOCOUNT ON;
    --SET START OF WEEK ON SUNDAY
    SET DATEFIRST 7;

     DECLARE @userId INT 
	    ,@encryptedPassword BINARY(64)
        ,@totalSchedule INT
        ,@totalProhibitedRoles INT
        ,@totalProhibitedRolesWithoutSchedule INT
        ,@needAuthorization BIT = 0
        ,@dayOfWeek INT
        ,@Uuid UNIQUEIDENTIFIER = NEWID()

    SET @dayOfWeek = (SELECT DATEPART(weekday, GETDATE()))
	SET @encryptedPassword = HASHBYTES('SHA2_512', @password)

	IF EXISTS (SELECT 1 FROM dbo.Usuario WITH(NOLOCK) WHERE nombreUsuario = @username AND contrasenia = @encryptedPassword AND estado = 1)
		BEGIN
            SELECT @userId = idUsuario FROM dbo.Usuario WITH(NOLOCK) WHERE nombreUsuario = @username AND contrasenia = @encryptedPassword

            IF NOT EXISTS (SELECT TOP 1 1 FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuario = @userId AND estado = 1)
                BEGIN
                    SELECT '0' code, 'El usuario existe, pero aun no esta asignado a ninguna empresa.' as 'message'
                    RETURN
                END

            IF NOT EXISTS (SELECT TOP 1 1 FROM App.UsuarioRol ur WITH (NOLOCK) 
                                            INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                                            INNER JOIN Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid
                                            INNER JOIN Sales.Suscripcion s WITH (NOLOCK) ON c.Id = s.CompanyId
                                            WHERE ur.idUsuario = @userId
                                                AND GETDATE() BETWEEN s.StartDate AND s.EndDate
                                                AND s.[IsActive] = 1
                                            ORDER BY s.StartDate DESC
                            )
                BEGIN
                    SELECT '0' code, 'Usted no posee una suscripcion vigente, comuniquese con el departamento de ventas!' as 'message'
                    RETURN
                END

            SET @totalSchedule = ISNULL((SELECT COUNT(*) FROM Acontplus.App.UsuarioRol ur WITH (NOLOCK) 
                                            INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                                            INNER JOIN Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid 
                                            INNER JOIN Seguridad.ScheduleCompany sc WITH (NOLOCK) ON c.Id = sc.CompanyId
                                            WHERE ur.idUsuario = @userId
                                            AND sc.[IsActive] = 1
                                            ), 0)
            
            SET @totalProhibitedRoles = (SELECT COUNT(*) FROM Acontplus.App.UsuarioRol ur WITH (NOLOCK) 
                                                         INNER JOIN Seguridad.[Role] r WITH (NOLOCK) ON ur.RoleId = r.Id
                                                         WHERE ur.idUsuario = @userId 
                                                            AND r.Code IN ('CAJ','VEN','VENB','TRA','CB','ARE')
                                                            AND ur.estado = 1
                                                         
                                         )
            SET @totalProhibitedRolesWithoutSchedule = (SELECT COUNT(*) FROM Acontplus.App.UsuarioRol ur WITH (NOLOCK) 
                                                         INNER JOIN Seguridad.[Role] r WITH (NOLOCK) ON ur.RoleId = r.Id
                                                         WHERE ur.idUsuario = @userId 
                                                            AND r.Code IN ('CON')
                                                            AND ur.estado = 1
                                                         
                                         )

            IF ((@totalSchedule > 0 AND @totalProhibitedRoles > 0) OR @totalProhibitedRolesWithoutSchedule > 0)
                BEGIN
                    IF NOT EXISTS (SELECT TOP 1 1 FROM Acontplus.App.UsuarioRol ur WITH (NOLOCK) 
                                            INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                                            INNER JOIN Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid 
                                            INNER JOIN Seguridad.ScheduleCompany sc WITH (NOLOCK) ON c.Id = sc.CompanyId
                                            INNER JOIN Common.Schedule s WITH (NOLOCK) ON sc.ScheduleId = s.Id
                                            INNER JOIN Common.Dia d  WITH (NOLOCK) ON s.DayId = d.Id
                                            WHERE ur.idUsuario = @userId
                                                AND ur.estado = 1
                                                AND d.NumberDay = @dayOfWeek
                                                AND CONVERT(TIME(7), GETDATE()) BETWEEN sc.StartTime AND sc.EndTime)
                        BEGIN
                            SET @needAuthorization = 1
                            IF (@totalProhibitedRoles = 1 OR @totalProhibitedRolesWithoutSchedule = 1)
                                BEGIN
                                    DECLARE @userRoleId INT
                                    SET @userRoleId = (SELECT TOP 1 idUsuarioRol FROM Acontplus.App.UsuarioRol ur WITH (NOLOCK) 
                                                         INNER JOIN Seguridad.[Role] r WITH (NOLOCK) ON ur.RoleId = r.Id
                                                         WHERE ur.idUsuario = @userId  
                                                            AND ur.estado = 1)

                                     EXEC Acontplus.Seguridad.AccessAuthorization_Insert @uuid, @userRoleId, 0
                                END
                        END
                END  

            SELECT '1' code
                ,'Login correcto' as 'message' 
                ,payload = (SELECT userId  = ur.idUsuario
                        ,userRoleId     = ur.idUsuarioRol
                        ,codeRole       = r.Code
                        ,[role]         = r.[Name]
			            ,username       = u.nombreUsuario
			            ,fullname       = ISNULL(c.businessName, '')
                        ,email          = u.correo
			            ,IDCardUser     = ISNULL(c.IDCard, '')
			            ,profilePicture = ''
			            ,businessName      = e.razonSocial
			            ,tradeName   = e.nombreComercial
			            ,IDCardCompany  = e.ruc
				        ,companyId      = e.idEntidad
                        ,latestVersion = '20240430'
                        ,@needAuthorization NeedAuthorization
                        ,@Uuid uuid
                        ,menus = 
                              JSON_QUERY(CASE WHEN ur.Accesses IS NULL THEN  
                                                                    (
                                                                        SELECT  m.id
                                                                            ,m.code
	                                                                        ,m.[url]
	                                                                        ,isnull(m.icon, '') icon
	                                                                        ,m.[name]
	                                                                        ,m.ParentId parentId
                                                                            ,isnull(lad.actions, '[]') actions
                                                                        FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)
	                                                                    INNER JOIN Config.Menu                 m WITH (NOLOCK) ON lad.MenuId = m.Id
	                                                                    INNER JOIN Config.Aplicacion         a WITH (NOLOCK) ON m.AplicacionId = a.Id 
                                                                        INNER JOIN Seguridad.LicenciaAcceso la WITH (NOLOCK) ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
	                                                                    INNER JOIN Config.LicenciaDetalle   ld WITH (NOLOCK) ON a.Id = ld.AplicacionId  AND ld.LicenciaId = la.LicenciaId
	                                                                    INNER JOIN Sales.SuscripcionDetalle sd WITH (NOLOCK) ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
	                                                                    INNER JOIN Sales.Suscripcion         s WITH (NOLOCK) ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
	                                                                    INNER JOIN Config.Company           cc WITH (NOLOCK) ON s.CompanyId = cc.Id
	                                                                    INNER JOIN Acontplus.dbo.Entidad                   en WITH (NOLOCK) ON cc.Uuid = en.Uuid
	                                                                    INNER JOIN Acontplus.App.UsuarioRol          urr WITH (NOLOCK) ON la.RoleId = urr.RoleId AND urr.idEntidad = en.idEntidad
                                                                        WHERE urr.idUsuarioRol = ur.idUsuarioRol AND m.Code NOT IN('POS')
	                                                                    AND sd.SuscripcionId = (SELECT TOP 1 s.Id FROM Sales.Suscripcion s WITH (NOLOCK) 
                                                                                                                INNER JOIN Config.Company ccc WITH (NOLOCK) ON s.CompanyId = ccc.Id
                                                                                                                INNER JOIN Acontplus.dbo.Entidad enn WITH (NOLOCK) ON enn.Uuid = ccc.Uuid 
                                                                                                                WHERE enn.idEntidad = ur.idEntidad
                                                                                                                AND s.[IsActive] = 1
							                                                                    ORDER BY s.Id DESC
							                                                                    )
                                                                            GROUP BY m.Id 
                                                                                ,m.Code
	                                                                            ,m.[Url]
	                                                                            ,m.Icon
	                                                                            ,m.[Name]
	                                                                            ,m.ParentId 
                                                                                ,m.[Order]
                                                                                ,lad.Actions
                                                                            ORDER BY m.[Order]     
                                                                            FOR JSON PATH
                                                                    )

                                                                ELSE
                                                                    ( 
                                                                    SELECT *
                                                                    FROM (
                                                                        -- Menús con acciones asignadas
                                                                        SELECT 
                                                                            me.id,
                                                                            me.code,
                                                                            me.[url],
                                                                            ISNULL(me.icon, '') AS icon,
                                                                            me.[name],
                                                                            me.ParentId AS parentId,
                                                                            ISNULL(ua.Actions, '[]') AS actions
                                                                        FROM Config.v_UserRole_Accesses ua WITH (NOLOCK)
                                                                        INNER JOIN Config.Menu me WITH (NOLOCK) 
                                                                            ON me.Id = ua.MenuId
                                                                        WHERE ua.idUsuarioRol = ur.idUsuarioRol
                                                                          AND me.Code NOT IN ('POS')

                                                                        UNION ALL

                                                                        -- Menús sin acciones asignadas (temporal)
                                                                        SELECT
                                                                            me.id,
                                                                            me.code,
                                                                            me.[url],
                                                                            ISNULL(me.icon, '') AS icon,
                                                                            me.[name],
                                                                            me.ParentId AS parentId,
                                                                            '[]' AS actions
                                                                        FROM Config.Menu me WITH (NOLOCK)
                                                                        WHERE EXISTS (
                                                                            SELECT 1
                                                                            FROM Config.v_UserRole_Accesses ur
                                                                            WHERE ur.idUsuarioRol = ur.idUsuarioRol
                                                                              AND ur.ParentId = me.Id
                                                                        )
                                                                    ) AS Menus
                                                                    ORDER BY Menus.id
                                                                    FOR JSON PATH



                                                                    )
                            END)					  
                          ,[permissions] = (SELECT 
													sales = (SELECT comprobante, 
																	detalle, 
																	adicionales 
																	FROM Acontplus.Config.v_user_permission_sale v_ups WITH(NOLOCK)
																	WHERE v_ups.idUsuarioRol = ur.idUsuarioRol  FOR JSON PATH)
													,cashAccounting = (SELECT * FROM Config.v_User_Permission_CashAccounting v_upca WITH(NOLOCK)
																			   WHERE v_upca.idUsuarioRol = ur.idUsuarioRol FOR JSON PATH
																	 )
												    ,product = (SELECT * FROM Acontplus.Config.v_User_Permission_Product v_upp WITH(NOLOCK)	
																		 WHERE v_upp.idUsuarioRol = ur.idUsuarioRol FOR JSON PATH)
													FOR JSON PATH

											  )
                           
				          FROM Acontplus.App.UsuarioRol ur WITH(NOLOCK)
				          INNER JOIN Acontplus.dbo.Entidad e WITH(NOLOCK) ON e.idEntidad = ur.idEntidad
				          INNER JOIN Acontplus.dbo.Usuario u WITH(NOLOCK) ON ur.idUsuario = u.idUsuario
                          LEFT JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
				          INNER JOIN Seguridad.[Role] r WITH(NOLOCK) ON ur.RoleId = r.Id
                          INNER JOIN Config.Company cc WITH (NOLOCK) ON e.Uuid = cc.Uuid
                          INNER JOIN Sales.Suscripcion s WITH (NOLOCK) ON cc.Id = s.CompanyId
				          WHERE ur.estado = 1
                                AND ur.idUsuario = @userId
                                 AND GETDATE() BETWEEN s.StartDate AND s.EndDate
                                                AND s.[IsActive] = 1
                FOR JSON PATH)
		END
	ELSE 
		BEGIN
			SELECT '0' code, 'Usuario o Contraseña incorrectos.' as 'message'
		END
END
