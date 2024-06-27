USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Seguridad].[Login_Start]    Script Date: 06/30/2023 8:49:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- EXEC Seguridad.Login_Restaurant 'fatima.macias','Fm1245'
--- EXEC Seguridad.Login_Restaurant 'edinson.romero','edi12345'
--- EXEC Seguridad.Login_Restaurant 'emilio.senguana','emilio2021'
CREATE OR ALTER PROCEDURE [Seguridad].[Login_Restaurant] @username NVARCHAR(150)
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
			INNER JOIN Sri.Establecimiento						   es WITH (NOLOCK) ON es.ruc        = e.ruc
			INNER JOIN AcontplusAdmin.[Seguridad].[Role]           ro WITH (NOLOCK) ON ro.Id         = r.RoleId
            INNER JOIN AcontplusAdmin.[Seguridad].[LicenciaAcceso] la WITH (NOLOCK) ON la.RoleId     = ro.Id
            INNER JOIN AcontplusAdmin.[Config].[Licencia]          cl WITH (NOLOCK) ON cl.Id         = la.LicenciaId
            INNER JOIN AcontplusAdmin.[Config].[LicenciaDetalle]   ld WITH (NOLOCK) ON ld.LicenciaId = cl.Id
            INNER JOIN AcontplusAdmin.[Config].[Aplicacion]	       ap WITH (NOLOCK) ON ap.Id         = ld.AplicacionId
			WHERE r.estado     = 1
              AND r.idUsuario  = @userId
              AND ap.Code      = 'AR'
              AND es.actividad = '01'

            IF @count = 0
			    BEGIN
				    SELECT Common.ufnSpResponse('0', 'No se ha encontrado RESTAURANTE', default)
				    RETURN
			    END

          SELECT Common.ufnSpResponse('1'
                ,'Login correcto'  
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
				                INNER JOIN AcontplusAdmin.Seguridad.[Role]  ro WITH (NOLOCK) ON ro.Id       = r.RoleId
				                WHERE r.estado    = 1
                                  AND r.idUsuario = @userId
                                  AND @count > 0
                FOR JSON PATH))
		END
	ELSE 
		BEGIN
			SELECT Common.ufnSpResponse('0','Usuario o Contraseña incorrectos.',DEFAULT)
			RETURN 
		END
END
