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
CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Delete @idUsuarioRol INT 
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT,
        @idRetencionAts INT

   
	BEGIN TRY

        SET @idRetencionAts = (SELECT TOP 1 idRetencionAts FROM FactELect.RetAtsDocSustento  WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)

	    SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol)

		BEGIN TRAN
            IF EXISTS (SELECT TOP 1 1 FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)
                BEGIN
                    DELETE FactElect.RetAtsImpDocSustento WITH (ROWLOCK) WHERE idRetAtsDocSustento = @id
                END

             IF EXISTS (SELECT TOP 1 1 FROM FactElect.RetencionAtsRet WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)
                BEGIN
                  UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                    SET importeTotal = ISNULL((SELECT SUM(valorRetenido) FROM FactElect.RetencionAtsRet WITH (NOLOCK) WHERE idRetencionAts = @idRetencionAts ),0)
                    WHERE idDocumento = @idRetencionAts
                      AND codDoc = '07'
                    DELETE FactElect.RetencionAtsRet WITH (ROWLOCK) WHERE idRetAtsDocSustento = @id
                END

             IF EXISTS (SELECT TOP 1 1 FROM FactElect.RetencionAtsPago WITH(NOLOCK) WHERE idRetAtsDocSustento = @id)
                BEGIN
                    DELETE FactElect.RetencionAtsPago WITH (ROWLOCK)  WHERE idRetAtsDocSustento = @id
                END

			DELETE FROM FactElect.RetAtsDocSustento WITH (ROWLOCK) WHERE idRetAtsDocSustento = @id
		COMMIT TRAN
        SELECT '1' code, 'Documento de sustento eliminado con exito'  as 'message'
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/DELETE', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
