USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR UPDATE TPV CONFIGS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConfigTpv_Update', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConfigTpv_Update
GO
CREATE PROCEDURE Restaurant.ConfigTpv_Update @idRol INT
,@json VARCHAR(MAx)
AS
BEGIN
	SET NOCOUNT ON;

	
	DECLARE @idUsuario INT
	
	DECLARE @tmp AS TABLE (
		idConfigTpv INT
		,codigo VARCHAR(2)
		,descripcion VARCHAR(100)
		,horaInicio TIME
		,horaFin TIME
		,estado BIT
	)

	INSERT INTO @tmp(idConfigTpv, codigo, descripcion, horaInicio, horaFin, estado)
	SELECT idConfigTpv, codigo, descripcion, horaInicio, horaFin, estado FROM OPENJSON(@json) WITH (
		idConfigTpv INT '$.idConfigTpv'
		,codigo VARCHAR(2) '$.codigo'
		,descripcion VARCHAR(100) '$.descripcion'
		,horaInicio TIME '$.horaInicio'
		,horaFin TIME '$.horaFin'
		,estado BIT '$.estado'
	)

	SELECT   @idUsuario = idUsuario FROM AFTDataRol(@idRol)

	BEGIN TRY
		BEGIN TRAN 
			UPDATE tpv SET tpv.horaInicio = tmp.horaInicio
			,tpv.horaFin = tmp.horaFin
			,tpv.estado = tmp.estado
			FROM Restaurant.ConfigTpv tpv WITH (NOLOCK)
			JOIN (
			SELECT idConfigTpv, codigo, descripcion, horaInicio, horaFin, estado FROM @tmp
			) AS tmp ON tpv.idConfigTpv = tmp.idConfigTpv
			SELECT '1' code, 'Se actualizo correctamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
