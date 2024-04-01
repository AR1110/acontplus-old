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

	SELECT @id = id, 
		   @tipo = tipo,
		   @codigoAccion = codigoAccion
	FROM OPENJSON(@json)
	WITH(
		id INT  
		,tipo INT
		,codigoAccion VARCHAR(5)
	)
 
	IF @tipo = 1
		BEGIN 
			IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idSolicitud = @id AND (codEstado='A' OR codEstado='F'))
				BEGIN 
					 SELECT [Common].[ufnSpResponse]('0','Este solicitud ya ha sido aprobada o completada', DEFAULT) 
					RETURN 
				END 	
		END  

	BEGIN TRY
		BEGIN TRAN 
			IF @tipo = 1
				BEGIN 				
					UPDATE Config.Solicitud SET codEstado='A', fechaAprobacion = dbo.ufnGetDateEcuador() WHERE idSolicitud = @id 
					SELECT [Common].[ufnSpResponse]('1','Concedido la autorización Correctamente', DEFAULT)  
				END 
				
			IF @tipo = 2  
				BEGIN 
					IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @userRoleId AND codigoAccion=@codigoAccion AND codEstado='A')
						BEGIN
							UPDATE Config.Solicitud SET codEstado='F' WHERE idUsuarioRolSolictante = @userRoleId AND codigoAccion=@codigoAccion AND codEstado='A'
							SELECT [Common].[ufnSpResponse]('1','Solictud para editar o anular finalizado', DEFAULT)     					
						END 
				END 
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END 
		SELECT [Common].[ufnSpResponse]('0','Info: Error en el procedimiento: ' + ERROR_MESSAGE(), DEFAULT)     					

	END CATCH 


END 