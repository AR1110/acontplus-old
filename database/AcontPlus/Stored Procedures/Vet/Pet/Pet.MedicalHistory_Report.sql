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
CREATE OR ALTER PROCEDURE Pet.MedicalHistory_Report @userRoleId INT
	,@id INT
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;

    DECLARE @dataSources AS TABLE (dsName VARCHAR(50))
    DECLARE @tblParams AS TABLE (
                            paramName VARCHAR(100),
                            isBase64 BIT,
                            paramValue VARBINARY(MAX))

    DECLARE @logoImg VARBINARY(MAX)
    ,@mimeType VARCHAR(20)

	INSERT INTO @dataSources(dsName)
	VALUES	('mainDataSet'),
			('behaviorTests'),
            ('healthChecks')

	SET @tableNames = 'RdlcProps,RdlcDataSources,mainDataSet,behaviorTests,healthChecks,RdlcParams'

	--RdlcProps
	SELECT 'Reports\MedicalHistory.rdl' ReportPath, 'PDF' ReportFormat, 'Historial Clinico' ReportName

	--RdlcDataSources
	SELECT * FROM @dataSources

	--Main DS
		SELECT CASE 
				WHEN [mh].[Age] < 1 THEN CONVERT(VARCHAR, [mh].[Age]) + ' meses' 
				WHEN [mh].[Age] = 1 THEN CONVERT(VARCHAR, [mh].[Age]) + ' año'
				WHEN [mh].[Age] > 1 THEN CONVERT(VARCHAR, [mh].[Age]) + ' años'
				END petAge
		,[p].[Name] petName
		,p.Color petColor
		,p.[Weight] petWeight
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

		--RdlcParams
	DECLARE @petId INT 
	SET @petId = (SELECT PetId FROM Pet.MedicalHistory WITH(NOLOCK) WHERE id = @id)
	SELECT TOP 1 @logoImg = imagen
			,@mimeType = mimeType
	FROM AcontPlus.Config.Estab_Logo WITH(NOLOCK)
	WHERE ruc = (SELECT TOP 1 e.ruc FROM Pet.Pet p WITH(NOLOCK) INNER JOIN Entidad e WITH(NOLOCK) ON p.CompanyId = e.idEntidad WHERE id = @petId)
	ORDER BY idEstab_Logo DESC

    INSERT INTO @tblParams(paramName, isBase64, paramValue)
    VALUES('logo', 1, @logoImg),
        ('mimeType', 0, CONVERT(VARBINARY, @mimeType))

    SELECT * FROM @tblParams
END
GO
