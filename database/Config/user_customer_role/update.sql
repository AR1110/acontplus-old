USE Acontplus
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
CREATE OR ALTER PROCEDURE Config.UserCustomerRole_Update @userRoleId INT ,@Id INT ,@json NVARCHAR(MAX) 
AS
BEGIN

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	DECLARE @UserCustomerId INT 
		,@RoleId INT 
		,@companyUuid UNIQUEIDENTIFIER 

				DECLARE @idEntidad INT

	DECLARE @tbUserRole TABLE 
	(
		 UserCustomerId INT NOT NULL
		,RoleId  INT NOT NULL
		,companyUuid UNIQUEIDENTIFIER NOT NULL
   )
	
	BEGIN TRY
	    
		------------------------------------ DATA JSON ----------------------------------------------------------------
		INSERT INTO @tbUserRole 
		      (UserCustomerId,RoleId,companyUuid)
		SELECT UserCustomerId,RoleId,companyUuid
		FROM OPENJSON(@json) WITH
		(
		     UserCustomerId  INT '$.userCustomerId'
			,RoleId          INT '$.roleId'
			,companyUuid    UNIQUEIDENTIFIER '$.companyUuid'
	     ) as  js

		 ---------------------------------- VARIABLES ---------------------------------------------------------------------
		 SELECT TOP 1 @UserCustomerId = UserCustomerId ,@RoleId = RoleId ,@companyUuid = companyUuid FROM @tbUserRole
		
		 SELECT TOP 1 @idEntidad = idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE uuid = @companyUuid

		----------------------------------- VALIDATION --------------------------------------------------------------------
		IF EXISTS (SELECT 1 FROM App.UsuarioRol ur WITH (NOLOCK)
					INNER JOIN dbo.Entidad e ON ur.idEntidad =e.idEntidad
				WHERE e.uuid = @companyUuid
			AND idUsuario = @UserCustomerId AND roleId = @RoleId AND idUsuarioRol != @Id)
			BEGIN
				SELECT '50001' code, 'Este Perfil ya existe' as message
                RETURN 
			END


		BEGIN TRAN 

			UPDATE App.UsuarioRol  
				SET idEntidad         = @idEntidad
				   ,RoleId             = @RoleId
			WHERE idUsuarioRol = @Id

		COMMIT TRAN 
		SELECT '0' code, 'Actualizado Correctamente' as message
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
            @BusinessProcess = 'USER_CUSTOMER_ROLE_UPDATE',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';

		SELECT '50001' code, 'Error en el procedimiento: ' as message
        RETURN
	END CATCH 
END
