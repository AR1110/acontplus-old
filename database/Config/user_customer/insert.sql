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
CREATE OR ALTER PROCEDURE Config.UserCustomer_Insert @userRoleId INT 
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

	DECLARE @Username VARCHAR(200),
		@IdCard VARCHAR(15),
		@Id INT,
		@ruc VARCHAR(15),
		@idEntidad INT,
		@codRol VARCHAR(2),
		@customerId INT,
		@fullName VARCHAR(300),
		@email VARCHAR(100);

	DECLARE @tbUser TABLE 
	(
		 Uuid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID()
		,IdCard VARCHAR(15) NOT NULL
		,Username VARCHAR(200) NOT NULL
		,Email VARCHAR(500) NOT NULL
		,[Password] NVARCHAR(500) NOT NULL
		,idPolitica INT  NULL
		,idEntidad INT  NULL
		,firstName VARCHAR(150)
		,lastName VARCHAR(150)
   )
	DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

	BEGIN TRY 
		------------------------------------ DATA JSON ----------------------------------------------------------------
		INSERT INTO @tbUser 
		      (IdCard,Username,Email,[Password],idEntidad, firstName, lastName)
		SELECT IdCard,Username,Email,[Password],idEntidad, firstName, lastName
		FROM OPENJSON(@json) WITH
		(
		     IdCard     VARCHAR(200) '$.idCard'
			,Username   VARCHAR(200) '$.username'
			,Email      VARCHAR(200) '$.email'
			,[Password] NVARCHAR(80) '$.password'
			,idEntidad           INT '$.idEntidad'
			,firstName VARCHAR(150)
			,lastName VARCHAR(150)
	     ) as  js



		 ---------------------------------- VARIABLES ---------------------------------------------------------------------
		 SELECT TOP 1 @Username = Username
			,@IdCard = IdCard
			,@idEntidad = idEntidad
			,@email = Email
			FROM @tbUser
		
		
		 IF EXISTS (SELECT TOP 1 1 FROM Acontplus.Customer.Customer WITH(NOLOCK) WHERE IdCard = LTRIM(RTRIM(@IdCard)))
			BEGIN
				SET @customerId = (SELECT TOP 1 Id FROM Acontplus.Customer.Customer WITH(NOLOCK) WHERE IdCard = LTRIM(RTRIM(@IdCard)))
			END
		ELSE
			BEGIN
				SET @fullName = (SELECT firstName + ' ' + lastName FROM @tbUser)
			END

		 SELECT TOP 1 @ruc = ruc FROM Acontplus.dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		----------------------------------- VALIDATION --------------------------------------------------------------------
		IF EXISTS (SELECT 1 FROM Acontplus.dbo.Usuario WITH (NOLOCK) WHERE customerId = @customerId)
			BEGIN
				SET @errorCode = 1
				SET @errorMessage = 'Este usuario ya existe con este nro de identificacion'
				SELECT '50001' code, @errorMessage as message
                RETURN
			END

		IF EXISTS (SELECT 1 FROM Acontplus.dbo.Usuario WITH (NOLOCK) WHERE nombreUsuario = @Username)
			BEGIN
				SET @errorCode = 1
				SET @errorMessage = 'Este nombre de usuario esta en uso'
				SELECT '50001' code, @errorMessage as message
                RETURN 
			END

		IF EXISTS (SELECT 1 FROM Acontplus.dbo.Usuario WITH (NOLOCK) WHERE customerId = @customerId)
			BEGIN
				SET @errorCode = 1
				SET @errorMessage = 'Usuario ya se ecuentra registrado'
				SELECT '50001' code, @errorMessage as message
                RETURN 
			END

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END
			IF (@customerId IS NULL)
				BEGIN
					INSERT INTO Acontplus.Customer.Customer(IdTypeId, [IdCard], [BusinessName], [Email])
					SELECT CASE WHEN LEN(LTRIM(RTRIM(@IdCard))) = 10 THEN (SELECT TOP 1 idTipoIdentificacion FROM Acontplus.dbo.TipoIdentificacion where codigosri = '05')
					WHEN LEN(LTRIM(RTRIM(@IdCard))) = 13 THEN (SELECT TOP 1 idTipoIdentificacion FROM Acontplus.dbo.TipoIdentificacion where codigosri = '04')
					ELSE (SELECT TOP 1 idTipoIdentificacion FROM Acontplus.dbo.TipoIdentificacion where codigosri = '06')
					END,
					@IdCard,
					@fullName,
					@email
					SET @customerId = SCOPE_IDENTITY()
				END

			INSERT INTO Acontplus.dbo.Usuario(nombreUsuario, firstName, lastName, contrasenia, correo, customerId)
			SELECT Username, firstName, lastName, HASHBYTES('SHA2_512',[Password]), Email, @customerId FROM @tbUser
		
		IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Registrado Exitosamente';
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @errorCode = 1
				SET @errorMessage = 'No se pudo registrar'
				SET @message = @errorMessage;
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
                    @BusinessProcess = 'USER_CUSTOMER_INSERT',
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
