USE ACONTPLUS
GO
-- Author: Ivan Paz - Modified: Ignacio Manchu.
-- Date: 2023-08-04
-- Description: SP FOR UPDATE INGREDIENTS
-- Restaurant.Ingredient_Update 139, 1, '{"productJson": {"productId": 5},"ingredientJson": {"id": 1,"summary": "PESCADO","quantity": 0,"unit": 0,"content": "HOLA MUBDO DESDE ECUADOR","productDescription": "PESCADO","s3ObjectUrl": "https://acontplus.s3.us-east-2.amazonaws.com/0703885640001/articulos/0d8eb508-f8f0-42cd-baa0-e33bf7029e8c.jpg","ingredientTypeId": 2,"productId": 5}}'
CREATE OR ALTER PROCEDURE Restaurant.Ingredient_Update
    @userRoleId INT,
    @id INT,
    @json NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @productJson NVARCHAR(MAX)
            ,@ingredientJson NVARCHAR(MAX)
            ,@userId INT
            ,@productId INT

    CREATE TABLE #TableIngredient(
        id INT
        ,summary VARCHAR(500)
        ,ingredientTypeId INT
        ,quantity INT
        ,unit INT
        ,content VARCHAR(MAX)
        ,enabled BIT
    )


    SELECT @productJson = productJson
    , @ingredientJson = ingredientJson
    FROM OPENJSON(@json) 
    WITH(
        productJson NVARCHAR(MAX)       '$.productJson' AS JSON
        , ingredientJson NVARCHAR(MAX)  '$.ingredientJson' AS JSON
    )
          
    SELECT @productId = productId
    FROM OPENJSON(@productJson) WITH(productId INT '$.productId')

    IF EXISTS(SELECT 1 FROM Restaurant.Ingredient
                        WHERE productId = @productId AND id !=@id)
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Este ingrediente ya se encuentra registrado', NULL)
            RETURN
        END

    INSERT INTO #TableIngredient
    SELECT * FROM OPENJSON(@ingredientJson)
    WITH(
        id INT                  '$.id',
        summary VARCHAR(500)    '$.summary',
        ingredientTypeId INT    '$.ingredientTypeId',
        quantity INT            '$.quantity',
        unit INT                '$.unit',
        content VARCHAR(MAX)    '$.content',
        enabled BIT             '$.enabled'
    )
    
    SET @userId = (SELECT idUsuario
    FROM v_usuario
    WHERE idUsuarioRol = @userRoleId)

    BEGIN TRY
        BEGIN TRAN
            UPDATE ri
            SET ri.Summary           = ti.summary
                ,ri.IngredientTypeId = ti.ingredientTypeId
                ,ri.Quantity         = ti.quantity
                ,ri.Unit             = ti.unit
                ,ri.Content          = ti.content
                ,ri.UpdatedAt        = dbo.ufnGetDateEcuador()
                
            FROM Restaurant.Ingredient ri
            INNER JOIN #TableIngredient ti ON ti.id = ri.Id
            WHERE ri.id = @id
        COMMIT TRAN

        SELECT Common.ufnSpResponse('1', 'Actualizado exitosamente', NULL)
        RETURN
        
    END TRY
    BEGIN CATCH
        SELECT Common.ufnSpResponse('0', 'Error al actualizar el ingrediente', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
    VALUES(NEWID(), 'Ingredient/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
    END CATCH
END