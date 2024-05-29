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
CREATE OR ALTER PROCEDURE Pet.Stats_Get @companyId INT
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

    IF (@tipo = 4)
        BEGIN
            SET @tableNames = 'petTypes,breeds,genders'
            SELECT * FROM Pet.PetType WITH (NOLOCK) WHERE Deleted IS NULL AND Enabled = 1
            SELECT * FROM Pet.Breed WITH (NOLOCK) WHERE Deleted IS NULL  AND Enabled = 1
            SELECT * FROM Pet.Gender WITH (NOLOCK) WHERE Deleted IS NULL  AND Enabled = 1
            RETURN
        END


  
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

	SET @sqlQuery = N'SELECT p.Id
				,p.[Name]
				,Age = ISNULL((SELECT TOP 1 Age FROM Pet.MedicalHistory mh  WITH(NOLOCK) WHERE mh.PetId = p.Id AND Enabled = 1 ORDER by mh.Id desc), 0)
				,p.Color
				,p.[Enabled]
				,p.CompanyId
				,b.PetTypeId
				,p.BreedId
				,p.GenderId
				,p.CustomerCompanyId
				,ISNULL((SELECT TOP 1 mh.[Weight] FROM Pet.MedicalHistory mh WITH(NOLOCK) WHERE mh.PetId = p.Id AND Enabled = 1 ORDER by mh.Id desc), 0)  as ''Weight''
				,g.[Name] gender
				,pt.[Name] petType
				,b.[Name] breed
				,c.id customerId
				,c.businessName customer
				,c.IDCard customerIdCard
				,cc.correo email
                ,ISNULL(CONVERT(VARCHAR, FORMAT(p.Birthdate, ''yyyy-MM-dd''), 106), '''') Birthdate
                ,totalRecords = COUNT(*) over()
			FROM Pet.Pet p  WITH(NOLOCK)
				INNER JOIN Cliente cc WITH(NOLOCK) ON p.CustomerCompanyId = cc.idcliente
				INNER JOIN Customer.Customer c  WITH(NOLOCK) ON cc.CustomerId = c.Id 
				INNER JOIN Pet.Breed b ON p.BreedId = b.Id
				LEFT JOIN Pet.Gender g  WITH(NOLOCK) ON p.genderId = g.Id
				LEFT JOIN Pet.PetType pt  WITH(NOLOCK) ON b.petTypeId = pt.Id
			WHERE p.CompanyId = @companyId
			AND p.Deleted IS NULL '


    SET @tableNames = @tableNames + 'pets'
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
