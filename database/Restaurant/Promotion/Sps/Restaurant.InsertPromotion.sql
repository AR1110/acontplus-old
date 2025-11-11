USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- Restaurant.Promotion_Get 139, '{"tipo": 2}', ''
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.InsertPromotion
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
    ,@S3ObjectUrl VARCHAR(800)
    ,@S3ObjectKey VARCHAR(500)
AS
BEGIN
    SET LANGUAGE SPANISH;
	SET NOCOUNT ON;

    --> variables
    DECLARE @idEntidad INT
           ,@UserId INT


    DECLARE @TbPromotion AS TABLE
    (
        [EstablishmentId] INT NOT NULL
       ,[Description] VARCHAR(50) NOT NULL
       ,[PromotionDays] VARCHAR(MAX) NOT NULL
       ,[StartDate] DATETIME2 NOT NULL
       ,[EndDate] DATETIME2 NOT NULL
       ,[CreatedByUserId] INT NOT NULL
    )

    DECLARE @TbPromotionDetails AS TABLE
    (
        [ItemId] INT NOT NULL
       ,[FeeId] INT NOT NULL
       ,[TaxId] INT NOT NULL
       ,[MeasureId] INT NOT NULL
       ,[Quantity] NUMERIC(18,5) NOT NULL
       ,[Price] NUMERIC(18,5) NOT NULL
       ,[Obs] VARCHAR(300) NULL
       ,[CostPrice] NUMERIC(18,5) NOT NULL
       ,[Subtotal] NUMERIC(18,5) NOT NULL
       ,[UniqueId] VARCHAR(300) NULL
       ,[CreatedByUserId] INT NOT NULL
    )

    BEGIN TRY 
        BEGIN TRAN
            
        COMMIT TRAN
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
               ,@Method         VARCHAR(200)   = 'Restaurant/promotion/post'

        SELECT @ErrorDetails = (
            SELECT @Json as json FOR JSON PATH
        );
 
        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;
    END CATCH
END
GO

