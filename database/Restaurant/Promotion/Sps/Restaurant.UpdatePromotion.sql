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
CREATE OR ALTER PROCEDURE Restaurant.PromotionUpdate
     @UserRoleId INT
    ,@Id INT
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
        [Id] INT NOT NULL
       ,[EstablishmentId] INT NOT NULL
       ,[Name] VARCHAR(100) NOT NULL
       ,[Description] VARCHAR(50) NOT NULL
       ,[ApplicableDays] VARCHAR(MAX) NOT NULL
       ,[MaxTotalUses] INT NULL 
       ,[MaxUsesPerCustomer] INT NULL
       ,[StartTime] TIME(7) NULL
       ,[StartDate] DATETIME2 NOT NULL
       ,[EndDate] DATETIME2 NOT NULL
       ,[ImageUrl] VARCHAR(800) NULL
       ,[ImageKey] VARCHAR(500) NULL
       ,[IsActive] BIT NOT NULL
       ,[IsDeleted] BIT NOT NULL
       ,[UpdatedByUserId] INT NOT NULL
       ,[UpdatedAt] DATETIME2 DEFAULT GETDATE() 
    )

    DECLARE @TbPromotionDetails AS TABLE
    (
        [Id] INT NOT NULL
       ,[PromotionId] INT NOT NULL
       ,[ItemId] INT NOT NULL
       ,[FeeId] INT NOT NULL
       ,[TaxId] INT NOT NULL
       ,[MeasureId] INT NOT NULL
       ,[UnitPrice] NUMERIC(18,5) NOT NULL
       ,[PromotionalPrice] NUMERIC(18,5) NOT NULL
       ,[DiscountPercent] NUMERIC(18,5) NOT NULL
       ,[Discount] NUMERIC(18,5) NOT NULL
       ,[Subtotal] NUMERIC(18,5) NOT NULL
       ,[BuyQuantity] NUMERIC(18,5) NOT NULL
       ,[GetQuantity] INT NULL
       ,[Notes] VARCHAR(500) NULL
       ,[RequiredQuantity] NUMERIC(18,5) NOT NULL
       ,[CreatedByUserId] INT NOT NULL
       ,[UpdatedByUserId] INT NOT NULL
       ,[UpdatedAt] DATETIME2 DEFAULT GETDATE() 
       ,[IsActive] BIT NOT NULL
       ,[IsDeleted] BIT NOT NULL
    )

    BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

         --> DataJson
        SELECT @Details = Details FROM OPENJSON(@json) WITH (details NVARCHAR(MAX) AS JSON)

        INSERT INTO @TbPromotion
               (Id,EstablishmentId,Name,Description,ApplicableDays,MaxTotalUses,MaxUsesPerCustomer,StartTime,StartDate,EndDate,IsActive,IsDeleted ,ImageUrl  ,ImageKey, UpdatedByUserId)
        SELECT @Id,EstablishmentId,Name,Description,ApplicableDays,MaxTotalUses,MaxUsesPerCustomer,StartTime,StartDate,EndDate,IsActive,IsDeleted,@ImageUrl ,@ImageKey, @UserId
        FROM OPENJSON(@Json)
        WITH
        (
             [establishmentId]       INT
            ,[name]                  VARCHAR(100)
            ,[description]           VARCHAR(50)
            ,[applicableDays]        VARCHAR(MAX)
            ,[maxTotalUses]          INT
            ,[maxUsesPerCustomer]    INT
            ,[startTime]             TIME(7)
            ,[startDate]             DATETIME2
            ,[endDate]               DATETIME2
            ,isActive                BIT
            ,isDeleted               BIT
        );

        INSERT INTO @TbPromotionDetails
              (Id,PromotionId,ItemId,FeeId,TaxId,MeasureId,UnitPrice,PromotionalPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,IsActive,IsDeleted,CreatedByUserId,UpdatedByUserId)
        SELECT Id,@Id        ,ItemId,FeeId,TaxId,MeasureId,UnitPrice,PromotionalPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,IsActive,IsDeleted,@UserId        ,@UserId
        FROM OPENJSON(@Details)
        WITH
        (
             id                      INT
            ,[itemId]                INT
            ,[feeId]                 INT
            ,[taxId]                 INT
            ,[measureId]             INT
            ,[unitPrice]             NUMERIC(18,5)
            ,[promotionalPrice]      NUMERIC(18,5)
            ,[discountPercent]       NUMERIC(18,5)
            ,[discount]              NUMERIC(18,5)
            ,[subtotal]              NUMERIC(18,5)
            ,[buyQuantity]           NUMERIC(18,5)
            ,[getQuantity]           INT
            ,[notes]                 VARCHAR(500)
            ,[requiredQuantity]      NUMERIC(18,5)
            ,isActive                BIT
            ,isDeleted               BIT
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
            UPDATE pr SET
                   pr.EstablishmentId      = tp.EstablishmentId
                  ,pr.Name                 = tp.Name
                  ,pr.Description          = tp.Description
                  ,pr.ApplicableDays       = tp.ApplicableDays
                  ,pr.MaxTotalUses         = tp.MaxTotalUses
                  ,pr.MaxUsesPerCustomer   = tp.MaxUsesPerCustomer
                  ,pr.StartTime            = tp.StartTime
                  ,pr.StartDate            = tp.StartDate
                  ,pr.EndDate              = tp.EndDate
                  ,pr.ImageUrl             = tp.ImageUrl
                  ,pr.ImageKey             = tp.ImageKey
                  ,pr.IsActive             = tp.IsActive
                  ,pr.IsDeleted            = tp.IsDeleted
                  ,pr.UpdatedByUserId      = tp.UpdatedByUserId
                  ,pr.UpdatedAt            = tp.UpdatedAt
            FROM Restaurant.Promotion pr
            INNER JOIN @TbPromotion   tp ON pr.Id = tp.Id;

            UPDATE pd SET
                   pd.PromotionId          = tp.PromotionId
                  ,pd.ItemId               = tp.ItemId
                  ,pd.FeeId                = tp.FeeId
                  ,pd.TaxId                = tp.TaxId
                  ,pd.MeasureId            = tp.MeasureId
                  ,pd.UnitPrice            = tp.UnitPrice
                  ,pd.PromotionalPrice     = tp.PromotionalPrice
                  ,pd.DiscountPercent      = tp.DiscountPercent
                  ,pd.Discount             = tp.Discount
                  ,pd.Subtotal             = tp.Subtotal
                  ,pd.BuyQuantity          = tp.BuyQuantity
                  ,pd.GetQuantity          = tp.GetQuantity
                  ,pd.Notes                = tp.Notes
                  ,pd.RequiredQuantity     = tp.RequiredQuantity
                  ,pd.IsActive             = tp.IsActive
                  ,pd.IsDeleted            = tp.IsDeleted
                  ,pd.UpdatedByUserId      = tp.UpdatedByUserId
                  ,pd.UpdatedAt            = tp.UpdatedAt
            FROM Restaurant.PromotionDetail pd
            INNER JOIN @TbPromotionDetails  tp ON pd.Id = tp.Id;


            INSERT INTO Restaurant.PromotionDetail
                  (PromotionId,ItemId,FeeId,TaxId,MeasureId,UnitPrice,PromotionalPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,CreatedByUserId)
            SELECT PromotionId,ItemId,FeeId,TaxId,MeasureId,UnitPrice,PromotionalPrice,DiscountPercent,Discount,Subtotal,BuyQuantity,GetQuantity,Notes,RequiredQuantity,CreatedByUserId
            FROM @TbPromotionDetails
            WHERE Id = 0 

        COMMIT TRAN
        SELECT '1' as code, 'Actualizado Correctamente' as 'message'
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
               ,@Method         VARCHAR(200)   = 'Restaurant/promotion/put'

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

