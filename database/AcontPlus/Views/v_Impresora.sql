USE AcontPlus
go
CREATE VIEW v_Impresora AS (
SELECT i.codEstab, e.estab, en.ruc, en.razonSocial, en.nombreComercial, i.nombreImpresora, ti.descripcion tipoImpresora

FROM ApiPrinter.Impresora i
INNER JOIN Sri.Establecimiento e ON i.codEstab = e.codEstab
INNER JOIN Entidad en ON e.ruc = en.ruc
INNER JOIN ApiPrinter.TipoImpresora ti ON i.idTipoImpresora = ti.idTipoImpresora
 )
--GROUP BY en.ruc, en.razonSocial, i.nombreImpresora