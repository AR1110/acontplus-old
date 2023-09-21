USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- Restaurant.Promotion_Get 139, '', ''
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Promotion_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    
    SET @tableNames = 'promotions,days'
	SELECT p.Id
           ,p.CodEstab
           ,p.Description
           ,FORMAT(p.StartDate, 'yyyy-MM-dd')   AS StartDate
           ,FORMAT(p.EndDate, 'yyyy-MM-dd')     AS EndDate
           ,p.PromotionDays
	FROM Restaurant.Promotion p WITH (NOLOCK)

    SELECT * FROM Dia
END
GO