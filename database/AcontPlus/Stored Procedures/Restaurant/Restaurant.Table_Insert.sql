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
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROC Restaurant.Table_Insert
@userRoleId INT
,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @RoomId INT
			,@NumberTable INT
			,@Description VARCHAR(100)
			,@Capacity INT 
			,@Enabled BIT
			,@UserId INT
			,@CreateAt DATETIME 

	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0', [message]= 'No se encontraron detalles' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
		RETURN
	END

	SELECT @RoomId			= RoomId
			,@NumberTable	= NumberTable
			,@Description   = Description
			,@Enabled		= Enabled
	FROM OPENJSON(@json) 
	WITH (
		RoomId INT					'$.RoomId'
		,NumberTable INT			'$.NumberTable'
		,Description NVARCHAR(100)	'$.Description'
		,Capacity INT				'$.Capacity'
		,Enabled BIT				'$.Enabled'
	)

	SET @CreateAt = (SELECT dbo.ufnGetDateEcuador())
	SET @UserId = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	   
	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Restaurant.[Table](RoomId, NumberTable, Description, Capacity, CreatedAt, UpdatedAt, Enabled, Deleted, UserId)
			VALUES(@RoomId, @NumberTable, @Description, @Capacity, @CreateAt, NULL, @Enabled, NULL, @UserId)
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
		(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES(NEWID(), 'Restaurant.Table/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO

