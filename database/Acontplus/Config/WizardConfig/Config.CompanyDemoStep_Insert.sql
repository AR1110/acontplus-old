USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-08-01
-- Description:	sp for insert company demo steps
-- =============================================
CREATE OR ALTER PROCEDURE Config.CompanyDemoStep_Insert @userRoleId INT
    ,@demoStepId INT
	,@fromMobile BIT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @uuid UNIQUEIDENTIFIER,
        @companyId INT,
        @userId INT;
       

    DECLARE @code CHAR,
        @message VARCHAR(300);
	
	BEGIN TRY
        SELECT TOP 1 @uuid = uuid, @userId = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId;

        SET @companyId = (SELECT Id FROM AcontplusAdmin.Config.Company WITH(NOLOCK) WHERE Uuid = @uuid);

		BEGIN TRAN
			IF NOT EXISTS (SELECT TOP 1 1 FROM AcontplusAdmin.Config.CompanyDemoStep WITH (NOLOCK)
						   WHERE Uuid = @uuid
						   AND DemoStepId = @demoStepId)
			BEGIN
				INSERT INTO AcontplusAdmin.Config.CompanyDemoStep (DemoStepId, CompanyId, Uuid, FromMobile)
				VALUES (@demoStepId, @companyId, @uuid, @fromMobile);

				PRINT 'Insert statement executed';
			END

			PRINT 'Rows affected: ' + CAST(@@ROWCOUNT AS NVARCHAR);

			IF @@ROWCOUNT > 0
			BEGIN
				SET @code = '1';
				SET @message = 'Registrado correctamente';
			END
			ELSE
			BEGIN
				SET @code = '0';
				SET @message = 'No se pudo completar el proceso';
			END

		COMMIT TRAN
		SELECT @code, @message as 'message'
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN;

		INSERT INTO dbo.ErroresSistema (method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		SELECT '/CompanyDemoStep/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId;

		SELECT '0' code, 'Error en el procedimiento' as 'message'
	END CATCH

END
GO
