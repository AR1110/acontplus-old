USE [AcontPlusAdmin]
GO



--Creamos Schema Sec_App
--CREATE SCHEMA Sec_App

IF OBJECT_ID('Sec_App.Login')IS NOT NULL
	DROP PROCEDURE Sec_App.Login
GO

CREATE PROCEDURE Sec_App.Login @username VARCHAR(100), @password VARCHAR(200)
AS
BEGIN 
	
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT 
	DECLARE @passwordEncryptada BINARY(64)

	SET @passwordEncryptada = HASHBYTES('SHA2_512',@password)
	IF EXISTS(SELECT 1 FROM App.Usuario WHERE nombreUsuario = @username AND contrasena = @passwordEncryptada)
		BEGIN 
			SELECT 
				code           = '1'
				,mensaje       =  'Iniciando Session....'				
				,idUsuarioRol  = r.idUsuarioRol
				,nombreUsuario = u.nombreUsuario
				,nroIdentificacion = ISNULL(r.nroIdentificacion,'')											
				,rol               = r.codRol		
				FROM App.UsuarioRol r 
				INNER JOIN App.Entidad e ON e.idEntidad = r.idEntidad
				INNER JOIN App.Usuario u ON u.idUsuario = r.idUsuario		
				WHERE r.estado = 1
		END
	ELSE 
		BEGIN
			SELECT '0'code,'Usuario o Contraseña incorrecto' as 'message'
			RETURN 
		END

END 
GO