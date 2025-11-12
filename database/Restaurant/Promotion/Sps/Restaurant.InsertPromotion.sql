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
    ,@Json VARCHAR(MAX)
    ,@S3ObjectUrl VARCHAR(800)
    ,@S3ObjectKey VARCHAR(500)
AS
BEGIN
    SET LANGUAGE SPANISH;
	SET NOCOUNT ON;

    --> variables
    DECLARE @idEntidad INT ,@UserId INT ,@PromotionId INT

     --> Data Json
    DECLARE @Promotion NVARCHAR(MAX) ,@PromotionDetails NVARCHAR(MAX)


    DECLARE @TbPromotion AS TABLE
    (
        [EstablishmentId] INT NOT NULL
       ,[Description] VARCHAR(50) NOT NULL
       ,[PromotionDays] VARCHAR(MAX) NOT NULL
       ,[StartDate] DATETIME2 NOT NULL
       ,[EndDate] DATETIME2 NOT NULL
       ,[CreatedByUserId] INT NOT NULL
       ,[S3ObjectUrl] VARCHAR(800) NULL
       ,[S3ObjectKey] VARCHAR(500) NULL
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
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> DataJson
        SELECT @Promotion        = Promotion
              ,@PromotionDetails = PromotionDetails
        FROM OPENJSON(@json)  WITH
        (
            promotion        NVARCHAR(MAX) AS JSON 
           ,promotionDetails NVARCHAR(MAX) AS JSON
        )

        INSERT INTO @TbPromotion
              (EstablishmentId,Description,PromotionDays,StartDate,EndDate ,S3ObjectUrl ,S3ObjectKey,CreatedByUserId)
        SELECT EstablishmentId,Description,PromotionDays,StartDate,EndDate,@S3ObjectUrl,@S3ObjectKey,@UserId
        FROM OPENJSON(@Promotion)
        WITH
        (
             establishmentId  INT
            ,description      VARCHAR(50)
            ,promotionDays    VARCHAR(MAX)
            ,startDate        DATETIME2
            ,endDate          DATETIME2
        );

        INSERT INTO @TbPromotionDetails
              (ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,CreatedByUserId)
        SELECT ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,@UserId
        FROM OPENJSON(@PromotionDetails)
        WITH
        (
             itemId        INT
            ,feeId         INT
            ,taxId         INT
            ,measureId     INT
            ,quantity      NUMERIC(18,5)
            ,price         NUMERIC(18,5)
            ,obs           VARCHAR(300)
            ,costPrice     NUMERIC(18,5)
            ,subtotal      NUMERIC(18,5)
            ,uniqueId      VARCHAR(300)
        );


        --> Validation
        IF NOT EXISTS (SELECT 1 FROM @TbPromotion)
            BEGIN
                SELECT '0' as code, 'Error en la info de promoción' as 'message'
            END

        IF NOT EXISTS (SELECT 1 FROM @TbPromotionDetails)
            BEGIN
                SELECT '0' as code, 'Error en la info del detalle' as 'message'
            END 

        BEGIN TRAN
            INSERT INTO Restaurant.Promotion
                  (EstablishmentId,Description,PromotionDays,StartDate,EndDate,CreatedByUserId,S3ObjectKey,S3ObjectUrl)
            SELECT EstablishmentId,Description,PromotionDays,StartDate,EndDate,CreatedByUserId,S3ObjectKey,S3ObjectUrl
            FROM @TbPromotion

            SET @PromotionId = SCOPE_IDENTITY();

            INSERT INTO Restaurant.PromotionDetail
                   (PromotionId,ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,CreatedByUserId)
            SELECT @PromotionId,ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,CreatedByUserId
            FROM @TbPromotionDetails
        COMMIT TRAN
        SELECT '1' as code, 'Registrado Correctamente' as 'message'
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

        SELECT '0' as code, 'Error en el procedimiento' as 'message'
    END CATCH
END
GO

