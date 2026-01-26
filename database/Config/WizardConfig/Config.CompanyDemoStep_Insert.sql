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
        @userId INT,
        @Username VARCHAR(100);
       

    DECLARE @code CHAR,
        @message VARCHAR(300);
	
	BEGIN TRY
        SELECT TOP 1 @uuid = uuid, @userId = idUsuario, @Username = nombreUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId;

        SET @companyId = (SELECT Id FROM Config.Company WITH(NOLOCK) WHERE Uuid = @uuid);

		BEGIN TRAN
			IF NOT EXISTS (SELECT TOP 1 1 FROM Config.CompanyDemoStep WITH (NOLOCK)
						   WHERE Uuid = @uuid
						   AND DemoStepId = @demoStepId)
			    BEGIN
				    INSERT INTO Config.CompanyDemoStep (DemoStepId, CompanyId, Uuid, IsMobileRequest, CreatedBy)
				    VALUES (@demoStepId, @companyId, @uuid, @fromMobile, @Username);
			    END 

		COMMIT TRAN
		SELECT '1' as code, 'Registrado correctamente' as 'message'
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
