-- ================================================
-- Template generated from Template Explorer using:
USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-07-02
-- Description:	sp for get report 
-- =============================================
CREATE OR ALTER PROCEDURE Pet.MedicalHistory_Report @userRoleId INT
	,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;

    DECLARE @id INT

    SELECT @id = id FROM OPENJSON (@json) WITH(id INT '$.id')

	SET @tableNames = 'mainDataSet,healthChecks,behaviorTests'

	--Main DS
		SELECT CASE 
				WHEN [mh].[Age] < 1 THEN CONVERT(VARCHAR, [mh].[Age]) + ' meses' 
				WHEN [mh].[Age] = 1 THEN CONVERT(VARCHAR, [mh].[Age]) + ' año'
				WHEN [mh].[Age] > 1 THEN CONVERT(VARCHAR, [mh].[Age]) + ' años'
				END petAge
		,[p].[Name] petName
		,p.Color petColor
		,mh.[Weight] petWeight
		,pt.[Name] petType
		,mh.Observations
		,[b].[Name] petBreed
		,[g].[Name] petGender
		,[mh].[Date]
		,c.businessName responsable
		,c.email
		,c.IDCard numeroIdentificacion
		,c.Telephone telefono
		,c.[address] direccion
	FROM Pet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Pet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Pet.Breed b WITH(NOLOCK) ON p.BreedId = b.Id
		INNER JOIN Pet.Gender g WITH(NOLOCK) ON p.GenderId = g.Id
		INNER JOIN Pet.PetType pt WITH(NOLOCK) ON p.PetTypeId = pt.Id
		LEFT JOIN Customer.Customer c WITH(NOLOCK) ON p.CustomerId = c.Id 
	WHERE mh.Id = @id

	--Diseases
	
    SELECT [d].[Name] disease
		,[ds].[Name] diseaseStatus
		,ds.[Order]
		,CASE WHEN hc.DiseaseStatusId = ds.Id AND hc.DiseaseId = d.Id THEN 'x' ELSE '' END diseaseSelected
	FROM Pet.HealthCheck hc WITH(NOLOCK)
		INNER JOIN Pet.Disease d WITH(NOLOCK) ON hc.DiseaseId = d.Id
		CROSS JOIN Pet.DiseaseStatus ds
	WHERE hc.MedicalHistoryId = @id

    --Behavior

    SELECT [bs].[Name] behaviorStatus
		,[b].[Name] behavior
		,bs.[Order]
		,CASE WHEN bt.BehaviorStatusId= bs.Id AND bt.BehaviorId = b.Id THEN 'x' ELSE '' END behaviorSelected
	FROM Pet.BehaviorTest bt WITH(NOLOCK)
		INNER JOIN Pet.Behavior b WITH(NOLOCK) ON bt.BehaviorId = b.Id
		CROSS JOIN Pet.BehaviorStatus bs
	WHERE bt.MedicalHistoryId = @id
END
GO
