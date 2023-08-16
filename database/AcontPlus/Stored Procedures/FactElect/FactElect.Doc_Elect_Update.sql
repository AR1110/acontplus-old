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
	DECLARE @message VARCHAR(100) = 'No actualizado'
	DECLARE @codeResponse VARCHAR(1) = '0'

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
					SET @codeResponse = '1'
					SET @message = 'Enviado a autorizar en el SRI'
				END

			IF (@codEstado IN (0,5))
				BEGIN
					UPDATE DocumentoElectronico SET codEstado = 1 WHERE idDocumentoElectronico = @id
					SET @codeResponse = '1'
					SET @message = 'El Xml se esta Actualizando'
				END

		COMMIT TRAN 
		SELECT @codeResponse , @message 'message'
		RETURN
	END TRY
	
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
	END CATCH



END 
