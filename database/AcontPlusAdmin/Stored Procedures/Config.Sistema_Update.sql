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
ALTER PROCEDURE Config.Sistema_Update
	@id INT,
	@descripcion NVARCHAR(250),
	@urlSistema NVARCHAR(MAX),
	@hostApp NVARCHAR(MAX),
	@connectionStrings NVARCHAR(MAX),
	@estado BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	IF EXISTS(SELECT 1 FROM Config.Sistema WHERE urlSistema = @urlSistema AND idSistema != @id)
		BEGIN 
			SELECT '-2' code,'La url '+@urlSistema+' ya se encuentra registrada' message
			RETURN
		END 

	IF @estado = 0	
		BEGIN
			IF EXISTS(SELECT 1 FROM Config.Aplicacion WHERE idSistema = @id)
				BEGIN
					SELECT '-2' code,'El sistema no puede ser desactivo tiene una aplicacion en uso' message
					RETURN
				END 
		END 

	BEGIN TRY
		BEGIN TRAN 
			UPDATE Config.Sistema SET 
				descripcion = LTRIM(RTRIM(@descripcion)),
				urlSistema = LTRIM(RTRIM(urlSistema)),
				hostApp = LTRIM(RTRIM(hostApp)),
				connectionStrings = LTRIM(RTRIM(connectionStrings)),
				estado = estado
			WHERE idSistema = @id
		COMMIT TRAN
		SELECT '0' code,'Actualizado Correctamente' message
		RETURN 
	END TRY 

	BEGIN CATCH
		SELECT '-2' code,'Error en el procedimiento de actualizad :'+ERROR_MESSAGE() message
		RETURN 
	END CATCH 
END
GO
