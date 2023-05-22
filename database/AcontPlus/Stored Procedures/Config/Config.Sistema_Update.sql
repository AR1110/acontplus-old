USE AcontPlus;

IF OBJECT_ID('Config.Sistema_Update')IS NOT NULL
	DROP PROCEDURE Config.Sistema_Update
GO


-- =============================================
-- Author:		Ramirez Alexis.
-- Create date: 5/09/2023 11:57 AM
-- Description:	GET para traer la configuracion del sistema
-- =============================================

CREATE PROCEDURE Config.Sistema_Update @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @jsonConfig AS VARCHAR(MAX)
	DECLARE @idSistema AS INT



	BEGIN TRY
		
		SELECT @jsonConfig = jsonConfig, @idSistema = idSistema FROM OPENJSON(@json) WITH (idSistema INT '$.idSistema', jsonConfig NVARCHAR(MAX) '$.jsonConfig' AS JSON)

		IF ISJSON(@jsonConfig) = 0	
			BEGIN
				SELECT '0'code,'Error en el json' as 'message'
				RETURN 
			END 

		BEGIN TRAN 
			UPDATE Config.Sistema SET jsonConfig = @jsonConfig WHERE idSistema = @idSistema 
		COMMIT TRAN 
		SELECT '1'code,'Registrado Exitosamente' as 'message'
		RETURN 

	END TRY 


	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento ' + ERROR_MESSAGE() as  'message'
	END CATCH

END
GO
