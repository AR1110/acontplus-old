USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Modified date: 2025-07-28
-- Description:	Update User and Role information with improved performance and error handling
-- Version: 3.1.0
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomer_Update
    @Id INT,
    @Json NVARCHAR(MAX),
	@UpdatedBy VARCHAR(100),
	@IsMobileRequest BIT = 0,
    @ErrorCode INT = 0 OUTPUT,
    @ErrorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
    DECLARE @ProcedureName SYSNAME = OBJECT_NAME(@@PROCID);

    -- Pascal Case Variables
    DECLARE @Email VARCHAR(300),
            @Username VARCHAR(200),  
            @CustomerId INT,
            @FirstName VARCHAR(150),
            @LastName VARCHAR(150),
            @FullName VARCHAR(300),
            @IdCard VARCHAR(25),
            @PhoneNumber VARCHAR(20),
            @Password NVARCHAR(150),
            @DemoStepId INT,
            @Uuid UNIQUEIDENTIFIER,
            @CompanyId INT,
            @IdTypeId INT;

    -- Table variable for JSON data
    DECLARE @UserData TABLE 
    ( 
        Username VARCHAR(200) NOT NULL,
        Email VARCHAR(500) NOT NULL,
        FirstName VARCHAR(150) NOT NULL,
        LastName VARCHAR(150) NOT NULL,
        IdCard VARCHAR(25) NOT NULL,
        PhoneNumber VARCHAR(20),
        Password NVARCHAR(150),
        DemoStepId INT
    );
    
    DECLARE @Code CHAR(1),
            @Message VARCHAR(MAX),
            @TranCount BIT = 0,
            @RowsAffected INT = 0;

    BEGIN TRY
        -- Validate input parameters
        IF @Id IS NULL OR @Id <= 0
        BEGIN
            SET @ErrorCode = 50001;
            SET @ErrorMessage = 'ID de usuario requerido y debe ser mayor a 0';
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        IF @Json IS NULL OR LEN(LTRIM(RTRIM(@Json))) = 0
        BEGIN
            SET @ErrorCode = 50001;
            SET @ErrorMessage = 'Datos JSON requeridos';
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        -- Parse JSON data
        INSERT INTO @UserData 
            (Username, Email, FirstName, LastName, PhoneNumber, Password, IdCard, DemoStepId)
        SELECT 
            Username, 
            Email, 
            FirstName, 
            LastName, 
            PhoneNumber, 
            Password, 
            LTRIM(RTRIM(IdCard)), 
            DemoStepId
        FROM OPENJSON(@Json) WITH
        (
            Username VARCHAR(200) '$.username',
            Email VARCHAR(200) '$.email',
            FirstName VARCHAR(150) '$.firstName',
            LastName VARCHAR(150) '$.lastName',
            IdCard VARCHAR(25) '$.idCard',
            PhoneNumber VARCHAR(20) '$.phoneNumber',
            Password NVARCHAR(150) '$.password',
            DemoStepId INT '$.demoStepId'
        );

        -- Extract variables from table
        SELECT TOP 1 
            @Username = Username,
            @Email = Email,
            @FirstName = FirstName,
            @LastName = LastName,
            @IdCard = IdCard,
            @DemoStepId = DemoStepId,
            @Password = Password,
            @PhoneNumber = NULLIF(TRIM(PhoneNumber), '')
        FROM @UserData;

        -- Input validation
        IF LEN(LTRIM(RTRIM(@Email))) = 0
        BEGIN
            SET @ErrorCode = 50001;
            SET @ErrorMessage = 'Correo electr�nico es requerido';
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        IF LEN(LTRIM(RTRIM(@IdCard))) = 0
        BEGIN
            SET @ErrorCode = 50001;
            SET @ErrorMessage = 'N�mero de identificaci�n es requerido';
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        -- Email format validation
        IF @Email NOT LIKE '%_@_%._%'
        BEGIN
            SET @ErrorCode = 50001;
            SET @ErrorMessage = 'Formato de correo electr�nico inv�lido';
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        -- Check if customer exists
        SELECT @CustomerId = Id 
        FROM Acontplus.Customer.Customer WITH(NOLOCK) 
        WHERE IdCard = @IdCard;

        IF @CustomerId IS NULL
        BEGIN
            SET @FullName = CONCAT(@FirstName, ' ', @LastName);
        END

        -- Business validations
        IF EXISTS (
            SELECT 1 
            FROM Acontplus.dbo.Usuario WITH (NOLOCK) 
            WHERE CustomerId = @CustomerId 
                AND IdUsuario != @Id
        )
        BEGIN
            SET @ErrorMessage = CONCAT('Usuario ya existe con identificaci�n: ', 
                (SELECT TOP 1 nombreUsuario 
                 FROM Acontplus.dbo.Usuario WITH (NOLOCK) 
                 WHERE CustomerId = @CustomerId));
            SET @ErrorCode = 50001;
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        IF EXISTS (
            SELECT 1 
            FROM Acontplus.dbo.Usuario WITH (NOLOCK) 
            WHERE NombreUsuario = @Username 
                AND IdUsuario != @Id
        )
        BEGIN
            SET @ErrorCode = 50001;
            SET @ErrorMessage = 'Nombre de usuario ya est� en uso';
            SELECT @ErrorCode AS code, @ErrorMessage AS message;
            RETURN;
        END

        -- Start transaction
        IF (@@TRANCOUNT = 0)
        BEGIN
            BEGIN TRANSACTION;
            SET @TranCount = 1;
        END

        -- Create customer if not exists
        IF (@CustomerId IS NULL)
        BEGIN
            -- Determine ID type based on card length
            SELECT @IdTypeId = CASE 
                WHEN LEN(LTRIM(RTRIM(@IdCard))) = 10 THEN 
                    (SELECT TOP 1 idTipoIdentificacion FROM Acontplus.dbo.TipoIdentificacion WHERE CodigoSri = '05')
                WHEN LEN(LTRIM(RTRIM(@IdCard))) = 13 THEN 
                    (SELECT TOP 1 idTipoIdentificacion FROM Acontplus.dbo.TipoIdentificacion WHERE CodigoSri = '04')
                ELSE 
                    (SELECT TOP 1 idTipoIdentificacion FROM Acontplus.dbo.TipoIdentificacion WHERE CodigoSri = '06')
            END;

            INSERT INTO Acontplus.Customer.Customer (IdTypeId, IdCard, BusinessName, Email, Telephone)
            VALUES (@IdTypeId, @IdCard, @FullName, @Email, @PhoneNumber);

            SET @CustomerId = SCOPE_IDENTITY();
        END

        -- Update user information
        UPDATE Acontplus.dbo.Usuario 
        SET Correo = @Email,
            FirstName = @FirstName,
            LastName = @LastName,
            CustomerId = @CustomerId,
            PhoneNumber = @PhoneNumber,
            UpdatedAt = SYSUTCDATETIME()
        WHERE IdUsuario = @Id;

        SET @RowsAffected = @@ROWCOUNT;

        -- Handle demo step logic
        IF (@DemoStepId > 0)
        BEGIN 
			
            UPDATE Acontplus.dbo.Usuario 
            SET NombreUsuario = @Username,
                UpdatedAt = SYSUTCDATETIME()
            WHERE IdUsuario = @Id;

			IF (NULLIF(TRIM(@Password), '') IS NOT NULL)
				BEGIN
					UPDATE Acontplus.dbo.Usuario 
					SET Contrasenia = HASHBYTES('SHA2_512', @Password),
						UpdatedAt = SYSUTCDATETIME()
					WHERE IdUsuario = @Id;
				END

            SELECT @Uuid = CorrelationId 
            FROM Acontplus.dbo.Usuario WITH(NOLOCK) 
            WHERE Correo = @Email;

            SELECT @CompanyId = Id 
            FROM Config.Company WITH(NOLOCK) 
            WHERE Uuid = @Uuid;

            IF NOT EXISTS (
                SELECT 1 
                FROM Config.CompanyDemoStep WITH(NOLOCK) 
                WHERE DemoStepId = @DemoStepId 
                    AND Uuid = @Uuid
            )
            BEGIN
                INSERT INTO Config.CompanyDemoStep (DemoStepId, CompanyId, Uuid, IsMobileRequest, CreatedAt, CreatedBy)
                VALUES (@DemoStepId, @CompanyId, @Uuid, @IsMobileRequest, SYSUTCDATETIME(), @UpdatedBy);
            END
        END

        -- Set response based on affected rows
        IF (@RowsAffected > 0)
        BEGIN
            SET @Code = '0';
            SET @Message = 'Usuario actualizado correctamente';
            SET @ErrorCode = 0;
        END
        ELSE
        BEGIN
            SET @Code = '50002';
            SET @Message = 'No se encontr� el usuario para actualizar';
            SET @ErrorCode = 50002;
        END

        -- Commit transaction
        IF (@TranCount = 1)
        BEGIN
            COMMIT TRANSACTION;
            
            -- Log successful operation
            SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
            
            -- Return success response
            SELECT @Code AS code, @Message AS message, @ResponseTime AS responseTimeMs;
        END

    END TRY
    BEGIN CATCH
        -- Rollback transaction on error
        IF (@TranCount = 1 AND @@TRANCOUNT > 0)
        BEGIN
            ROLLBACK TRANSACTION;
        END

        SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        SET @ErrorCode = ERROR_NUMBER();
        SET @ErrorMessage = ERROR_MESSAGE();

        -- Enhanced error logging
        EXEC dbo.LogError
            @ModuleName = 'CONFIG',
            @BusinessProcess = 'USER_CUSTOMER_UPDATE',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.1.0',
            @UserId = @Id;

        -- Return error response
        SELECT '50001' AS code, 
               CONCAT('Error en procedimiento: ', @ErrorMessage) AS message,
               @ResponseTime AS responseTimeMs;

    END CATCH 
END
GO