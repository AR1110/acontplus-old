
USE AcontPlus;

IF OBJECT_ID('Config.Solicitud_Insert ')IS NOT NULL
	DROP PROCEDURE Config.Solicitud_Insert 
GO

-- =============================================
-- Author:		Emilio S.
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
	DECLARE @idUsuarioRolAprobante INT = (SELECT idUsuarioRol FROM App.UsuarioRol WHERE codRol='AD' AND idUsuarioRol = 38)


	SELECT @motivo = motivo, @codigoAccion = codigoAccion FROM OPENJSON(@json)
	WITH(motivo VARCHAR(50) '$.motivo', codigoAccion VARCHAR(5) '$.codigoAccion')

	IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion= @codigoAccion)
		BEGIN
			SELECT '0'code, 'Tienes una solicitud de' + IIF(@codigoAccion='E', 'Editar', 'Anular') + ' que no ha sido aprobada' as 'message', ''titleSms
			RETURN 
		END

	

	BEGIN TRY
		BEGIN TRAN 					
			INSERT INTO Config.Solicitud (idUsuarioRolAprobante, idUsuarioRolSolictante, observacion, codigoAccion, codEstado)
			VALUES(@idUsuarioRolAprobante, @idUsuarioRol, @motivo, @codigoAccion, 'P')
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