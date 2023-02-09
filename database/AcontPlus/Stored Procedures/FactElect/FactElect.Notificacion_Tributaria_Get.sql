USE [AcontPlus]

IF OBJECT_ID('FactElect.Notificacion_Tributaria_Get') IS NOT NULL
	DROP PROCEDURE FactElect.Notificacion_Tributaria_Get
GO

--Author: Alexis Ramirez
--Fecha Creación: 27-12-2022 16h13 PM

CREATE PROCEDURE FactElect.Notificacion_Tributaria_Get @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	DECLARE @idDocumentoElectronico BIGINT
	DECLARE @sql NVARCHAR(MAX) = 'SELECT 
										idNotificacionTributaria
									   ,receptor
									   ,fechaEnvio
									   ,estado
									   ,msgError 
								  FROM factelect.notificaciontributaria
								  WHERE idNotificacionTributaria > 0 '

	DECLARE @params NVARCHAR(MAX) = '@idDocumentoElectronico INT'

	SELECT @idDocumentoElectronico = idDocumentoElectronico FROM OPENJSON(@json) WITH(idDocumentoElectronico BIGINT '$.idDocumentoElectronico',receptor NVARCHAR(150) '$.receptor')

	SET @sql = @sql+'AND idDocumentoElectronico = @idDocumentoElectronico ORDER BY idNotificacionTributaria DESC '

	EXEC sp_executesql @sql,@params
				           ,@idDocumentoElectronico = @idDocumentoElectronico

END

