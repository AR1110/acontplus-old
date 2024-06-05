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
DROP PROC IF EXISTS Vet.MedicalHistory_Report
GO
CREATE OR ALTER PROCEDURE Vet.MedicalHistory_Report @userRoleId INT
	,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;

    DECLARE @id INT

    SELECT @id = id FROM OPENJSON (@json) WITH(id INT '$.id')

	SET @tableNames = 'mainDataSet,behaviorTests,healthChecks'

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
		,cc.businessName responsable
		,c.correo email
		,cc.IDCard numeroIdentificacion
		,c.telefono
		,c.direccion
	FROM Vet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Vet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Vet.Breed b WITH(NOLOCK) ON p.BreedId = b.Id
		INNER JOIN Vet.Gender g WITH(NOLOCK) ON p.GenderId = g.Id
		INNER JOIN Vet.PetType pt WITH(NOLOCK) ON b.PetTypeId = pt.Id
		LEFT JOIN dbo.Cliente c WITH(NOLOCK) ON p.CustomerCompanyId = c.idCliente
        LEFT JOIN Customer.Customer cc On c.customerId = cc.Id
        WHERE mh.Id = @id

        --Behavior

    SELECT [bs].[Name] behaviorStatus
		,[b].[Name] behavior
		,bs.[Order]
		,CASE WHEN bt.BehaviorStatusId= bs.Id AND bt.BehaviorId = b.Id THEN 'x' ELSE '' END behaviorSelected
	FROM Vet.BehaviorTest bt WITH(NOLOCK)
		INNER JOIN Vet.Behavior b WITH(NOLOCK) ON bt.BehaviorId = b.Id
		CROSS JOIN Vet.BehaviorStatus bs
	WHERE bt.MedicalHistoryId = @id

	--Diseases
	
    SELECT [d].[Name] disease
		,[ds].[Name] diseaseStatus
		,ds.[Order]
		,CASE WHEN hc.DiseaseStatusId = ds.Id AND hc.DiseaseId = d.Id THEN 'x' ELSE '' END diseaseSelected
	FROM Vet.HealthCheck hc WITH(NOLOCK)
		INNER JOIN Vet.Disease d WITH(NOLOCK) ON hc.DiseaseId = d.Id
		CROSS JOIN Vet.DiseaseStatus ds
	WHERE hc.MedicalHistoryId = @id
END
GO
