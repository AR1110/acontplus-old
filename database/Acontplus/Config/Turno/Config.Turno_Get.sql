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

	SET @idEntidad = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)

	SELECT  *, COUNT(*) totalRecords
	FROM dbo.Turno WHERE idEntidad = @idEntidad

END
GO
