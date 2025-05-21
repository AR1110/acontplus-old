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
CREATE OR ALTER PROCEDURE Common.Release_Get @userRoleId INT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @userId INT

    SET @userId = (SELECT TOP 1 idUsuario FROM dbo.v_usuario WHERE idUsuarioRol = @userRoleId)

     SELECT id
		,r.title
		,r.logoutRequired
		,r.version
        ,r.CompressedContent
		,CONVERT(VARCHAR, FORMAT(ReleaseDate, 'dd/MM/yyyy')) AS releaseDate
     FROM AcontplusAdmin.Common.Release r WITH (NOLOCK)
     WHERE r.Id NOT IN (SELECT ReleaseId FROM AcontplusAdmin.Common.UserReleaseRead WHERE UserId = @userId)
		AND r.Deleted IS NULL
END
GO
