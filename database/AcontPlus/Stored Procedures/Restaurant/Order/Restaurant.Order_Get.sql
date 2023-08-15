SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-14
-- Description:	sp for get order restaurant
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Order_Get @userRoleId INT
,@json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	SELECT * FROM Restaurant.[Order]

END
GO
