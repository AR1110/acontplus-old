USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR DELETE TPV CONFIGS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConfigTpv_Delete', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConfigTpv_Delete
GO
CREATE PROCEDURE Restaurant.ConfigTpv_Delete @idRol INT,@id INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idUsuario INT 


	BEGIN TRY
		BEGIN TRAN 
			DELETE FROM Restaurant.ConfigTpv WHERE idConfigTpv = @id
			SELECT '1' code, 'Se elimino correctamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
