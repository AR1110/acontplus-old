USE [AcontPlus]
GO

IF OBJECT_ID('FactElect.Doc_Elect_Update') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Update
GO

CREATE PROCEDURE FactElect.Doc_Elect_Update
	@idRol INT,
	@id INT
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT	
	DECLARE @codEstado INT
	DECLARE @message VARCHAR(100)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol	

	SELECT @codEstado = codEstado FROM dbo.DocumentoElectronico WHERE idDocumentoElectronico = @id

	IF @codEstado = 4 
		BEGIN
			SELECT '0'code,'El comprobante ya se encuentra autorizado' as 'message'
			RETURN 
		END 

	BEGIN TRY	
		BEGIN TRAN 
			IF @codEstado = 2
				BEGIN 
					UPDATE DocumentoElectronico SET isAutomatic = 1 WHERE idDocumentoElectronico = @id
					SET @message = 'Autorizado Correctamente'
				END 

			ELSE IF @codEstado = 5 OR @codEstado = 0
				BEGIN
					UPDATE DocumentoElectronico SET codEstado = 1 WHERE idDocumentoElectronico = @id
					SET @message = 'El Xml se esta Actualizando'

				END 
			
		COMMIT TRAN 
		SELECT '1' code,@message as 'message'
		RETURN
	END TRY
	
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
	END CATCH



END 
