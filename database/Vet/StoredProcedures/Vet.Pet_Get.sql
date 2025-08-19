use AcontPlus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-07-07
-- Description:	sp for search pets
-- =============================================
DROP PROC IF EXISTS Pet.Pet_Get
GO
CREATE OR ALTER PROCEDURE Vet.Pet_Get @userRoleId INT
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
            @pageSize INT,
            @companyId INT

    SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
	
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
            SET @tableNames = 'petTypes,breeds,genders'
            SELECT * FROM Vet.PetType WITH (NOLOCK) WHERE IsDeleted = CAST(0 AS BIT) AND IsActive = 1
            SELECT * FROM Vet.Breed WITH (NOLOCK) WHERE IsDeleted = CAST(0 AS BIT)  AND IsActive = 1
            SELECT * FROM Vet.Gender WITH (NOLOCK) WHERE IsDeleted = CAST(0 AS BIT)  AND IsActive = 1
            RETURN
        END
     
     SET @tableNames = 'pets'


	SET @sqlQuery = N'SELECT p.Id
				,p.[Name]
				,Age = ISNULL((SELECT TOP 1 Age FROM Vet.MedicalHistory mh  WITH(NOLOCK) WHERE mh.PetId = p.Id AND IsActive = 1 ORDER by mh.Id desc), 0)
				,p.Color
				,p.[IsActive]
				,cc.idEntidad CompanyId
				,b.PetTypeId
				,p.BreedId
				,p.GenderId
				,p.CustomerCompanyId
				,ISNULL((SELECT TOP 1 mh.[Weight] FROM Vet.MedicalHistory mh WITH(NOLOCK) WHERE mh.PetId = p.Id AND IsActive = 1 ORDER by mh.Id desc), 0)  as ''Weight''
				,g.[Name] gender
				,pt.[Name] petType
				,b.[Name] breed
				,c.id customerId
				,c.businessName customer
				,c.IDCard customerIdCard
				,cc.correo email
                ,ISNULL(CONVERT(VARCHAR, FORMAT(p.Birthdate, ''yyyy-MM-dd''), 106), '''') Birthdate
                ,totalRecords = COUNT(*) over()
			FROM Vet.Pet p  WITH(NOLOCK)
				INNER JOIN Cliente cc WITH(NOLOCK) ON p.CustomerCompanyId = cc.idcliente
				INNER JOIN Customer.Customer c  WITH(NOLOCK) ON cc.CustomerId = c.Id 
				INNER JOIN Vet.Breed b ON p.BreedId = b.Id
				LEFT JOIN Vet.Gender g  WITH(NOLOCK) ON p.genderId = g.Id
				LEFT JOIN Vet.PetType pt  WITH(NOLOCK) ON b.petTypeId = pt.Id
			WHERE cc.idEntidad = @companyId
			AND p.IsDeleted = CAST(0 AS BIT) '


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
