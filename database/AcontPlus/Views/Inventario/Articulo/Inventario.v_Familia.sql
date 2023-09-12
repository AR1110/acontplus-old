GO
CREATE OR  ALTER VIEW Inventario.v_Familia
WITH SCHEMABINDING AS (
	SELECT f.idFamilia                  AS idFamilia
            ,f.descripcion              AS descripcion
            ,f.siglas                   AS siglas
            ,f.ActividadEconomicaId     AS actividadEconomicaId
            ,sae.codigo                 AS actividadEconomicaCodigo
    FROM dbo.Familia f                  WITH (NOLOCK)
    INNER JOIN Sri.ActividadEconomica sae WITH (NOLOCK) ON sae.idActividadEconomica = f.ActividadEconomicaId
)
