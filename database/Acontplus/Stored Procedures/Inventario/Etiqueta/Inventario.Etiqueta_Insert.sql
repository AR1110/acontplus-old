

USE AcontPlus;

IF OBJECT_ID('Inventario.Etiqueta_Insert') IS NOT NULL
	DROP PROCEDURE Inventario.Etiqueta_Insert
GO

CREATE PROCEDURE Inventario.Etiqueta_Insert @idUsuarioRol INT, @json VARCHAR(500)
AS
BEGIN
	DECLARE @idUsuario INT = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	DECLARE @idEntidad INT = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	DECLARE @descripcion VARCHAR(100)
	DECLARE @etiquetas VARCHAR(600) 

	SELECT 
		@descripcion = descripcion,
		@etiquetas = etiquetas
	FROM OPENJSON(@json)
	WITH(
		descripcion VARCHAR(100) '$.descripcion',
		etiquetas VARCHAR(600) '$.etiquetas'
	)

	BEGIN TRY
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Inventario.Etiqueta WHERE descripcion = LTRIM(TRIM(@descripcion)))
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
		VALUES (NEWID(), 'api/Etiqueta/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END 
