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
CREATE OR ALTER PROCEDURE Ventas.Cliente_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idCliente INT

    --> Data Cliente
    DECLARE @numeroIdentificacion NVARCHAR(15) ,@customerId INT

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
       ,IdTypeId INT NOT NULL
       ,IdCard VARCHAR(20) UNIQUE NOT NULL
       ,BusinessName VARCHAR(300) NOT NULL
       ,TradeName VARCHAR(300) NOT NULL
       ,SriValidation BIT NOT NULL
    )
	
	BEGIN TRY 
        
        --> Variables Globales  
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        INSERT INTO @tblCliente 
              (idEmpleado,IdTypeId,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,IdCard,BusinessName,TradeName,direccion,telefono,correo,placa,nota,montoCredito,SriValidation,infoCrediticia,configValorBruto)
	    SELECT idEmpleado,IdTypeId,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,IdCard,BusinessName,TradeName,direccion,telefono,correo,placa,nota,montoCredito,SriValidation,infoCrediticia,configValorBruto
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
        SELECT TOP 1 @numeroIdentificacion = LTRIM(RTRIM(IdCard)) FROM @tblCliente 

        SELECT TOP 1 @customerId = ID FROM Customer.Customer WHERE IdCard = @numeroIdentificacion

        --> Validacion de informacion 
        IF NOT EXISTS(SELECT 1 FROM @tblCliente)
            BEGIN
                SELECT  '0'code,'Error en la info del cliente'[message]
                RETURN
            END

	    IF EXISTS (SELECT 1 FROM Cliente WITH (NOLOCK) WHERE  CustomerId = @customerId AND idEntidad = @idEntidad)
		    BEGIN
			    SELECT  '0'code,'El cliente ya se encuentra registrado'[message]
			    RETURN 
		    END 

          IF EXISTS (
            SELECT 1
            FROM Cliente cl
            INNER JOIN Customer.Customer cc ON cc.Id = cl.CustomerId
            WHERE EXISTS (
                SELECT 1 FROM @tblCliente t WHERE t.IdTypeId = cc.IdTypeId
            )
            AND cl.idEntidad = @idEntidad  AND cc.IdCard = '9999999999999'
        )
        BEGIN
            SELECT '0' AS code, 'Consumidor Final ya esta registrado' AS [message];
            RETURN;
        END
 

		BEGIN TRAN

			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IdCard = @numeroIdentificacion)
				BEGIN
					INSERT INTO Customer.Customer WITH (ROWLOCK)
                          (IdTypeId,IdCard,BusinessName,TradeName,SriValidation,email,telephone,[Address])
					SELECT IdTypeId,IdCard,BusinessName,TradeName,SriValidation,LTRIM(RTRIM(correo)),LTRIM(RTRIM(telefono)),LTRIM(RTRIM(direccion))
					FROM @tblCliente

                    SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SELECT TOP 1 @customerId = ID FROM Customer.Customer WHERE IdCard = @numeroIdentificacion
				END
			
			INSERT INTO Cliente WITH (ROWLOCK)
			      (idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,direccion,telefono,correo,placa,montoCredito,nota,configValorBruto,idUsuario,idEntidad,customerId)
			SELECT idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,FormaPagoSriId,direccion,telefono,correo,placa,montoCredito,nota,configValorBruto,@idUsuario,@idEntidad,@customerId
            FROM @tblCliente

		    SET @idCliente = @@IDENTITY

            SET @payload =  (SELECT @idCliente   as idCliente
                                   ,BusinessName as nombreFiscal
                                   ,IdCard       as numeroIdentificacion 
                             FROM @tblCliente FOR JSON PATH)

		COMMIT TRAN 
        SELECT  '1'code,'Registrado Correctamente'[message], @payload as payload
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN ;
		    END 

		INSERT INTO ErroresSistema 
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Cliente/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT  '0'code,'Error en el procedimiento'[message]
	END CATCH 
END
