--use Acontplus
--go

----select * from Acontplus.dbo.Usuario where correo = 'ifer343@gmail.com'


--delete cid from dbo.ConsolidacionInventarioDetalle cid with(rowlock)
--inner join  dbo.ConsolidacionInventario ci on cid.idConsolidacionInventario = ci.idConsolidacionInventario
--where ci.idusuario not in (select idUsuario from App.UsuarioRol)


--delete cid from Inventario.Stock cid with(rowlock)
--inner join  dbo.ConsolidacionInventario ci on cid.ConsolidacionId = ci.idConsolidacionInventario
--where ci.idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.Anticipo with(rowlock) where idUsarioRegister  not in (select idUsuario from App.UsuarioRol)
--go

--delete from Acontplus.dbo.MovimientoCaja where idUsuarioRegister not in (select idUsuario from App.UsuarioRol)
--go

--delete td from Acontplus.Inventario.TransaccionDetalle td with(rowlock)
--inner join Acontplus.Inventario.Transaccion t on td.idTransaccion = t.idTransaccion
--where t.idUsuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from Acontplus.Inventario.Transaccion where idUsuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.ConsolidacionInventario where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.RetencionCompra where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--update dbo.Proveedor set idUsuario = null where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--update dbo.OrdenCompra set idUsuario = null where idusuario not in (select idUsuario from App.UsuarioRol)
--go


--update dbo.IngresoBodega set idUsuario = null where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete ncd from dbo.NotaCreditoProveedorDetalle ncd 
--	inner join dbo.NotaCreditoProveedor nc ON ncd.idNotacreditoProveedor = nc.idNotacreditoproveedor
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)

--delete from dbo.NotaCreditoProveedor where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete ncd from Ventas.ProformaImpuesto ncd 
--	inner join dbo.Proforma nc ON ncd.ProformaId = nc.idProforma
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)


--delete ncd from dbo.ProformaDetalle ncd 
--	inner join dbo.Proforma nc ON ncd.idProforma = nc.idProforma
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)

--delete from dbo.Proforma where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete ncd from Compra.liquidacionImpuesto ncd 
--	inner join dbo.LiquidacionCompra nc ON ncd.LiquidacionId = nc.idLiquidacionCompra
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete ncd from dbo.FormaPagoLiquidacion ncd 
--	inner join dbo.LiquidacionCompra nc ON ncd.idLiquidacionCompra = nc.idLiquidacionCompra
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)
--go


--delete ncd from dbo.LiquidacionCompraDetalle ncd 
--	inner join dbo.LiquidacionCompra nc ON ncd.idLiquidacionCompra = nc.idLiquidacionCompra
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.LiquidacionCompra where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--update Empleado set idUsuario = null where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--update AsignacionCaja set idUsuario = null where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete ncd from dbo.TransferenciaBodegaDetalle ncd 
--	inner join dbo.TransferenciaBodega nc ON ncd.idTransferenciaBodega = nc.idTransferenciaBodega
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.TransferenciaBodega where idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.FormaPagoFactura   where idusuario not in (select idUsuario from App.UsuarioRol)


--delete ncd from dbo.FacturaDetalle ncd 
--	inner join dbo.Factura nc ON ncd.idFactura = nc.idFactura
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete ncd from Ventas.FacturaImpuesto ncd 
--	inner join dbo.Factura nc ON ncd.FacturaId = nc.idFactura
--where nc.idusuario not in (select idUsuario from App.UsuarioRol)
--go

--delete from dbo.Factura where idusuario not in (select idUsuario from App.UsuarioRol)
--go


--delete from Acontplus.dbo.Usuario where idUsuario not in (select idUsuario from App.UsuarioRol)
--go



----select * from dbo.Entidad where identidad = 10

----select * from App.UsuarioRol where idEntidad = 10