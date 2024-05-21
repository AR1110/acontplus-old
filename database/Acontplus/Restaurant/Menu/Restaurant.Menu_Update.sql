USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2023-13-10
-- Description: sp for update restaurant menus
-- Restaurant.Menu_Update 139, 2, '{"id":2,"productId":77502,"title":"COMBO POLLO AHUMADO","summary":"COMBO POLLO AHUMADO - TESTING","menuTypeId":2,"content":"DATOS DE PRUEBA - TEST HOLAS","createdAt":"2023-09-07T16:22:38.2166667","updatedAt":null,"enabled":true,"deleted":false,"userId":115,"startDate":null,"endDate":null,"s3ObjectUrl":"https://acontplus.s3.us-east-2.amazonaws.com/0703885640001/articulos/10b599ba-39ee-4b7b-9a88-c7a12d7f67dc.png","menuItems":[{"id":2,"itemId":30,"productId":77509,"costPrice":2.6,"descripcion":"PLATO DE POLLO","menuId":2,"quantity":2,"percentageDiscount":12,"total":0},{"id":3,"itemId":24,"productId":77503,"costPrice":6.2,"descripcion":"PORCION PAPAS FRITAS","menuId":2,"quantity":3,"percentageDiscount":2,"total":0}]}'
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Menu_Update
@userRoleId INT
,@id        INT
,@json      NVARCHAR(MAX) 
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;
        
    DECLARE @title          VARCHAR(500)
            ,@menuTypeId    INT
            ,@summary       VARCHAR(MAX)
            ,@content       VARCHAR(MAX)
            ,@menuItem      NVARCHAR(MAX)
            ,@startDate     DATETIME2
            ,@endDate       DATETIME2
            ,@response      VARCHAR(300)
            ,@promotionDays NVARCHAR(MAX)
            ,@forPromotion  BIT
               
   SELECT @title            = title
          ,@menuTypeId      = menuTypeId
          ,@summary         = summary
          ,@content         = content          
          ,@startDate       = startDate
          ,@endDate         = endDate
          ,@promotionDays   = promotionDays
          ,@menuItem        = menuItem
          ,@forPromotion    = forPromotion
   FROM OPENJSON(@json)
   WITH(
    title           VARCHAR(500)    '$.title'
    ,menuTypeId     INT             '$.menuTypeId'
    ,summary        VARCHAR(500)    '$.summary'
    ,content        VARCHAR(MAX)    '$.content'
    ,startDate      DATETIME2       '$.startDate'
    ,endDate        DATETIME2       '$.endDate'
    ,promotionDays  NVARCHAR(MAX)   '$.promotionDays'
    ,menuItem       NVARCHAR(MAX)   '$.menuItems' AS JSON
    ,forPromotion   BIT             '$.forPromotion'
   )
            
   BEGIN TRY
        BEGIN TRAN
            ---- UPDATE Menu ----
            UPDATE Restaurant.Menu
            SET Title           = @title
                ,MenuTypeId     = @menuTypeId
                ,Summary        = @summary
                ,Content        = @content
                ,ForPromotion   = ISNULL(@forPromotion, 0)
            WHERE Id = @id
                      
            --- Execute for insert Menu_Item ---           
            EXEC Restaurant.MenuItem_Insert @userRoleId, @id, @menuItem, @response OUTPUT
                                             
        COMMIT TRAN
        SELECT Common.ufnSpResponse('1', 'Éxitos al actualizar', NULL)
   END TRY
   BEGIN CATCH
        SELECT Common.ufnSpResponse('0', 'Error al actualizar el Menu', NULL)
        
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES(NEWID(), 'Menu/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userRoleId)
   END CATCH
END
GO
