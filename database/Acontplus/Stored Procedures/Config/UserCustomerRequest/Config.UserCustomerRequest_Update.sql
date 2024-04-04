USE AcontPlus;
 GO

CREATE OR ALTER PROCEDURE Config.UserCustomerRequest_Update @userRoleId INT, @json VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @id INT;
	DECLARE @tipo INT 
	DECLARE @codigoAccion VARCHAR(5)

    DECLARE @idDocumento INT 
    DECLARE @codDoc VARCHAR(10)


	SELECT @id = id, 
		   @tipo = tipo,
		   @codigoAccion = codigoAccion
           ,@idDocumento = idDocumento 
           ,@codDoc = codDoc 
	FROM OPENJSON(@json)
	WITH(
		id INT  
		,tipo INT
		,codigoAccion VARCHAR(5)
        ,idDocumento INT 
        ,codDoc VARCHAR(10)
	)

    -- tipo  1 : cuando el usuario aprobante acepta la solicitud 
    -- tipo  2: cuando el usuario solicitante ya actualizó o anule el documento 
 
    
	IF @tipo = 1
		BEGIN 
			IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idSolicitud = @id AND (codEstado='A' OR codEstado='F'))
				BEGIN 
					 SELECT '0'code,'Este solicitud ya ha sido aprobada o completada' as [message]
					RETURN 
				END 	
		END  

	BEGIN TRY
		BEGIN TRAN 
			IF @tipo = 1
				BEGIN 				
					UPDATE Config.Solicitud SET codEstado='A', fechaAprobacion = dbo.ufnGetDateEcuador() WHERE idSolicitud = @id 
					SELECT  '1'code,'Concedido la autorización Correctamente'  as [message]
				END 
				
			IF @tipo = 2  
				BEGIN 
                    SET @id = (SELECT top 1 idSolicitud FROM Config.v_User_Request WHERE idUsuarioRolSolictante = @userRoleId 
                                                                                AND idDocumento = @idDocumento 
                                                                                AND codDoc      = @codDoc
                                                                               AND codigoAccion = @codigoAccion 
                                                                                   AND  codEstado='A'   )                 
                    
					IF @id > 0
						BEGIN
							UPDATE Config.Solicitud SET codEstado='F' WHERE idUsuarioRolSolictante = @userRoleId  AND idSolicitud= @id
                             EXEC Config.UserCustomerRequest_SendMail @userRoleId, @id
							SELECT '1'code,'Solictud para editar o anular finalizado' as [message]
						END 
				END 
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END 
		SELECT '0','Info: Error en el procedimiento: ' + ERROR_MESSAGE() as [message]			

	END CATCH 


END 