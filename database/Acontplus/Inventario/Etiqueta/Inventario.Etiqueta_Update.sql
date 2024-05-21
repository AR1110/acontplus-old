
USE AcontPlus;

IF OBJECT_ID('Inventario.Etiqueta_Update') IS NOT NULL
	DROP PROCEDURE Inventario.Etiqueta_Update 
GO 

CREATE PROCEDURE Inventario.Etiqueta_Update @idUsuarioRol INT, @id INT, @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT 
	DECLARE @idEntidad INT 

	DECLARE @descripcion VARCHAR(800)
	DECLARE @etiquetas VARCHAR(900) 
	DECLARE @estado BIT 

	SELECT top 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	SELECT 
		@descripcion = descripcion,
		@etiquetas = etiquetas,
		@estado = estado
	FROM OPENJSON(@json)
	WITH(
		descripcion VARCHAR(100) '$.descripcion',
		etiquetas VARCHAR(600) '$.etiquetas',
		estado BIT '$.estado'
	)

	DECLARE @compEtiquetaArticulo AS TABLE(
		idArticulo INT NOT NULL,
		idEtqueta INT NOT NULL
	)

	BEGIN TRY
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Inventario.Etiqueta WHERE descripcion = LTRIM(TRIM(@descripcion)) AND idEtiqueta !=@id)
				BEGIN
					SELECT '0'code, 'Etiqueta con este nombre ya se encuentra registrado' as 'message'
					RETURN
				END

			IF @estado = 0
				BEGIN 
					IF EXISTS(SELECT 1 FROM Articulo WHERE idEntidad = @idEntidad AND idEtiqueta = @id)
						BEGIN 
							SELECT '0'code, 'No es posible desactivar esta etiqueta mientras esté siendo utilizada en un artículo.' as 'message'
							RETURN
						END 
				END

			

			UPDATE Inventario.Etiqueta SET descripcion = @descripcion, etiquetas = @etiquetas, estado = @estado, idUsuario=@idUsuario WHERE idEtiqueta = @id		
			
			SELECT '1'code, 'Actualizado correctamente' as 'message'
			
		COMMIT TRAN 
	END TRY
	BEGIN CATCH
		SELECT '0'code, 'Error al actualizar etiqueta' as 'message'
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN

		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), 'api/Etiqueta/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
	--SELECT * FROM Compra.CompEtiquetaArticulo
	--SELECT * FROM Inventario.Etiqueta
	--UPDATE Inventario.Etiqueta set etiquetas ='[{"codigo": "S", "descripcion":"SERIE"},{"codigo":"LL", "descripcion":"LLANTA"}]' WHERE idEtiqueta=4
END 
