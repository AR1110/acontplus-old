USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-06-03
-- Description:	SP FOR INSERT CONFIRM RELEASES READ BY USERS
-- =============================================
CREATE OR ALTER PROCEDURE Common.UserReleaseRead_Insert @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @rowsAffected INT,
	@message VARCHAR(500),
	@code CHAR(1),
	@userId INT,
    @releasesJson VARCHAR(MAX);
    
    DECLARE @releases AS TABLE (id INT NOT NULL);

	BEGIN TRY

        SELECT @releasesJson = releases FROM OPENJSON (@json) WITH (releases NVARCHAR(MAX));

        INSERT INTO @releases(id)
        SELECT id FROM OPENJSON (@releasesJson) WITH (id INT);

		SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId);

		BEGIN TRAN
			INSERT INTO Common.UserReleaseRead(ReleaseId, UserId)
			SELECT id, @userId FROM @releases;

            SET @rowsAffected = @@ROWCOUNT;
		COMMIT TRAN
        IF (@rowsAffected > 0)
				BEGIN
					SET @code = '1';
					SET @message = 'Confirmaci�n Exitosa';
				END
			ELSE
				BEGIN
					SET @code = '0';
					SET @message = 'Error al confirmar lectura';
				END
		SELECT @code code, @message as 'message';

	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN;

		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'UserReleaseRead/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @userId);
		
		SELECT '0' code, 'Error on bd' as 'message';
	END CATCH

END
GO
