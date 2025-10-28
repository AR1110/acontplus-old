USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-07-05
-- Description:	sp 
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.CancelDocumentoElectronico
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


    --> Global
    DECLARE @result VARCHAR(MAX) ,@code VARCHAR(50) ,@message VARCHAR(MAX)

    --> Documento Electronico 
	DECLARE @idEstadoServicio INT ,@idUsuario INT ,@idEntidad INT ,@codDoc VARCHAR(5) 

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    BEGIN TRY
        --> Variables
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

        --> Validando Informacion 
        IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado NOT IN(4) )
            BEGIN
                SET @message = 'El Documento no esta Autorizado no puede ser Anulado';
            END 

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

        --> Transaccion
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            UPDATE dbo.DocumentoElectronico WITH (ROWLOCK) SET idEstadoServicio = @idEstadoServicio WHERE idDocumentoElectronico = @id

        IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Anulado Exitosamente';
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @errorCode = 5001
                SET @errorMessage = 'No se pudo Anular'
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
                    'DocumentoElectronico/Cancel'
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
