GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- Restaurant.Item_Update 139, 1, '{"itemJson": {"id": 1,"summary": "TEST","cooking": true, "recipe": "TEST DE LOS DATOS", "instructions": "DATOS", "content": "DATOS", "createdAt": "2023-08-21T17:15:03.1933333","updatedAt": null, "enabled": true, "deleted": false, "userId": 115, "productId": 1, "descripcion": "MAITO DE PESCADO", "s3ObjectUrl": "https://acontplus.s3.us-east-2.amazonaws.com/0703885640001/articulos/5db50980-91b2-4cf1-ad0d-f1b74ac8e60a.jpg", "stockMinimo": 0, "stock": 0, "codigo": "PLA1", "codigoAuxiliar": "AUX-PLA1", "tipoIva": "12%", "tipoArticulo": "Ninguna", "style": "badge badge-danger", "productionAreaId": 1, "descripcionProductionArea": null, "totalRecords": 1 },"productionAreaJson": { "productionAreaId": 1 },"recipeJson": [{"id": 0,"unit": 3,"weight": 5,"netWeight": 5,"createdAt": "","updatedAt": "","enabled": true,"deleted": false,"userId": 0, "ingredientId": 3,"summary": "PESCADO","instructions": "","quantity": 5,"itemId": 1}]}'
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
         ,deleted       BIT
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
            , deleted
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
      ,deleted      BIT             '$.deleted'
    )
   
    SELECT @productId = productId FROM OPENJSON(@itemJson) WITH(productId INT '$.productId')

    --IF EXISTS(SELECT TOP 1 1 FROM Restaurant.Item WHERE ProductId = @productId AND Id != @id)
    --    BEGIN
    --        SELECT Common.ufnSpResponse('0', 'Este ítem ya se encuentra registrado', NULL)
    --        RETURN
    --    END
            
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

            ---- Insert Recipe ----
            INSERT INTO Restaurant.Recipe
            (ItemId, Unit, Weight, NetWeight, CreatedAt, UpdatedAt, Enabled, Deleted, UserId, IngredientId, Instructions, Quantity)
            
            SELECT rt.itemId, rt.unit, rt.weight, rt.netWeigth, @date,NULL,rt.enabled,NULL, @userId, rt.ingredientId, rt.instructions, rt.quantity
            FROM #RecipeTemp rt
            WHERE rt.ingredientId NOT IN(SELECT rr.IngredientId 
                                         FROM Restaurant.Recipe rr 
                                         WHERE rr.ItemId = (SELECT TOP 1 itemId FROM #RecipeTemp))                     
            
            --- Update Recipe -  si existe un registro de ingredient => Actualiza ----
            UPDATE rr
            SET rr.Unit          = rt.unit
                ,rr.Weight       = rt.weight
                ,rr.NetWeight    = rt.netWeigth
                ,rr.Enabled      = rt.enabled
                ,rr.Deleted      = rt.deleted
                ,rr.IngredientId = rt.ingredientId
                ,rr.Instructions = rt.instructions
                ,rr.Quantity     = rt.quantity
                ,rr.UpdatedAt    = @date
            FROM Restaurant.Recipe rr
            INNER JOIN #RecipeTemp rt ON rt.itemId = rr.ItemId AND rt.id = rt.id
            WHERE rr.IngredientId = rt.ingredientId AND rt.itemId = rt.itemId
            
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