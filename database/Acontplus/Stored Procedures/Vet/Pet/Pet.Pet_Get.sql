use AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-07-07
-- Description:	sp for search pets
-- =============================================
CREATE OR ALTER PROCEDURE Pet.Pet_Get @companyId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tipo INT,
			@textSearch VARCHAR(100),
			@sqlQuery NVARCHAR(MAX),
			@params NVARCHAR(MAX), 
            @pageIndex INT,
            @pageSize INT 

	
	SET @params = N'@companyId INT,
				   @textSearch VARCHAR(100), @pageIndex INT, @pageSize INT '

	SELECT @tipo = tipo, @textSearch = textSearch,@pageIndex = pageIndex
        ,@pageSize = pageSize
        FROM OPENJSON(@json) WITH(
		tipo INT '$.tipo',
          pageIndex		    INT         '$.pageIndex',
		                       pageSize		    INT         '$.pageSize',
		textSearch VARCHAR(100) '$.textSearch'
	)

    IF (@tipo = 3)
        BEGIN

            SET @tableNames = 'totalPetTypes,totalBreeds,totalGenders'

            SELECT  pt.[Name], COUNT(*) total
            FROM Pet.Pet p WITH(NOLOCK)
            INNER JOIN Pet.PetType pt  WITH(NOLOCK) ON p.PetTypeId = pt.Id
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
            RETURN
    END

	SET @sqlQuery = N'SELECT p.Id
				,p.[Name]
				,p.Age
				,p.Color
				,p.[Enabled]
				,p.CompanyId
				,p.PetTypeId
				,p.BreedId
				,p.GenderId
				,p.Weight
				,g.[Name] gender
				,pt.[Name] petType
				,b.[Name] breed
				,c.id customerId
				,c.businessName customer
				,c.IDCard customerIdCard
				,cc.correo email
                ,totalRecords = COUNT(*) over()
			FROM Pet.Pet p  WITH(NOLOCK)
				INNER JOIN Customer.Customer c  WITH(NOLOCK) ON p.CustomerId = c.Id
				LEFT JOIN Cliente cc WITH(NOLOCK) ON c.Id = cc.customerId AND cc.idEntidad = @companyId
				LEFT JOIN Pet.Gender g  WITH(NOLOCK) ON p.genderId = g.Id
				LEFT JOIN Pet.PetType pt  WITH(NOLOCK) ON p.petTypeId = pt.Id
				LEFT JOIN Pet.Breed b  WITH(NOLOCK) ON p.breedId = b.Id
			WHERE p.CompanyId = @companyId
			AND p.Deleted IS NULL '


    SET @tableNames = 'pets'
	IF (@tipo = 2)
		BEGIN
			SET @sqlQuery = @sqlQuery + 'AND (
					c.BusinessName LIKE ''%'' + @textSearch + ''%'' OR
					c.IDCard = @textSearch OR
					P.[Name] LIKE ''%'' + @textSearch + ''%''
				)'
		END



    SET @sqlQuery = @sqlQuery + ' ORDER BY p.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'

	EXEC sp_executesql @sqlQuery, @params, @companyId, @textSearch, @pageIndex
                                ,@pageSize;
END
GO
