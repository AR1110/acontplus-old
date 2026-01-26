USE [Acontplus]
GO
/****** Object:  StoredProcedure [Seguridad].[Login_Restaurant]    Script Date: 6/10/2025 15:08:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- EXEC Seguridad.Login_Restaurant 'fatima.macias','Fm1245'
--- EXEC Seguridad.Login_Restaurant 'edinson.romero','edi12345'
--- EXEC Seguridad.Login_Restaurant 'Carlos.e','carlos25*'
ALTER   PROCEDURE [Seguridad].[Login_Restaurant] @username NVARCHAR(150)
    ,@password NVARCHAR(150)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @userId INT 
	       ,@passwordEncryptada BINARY(64) 
           ,@count              INT 

	SET @passwordEncryptada = HASHBYTES('SHA2_512', @password)

	IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE nombreUsuario = @username AND contrasenia = @passwordEncryptada)
		BEGIN
            SELECT @userId = idUsuario FROM dbo.Usuario WITH(NOLOCK) WHERE nombreUsuario = @username AND contrasenia = @passwordEncryptada
			
            SELECT @count =  COUNT(DISTINCT r.idUsuarioRol) 
            FROM App.UsuarioRol                                     r WITH (NOLOCK)
            INNER JOIN dbo.Entidad                                  e WITH (NOLOCK) ON e.idEntidad   = r.idEntidad
			INNER JOIN Sri.Establecimiento						   es WITH (NOLOCK) ON es.idEntidad   = e.idEntidad
			INNER JOIN [Seguridad].[Role]           ro WITH (NOLOCK) ON ro.Id         = r.RoleId
            INNER JOIN [Seguridad].[LicenciaAcceso] la WITH (NOLOCK) ON la.RoleId     = ro.Id
            INNER JOIN [Config].[Licencia]          cl WITH (NOLOCK) ON cl.Id         = la.LicenciaId
            INNER JOIN [Config].[LicenciaDetalle]   ld WITH (NOLOCK) ON ld.LicenciaId = cl.Id
            INNER JOIN [Config].[Aplicacion]	       ap WITH (NOLOCK) ON ap.Id         = ld.AplicacionId
			WHERE r.estado     = 1
              AND r.idUsuario  = @userId
              AND ap.Code      = 'AR'
              AND es.actividad = '01'

            IF @count = 0
			    BEGIN
				    SELECT '0' code, 'No se ha encontrado RESTAURANTE' as 'message'
				    RETURN
			    END

          SELECT'1' code
                ,'Login correcto' as 'message'
                ,(SELECT         userId           = r.idUsuario
                                ,userRoleId       = r.idUsuarioRol
                                ,codeRole         = ro.Code
                                ,[role]           = ro.[Name]
			                    ,username         = u.nombreUsuario
			                    ,fullname         = c.businessName
                                ,email            = u.correo
			                    ,IDCardUser       = c.IDCard
			                    ,profilePicture   = ''
			                    ,tradeName        = e.razonSocial
			                    ,businessName     = e.nombreComercial 
			                    ,IDCardCompany    = e.ruc
				                ,companyId        = e.idEntidad

                                ,menus =  JSON_QUERY(CASE WHEN r.Accesses IS NULL THEN  
                                                                    (
                                                                        SELECT  m.id
                                                                            ,m.code
	                                                                        ,m.[url]
	                                                                        ,isnull(m.icon, '') icon
	                                                                        ,m.[name]
	                                                                        ,m.parentId
                                                                            ,ISNULL(lad.actions, '[]') actions
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
                                                                        WHERE urr.idUsuarioRol = r.idUsuarioRol 
                                                                        AND a.Code='AR' AND a.[IsActive] = 1
	                                                                    AND sd.SuscripcionId = (SELECT TOP 1 s.Id FROM Sales.Suscripcion s WITH (NOLOCK) 
                                                                                                                INNER JOIN Config.Company ccc WITH (NOLOCK) ON s.CompanyId = ccc.Id
                                                                                                                INNER JOIN Acontplus.dbo.Entidad enn WITH (NOLOCK) ON enn.Uuid = ccc.Uuid 
                                                                                                                WHERE enn.idEntidad = r.idEntidad
                                                                                                                AND s.[IsActive] = 1
							                                                                    ORDER BY s.Id DESC
							                                                                    )  
                                                                            FOR JSON PATH
                                                                    )

                                                                ELSE
                                                                    ( 
                                                                     SELECT * FROM (
                                                                        SELECT m.id
                                                                              ,m.code
	                                                                          ,m.[url]
	                                                                          ,isnull(m.icon, '') icon
	                                                                          ,m.[name]
	                                                                          ,m.parentId
                                                                             ,ISNULL(ua.actions, '[]') actions
                                                                        FROM Config.v_UserRole_Accesses          ua WITH (NOLOCK)
                                                                        INNER JOIN Config.Menu    m WITH (NOLOCK) ON ua.MenuId = m.Id      
                                                                        WHERE ua.idUsuarioRol = r.idUsuarioRol  
                                                                       

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
                                                                            WHERE ur.idUsuarioRol = r.idUsuarioRol
                                                                              AND ur.ParentId = me.Id
                                                                        )

                                                                        AND me.Code='POS'

                                                                    )AS Menus
                                                                    ORDER BY Menus.id
                                                                    FOR JSON PATH
                                                                    )
                            END)
                                
                                ,establecimientos = (
                                                        SELECT  v_eai.*
                                                               ,v_ui.idEntidad
                                                               ,v_ui.entidad
                                                               ,v_ui.rucEmpresa
                                                        FROM v_Estab_Asign v_eai
                                                        INNER JOIN v_usuario v_ui ON v_ui.idUsuarioRol = v_eai.idUsuarioRol
                                                        WHERE v_eai.idUsuarioRol = r.idUsuarioRol
                                                        FOR JSON PATH
                                                      )
				                FROM App.UsuarioRol                          r WITH (NOLOCK)
				                INNER JOIN dbo.Entidad                       e WITH (NOLOCK) ON e.idEntidad = r.idEntidad
				                INNER JOIN dbo.Usuario                       u WITH (NOLOCK) ON u.idUsuario = r.idUsuario
                                INNER JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
				                INNER JOIN Seguridad.[Role]  ro WITH (NOLOCK) ON ro.Id       = r.RoleId
                                INNER JOIN Config.Company cc WITH (NOLOCK) ON e.Uuid = cc.Uuid
                                INNER JOIN Sales.Suscripcion s WITH (NOLOCK) ON cc.Id = s.CompanyId
				                WHERE r.estado    = 1
                                  AND r.idUsuario = @userId
                                   AND GETDATE() BETWEEN s.StartDate AND s.EndDate
                                   AND s.[IsActive] = 1
                                  AND @count > 0
                FOR JSON PATH) as payload
		END
	ELSE 
		BEGIN
			SELECT'0' code,'Usuario o Contraseña incorrectos.' as 'message'
			RETURN 
		END
END
