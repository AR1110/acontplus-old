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
DROP PROC IF EXISTS Pet.Stats_Get
GO
CREATE OR ALTER PROCEDURE Vet.Stats_Get @userRoleId INT
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
    FROM Vet.Pet p WITH(NOLOCK)
    INNER JOIN Vet.Breed b ON p.BreedId = b.Id
    INNER JOIN Vet.PetType pt  WITH(NOLOCK) ON b.PetTypeId = pt.Id
    INNER JOIN dbo.Cliente c On p.customerCompanyId = c.idCliente
    WHERE p.[IsActive] = 1 
        AND p.IsDeleted = CAST(0 AS BIT)
        AND c.idEntidad = @companyId
    GROUP BY pt.[Name]
    ORDER BY pt.[Name] ASC
    
    SELECT  b.[Name], COUNT(*) total
    FROM Vet.Pet p  WITH(NOLOCK)
    INNER JOIN Vet.Breed b  WITH(NOLOCK) ON p.BreedId = b.Id
     INNER JOIN dbo.Cliente c On p.customerCompanyId = c.idCliente
    WHERE p.[IsActive] = 1 
        AND p.IsDeleted = CAST(0 AS BIT)
        AND c.idEntidad = @companyId
    GROUP BY b.[Name]
    ORDER BY b.[Name] ASC
    
    SELECT  g.[Name], COUNT(*) total
    FROM Vet.Pet p  WITH(NOLOCK)
    INNER JOIN Vet.Gender g  WITH(NOLOCK) ON p.GenderId = g.Id
     INNER JOIN dbo.Cliente c On p.customerCompanyId = c.idCliente
    WHERE p.[IsActive] = 1 
        AND p.IsDeleted = CAST(0 AS BIT)
        AND c.idEntidad = @companyId
    GROUP BY g.[Name]
END
GO
