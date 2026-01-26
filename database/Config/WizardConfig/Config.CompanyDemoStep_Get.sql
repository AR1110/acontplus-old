USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-07-19
-- Description:	sp for get company demo steps
-- =============================================
CREATE OR ALTER PROCEDURE Config.CompanyDemoStep_Get @userRoleId INT
    ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @uuid UNIQUEIDENTIFIER

    SET @uuid = (SELECT e.Uuid 
                    FROM App.UsuarioRol ur WITH(NOLOCK)
                        INNER JOIN dbo.Entidad e WITH(NOLOCK) ON ur.idEntidad = e.idEntidad
                    WHERE idUsuarioRol = @userRoleId)

    SET @tableNames = 'companyDemoSteps'

    SELECT ds.*
    ,completed = CAST((CASE WHEN ISNULL((SELECT COUNT(*) FROM Config.CompanyDemoStep cds WITH(NOLOCK) 
                                                    WHERE cds.DemoStepId = ds.Id
                                                    AND cds.Uuid = @uuid
                                                    ),0) >= 1 THEN 1 ELSE 0 END) AS BIT)
    FROM Config.DemoStep ds WITH(NOLOCK)
END
GO
