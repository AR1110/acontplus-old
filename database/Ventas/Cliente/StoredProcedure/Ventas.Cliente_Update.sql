USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Update]    Script Date: 1/5/2023 9:59:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-08-02
-- Description:	SP para actualizar clientes 
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Cliente_Update @userRoleId INT ,@id INT ,@json NVARCHAR(MAX)	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

	--> GLOBAL
	DECLARE @idUsuario INT ,@idEntidad INT ,@payload VARCHAR(MAX) 

    --> Data Cliente
    DECLARE @IDType VARCHAR(10) ,@idTipoIdentificacion INT ,@numeroIdentificacion NVARCHAR(15) ,@customerId INT ,@nombreFiscal VARCHAR(300) ,@nombreComercial VARCHAR(300)

    DECLARE @tbCliente AS TABLE(
        id INT NOT NULL UNIQUE
       ,idTipoClienteProveedor INT NULL
       ,idTipoEntidad INT NULL
       ,idSubContribuyente INT NULL
       ,idTiempoCredito INT NULL
       ,idTipoIdentificacion INT NOT NULL
       ,idCiudad INT NULL
       ,idEmpleado INT NULL
       ,idEmpresa INT NULL
       ,idCargo INT NULL
       ,idFormaPagoSri INT NULL
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
       ,estado BIT NOT NULL
       ,infoCrediticia NVARCHAR(MAX) NULL
       ,configValorBruto BIT
    )

	BEGIN TRY 
        
        --> Variables Globales  
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        INSERT INTO @tbCliente 
               (id,idEmpleado,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,idFormaPagoSri,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,placa,nota,montoCredito,validationSri,estado,infoCrediticia,configValorBruto)
	    SELECT @id,idEmpleado,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idCiudad,idSubContribuyente,idTiempoCredito,idEmpresa,idCargo,idFormaPagoSri,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,placa,nota,montoCredito,validationSri,estado,infoCrediticia,configValorBruto
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
            ,idFormaPagoSri         INT
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
            ,estado                 BIT
            ,infoCrediticia         NVARCHAR(MAX)
            ,configValorBruto       BIT
        )

        --> Recuperando Informacion
        SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion 
                    ,@numeroIdentificacion = LTRIM(RTRIM(numeroIdentificacion)) 
                    ,@nombreComercial      = LTRIM(RTRIM(nombreComercial)) 
                    ,@nombreFiscal         = LTRIM(RTRIM(nombreFiscal)) 
        FROM @tbCliente 

        SELECT TOP 1 @customerId = CustomerId FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @id


        --> Validacion de informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbCliente) 
            BEGIN
                SELECT  '0'code,'Error en la info del cliente'[message] 
                RETURN
            END

        IF @numeroIdentificacion = '9999999999999'
            BEGIN
                 SELECT  '0'code,'No puedes editar un consumidor final'[message] 
                RETURN
            END

		BEGIN TRAN 
            
            UPDATE Customer.Customer WITH (ROWLOCK) 
                SET BusinessName = LTRIM(RTRIM(@nombreFiscal)) 
                   ,TradeName    = LTRIM(RTRIM(@nombreComercial))
            WHERE Id = @customerId

			UPDATE cl SET 
				   cl.idCiudad               = IIF(tl.idCiudad = 0, NULL, tl.idCiudad)
				  ,cl.idEmpleado             = IIF(tl.idEmpleado = 0, NULL, tl.idEmpleado)
				  ,cl.direccion              = LTRIM(RTRIM(tl.direccion))
				  ,cl.telefono               = LTRIM(RTRIM(tl.telefono)) 
				  ,cl.correo                 = LTRIM(RTRIM(tl.correo)) 
				  ,cl.idTipoClienteProveedor = IIF(tl.idTipoClienteProveedor = 0, NULL, tl.idTipoClienteProveedor) 
				  ,cl.idTipoEntidad          = IIF(tl.idTipoEntidad = 0, NULL, tl.idTipoEntidad)
				  ,cl.idSubContribuyente     = IIF(tl.idSubContribuyente = 0, NULL, tl.idSubContribuyente)
				  ,cl.idTiempoCredito        = IIF(tl.idTiempoCredito = 0, NULL, tl.idTiempoCredito)
				  ,cl.idEmpresa              = IIF(tl.idEmpresa = 0, NULL, tl.idEmpresa)
				  ,cl.idCargo                = IIF(tl.idCargo = 0, NULL, tl.idCargo) 
                  ,cl.FormaPagoSriId         = IIF(tl.idFormaPagoSri = 0, NULL, tl.idFormaPagoSri)
				  ,cl.placa                  = tl.placa
				  ,cl.nota                   = tl.nota
                  ,cl.estado                 = tl.estado
                  ,cl.infoCrediticia         = tl.infoCrediticia
                  ,cl.configValorBruto       = tl.configValorBruto
                  ,cl.UpdatedAt              = GETDATE()
                  ,cl.UpdatedByUserId        = @idUsuario
			FROM dbo.Cliente      cl WITH (ROWLOCK)
            INNER JOIN @tbCliente tl ON tl.id = cl.idCliente

		COMMIT TRAN 
		SELECT  '1'code,'Actualizado Correctamente'[message], @payload as payload
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN ;
		    END 
		INSERT INTO ErroresSistema 
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Cliente/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT  '0'code,'Error en el procedimiento'[message]
	END CATCH 

END
