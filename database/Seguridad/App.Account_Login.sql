USE [Acontplus]
GO
/****** Object:  StoredProcedure [App].[Account_Login]    Script Date: 6/30/2024 10:07:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- App.Account_Login 'Ignacio98', 'Ignacio9812345'
ALTER   PROCEDURE [App].[Account_Login] @username NVARCHAR(150)
,@password NVARCHAR(150)
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @userId			INT 
	,@encryptedPassword		BINARY(64)   
	,@dayOfWeek				INT
	
	SET @encryptedPassword = HASHBYTES('SHA2_512', @password)

	IF EXISTS(SELECT TOP 1  1	FROM dbo.Usuario	WITH(NOLOCK)
								WHERE nombreUsuario	= @username 
								AND contrasenia		= @encryptedPassword
								AND estado			= 1)

		BEGIN 
			SELECT @userId = idUsuario FROM dbo.Usuario WITH(NOLOCK) WHERE nombreUsuario = @username AND contrasenia = @encryptedPassword

            PRINT @userId

			IF NOT EXISTS(SELECT TOP 1 1 FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuario = @userId AND estado = 1)
				BEGIN
					SELECT '0', 'El usuario existe, pero aun no esta asignado a ninguna empresa.' as 'message'
					RETURN
				END

			IF NOT EXISTS (SELECT TOP 1 1 FROM App.UsuarioRol							ur WITH (NOLOCK) 
                                          INNER JOIN dbo.Entidad				e  WITH (NOLOCK) ON ur.idEntidad	= e.idEntidad
                                          INNER JOIN Config.Company		c  WITH (NOLOCK) ON e.Uuid			= c.Uuid
                                          INNER JOIN Sales.Suscripcion   s  WITH (NOLOCK) ON c.Id			= s.CompanyId
                                          WHERE ur.idUsuario = @userId
                                          AND CAST(GETDATE() AS DATE) BETWEEN CAST(s.StartDate AS DATE) 
										  AND CAST(s.EndDate AS DATE)
                                          AND s.[IsActive] = 1
										  ORDER BY s.StartDate DESC)
                BEGIN
                    SELECT '0', 'Usted no posee una suscripción vigente, comuníquese con el departamento de ventas!' as 'message'
                    RETURN
                END
             

            SELECT 
            '1' as code
            , 'Acceso exitosamente' as 'message'
            , payload = (
		            SELECT 
			            userId				= ur.idUsuario 
			            , userRoleId		= ur.idUsuarioRol
			            , codeRole			= r.Code
			            , [role]			= r.[Name]
			            , username			= u.nombreUsuario
			            , fullname			= ISNULL(c.BusinessName, '')
			            , email				= u.correo
			            , IDCardUser		= ISNULL(c.IDCard, '')
			            , profilePicture	= ''
			            , tradeName			= e.razonSocial
			            , businessName		= e.nombreComercial 
			            , IDCardCompany		= e.ruc
			            , companyId			= e.idEntidad
			            ,[permissions]		= (
									            SELECT sales			= (SELECT comprobante, detalle, adicionales FROM Config.v_user_permission_sale v_ups WITH(NOLOCK) WHERE v_ups.idUsuarioRol = ur.idUsuarioRol FOR JSON PATH)
										            ,cashAccounting		= (SELECT * FROM Config.v_User_Permission_CashAccounting v_upca WITH(NOLOCK) WHERE v_upca.idUsuarioRol = ur.idUsuarioRol FOR JSON PATH)
										            ,product			= (SELECT * FROM Config.v_User_Permission_Product v_upp WITH(NOLOCK)	WHERE v_upp.idUsuarioRol = ur.idUsuarioRol FOR JSON PATH) 
									            FOR JSON PATH)
                        ,menus = 
                              JSON_QUERY(CASE WHEN ur.Accesses IS NULL THEN  
                                                                    (
                                                                        SELECT  m.id
                                                                            ,m.code
	                                                                        ,m.[url]
	                                                                        ,isnull(m.icon, '') icon
	                                                                        ,m.[name]
	                                                                        ,m.parentId
                                                                            ,isnull(lad.actions, '[]') actions
                                                                        FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)
	                                                                    INNER JOIN Config.Menu                 m WITH (NOLOCK) ON lad.MenuId = m.Id
	                                                                    INNER JOIN Config.Aplicacion         a WITH (NOLOCK) ON m.AplicacionId = a.Id 
                                                                        INNER JOIN Seguridad.LicenciaAcceso la WITH (NOLOCK) ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
	                                                                    INNER JOIN Config.LicenciaDetalle   ld WITH (NOLOCK) ON a.Id = ld.AplicacionId  AND ld.LicenciaId = la.LicenciaId
	                                                                    INNER JOIN Sales.SuscripcionDetalle sd WITH (NOLOCK) ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
	                                                                    INNER JOIN Sales.Suscripcion         s WITH (NOLOCK) ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
	                                                                    INNER JOIN Config.Company           cc WITH (NOLOCK) ON s.CompanyId = cc.Id
	                                                                    INNER JOIN dbo.Entidad                   en WITH (NOLOCK) ON cc.Uuid = en.Uuid
	                                                                    INNER JOIN App.UsuarioRol          urr WITH (NOLOCK) ON la.RoleId = urr.RoleId AND urr.idEntidad = en.idEntidad
                                                                        WHERE urr.idUsuarioRol = ur.idUsuarioRol
	                                                                    AND sd.SuscripcionId = (SELECT TOP 1 s.Id FROM Sales.Suscripcion s WITH (NOLOCK) 
                                                                                                                INNER JOIN Config.Company ccc WITH (NOLOCK) ON s.CompanyId = ccc.Id
                                                                                                                INNER JOIN dbo.Entidad enn WITH (NOLOCK) ON enn.Uuid = ccc.Uuid 
                                                                                                                WHERE enn.idEntidad = ur.idEntidad
                                                                                                                AND s.[IsActive] = 1
							                                                                    ORDER BY s.Id DESC
							                                                                    )
                                                                            ORDER BY m.[Order]     
                                                                            FOR JSON PATH
                                                                    )

                                                                ELSE
                                                                    (
                                                                        SELECT m.id
                                                                              ,m.code
	                                                                          ,m.[url]
	                                                                          ,isnull(m.icon, '') icon
	                                                                          ,m.[name]
	                                                                          ,m.parentId
                                                                              ,ISNULL(ua.actions, '[]') actions
                                                                        FROM Config.v_UserRole_Accesses          ua WITH (NOLOCK)
                                                                        INNER JOIN Config.Menu    m WITH (NOLOCK) ON ua.menuId = m.Id
                                                                        WHERE ua.idUsuarioRol = ur.idUsuarioRol
                                                                        ORDER BY m.[Order] ASC
                                                                        FOR JSON PATH
                                                                    )
                            END)
			
		            FROM App.UsuarioRol								ur WITH(NOLOCK)
		            INNER JOIN dbo.Entidad							e  WITH(NOLOCK) ON e.idEntidad	= ur.idEntidad
		            INNER JOIN dbo.Usuario							u  WITH(NOLOCK) ON u.idUsuario	= ur.idUsuario
		            LEFT JOIN Customer.Customer					    c  WITH(NOLOCK) ON c.Id			= u.customerId
		            INNER JOIN Seguridad.[Role]		r  WITH(NOLOCK) ON r.Id			= ur.RoleId
                    INNER JOIN Config.Company cc WITH (NOLOCK) ON e.Uuid = cc.Uuid
                    INNER JOIN Sales.Suscripcion s WITH (NOLOCK) ON cc.Id = s.CompanyId
		            WHERE ur.estado		= 1
		                AND   ur.idUsuario	= @userId
                        AND GETDATE() BETWEEN s.StartDate AND s.EndDate
                        AND s.[IsActive] = 1
	            FOR JSON PATH)
            
		END
	ELSE
		BEGIN 
			SELECT '0', 'No existe un cliente con los datos proporcionados.' AS 'message'
            RETURN
		END
END