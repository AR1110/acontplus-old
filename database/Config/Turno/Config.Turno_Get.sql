USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-08-01
-- Description:	sp for insert company demo steps
-- =============================================
CREATE OR ALTER PROCEDURE Config.Turno_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT  *, COUNT(*) OVER() totalRecords
	FROM dbo.Turno WHERE idEntidad = @idEntidad

END
GO
