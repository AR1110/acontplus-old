USE Acontplus
GO
CREATE OR ALTER VIEW Seguridad.vw_LicenciaAcceso WITH SCHEMABINDING AS (
SELECT la.[Id], [LicenciaId], [RoleId], la.[CreatedAt], la.[UpdatedAt]
	,la.IsActive
	,la.IsDeleted
	,la.CreatedByUserId
	,l.Code LicenseCode
	,lt.[Name] LicenseType
FROM Seguridad.LicenciaAcceso la WITH (NOLOCK)
	INNER JOIN Config.Licencia l WITH (NOLOCK) ON la.LicenciaId = l.Id
	INNER JOIN Config.LicenseType lt WITH (NOLOCK) ON l.LicenseTypeId = lt.Id
)