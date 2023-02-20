-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Inventario.Control_Stock_Serv_Get_Id', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Control_Stock_Serv_Get_Id 
GO
CREATE PROCEDURE Inventario.Control_Stock_Serv_Get_Document @idArticulo INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	-------------------------ENTRADA-----------------------------------------------

	SELECT 
		 0
		,fcd.idMedida
		,fc.fechaEmision
		,CAST(fcd.cantidad * dbo.AFTConverFracc(@idArticulo,a.idMedida) AS decimal(15,5)) as cantidad
		,fcd.precioCostoNeto as  precio
		,fcd.precioCostoNeto as  precioCosto
		,fcd.total as total
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(fc.fechaEmision,@idArticulo,fcd.idBodega) as particion
	FROM dbo.FacturaCompraDetalle fcd WITH (NOLOCK)
	INNER JOIN dbo.FacturaCompra   fc WITH (NOLOCK) ON fc.idFacturaCompra = fcd.idFacturaCompra
	INNER JOIN dbo.Articulo         a WITH (NOLOCK) ON a.idArticulo       = fc.idArticulo 
	WHERE idArticulo = @idArticulo AND fc.estado = 1 AND fcd.estado = 1

	UNION ALL 

	SELECT 
	     0
		,ibd.idMedida
		,ib.idEstadoPago
		,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ib.nroDocumento) as nroDocumento
		,pr.nombreFiscal
		,ib.fechaEmision
		,CAST(ibd.cantidad * dbo.AFTConverFracc(@idArticulo,m.idMedida) as decimal(15,5)) as cantidad
		,ibd.precioCostoNeto as precio
		,ibd.precioCostoNeto as precioCosto
		,ibd.total as total
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(ib.fechaEmision,@idArticulo,ibd.idBodega) as particion
	FROM dbo.IngresoBodegaDetalle ibd
	WHERE idArticulo = @idArticulo AND ib.estado = 1 AND ibd.estado = 1

	UNION ALL 

	SELECT 
	     0
		,lcd.idMedida
		,lc.idEstadoPago
		,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,lc.nroDocumento) as nroDocumento
		,pr.nombreFiscal
		,lc.fechaEmision
		,CAST(lcd.cantidad * dbo.AFTConverFracc(@idArticulo,m.idMedida) AS DECIMAL(15,5)) as cantidad
		,lcd.precioCostoNeto as precio
		,lcd.precioCostoNeto as precioCosto
		,lcd.total as total
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(lc.fechaEmision,@idArticulo,lcd.idBodega) as particion
	FROM dbo.LiquidacionCompraDetalle lcd
	WHERE idArticulo = @idArticulo AND lc.estado = 1 AND lcd.estado = 1

	UNION ALL 

	SELECT 
	     0
		,ncd.idMedida
		,nc.idEstadoDocumento
		,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,nc.nroDocumento) as nroDocumento
		,cl.nombreFiscal
		,nc.fechaEmision
		,CAST(ncd.cantidad * dbo.AFTConverFracc(@idArticulo,m.idMedida)as decimal(15,5)) as cantidad
		,ncd.precioVentaNeto as precio
		,ncd.precioCosto as precioCosto
		,ncd.total as total
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(nc.fechaEmision,@idArticulo,ncd.idBodega) as particion
	FROM dbo.NotaCreditoDetalle ncd
	WHERE idArticulo = @idArticulo AND nc.estado = 1 AND ncd.estado = 1

	UNION ALL

	SELECT 
	    0,
		tbd.idMedida,
		tb.idEstadoDocumento,
		dbo.AFTGenerarNroDocumento(s.estab+pto.ptoEmi,tb.nroDoc),
		ISNULL(tb.observacion,''),
		tb.fechaEmision,
		CAST(tbd.cantidad * dbo.AFTConverFracc(@idArticulo,tbd.idMedida)AS decimal(15,5)),
		tbd.precioCosto,
		tbd.precioCosto,
		tbd.total,
		0,
		dbo.AFTMovimientoKardex(tb.fechaEmision,@idArticulo,tb.idBodegaDestino)
	FROM dbo.TransferenciaBodegaDetalle tbd 
	INNER JOIN dbo.TransferenciaBodega tb ON tb.idTransferenciaBodega = tbd.idTransferenciaBodega
	WHERE tbd.idArticulo = @idArticulo AND tbd.estado = 1

	------------------------------SALIDAS---------------------------
	UNION ALL

	SELECT 
	     fd.idTarifa
		,fd.idMedida
		,f.idEstadoPago
		,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,f.nroFactura) as nroDocumento
		,cl.nombreFiscal
		,f.fechaEmision
		,CAST((fd.cantidad) * dbo.AFTConverFracc(@idArticulo,m.idMedida) AS decimal(15,5)) as cantidad
		,fd.precioVentaNeto as precio 
		,fd.precioCosto as precioCosto
		,fd.total as total 
		,1 as movimiento 
		,dbo.AFTMovimientoKardex(f.fechaEmision,@idArticulo,fd.idBodega) as particion
	FROM dbo.FacturaDetalle fd
	WHERE idArticulo = @idArticulo AND f.estado = 1 AND fd.estado = 1
	 
	UNION ALL 

	SELECT 
 	     ned.idTarifa
		,ned.idMedida
		,ne.idEstadoPago
		,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ne.nroDocumento) as nroDocumento
		,cl.nombreFiscal
		,ne.fechaEmision
		,CAST(ned.cantidad  * dbo.AFTConverFracc(@idArticulo,m.idMedida)AS decimal(15,5)) as cantidad
		,ned.precioVentaNeto as precio
		,ned.precioCosto as precioCosto
		,ned.total as total
		,1 as movimiento 
		,dbo.AFTMovimientoKardex(ne.fechaEmision,@idArticulo,ned.idBodega) as particion
	FROM dbo.NotaEntregaDetalle ned
	WHERE idArticulo = @idArticulo AND ne.estado = 1 AND ned.estado = 1

	UNION ALL 

	SELECT 
		 0 
		,a.idMedida
		,np.idEstadoDocumento
		,dbo.AFTGenerarNroDocumento(np.ptoEmision,np.nroDoc) as nroDocumento
		,pr.nombreFiscal
		,np.fechaEmision
		,CAST(npd.cantidad * dbo.AFTConverFracc(@idArticulo,m.idMedida)AS decimal(15,5)) as cantidad
		,npd.precioCostoNeto as precio 
		,npd.precioCostoNeto as precioCosto
		,npd.total as total
		,1 as movimiento 
		,dbo.AFTMovimientoKardex(np.fechaEmision,@idArticulo,npd.idBodega) as particion
	FROM NotaCreditoProveedorDetalle npd
	INNER JOIN NotaCreditoProveedor np ON np.idNotaCreditoProveedor = npd.idNotaCreditoProveedor
	WHERE npd.idArticulo = @idArticulo AND np.estado = 1 AND npd.estado = 1

	UNION ALL

	SELECT
	    0,
		tbd.idMedida,
		tb.idEstadoDocumento,
		dbo.AFTGenerarNroDocumento(s.estab+pto.ptoEmi,tb.nroDoc),
		ISNULL(tb.observacion,''),
		tb.fechaEmision,
		CAST(tbd.cantidad * dbo.AFTConverFracc(@idArticulo,tbd.idMedida)AS decimal(15,5)),
		tbd.precioCosto,
		tbd.precioCosto,
		tbd.total,
		1,
		dbo.AFTMovimientoKardex(tb.fechaEmision,@idArticulo,tb.idBodegaOrigen)
	FROM dbo.TransferenciaBodegaDetalle tbd 
	INNER JOIN dbo.TransferenciaBodega tb ON tb.idTransferenciaBodega = tbd.idTransferenciaBodega
	WHERE tbd.idArticulo = @idArticulo AND tbd.estado = 1

	----------------------OTROS MOVIMIENTOS---------------------------------------------
	UNION ALL
	
	SELECT 
	     0
		,cid.idMedida
		,ci.idEstadoDocumento
		,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ci.nroDoc) as nroDocumento
		,ISNULL(observacion,'') 
		,ci.fechaEmision
		,CAST(cid.cantidad * dbo.AFTConverFracc(@idArticulo,m.idMedida) AS decimal(15,5)) as cantidadEntrada
		,cid.precioActual as precio
		,cid.precioActual as precioCosto
		,CAST(cid.cantidad * cid.precioActual AS decimal(15,5)) as totalEntrada
		,2 as movimiento 
		,IIF(ed.codigo = 'A',0,ci.idConsolidacionInventario) as particion
	FROM dbo.ConsolidacionInventarioDetalle cid
	INNER JOIN dbo.ConsolidacionInventario ci ON ci.idConsolidacionInventario = cid.idConsolidacionInventario
	INNER JOIN dbo.Medida					m ON m.idMedida				      = cid.idMedida
	INNER JOIN dbo.EstadoPago          ed ON ed.idEstadoPago              = ci.idEstadoDocumento
	WHERE idArticulo = @idArticulo AND ci.estado = 1 AND cid.estado= 1
	
	RETURN 


END
GO
