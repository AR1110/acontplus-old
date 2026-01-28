USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 02/22/2024
-- Description:	Get for applications
-- =============================================
CREATE OR ALTER PROCEDURE Config.Menu_Get @UserRoleId INT ,@Json VARCHAR(MAX) ,@TableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @Tipo INT,
		@LicenciaId INT,
		@Id INT;
	
	SELECT @Tipo = tipo, @LicenciaId = licenciaId, @Id = id 
	FROM OPENJSON(@Json) WITH (tipo INT, licenciaId INT, id INT)

	--> Get
	IF @Tipo = 1
		BEGIN
			SET @TableNames = 'menus'
			
			SELECT 
				Id,
				AplicacionId,
				Code,
				Icon,
				Name,
				[Order],
				Url,
				IsActive,
				ParentId
			FROM 
				Config.Menu
			WHERE 
				IsDeleted = 0
			ORDER BY 
				[Order], Name;

			RETURN 
		END

	--> Menus for new license access
	IF @Tipo = 3
		BEGIN
			SET @TableNames = 'menus'
				SELECT m.Name menuName
				,m.Id menuId
				,m.[Order]
				,a.[Name] AplicacionName
				,a.Code AplicacionCode
				,a.Id AplicacionId
				,s.[Name] SistemaName
				,s.Code SistemaCode
			FROM Config.Menu m WITH(NOLOCK)
				INNER JOIN Config.Aplicacion a ON m.AplicacionId = a.Id
				INNER JOIN Config.LicenciaDetalle ld ON a.Id = ld.AplicacionId
				INNER JOIN Config.Sistema s ON a.SistemaId = s.Id
			WHERE ld.LicenciaId = @LicenciaId
				AND m.IsDeleted = 0
			ORDER BY a.Id
				,m.Code
				,m.[Order]
		END

	IF @Tipo = 4 AND @Id > 0
		BEGIN
			SET @TableNames = 'menus'
			
			SELECT Id
			      ,AplicacionId
				  ,Code
				  ,Icon
				  ,[Name]
				  ,[Order]
				  ,[Url]
				  ,[IsActive]
			FROM Config.Menu m WITH (NOLOCK)
			WHERE Id = @Id
			ORDER BY Id DESC

			RETURN 
		END


END
GO
