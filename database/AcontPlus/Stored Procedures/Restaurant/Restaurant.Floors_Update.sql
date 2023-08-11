USE Acontplus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		DANIS MANCHU
-- Create date: 
-- Description:	Update
-- =============================================
IF OBJECT_ID('Restaurant.Floors_Update') IS NOT NULL
BEGIN 
	DROP PROC Restaurant.Floors_Update
END
GO
CREATE PROC Restaurant.Floors_Update
@userRoleId INT
,@id INT
,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @code VARCHAR(5)
		,@description VARCHAR(50)
		,@capacity INT
		,@codEstad VARCHAR(50)
		,@enabled BIT
		,@updatedAt DATETIME
		,@userId INT

	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0', 
									[message]= 'No se encontraron detalles'
							FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
		RETURN
	END

	SELECT @code			= code
			,@description	= description
			,@capacity		= capacity
			,@codEstad      = codEstad
			,@enabled       = enabled
	FROM OPENJSON(@json)
	WITH(
		code VARCHAR(5)			 '$.code'
		,description VARCHAR(50) '$.description'
		,capacity INT			 '$.capacity'
		,codEstad VARCHAR(50)	 '$.codEstad'
		,enabled BIT			 '$.enabled'
	)

	SET @updatedAt = (SELECT dbo.ufnGetDateEcuador())
	SET @userId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	
	BEGIN TRY
		BEGIN TRAN
			--- Valido los registros ----
		IF EXISTS(SELECT TOP 1 1 FROM Restaurant.[Floor] WHERE Code =  @code AND CodEstab = @codEstad AND Id != @id) 
			BEGIN
				SELECT response = (SELECT code = '0', [message]= 'El código ya encuentra en uso' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
				RETURN
			END
		
		BEGIN TRAN
			UPDATE Restaurant.[Floor]
			SET Description		= @description
				,Code			= @code
				,Capacity		= @capacity
				,Enabled		= @enabled
				,UpdatedAt		= @updatedAt	
				,UserId			= @userId
			WHERE Id = @id
		COMMIT TRAN 

		SELECT response = (SELECT code = '1', [message] = 'Ingresado correctamente' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT response = (SELECT code = '0'
									,[message] = 'Error al actualizar en base de datos' + ERROR_Message()
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        IF (@@TRANCOUNT > 0)
            BEGIN
				ROLLBACK TRAN
			END
			
        INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure
									, errorLine, errorMessage, idUsuario)

							VALUES(NEWID(), 'Restaurant.Floor/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE()
									, ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO