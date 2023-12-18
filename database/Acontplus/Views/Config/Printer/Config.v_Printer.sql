USE AcontPlus
GO 
CREATE OR ALTER VIEW Config.v_Printer WITH SCHEMABINDING AS (
	SELECT i.Id
	,i.EstablecimientoId
	,e.estab
	,en.ruc
	,en.razonSocial
	,en.nombreComercial
	,i.[Name]
	,ti.[Code] printerTypeCode
	,ti.[Name] printerTypeName
	,i.[Enabled]
	FROM Config.Printer i
	INNER JOIN Sri.Establecimiento e ON i.EstablecimientoId = e.idEstablecimiento
	INNER JOIN dbo.Entidad en ON e.ruc = en.ruc
	INNER JOIN Config.PrinterType ti ON i.PrinterTypeId = ti.Id
)