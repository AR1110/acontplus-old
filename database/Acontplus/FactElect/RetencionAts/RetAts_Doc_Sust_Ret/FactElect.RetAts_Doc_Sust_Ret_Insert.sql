USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for insert tax sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Insert @idUsuarioRol INT  
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT 
		,@idRetencionAts INT
        ,@idRetAtsDocSustento INT

	BEGIN TRY
        	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
            
            SET @idRetAtsDocSustento = (SELECT TOP 1 idRetAtsDocSustento FROM OPENJSON(@json) WITH(idRetAtsDocSustento INT))
			SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idRetAtsDocSustento)

		BEGIN TRAN

			INSERT INTO FactElect.RetencionAtsRet(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, impuestoRetencionId, codigoRetencion
			, baseImponible, porcentajeRetener, valorRetenido)
			SELECT @idRetencionAts, @idRetAtsDocSustento, uniqueIdDoc, impuestoRetencionId, codigoRetencion, baseImponible, porcentajeRetener, valorRetenido
			FROM OPENJSON(@json) 
			WITH(
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				impuestoRetencionId INT '$.impuestoRetencionId'
				,codigoRetencion VARCHAR(5) '$.codigoRetencion'
				,baseImponible NUMERIC(18,5) '$.baseImponible'
				,porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener'
				,valorRetenido NUMERIC(18,5) '$.valorRetenido'
			)

            UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                SET importeTotal = (SELECT SUM(valorRetenido) FROM FactElect.RetencionAtsRet WITH (NOLOCK) WHERE idRetencionAts = @idRetencionAts )
            WHERE idDocumento = @idRetencionAts
              AND codDoc = '07'

			SELECT '1' code, 'Retencion del sustento guardada con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/POST', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
