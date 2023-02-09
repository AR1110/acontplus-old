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
IF OBJECT_ID(N'Sri.PtoEmision_Update', N'P') IS NOT NULL
DROP PROCEDURE Sri.PtoEmision_Update
GO
CREATE PROCEDURE Sri.PtoEmision_Update
	-- Add the parameters for the stored procedure here
	@idRol INT
   ,@id INT 
   ,@ambiente VARCHAR(5)
   ,@ptoEmi VARCHAR(5)
   ,@estado BIT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	BEGIN TRY
		BEGIN TRAN 
			
			UPDATE dbo.PuntoEmision SET 
				ambiente = @ambiente
			   ,ptoEmi = @ptoEmi
			   ,estado = @estado
			WHERE idPuntoEmision = @id

		COMMIT TRAN 
		SELECT '1' code,'Actualizado Correctamente' as 'message'
	    RETURN;

	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 
END
GO
