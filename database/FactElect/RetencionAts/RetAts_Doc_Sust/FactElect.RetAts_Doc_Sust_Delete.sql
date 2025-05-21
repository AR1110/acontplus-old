USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for delete sustentos
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Delete @userRoleId INT 
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT,
        @idRetencionAts INT;

	BEGIN TRY

        SET @idRetencionAts = (SELECT TOP 1 idRetencionAts FROM FactELect.RetAtsDocSustento  WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)

	    SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN
            IF EXISTS (SELECT TOP 1 1 FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)
                BEGIN
                    DELETE FactElect.RetAtsImpDocSustento WHERE idRetAtsDocSustento = @id
                END

             IF EXISTS (SELECT TOP 1 1 FROM FactElect.RetencionAtsRet WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)
                BEGIN
                  UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                    SET importeTotal = ISNULL((SELECT SUM(valorRetenido) FROM FactElect.RetencionAtsRet WITH (NOLOCK) WHERE idRetencionAts = @idRetencionAts ),0)
                    WHERE idDocumento = @idRetencionAts
                      AND codDoc = '07'
                    DELETE FactElect.RetencionAtsRet WHERE idRetAtsDocSustento = @id
                END

             IF EXISTS (SELECT TOP 1 1 FROM FactElect.RetencionAtsPago WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)
                BEGIN
                    DELETE FactElect.RetencionAtsPago  WHERE idRetAtsDocSustento = @id
                END

			DELETE FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @id
		COMMIT TRAN
        SELECT '1' code, 'Documento de sustento eliminado con exito'  as 'message'
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error al ejecutar la transacción!' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES ('DocSustento/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO
