USE [AcontPlus]

IF OBJECT_ID('FactElect.Notificacion_Tributaria_Insert') IS NOT NULL
	DROP PROCEDURE FactElect.Notificacion_Tributaria_Insert
GO

--Author: Emilio Senguana 
--Fecha Creación: 22-12-2022 16h13 PM

CREATE PROCEDURE FactElect.Notificacion_Tributaria_Insert @idRol INT, @json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	DECLARE @idDocumentoElectronico BIGINT;
	DECLARE @receptor NVARCHAR(150);
	DECLARE @estado VARCHAR(3);


	SELECT @idDocumentoElectronico = idDocumentoElectronico, @receptor = receptor, @estado = 'NE'
	FROM OPENJSON(@json)
	WITH(idDocumentoElectronico BIGINT '$.idDocumentoElectronico',receptor NVARCHAR(150) '$.receptor')


	BEGIN TRY
		BEGIN TRAN
			INSERT INTO FactElect.NotificacionTributaria (idDocumentoElectronico, receptor, estado)
			SELECT @idDocumentoElectronico,REPLACE(@receptor,';',','), @estado
		COMMIT TRAN 
		SELECT '1'code, 'Reenviado el Correo Correctamente'as'message', 'Reenvío por Correo' as titleSms		
		RETURN 
	END TRY

	BEGIN CATCH
		SELECT '0'code,'Info: Error en el procedimiento de Reenvío por Correo ' + ERROR_MESSAGE() as 'message', 'Reenvío por Correo' as titleSms
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
	END CATCH

END

