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

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Pago_Insert @userRoleId INT  
,@json VARCHAR(MAX)
,@errorCode INT = 0 OUT
,@errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT
	    ,@idRetencionAts INT
	    ,@totalOld NUMERIC (18,2)
        ,@idRetAtsDocSustento INT;

     DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

	BEGIN TRY

            SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

            SET @idRetAtsDocSustento = (SELECT TOP 1 idRetAtsDocSustento FROM OPENJSON(@json) WITH (idRetAtsDocSustento INT))

			SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idRetAtsDocSustento)

			IF EXISTS(SELECT 1 FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts)
				BEGIN
					SET @totalOld = (SELECT SUM(importeTotal) FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts)
				END

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END

			INSERT INTO FactElect.RetencionAtsPago(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, formaPagoId, total, idUsuario)
			SELECT @idRetencionAts, @idRetAtsDocSustento, uniqueIdDoc, formaPagoId, total, @userId
			FROM OPENJSON(@json)
			WITH	( 
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				formaPagoId INT '$.formaPagoId', 
				total  NUMERIC(18,5) '$.total'
			)

		IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '1'; 
                SET @message = 'Pago del documento, registrado exitosamente!'
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

		    INSERT INTO dbo.ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		    VALUES ('DocSustentoPago/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
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
