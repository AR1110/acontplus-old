USE [AcontPlus]
GO
/****** Object:  StoredProcedure [App].[Usuario_Insert]    Script Date: 6/4/2023 20:45:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO 
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Description:	Agregar Informacion a la tabla Usuario y la tabla Rol 
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomer_Insert @userRoleId INT, @json NVARCHAR(MAX) 
AS
BEGIN

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuarioRol INT;

	DECLARE
			@roleCode VARCHAR(10)
		   ,@correo NVARCHAR(300)
		   ,@contrasena NVARCHAR(100)
		   ,@nombreUsuario NVARCHAR(200)
		   ,@nombreCompleto NVARCHAR(500)
		   ,@nroIdentificacion NVARCHAR(100) 
		   ,@idEntidad INT 
		   ,@idUsuario INT 
		   ,@roleId INT
	
	BEGIN TRY
		SELECT 
				@nombreUsuario = LTRIM(RTRIM(js.nombreUsuario)),
				@contrasena = js.contrasena,
				@nroIdentificacion = LTRIM(RTRIM(js.nroIdentificacion)),
				@nombreCompleto = LTRIM(RTRIM(js.nombreCompleto)),
				@correo = LTRIM(RTRIM(js.correo)), 
				@roleId = roleId,
				@roleCode = roleCode
		FROM OPENJSON(@json) 
		WITH(correo NVARCHAR(200) '$.correo'
			,contrasena NVARCHAR(200) '$.contrasena'
			,nombreUsuario NVARCHAR(200) '$.nombreUsuario'
			,nroIdentificacion NVARCHAR(80) '$.nroIdentificacion'
			,nombreCompleto NVARCHAR(200) '$.nombreCompleto' 
			,roleId INT '$.roleId'
			,roleCode VARCHAR(10) 
			) as  js

		SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId 
		 
		IF @roleId IS NULL
			BEGIN
				SELECT '0' as code,'EL id politica enviado no existe' as [message]
				RETURN;
			END  

		IF EXISTS(SELECT 1 FROM Usuario WHERE nombreUsuario = @nombreUsuario)
			BEGIN
				SELECT '0' as code,'Ya existe este nombre de usuario' as [message] 
				RETURN;
			END 

		IF EXISTS(SELECT 1 FROM Usuario WHERE nroIdentificacion = @nroIdentificacion)
			BEGIN
				SELECT '0' as code,'Los numeros de identificaion son unicos por usuario' as [message]  
				RETURN;
			END

		BEGIN TRAN 
			INSERT INTO dbo.Usuario(nombreUsuario,nroIdentificacion,contrasenia,nombreCompleto,correo)
			SELECT @nombreUsuario,@nroIdentificacion,HASHBYTES('SHA2_512',@contrasena),@nombreCompleto,@correo

			SET @idUsuario = @@IDENTITY

			INSERT INTO App.UsuarioRol(idUsuario,idEntidad,nroIdentificacion,ruc,RoleId,fechaRegistro)
			SELECT @idUsuario,idEntidad,@nroIdentificacion,ruc,@roleId,dbo.ufnGetDateEcuador() FROM dbo.Entidad WHERE idEntidad = @idEntidad
			
            SET @idUsuarioRol = @@IDENTITY

			--INSERCION DE PERMISOS 
			INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission, fechaRegistro)
			SELECT @idUsuarioRol, codModule, jsonPermission, dbo.ufnGetDateEcuador() 
			FROM Config.UserPermission WHERE idUsuarioRol = @userRoleId			

		COMMIT TRAN 
		SELECT '1' as code,'Registrado Exitosamente' as [message]   
		RETURN
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' as code,'Info: Error en el procedimiento de agregar' + ERROR_MESSAGE() as [message]    
		RETURN
	END CATCH 
END
