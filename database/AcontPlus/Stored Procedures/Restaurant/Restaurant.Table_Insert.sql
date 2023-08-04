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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- description:	<description,,>
-- =============================================
-- Restaurant.Table_Insert 139, '{"id": 0,"roomId": 1,"numberTable": 64,"description": "MESA 2","capacity": 1,"enabled": true}'
CREATE OR ALTER PROC Restaurant.Table_Insert
@userRoleId INT
,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @roomId INT
			,@numberTable INT
			,@description VARCHAR(100)
			,@capacity INT 
			,@enabled BIT
			,@UserId INT
			,@CreateAt DATETIME 

	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0', [message]= 'No se encontraron detalles' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
		RETURN
	END

	SELECT @roomId			= roomId
			,@numberTable	= numberTable
			,@description   = description
			,@capacity		= ISNULL(capacity, 0)
			,@enabled		= enabled
	FROM OPENJSON(@json) 
	WITH (
		roomId INT					'$.roomId'
		,numberTable INT			'$.numberTable'
		,description NVARCHAR(100)	'$.description'
		,capacity INT				'$.capacity'
		,enabled BIT				'$.enabled'
	)

	---SELECT @roomId

	SET @CreateAt = (SELECT dbo.ufnGetDateEcuador())
	SET @UserId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	   
	BEGIN TRY
		IF EXISTS(SELECT TOP 1 1 FROM Restaurant.[Table] WHERE NumberTable = @numberTable)
			BEGIN 
				SELECT response = (SELECT code = '0', [message]= 'Número de tabla '+CAST(@numberTable AS VARCHAR) + ' está en uso'  FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
				RETURN
			END 
				
		BEGIN TRAN
			INSERT INTO Restaurant.[Table](roomId, numberTable, Description, capacity, CreatedAt, UpdatedAt, Enabled, Deleted, UserId)
			VALUES(@roomId, @numberTable, @description, @capacity, @CreateAt, NULL, @enabled, NULL, @UserId)
 		COMMIT TRAN

		SELECT response = (SELECT code = '1', [message] = 'Ingresado correctamente' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
	END TRY
	BEGIN CATCH
		SELECT response = (SELECT code = '0', [message] = 'Error al registrar en base de datos' + ERROR_Message() FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        IF (@@TRANCOUNT > 0)
            BEGIN
				ROLLBACK TRAN
			END
			
        INSERT INTO ErroresSistema
		(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario, errorDate)
		VALUES(NEWID(), 'Restaurant.Table/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId, @CreateAt)
	END CATCH
END
GO

