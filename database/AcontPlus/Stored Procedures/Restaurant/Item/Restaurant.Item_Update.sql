GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- Restaurant.Item_Update 139, 17, '{"itemJson": {"id": 17,"summary": "","cooking": true,"recipe": "* 100 GRAMOS DE CARNE\n* 1 PAN DE HAMBURGUESA\n* 1/2 ONZA DE LECHUGA\n* 1/2 ONZA DE TOCINO",   "instructions": "","content": "","createdAt": "2023-09-05T08:56:34.6466667","updatedAt": null,"enabled": true,"deleted": false,"userId": 115,"productId": 77491,"descripcion": "HAMBURGUESA DOBLE CARNE","s3ObjectUrl": "https://acontplus.s3.us-east-2.amazonaws.com/0703885640001/articulos/7b54a4cb-799b-49d2-9621-d1694f5bc15a.PNG","stockMinimo": 0,"stock": 18,"codigo": "COMR1","codigoAuxiliar": "AUX-COMR1","tipoIva": "12%","tipoArticulo": "Ninguna","style": "","productionAreaId": 1,"descripcionProductionArea": "COCINA","pvp": "{\"idArticuloPvP\":367360,\"idTarifa\":528,\"precioVenta\":4.46429,\"precioConIva\":5.00000,\"porcentajeUtilidad\":123.21429,\"precioPredeterminado\":true,\"tarifa\":\"PVP1\",\"porcentajeIva\":12.00000}","totalRecords": 9},"productionAreaJson": {"productionAreaId": 1},"recipeJson": [{"id": 10,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "MANCHU","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 5,"summary": "TOCINO X LIBRA"},{"id": 11,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "TUMINK","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 6,"summary": "PAN DE HAMBURGUESA"}, ]}'
IF OBJECT_ID('Restaurant.Item_Update') IS NOT NULL
	DROP PROC Restaurant.Item_Update
GO
CREATE PROC Restaurant.Item_Update
@userRoleId INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    DECLARE @itemJson NVARCHAR(MAX)
            ,@productionAreaJson NVARCHAR(MAX)
            ,@recipeJson NVARCHAR(MAX)
            ,@productId INT           
            ,@date DATETIME = (SELECT dbo.ufnGetDateEcuador())
            ,@productionAreaId INT
            ,@summary VARCHAR(500)
            ,@cooking BIT
            ,@recipe VARCHAR(MAX)
            ,@instructions VARCHAR(MAX)
            ,@content VARCHAR(MAX)
            ,@enabled BIT
            ,@userId INT
            ,@itemId INT
            ,@precioCostoSumTotal NUMERIC(18,5)

    CREATE TABLE #RecipeTemp(
         id             INT
         ,itemId        INT
         ,unit          INT
         ,weight        NUMERIC(18,5)
         ,netWeigth     NUMERIC(18,5)
         ,ingredientId  INT            
         ,instructions  VARCHAR(MAX) 
         ,quantity      FLOAT
         ,enabled       BIT  
         ,extentId      INT
         ,costPrice     NUMERIC(18,5)
    )

    IF ISJSON(@json) = 0
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Formato incorrecto', NULL)
            RETURN
        END

    SELECT @itemJson                = itemJson
            ,@productionAreaJson    = productionAreaJson
            ,@recipeJson            = recipeJson
    FROM OPENJSON(@json) 
    WITH (itemJson NVARCHAR(MAX) '$.itemJson' AS JSON
            , productionAreaJson NVARCHAR(MAX) '$.productionAreaJson' AS JSON
            , recipeJson NVARCHAR(MAX) '$.recipeJson' AS JSON
    )


    INSERT INTO #RecipeTemp
    SELECT ISNULL(id, 0)
            , ISNULL(itemId, 0)
            , ISNULL(unit, 0)
            , weight
            , ISNULL(netWeigth, 0)
            , ISNULL(ingredientId, 0)
            , ISNULL(instructions, NULL)
            , ISNULL(quantity, 0)
            , enabled
            , ISNULL(extentId, 0)
            , ISNULL(costPrice, 0)
    FROM OPENJSON(@recipeJson)
    WITH(
      id            INT             '$.id'
      ,itemId       INT             '$.itemId'
      ,unit         INT             '$.unit'
      ,weight       NUMERIC(18,5)   '$.weight'
      ,netWeigth    NUMERIC(18,5)   '$.netWeight'
      ,ingredientId INT             '$.ingredientId'
      ,instructions VARCHAR(MAX)    '$.instructions'
      ,quantity     FLOAT           '$.quantity'
      ,enabled      BIT             '$.enabled'
      ,extentId     INT             '$.extentId'
      ,costPrice    NUMERIC(18,5)   '$.costPrice'
    )
    
    SELECT @productId = productId FROM OPENJSON(@itemJson) WITH(productId INT '$.productId')

    IF EXISTS(SELECT TOP 1 1 FROM Restaurant.Item WHERE ProductId = @productId AND Id != @id)
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Este ítem ya se encuentra registrado', NULL)
            RETURN
        END
            
    SET @userId = (SELECT idUsuario FROM V_usuario WHERE idUsuarioRol = @userRoleId) 
    
    SELECT @productionAreaId = productionAreaId
            ,@summary        = summary
            ,@cooking        = cooking
            ,@recipe         = recipe
            ,@instructions   = instructions
            ,@content        = content
            ,@enabled        = enabled
    FROM OPENJSON(@itemJson) 
    WITH(
        productionAreaId INT          '$.productionAreaId'
        ,summary         VARCHAR(500) '$.summary'
        ,cooking         BIT          '$.cooking'
        ,recipe          VARCHAR(MAX) '$.recipe'
        ,instructions    VARCHAR(MAX) '$.instructions'
        ,content         VARCHAR(500) '$.content'
        ,enabled         BIT          '$.enabled'
    )

    SET @itemId = (SELECT TOP 1 itemId FROM #RecipeTemp)
        
	BEGIN TRY               
		BEGIN TRAN
            UPDATE Restaurant.Item
            SET productionAreaId = @productionAreaId
                ,summary         = @summary
                ,cooking         = @cooking
                ,recipe          = @recipe
                ,instructions    = @instructions
                ,content         = @content
                ,enabled         = @enabled
            WHERE Id = @id
            
            ---- INSERT RECIPE IF NOT EXISTS ----
            INSERT INTO Restaurant.Recipe
            (ItemId, Unit, Weight, NetWeight, CreatedAt, UpdatedAt, Enabled, Deleted, UserId, IngredientId, Instructions, Quantity, ExtentId, CostPrice)

            SELECT rt.itemId
                    , rt.unit
                    , rt.[weight]
                    , rt.[weight]
                    , @date
                    , NULL
                    , ISNULL(rt.[enabled], 1)
                    , NULL
                    , @userId
                    , rt.ingredientId
                    , rt.instructions
                    , rt.quantity
                    , rt.extentId
                    , rt.costPrice
            FROM #RecipeTemp rt
            WHERE rt.ingredientId NOT IN(SELECT rr.IngredientId FROM Restaurant.Recipe rr WHERE rr.ItemId = @itemId)
          
            ---- UPDATE RECIPE ----
            UPDATE rr
            SET rr.Unit          = rt.unit
                ,rr.Weight       = rt.[weight]
                ,rr.NetWeight    = rt.[weight]
                ,rr.Enabled      = ISNULL(rt.[enabled], 1)
                ,rr.IngredientId = rt.ingredientId
                ,rr.Instructions = rt.instructions
                ,rr.Quantity     = rt.quantity
                ,rr.UpdatedAt    = @date
                ,rr.ExtentId     = rt.extentId
                ,rr.CostPrice    = rt.costPrice
            FROM Restaurant.Recipe rr            
            INNER JOIN #RecipeTemp rt ON rt.itemId = rr.ItemId
            WHERE rr.IngredientId = rt.ingredientId
            AND rr.Id = rt.id

            --- UPDATE DELETED ----
            UPDATE rr
            SET rr.Unit          = rt.unit
                ,rr.Weight       = rt.weight
                ,rr.NetWeight    = rt.netWeigth
                ,rr.Enabled      = ISNULL(rt.[enabled], 1)
                ,rr.Deleted      = 0
                ,rr.IngredientId = rt.ingredientId
                ,rr.Instructions = rt.instructions
                ,rr.Quantity     = rt.quantity
                ,rr.UpdatedAt    = @date
                ,rr.ExtentId     = rt.extentId
                ,rr.CostPrice    = rt.costPrice
            FROM Restaurant.Recipe rr            
            INNER JOIN #RecipeTemp rt ON rt.itemId = rr.ItemId
            WHERE rr.IngredientId = rt.ingredientId
            AND rr.Deleted = 1
                    
            -------- SELECT NOT EXISTS ------
            SELECT rr.Id, rr.ItemId, rr.IngredientId
            INTO #NotExists
            FROM Restaurant.Recipe rr
            WHERE rr.ItemId = @itemId AND rr.IngredientId NOT IN (SELECT ingredientId FROM #RecipeTemp)
                      
            IF EXISTS(SELECT TOP 1 1 FROM #NotExists)
                BEGIN
                    UPDATE rr
                    SET rr.Deleted     =  1
                        ,rr.UpdatedAt   = dbo.ufnGetDateEcuador()
                    FROM Restaurant.Recipe rr
                    INNER JOIN #NotExists ne ON ne.Id = rr.Id
                    WHERE rr.ItemId = ne.ItemId AND rr.IngredientId = ne.IngredientId
                END

            ---- UPDATE IN Articulo ------
            SET @precioCostoSumTotal = (SELECT ISNULL(SUM(rr.CostPrice), 0) 
                                        FROM Restaurant.Recipe rr
                                        INNER JOIN Restaurant.Item ri ON ri.Id = rr.ItemId
                                        WHERE ri.ProductId = @productId
                                        AND ISNULL(rr.Deleted, 0) != 1)
                                        
            UPDATE dbo.Articulo SET precioCosto = @precioCostoSumTotal WHERE idArticulo = @productId

		COMMIT TRAN
        SELECT Common.ufnSpResponse('1', 'Actualizado exitosamente', NULL)
	END TRY
	BEGIN CATCH
		SELECT Common.ufnSpResponse('0', 'Error al actualizar el ingrediente', NULL)
        
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES(NEWID(), 'Item/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END 