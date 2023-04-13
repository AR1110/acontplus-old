
USE AcontPlus;

IF OBJECT_ID('Config.Solicitud_Insert ')IS NOT NULL
	DROP PROCEDURE Config.Solicitud_Insert 
GO

-- =============================================
-- Author:		Emilio Senguana.
-- Create date: 11/04/2023
-- Description:	
-- =============================================

CREATE PROCEDURE Config.Solicitud_Insert  @idUsuarioRol INT, @json VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @id INT;
	DECLARE @motivo VARCHAR(50)
	DECLARE @codigoAccion VARCHAR(5)

	DECLARE @idEntidad INT = (SELECT top 1 idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	DECLARE @idUsuarioRolAprobante INT;

	--SELECT '0'code, CAST( @json AS varchar(300)) as 'message'
	--RETURN 
	SELECT @motivo = motivo, @codigoAccion = codigoAccion FROM OPENJSON(@json)
	WITH(motivo VARCHAR(50) '$.motivo', codigoAccion VARCHAR(5) '$.codigoAccion')



	IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion= @codigoAccion AND codEstado='P')
		BEGIN
			SELECT '0'code, 'Tienes una solicitud de ' + IIF(@codigoAccion='E', 'Editar', 'Anular') + ' que no ha sido aprobada' as 'message', ''titleSms
			RETURN 
		END

	SELECT 
		@idUsuarioRolAprobante = JSON_VALUE(jsonPermission, '$.additional.requestAuthorizationKey.idUsuarioRolAprobante')
	FROM Config.UserPermission 
	WHERE idUsuarioRol = @idUsuarioRol 
	AND codModule = 'V'

	IF @idUsuarioRolAprobante IS NULL 
		BEGIN
			SELECT '0'code, 'Solictud de Clave de Autorización para modificar o anular el documento no tiene asignado el Receptor de la Solicitud de Aprobación' as 'message'
			RETURN
		END 

	--Analizar 
	IF NOT EXISTS(SELECT 1 FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRolAprobante)
		BEGIN
			SELECT '0'code, 'N'
			RETURN 
		END 

	IF @idUsuarioRolAprobante = @idUsuarioRol
		BEGIN 
			SELECT '0'code, 'El Receptor de la Solicitud de Aprobación no tiene que ser el mismo usuario que solicita la aprobación' as 'message'
			RETURN 
		END 
	

	BEGIN TRY
		BEGIN TRAN 					
			INSERT INTO Config.Solicitud (idUsuarioRolAprobante, idUsuarioRolSolictante, observacion, codigoAccion, codEstado)
			VALUES(@idUsuarioRolAprobante, @idUsuarioRol, UPPER(@motivo), @codigoAccion, 'P')
		COMMIT TRAN 
		SELECT '1' code,'Registrado Correctamente' as 'message'	    
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 


END 