USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update retencion sustentos
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Update @userRoleId INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT 
           ,@idRetencionAts INT

	
	BEGIN TRY
        
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

        SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetencionAtsRet WHERE idRetencionAtsRet = @id)

		BEGIN TRAN

			UPDATE rr SET rr.impuestoRetencionId = t.impuestoRetencionId
			,rr.codigoRetencion = t.codigoRetencion
			,rr.baseImponible = t.baseImponible
			,rr.porcentajeRetener = t.porcentajeRetener
			,rr.valorRetenido = t.valorRetenido
			FROM FactElect.RetencionAtsRet rr WITH (ROWLOCK)
			JOIN (SELECT idRetencionAtsRet, impuestoRetencionId, codigoRetencion, baseImponible, porcentajeRetener, valorRetenido
			FROM OPENJSON(@json) 
			WITH(
				idRetencionAtsRet INT '$.idRetencionAtsRet'
				,impuestoRetencionId INT '$.impuestoRetencionId'
				,codigoRetencion VARCHAR(5) '$.codigoRetencion'
				,baseImponible NUMERIC(18,5) '$.baseImponible'
				,porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener'
				,valorRetenido NUMERIC(18,5) '$.valorRetenido'
			)) as t ON t.idRetencionAtsRet = rr.idRetencionAtsRet
			WHERE rr.idRetencionAtsRet = @id

            UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                SET importeTotal = (SELECT SUM(valorRetenido) FROM FactElect.RetencionAtsRet WITH (NOLOCK) WHERE idRetencionAts = @idRetencionAts )
            WHERE idDocumento = @idRetencionAts
              AND codDoc = '07'
			
		COMMIT TRAN
        SELECT '1' code, 'Retención del sustento actualizada con exito'  as 'message'
	END TRY
	BEGIN CATCH
	    SELECT '0' code, 'Error en el procedimiento!' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES ('DocSustentoRetencion/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO
