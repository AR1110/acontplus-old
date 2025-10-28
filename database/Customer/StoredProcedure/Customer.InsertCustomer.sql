USE Acontplus
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-07-05
-- Description:	sp 
-- =============================================
CREATE OR ALTER PROCEDURE Customer.InsertCustomer
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
    ,@CustomerId INT = 0 OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Cliente
    DECLARE @IdCard NVARCHAR(15) 

    --> Customer
    DECLARE @tbCustomer AS TABLE
    (
        IdTypeId INT NOT NULL
       ,IdCard VARCHAR(20) UNIQUE NOT NULL
       ,BusinessName VARCHAR(300) NOT NULL
       ,TradeName VARCHAR(300) NOT NULL
       ,SriValidation BIT NOT NULL
       ,email VARCHAR(300) NULL
       ,telephone VARCHAR(300) NULL
       ,[Address] VARCHAR(300) NULL

    )

    BEGIN TRY

        --> Data Json
        INSERT INTO @tbCustomer 
              (IdTypeId,IdCard,BusinessName,TradeName,[Address],telephone,email,SriValidation)
	    SELECT IdTypeId,IdCard,BusinessName,TradeName,[Address],telephone,email,SriValidation
	    FROM OPENJSON(@json) WITH
        (
             IdTypeId              INT '$.idTipoIdentificacion'
		    ,IdCard        VARCHAR(50) '$.numeroIdentificacion' 
		    ,BusinessName VARCHAR(100) '$.nombreFiscal' 
		    ,TradeName    VARCHAR(100) '$.nombreComercial'
		    ,[Address]    VARCHAR(200) '$.direccion'
		    ,telephone    VARCHAR(150) '$.telefono'
		    ,email        VARCHAR(200) '$.correo'
		    ,SriValidation         BIT '$.validationSri'
        )
        --> Recuperando Variables
        SELECT TOP 1 @IdCard = IdCard FROM @tbCustomer


        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbCustomer)
            BEGIN
                SET @message = 'Error info del contribuyente'
            END

        IF EXISTS (SELECT 1 FROM Customer.Customer WHERE IdCard = @IdCard)
            BEGIN
                SET @message = 'Este contribuyente ya se encuentra registrado'
            END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002,@message, 1;
            END


        --> Transaccion
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            INSERT INTO Customer.Customer WITH (ROWLOCK)
                  (IdTypeId,IdCard,BusinessName,TradeName,SriValidation,email,telephone,[Address])
			SELECT IdTypeId,IdCard,BusinessName,TradeName,SriValidation,email,telephone,[Address]
			FROM @tbCustomer

            SET @CustomerId = SCOPE_IDENTITY()

        IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Registrado Exitosamente';
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @errorCode = 5001
                SET @errorMessage = 'No se pudo registrar'
				SET @message = @errorMessage;
			END
 
	    IF (@startedTransaction = 1)
		    BEGIN
			    COMMIT;
			    SELECT @code as code, @message as 'message';
		    END
    END TRY

    BEGIN CATCH
        -- Rollback transaction if an error occurs
        IF @startedTransaction = 1 
            BEGIN
                ROLLBACK TRANSACTION;
                -- Log error details
                INSERT INTO dbo.ErroresSistema
                (
                    [method]
                   ,[errorNumber]
                   ,[errorSeverity]
                   ,[errorState]
                   ,[errorProcedure]
                   ,[errorLine]
                   ,[errorMessage]
                   ,[idUsuario]
                )
                VALUES
                (
                    'Customer/Insert'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                THROW 50001, 'Error en el procedimiento: ', 1;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE()
			END
    END CATCH 
END
GO
