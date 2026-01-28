USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Delete]    Script Date: 12/9/2022 9:36:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.CancelNotaCredito
     @userRoleId INT
    ,@id INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET LANGUAGE SPANISH;

	--> GLOBAL
	DECLARE @idEntidad INT, @idUsuario INT ,@code VARCHAR(50) ,@message VARCHAR(300)

     --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Venta 
    DECLARE @idFactura INT

	BEGIN TRY 
        -- Recuperando Variables
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT TOP 1 @idFactura = idFactura FROM NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id

		--> Transaccion Principal.
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            UPDATE NotaCredito WITH (ROWLOCK) SET idUsuario = @idUsuario,lastChange = dbo.ufnGetDateEcuador() ,estado = 0 WHERE idNotaCredito = @id

			UPDATE Factura WITH (ROWLOCK) SET notaCredito = 0 WHERE idFactura = @idFactura

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
                    'NotaCredito/Cancel'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                SELECT '50001' Code, 'Error en el procedimiento: ' as Message;
				THROW;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE()
			END
    END CATCH 
END
