use AcontPlus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-05-28
-- Description:	sp for stats
-- =============================================
CREATE OR ALTER PROCEDURE Pet.Stats_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tipo INT,
        @companyId INT

    SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
     
	SELECT @tipo = tipo 
        FROM OPENJSON(@json) WITH(
		tipo INT '$.tipo'
	)
     
  
    SET @tableNames = 'totalPetTypes,totalBreeds,totalGenders,'
    
    SELECT  pt.[Name], COUNT(*) total
    FROM Pet.Pet p WITH(NOLOCK)
    INNER JOIN Pet.Breed b ON p.BreedId = b.Id
    INNER JOIN Pet.PetType pt  WITH(NOLOCK) ON b.PetTypeId = pt.Id
    WHERE p.[Enabled] = 1 
        AND p.Deleted IS NULL
        AND p.CompanyId = @companyId
    GROUP BY pt.[Name]
    ORDER BY pt.[Name] ASC
    
    SELECT  b.[Name], COUNT(*) total
    FROM Pet.Pet p  WITH(NOLOCK)
    INNER JOIN Pet.Breed b  WITH(NOLOCK) ON p.BreedId = b.Id
    WHERE p.[Enabled] = 1 
        AND p.Deleted IS NULL
        AND p.CompanyId = @companyId
    GROUP BY b.[Name]
    ORDER BY b.[Name] ASC
    
    SELECT  g.[Name], COUNT(*) total
    FROM Pet.Pet p  WITH(NOLOCK)
    INNER JOIN Pet.Gender g  WITH(NOLOCK) ON p.GenderId = g.Id
    WHERE p.[Enabled] = 1 
        AND p.Deleted IS NULL
        AND p.CompanyId = @companyId
    GROUP BY g.[Name]
END
GO
