USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR INSERT TPV CONFIGS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConfigTpv_Insert', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConfigTpv_Insert
GO
CREATE PROCEDURE Restaurant.ConfigTpv_Insert @idRol INT
,@json VARCHAR(MAx)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @codEstab VARCHAR(50)
	DECLARE @idUsuario INT
	
	DECLARE @tmp AS TABLE (
		codigo VARCHAR(2)
		,descripcion VARCHAR(100)
		,horaInicio TIME
		,horaFin TIME
	)

	INSERT INTO @tmp(codigo, descripcion, horaInicio, horaFin)
	SELECT codigo, descripcion, horaInicio, horaFin FROM OPENJSON(@json) WITH (
		codigo VARCHAR(2) '$.codigo'
		,descripcion VARCHAR(100) '$.descripcion'
		,horaInicio TIME '$.horaInicio'
		,horaFin TIME '$.horaFin'
	)

	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @codEstab = @codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Restaurant.ConfigTpv(codEstab, codigo, descripcion, horaInicio, horaFin, orden)
			SELECT @codEstab, codigo, descripcion, horaInicio, horaFin, CASE WHEN codigo = 'D' THEN 1 WHEN codigo =  'A' THEN 2 ELSE 3 END FROM @tmp
			SELECT '1' code, 'Se guardo correctamente' as 'message'
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
