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
CREATE OR ALTER PROCEDURE Restaurant.UpdatePromotion
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
    ,@S3ObjectUrl VARCHAR(800) = NULL
    ,@S3ObjectKey VARCHAR(500) = NULL
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
        [Id] INT NOT NULL
       ,[EstablishmentId] INT NOT NULL
       ,[Description] VARCHAR(50) NOT NULL
       ,[PromotionDays] VARCHAR(MAX) NOT NULL
       ,[StartDate] DATETIME2 NOT NULL
       ,[EndDate] DATETIME2 NOT NULL
       ,[S3ObjectUrl] VARCHAR(800) NULL
       ,[S3ObjectKey] VARCHAR(500) NULL
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
       ,[Quantity] NUMERIC(18,5) NOT NULL
       ,[Price] NUMERIC(18,5) NOT NULL
       ,[Obs] VARCHAR(300) NULL
       ,[CostPrice] NUMERIC(18,5) NOT NULL
       ,[Subtotal] NUMERIC(18,5) NOT NULL
       ,[UniqueId] VARCHAR(300) NULL
       ,[IsActive] BIT NOT NULL
       ,[IsDeleted] BIT NOT NULL
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
               (Id,EstablishmentId,Description,PromotionDays,StartDate,EndDate,IsActive,IsDeleted ,S3ObjectUrl ,S3ObjectKey)
        SELECT @Id,EstablishmentId,Description,PromotionDays,StartDate,EndDate,IsActive,IsDeleted,@S3ObjectUrl,@S3ObjectKey
        FROM OPENJSON(@Promotion)
        WITH
        (
             establishmentId  INT
            ,description      VARCHAR(50)
            ,promotionDays    VARCHAR(MAX)
            ,startDate        DATETIME2
            ,endDate          DATETIME2
            ,isActive         BIT
            ,isDeleted        BIT
        );

        INSERT INTO @TbPromotionDetails
              (PromotionId,ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,IsActive,IsDeleted)
        SELECT @Id        ,ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,IsActive,IsDeleted
        FROM OPENJSON(@PromotionDetails)
        WITH
        (
             id            INT
            ,promotionId   INT
            ,itemId        INT
            ,feeId         INT
            ,taxId         INT
            ,measureId     INT
            ,quantity      NUMERIC(18,5)
            ,price         NUMERIC(18,5)
            ,obs           VARCHAR(300)
            ,costPrice     NUMERIC(18,5)
            ,subtotal      NUMERIC(18,5)
            ,uniqueId      VARCHAR(300)
            ,isActive      BIT
            ,isDeleted     BIT
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
                   pr.EstablishmentId  = tp.EstablishmentId
                  ,pr.Description      = tp.Description
                  ,pr.PromotionDays    = tp.PromotionDays
                  ,pr.StartDate        = tp.StartDate
                  ,pr.EndDate          = tp.EndDate
                  ,pr.S3ObjectKey      = tp.S3ObjectKey
                  ,pr.S3ObjectUrl      = tp.S3ObjectUrl
                  ,pr.IsActive         = tp.IsActive
                  ,pr.IsDeleted        = tp.IsDeleted
                  ,pr.UpdatedByUserId  = tp.UpdatedByUserId
                  ,pr.UpdatedAt        = tp.UpdatedAt
            FROM Restaurant.Promotion pr
            INNER JOIN @TbPromotion   tp ON pr.Id = tp.Id;

            UPDATE pd SET
                   pd.PromotionId     = tp.PromotionId
                  ,pd.ItemId          = tp.ItemId
                  ,pd.FeeId           = tp.FeeId
                  ,pd.TaxId           = tp.TaxId
                  ,pd.MeasureId       = tp.MeasureId
                  ,pd.Quantity        = tp.Quantity
                  ,pd.Price           = tp.Price
                  ,pd.Obs             = tp.Obs
                  ,pd.CostPrice       = tp.CostPrice
                  ,pd.Subtotal        = tp.Subtotal
                  ,pd.UniqueId        = tp.UniqueId
                  ,pd.IsActive        = tp.IsActive
                  ,pd.IsDeleted       = tp.IsDeleted
                  ,pd.UpdatedAt       = GETDATE()
                  ,pd.UpdatedByUserId = @UserId
            FROM Restaurant.PromotionDetail pd
            INNER JOIN @TbPromotionDetails  tp ON pd.Id = tp.Id;


            INSERT INTO Restaurant.PromotionDetail
                  (PromotionId,ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,CreatedByUserId)
            SELECT PromotionId,ItemId,FeeId,TaxId,MeasureId,Quantity,Price,Obs,CostPrice,Subtotal,UniqueId,@UserId
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
 
        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

        SELECT '0' as code, 'Error en el procedimiento' as 'message'
    END CATCH
END
GO

