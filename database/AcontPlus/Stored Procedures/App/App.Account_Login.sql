USE ACONTPLUS
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-06-20
-- Description:	sp for login in mobile app
-- =============================================
IF OBJECT_ID('App.Account_Login') IS NOT NULL
	DROP PROCEDURE App.Account_Login
GO 
CREATE PROCEDURE App.Account_Login @username VARCHAR(100)
,@password VARCHAR(100)
AS
BEGIN
	SET NOCOUNT ON;

	IF EXISTS (SELECT 1 FROM Seguridad.Usuario WHERE nombreUsuario = @username)
		BEGIN
			DECLARE @idUsuario INT 
			SET @idUsuario = (SELECT idUsuario FROM Seguridad.Usuario WHERE nombreUsuario = @username AND contrasenia = HASHBYTES('SHA2_512', @password + CAST(salt AS NVARCHAR(36))))
			
			IF (@idUsuario IS NULL)
				SELECT -2 code, 'Contraseña incorrecta' as 'message'
			ELSE
				SELECT 0 code, 'Ingreso exitoso' as 'message', payload = (SELECT u.idUsuario, nombreUsuario, ISNULL(email,'') email, nombreCompleto, nroIdentificacion, ur.idUsuarioRol FROM Seguridad.Usuario u INNER JOIN Seguridad.UsuarioRol ur WITH (NOLOCK) ON ur.idUsuario = u.idUsuario WHERE u.idUsuario = @idUsuario FOR JSON PATH) 
		END
	ELSE
		BEGIN
			SELECT -2 code, 'Usuario no existe!' as 'message'
		END

END
GO
