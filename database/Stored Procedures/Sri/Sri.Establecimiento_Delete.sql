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
IF OBJECT_ID(N'Sri.Establecimiento_Delete', N'P') IS NOT NULL
DROP PROCEDURE Sri.Establecimiento_Delete 
GO
CREATE PROCEDURE Sri.Establecimiento_Delete @idRol INT,@id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY 
		BEGIN TRAN 
			UPDATE Sri.Establecimiento SET estado = 0 WHERE idEstablecimiento = @id
		COMMIT TRAN 
		SELECT '1'code,'Establecimiento Cerrado' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'
	END CATCH

END
GO
