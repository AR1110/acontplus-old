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
IF OBJECT_ID(N'Config.PtoEmi_Asig_Update', N'P') IS NOT NULL
DROP PROCEDURE Config.PtoEmi_Asig_Update
GO
CREATE PROCEDURE Config.PtoEmi_Asig_Update @userRoleId INT,@id INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab_Asig VARCHAR(150)
	
	BEGIN TRY 

		SELECT @codEstab_Asig = codEstab_Asig FROM Config.PtoEmi_Asig WHERE idPtoEmi_Asig = @id

		BEGIN TRAN 
			UPDATE Config.PtoEmi_Asig SET predeterminado = 0 WHERE codEstab_Asig = @codEstab_Asig
			UPDATE Config.PtoEmi_Asig SET predeterminado = 1 WHERE idPtoEmi_Asig = @id
		COMMIT TRAN  
        SELECT [Common].[ufnSpResponse]('1','Actualizado Correctamente',DEFAULT)
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
         SELECT [Common].[ufnSpResponse]('0','Info: Error en el procedimiento ' + ERROR_MESSAGE(),DEFAULT) 
	END CATCH
END
GO
