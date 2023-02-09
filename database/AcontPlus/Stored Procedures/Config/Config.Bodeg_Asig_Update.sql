USE [AcontPlus]
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Config.Bodeg_Asig_Update', N'P') IS NOT NULL
DROP PROCEDURE Config.Bodeg_Asig_Update
GO
CREATE PROCEDURE Config.Bodeg_Asig_Update @idRol INT,@id INT,@predeterminado BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab_Asig VARCHAR(150)

	BEGIN TRY 

		SELECT @codEstab_Asig = codEstab_Asig FROM Config.Bodeg_Asig WHERE idBodeg_Asig = @id

		BEGIN TRAN 
			UPDATE Config.Bodeg_Asig SET predeterminado = 0 WHERE codEstab_Asig = @codEstab_Asig
			UPDATE Config.Bodeg_Asig SET predeterminado = @predeterminado WHERE idBodeg_Asig = @id
		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento ' + ERROR_MESSAGE() as  'message'
	END CATCH
END
GO
