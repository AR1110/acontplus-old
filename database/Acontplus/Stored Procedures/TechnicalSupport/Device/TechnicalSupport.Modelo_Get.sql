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
CREATE OR ALTER PROCEDURE TechnicalSupport.Modelo_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @tipo INT
	,@brandId INT

	SELECT @brandId = brandId, @tipo = tipo FROM OPENJSON(@json) WITH (brandId INT, tipo INT)

	IF (@tipo = 1)
		BEGIN
			SELECT m.*
				,c.Name CategoryName
				,c.Code CategoryCode
                ,b.[Code] BrandCode
                ,b.[Name] BrandName
			FROM TechnicalSupport.Modelo m WITH (NOLOCK) 
				INNER JOIN TechnicalSupport.Brand b WITH (NOLOCK) ON m.BrandId = b.Id
				INNER JOIN TechnicalSupport.Category c WITH (NOLOCK) ON b.CategoryId = c.Id 
			WHERE m.Deleted IS NULL
		END
	IF (@tipo = 2)
		BEGIN
			SELECT * FROM TechnicalSupport.Modelo WITH (NOLOCK) WHERE brandId = @brandId
		END

END
GO
