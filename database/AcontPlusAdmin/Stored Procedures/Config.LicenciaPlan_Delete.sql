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
ALTER PROCEDURE Config.LicenciaPlan_Delete @id INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF EXISTS (SELECT 1 FROM Config.LicenciaPlan WHERE idLicenciaPlan = @id AND estado = 1)
		BEGIN
			SELECT '-2'code,'No puedes eliminar el plan se encuentra activo'message
			RETURN 
		END 

	BEGIN TRY
		BEGIN TRAN 
			DELETE FROM Config.LicenciaPlan WHERE idLicenciaPlan = @id
		COMMIT TRAN 
		SELECT '0'code,'Eliminado Correctamente'message
		RETURN 
	END TRY 

	BEGIN CATCH 
		SELECT '-2'code,'Error en el procedimiento de eliminar: '+ ERROR_MESSAGE()message
		RETURN 
	END CATCH

END
GO
