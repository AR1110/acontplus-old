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
	DECLARE @message VARCHAR(100) = 'No actualizado'
	DECLARE @codeResponse VARCHAR(1) = '0'
    DECLARE @fechaCaducidad DATE ,@firma INT


	BEGIN TRY	
        SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol	

        SELECT TOP 1 @fechaCaducidad = fechaCaducidad ,@firma = idFirmaElectronica FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad

	    IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado = 4) 
		    BEGIN
			    SELECT '0'code,'El comprobante ya se encuentra autorizado' as 'message'
			    RETURN 
		    END

        IF @firma IS NULL
			BEGIN
				SELECT '0' code,'No tienes configurada ninguna firma electrónica.' AS 'message'
				RETURN
			END

        IF DATEDIFF(DAY,@fechaCaducidad,GETDATE()) = 0 
			BEGIN
				SELECT '0'code,'Su firma ha caducado no puede firmar comprobantes electrónicos' as 'message'
				RETURN
			END

        

		BEGIN TRAN 

			IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado = 2 AND isAutomatic = 0) 
				BEGIN 
					UPDATE DocumentoElectronico SET isAutomatic = 1 WHERE idDocumentoElectronico = @id
					SET @codeResponse = '1'
					SET @message = 'Enviado a autorizar en el SRI'
				END

            IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado = 2 AND isAutomatic = 1) 
				BEGIN 
					UPDATE DocumentoElectronico SET codEstado = 1 WHERE idDocumentoElectronico = @id
					SET @codeResponse = '1'
					SET @message = 'Enviado a autorizar en el SRI'
				END

			IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado IN (0,5))
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
