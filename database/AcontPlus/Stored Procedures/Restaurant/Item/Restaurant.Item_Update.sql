GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- Restaurant.Item_Update 139, 5, ''
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

    CREATE TABLE #RecipeTemp(
         id            INT
         ,itemId       INT
         ,unit         INT
         ,weight       NUMERIC(18,5)
         ,netWeigth    NUMERIC(18,5)
         ,ingredientId INT            
         ,instructions VARCHAR(MAX) 
         ,quantity     DECIMAL(18,5)
    )

    IF ISJSON(@json) = 0
        BEGIN
            SELECT dbo.ufn_spresponse('0', 'Formato incorrecto', NULL)
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

    SELECT @productId = productId FROM OPENJSON(@itemJson) WITH(productId INT '$.productId')

    IF EXISTS(SELECT TOP 1 1 FROM Restaurant.Item WHERE ProductId = @productId AND Id != @id)
        BEGIN
            SELECT dbo.ufn_spresponse('0', 'Este ítem ya se encuentra registrado', NULL)
            RETURN
        END


    DECLARE @productionAreaId INT
            ,@summary VARCHAR(500)
            ,@cooking BIT
            ,@recipe VARCHAR(MAX)
            ,@instructions VARCHAR(MAX)
            ,@content VARCHAR(MAX)
            ,@enabled BIT
            ,@userId INT

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


    SELECT ISNULL(id, 0), ISNULL(itemId, 0), ISNULL(unit, 0), weight, netWeigth, ingredientId, instructions, quantity     
    FROM OPENJSON(@recipeJson)
    WITH(
      id            INT             '$.id'
      ,itemId       INT             '$.itemId'
      ,unit         INT             '$.unit'
      ,weight       NUMERIC(18,5)   '$.weight'
      ,netWeigth    NUMERIC(18,5)   '$.netWeigth'
      ,ingredientId INT             '$.ingredientId'
      ,instructions VARCHAR(MAX)    '$.instructions'
      ,quantity     DECIMAL(18,5)   '$.quantity'
    )
     
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

            SELECT rt.itemId, rt.unit, rt.weight, rt.netWeigth, @date, NULL, NULL, NULL, @userId, rt.ingredientId, rt.instructions, rt.quantity
            FROM #RecipeTemp rt
            ---- Update Recipe ----
            

            ---- Delete Recipe ----
            
		COMMIT TRAN
        SELECT dbo.ufn_spresponse('1', 'Actualizado exitosamente', NULL)

	END TRY
	BEGIN CATCH
		SELECT dbo.ufn_spresponse('0', 'Error al actualizar el ingrediente', NULL)
        
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES(NEWID(), 'Item/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END