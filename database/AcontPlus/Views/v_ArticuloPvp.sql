USE AcontPlus
GO
IF OBJECT_ID(N'v_ArticuloPvp', N'V') IS NOT NULL
DROP VIEW v_ArticuloPvp
GO
CREATE VIEW v_ArticuloPvp AS (
SELECT ap.*
,t.codigo codTarifa
,t.descripcion tarifa
,t.predeterminada
FROM ArticuloPvP ap WITH (NOLOCK)
INNER JOIN Tarifa t WITH (NOLOCK) ON ap.idTarifa = t.idTarifa
)