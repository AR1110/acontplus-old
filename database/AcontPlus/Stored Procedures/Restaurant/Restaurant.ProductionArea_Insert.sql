USE Acontplus
GO
--- Author: Danis Manchu.
IF OBJECT_ID('Restaurant.ProductionArea_Insert') IS NOT NULL
BEGIN
	DROP PROC Restaurant.ProductionArea_Insert
END
GO
CREATE PROC Restaurant.ProductionArea_Insert
@userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN 
SET NOCOUNT ON;
	DECLARE @code VARCHAR(5)
	DECLARE @Description VARCHAR(100)
	DECLARE @CreatedAt DATETIME
	DECLARE @UserId INT
	DECLARE @Enabled BIT

	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0'
								, [message]= 'No se encontraron detalles' 
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
		RETURN
	END

	SELECT @code		  = Code
			,@Description = Description
	FROM OPENJSON(@json)
	WITH(
		Code VARCHAR(5)				'$.Code'
		,Description VARCHAR(500)   '$.Description'		
	)

	SET @Enabled = 1
	SET @CreatedAt = (SELECT dbo.ufnGetDateEcuador())
	SET @UserId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	
	BEGIN TRY
		BEGIN TRAN

			INSERT INTO Restauran.[ProductionArea](Code, Description, CreatedAt, UpdateAt, Enabled, Deleted, UserId)
			VALUES(@Code, @Description, @CreatedAt, NULL, @Enabled,NULL, @UserId)

		COMMIT TRAN

		SELECT response = (SELECT code = '0'
									, [message]= 'Ingresado exitosamente' 
							   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
	END TRY
	BEGIN CATCH
		SELECT response = (SELECT code = '0'
								  , [message] = 'Error al registrar en base de datos' + ERROR_Message() 
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        IF (@@TRANCOUNT > 0)
            BEGIN
				ROLLBACK TRAN
			END			

        INSERT INTO ErroresSistema
		(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES(NEWID(), 'Restaurant.ProductionArea/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END