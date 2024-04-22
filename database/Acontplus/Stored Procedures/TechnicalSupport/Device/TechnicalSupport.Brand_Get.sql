USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-18
-- Description:	sp for get brands
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Brand_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @tipo INT
	,@categoryId INT

	SELECT @categoryId = categoryId, @tipo = tipo FROM OPENJSON(@json) WITH (categoryId INT, tipo INT)

	IF (@tipo = 1)
		BEGIN
			SELECT b.*
				,c.Name CategoryName
				,c.Code CategoryCode
                ,series = ISNULL((SELECT s.id, s.code, s.[name], ISNULL(s.[year], 0) as 'year' FROM TechnicalSupport.Serie s WITH (NOLOCK) WHERE s.brandId = b.Id AND s.Deleted IS NULL FOR JSON PATH), '[]')
			FROM TechnicalSupport.Brand b WITH (NOLOCK)
			INNER JOIN TechnicalSupport.Category c WITH (NOLOCK) ON b.CategoryId = c.Id 
			WHERE b.Deleted IS NULL
		END
	IF (@tipo = 2)
		BEGIN
			SELECT * FROM TechnicalSupport.Brand WITH (NOLOCK) WHERE CategoryId = @categoryId
		END

END
GO
