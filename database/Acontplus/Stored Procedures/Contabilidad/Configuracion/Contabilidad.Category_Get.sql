USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Author: Ivan Paz
--Date: 2024-05-08
--Description: Sp for get categories
CREATE OR ALTER PROCEDURE Contabilidad.Category_Get @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @tipo AS INT 
	DECLARE @companyId AS INT

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	SELECT TOP 1 @companyId = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	-- ====================== LISTA DE GESTION PRINCIPAL ===============================================
	IF @tipo = 1
		BEGIN
            SET @tableNames = 'categories'
			SELECT c.*
                ,t.Name TipoName
            FROM Contabilidad.Category c WITH (NOLOCK) 
                INNER JOIN Contabilidad.Tipo t WITH (NOLOCK)  ON c.TipoId = t.Id
            WHERE c.Deleted IS NULL
			RETURN 
		END 

	IF @tipo = 2
		BEGIN
            SET @tableNames = 'tipos'
			SELECT * FROM Contabilidad.Tipo WITH (NOLOCK) WHERE [Enabled] = 1 
 
			RETURN
		END 

	--IF @tipo = 3 
	--	BEGIN
			
	--	END 

END
