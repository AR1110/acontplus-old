USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-09-08
-- Description:	sp for get menu items
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.MenuItem_Get @userRoleId INT
	,@json VARCHAR(MAX)
    ,@tableNames varchar(max) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @menuId INT

	SELECT @menuId = menuId FROM OPENJSON (@json) WITH (menuId INT '$.menuId')

    SET @tableNames = 'menus'
	SELECT mi.*
        , i.productName [description] 
    FROM Restaurant.MenuItem mi WITH (NOLOCK)
    INNER JOIN Restaurant.v_Item i ON mi.ItemId = i.Id
    WHERE MenuId = @menuId
END
GO
