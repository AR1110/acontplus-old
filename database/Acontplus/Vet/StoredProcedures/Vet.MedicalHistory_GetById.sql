USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Autor: Ivan Paz
--Date: 2023-07-14
--Description: SP FOR GET BY
DROP PROC IF EXISTS Pet.MedicalHistory_GetById
GO
CREATE OR ALTER PROCEDURE Vet.MedicalHistory_GetById @id INT
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

    SET @tableNames = 'medicalHistory,healthChecks,behaviors'

	SELECT  mh.[Id]
        ,CONVERT(VARCHAR, FORMAT(mh.[Date], 'yyyy-MM-dd') , 103)as 'Date'
        ,mh.[PetId]
        ,mh.[Observations]
        ,mh.[CreatedAt]
        ,mh.[UpdatedAt]
        ,mh.[Enabled]
        ,mh.[Deleted]
        ,mh.[CodEstab]
        ,mh.[UserId]
        ,mh.[Age]
        ,mh.[Weight]
        ,mh.[EstablecimientoId]
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
	FROM Vet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Vet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Vet.Breed b ON p.BreedId = b.Id
		INNER JOIN Vet.Gender g ON p.GenderId = g.Id
		INNER JOIN Customer.Customer cc ON p.CustomerId = cc.Id
		INNER JOIN Vet.PetType pt ON b.PetTypeId = pt.Id
		LEFT JOIN Cliente c WITH(NOLOCK) ON cc.Id = c.CustomerId AND p.CompanyId = c.idEntidad
	WHERE mh.id = @id
	AND mh.Deleted IS NULL

	SELECT * FROM Vet.HealthCheck WITH(NOLOCK) WHERE MedicalHistoryId = @id

	SELECT * FROM Vet.BehaviorTest WITH(NOLOCK) WHERE MedicalHistoryId = @id

	--Vet.Pet_GetById 3
END