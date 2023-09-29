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
-- Create date: 2022-07-06
-- Description:	sp for get medical histories
-- =============================================
CREATE OR ALTER PROCEDURE Pet.MedicalHistory_Get @userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @companyId INT,
			@codEstab VARCHAR(15)

	SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
	SELECT @codEstab = codEstab FROM OPENJSON(@json) WITH(
		codEstab VARCHAR(15) '$.codEstab'
	)

	SELECT mh.Id
        ,mh.Observations
        ,mh.Age
        ,mh.[Weight]
        ,p.[Name] petName
        ,p.Color
		,c.businessName customer
		,[mh].[Date]
	FROM Pet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Pet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Customer.Customer c WITH(NOLOCK) ON p.CustomerId = c.Id
	WHERE p.CompanyId = @companyId
	    AND mh.codEstab = @codEstab
	    AND mh.Deleted is null
END
GO
