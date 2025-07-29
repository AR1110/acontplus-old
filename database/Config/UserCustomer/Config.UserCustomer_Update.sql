USE [Acontplus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Description:	Update user customer
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomer_Update @userRoleId INT
    ,@id INT
    ,@json NVARCHAR(MAX)
    ,@fromMobile BIT
    ,@errorCode INT = 0 OUT
    ,@errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN

	SET NOCOUNT ON;
    SET XACT_ABORT ON;
	SET LANGUAGE SPANISH;

    DECLARE @UpdatedBy VARCHAR(100);

	DECLARE  @email NVARCHAR(200),
        @isActive BIT,
        @firstName VARCHAR(50),
        @lastName VARCHAR(50),
        @username VARCHAR(100),
        @idCard VARCHAR(13),
        @demoStepId INT;

	BEGIN TRY
        SELECT 
		 @email = js.email
		,@firstName = js.firstName
		,@lastName = js.lastName
		,@isActive = js.isActive
        ,@username = js.username
        ,@idCard = idCard
        ,@demoStepId = demoStepId
	    FROM OPENJSON(@json) 
	    WITH (email VARCHAR(100)
	         ,firstName VARCHAR(150)
		     ,lastName VARCHAR(150)
		     ,isActive BIT
             ,username VARCHAR(50)
             ,idCard VARCHAR(25)
             ,demoStepId INT) as  js

            DECLARE @userParams NVARCHAR(MAX)
            
            SET @userParams = (SELECT '{"email": "' + @email + '"' +  
                ', "username": "' + @username + '"' +
                ', "demoStepId": "' + CAST(ISNULL(@demoStepId, 0) AS varchar(10)) + '"' +
                ', "idCard": "' + @idCard + '"' +
                ', "firstName": "' + @firstName + '"' +
                ', "lastName": "' + @lastName + '"' +
                ', "fromMobile": "' + CONVERT(VARCHAR(5), @fromMobile) + '"}'
				)

        SET @UpdatedBy = (SELECT nombreUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId);

		BEGIN TRAN 
			
            EXEC AcontplusAdmin.Config.UserCustomer_Update @id, @json, @UpdatedBy,  @errorCode = @errorCode OUTPUT, @errorMessage = @errorMessage OUTPUT
			IF (@errorCode <> 0)
                BEGIN
                    SET @errorMessage = 'sp AcontplusAdmin.Config.UserCustomer_Update failed: ' + ISNULL(@errorMessage, '')
				    RAISERROR(@errorMessage,16,1)
                END
		COMMIT TRAN 
		SELECT'1' as code, 'Actualizado Correctamente' as [message]
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
        INSERT INTO Acontplus.dbo.ErroresSistema (method, token, [ErrorNumber],[ErrorSeverity],[ErrorState],[ErrorProcedure],[ErrorLine],[ErrorMessage])
		VALUES ('UserCustomer/Put', NEWID(), ERROR_NUMBER(), ERROR_SEVERITY(),  ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE())
		SELECT '0' as code,'Error en el procedimiento de actualizar' as [message]
	END CATCH 
END
