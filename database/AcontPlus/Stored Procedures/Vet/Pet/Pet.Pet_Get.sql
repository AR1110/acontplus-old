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
			@textSearch VARCHAR(100)

	SELECT @tipo = tipo, @textSearch = textSearch FROM OPENJSON(@json) WITH(
		tipo INT '$.tipo',
		textSearch VARCHAR(100) '$.textSearch'
	)

	IF (@tipo = 2)
		BEGIN

			SELECT p.Id, p.Name, p.Age, p.Color
				,c.businessName customer
				,c.IDCard customerIdCard
				,c.email
			FROM Pet.Pet p
				INNER JOIN Customer.Customer c ON p.CustomerId = c.Id
			WHERE p.CompanyId = @companyId
				AND (
					c.BusinessName LIKE '%' + @textSearch + '%' OR
					c.IDCard = @textSearch OR
					P.[Name] LIKE '%' + @textSearch + '%'
				)
		END
END
GO
