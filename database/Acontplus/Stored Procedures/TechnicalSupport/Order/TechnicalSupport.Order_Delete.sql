USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-22
-- Description: sp for delete orden
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Delete @userRoleId INT
	,@id INT
AS
BEGIN 
	SET NOCOUNT ON;
	
	DECLARE @userId INT
	
	BEGIN TRY
		SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        IF EXISTS(SELECT TOP 1 1 FROM TechnicalSupport.[OrderDocument] WHERE Id = @id)
				BEGIN
					SELECT '0' code, 'Imposible anular, esta orden ya ha sido procesada!' as 'message'
				END
		BEGIN TRAN
		

			UPDATE TechnicalSupport.[Order] WITH (ROWLOCK) SET Deleted = 1, [Enabled] = 0
				,UpdatedAt = dbo.ufnGetDateEcuador()
			WHERE Id = @id

			UPDATE od SET od.Deleted = 1
				,od.Enabled = 0
				,od.UpdatedAt =  dbo.ufnGetDateEcuador()
			FROM TechnicalSupport.OrderDetail od WITH (ROWLOCK) 
			WHERE od.OrderId = @id

			UPDATE om SET om.Deleted = 1
				,om.Enabled = 0
				,om.UpdatedAt =  dbo.ufnGetDateEcuador()
			FROM TechnicalSupport.OrderMaintenance om WITH (ROWLOCK) 
				INNER JOIN TechnicalSupport.OrderDetail od WITH (NOLOCK) ON om.OrderDetailId = od.Id
			WHERE od.OrderId = @id

		COMMIT TRAN
		SELECT '1' code, 'Anulada Exitosamente' as 'message'
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error al anular' as 'message'
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
		INSERT INTO dbo.ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES(NEWID(), 'TS/Order/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH

END
GO
