

USE AcontPlus;

 GO

CREATE OR ALTER PROCEDURE Inventario.Etiqueta_Insert @userRoleId INT, @json VARCHAR(500), @fromMobile BIT 
AS
BEGIN
	DECLARE @idUsuario INT  
	DECLARE @idEntidad INT  
	DECLARE @descripcion VARCHAR(100)
	DECLARE @etiquetas VARCHAR(600) 

	SELECT 
		@descripcion = descripcion,
		@etiquetas = etiquetas
	FROM OPENJSON(@json)
	WITH(
		descripcion VARCHAR(100) , 
		etiquetas VARCHAR(600)  
	)

    SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

	BEGIN TRY
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Inventario.Etiqueta WHERE idEntidad = @idEntidad AND descripcion = LTRIM(TRIM(@descripcion)))
				BEGIN
					SELECT '0'code, 'Etiqueta con este nombre ya se encuentra registrado' as 'message'
					RETURN
				END

			INSERT INTO Inventario.Etiqueta(descripcion, etiquetas, fechaRegistro, idUsuario, idEntidad)
									VALUES(@descripcion,@etiquetas, dbo.ufnGetDateEcuador(), @idUsuario, @idEntidad)
			
			SELECT '1'code, 'Registrado correctamente' as 'message'
			
		COMMIT TRAN 
	END TRY
	BEGIN CATCH
		SELECT '0'code, 'Error al insertar etiqueta' as 'message'
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN

		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), 'Inventario/Etiqueta/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END 
