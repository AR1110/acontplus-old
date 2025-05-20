USE [Acontplus]
GO 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Config.UserCustomerPermission_Insert @userRoleId INT, @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @permissionsData VARCHAR(MAX) 
	DECLARE @userRoleIdAdd INT 

	SELECT  
		@permissionsData = permissionsData 
		,@userRoleIdAdd = userRoleId
	FROM OPENJSON(@json)
	WITH(
		userRoleId INT,
		permissionsData NVARCHAR(MAX) 
	)

	BEGIN TRY
		BEGIN TRAN  
          
			INSERT INTO Config.UserPermission (idUsuarioRol, permissionsData) VALUES(@userRoleIdAdd, @permissionsData) 
				
		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' AS 'message'
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
