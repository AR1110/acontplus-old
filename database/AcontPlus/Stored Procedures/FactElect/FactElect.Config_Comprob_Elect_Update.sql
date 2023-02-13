USE [AcontPlus]
go
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
IF OBJECT_ID('FactElect.Config_Comprob_Elect_Update') IS NOT NULL
DROP PROCEDURE FactElect.Config_Comprob_Elect_Update
GO
CREATE PROCEDURE FactElect.Config_Comprob_Elect_Update 
	@idRol            INT
   ,@id               INT
   ,@codigoPorcentaje VARCHAR(5) = NULL
   ,@porcentaje       DECIMAL(15,5)
   ,@isAutomatic      INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRAN
			UPDATE FactElect.Config_Comprob_Elect SET isAutomatic = @isAutomatic WHERE idConfig_Comprob_Elect = @id
		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN 
	END TRY  

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT'0' code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message' 
	END CATCH
END
GO
