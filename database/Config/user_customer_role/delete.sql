USE Acontplus
GO
DROP FUNCTION IF EXISTS Common.ufnSpResponse
GO
/****** Object:  StoredProcedure [App].[Usuario_Insert]    Script Date: 6/4/2023 20:45:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Description:	Agregar Informacion a la tabla Usuario y la tabla Rol 
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomerRole_Delete @userRoleId INT ,@Id INT 
AS
BEGIN


	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	DECLARE @UserCustomerId INT ,@RoleId INT ,@CompanyId INT ,@ruc VARCHAR(20) ,@codRol VARCHAR(10) ,@IDCard VARCHAR(15)

	BEGIN TRY
		BEGIN TRAN 
			DELETE FROM Acontplus.Config.UserPermission WHERE idUsuarioRol = @Id
			DELETE FROM Acontplus.App.UsuarioRol WHERE idUsuarioRol = @Id
		COMMIT TRAN
		SELECT '0' code, 'Eliminado Correctamente' as message
		RETURN
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END

		SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        EXEC dbo.LogError
            @ModuleName = 'CONFIG',
            @BusinessProcess = 'USER_CUSTOMER_ROLE_DELETE',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';

		SELECT '50001' code, 'Error en el procedimiento' as message
        RETURN
	END CATCH 
END
