USE [Acontplus]
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
CREATE OR ALTER PROCEDURE Config.Estab_Asig_Update @userRoleId INT,@id INT 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET NOCOUNT ON;
	DECLARE @idUsuarioRol INT

	BEGIN TRY
		SELECT @idUsuarioRol = idUsuarioRol FROM Config.Estab_Asig WHERE idEstab_Asig = @id

		BEGIN TRAN 
			UPDATE Config.Estab_Asig SET predeterminado = 0 WHERE idUsuarioRol = @idUsuarioRol

			UPDATE Config.Estab_Asig SET predeterminado = 1 WHERE idEstab_Asig = @id
		COMMIT TRAN 
		SELECT Common.ufnSpResponse('1','Actualizado Correctamente',NULL)
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT Common.ufnSpResponse('0','Info: Error en el procedimiento',NULL)
	END CATCH
END
GO
