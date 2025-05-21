USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for delete retenciones from sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Delete @userRoleId INT 
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT 
           ,@idRetencionAts INT;

	BEGIN TRY
        
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId);

        SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetencionAtsRet WHERE idRetencionAtsRet = @id);

		BEGIN TRAN
			DELETE FROM FactElect.RetencionAtsRet WHERE idRetencionAtsRet = @id;

            UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                SET importeTotal = ISNULL((SELECT SUM(valorRetenido) 
                                                FROM FactElect.RetencionAtsRet WITH (NOLOCK) 
                                                WHERE idRetencionAts = @idRetencionAts ),0)
            WHERE idDocumento = @idRetencionAts
              AND codDoc = '07';

		COMMIT TRAN
        SELECT '1' code, 'Retención del sustento eliminada con exito'  as 'message';
	END TRY
	BEGIN CATCH
	    SELECT '0' code, 'Error en el procedimiento!' as 'message';
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN;
		INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES ('DocSustentoRetencion/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
	END CATCH
END
GO
