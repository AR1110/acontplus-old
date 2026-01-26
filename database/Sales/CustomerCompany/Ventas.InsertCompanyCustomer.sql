USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Insert]    Script Date: 04/14/2023 3:07:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-08-02 
-- Description:	SP para registrar clientes
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.InsertCompanyCustomer
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
    ,@idCliente INT = 0 OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Data Cliente
    DECLARE @IdCard NVARCHAR(15) ,@customerId INT

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Table
    DECLARE @tblCliente AS TABLE(
        idTipoClienteProveedor INT NULL
       ,idTipoEntidad INT NULL
       ,idSubContribuyente INT NULL
       ,idTiempoCredito INT NULL
       ,idCiudad INT NULL
       ,idEmpleado INT NULL
       ,idEmpresa INT NULL
       ,idCargo INT NULL
       ,FormaPagoSriId INT NULL
       ,direccion VARCHAR(150) NULL
       ,telefono VARCHAR(150) NULL
       ,correo VARCHAR(150) NULL
       ,placa VARCHAR(150) NULL
	   ,montoCredito DECIMAL(15,5) NULL 
	   ,nota VARCHAR(300) NULL
       ,infoCrediticia NVARCHAR(MAX) NULL
       ,configValorBruto BIT

       --> Customer
       ,IdCard VARCHAR(20) UNIQUE NOT NULL
    )

	BEGIN TRY 
        
        --> Variables Globales  
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        INSERT INTO @tblCliente 
              (idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,IdCard,direccion,telefono,correo,placa,nota,montoCredito,infoCrediticia,configValorBruto)
	    SELECT idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,IdCard,direccion,telefono,correo,placa,nota,montoCredito,infoCrediticia,configValorBruto
	    FROM OPENJSON(@json) WITH
        (
             idEmpleado             INT 
	        ,IdTypeId               INT         '$.idTipoIdentificacion'
	        ,idTipoClienteProveedor INT
	        ,idTipoEntidad          INT 
	        ,idCiudad               INT
	        ,idSubContribuyente     INT
	        ,idTiempoCredito        INT 
	        ,idEmpresa              INT
	        ,idCargo			    INT
            ,FormaPagoSriId         INT          '$.idFormaPagoSri'
		    ,IdCard                 VARCHAR(50)  '$.numeroIdentificacion' 
		    ,BusinessName           VARCHAR(100) '$.nombreFiscal' 
		    ,TradeName              VARCHAR(100) '$.nombreComercial'
		    ,direccion              VARCHAR(200)
		    ,telefono               VARCHAR(150)
		    ,correo                 VARCHAR(200)
		    ,placa                  VARCHAR(150)
		    ,montoCredito           NUMERIC(15,5) 
		    ,nota                   VARCHAR(300) 
		    ,SriValidation          BIT          '$.validationSri'
            ,infoCrediticia         NVARCHAR(MAX) 
            ,configValorBruto       BIT
        )

        --> Recuperando Informacion
        SELECT TOP 1 @IdCard = LTRIM(RTRIM(IdCard)) FROM @tblCliente 

        SELECT TOP 1 @customerId = ID FROM Customer.Customer WHERE IdCard = @IdCard

        --> Validacion de informacion 
        IF NOT EXISTS(SELECT 1 FROM @tblCliente)
            BEGIN
                SET @message = 'Error en la info del cliente';
            END

	    IF EXISTS (SELECT 1 FROM Cliente WITH (NOLOCK) WHERE  CustomerId = @customerId AND idEntidad = @idEntidad)
		    BEGIN
                SET @message = 'El cliente ya se encuentra registrado';
		    END 

        IF @IdCard = '9999999999999'
            BEGIN
                IF EXISTS ( SELECT 1
                              FROM Cliente cl
                              INNER JOIN Customer.Customer cc ON cc.Id = cl.CustomerId
                              WHERE cl.idEntidad = @idEntidad
                                AND cc.IdCard = @IdCard
                             )
                    BEGIN
                         SET @message = 'Consumidor Final ya esta registrado';
                    END 
            END 

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002,@message, 1;
            END

		IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

			--> Customer
            EXEC Customer.InsertCustomer @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT , @CustomerId = @CustomerId OUT

            IF (@errorCode <> 0)
                BEGIN
                    SET @errorMessage = 'sp Customer.InsertCustomer response: ' + ISNULL(@errorMessage, '');
                    THROW 50001, @errorMessage, 1;
                END
            --> End

            --> Cliente
			INSERT INTO Cliente WITH (ROWLOCK)
			      (idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,direccion,telefono,correo,placa,montoCredito,nota,configValorBruto,idUsuario,idEntidad,customerId)
			SELECT idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,direccion,telefono,correo,placa,montoCredito,nota,configValorBruto,@idUsuario,@idEntidad,@customerId
            FROM @tblCliente

		    SET @idCliente = SCOPE_IDENTITY()

            SET @payload =  (SELECT @idCliente   as idCliente
                                   ,IdCard       as numeroIdentificacion 
                             FROM @tblCliente FOR JSON PATH)

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

            --> END 
	END TRY 

	BEGIN CATCH 
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
                    'CustomerCompany/Insert'
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
