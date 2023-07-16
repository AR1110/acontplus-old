-- ================================================
-- Template generated from Template Explorer using:
USE Acontplus
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
		,p.[Weight] petWeight
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
		LEFT JOIN Customer.Customer c WITH(NOLOCK) ON p.CustomerId = c.Id 
	WHERE mh.Id = @id

    SELECT [d].[Name] disease
		,[ds].[Name] diseaseStatus
		,ds.[Order]
		,CASE WHEN hc.DiseaseStatusId = ds.Id AND hc.DiseaseId = d.Id THEN 'x' ELSE '' END diseaseSelected
	FROM Pet.HealthCheck hc
		INNER JOIN Pet.Disease d WITH(NOLOCK) ON hc.DiseaseId = d.Id
		CROSS JOIN Pet.DiseaseStatus ds
	WHERE hc.MedicalHistoryId = @id


    SELECT [bs].[Name] behaviorStatus
		,[b].[Name] behavior
		,bs.[Order]
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
	WHERE ruc = (SELECT TOP 1 e.ruc FROM Pet.Pet p INNER JOIN Entidad e ON p.CompanyId = e.idEntidad WHERE id = @petId)
	ORDER BY idEstab_Logo DESC
END
GO
