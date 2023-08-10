USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Seguridad].[Login_Start]    Script Date: 06/30/2023 8:49:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- EXEC Seguridad.Login_Restaurant 0,'fatima.macias','Fm1245'
--- EXEC Seguridad.Login_Restaurant 0,'edinson.romero','edi12345'
CREATE OR ALTER PROCEDURE [Seguridad].[Login_Restaurant] 
	@id INT,
	@nombreUsuario nvarchar (150)
	,@contrasenia nvarchar (150)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	DECLARE @contraseniaEncryptada BINARY(64) 
	DECLARE @idPolitica INT 
	DECLARE @count INT
	DECLARE @params NVARCHAR(MAX) = '@idUsuarioRol INT
	                                ,@idUsuario INT
									,@count VARCHAR(5)
									,@rucEmpresa VARCHAR(13)'
									
	DECLARE @sql NVARCHAR(MAX) = 'SELECT 
									 id = IIF(@count = 1,''2'',''1'')
									,mensaje = IIF(@count = 1,''Iniciando Session....'','''')
									,title = ''login''
									,idRol = r.idUsuarioRol
									,userName = u.nombreUsuario
									,fullName = u.nombreCompleto
									,nroIdentificacion = ISNULL(u.nroIdentificacion,'''')
									,imagen = '''' 
									,entidad = e.razonSocial
									,nombreComercial = e.nombreComercial
									,rol = p.codigo
									,actividad = ''''
									,rucEmpresa = e.ruc
									,e.idEntidad companyId
									,r.idUsuario
								 FROM App.UsuarioRol r 
								 INNER JOIN dbo.Entidad e ON e.idEntidad = r.idEntidad
								 INNER JOIN dbo.Usuario u ON u.idUsuario = r.idUsuario
								 INNER JOIN dbo.Politica p ON p.idPolitica = r.idRol 
								 WHERE r.estado = 1 '

	/*Add by Ignacio */
	/* 01: Restaurante */
	DECLARE @rucEmpresa VARCHAR(13)
	DECLARE @actividad VARCHAR(3) = '01'
	DECLARE @loginMenu NVARCHAR(MAX)
	DECLARE @loginSubMenu VARCHAR(MAX)
	DECLARE @establecimientos VARCHAR(MAX)
	
	/* Temp Tables*/
	CREATE TABLE #UserTemp(
		idUsuario INT
		,idEntidad INT
		,rucEmpresa VARCHAR(13)
	)
				   
	SET @contraseniaEncryptada = HASHBYTES('SHA2_512',@contrasenia)

	IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE nombreUsuario = @nombreUsuario AND contrasenia = @contraseniaEncryptada)
		BEGIN
			/* Obtengo RUC de Usuario*/
			INSERT INTO #UserTemp
			SELECT idUsuario
					, idEntidad
					, rucEmpresa 
			FROM v_usuario WHERE nombreUsuario = @nombreUsuario
						
			SELECT * 
			INTO #Estab_Asign
			FROM v_Estab_Asign v_a 
			WHERE v_a.ruc IN (SELECT rucEmpresa FROM #UserTemp)
			AND  v_a.actividad = '01'
					
			SELECT @rucEmpresa = ruc FROM #Estab_Asign
									
			IF (SELECT COUNT(*) FROM #Estab_Asign) = 0
				BEGIN
					SELECT '0', 'No se ha encontrado RESTAURANTE', ''
					RETURN
				END
							
			IF @id > 0
				BEGIN
					SET @count = 1
					SET @sql = @sql+'AND r.idUsuarioRol = @idUsuarioRol '
					SELECT @idPolitica = idRol FROM App.UsuarioRol WHERE idUsuarioRol = @id
				END 

			ELSE IF @id = 0
				BEGIN
					SELECT @idUsuario = idUsuario 
					FROM dbo.Usuario 
					WHERE nombreUsuario = @nombreUsuario 
					AND contrasenia = @contraseniaEncryptada
					
					SELECT @count = COUNT(*) 
					FROM App.UsuarioRol 
					WHERE idUsuario = @idUsuario and estado = 1

					SET @sql = @sql+'AND r.idUsuario = @idUsuario '
					SELECT @idPolitica = idRol FROM App.UsuarioRol WHERE idUsuario = @idUsuario
				END 

			SET @sql = @sql+ 'AND r.ruc = @rucEmpresa '

			  IF @count >= 1 
				BEGIN
					EXEC sp_executesql 
						@sql
						,@params 
						,@idUsuarioRol = @id
						,@idUsuario = @idUsuario
						,@count = @count
						,@rucEmpresa = @rucEmpresa
						

						/* Menus */
						SET @loginMenu = (
							SELECT m.idMenu,m.subMenu,m.url,m.icono,m.descripcion
							FROM Acceso a
							INNER JOIN dbo.SubMenu sm ON sm.idSubMenu = a.idSubMenu
							INNER JOIN dbo.Menu m ON m.idMenu = sm.idMenu
							WHERE idPolitica = @idPolitica AND a.leer = 1
							GROUP BY m.idMenu,m.subMenu,m.url,m.icono,m.descripcion, m.orden
							ORDER BY CAST(m.orden AS INT) ASC FOR JSON PATH
						)
									
						/*Accesos */
						SET @loginSubMenu = (
							SELECT sm.idMenu,sm.idSubMenu,sm.url,sm.icono,sm.descripcion 
							FROM Acceso a
							INNER JOIN dbo.SubMenu sm ON sm.idSubMenu = a.idSubMenu
							INNER JOIN dbo.Menu m ON m.idMenu = sm.idMenu
							WHERE idPolitica = @idPolitica AND a.leer = 1 FOR JSON PATH
						)

						SET @establecimientos = (SELECT * FROM #Estab_Asign FOR JSON PATH)

						/* Establecimientos */
						SELECT @loginMenu AS loginMenu
						SELECT @loginSubMenu AS loginSubMenu
						SELECT @establecimientos AS establecimientos

						
				END
			  ELSE IF @count = 0 SELECT '0','No tienes acceso',''
						

		END 
	ELSE 
		BEGIN
			SELECT '0','Usuario o Contraseña incorrectos.','Login'
			RETURN 
		END 

	
END
