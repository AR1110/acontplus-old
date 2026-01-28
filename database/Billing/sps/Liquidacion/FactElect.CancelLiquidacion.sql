USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Liquidacion_Delete]    Script Date: 12/9/2022 11:02:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-12-06
-- Description:	SP para eliminar las liquidaciones de compra
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.CancelLiquidacion
     @userRoleId INT
    ,@id INT
    ,@json VARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global 
    DECLARE @idUsuario INT ,@idEntidad INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

	BEGIN TRY 
        --> Recupetando Datos 
		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioROl WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		--> Transaccion Principal.
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

			UPDATE LiquidacionCompra SET estado = 0,idUsuario = @idUsuario,lastChange = dbo.ufnGetDateEcuador() WHERE idLiquidacionCompra = @id

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
                    'liquidacion/Delete'
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
