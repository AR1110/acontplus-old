USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR INSERT CONSUMO ANULADO TPV
-- =============================================
IF OBJECT_ID(N'Restaurant.ConsumoAnuladoTpv_Insert', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConsumoAnuladoTpv_Insert
GO
CREATE PROCEDURE Restaurant.ConsumoAnuladoTpv_Insert @idRol INT
,@json VARCHAR(MAx)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idUsuario INT 

	DECLARE @tmp AS TABLE (
		idConsumoTpv INT
		,motivo VARCHAR(300)
	)

	INSERT INTO @tmp(idConsumoTpv, motivo)
	SELECT idConsumoTpv, motivo FROM OPENJSON(@json) WITH (
		idConsumoTpv INT '$.idConsumoTpv'
		,motivo VARCHAR(100) '$.motivo'
	)

	IF (SELECT LEN(LTRIM(RTRIM(motivo))) FROM @tmp) = 0
		BEGIN
			SELECT '0' code, 'Debe ingresar un motivo!' as 'message'
			RETURN
		END

	IF EXISTS(SELECT 1 FROM Restaurant.ConsumoAnuladoTpv c WITH (NOLOCK)
						INNER JOIN @tmp t ON c.idConsumoTpv = t.idConsumoTpv) 
		BEGIN
			SELECT '0' code, 'Consumo ya ha sido anulado!' as 'message'
			RETURN
		END

	SELECT @idUsuario = idUsuario FROM AFTDataRol(@idRol)

 	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Restaurant.ConsumoAnuladoTpv(idConsumoTpv, motivo, fechaRegistro, idUsuario)
			SELECT idConsumoTpv, motivo, dbo.ufnGetDateEcuador(), @idUsuario FROM @tmp

			UPDATE Restaurant.ConsumoTpv WITH (ROWLOCK) SET estado = 0 WHERE idConsumoTpv = (SELECT idConsumoTpv FROM @tmp)

			SELECT '1' code, 'Anulado correctamente' as 'message' 
		COMMIT TRAN
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
