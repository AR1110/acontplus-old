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

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Insert @userRoleId INT  
,@json VARCHAR(MAX)
,@errorCode INT = 0 OUT
,@errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT 
		,@idRetencionAts INT
        ,@idRetAtsDocSustento INT;

     DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

	BEGIN TRY
        	SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
            
            SET @idRetAtsDocSustento = (SELECT TOP 1 idRetAtsDocSustento FROM OPENJSON(@json) WITH(idRetAtsDocSustento INT))
			SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idRetAtsDocSustento)

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END

			INSERT INTO FactElect.RetencionAtsRet(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, impuestoRetencionId, codigoRetencion
			,baseImponible, porcentajeRetener, valorRetenido, idUsuario)

			SELECT @idRetencionAts, @idRetAtsDocSustento, uniqueIdDoc, impuestoRetencionId, codigoRetencion,
            baseImponible, porcentajeRetener, valorRetenido, @userId
			FROM OPENJSON(@json)
			WITH(
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				impuestoRetencionId INT '$.impuestoRetencionId',
				codigoRetencion VARCHAR(5) '$.codigoRetencion',
				baseImponible NUMERIC(18,5) '$.baseImponible',
				porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener',
				valorRetenido NUMERIC(18,5) '$.valorRetenido'
			);

            UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                SET importeTotal = (SELECT SUM(valorRetenido) FROM FactElect.RetencionAtsRet WITH (NOLOCK) WHERE idRetencionAts = @idRetencionAts )
            WHERE idDocumento = @idRetencionAts
              AND codDoc = '07'
		
        IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '1'; 
                SET @message = 'Retencion del documento, registrada exitosamente!'
			END
		ELSE
			BEGIN
				SET @code = '0';
                SET @message = 'No se ejecuto ninguna transacción';
			END

	  IF (@trancount = 1)
		BEGIN
			COMMIT;
			SELECT @code as code, @message as 'message';
		 END
	END TRY
	BEGIN CATCH
		 IF (@trancount = 1)
			BEGIN
				IF (@@TRANCOUNT > 0)
					ROLLBACK TRAN;  

		    INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		    VALUES ('DocSustentoRetencion/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
            SELECT '0' code, 'Error en el procedimiento!' as 'message'
         END
		ELSE
            BEGIN
			    SET @errorCode = ERROR_NUMBER()
			    SET @errorMessage = ERROR_MESSAGE()
            END
	END CATCH
END
GO
