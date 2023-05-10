USE AcontPlus;

IF OBJECT_ID('Config.Solicitud_Update')IS NOT NULL
	DROP PROCEDURE Config.Solicitud_Update
GO


-- =============================================
-- Author:		Emilio S.
-- Create date: 11/04/2023 21:58 pm
-- Description:	<Description,,>
-- =============================================

 --Config.Solicitud_Update  41, '{"codigoAccion":"A","typeOperation":2}'

CREATE PROCEDURE Config.Solicitud_Update  @idUsuarioRol INT, @json VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @id INT;
	DECLARE @typeOperation INT 
	DECLARE @codigoAccion VARCHAR(5)

	SELECT @id = id, 
		   @typeOperation = typeOperation ,
		   @codigoAccion = codigoAccion
	FROM OPENJSON(@json)
	WITH(
		id INT '$.id', 
		typeOperation INT '$.typeOperation',
		codigoAccion VARCHAR(5) '$.codigoAccion'
	)


	IF @typeOperation = 1
		BEGIN 
			IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idSolicitud = @id AND (codEstado='A' OR codEstado='F'))
				BEGIN
					SELECT '0'code, 'Este solicitud ya ha sido aprobada o completada' as 'message', '' titleSms 
					RETURN 
				END 	
		END 
					
	
	

	BEGIN TRY
		BEGIN TRAN 
			IF @typeOperation = 1
				BEGIN 				
					UPDATE Config.Solicitud SET codEstado='A', fechaAprobacion = dbo.ufnGetDateEcuador() WHERE idSolicitud = @id
					SELECT '1' code,'Concedido la autorización Correctamente' as 'message'	    					
				END 
				
			IF @typeOperation = 2 AND @codigoAccion = @codigoAccion
				BEGIN 
					IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion=@codigoAccion AND codEstado='A')
						BEGIN
							UPDATE Config.Solicitud SET codEstado='F' WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion=@codigoAccion AND codEstado='A'
							SELECT '1' code,'Solictud para editar o anular finalizado' as 'message'	    					
						END 
				END 
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 


END 