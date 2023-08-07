USE ACONTPLUS
GO

--Author: Ivan Paz
--Date: 2023-08-04
--Description: SP FOR UPDATE INGREDIENTS
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

    SELECT @productJson = productJson
    , @ingredientJson = ingredientJson
    FROM OPENJSON(@json) WITH(productJson NVARCHAR(MAX) '$.productJson' AS JSON, ingredientJson NVARCHAR(MAX) '$.ingredientJson' AS JSON)

    DECLARE @productId INT

    SELECT @productId = productId
    FROM OPENJSON(@productJson) WITH(productId INT '$.productId')

    IF EXISTS(SELECT 1 FROM Restaurant.Ingredient
                        WHERE productId = @productId AND id !=@id)
        BEGIN
            SELECT dbo.ufn_spresponse('0', 'Este ingrediente ya se encuentra registrado', NULL)
            RETURN
        END

    DECLARE @summary VARCHAR(500)
    ,@typeId INT
    ,@quantity INT
    ,@unit INT
    ,@content VARCHAR(MAX)
    ,@enabled BIT

    SELECT @summary = summary
    , @typeId = typeId
    , @quantity = quantity
    , @unit = unit
    , @content = content
    , @enabled = [enabled]
    FROM OPENJSON(@ingredientJson)
    WITH(
        summary VARCHAR(500) '$.summary',
        typeId INT '$.typeId',
        quantity INT '$.quantity',
        unit INT '$.unit',
        content VARCHAR(MAX) '$.content',
        [enabled] BIT '$.enabled'
    )

    SET @userId = (SELECT idUsuario
    FROM V_usuario
    WHERE idUsuarioRol = @userRoleId)

    BEGIN TRY
        BEGIN TRAN

            UPDATE Restaurant.Ingredient SET
            summary = @summary,
            typeID = @typeId,
            quantity = @quantity,
            unit = @unit,
            content = @content,
            updatedAt = dbo.ufnGetDateEcuador(),
            [enabled] = @enabled,
            userId = @userId
            WHERE id = @id

        COMMIT TRAN
            SELECT dbo.ufn_spresponse('1', 'Actualizado exitosamente', NULL)
        
    END TRY
    BEGIN CATCH
        SELECT dbo.ufn_spresponse('0', 'Error al actualizar el ingrediente', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
    VALUES(NEWID(), 'Ingredient/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
    END CATCH
END