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
    DECLARE @IDType VARCHAR(10) ,@idTipoIdentificacion INT ,@numeroIdentificacion NVARCHAR(15) ,@customerId INT

    DECLARE @tbCliente AS TABLE(
        idTipoClienteProveedor INT NULL
       ,idTipoEntidad INT NULL
       ,idSubContribuyente INT NULL
       ,idTiempoCredito INT NULL
       ,idTipoIdentificacion INT NOT NULL
       ,idCiudad INT NULL
       ,idEmpleado INT NULL
       ,idEmpresa INT NULL
       ,idCargo INT NULL
       ,numeroIdentificacion VARCHAR(20) UNIQUE NOT NULL
       ,nombreFiscal VARCHAR(300) NOT NULL
       ,nombreComercial VARCHAR(300) NOT NULL
       ,direccion VARCHAR(150) NULL
       ,telefono VARCHAR(150) NULL
       ,correo VARCHAR(150) NULL
       ,placa VARCHAR(150) NULL
	   ,montoCredito DECIMAL(15,5) NULL 
	   ,nota VARCHAR(300) NULL
	   ,validationSri BIT NOT NULL
    )
	
	BEGIN TRY 
        
        --> Variables Globales  
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        INSERT INTO @tbCliente 
              (idEmpleado,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,placa,nota,montoCredito,validationSri)
	    SELECT idEmpleado,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,placa,nota,montoCredito,validationSri
	    FROM OPENJSON(@json) WITH
        (
             idEmpleado             INT 
	        ,idTipoIdentificacion   INT
	        ,idTipoClienteProveedor INT
	        ,idTipoEntidad          INT 
	        ,idCiudad               INT
	        ,idSubContribuyente     INT
	        ,idTiempoCredito        INT 
	        ,idEmpresa              INT
	        ,idCargo			    INT
		    ,numeroIdentificacion   VARCHAR(50) 
		    ,nombreFiscal           VARCHAR(100) 
		    ,nombreComercial        VARCHAR(100) 
		    ,direccion              VARCHAR(200)
		    ,telefono               VARCHAR(150)
		    ,correo                 VARCHAR(200)
		    ,placa                  VARCHAR(150)
		    ,montoCredito           NUMERIC(15,5) 
		    ,nota                   VARCHAR(300) 
		    ,validationSri          BIT
        )

        --> Recuperando Informacion
        SELECT TOP 1 @numeroIdentificacion = LTRIM(RTRIM(numeroIdentificacion)) , @idTipoIdentificacion = idTipoIdentificacion FROM @tbCliente 

        --> Validacion de informacion 
        IF (SELECT COUNT(*) FROM @tbCliente) = 0 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Error en la info del cliente', DEFAULT)
                RETURN
            END

	    IF EXISTS (SELECT 1 FROM Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @numeroIdentificacion AND idEntidad = @idEntidad)
		    BEGIN
			    SELECT [Common].[ufnSpResponse]('0','El cliente ya se encuentra registrado', DEFAULT)
			    RETURN 
		    END 

		BEGIN TRAN

			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @numeroIdentificacion)
				BEGIN
					SELECT TOP 1 @IDType = codigoSri FROM TipoIdentificacion t WHERE t.idTipoIdentificacion = @idTipoIdentificacion

					INSERT INTO Customer.Customer WITH (ROWLOCK)
                           (IDType,IDCard,BusinessName,TradeName,email,telephone,[Address],SriValidation)
					SELECT @IDType,LTRIM(RTRIM(numeroIdentificacion)), LTRIM(RTRIM(nombreFiscal)), LTRIM(RTRIM(nombreComercial)), LTRIM(RTRIM(correo)),LTRIM(RTRIM(telefono)),LTRIM(RTRIM(direccion)),validationSri
					FROM @tbCliente

                    SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SELECT TOP 1 @customerId = ID FROM Customer.Customer WHERE IDCard = @numeroIdentificacion
				END
			
			INSERT INTO Cliente WITH (ROWLOCK)
			      (idTipoIdentificacion,idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,placa,montoCredito,nota,validationSri,idUsuario,idEntidad,customerId)
			SELECT idTipoIdentificacion,idEmpleado,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,placa,montoCredito,nota,validationSri,@idUsuario,@idEntidad,@customerId
            FROM @tbCliente

		    SET @idCliente = @@IDENTITY

            SET @payload =  (SELECT @idCliente as idCliente FOR JSON PATH)

		COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1','Registrado Correctamente', @payload)
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN ;
		    END 
		INSERT INTO ErroresSistema 
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Cliente/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT [Common].[ufnSpResponse]('0','Error en el procedimiento', DEFAULT)
	END CATCH 
END
