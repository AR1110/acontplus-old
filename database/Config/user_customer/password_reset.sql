USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-07-11
-- Description:	Agregar Informacion a la tabla Usuario y la tabla Rol 
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomer_Password_Reset @userRoleId INT
	,@id INT
	,@json NVARCHAR(MAX)
	,@errorCode INT = 0 OUTPUT
	,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN

	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	SET LANGUAGE SPANISH;

	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	DECLARE @password NVARCHAR(150),
			@encryptedPassword BINARY(64);
	
	DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

	BEGIN TRY
		SELECT @password = pwd FROM OPENJSON(@json) WITH (pwd NVARCHAR(150) '$.password')

		SET @encryptedPassword = (SELECT HASHBYTES('SHA2_512', @password))
		 
		IF EXISTS (SELECT 1 FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @id AND contrasenia = @encryptedPassword)
			BEGIN
				SET @errorMessage = 'No puede ser la misma!'
				SELECT '50001' code, @errorMessage as message
                RETURN 
			END

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END 
				
		UPDATE dbo.Usuario SET contrasenia = @encryptedPassword WHERE idUsuario = @id 
		
		IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Actualizada Correctamente'
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @message = 'No se pudo actualizar';
			END

	  IF (@trancount = 1)
		BEGIN
			COMMIT;
			SELECT @code as code, @message as 'message';
		 END
	END TRY
	BEGIN CATCH
		IF (@trancount = 1)
			BEGIN
				IF (@@TRANCOUNT > 0)
					ROLLBACK TRAN;

				SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
                EXEC dbo.LogError
                    @ModuleName = 'CONFIG',
                    @BusinessProcess = 'USER_CUSTOMER_PASSWORD_RESET',
                    @ErrorCategory = 'BUSINESS_RULE',
                    @ErrorSeverityLevel = 'HIGH',
                    @ResponseTime = @ResponseTime,
                    @EnvironmentName = 'PROD',
                    @BuildVersion = '3.0.0';

				SELECT '50001' code, 'Error en el procedimiento: ' as message;
			END
		ELSE
	        SET @errorCode = ERROR_NUMBER()
			SET @errorMessage = ERROR_MESSAGE()
	END CATCH 
END
