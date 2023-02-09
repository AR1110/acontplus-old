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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE App.Usuario_Insert
	@nombre NVARCHAR(150),
	@apellido NVARCHAR(150),
	@nombreUsuario NVARCHAR(150),
	@contrasena NVARCHAR(300),
	@nroIdentificacion NVARCHAR(30),
	@correo NVARCHAR(150)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	IF EXISTS(SELECT 1 FROM App.Usuario WHERE nroIdentificacion = @nroIdentificacion)
		BEGIN
			SELECT '-2'code,'El Nro. de identificacion ya se encuentra registrado'message
			RETURN 
		END

	IF EXISTS(SELECT 1 FROM App.Usuario WHERE nombreUsuario = @nombreUsuario)
		BEGIN
			SELECT '-2'code,'Este usuario ya existe'message
			RETURN 
		END 

	BEGIN TRY 
		BEGIN TRAN 
			INSERT INTO App.Usuario(nombre,apellido,nombreUsuario,contrasena,nroIdentificacion,correo,fechaRegistro)
			SELECT LTRIM(RTRIM(@nombre)),LTRIM(RTRIM(@apellido)),LTRIM(RTRIM(@nombreUsuario)),HASHBYTES('SHA2_512',@contrasena),LTRIM(RTRIM(@nroIdentificacion)),LTRIM(RTRIM(@correo)),dbo.F_GetDateUtc()
		COMMIT TRAN 
		SELECT '0'code,'Registrado Correctamente'message
		RETURN 
	END TRY 

	BEGIN CATCH
		SELECT '-2'code,'Error en el procedimiento de registrar: '+ERROR_MESSAGE()message
		RETURN 
	END CATCH 

END
GO
