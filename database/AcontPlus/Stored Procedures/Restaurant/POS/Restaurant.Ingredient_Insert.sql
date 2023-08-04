USE ACONTPLUS
GO

--Author: Ivan Paz
--Date: 2023-08-04
--Description: SP FOR GET INGREDIENTS INSERT
CREATE OR ALTER PROCEDURE Restaurant.Ingredient_Insert
    @userRoleId INT,
    @json NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @productJson NVARCHAR(MAX)
    ,@ingredientJson NVARCHAR(MAX)
    ,@userId INT

    SELECT @productJson = productJson
    , @ingredientJson = ingredientJson
    FROM OPENJSON(@json) WITH(productJson NVARCHAR(MAX) '$.productJson' AS JSON, ingredientJson NVARCHAR(MAX) '$.ingredientJson' AS JSON)

    DECLARE @productId INT

    SELECT @productId = productId
    FROM OPENJSON(@productJson) WITH(productId INT '$.productId')


    DECLARE @summary VARCHAR(500)
    ,@typeId INT
    ,@quantity INT
    ,@unit INT
    ,@content VARCHAR(MAX)

    SELECT @summary = summary
    , @typeId = typeId
    , @quantity = quantity
    , @unit = unit
    , @content = content
    FROM OPENJSON(@ingredientJson)
    WITH(
        summary VARCHAR(500) '$.summary',
        typeId INT '$.typeId',
        quantity INT '$.quantity',
        unit INT '$.unit',
        content VARCHAR(MAX) '$.content'
    )

    SET @userId = (SELECT idUsuario
    FROM V_usuario
    WHERE idUsuarioRol = @userRoleId)

    DECLARE @id INT = 0
    BEGIN TRY
        BEGIN TRAN
        INSERT INTO Restaurant.Ingredient
        (ProductId, Summary, TypeId, Quantity, Unit, Content, [Enabled], UserId)
    VALUES(@productId, @summary, @typeId, @quantity, @unit, @content, 1, @userId)
        SET @id = (SELECT SCOPE_IDENTITY())
        COMMIT TRAN
        IF (@id > 0)
            BEGIN
        SELECT dbo.ufn_spresponse('1', 'exitos al guardar', NULL)
    END
    ELSE
    BEGIN
        SELECT dbo.ufn_spresponse('0', 'No se pudo guardar el ingrediente', NULL)
    END
    END TRY
    BEGIN CATCH
        SELECT dbo.ufn_spresponse('0', 'Error al guardar el ingrediente', NULL)
        
    --     IF (@@TRANCOUNT > 0)
    --         BEGIN
    --     ROLLBACK TRAN
    -- END
       EXEC dbo.Error_Sistema_Insert NEWID(), 'Ingredient/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId
    END CATCH

END