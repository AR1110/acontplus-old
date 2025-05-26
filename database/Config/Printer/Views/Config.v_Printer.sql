USE AcontPlus
GO 
CREATE OR ALTER VIEW Config.v_Printer WITH SCHEMABINDING AS (
	SELECT p.Id
	,p.EstablecimientoId
	,e.estab
	,en.ruc
	,en.razonSocial
	,en.nombreComercial
	,p.[Name]
	,ti.[Code] printerTypeCode
	,ti.[Name] printerTypeName
    ,p.IsActive
	,p.[Enabled]
    ,p.IpAddress
    ,p.Domain
    ,p.UserId
	FROM Config.Printer p WITH(NOLOCK) 
	INNER JOIN Sri.Establecimiento e WITH(NOLOCK)  ON p.EstablecimientoId = e.idEstablecimiento
	INNER JOIN dbo.Entidad en WITH(NOLOCK)  ON e.idEntidad = en.idEntidad
	INNER JOIN Config.PrinterType ti ON p.PrinterTypeId = ti.Id
)