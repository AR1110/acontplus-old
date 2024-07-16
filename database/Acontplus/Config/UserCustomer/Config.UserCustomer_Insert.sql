USE [AcontPlus]
GO
/****** Object:  StoredProcedure Config.UserCustomer_InserT    Script Date: 6/4/2023 20:45:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO 
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Description:	Agregar Informacion a la tabla Usuario y la tabla Rol 
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomer_Insert @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@fromMobile BIT
    ,@errorCode INT = 0 OUTPUT --0-OK, 1-ERROR
AS
BEGIN

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @roleCode VARCHAR(10)
        ,@correo NVARCHAR(300)
        ,@contrasena NVARCHAR(100)
        ,@nombreUsuario NVARCHAR(200)
        ,@firstName VARCHAR(50)
        ,@lastName VARCHAR(50)
        ,@nombreCompleto NVARCHAR(500)
        ,@nroIdentificacion NVARCHAR(100) 
        ,@idEntidad INT  
        ,@roleId INT
        ,@uuid UNIQUEIDENTIFIER;
	
	BEGIN TRY
		SELECT 
				@nombreUsuario      = LTRIM(RTRIM(js.nombreUsuario)),
				@contrasena         = js.contrasena,
				@nroIdentificacion  = LTRIM(RTRIM(js.nroIdentificacion)),
				@nombreCompleto     = LTRIM(RTRIM(js.nombreCompleto)),
				@correo             = LTRIM(RTRIM(js.correo)), 
				@roleId             = roleId,
				@roleCode           = roleCode,
                @firstName          = firstName,
                @lastName           = lastName
		FROM OPENJSON(@json) 
		WITH(correo NVARCHAR(200) '$.correo'
			,contrasena NVARCHAR(200) '$.contrasena'
			,nombreUsuario NVARCHAR(200) '$.nombreUsuario'
			,nroIdentificacion NVARCHAR(80) '$.nroIdentificacion'
			,nombreCompleto NVARCHAR(200) '$.nombreCompleto' 
			,roleId INT '$.roleId'
			,roleCode VARCHAR(10)
            ,firstName VARCHAR(50)
            ,lastName VARCHAR(50)
			) as  js

		SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId 
		SET @uuid = (SELECT Uuid FROM Acontplus.dbo.Entidad WHERE idEntidad = @idEntidad)

		IF @roleId IS NULL
			BEGIN
				SELECT '0' as code,'EL rol enviado no existe' as [message]
				RETURN;
			END 

		BEGIN TRAN
            DECLARE @userParams NVARCHAR(MAX)
            
            SET @userParams = (SELECT '{"idCard": ' + @nroIdentificacion + 
				', "username": ' + @nombreUsuario + 
				', "email": "' + @correo + '"}' +
                ', "password": "' + @contrasena + '"}' +
                ', "fullname": "' + @nombreCompleto + '"}' +
                ', "idEntidad": "' + @idEntidad + '"}' +
                ', "firstName": "' + @firstName + '"}' +
                ', "lastName": "' + @lastName + '"}' +
				', "fromMobile": "' + CONVERT(VARCHAR(5), @fromMobile) + '"}'
				)

            EXEC AcontplusAdmin.Config.UserCustomer_Insert 0, @userParams, @errorCode = @errorCode OUTPUT
			IF (@errorCode = 1)
				RAISERROR('sp AcontplusAdmin.Config.UserCustomer_Insert failed',16,1)

            DECLARE @userRoleParams VARCHAR(MAX)
			,@userCustomerId INT

			SET @userCustomerId = (SELECT idUsuario FROM Acontplus.dbo.Usuario WHERE nombreUsuario = @nombreUsuario)
			SET @roleId = (SELECT TOP 1 Id FROM AcontplusAdmin.Seguridad.[Role] WHERE code = 'ADM')

			SET @userRoleParams = (SELECT '{"userCustomerId": ' + CONVERT(VARCHAR, @userCustomerId) + 
				', "roleId": ' + CONVERT(VARCHAR, @roleId) + 
				', "companyUuid": "' + CONVERT(VARCHAR(36), @uuid) + '"}' +
				', "fromMobile": "' + CONVERT(VARCHAR(5), @fromMobile) + '"}'
				)
			
 			EXEC AcontplusAdmin.Config.UserCustomerRole_Insert 0, @userRoleParams, @errorCode = @errorCode OUTPUT
			IF (@errorCode = 1)
				RAISERROR('sp AcontplusAdmin.Config.UserCustomerRole_Insert failed',16,1)

		COMMIT TRAN 
		SELECT '1' as code,'Registrado Exitosamente' as [message]   
		RETURN
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
        INSERT INTO Acontplus.dbo.ErroresSistema (method,[ErrorNumber],[ErrorSeverity],[ErrorState],[ErrorProcedure],[ErrorLine],[ErrorMessage])
		VALUES ('UserCustomerInsert/Insert', ERROR_NUMBER(), ERROR_SEVERITY(),  ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE())
		SELECT '0' as code,'Info: Error en el procedimiento de agregar' + ERROR_MESSAGE() as [message]
	END CATCH 
END
