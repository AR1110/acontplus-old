USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update pagos del sustento
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Pago_Update @userRoleId INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT 
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	BEGIN TRY
		BEGIN TRAN 
			
			UPDATE rp SET rp.formaPagoId = t.formaPagoId
			,rp.total = t.total 
			FROM FactElect.RetencionAtsPago rp WITH (ROWLOCK)
			JOIN (SELECT @id idRetencionAtsPago, formaPagoId, total
			FROM OPENJSON(@json)
			WITH( formaPagoId INT '$.formaPagoId'
				,total NUMERIC(18,5) '$.total'
			)) as t ON t.idRetencionAtsPago = rp.idRetencionAtsPago
			WHERE rp.idRetencionAtsPago = @id

			SELECT '1' code, 'Pago del sustento actualizado con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/PUT', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
