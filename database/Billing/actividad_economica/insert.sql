USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-09-11
-- Description: sp for get
-- =============================================
CREATE OR ALTER PROCEDURE Sri.ActividadEconomica_Insert @userId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	DECLARE @codigo VARCHAR(9),
		@codTarifaImpuesto VARCHAR(4),
		@porcentaje DECIMAL(15,5),
		@descripcion VARCHAR(500),
		@codGrupo VARCHAR(9),
		@grupo VARCHAR(500);
	BEGIN TRY 
		SELECT @codigo = codigo,
			@codTarifaImpuesto = codTarifaImpuesto,
			@porcentaje = porcentaje,
			@descripcion = descripcion,
			@codGrupo = codGrupo,
			@grupo = grupo
		FROM OPENJSON(@json)
		WITH (codigo VARCHAR(9), codTarifaImpuesto VARCHAR(4), porcentaje DECIMAL(15,5), 
		descripcion VARCHAR(500), codGrupo VARCHAR(9), grupo VARCHAR(500))
		BEGIN TRAN
			INSERT INTO Sri.ActividadEconomica([codigo], [codTarifaImpuesto], [porcentaje], [descripcion], [grupo], codGrupo, idUsuario)
			VALUES(@codigo, @codTarifaImpuesto, @porcentaje, @descripcion, @grupo, @codGrupo, @userId)
		COMMIT TRAN
		SELECT '0' code, 'Registrada Exitosamente' as 'message'
	END TRY
	BEGIN CATCH
		SELECT '50001' code, 'Error al registrar' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
			INSERT INTO Common.ErrorLog([ErrorMethod], [ErrorNumber], [ErrorSeverity], [ErrorState], [ErrorProcedure], [ErrorLine], [ErrorMessage], [UserId])
			VALUES('ActividadEconomica/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
	END CATCH
END
GO
