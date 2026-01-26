USE Acontplus
GO
/****** Object:  StoredProcedure [Config].[Reporte_Delete]    Script Date: 27/5/2024 17:57:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [Config].[Report_Delete] @userId INT,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT

	 
	IF EXISTS(SELECT 1 FROM Config.Reporte WHERE idReporte = @id AND estado = 1)
		BEGIN
			SELECT '50001' code,'Reporte en estado Activo' as 'message'
			RETURN
		END
	BEGIN TRY
		BEGIN TRAN
			DELETE FROM Config.Reporte
			WHERE idReporte = @id
			SELECT '0' code,'Eliminado Exitosamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '50001' code, ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
		INSERT INTO [Common].[ErrorLog]
         ([ErrorMethod],[ErrorNumber],[ErrorSeverity],[ErrorState],[ErrorProcedure],[ErrorLine],[ErrorMessage])
		VALUES
        ('Report/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE())
	END CATCH
END
