USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-21
-- Description:	sp for get series
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Serie_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @tipo INT
	,@brandId INT

	SELECT @brandId = brandId, @tipo = tipo FROM OPENJSON(@json) WITH (brandId INT, tipo INT)

 
	IF (@tipo = 2)
		BEGIN
			SELECT * FROM TechnicalSupport.Serie WITH (NOLOCK) WHERE BrandId = @brandId
		END

END
GO
