USE Acontplus
GO
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
-- Author:		DANIS MANCHU
-- Create date: 19/05/2024
-- Description:	DELETE MEASSURE
-- =============================================
CREATE OR ALTER PROC Inventario.Medida_Delete
@userRoleId	INT
,@id		INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	BEGIN TRY
		BEGIN TRAN
			UPDATE Medida SET estado = 0 WHERE idMedida = @id
		COMMIT TRAN 
		SELECT '1' code,'Anulado exitosamente'as 'message'
		RETURN;
	 END TRY

	 BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN;
		END
		SELECT '0'code, 'Info: Error en el procedimiento de Eliminar' + ERROR_MESSAGE() AS  'message'
		RETURN
	 END CATCH 
END
GO
