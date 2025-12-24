SELECT 
    o.name AS ObjectName,
    o.type_desc AS ObjectType,
    CASE 
        WHEN o.type = 'U' THEN 'Table'
        WHEN o.type = 'P' THEN 'Stored Procedure'
        WHEN o.type = 'V' THEN 'View'
        WHEN o.type = 'FN' THEN 'Function'
        WHEN o.type = 'TR' THEN 'Trigger'
        ELSE o.type_desc
    END AS ObjectTypeDescription,
    o.create_date,
    o.modify_date
FROM sys.objects o
WHERE o.schema_id = SCHEMA_ID('ReporteIngresos')
ORDER BY o.type_desc, o.name;

--SELECT * FROM Config.Reporte where storedProcedure like '%Ingreso%'