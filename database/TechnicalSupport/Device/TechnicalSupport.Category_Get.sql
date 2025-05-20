USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-05-01
-- Description:	sp for get categories
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Category_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @tipo INT
        ,@companyId INT
    SET @companyId = (SELECT idEntidad FROM v_Usuario WHERE idUsuarioRol = @userRoleId)
	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

	SELECT * FROM TechnicalSupport.Category WITH (NOLOCK) WHERE CompanyId = @companyId AND Deleted IS NULL

END
GO
