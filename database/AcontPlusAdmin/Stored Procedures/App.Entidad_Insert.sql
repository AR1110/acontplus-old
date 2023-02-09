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
ALTER PROCEDURE App.Entidad_Insert
	@ruc NVARCHAR(150),
	@razonSocial NVARCHAR(200), 
	@nombreComercial NVARCHAR(200), 
	@correo NVARCHAR(200), 
	@telefono NVARCHAR(100), 
	@direccion NVARCHAR(300)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	IF EXISTS(SELECT 1 FROM App.Entidad WHERE ruc = @ruc)
		BEGIN
			SELECT '-2'code,'La empresa '+@ruc+' ya se encuentra registrada'message
			RETURN  
		END 


	BEGIN TRY 
		BEGIN TRAN 
			INSERT INTO App.Entidad(ruc,razonSocial,nombreComercial,correo,telefono,dirrecion,fechaRegistro)
			SELECT LTRIM(RTRIM(@ruc)),LTRIM(RTRIM(@razonSocial)),LTRIM(RTRIM(@nombreComercial)),LTRIM(RTRIM(@correo)),LTRIM(RTRIM(@telefono)),LTRIM(RTRIM(@direccion)),dbo.F_GetDateUtc()
		COMMIT TRAN 
		SELECT '0'code,'Registrado Correctamente'message
		RETURN 
	END TRY 

	BEGIN CATCH
		SELECT '-2'code,'Error en el procedimiento de insertar: '+ERROR_MESSAGE()message
		RETURN 
	END CATCH 
END
GO
