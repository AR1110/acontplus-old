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
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tipo INT,
			@textSearch VARCHAR(100),
			@sqlQuery NVARCHAR(MAX),
			@params NVARCHAR(MAX)

	
	SET @params = N'@companyId INT,
				   @textSearch VARCHAR(100) '

	SELECT @tipo = tipo, @textSearch = textSearch FROM OPENJSON(@json) WITH(
		tipo INT '$.tipo',
		textSearch VARCHAR(100) '$.textSearch'
	)

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
			FROM Pet.Pet p
				INNER JOIN Customer.Customer c ON p.CustomerId = c.Id
				LEFT JOIN Cliente cc WITH(NOLOCK) ON c.Id = cc.customerId AND cc.idEntidad = @companyId
				LEFT JOIN Pet.Gender g ON p.genderId = g.Id
				LEFT JOIN Pet.PetType pt ON p.petTypeId = pt.Id
				LEFT JOIN Pet.Breed b ON p.breedId = b.Id
			WHERE p.CompanyId = @companyId
			AND p.Deleted IS NULL '


	IF (@tipo = 2)
		BEGIN
			SET @sqlQuery = @sqlQuery + 'AND (
					c.BusinessName LIKE ''%'' + @textSearch + ''%'' OR
					c.IDCard = @textSearch OR
					P.[Name] LIKE ''%'' + @textSearch + ''%''
				)'
		END
	EXEC sp_executesql @sqlQuery, @params, @companyId, @textSearch;
END
GO
