USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Ivan Paz
-- Create date: 2024-08-30
-- Description:	sp for get stats
-- =============================================
CREATE  OR ALTER PROCEDURE Restaurant.Stats_Get @userRoleId INT
	,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT

	SET @idEntidad = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
	
	SET @tableNames = 'orders'

	SELECT COUNT(*) total FROM Restaurant.[Order] o
		INNER JOIN Sri.Establecimiento e ON o.EstablecimientoId = e.idEstablecimiento
	WHERE e.idEntidad = @idEntidad
		AND o.[Enabled] = 1

END
GO
