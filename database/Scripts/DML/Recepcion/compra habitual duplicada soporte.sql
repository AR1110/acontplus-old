DECLARE @table AS TABLE
(
 idProveedor INT
,codarticulo VARCHAR(200)
,duplicated INT
)

INSERT INTO @table(idProveedor, codarticulo, duplicated)
SELECT idProveedor
,codarticulo
,COUNT(*) duplicated

FROM FactElect.CompraHabitual
GROUP BY idProveedor 
,codArticulo
--ORDER BY duplicated desc

--select * from @table where duplicated > 1 ORDER BY duplicated DESC


SELECT e.idEntidad
,e.razonSocial empresa
,ch.idCompraHabitual
,ch.idProveedor
,ch.ruc rucProveedor
,ch.codArticulo codArticuloOriginal
,a.idArticulo 
,a.codigo codArticuloAcontplus
,a.codigoAuxiliar
,a.descripcion articuloAcontplus

FROM FactElect.CompraHabitual ch 
INNER JOIN @table t ON ch.idProveedor = t.idProveedor AND ch.codArticulo = t.codarticulo
INNER JOIN Articulo a ON ch.idArticulo = a.idArticulo
LEFT JOIN Entidad e ON a.idEntidad = e.idEntidad
where t.duplicated > 1
ORDER BY e.razonSocial ASC
,t.codarticulo ASC

