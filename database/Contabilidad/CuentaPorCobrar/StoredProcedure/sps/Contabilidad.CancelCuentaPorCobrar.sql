USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Contabilidad].[CuentaPorCobrar_Insert]    Script Date: 18/7/2023 12:01:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.UpdateCuentaPorCobrar
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
	DECLARE @idUsuario INT ,@idEntidad INT ,@idEstadoPago INT

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;
    

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

        --> Recuperacion de informacion
        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WHERE codigo = 'A'

        --> Validando Informacion
        IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WHERE codEstado NOT IN ('PE') AND idCuentaPorCobrar = @id)
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

            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK) SET idEstadoPago = @idEstadoPago WHERE idCuentaPorCobrar = @id

        IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Anulado Exitosamente';
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @errorCode = 5001
                SET @errorMessage = 'No se pudo anular'
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
                    'CuentaPorCobrar/Cancel'
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
