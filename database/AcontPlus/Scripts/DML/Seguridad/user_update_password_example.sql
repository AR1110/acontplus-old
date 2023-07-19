USE AcontPlus
GO
--select * from seguridad.usuario where nombreUsuario = 'corream'

DECLARE @username VARCHAR(100) = 'emilio.senguana'
,@email VARCHAR(100) = 'sengua2000@outlook.com'
,@fullname  VARCHAR(200) = 'corream'
,@password VARCHAR(100) = '12345'
,@cardId VARCHAR(25) = '1450152325'
,@salt UNIQUEIDENTIFIER = NEWID()
,@hashedPassword VARBINARY(128)

SET @hashedPassword = HASHBYTES('SHA2_512', CONCAT(@password, CAST(@salt AS NVARCHAR(36))));
UPDATE Seguridad.Usuario set contrasenia = @hashedPassword, salt = @salt WHERE idUsuario = 11
