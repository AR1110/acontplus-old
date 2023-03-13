USE AcontPlus
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-10
-- Description:	SP FOR UPDATE NOTIFITIONS STATE
-- =============================================
IF OBJECT_ID('App.Notificacion_Serv_Update') IS NOT NULL
	DROP PROCEDURE App.Notificacion_Serv_Update
GO 
CREATE PROCEDURE App.Notificacion_Serv_Update @id INT
,@estado VARCHAR(5)
,@msgError VARCHAR(1000)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY
		BEGIN TRAN
			IF (@estado = 'ERROR' OR @estado = 'NE')
				BEGIN
					UPDATE App.Notificacion SET estado = @estado, msgError = @msgError WHERE idNotificacion = @id
				END
			ELSE
				BEGIN
					UPDATE App.Notificacion SET estado = @estado, fechaEnvio = dbo.ufnGetDateEcuador() WHERE idNotificacion = @id
				END
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
					INSERT INTO ErroresSistema
							 (token
							 ,method
							 ,errorNumber
							 ,errorSeverity 
							 ,errorState
							 ,errorProcedure
							 ,errorLine
							 ,errorMessage
							 ,errorDate
							 )
						 VALUES
							 (NEWID()
							 ,'/Update'
							 ,ERROR_NUMBER()
							 ,ERROR_SEVERITY()
							 ,ERROR_STATE()
							 ,ERROR_PROCEDURE()
							 ,ERROR_LINE()
							 ,ERROR_MESSAGE()
							 ,GETDATE())
	END CATCH
END
GO
