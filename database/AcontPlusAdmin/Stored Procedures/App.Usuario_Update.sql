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
ALTER PROCEDURE App.Usuario_Update
	@id INT,
	@nombre NVARCHAR(150),
	@apellido NVARCHAR(150),
	@nroIdentificacion NVARCHAR(30),
	@correo NVARCHAR(150)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	IF EXISTS(SELECT 1 FROM App.Usuario WHERE nroIdentificacion = @nroIdentificacion AND idUsuario != @id)
		BEGIN
			SELECT '-2'code,'El Nro. de identificacion ya se encuentra registrado'message
			RETURN 
		END

	BEGIN TRY 
		BEGIN TRAN
			UPDATE App.Usuario SET 
				nombre = LTRIM(RTRIM(@nombre)),
				apellido = LTRIM(RTRIM(@apellido)),
				nroIdentificacion =  LTRIM(RTRIM(@nroIdentificacion)),
				correo = LTRIM(RTRIM(@correo))
			WHERE idUsuario = @id
		COMMIT TRAN 
		SELECT '0'code,'Actualizado Correctamente'message
		RETURN 
	END TRY 

	BEGIN CATCH 
		SELECT '-2'code,'Error en el procedimiento de actualizar: '+ERROR_MESSAGE()message
		RETURN 
	END CATCH 
END
GO
