USE Acontplus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Dish_Update
@userRoleId INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN	
	SET NOCOUNT ON;
	
	DECLARE @ProductId INT
			,@ProductionAreaId INT
			,@Enabled BIT
			,@UpdatedAt DATETIME
			,@UserId INT

	--- VALIDATE JSON ---
	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0'
								, [message]= 'No se encontraron detalles' 
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
		RETURN
	END

	--- GET DATA FROM JSON ---
	SELECT @ProductId			= ProductId
			,@Enabled			= Enabled
			,@ProductionAreaId  = ProductionAreaId
	FROM OPENJSON(@json) 
	WITH (
		ProductId INT			'$.ProductId'
		,Enabled BIT			'$.Enabled'
		,ProductionAreaId INT	'$.ProductionAreaId'		
	)

	--- GET DATA FROM DATABASE ----
	SET @UpdatedAt = (SELECT dbo.ufnGetDateEcuador())
	SET @UserId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)

	BEGIN TRY
		BEGIN TRAN
			UPDATE Restaurant.[Dish]
			SET ProductId			= @ProductId
				,UpdatedAt			= @UpdatedAt
				,Enabled			= @Enabled
				,ProductionAreaId	= @ProductionAreaId
				,UserId				= @UserId
			WHERE Id = @id
		COMMIT TRAN
		SELECT response = (SELECT code = '0'
								  , [message]= 'Actualizado correctamente' 
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
		VALUES(NEWID(), 'Restaurant.Dish/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO

