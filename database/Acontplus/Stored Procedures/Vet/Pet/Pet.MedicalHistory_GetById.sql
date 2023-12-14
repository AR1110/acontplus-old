USE Acontplus
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Autor: Ivan Paz
--Date: 2023-07-14
--Description: SP FOR GET BY
CREATE OR ALTER PROCEDURE Pet.MedicalHistory_GetById @id INT
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

    SET @tableNames = 'medicalHistory,healthChecks,behaviors'

	SELECT mh.*
		,p.Id petId
		,p.[Name]
		,p.Color
		,pt.[Name] pettype
		,b.[Name] breed
		,g.[Name] gender
		,cc.BusinessName
		,cc.IDCard
		,cc.Email
		,cc.[Address]
	FROM Pet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Pet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Pet.Breed b ON p.BreedId = b.Id
		INNER JOIN Pet.Gender g ON p.GenderId = g.Id
		INNER JOIN Customer.Customer cc ON p.CustomerId = cc.Id
		INNER JOIN Pet.PetType pt ON p.PetTypeId = pt.Id
		LEFT JOIN Cliente c WITH(NOLOCK) ON cc.Id = c.CustomerId AND p.CompanyId = c.idEntidad
	WHERE mh.id = @id
	AND mh.Deleted IS NULL

	SELECT * FROM Pet.HealthCheck WITH(NOLOCK) WHERE MedicalHistoryId = @id

	SELECT * FROM Pet.BehaviorTest WITH(NOLOCK) WHERE MedicalHistoryId = @id

	--Pet.Pet_GetById 3
END