USE AcontPlus
GO
IF OBJECT_ID(N'v_Impresora', N'V') IS NOT NULL
DROP VIEW v_Impresora
GO
CREATE VIEW v_Impresora AS (
SELECT i.idImpresora
,i.codEstab
,e.estab
, en.ruc, en.razonSocial, en.nombreComercial, i.nombreImpresora, ti.codigo codImpresora, ti.descripcion tipoImpresora
,i.estado
FROM ApiPrinter.Impresora i
INNER JOIN Sri.Establecimiento e ON i.codEstab = e.codEstab
INNER JOIN Entidad en ON e.ruc = en.ruc
INNER JOIN ApiPrinter.TipoImpresora ti ON i.idTipoImpresora = ti.idTipoImpresora
 )
--GROUP BY en.ruc, en.razonSocial, i.nombreImpresora