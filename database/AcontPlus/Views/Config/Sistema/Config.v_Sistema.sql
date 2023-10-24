USE Acontplus
GO
CREATE OR ALTER VIEW Config.v_Sistema WITH SCHEMABINDING AS (

	SELECT cs.idEntidad
        ,cs.codConfig
		,CASE WHEN cs.codConfig = 'CI' THEN
				CAST(IIF(JSON_VALUE((REPLACE((REPLACE(cs.jsonConfig,'[','')),']','')),'$.llevaInventario')=  'SI', '1','0') AS bit) END inventario
	FROM Config.Sistema cs
		INNER JOIN dbo.Entidad e WITH (NOLOCK) ON cs.idEntidad = e.idEntidad 
	--WHERE e.idEntidad = 111
	--AND cs.codConfig = 'CI'
)