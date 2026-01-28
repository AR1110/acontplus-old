--USE Acontplus
--GO
--SELECT * FROM Common.WhatsAppMessage --group by users from record date 2025
 
--SELECT * FROM App.UsuarioRol ---get identidad from users in whatsapp message records


--SELECT * FROM Entidad --get uuid from identidad of users 

--select*  from config.company ---uuid in entidad

--select * from sales.suscripcion ---companyid from company admin
----from last 2025 years
--select * from Sales.SuscripcionDetalle ---get licence type

--select * from config.licensetype ---kind of license

---- Created by GitHub Copilot in SSMS - review carefully before executing
-- Detalle por empresa y tipo de suscripci�n
;WITH MessagesByCompany AS (
    SELECT 
        c.Id AS CompanyId,
        c.BusinessName AS Empresa,
        c.IdCard AS RUC,
        COUNT(wam.Id) AS TotalMensajes
    FROM Common.WhatsAppMessage wam
    INNER JOIN App.UsuarioRol ur ON wam.UserId = ur.idUsuario
    INNER JOIN dbo.Entidad e ON ur.idEntidad = e.idEntidad
    INNER JOIN config.company c ON e.Uuid = c.Uuid
    WHERE YEAR(wam.CreatedAt) = 2025
        AND wam.IsDeleted = 0
        AND wam.IsActive = 1
    GROUP BY c.Id, c.BusinessName, c.IdCard
),
ActiveSubscriptions AS (
    SELECT DISTINCT
        s.CompanyId,
        lt.Name AS TipoSuscripcion,
        lt.Code AS CodigoLicencia
    FROM sales.suscripcion s
    INNER JOIN Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
    INNER JOIN config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
    INNER JOIN config.Licencia l ON ld.LicenciaId = l.Id
    INNER JOIN config.licensetype lt ON l.LicenseTypeId = lt.Id
    WHERE s.IsDeleted = 0
        AND s.IsActive = 1
        AND YEAR(s.StartDate) <= 2025 
        AND YEAR(s.EndDate) >= 2025
)
SELECT 
    mbc.Empresa,
    mbc.RUC,
    ISNULL(STRING_AGG(asub.TipoSuscripcion, ', '), 'Sin Suscripci�n') AS TiposSuscripcion,
    ISNULL(STRING_AGG(asub.CodigoLicencia, ', '), 'N/A') AS CodigosLicencia,
    mbc.TotalMensajes
FROM MessagesByCompany mbc
LEFT JOIN ActiveSubscriptions asub ON mbc.CompanyId = asub.CompanyId
GROUP BY mbc.Empresa, mbc.RUC, mbc.TotalMensajes
ORDER BY mbc.TotalMensajes DESC;
-- Created by GitHub Copilot in SSMS - review carefully before executing
-- Resumen agregado por tipo de suscripci�n
WITH MessagesByCompany AS (
    SELECT 
        c.Id AS CompanyId,
        COUNT(wam.Id) AS TotalMensajes
    FROM Common.WhatsAppMessage wam
    INNER JOIN App.UsuarioRol ur ON wam.UserId = ur.idUsuario
    INNER JOIN dbo.Entidad e ON ur.idEntidad = e.idEntidad
    INNER JOIN config.company c ON e.Uuid = c.Uuid
    WHERE YEAR(wam.CreatedAt) = 2025
        AND wam.IsDeleted = 0
        AND wam.IsActive = 1
    GROUP BY c.Id
),
CompanySubscriptions AS (
    SELECT DISTINCT
        s.CompanyId,
        lt.Name AS TipoSuscripcion
    FROM sales.suscripcion s
    INNER JOIN Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
    INNER JOIN config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
    INNER JOIN config.Licencia l ON ld.LicenciaId = l.Id
    INNER JOIN config.licensetype lt ON l.LicenseTypeId = lt.Id
    WHERE s.IsDeleted = 0
        AND s.IsActive = 1
        AND YEAR(s.StartDate) <= 2025 
        AND YEAR(s.EndDate) >= 2025
)
SELECT 
    ISNULL(cs.TipoSuscripcion, 'Sin Suscripci�n') AS TipoSuscripcion,
    COUNT(DISTINCT mbc.CompanyId) AS NumeroEmpresas,
    SUM(mbc.TotalMensajes) AS TotalMensajes,
    AVG(mbc.TotalMensajes) AS PromedioMensajes,
    MAX(mbc.TotalMensajes) AS MaximoMensajes,
    MIN(mbc.TotalMensajes) AS MinimoMensajes
FROM MessagesByCompany mbc
LEFT JOIN CompanySubscriptions cs ON mbc.CompanyId = cs.CompanyId
GROUP BY cs.TipoSuscripcion
ORDER BY TotalMensajes DESC;