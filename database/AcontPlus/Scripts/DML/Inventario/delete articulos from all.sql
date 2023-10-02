use acontplus
go
--SELECT * FROM v_usuario WHERE idUsuarioRol = 139

--select * from Familia where i = 111
go
--select * from SubFamilia where identidad = 111

--select * from Sri.ActividadEconomica
--select * from Sri.Establecimiento
--select * from ActividadEmpresa

delete nde from NotaEntregaDetalle nde  INNER JOIN Articulo a On nde.idArticulo = a.idArticulo  where a.idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)  

delete nde from FacturaDetalle nde  INNER JOIN Articulo a On nde.idArticulo = a.idArticulo  where a.idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)  

delete nde from ProformaDetalle nde  INNER JOIN Articulo a On nde.idArticulo = a.idArticulo  where a.idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)  

delete nde from ConsolidacionInventarioDetalle nde  INNER JOIN Articulo a On nde.idArticulo = a.idArticulo  where a.idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)  


delete nde from Inventario.Transaccion nde  INNER JOIN Articulo a On nde.idArticulo = a.idArticulo  where a.idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)

delete from s from Inventario.Stock s INNER JOIN Articulo a On s.idArticulo = a.idArticulo  where a.idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)
go

delete from Articulo where idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)
go

delete from SubFamilia where idSubFamilia in (
2651,
2652,
2653,
2654,
2655,
2656,
2657,
2658
)