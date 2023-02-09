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
ALTER PROCEDURE App.Entidad_Update
	@id INT,
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

	IF EXISTS(SELECT 1 FROM App.Entidad WHERE ruc = @ruc AND idEntidad != @id)
		BEGIN
			SELECT '-2'code,'La empresa '+@ruc+' ya se encuentra registrada'message
			RETURN  
		END 

	BEGIN TRY
		BEGIN TRAN 
			UPDATE App.Entidad SET 
				ruc = LTRIM(RTRIM(@ruc)),
				razonSocial = LTRIM(RTRIM(@razonSocial)),
				nombreComercial = LTRIM(RTRIM(@nombreComercial)),
				correo = LTRIM(RTRIM(@correo)),
				telefono = LTRIM(RTRIM(@telefono)),
				dirrecion = LTRIM(RTRIM(@direccion))
			WHERE idEntidad = @id
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
