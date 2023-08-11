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
-- Author:		Ignacio Manchu
-- Create date: 11:55 - 03/08/2023
-- Description:	Insert floor.
-- =============================================
IF OBJECT_ID('Restaurant.Floors_Insert') IS NOT NULL
BEGIN 
	DROP PROC Restaurant.Floors_Insert
END
GO
CREATE PROCEDURE Restaurant.Floors_Insert
@userRoleId INT
 , @json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @code VARCHAR(5)
		,@description VARCHAR(50)
		,@capacity INT
		,@codeEstab VARCHAR(50)
		,@enabled BIT
		,@createAt DATETIME
		,@userId INT
		
	--- Valido que sea JSON
	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0', 
									[message]= 'No se encontraron detalles'
							FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
		RETURN
	END

		-- Decode JSON ---
	SELECT @code			= code
			,@description	= description
			,@capacity		= capacity
			,@codeEstab     = codEstad
			,@enabled       = enabled
	FROM OPENJSON(@json)
	WITH(
		code VARCHAR(5)			 '$.code'
		,description VARCHAR(50) '$.description'
		,capacity INT			 '$.capacity'
		,codEstad VARCHAR(50)	 '$.codEstad'
		,enabled BIT			 '$.enabled'
	)

	SET @createAt = (SELECT dbo.ufnGetDateEcuador())
	SET @userId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)

	BEGIN TRY
		--- Valido los registros ----
		IF EXISTS(SELECT TOP 1 1 FROM Restaurant.[Floor] WHERE Code =  @code AND CodEstab = @codeEstab) 
			BEGIN
				SELECT response = (SELECT code = '0', [message]= 'El código ya encuentra en uso' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
				RETURN
			END
		
		BEGIN TRAN
			INSERT INTO Restaurant.[Floor] (Code, Description, Capacity, CreatedAt, UpdatedAt, Enabled, Deleted, CodEstab, UserId)
			VALUES(@code, @description, @capacity, @createAt, NULL, @enabled, NULL, @codeEstab, @userId)			
		COMMIT TRAN 

		SELECT response = (SELECT code = '1', [message] = 'Ingresado correctamente' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
	END TRY
	BEGIN CATCH
		SELECT response = (SELECT code = '0'
									,[message] = 'Error al registrar en base de datos' + ERROR_Message()
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        IF (@@TRANCOUNT > 0)
            BEGIN
				ROLLBACK TRAN
			END
			
        INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure
									, errorLine, errorMessage, idUsuario)

							VALUES(NEWID(), 'Restaurant.Floor/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE()
									, ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO