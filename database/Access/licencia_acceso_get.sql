USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-02-26
-- Description:	sp for get menu-access
-- =============================================
--- Seguridad.LicenciaAcceso_Get 0, '{"id":3,"IsActive":true,"deleted":null,"licenciaId":1,"licenseTypeId":1,"licenseType":"Lite","roleId":3,"name":"ADMINISTRADOR","tipo":3}', ''
CREATE OR ALTER PROCEDURE Seguridad.LicenciaAcceso_Get @UserRoleId INT
,@Json VARCHAR(MAX)
,@TableNames VARCHAR(500) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @Tipo INT
		,@LicenciaId INT
		,@Id INT

	SELECT @Tipo = tipo
		,@LicenciaId = licenciaId
		,@Id = id
	FROM OPENJSON(@Json) 
		WITH (
			licenciaId INT,
			id INT,
			tipo INT
		)

		print convert(varchar, @Id)
	IF (@Tipo = 1)
		BEGIN
			SET @TableNames = 'accesses'

			SELECT sm.Id
				,sm.[IsActive]
				,sm.IsDeleted
				,sm.LicenciaId
				--,a.SistemaId
				,cl.LicenseTypeId
				--,cs.[Name]	   AS [System]
				,clt.[Name]   AS LicenseType
				,sm.RoleId
				,sr.[Name]
			FROM Seguridad.LicenciaAcceso sm	  WITH(NOLOCK)
			INNER JOIN Config.Licencia cl     WITH(NOLOCK) ON cl.Id  = sm.LicenciaId
			INNER JOIN Config.LicenseType clt WITH(NOLOCK) ON clt.Id = cl.LicenseTypeId
			INNER JOIN Seguridad.[Role] sr    WITH(NOLOCK) ON sr.Id  = sm.RoleId
			WHERE sm.IsDeleted = CAST(0 AS BIT)
			ORDER BY clt.Id
				,sr.Code
		END
	IF (@Tipo = 2)
		BEGIN
			SET @TableNames = 'licenses,roles,menus,accesses'
			SELECT l.*
				,lt.Code licenseTypeCode
				,lt.[Name] licenseType
			FROM Config.Licencia l WITH(NOLOCK)
				INNER JOIN Config.LicenseType lt WITH(NOLOCK) ON l.LicenseTypeId = lt.Id
			WHERE l.IsDeleted = CAST(0 AS BIT)

			SELECT * FROM Seguridad.[Role] WITH(NOLOCK)
			WHERE IsDeleted = CAST(0 AS BIT)

			SELECT Id = 0
				,@Id licenciaAccesoId
				,m.Id MenuId
				,m.[Order]
				,m.[Name] MenuName
				,m.Code MenuCode
				,a.[Name] AplicacionName
				,a.Code AplicacionCode
				,a.Id AplicacionId
				,s.[Name] SistemaName
				,s.Code SistemaCode
			FROM Config.Menu m
				INNER JOIN Config.Aplicacion a ON m.AplicacionId = a.Id
				INNER JOIN Config.LicenciaDetalle ld ON a.Id = ld.AplicacionId
				INNER JOIN Config.Sistema s ON a.SistemaId = s.Id
			WHERE ld.LicenciaId = @LicenciaId
			ORDER BY a.Id
				,m.Code
				,m.[Order]

			SELECT lad.id
					, lad.LicenciaAccesoId as licenciaAccesoId
					, lad.[Order] as [order]
					,m.Id as menuId
					,m.[name] submenuName
					,m.[url]
					, ISNULL(lad.Actions, '[]') as 'actions'
					,m.AplicacionId
					,m.Code MenuCode
					,m.[Name] MenuName
					,a.[Code] AplicacionCode
					,a.[Name] AplicacionName
            FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)
            INNER JOIN Config.Menu m WITH (NOLOCK) ON lad.MenuId = m.Id
			INNER JOIN Config.Aplicacion a WITH (NOLOCK) ON m.AplicacionId = a.Id
            WHERE lad.LicenciaAccesoId = @Id
			AND lad.IsDeleted = CAST(0 AS BIT)
		END
END
GO
