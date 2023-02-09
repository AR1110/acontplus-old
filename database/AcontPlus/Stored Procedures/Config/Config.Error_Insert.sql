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
-- Author:		Ivan Paz
-- Create date: 2022-09-22
-- Description:	SP FOR SAVE ERROR IN SQL
-- =============================================
CREATE PROCEDURE Config.Error_Insert 
 @method VARCHAR(150) = NULL
,@errorNumber INT
,@errorSeverity INT
,@errorState INT
,@errorProcedure NVARCHAR(100)
,@errorLine INT
,@errorMessage  NVARCHAR(MAX)
,@idUsuario INT = NULL
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		BEGIN TRAN
			INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
			VALUES (NEWID(), @method, @errorNumber, @errorSeverity, @errorState, @errorProcedure, @errorLine, @errorMessage, dbo.ufnGetDateEcuador(), @idUsuario)
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
	END CATCH
END
GO
