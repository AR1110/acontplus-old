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
	,@userIdRol          INT

	SET @passwordEncryptada = HASHBYTES('SHA2_512', @password)

	IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE nombreUsuario = @username AND contrasenia = @passwordEncryptada)
		BEGIN
            SELECT @userId = idUsuario FROM dbo.Usuario WITH(NOLOCK) WHERE nombreUsuario = @username AND contrasenia = @passwordEncryptada
			
            
            SELECT  v_ea.*
                ,v_u.idEntidad
                ,v_u.entidad
                ,v_u.rucEmpresa
            INTO #Estab_Asign
            FROM v_Estab_Asign v_ea
            INNER JOIN v_usuario v_u ON v_u.idUsuarioRol = v_ea.idUsuarioRol
            WHERE v_u.idUsuario = @userId
            AND  v_ea.actividad = '01'

            IF (SELECT COUNT(*) FROM #Estab_Asign) = 0
				BEGIN
					SELECT Common.ufnSpResponse('0', 'No se ha encontrado RESTAURANTE', default)
					RETURN
				END

          SELECT Common.ufnSpResponse('1'
                ,'Login correcto'  
                ,(SELECT userId       = r.idUsuario
                                ,userRoleId     =              r.idUsuarioRol
                                ,codeRole       = p.codigo
                                ,[role]         = p.descripcion
			                    ,username       = u.nombreUsuario
			                    ,fullname       = u.nombreCompleto
                                ,email          = u.correo
			                    ,IDCardUser     = ISNULL(u.nroIdentificacion,'')
			                    ,profilePicture = ''
			                    ,tradeName      = e.razonSocial
			                    ,bussinesName   = e.nombreComercial 
			                    ,IDCardCompany  = e.ruc
				                ,companyId      = e.idEntidad
                                ,menus = (SELECT m.idMenu
                                                ,m.subMenu
                                                ,m.url
                                                ,m.icono
                                                ,m.descripcion
						                    FROM dbo.Acceso a WITH(NOLOCK)
						                    INNER JOIN dbo.SubMenu sm WITH(NOLOCK) ON sm.idSubMenu = a.idSubMenu
						                    INNER JOIN dbo.Menu m WITH(NOLOCK) ON m.idMenu = sm.idMenu
						                    WHERE idPolitica = r.idRol AND a.leer = 1
						                    GROUP BY m.idMenu
                                                ,m.subMenu
                                                ,m.url
                                                ,m.icono
                                                ,m.descripcion
                                                ,m.orden
						                    ORDER BY CAST(m.orden AS INT) ASC FOR JSON PATH)

                                ,submenus = (SELECT sm.idMenu
                                                ,sm.idSubMenu
                                                ,sm.url
                                                ,sm.icono
                                                ,sm.descripcion
						                     FROM Acceso a WITH(NOLOCK)
						                     INNER JOIN dbo.SubMenu sm WITH(NOLOCK) ON sm.idSubMenu = a.idSubMenu
						                     INNER JOIN dbo.Menu m WITH(NOLOCK) ON m.idMenu = sm.idMenu
                                             WHERE idPolitica = r.idRol
                                                AND a.leer = 1 FOR JSON PATH)
                                ,establecimientos = (SELECT  v_eai.*
                                                            ,v_u.idEntidad
                                                            ,v_u.entidad
                                                            ,v_u.rucEmpresa
                                                        FROM v_Estab_Asign v_eai
                                                            INNER JOIN v_usuario v_ui ON v_ui.idUsuarioRol = v_eai.idUsuarioRol
                                                            WHERE v_eai.idEstab_Asig = v_ea.idEstab_Asig  FOR JSON PATH)
				                FROM App.UsuarioRol r WITH(NOLOCK)
				                INNER JOIN dbo.Entidad e WITH(NOLOCK) ON e.idEntidad = r.idEntidad
				                INNER JOIN dbo.Usuario u WITH(NOLOCK) ON u.idUsuario = r.idUsuario
				                INNER JOIN dbo.Politica p WITH(NOLOCK) ON p.idPolitica = r.idRol
                                INNER JOIN v_usuario v_u ON v_u.idUsuarioRol = r.idUsuarioRol
                                INNER JOIN v_Estab_Asign v_ea on v_u.idUsuarioRol = v_ea.idUsuarioRol
				                WHERE r.estado = 1
                                    AND r.idUsuario = @userId
                                    AND v_ea.actividad = '01'
                FOR JSON PATH))
		END
	ELSE 
		BEGIN
			SELECT Common.ufnSpResponse('0','Usuario o Contraseña incorrectos.',DEFAULT)
			RETURN 
		END
END
