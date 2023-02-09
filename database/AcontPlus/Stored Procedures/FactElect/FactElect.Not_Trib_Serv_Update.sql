

IF OBJECT_ID('FactElect.Not_Trib_Serv_Update') IS NOT NULL
	DROP PROCEDURE FactElect.Not_Trib_Serv_Update
GO

CREATE PROCEDURE FactElect.Not_Trib_Serv_Update @id int, @estado VARCHAR(5), @msgError NVARCHAR(MAX) = NULL
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	IF @estado='E'
		BEGIN	
			UPDATE FactElect.NotificacionTributaria SET estado = @estado, fechaEnvio = dbo.ufnGetDateEcuador() WHERE idNotificacionTributaria = @id;				
			RETURN
		END 

	IF @estado='NE'
		BEGIN	
			UPDATE FactElect.NotificacionTributaria SET estado = @estado WHERE idNotificacionTributaria = @id;				
			RETURN
		END
	

	IF @estado='ERROR'
		BEGIN	
			UPDATE FactElect.NotificacionTributaria SET estado = @estado, msgError = @msgError WHERE idNotificacionTributaria = @id;				
			RETURN
		END

END