
USE AcontPlus


IF OBJECT_ID('Config.UserPermission_Update')IS NOT NULL
	DROP PROCEDURE Config.UserPermission_Update 
GO 

CREATE PROCEDURE Config.UserPermission_Update @idUsuarioRol INT, @jsonPermission VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	BEGIN TRY
		BEGIN TRAN 
			UPDATE up
			SET up.jsonPermission = jsondata.jsonPermission
			FROM Config.UserPermission  up
			INNER JOIN OPENJSON(@jsonPermission) WITH (
				 idUserPermission INT '$.idUserPermission',
				jsonPermission NVARCHAR(MAX) '$.jsonPermission' as JSON
			) jsondata ON up.idUserPermission = jsondata.idUserPermission;

				
		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' AS 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message', titleSms = ''
	END CATCH 
END 
