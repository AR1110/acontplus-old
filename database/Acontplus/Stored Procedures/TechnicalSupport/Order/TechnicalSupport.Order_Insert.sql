USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-02-07
-- Description:	SP for get orders
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Insert @userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @userId INT

	SET @userId = (SELECT idUsuario FROM v_Usuario WHERE idUsuarioRol = @userRoleId)
	BEGIN TRY
		BEGIN TRAN
			SELECT Common.ufnSpResponse('1', 'Grave', NULL)
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		 SELECT Common.ufnSpResponse('0', 'Error al guardar la orden', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'TechSupport/Order/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO
