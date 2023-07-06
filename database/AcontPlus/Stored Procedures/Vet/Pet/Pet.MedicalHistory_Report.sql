-- ================================================
-- Template generated from Template Explorer using:
USE AcontplusVet
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-07-02
-- Description:	sp for get report 
-- =============================================
CREATE OR ALTER PROCEDURE Pet.MedicalHistory_Report @id INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT CASE 
				WHEN [p].[Age] < 1 THEN CONVERT(VARCHAR, [p].[Age]) + ' meses' 
				WHEN [p].[Age] = 1 THEN CONVERT(VARCHAR, [p].[Age]) + ' año'
				WHEN [p].[Age] > 1 THEN CONVERT(VARCHAR, [p].[Age]) + ' años'
				END petAge
		,[p].[Name] petName
		,p.Color petColor
		,mh.Observations
		,[b].[Name] petBreed
		,[g].[Name] petGender
		,[mh].[Date]
		,p.ClientUniqueId numeroIdentificacion
	FROM Pet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Pet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Pet.Breed b WITH(NOLOCK) ON p.BreedId = b.Id
		INNER JOIN Pet.Gender g WITH(NOLOCK) ON p.GenderId = g.Id

	WHERE mh.Id = @id

    SELECT [d].[Name] disease
		,[ds].[Name] diseaseStatus
		,CASE WHEN hc.DiseaseStatusId = ds.Id AND hc.DiseaseId = d.Id THEN 'x' ELSE '' END diseaseSelected
	FROM Pet.HealthCheck hc
		INNER JOIN Pet.Disease d WITH(NOLOCK) ON hc.DiseaseId = d.Id
		CROSS JOIN Pet.DiseaseStatus ds
	WHERE hc.MedicalHistoryId = @id


    SELECT [bs].[Name] behaviorStatus
		,[b].[Name] behavior
		,CASE WHEN bt.BehaviorStatusId= bs.Id AND bt.BehaviorId = b.Id THEN 'x' ELSE '' END behaviorSelected
	FROM Pet.BehaviorTest bt  
		INNER JOIN Pet.Behavior b WITH(NOLOCK) ON bt.BehaviorId = b.Id
		CROSS JOIN Pet.BehaviorStatus bs

	WHERE bt.MedicalHistoryId = @id

	DECLARE @petId INT 
	SET @petId = (SELECT PetId FROM Pet.MedicalHistory WHERE id = @id)
	SELECT TOP 1 imagen
		,mimeType
	FROM AcontPlus.Config.Estab_Logo
	WHERE ruc = (SELECT CompanyUniqueId FROM Pet.Pet WHERE id = @petId)
	ORDER BY idEstab_Logo DESC
END
GO
