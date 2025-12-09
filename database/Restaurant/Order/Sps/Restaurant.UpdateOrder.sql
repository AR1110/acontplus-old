USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Order_Get]    Script Date: 15/9/2025 15:17:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Restaurant.UpdateOrder
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> RETURN OUT
   DECLARE @Payload NVARCHAR(MAX)

    --> Data Json
    DECLARE @OrderDetails NVARCHAR(MAX) ,@DataDoc NVARCHAR(MAX)

    --> Varialbles BD
    DECLARE @UserId INT 

    DECLARE @TbOrder AS TABLE
    (
        [Id] INT NOT NULL
       ,[CustomerCompanyId] INT NOT NULL
       ,[TableId] INT NULL
       ,[Discount] NUMERIC(18,5) NULL
       ,[Tip] NUMERIC(18,5) NULL
       ,[Total] NUMERIC(18,5) NOT NULL
       ,[Obs] VARCHAR(500) NULL
       ,[IsDivided] BIT NOT NULL
       ,[IsFinished] BIT NOT NULL
       ,[UpdatedByUserId] INT NOT NULL
       ,[IsQuickSale] BIT NULL
       ,[UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    )

    DECLARE @TbOrderDetails AS TABLE
    (
        [Id] INT NOT NULL
       ,[OrderId] INT NOT NULL
       ,[ItemId] INT NOT NULL
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
       ,[IsActive] BIT NOT NULL
       ,[IsDeleted] BIT NOT NULL
       ,[CreatedByUserId] INT NOT NULL
       ,[UpdatedByUserId] INT NOT NULL
       ,[UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    )

    BEGIN TRY
        -->variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @UserRoleId

        --> Data json
        SELECT @OrderDetails = orderDetails FROM OPENJSON(@Json) WITH (orderDetails NVARCHAR(MAX) AS JSON)

        INSERT INTO @TbOrder
              ([Id],[TableId],[customerCompanyId],[discount],[tip],[total],[obs],[IsDivided],[IsFinished],[IsQuickSale],[UpdatedByUserId])
        SELECT @Id ,[TableId],[customerCompanyId],[discount],[tip],[total],[obs],[IsDivided],[IsFinished],[IsQuickSale],@UserId
        FROM OPENJSON(@Json)
        WITH
        (
            [customerCompanyId] INT
           ,[tableId]           INT
           ,[createdByUserId]   INT
           ,[discount]          NUMERIC(18,5) 
           ,[tip]               NUMERIC(18,5) 
           ,[total]             NUMERIC(18,5)
           ,[obs]               VARCHAR(500)
           ,[isDivided]         BIT
           ,[isFinished]        BIT
           ,[isQuickSale]       BIT
        )

        INSERT INTO @TbOrderDetails
              ([Id],[OrderId],[ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[IsActive],[IsDeleted],[CreatedByUserId],[UpdatedByUserId])
        SELECT [Id],@Id      ,[ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[IsActive],[IsDeleted],@UserId          ,@UserId
        FROM OPENJSON(@OrderDetails)
        WITH
        (
            [id]                INT
           ,[itemId]            INT 
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
           ,[isActive]          BIT 
           ,[isDeleted]         BIT
        )

        --> Variables dependientes
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

        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Id = @Id AND IsFinished = 1)
            BEGIN
                SELECT '0' code, 'No puedes editar este documento ya se encuentra transformado en un documento de venta.' as 'message'
                RETURN
            END

        BEGIN TRAN

            UPDATE od SET
                   od.[CustomerCompanyId] = tb.[CustomerCompanyId]
                  ,od.[TableId]           = tb.[TableId]
                  ,od.[Discount]          = tb.[Discount]
                  ,od.[Tip]               = tb.[Tip]
                  ,od.[Total]             = tb.[Total]
                  ,od.[IsDivided]         = tb.[IsDivided]
                  ,od.[IsFinished]        = tb.[IsFinished]
                  ,od.[Obs]               = tb.[Obs]
                  ,od.[UpdatedByUserId]   = tb.[UpdatedByUserId]
                  ,od.[UpdatedAt]         = tb.[UpdatedAt]
            FROM Restaurant.[Order] od
            INNER JOIN @tbOrder     tb ON tb.Id = od.Id

            UPDATE od SET
                   od.[taxPercentId]      = td.[taxPercentId]
                  ,od.[feeId]             = td.[feeId]
                  ,od.[warehouseId]       = td.[warehouseId]
                  ,od.[measureId]         = td.[measureId]
                  ,od.[taxValue]          = td.[taxValue]
                  ,od.[quantity]          = td.[quantity]
                  ,od.[unitPrice]         = td.[unitPrice]
                  ,od.[salePrice]         = td.[salePrice]
                  ,od.[discount]          = td.[discount]
                  ,od.[discountPercent]   = td.[discountPercent]
                  ,od.[subtotal]          = td.[subtotal]
                  ,od.[total]             = td.[total]
                  ,od.[obs]               = td.[obs]
                  ,od.[remainingQuantity] = td.[remainingQuantity]
                  ,od.[status]            = td.[status]
                  ,od.[isActive]          = td.[isActive]
                  ,od.[isDeleted]         = td.[isDeleted]
            FROM Restaurant.OrderDetail od
            INNER JOIN @TbOrderDetails  td ON od.Id = td.Id

            INSERT INTO Restaurant.OrderDetail
                  (OrderId,[ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[IsPaid],[CreatedByUserId])
            SELECT OrderId,[ItemId],[TaxPercentId],[FeeId],[WarehouseId],[MeasureId],[TaxValue],[Quantity],[UnitPrice],[SalePrice],[Discount],[DiscountPercent],[Subtotal],[Total],[Obs],[RemainingQuantity],[Status],[IsPaid],[CreatedByUserId]
            FROM @TbOrderDetails
            WHERE Id = 0

            IF EXISTS (SELECT 1 FROM @tbOrder WHERE IsQuickSale = 1)
                BEGIN
                    EXEC Restaurant.ConvertOrder @UserRoleId ,@Id ,@DataDoc ,@Payload = @Payload OUT
                END

        COMMIT TRAN
        SELECT '1' code, 'Actualizado Correctamente' as 'message' ,@Payload as payload
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
               ,@Method         VARCHAR(200)   = 'Restaurant/order/Put'

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
