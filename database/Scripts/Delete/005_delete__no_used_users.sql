use Acontplus
go
------ANALIZAR BIEN EN PRODUCCION ANTES DE EJECUTAR
-----********CAMBIAR POR UPDATES

----select * from Acontplus.dbo.Usuario where correo = 'ifer343@gmail.com'


--delete cid from dbo.ConsolidacionInventarioDetalle cid with(rowlock)
--inner join  dbo.ConsolidacionInventario ci on cid.idConsolidacionInventario = ci.idConsolidacionInventario
--where ci.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))


--delete cid from Inventario.Stock cid with(rowlock)
--inner join  dbo.ConsolidacionInventario ci on cid.ConsolidacionId = ci.idConsolidacionInventario
--where ci.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.Anticipo with(rowlock) 
--where idUsarioRegister  not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from Acontplus.dbo.MovimientoCaja with(rowlock)
--where idUsuarioRegister not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete td from Acontplus.Inventario.TransaccionDetalle td with(rowlock)
--inner join Acontplus.Inventario.Transaccion t with(nolock) on td.idTransaccion = t.idTransaccion
--where t.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from Acontplus.Inventario.Transaccion with(rowlock)
--where idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.ConsolidacionInventario with(rowlock)
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.RetencionCompra with(rowlock) 
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--update dbo.Proveedor set idUsuario = null
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--update dbo.OrdenCompra set idUsuario = null
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--update dbo.IngresoBodega set idUsuario = null
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from dbo.NotaCreditoProveedorDetalle ncd with(rowlock)
--	inner join dbo.NotaCreditoProveedor nc ON ncd.idNotacreditoProveedor = nc.idNotacreditoproveedor
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))

--delete from dbo.NotaCreditoProveedor 
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from Ventas.ProformaImpuesto ncd with(rowlock)
--	inner join dbo.Proforma nc ON ncd.ProformaId = nc.idProforma
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))


--delete ncd from dbo.ProformaDetalle ncd with(rowlock)
--	inner join dbo.Proforma nc ON ncd.idProforma = nc.idProforma
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))

--delete from dbo.Proforma 
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from Compra.liquidacionImpuesto ncd with(rowlock)
--	inner join dbo.LiquidacionCompra nc ON ncd.LiquidacionId = nc.idLiquidacionCompra
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from dbo.FormaPagoLiquidacion ncd with(rowlock)
--	inner join dbo.LiquidacionCompra nc ON ncd.idLiquidacionCompra = nc.idLiquidacionCompra
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete ncd from dbo.LiquidacionCompraDetalle ncd with(rowlock)
--	inner join dbo.LiquidacionCompra nc ON ncd.idLiquidacionCompra = nc.idLiquidacionCompra
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.LiquidacionCompra with(rowlock) 
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from dbo.GuiaRemisionDetalle ncd with(rowlock)
--	inner join dbo.GuiaRemision nc ON ncd.idGuiaRemision = nc.idGuiaRemision
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.GuiaRemision with(rowlock)
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--update Empleado set idUsuario = null
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--update AsignacionCaja set idUsuario = null
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from dbo.TransferenciaBodegaDetalle ncd with(rowlock)
--	inner join dbo.TransferenciaBodega nc ON ncd.idTransferenciaBodega = nc.idTransferenciaBodega
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.TransferenciaBodega with(rowlock) 
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.FormaPagoFactura with(rowlock) 
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))


--delete ncd from dbo.FacturaDetalle ncd with(rowlock)
--	inner join dbo.Factura nc ON ncd.idFactura = nc.idFactura
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete ncd from Ventas.FacturaImpuesto ncd with(rowlock)
--	inner join dbo.Factura nc ON ncd.FacturaId = nc.idFactura
--where nc.idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete from dbo.Factura with(rowlock)
--where idusuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete cs from contabilidad.servicio cs with(rowlock)
--where cs.UsuarioId not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete cs from dbo.documentoelectronico cs with(rowlock)
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete cpc from contabilidad.cuotaporcobrar cpc
--inner join Contabilidad.CuentaPorCobrar cs with(nolock) on cpc.idcuentaporcobrar = cs.idcuentaporcobrar
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete cs from Contabilidad.CuentaPorCobrar cs with(rowlock)
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete csd from Compra.Documento_Ingreso_Detail csd with(nolock)
--INNER JOIN dbo.Articulo cs On csd.idArticulo = cs.idArticulo
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete di from Compra.DocumentoIngresoImpuesto di
--INNER JOIN Compra.Documento_Ingreso diii on di.DocumentoIngresoId = diii.idDocumentoIngreso
--where diii.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete di from Compra.Documento_Ingreso di
--where di.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete s from Inventario.Stock s 
--INNER JOIN dbo.Articulo cs with(rowlock) on s.idArticulo = cs.idArticulo
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete cs from Compra.FacturaCompraImpuesto cs with(rowlock)
--inner join dbo.FacturaCompraDetalle ffcc on cs.idFac_CompraDetalle = ffcc.idFacturaCompraDetalle
--INNER JOIN dbo.Articulo a on ffcc.idArticulo = a.idArticulo
--where a.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete cs from dbo.FacturaCompraDetalle cs with(rowlock)
--INNER JOIN dbo.Articulo a on cs.idArticulo = a.idArticulo
--where a.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete cs from dbo.OrdenCompraDetalle cs with(rowlock)
--inner join dbo.Articulo a on cs. idArticulo = a.idArticulo
--where a.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete fi from Compra.FacturaImpuesto fi 
--inner join
--dbo.FacturaCompra cs with(rowlock) on fi.FacturaCompraId = cs.idFacturaCompra
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

--delete cs from dbo.FacturaCompra cs with(rowlock)
--where cs.idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go


--delete from Acontplus.dbo.Usuario with(rowlock)
--where idUsuario not in (select idUsuario from App.UsuarioRol with(nolock)) and idUsuario not in (select idUsuario from Contabilidad.CuentaPorCobrar)
--go


--select * from dbo.Entidad where identidad = 10

--select * from App.UsuarioRol where idEntidad = 10

--SELECT * FROM FactElect.v_DocElectronico WHERE  idUsuario not in (select idUsuario from App.UsuarioRol with(nolock))
--go

