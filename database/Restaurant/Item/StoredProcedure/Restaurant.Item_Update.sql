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
--- Restaurant.Item_Update 139, 17, '{"itemJson": {"id": 17,"summary": "","cooking": true,"recipe": "* 100 GRAMOS DE CARNE\n* 1 PAN DE HAMBURGUESA\n* 1/2 ONZA DE LECHUGA\n* 1/2 ONZA DE TOCINO",   "instructions": "","content": "","createdAt": "2023-09-05T08:56:34.6466667","updatedAt": null,"enabled": true,"deleted": false,"userId": 115,"productId": 77491,"descripcion": "HAMBURGUESA DOBLE CARNE","s3ObjectUrl": "https://s3.us-east-2.amazonaws.com/0703885640001/articulos/7b54a4cb-799b-49d2-9621-d1694f5bc15a.PNG","stockMinimo": 0,"stock": 18,"codigo": "COMR1","codigoAuxiliar": "AUX-COMR1","tipoIva": "12%","tipoArticulo": "Ninguna","style": "","productionAreaId": 1,"descripcionProductionArea": "COCINA","pvp": "{\"idArticuloPvP\":367360,\"idTarifa\":528,\"precioVenta\":4.46429,\"precioConIva\":5.00000,\"porcentajeUtilidad\":123.21429,\"precioPredeterminado\":true,\"tarifa\":\"PVP1\",\"porcentajeIva\":12.00000}","totalRecords": 9},"productionAreaJson": {"productionAreaId": 1},"recipeJson": [{"id": 10,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "MANCHU","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 5,"summary": "TOCINO X LIBRA"},{"id": 11,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "TUMINK","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 6,"summary": "PAN DE HAMBURGUESA"}, ]}'
CREATE OR ALTER PROCEDURE [Restaurant].[Item_Update]
     @userRoleId INT
    ,@id INT
    ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @UserId INT

    --> Data Json
    DECLARE @itemJson NVARCHAR(MAX) ,@recipeJson NVARCHAR(MAX)
            
    --> Tablas temporales
    DECLARE @tbItem AS TABLE
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
   
    DECLARE @tbRecipe AS TABLE
    (
        Id            INT NOT NULL
       ,ItemId        INT NOT NULL
       ,Unit          INT NOT NULL
       ,Weight        NUMERIC(18,5) NULL
       ,NetWeight     NUMERIC(18,5) NOT NULL
       ,IngredientId  INT NOT NULL            
       ,Instructions  VARCHAR(MAX) NULL 
       ,Quantity      FLOAT NOT NULL
       ,Enabled       BIT NOT NULL
       ,ExtentId      INT NOT NULL  
       ,CostPrice     NUMERIC(18,5) NULL
       ,CreatedAt     DATETIME2 DEFAULT GETDATE()
       ,IsActive      BIT NOT NULL
       ,IsDeleted     BIT NOT NULL
       
    )

	BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM V_usuario WHERE idUsuarioRol = @userRoleId

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

        INSERT INTO @tbRecipe
              (Id,ItemId,Unit,Weight,NetWeight,IngredientId,Instructions,Quantity,Enabled,ExtentId,CostPrice)
        SELECT Id,ItemId,Unit,Weight,NetWeight,IngredientId,Instructions,Quantity,Enabled,ExtentId,CostPrice
        FROM OPENJSON(@recipeJson) WITH
        (
           Id           INT           '$.id'
          ,ItemId       INT           '$.itemId'
          ,Unit         INT           '$.unit'
          ,Weight       NUMERIC(18,5) '$.weight'
          ,NetWeight    NUMERIC(18,5) '$.netWeight'
          ,IngredientId INT           '$.ingredientId'
          ,Instructions VARCHAR(MAX)  '$.instructions'
          ,Quantity     FLOAT         '$.quantity'
          ,Enabled      BIT           '$.enabled'
          ,ExtentId     INT           '$.extentId'
          ,CostPrice    NUMERIC(18,5) '$.costPrice'
        )

        --> Validation
        IF NOT EXISTS (SELECT 1 FROM @tbItem)
            BEGIN
                SELECT '0' code, 'Error en la informacion del item' as 'message'
                RETURN
            END

        IF NOT EXISTS (SELECT 1 FROM @tbRecipe)
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
            INSERT INTO Restaurant.Recipe
                  (ItemId, Unit, Weight, NetWeight ,CreatedAt ,CreatedByUserId  ,IngredientId ,Instructions ,Quantity ,ExtentId ,CostPrice)
            SELECT ItemId, Unit, Weight, NetWeight ,CreatedAt ,@UserId          ,IngredientId ,Instructions ,Quantity ,ExtentId ,CostPrice
            FROM @tbRecipe
            WHERE Id = 0

            --> UPDATE RECIPE 
            UPDATE rr SET
                   rr.Unit            = tr.unit
                  ,rr.Weight          = tr.[weight]
                  ,rr.NetWeight       = tr.[weight]
                  ,rr.IngredientId    = tr.ingredientId
                  ,rr.Instructions    = tr.instructions
                  ,rr.Quantity        = tr.quantity
                  ,rr.ExtentId        = tr.extentId
                  ,rr.CostPrice       = tr.costPrice
                  ,rr.IsActive        = tr.IsActive
                  ,rr.UpdatedAt       = GETDATE()
                  ,rr.IsDeleted       = tr.IsDeleted
                  ,rr.UpdatedByUserId = @UserId
            FROM Restaurant.Recipe rr            
            INNER JOIN @tbRecipe   tr ON tr.Id = rr.Id 
              
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
