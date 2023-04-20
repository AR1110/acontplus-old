

IF OBJECT_ID('Config.UserPermission_CheckHasPermission') IS NOT NULL
	DROP PROCEDURE Config.UserPermission_CheckHasPermission
GO

CREATE PROCEDURE Config.UserPermission_CheckHasPermission @idUsuarioRol INT, @json VARCHAR(300)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @codModule VARCHAR(5)
	DECLARE @typeCheck INT 


	SELECT 


END 