USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Contabilidad].[CuentaPorCobrar_Insert]    Script Date: 18/7/2023 12:01:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.InsertCuentaPorPagar
	 @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
    ,@idCuentaPorPagar INT = 0 OUTPUT
    
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @code VARCHAR(50) ,@message VARCHAR(300) ,@idFactura INT

    --> Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

    --> Transaccion
	DECLARE @idUsuario INT ,@idEntidad INT ,@idEstadoPago INT

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    DECLARE @tbComprobante AS TABLE
    (
        idEstablecimiento INT NOT NULL
       ,idTiempoCredito INT 
       ,idProveedor INT NOT NULL
       ,idEstadoPago INT NOT NULL
       ,idDocumento INT NOT NULL
       ,subcategoryId INT NULL
       ,uniqueId VARCHAR(60) NOT NULL
       ,codDoc VARCHAR(10) NOT NULL
       ,secuencial INT NOT NULL
       ,serieComprobante VARCHAR(25) NOT NULL
       ,fechaEmision DATETIME2 NOT NULL
       ,fechaVencimiento DATETIME2 NULL
       ,importeTotal NUMERIC(18,5) NOT NULL
       ,fechaRegistro DATETIME2 NULL DEFAULT GETDATE()
    )

    DECLARE @tbCuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)

    BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante = comprobante
              ,@cuotas      = cuotas
        FROM OPENJSON(@json) WITH 
        (
             comprobante NVARCHAR(MAX) as json
            ,cuotas      NVARCHAR(MAX) as json 
        )

        INSERT INTO @tbComprobante
              (idEstablecimiento,idTiempoCredito,idProveedor,codDoc,idDocumento,secuencial,serieComprobante,fechaEmision,fechaVencimiento,importeTotal)
	    SELECT idEstablecimiento,idTiempoCredito,idProveedor,codDoc,idDocumento,secuencial,serieComprobante,fechaEmision,fechaVencimiento,importeTotal
        FROM OPENJSON(@comprobante) WITH
        (
            idEstablecimiento INT
           ,idTiempoCredito   INT
           ,idProveedor       INT
           ,idDocumento       INT
           ,codDoc            VARCHAR(10) 
           ,secuencial        INT
           ,serieComprobante  VARCHAR(30)
           ,fechaEmision      DATETIME2
           ,fechaVencimiento  DATETIME2
           ,importeTotal      NUMERIC(18,5)
        )

        INSERT INTO @tbCuotas
              (nroCuota,fechaVencimiento,cuota,entrada)
        SELECT nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )

        --> Recuperacion de informacion
        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WHERE codigo = 'PE'


        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SET @message = 'Error en la info de la transaccion';
            END

         IF NOT EXISTS(SELECT 1 FROM @tbCuotas)
            BEGIN
                SET @message = 'Error en las cuotas de la transaccion';
            END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

        --> TRANSACCION
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            INSERT INTO Contabilidad.CuentaPorPagar
                  (idEstablecimiento,idTiempoCredito,idProveedor,idEstadoPago,codDoc,idDocumento,uniqueId,serieComprobante,fechaEmision,fechaVencimiento,importeTotal,subcategoryId,idUsuario)
	        SELECT idEstablecimiento,idTiempoCredito,idProveedor,idEstadoPago,codDoc,idDocumento,uniqueId,serieComprobante,fechaEmision,fechaVencimiento,importeTotal,subcategoryId,@idUsuario
            FROM @tbComprobante

            SET @idCuentaPorPagar = SCOPE_IDENTITY()

            INSERT INTO Contabilidad.CuotaPorPagar
                   (idCuentaPorPagar,idEstadoPago ,nroCuota,fechaVencimiento,cuota,entrada)
	        SELECT @idCuentaPorPagar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada 
            FROM @tbCuotas
            ORDER BY nroCuota ASC

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
                    'CuentaPorPagar/Insert'
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
				SET @ErrorMessage = ERROR_MESSAGE();
			END  
    END CATCH
END
