USE Acontplus
GO

-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-11-06
-- Description:	sp for get releases
-- =============================================
CREATE OR ALTER PROCEDURE Common.Release_Get @UserRoleId INT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @User VARCHAR(100);

    SET @User = (SELECT TOP 1 nombreUsuario FROM dbo.v_usuario WHERE idUsuarioRol = @UserRoleId)

     SELECT id
		,r.title
		,r.logoutRequired
		,r.version
        ,r.CompressedContent
		,CONVERT(VARCHAR, FORMAT(ReleaseDate, 'dd/MM/yyyy')) AS releaseDate
     FROM Common.Release r WITH (NOLOCK)
     WHERE r.Id NOT IN (SELECT ReleaseId FROM Common.UserReleaseRead WHERE CreatedBy = @User)
		AND r.IsDeleted = CAST(0 AS BIT)
END
GO
