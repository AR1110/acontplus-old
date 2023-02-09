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
ALTER PROCEDURE App.Usuario_Delete @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	BEGIN TRY
		BEGIN TRAN 
			UPDATE App.Usuario SET estado = 0 WHERE idUsuario = @id
		COMMIT TRAN 
		SELECT '0'code,'Suspendido Correctamente'message
		RETURN 
	END TRY 

	BEGIN CATCH 
		SELECT '-2'code,'Error en el procedimiento de eliminar: '+ ERROR_MESSAGE()message
		RETURN 
	END CATCH 

END
GO
