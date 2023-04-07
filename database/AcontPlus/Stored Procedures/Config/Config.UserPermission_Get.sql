




USE AcontPlus;

IF OBJECT_ID('Config.UserPermission_Get') IS NOT NULL
	DROP PROCEDURE Config.UserPermission_Get
GO

CREATE PROCEDURE Config.UserPermission_Get @json VARCHAR(300)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuarioRol INT

	SELECT 
		@idUsuarioRol = idUsuarioRol
	FROM OPENJSON(@json)
	WITH(
		idUsuarioRol INT '$.idUsuarioRol'
	)

	IF EXISTS(SELECT 1 FROM Config.UserPermission WHERE idUsuarioRol = @idUsuarioRol)
		BEGIN 
			SELECT 
				jsonPermission
			FROM Config.UserPermission WHERE idUsuarioRol = @idUsuarioRol
		END 
END 