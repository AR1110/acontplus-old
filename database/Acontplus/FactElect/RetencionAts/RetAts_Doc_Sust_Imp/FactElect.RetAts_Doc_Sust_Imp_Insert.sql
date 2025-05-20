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

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Imp_Insert @userRoleId INT
,@json VARCHAR(MAX)
,@errorCode INT = 0 OUT
,@errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @userId INT
	    ,@idRetencionAts INT 
	    ,@totalSinImpuestos NUMERIC(18,2) = 0
	    ,@totalImpuestos NUMERIC(18,2) = 0
	    ,@importeTotal NUMERIC (18,2) = 0
        ,@idRetAtsDocSustento INT;

     DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

    BEGIN TRY
                
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        SET @idRetAtsDocSustento = (SELECT TOP 1 idRetAtsDocSustento FROM OPENJSON (@json) WITH(idRetAtsDocSustento INT))
	    SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idRetAtsDocSustento)

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END

			INSERT INTO FactElect.RetAtsImpDocSustento(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, idTarifaImpuesto
			, baseImponible, valorImpuesto, idUsuario)
			SELECT @idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, idTarifaImpuesto, baseImponible, valorImpuesto, @userId
			FROM OPENJSON(@json)
			WITH( 
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
                idRetAtsDocSustento INT,
				idTarifaImpuesto INT '$.idTarifaImpuesto',
				baseImponible  NUMERIC(18,5) '$.baseImponible',
				valorImpuesto  NUMERIC(18,5) '$.valorImpuesto' 
			)

			SELECT @totalSinImpuestos = SUM(baseImponible), @totalImpuestos = SUM(valorImpuesto) FROM FactElect.RetAtsImpDocSustento WITH(NOLOCK)
																				WHERE idRetAtsDocSustento = @idRetAtsDocSustento
			
			SET @importeTotal = @totalSinImpuestos + @totalImpuestos
			
			UPDATE FactElect.RetAtsDocSustento SET totalSinImpuestos = @totalSinImpuestos
			,importeTotal = @importeTotal
			WHERE idRetAtsDocSustento = @idRetAtsDocSustento

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet ratr
                                INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id 
                                WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE ratr SET baseImponible = @totalSinImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalSinImpuestos
                     FROM FactElect.RetencionAtsRet ratr
                     INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
					WHERE codigo = '1' AND idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet ratr
                                INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id 
                                WHERE codigo = '2' AND idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE ratr SET baseImponible = @totalImpuestos
					,valorRetenido =  (porcentajeRetener / 100) * @totalImpuestos
                     FROM FactElect.RetencionAtsRet ratr
                     INNER JOIN Sri.ImpuestoRetencion i ON ratr.impuestoRetencionId = i.Id
					WHERE codigo = '2' AND idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsPago WHERE idRetAtsDocSustento = @idRetAtsDocSustento)
				BEGIN
					UPDATE FactElect.RetencionAtsPago SET total = @importeTotal
					WHERE  idRetAtsDocSustento = @idRetAtsDocSustento
				END

			IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '1'; 
                SET @message = 'Impuesto del documento, registrado exitosamente!'
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
