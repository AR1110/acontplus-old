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
ALTER PROCEDURE Config.AplicacionMenu_Update
	@id INT,
	@idAplicacion INT,
	@idMenu INT,
	@idSubMenu INT,
	@estado BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @codAplicacion NVARCHAR(10) = (SELECT codigo FROM Config.Aplicacion WHERE idAplicacion = @idAplicacion), 
			@codMenu NVARCHAR(10) = (SELECT codigo FROM Config.Menu WHERE idMenu = @idMenu) ,
			@codSubMenu NVARCHAR(10)  = (SELECT codigo FROM Config.SubMenu WHERE idSubMenu = @idSubMenu)
	
	IF @codAplicacion IS NULL OR @codMenu IS NULL OR @codSubMenu IS NULL
		BEGIN
			SELECT '-2'code
				  ,CASE WHEN @codAplicacion IS NULL THEN 'El id de aplicacion no existe' 
						WHEN @codMenu IS NULL THEN 'El id de menu no existe' 
						WHEN @codSubMenu IS NULL THEN 'El id de submenu no existe'
						ELSE 'Error'
				   END message
			RETURN 
		END 

	BEGIN TRY 
		BEGIN TRAN 
			UPDATE Config.AplicacionMenu SET 
				idAplicacion = @idAplicacion,
				idMenu = @idMenu,
				idSubMenu = @idSubMenu,
				codAplicacion = @codAplicacion,
				codMenu = @codMenu,
				codSubMenu = @codSubMenu,
				estado = @estado
			WHERE idAplicacionMenu = @id
		COMMIT TRAN 
		SELECT '0'code,'Actualizado Correctamente'message
		RETURN 
	END TRY 

	BEGIN CATCH 
		SELECT '-2'code,'Error en el procedimiento de actualizar: '+ ERROR_MESSAGE() message
		RETURN 
	END CATCH 
END
GO
