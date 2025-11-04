USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Item_Update]    Script Date: 6/10/2025 16:07:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- Restaurant.Item_Update 139, 17, '{"itemJson": {"id": 17,"summary": "","cooking": true,"recipe": "* 100 GRAMOS DE CARNE\n* 1 PAN DE HAMBURGUESA\n* 1/2 ONZA DE LECHUGA\n* 1/2 ONZA DE TOCINO",   "instructions": "","content": "","createdAt": "2023-09-05T08:56:34.6466667","updatedAt": null,"enabled": true,"deleted": false,"userId": 115,"productId": 77491,"descripcion": "HAMBURGUESA DOBLE CARNE","s3ObjectUrl": "https://acontplus.s3.us-east-2.amazonaws.com/0703885640001/articulos/7b54a4cb-799b-49d2-9621-d1694f5bc15a.PNG","stockMinimo": 0,"stock": 18,"codigo": "COMR1","codigoAuxiliar": "AUX-COMR1","tipoIva": "12%","tipoArticulo": "Ninguna","style": "","productionAreaId": 1,"descripcionProductionArea": "COCINA","pvp": "{\"idArticuloPvP\":367360,\"idTarifa\":528,\"precioVenta\":4.46429,\"precioConIva\":5.00000,\"porcentajeUtilidad\":123.21429,\"precioPredeterminado\":true,\"tarifa\":\"PVP1\",\"porcentajeIva\":12.00000}","totalRecords": 9},"productionAreaJson": {"productionAreaId": 1},"recipeJson": [{"id": 10,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "MANCHU","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 5,"summary": "TOCINO X LIBRA"},{"id": 11,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "TUMINK","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 6,"summary": "PAN DE HAMBURGUESA"}, ]}'
CREATE OR ALTER PROCEDURE Restaurant.UpdateItem
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @UserId INT

    --> Data Json
    DECLARE @ItemJson NVARCHAR(MAX) ,@RecipeJson NVARCHAR(MAX)
            
    --> Tablas temporales
    DECLARE @TbItem AS TABLE
    (
        Id             INT NOT NULL
       ,[Summary]      VARCHAR(500) NULL
       ,[Cooking]      BIT NOT NULL
       ,[Recipe]       VARCHAR(MAX) NULL
       ,[Instructions] VARCHAR(MAX) NULL
       ,[Content]      VARCHAR(500) NULL
       ,[Unit]         INT NULL
       ,[ForPromotion] BIT NULL
       ,[Quantity]     INT NULL
       ,[Title]        VARCHAR(500) NULL
       ,IsActive       BIT NOT NULL
    )
   
    DECLARE @TbItemComposition AS TABLE
    (
        [Id]                INT
       ,[ItemId]            INT
       ,[ChildItemId]       INT
       ,[ItemCompositionId] INT
       ,[FeeId]             INT
       ,[TaxId]             INT
       ,[MeasureId]         INT
       ,[ExtentId]          INT
       ,[Quantity]          NUMERIC(18,5)
       ,[Price]             NUMERIC(18,5)
       ,[Instructions]      VARCHAR(MAX)
       ,[Weight]            NUMERIC(18,5)
       ,[NetWeight]         NUMERIC(18,5)
       ,[CostPrice]         NUMERIC(18,5)
       ,[DiscountPercent]   NUMERIC(18,5)
       ,[Discount]          NUMERIC(18,5)
       ,[Subtotal]          NUMERIC(18,5)
       ,[WastePercentage]   NUMERIC(18,5)
       ,[IsOptional]        BIT 
       ,[ExtraCharge]       NUMERIC(18,5)
       ,[UniqueId]          VARCHAR(MAX)
       ,[IsActive]          BIT
       ,[IsDeleted]         BIT
       ,[CreatedAt]         DATETIME2 DEFAULT GETDATE()
       ,[UpdatedAt]         DATETIME2 DEFAULT GETDATE()
    )

	BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> DataJson
        SELECT @itemJson   = itemJson
              ,@recipeJson = recipeJson
        FROM OPENJSON(@json)  WITH
        (
            itemJson   NVARCHAR(MAX) '$.itemJson'   AS JSON 
           ,recipeJson NVARCHAR(MAX) '$.recipeJson' AS JSON
        )

        INSERT INTO @tbItem
              ( id, [Summary], Cooking, Recipe, Instructions, Content, Unit, ForPromotion, Quantity, Title)
        SELECT @id, [Summary], Cooking, Recipe, Instructions, Content, Unit, ForPromotion, Quantity, Title
        FROM OPENJSON(@itemJson) WITH
        (
            [Summary]      VARCHAR(500) '$.summary'
           ,[Cooking]      BIT          '$.cooking'
           ,[Recipe]       VARCHAR(MAX) '$.recipe'
           ,[Instructions] VARCHAR(MAX) '$.instructions'
           ,[Content]      VARCHAR(500) '$.content'
           ,[Unit]         INT          '$.unit'
           ,[ForPromotion] BIT          '$.forPromotion'
           ,[Quantity]     INT          '$.quantity'
           ,[Title]        VARCHAR(500) '$.title'
        )

        INSERT INTO @TbItemComposition
              (Id,ItemId,ChildItemId,ItemCompositionId,FeeId,TaxId,MeasureId,ExtentId,Quantity,Price,Instructions,Weight,NetWeight,CostPrice,DiscountPercent,Discount,Subtotal,WastePercentage, IsOptional,ExtraCharge,UniqueId,IsActive,IsDeleted)
        SELECT Id,ItemId,ChildItemId,ItemCompositionId,FeeId,TaxId,MeasureId,ExtentId,Quantity,Price,Instructions,Weight,NetWeight,CostPrice,DiscountPercent,Discount,Subtotal,WastePercentage, IsOptional,ExtraCharge,UniqueId,IsActive,IsDeleted
        FROM OPENJSON(@recipeJson) WITH
        (
            [Id]                INT                '$.id'
           ,[ItemId]            INT                '$.itemid'
           ,[ChildItemId]       INT                '$.childitemid'
           ,[ItemCompositionId] INT                '$.itemcompositionid'
           ,[FeeId]             INT                '$.feeid'
           ,[TaxId]             INT                '$.taxid'
           ,[MeasureId]         INT                '$.measureid'
           ,[ExtentId]          INT                '$.extentid'
           ,[Quantity]          NUMERIC(18,5)      '$.quantity'
           ,[Price]             NUMERIC(18,5)      '$.price'
           ,[Instructions]      VARCHAR(MAX)       '$.instructions'
           ,[Weight]            NUMERIC(18,5)      '$.weight'
           ,[NetWeight]         NUMERIC(18,5)      '$.netweight'
           ,[CostPrice]         NUMERIC(18,5)      '$.costprice'
           ,[DiscountPercent]   NUMERIC(18,5)      '$.discountpercent'
           ,[Discount]          NUMERIC(18,5)      '$.discount'
           ,[Subtotal]          NUMERIC(18,5)      '$.subtotal'
           ,[WastePercentage]   NUMERIC(18,5)      '$.wastepercentage'
           ,[IsOptional]        BIT                '$.isoptional'
           ,[ExtraCharge]       NUMERIC(18,5)      '$.extracharge'
           ,[UniqueId]          VARCHAR(MAX)       '$.uniqueid'
           ,[IsActive]          BIT                '$.isactive'
           ,[IsDeleted]         BIT                '$.isdeleted'
        )

        --> Validation
        IF NOT EXISTS (SELECT 1 FROM @tbItem)
            BEGIN
                SELECT '0' code, 'Error en la informacion del item' as 'message'
                RETURN
            END

        IF NOT EXISTS (SELECT 1 FROM @TbItemComposition)
            BEGIN
                SELECT '0' code, 'Error en la informacion del detalle' as 'message'
                RETURN
            END

		BEGIN TRAN
            --> Item
            UPDATE it SET 
                   it.summary         = it.summary 
                  ,it.cooking         = it.cooking 
                  ,it.recipe          = it.recipe
                  ,it.instructions    = it.instructions
                  ,it.content         = it.content 
                  ,it.IsActive        = it.IsActive
                  ,it.UpdatedAt       = GETDATE()
                  ,it.UpdatedByUserId = @UserId
            FROM Restaurant.Item it
            INNER JOIN @tbItem   ti ON ti.Id = it.Id
            
            --> INSERT RECIPE IF NOT EXISTS
            INSERT INTO Restaurant.ItemComposition
                  (ItemId,ChildItemId,ItemCompositionId,FeeId,TaxId,MeasureId,ExtentId,Quantity,Price,Instructions,Weight,NetWeight,CostPrice,DiscountPercent,Discount,Subtotal,WastePercentage,IsOptional,ExtraCharge,UniqueId,IsActive,IsDeleted,CreatedAt,CreatedByUserId)
            SELECT @Id   ,ChildItemId,ItemCompositionId,FeeId,TaxId,MeasureId,ExtentId,Quantity,Price,Instructions,Weight,NetWeight,CostPrice,DiscountPercent,Discount,Subtotal,WastePercentage,IsOptional,ExtraCharge,UniqueId,IsActive,IsDeleted,CreatedAt,@UserId
            FROM @TbItemComposition
            WHERE Id = 0

            --> UPDATE RECIPE 
            UPDATE rr SET
                   rr.Weight           = tr.[Weight]
                  ,rr.NetWeight        = tr.[NetWeight]
                  ,rr.Instructions     = tr.Instructions
                  ,rr.Quantity         = tr.Quantity
                  ,rr.ExtentId         = tr.ExtentId
                  ,rr.CostPrice        = tr.CostPrice
                  ,rr.DiscountPercent  = tr.DiscountPercent
                  ,rr.Discount         = tr.Discount
                  ,rr.Subtotal         = tr.Subtotal
                  ,rr.WastePercentage  = tr.WastePercentage
                  ,rr.IsOptional       = tr.IsOptional
                  ,rr.ExtraCharge      = tr.ExtraCharge
                  ,rr.UniqueId         = tr.UniqueId
                  ,rr.Price            = tr.Price
                  ,rr.MeasureId        = tr.MeasureId
                  ,rr.TaxId            = tr.TaxId
                  ,rr.FeeId            = tr.FeeId
                  ,rr.ChildItemId      = tr.ChildItemId
                  ,rr.ItemCompositionId= tr.ItemCompositionId
                  ,rr.IsActive         = tr.IsActive
                  ,rr.IsDeleted        = tr.IsDeleted
                  ,rr.UpdatedAt        = tr.UpdatedAt
                  ,rr.UpdatedByUserId  = @UserId
            FROM Restaurant.ItemComposition rr
            INNER JOIN @TbItemComposition   tr ON tr.Id = rr.Id;

              
		COMMIT TRAN
        SELECT '1' code, 'Actualizado exitosamente' as 'message'
	END TRY

	BEGIN CATCH
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES(NEWID(), 'Item/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @UserId)

        SELECT '0' code, 'Error al actualizar el ingrediente' as 'message'
     END CATCH
END 
