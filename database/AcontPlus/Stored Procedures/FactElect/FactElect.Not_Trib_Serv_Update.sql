

IF OBJECT_ID('FactElect.Not_Trib_Serv_Update') IS NOT NULL
	DROP PROCEDURE FactElect.Not_Trib_Serv_Update
GO

CREATE PROCEDURE FactElect.Not_Trib_Serv_Update @id BIGINT, @estado VARCHAR(5), @msgError NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	IF @estado='E'
		BEGIN	
			UPDATE FactElect.NotificacionTributaria SET estado = @estado, fechaEnvio = dbo.ufnGetDateEcuador() WHERE idNotificacionTributaria = @id;				
		END 

	IF @estado='NE'
		BEGIN	
			UPDATE FactElect.NotificacionTributaria SET estado = @estado WHERE idNotificacionTributaria = @iD
		END
	

	IF @estado='ERROR' OR @estado = 'EE'
		BEGIN	
			UPDATE FactElect.NotificacionTributaria SET estado = @estado, msgError = @msgError WHERE idNotificacionTributaria = @id;				
		END

END