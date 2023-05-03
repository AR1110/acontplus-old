

IF OBJECT_ID('Config.UserPermission_CheckHasPermission') IS NOT NULL
	DROP PROCEDURE Config.UserPermission_CheckHasPermission
GO

-- Config.UserPermission_CheckHasPermission 28, '{"typeCheck": 1, "clave": "12345"}'
CREATE PROCEDURE Config.UserPermission_CheckHasPermission @idUsuarioRol INT, @json VARCHAR(300)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @codModule VARCHAR(5)
	DECLARE @typeCheck INT 
	DECLARE @contraseniaEncryptada BINARY(64) ;
	DECLARE @clave nvarchar (150)


	SELECT 
		@clave = clave,
		@typeCheck = typeCheck
	FROM OPENJSON(@json)
	WITH(
		typeCheck INT '$.typeCheck',
		clave nvarchar (150) '$.clave'
	)
	
	
	IF @typeCheck = 1
		BEGIN
			
			
			SET @contraseniaEncryptada = HASHBYTES('SHA2_512', @clave)

			IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol) AND contrasenia = @contraseniaEncryptada )
				BEGIN
					SELECT '1'code, 'Clave correcta' as 'message'
					RETURN
				END 
			ELSE
				BEGIN
					SELECT '0'code,'Clave Incorrecta.' as 'message'
					RETURN 
				END
		END 


END 