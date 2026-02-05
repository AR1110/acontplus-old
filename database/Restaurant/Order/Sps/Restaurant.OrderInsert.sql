USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Order_Get]    Script Date: 15/9/2025 15:17:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Restaurant.OrderInsert
     @UserRoleId INT
    ,@Json VARCHAR(MAX)

AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    -->ID
    DECLARE @OrderId INT ,@Payload NVARCHAR(MAX)

    --> Data Json
    DECLARE @OrderDetails NVARCHAR(MAX) ,@OrderDetailCompositionModifiers NVARCHAR(MAX) ,@DataDoc NVARCHAR(MAX)

    --> Varialbles BD
    DECLARE @UserId INT ,@Sequence INT ,@PuntoEmisionId INT ,@Serie VARCHAR(18) ,@CreatedByUserId INT

    DECLARE @TbOrder AS TABLE
    (
        [PuntoEmisionId] INT NOT NULL
       ,[CustomerCompanyId] INT NOT NULL
       ,[TableId] INT NULL
       ,[Discount] NUMERIC(18,5) NULL
       ,[Tip] NUMERIC(18,5) NULL
       ,[Total] NUMERIC(18,5) NOT NULL
       ,[Obs] VARCHAR(500) NULL
       ,[IsDivided] BIT NOT NULL
       ,[IsFinished] BIT NOT NULL
       ,[CreatedByUserId] INT NOT NULL
       ,[IsQuickSale] BIT NULL
    )

    DECLARE @TbOrderDetails AS TABLE
    (
        [ItemId] INT NOT NULL
       ,[TaxPercentId] INT NOT NULL
       ,[FeeId] INT NOT NULL
       ,[WarehouseId] INT NULL
       ,[MeasureId] INT NOT NULL
       ,[TaxValue] NUMERIC(18,5) NOT NULL
       ,[Quantity] NUMERIC(18,5) NOT NULL
       ,[UnitPrice] NUMERIC(18,5) NOT NULL
       ,[SalePrice] NUMERIC(18,5) NOT NULL
       ,[Discount] NUMERIC(18,5) NOT NULL
       ,[DiscountPercent] NUMERIC(18,5) NOT NULL
       ,[Subtotal] NUMERIC(18,5) NOT NULL
       ,[Total] NUMERIC(18,5) NOT NULL
       ,[Obs] VARCHAR(1000)
       ,[IsPaid] BIT NOT NULL DEFAULT 0
       ,[RemainingQuantity] NUMERIC(18,5) NULL
       ,[Status] INT NOT NULL
       ,[UniqueId] UNIQUEIDENTIFIER NULL
    )

    DECLARE @TbOrderDetailCompositionModifiers AS TABLE
    (
        [ModifierCompositionId] INT NOT NULL
       ,[Quantity] NUMERIC(18,5) NOT NULL
       ,[ExtraCharge] NUMERIC(18,5) NOT NULL
       ,[Instructions] VARCHAR(500) NULL
       ,[UniqueId] UNIQUEIDENTIFIER NULL
    )

    BEGIN TRY

        --> Data json
        SELECT @OrderDetails                     = orderDetails
              ,@OrderDetailCompositionModifiers  = OrderDetailCompositionModifiers
        FROM OPENJSON(@Json) WITH
        (
             orderDetails                    NVARCHAR(MAX) AS JSON
            ,orderDetailCompositionModifiers NVARCHAR(MAX) AS JSON

        )

        INSERT INTO @TbOrder
              ([TableId],[puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isdivided],[isfinished],[CreatedByUserId],[IsQuickSale])
        SELECT [TableId],[puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isdivided],[isfinished],[CreatedByUserId],[IsQuickSale]
        FROM OPENJSON(@Json)
        WITH
        (
            [puntoEmisionId]    INT
           ,[customerCompanyId] INT
           ,[createdByUserId]   INT
           ,[tableId]           INT
           ,[discount]          NUMERIC(18,5) 
           ,[tip]               NUMERIC(18,5) 
           ,[total]             NUMERIC(18,5)
           ,[obs]               VARCHAR(500) 
           ,[isDivided]         BIT
           ,[isFinished]        BIT
           ,[isQuickSale]       BIT
        )

        INSERT INTO @TbOrderDetails
              ([ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[UniqueId])
        SELECT [ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[UniqueId]
        FROM OPENJSON(@OrderDetails)
        WITH
        (
            [itemId]            INT 
           ,[taxPercentId]      INT 
           ,[feeId]             INT 
           ,[warehouseId]       INT
           ,[measureId]         INT 
           ,[taxValue]          NUMERIC(18,5) 
           ,[quantity]          NUMERIC(18,5) 
           ,[unitPrice]         NUMERIC(18,5) 
           ,[salePrice]         NUMERIC(18,5) 
           ,[discount]          NUMERIC(18,5) 
           ,[discountPercent]   NUMERIC(18,5) 
           ,[subtotal]          NUMERIC(18,5) 
           ,[total]             NUMERIC(18,5) 
           ,[obs]               VARCHAR(1000)
           ,[remainingQuantity] NUMERIC(18,5)
           ,[status]            INT
           ,[uniqueId]          UNIQUEIDENTIFIER
        )

        INSERT INTO @TbOrderDetailCompositionModifiers
              ([ModifierCompositionId],[Quantity],[ExtraCharge],[Instructions],[UniqueId])
        SELECT [ModifierCompositionId],[Quantity],[ExtraCharge],[Instructions],[UniqueId] 
        FROM OPENJSON(@OrderDetailCompositionModifiers)
        WITH
        (
            [modifierCompositionId] INT
           ,[quantity]              NUMERIC(18,5)
           ,[extraCharge]           NUMERIC(18,5)
           ,[instructions]          VARCHAR(500)
           ,[uniqueId]              UNIQUEIDENTIFIER
        )

        --> Variables dependientes
        SELECT TOP 1 @PuntoEmisionId = PuntoEmisionId ,@CreatedByUserId = CreatedByUserId FROM @TbOrder

        SELECT TOP 1 @Sequence = ultimaSecuencia
                    ,@Serie    = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM dbo.ConfiguracionDocumento cd
        INNER JOIN dbo.TipoDocumento    td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision     pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento  es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE td.codigo = 'OR'
          AND cd.idPuntoEmision = @PuntoEmisionId

        IF EXISTS (SELECT 1 FROM @tbOrder WHERE IsQuickSale = 1)
            BEGIN
                SELECT @DataDoc = dataDoc FROM OPENJSON(@Json) WITH (dataDoc NVARCHAR(MAX) AS JSON)
            END 

        --> Validaciones
        IF NOT EXISTS (SELECT 1 FROM @TbOrder)
            BEGIN
                SELECT '0' code, 'Error en la informacion de la orden' as 'message'
                RETURN
            END

        IF NOT EXISTS (SELECT 1 FROM @TbOrderDetails)
            BEGIN
                SELECT '0' code, 'Error en la informacion de los detales de la orden' as 'message'
                RETURN
            END

        IF @Serie IS NULL OR @Sequence IS NULL
            BEGIN
                SELECT '0' code, 'Error en la informacion de la serie del comprobante' as 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE PuntoEmisionId = @PuntoEmisionId AND [Sequence] = @Sequence)
            BEGIN
                SELECT '0' code, 'Error, ya se encuentra registrado esta serie del comprobante' as 'message'
                RETURN
            END

        BEGIN TRAN
            INSERT INTO Restaurant.[Order]
                  ([TableId],[puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isDivided],[isFinished],[CreatedByUserId],[Sequence],[Serie])
            SELECT [TableId],[puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isDivided],[isFinished],[CreatedByUserId], @Sequence,@Serie
            FROM @TbOrder

            SET @OrderId = SCOPE_IDENTITY();

            INSERT INTO Restaurant.OrderDetail
                   (OrderId,[ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[IsPaid],[UniqueId],CreatedByUserId)
            SELECT @OrderId,[ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[IsPaid],[UniqueId],@CreatedByUserId
            FROM @TbOrderDetails

            UPDATE cd SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1
            FROM dbo.ConfiguracionDocumento cd
            INNER JOIN dbo.TipoDocumento    td ON td.idTipoDocumento   = cd.idTipoDocumento
            WHERE td.codigo = 'OR'
              AND cd.idPuntoEmision = @PuntoEmisionId

            IF EXISTS (SELECT 1 FROM @TbOrderDetailCompositionModifiers)
                BEGIN
                    INSERT INTO Restaurant.OrderDetailCompositionModifier
                          ([OrderDetailId],[ModifierCompositionId]   ,[Quantity],[ExtraCharge],[Instructions])
                    SELECT Id             ,[ModifierCompositionId],cm.[Quantity],[ExtraCharge],[Instructions] 
                    FROM @TbOrderDetailCompositionModifiers cm
                    INNER JOIN Restaurant.OrderDetail       od ON od.UniqueId = cm.UniqueId
                    WHERE od.OrderId = @OrderId

                    UPDATE Restaurant.OrderDetail SET UniqueId = NULL WHERE OrderId = @OrderId
                END 

            IF EXISTS (SELECT 1 FROM @tbOrder WHERE IsQuickSale = 1)
                BEGIN
                    EXEC Restaurant.OrderConvert @UserRoleId ,@OrderId ,@DataDoc ,@Payload = @Payload OUT
                END 

        COMMIT TRAN
        SELECT '1' code, 'Registrado Correctamente' as 'message' , @Payload as payload
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
               ,@Method         VARCHAR(200)   = 'Restaurant/order/Post'

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
