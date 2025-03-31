USE AcontPlus;
 GO

CREATE OR ALTER PROCEDURE Config.SolicitudAutorizacion_Update @userRoleId INT, @json VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @id INT;
	DECLARE @tipo INT 
	DECLARE @codigoAccion VARCHAR(5)
    DECLARE @rowguid VARCHAR(MAX)

    DECLARE @idDocumento INT 
    DECLARE @codigoModulo VARCHAR(10)

	DECLARE @userId INT
    DECLARE @tbSolicitudAuth AS TABLE (
        idSolicitud INT NOT NULL UNIQUE  
    )


	SELECT @id = idSolicitudAutorizacion, 
		   @tipo = tipo,
		   @codigoAccion = codigoAccion
           ,@idDocumento = idDocumento 
           ,@codigoModulo = codigoModulo 
           ,@rowguid = rowguid
	FROM OPENJSON(@json)
	WITH(
		idSolicitudAutorizacion INT  
		,tipo INT
		,codigoAccion VARCHAR(5)
        ,idDocumento INT 
        ,codigoModulo VARCHAR(10)
        ,rowguid VARCHAR(MAX)
	)

	SELECT TOP 1 @userId = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

    -- tipo  1 : cuando el usuario aprobante acepta la solicitud 
    -- tipo  2: cuando el usuario solicitante ya actualizó o anule el documento 
    -- tipo  3:  cuando el usuario aprobante rechaza la solicitud
    
	IF @tipo = 1
		BEGIN 
			IF EXISTS(SELECT 1 FROM Config.SolicitudAutorizacion WHERE Id = @id AND (codigoEstado='A' OR codigoEstado='F' OR codigoEstado='R'))
				BEGIN 
					 SELECT '0'code,'Este solicitud ya ha sido finalizada' as [message]
					RETURN 
				END 	
		END  
        

	BEGIN TRY
		BEGIN TRAN 
			IF @tipo = 1
				BEGIN 	 
					UPDATE Config.SolicitudAutorizacion SET codigoEstado='A', fechaRespuesta = dbo.ufnGetDateEcuador() WHERE rowguid = @rowguid
					SELECT  '1'code,'Concedido la autorización Correctamente'  as [message]
                    EXEC Config.UserCustomerRequest_SendMail @userRoleId, @id
				END 
				
			IF @tipo = 2  
				BEGIN 
                    SELECT top 1 @id=idSolicitudAutorizacion,@rowguid = rowguid FROM Config.vw_SolicitudAutorizacion WHERE idUsuarioRolSolicitante = @userRoleId 
                                                                                AND idDocumento = @idDocumento 
                                                                                AND codigoModulo      = @codigoModulo
                                                                               AND codigoAccion = @codigoAccion 
                                                                                   AND  codigoEstado='A'                  
                    
					IF @id > 0
						BEGIN
							UPDATE Config.SolicitudAutorizacion SET codigoEstado='F' WHERE rowguid= @rowguid
                             EXEC Config.UserCustomerRequest_SendMail @userRoleId, @id
							SELECT '1'code,'Completado la solictud de autorización' as [message]
						END 
				END 

			IF @tipo = 3
				BEGIN
					UPDATE Config.SolicitudAutorizacion SET codigoEstado='R', fechaRespuesta = dbo.ufnGetDateEcuador() WHERE rowguid = @rowguid
					SELECT  '1'code,'Rechazado la Solicitud autorización Correctamente'  as [message]
				END
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/SolicitudAutorizacion/Put',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@userId

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message' 		

	END CATCH 


END 