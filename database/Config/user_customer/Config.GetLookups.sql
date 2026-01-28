SELECT Id,
	Code,
	Name
FROM Seguridad.Role
WHERE IsDeleted = 0
	AND IsActive = 1;