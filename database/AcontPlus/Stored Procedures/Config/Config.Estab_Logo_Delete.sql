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
-- Author:		Alexis Ramirez
-- Create date: 2023-01-19
-- Description:	SP Para eliminar los imagenes.
-- =============================================
IF OBJECT_ID(N'Config.Estab_Logo_Delete', N'P') IS NOT NULL
DROP PROCEDURE Config.Estab_Logo_Delete 
GO
CREATE PROCEDURE Config.Estab_Logo_Delete @idRol INT,@id INT
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRAN
			DELETE FROM Config.Estab_Logo WHERE idEstab_Logo = @id
			SELECT '1'code
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0'code,ERROR_MESSAGE() as  'message'
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
	END CATCH

END
GO
