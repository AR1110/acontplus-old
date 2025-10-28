USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Contabilidad].[CuentaPorCobrar_Insert]    Script Date: 18/7/2023 12:01:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.UpdateCuentaPorPagar
	 @userRoleId INT
    ,@id INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT    
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
	DECLARE @idUsuario INT ,@idEntidad INT

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    DECLARE @tbComprobante AS TABLE
    (
        idCuentaPorPagar INT NOT NULL
       ,idTiempoCredito INT
       ,subcategoryId INT NULL
       ,idProveedor INT NOT NULL
       ,fechaEmision DATETIME2 NOT NULL
       ,fechaVencimiento DATETIME2 NULL
       ,importeTotal NUMERIC(18,5) NOT NULL
    )

    DECLARE @tbCuotas AS TABLE(
        idCuotaPorPagar INT NOT NULL
       ,nroCuota INT UNIQUE NOT NULL 
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
              (idCuentaPorPagar,idTiempoCredito,idProveedor,subcategoryId,fechaEmision,fechaVencimiento,importeTotal)
	    SELECT @id             ,idTiempoCredito,idProveedor,subcategoryId,fechaEmision,fechaVencimiento,importeTotal
        FROM OPENJSON(@comprobante) WITH
        (
            idTiempoCredito  INT
           ,idProveedor      INT
           ,subcategoryId    INT
           ,idDocumento      INT 
           ,fechaEmision     DATETIME2
           ,fechaVencimiento DATETIME2
           ,importeTotal     NUMERIC(18,5)
        )

        INSERT INTO @tbCuotas
              (idCuotaPorPagar,nroCuota,fechaVencimiento,cuota,entrada)
        SELECT idCuotaPorPagar,nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            idCuotaPorPagar  INT
           ,nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )

        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SET @message = 'Error en la info de la transaccion';
            END

         IF NOT EXISTS(SELECT 1 FROM @tbCuotas)
            BEGIN
                SET @message = 'Error en los detalles de la transaccion';
            END

        IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WHERE codEstado NOT IN ('PE') AND idCuentaPorPagar = @id)
            BEGIN
                SET @message = 'El Documento tiene movimientos financieros o esta Anulado';
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

            UPDATE cp
               SET cp.idProveedor      = tb.idProveedor
                  ,cp.fechaEmision     = tb.fechaEmision
                  ,cp.fechaVencimiento = tb.fechaVencimiento
                  ,cp.importeTotal     = tb.importeTotal
                  ,cp.subcategoryId    = tb.subcategoryId
            FROM Contabilidad.CuentaPorPagar cp
            INNER JOIN @tbComprobante        tb ON tb.idCuentaPorPagar = cp.idCuentaPorPagar

            UPDATE cp 
               SET cp.fechaVencimiento = ct.fechaVencimiento
		          ,cp.cuota            = ct.cuota
	        FROM Contabilidad.CuotaPorPagar cp WITH (ROWLOCK)
	        INNER JOIN @tbCuotas            ct ON ct.idCuotaPorPagar = cp.idCuotaPorPagar

        IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Actualizado Exitosamente';
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @errorCode = 5001
                SET @errorMessage = 'No se pudo actualizar'
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
                    'CuentaPorCobrar/Update'
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
