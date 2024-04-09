USE Acontplus
GO 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-10-03
-- Description:	SP FOR GET PRODUCTS OF TECHNICAL SUPPORT
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Product_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET @tableNames = 'products'
	SELECT * FROM TechnicalSupport.Product
END
GO
