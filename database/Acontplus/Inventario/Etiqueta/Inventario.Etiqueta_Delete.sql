

IF OBJECT_ID('Inventario.Etiqueta_Delete ') IS NOT NULL
	DROP PROCEDURE Inventario.Etiqueta_Delete 
GO

CREATE PROCEDURE Inventario.Etiqueta_Delete @idUsuarioRol INT, @id INT
AS
BEGIN 
	DECLARE @idUsuario INT = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)

	BEGIN TRY
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Inventario.Etiqueta WHERE idEtiqueta = @id AND estado = 1)
				BEGIN
					SELECT '0'code, 'La etiqueta no puede ser eliminada debido a que aún se encuentra activa.' as 'message'
					RETURN
				END

			DELETE FROM Inventario.Etiqueta WHERE idEtiqueta = @id
			
			SELECT '1'code, 'Eliminado correctamente' as 'message'
			
		COMMIT TRAN 
	END TRY
	BEGIN CATCH
		SELECT '0'code, 'Error al insertar etiqueta' as 'message'
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN

		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), 'api/Etiqueta/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END 
