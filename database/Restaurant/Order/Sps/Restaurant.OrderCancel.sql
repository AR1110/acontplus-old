USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Order_Get]    Script Date: 15/9/2025 15:17:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Restaurant.OrderCancel
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Json
    DECLARE @IsActive BIT, @IsDeleted BIT ,@Obs NVARCHAR(300)

    --> Varialbles BD
    DECLARE @UserId INT

    BEGIN TRY
        -->variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @UserRoleId

        --> Data json
        SELECT @IsActive  = IsActive
              ,@IsDeleted = IsDeleted
              ,@Obs       = Obs
        FROM OPENJSON(@Json) WITH
        (
            isActive  BIT
           ,isDeleted BIT
           ,obs       NVARCHAR(300) 
        )

        --> Validaciones
        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Id = @Id AND IsFinished = 1)
            BEGIN
                SELECT '0' code, 'No puedes anular este documento ya se encuentra transformado en un documento de venta.' as 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Id = @Id AND IsDivided = 1)
            BEGIN
                SELECT '0' code, 'No puedes anular este documento se encuentra transformado documento de venta.' as 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Id = @Id AND IsActive = 0)
            BEGIN
                SELECT '0' code, 'No puedes anular este documento ya se encuentra anulado.' as 'message'
                RETURN
            END

        BEGIN TRAN
            UPDATE Restaurant.[Order] SET
                IsActive  = @IsActive
               ,IsDeleted = @IsDeleted
               ,Obs       = @Obs
            WHERE Id = @Id
        COMMIT TRAN
        SELECT '1' code, 'Anulado Correctamente' as 'message'
    END TRY

    BEGIN CATCH
        --> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = ERROR_PROCEDURE()
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/order/Put/cancel'

        SELECT @ErrorDetails = (
            SELECT @Json as [json]
            FOR JSON PATH
        );

        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

        SELECT '0' code, 'Error en el procedimiento' as 'message'
    END CATCH
END
