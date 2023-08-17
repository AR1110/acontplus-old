GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
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
            ,@productId INT

    IF ISJSON(@json) = 0
        BEGIN
            SELECT dbo.ufn_spresponse('0', 'Formato incorrecto', NULL)
            RETURN
        END

    SELECT @itemJson                = itemJson
            ,@productionAreaJson    = productionAreaJson
    FROM OPENJSON(@json) 
    WITH (itemJson NVARCHAR(MAX) '$.itemJson' AS JSON, productionAreaJson NVARCHAR(MAX) '$.productionAreaJson' AS JSON)

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