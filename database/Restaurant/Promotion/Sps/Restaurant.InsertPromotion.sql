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
CREATE OR ALTER PROCEDURE Restaurant.PromotionInsert
     @UserRoleId INT
    ,@Json VARCHAR(MAX)
    ,@ImageUrl VARCHAR(800) = NULL
    ,@ImageKey VARCHAR(500) = NULL
AS
BEGIN
    SET LANGUAGE SPANISH;
	SET NOCOUNT ON;

    --> variables
    DECLARE @idEntidad INT ,@UserId INT ,@PromotionId INT

     --> Data Json
    DECLARE @Details NVARCHAR(MAX)


    DECLARE @TbPromotion AS TABLE
    (
        [EstablishmentId] INT NOT NULL
       ,[Name] VARCHAR(100) NOT NULL
       ,[Description] VARCHAR(50) NOT NULL
       ,[ApplicableDays] VARCHAR(MAX) NOT NULL
       ,[MaxTotalUses] INT NULL 
       ,[CurrentUses] INT NOT NULL DEFAULT 0
       ,[MaxUsesPerCustomer] INT NULL
       ,[StartTime] TIME(7) NULL
       ,[Type] INT NOT NULL DEFAULT 1
       ,[StartDate] DATETIME2 NOT NULL
       ,[EndDate] DATETIME2 NOT NULL
       ,[CreatedByUserId] INT NOT NULL
       ,[ImageUrl] VARCHAR(800) NULL
       ,[ImageKey] VARCHAR(500) NULL
    )

    DECLARE @TbPromotionDetails AS TABLE
    (
        [ItemId] INT NOT NULL
       ,[FeeId] INT NOT NULL
       ,[TaxId] INT NOT NULL
       ,[MeasureId] INT NOT NULL
       ,[UnitPrice] NUMERIC(18,5) NOT NULL
       ,[PromotionalPrice] NUMERIC(18,5) NOT NULL DEFAULT 0
       ,[DiscountPercent] NUMERIC(18,5) NOT NULL
       ,[Discount] NUMERIC(18,5) NOT NULL
       ,[Subtotal] NUMERIC(18,5) NOT NULL
       ,[BuyQuantity] NUMERIC(18,5) NOT NULL
       ,[DisplayOrder] INT NOT NULL DEFAULT 0
       ,[GetQuantity] INT NULL
       ,[Notes] VARCHAR(500) NULL
       ,[RequiredQuantity] NUMERIC(18,5) NOT NULL
       ,[CreatedByUserId] INT NOT NULL
    )

    BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> DataJson
        SELECT @Details = Details FROM OPENJSON(@json) WITH (details NVARCHAR(MAX) AS JSON)

        INSERT INTO @TbPromotion
              (EstablishmentId,Name,Description,ApplicableDays,MaxTotalUses,MaxUsesPerCustomer,StartTime,StartDate,EndDate, ImageKey ,ImageUrl,CreatedByUserId)
        SELECT establishmentId,name,description,applicableDays,maxTotalUses,maxUsesPerCustomer,startTime,startDate,endDate,@ImageKey,@ImageUrl,@UserId
        FROM OPENJSON(@Json) WITH
        (
             [establishmentId]    INT
            ,[name]               VARCHAR(100)
            ,[description]        VARCHAR(50)
            ,[applicableDays]     VARCHAR(MAX)
            ,[maxTotalUses]       INT
            ,[maxUsesPerCustomer] INT
            ,[startTime]          TIME(7)
            ,[startDate]          DATETIME2
            ,[endDate]            DATETIME2
        )

        INSERT INTO @TbPromotionDetails
              (ItemId,FeeId,TaxId,MeasureId,UnitPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,CreatedByUserId)
        SELECT itemId,feeId,taxId,measureId,unitPrice,discountPercent,discount,subtotal,buyQuantity,getQuantity,notes,requiredQuantity,@UserId
        FROM OPENJSON(@Details) WITH
        (
             [itemId]           INT
            ,[feeId]            INT
            ,[taxId]            INT
            ,[measureId]        INT
            ,[unitPrice]        NUMERIC(18,5)
            ,[discountPercent]  NUMERIC(18,5)
            ,[discount]         NUMERIC(18,5)
            ,[subtotal]         NUMERIC(18,5)
            ,[buyQuantity]      NUMERIC(18,5)
            ,[getQuantity]      INT
            ,[notes]            VARCHAR(500)
            ,[requiredQuantity] NUMERIC(18,5)
        )


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
                  ([EstablishmentId],[Name],[Type],[CurrentUses],[Description],[ApplicableDays],[StartDate],[EndDate],[CreatedByUserId],[ImageKey],[ImageUrl])
            SELECT [EstablishmentId],[Name],[Type],[CurrentUses],[Description],[ApplicableDays],[StartDate],[EndDate],[CreatedByUserId],[ImageKey],[ImageUrl]
            FROM @TbPromotion

            SET @PromotionId = SCOPE_IDENTITY();

            INSERT INTO Restaurant.PromotionDetail
                   (PromotionId,ItemId,FeeId,TaxId,MeasureId,UnitPrice,PromotionalPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,CreatedByUserId)
            SELECT @PromotionId,ItemId,FeeId,TaxId,MeasureId,UnitPrice,PromotionalPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,CreatedByUserId
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

        IF (@@TRANCOUNT > 0) ROLLBACK TRAN
 
        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

        SELECT '0' as code, 'Error en el procedimiento' as 'message'
    END CATCH
END
GO

