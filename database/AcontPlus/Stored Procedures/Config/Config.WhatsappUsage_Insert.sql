USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-05-23
-- Description:	 SP FOR WHATSAPP USAGE UPDATE
-- =============================================
IF OBJECT_ID(N'Config.WhatsappUsage_Insert', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsappUsage_Insert
GO
CREATE PROCEDURE Config.WhatsappUsage_Insert @idUsuarioRol INT 
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	
	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Config.WhatsappUsage(ruc, fechaInicio, limite, ilimitado, estado, idUsuario)
			SELECT TOP 1 ruc, dbo.ufnGetDateEcuador(), limite, ISNULL(ilimitado, 1), ISNULL(estado, 1), @idUsuario FROM OPENJSON (@json) 
														WITH (
																ruc VARCHAR(25) '$.ruc',
																limite INT '$.limite',
																ilimitado BIT '$.ilimitado',
																estado BIT '$.estado'
																)

			SELECT '1' code, 'Guardado Exitosamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'WhatsappUsage/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
