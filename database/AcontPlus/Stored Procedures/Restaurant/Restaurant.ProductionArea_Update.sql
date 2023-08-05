USE Acontplus
GO
--- Author: Danis Manchu.
IF OBJECT_ID('Restaurant.ProductionArea_Update') IS NOT NULL
BEGIN
	DROP PROC Restaurant.ProductionArea_Update
END
GO
CREATE PROC Restaurant.ProductionArea_Update
@userRoleId INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN 
SET NOCOUNT ON;
	DECLARE @code VARCHAR(5)
	DECLARE @description VARCHAR(100)
	DECLARE @UpdateddAt DATETIME
	DECLARE @userId INT
	DECLARE @enabled BIT

	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0'
								, [message]= 'No se encontraron detalles' 
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
		RETURN
	END

	SELECT @code		  = code
			,@description = description
			,@enabled	  = enabled
	FROM OPENJSON(@json)
	WITH(
		code VARCHAR(5)				'$.code'
		,description VARCHAR(500)   '$.description'
		,enabled	BIT				'$.enabled'
	)
	
	SET @UpdateddAt = (SELECT dbo.ufnGetDateEcuador())
	SET @userId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	
	BEGIN TRY
		BEGIN TRAN
			UPDATE Restaurant.ProductionArea
			SET code = @code
				,description = @description
				,UpdatedAt   = @UpdateddAt
				,enabled     = @enabled
				,userId		 = @userId
			WHERE Id = @id

		COMMIT TRAN

		SELECT response = (SELECT code = '0'
									, [message]= 'Actualizado exitosamente' 
							   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
	END TRY
	BEGIN CATCH
		SELECT response = (SELECT code = '0'
								  , [message] = 'Error al actualizar en base de datos' + ERROR_Message() 
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