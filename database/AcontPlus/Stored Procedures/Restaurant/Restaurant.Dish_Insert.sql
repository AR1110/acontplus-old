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
-- Author:		IGNACIO MANCHU
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE Restaurant.Dish_Insert
@userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN	
	SET NOCOUNT ON;
	
	DECLARE @ProductId INT
			,@ProductionAreaId INT
			,@CreateAt DATETIME
			,@UserId INT

	IF (ISJSON(@json) = 0)
	BEGIN
		SELECT response = (SELECT code = '0'
								, [message]= 'No se encontraron detalles' 
						   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
		RETURN
	END

	SELECT @ProductId			= RoomId
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
	END TRY
	BEGIN CATCH
	END CATCH
END
GO


SELECT * FROM Restaurant.[Dish]