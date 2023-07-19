use [Acontplus]
go 

DECLARE @idArticulo AS INT = 1
DECLARE @idEntidad AS INT 
DECLARE @ruc AS VARCHAR(20)

SELECT TOP 1 @idEntidad = idEntidad FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo 
SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

--select * from AFTKardex(68002)
DECLARE @count AS INT = 0 

DECLARE @saldos AS TABLE (
	entrada DECIMAL(15,5)
   ,salidad DECIMAL(15,5)
)


DECLARE @table TABLE
	(
	    id INT IDENTITY(1,1) NOT NULL
	   ,idBodega INT
	   ,codDoc VARCHAR(5) NOT NULL
	   ,fechaEmision DATETIME NOT NULL
	   ,cantidad DECIMAL(15,5) NOT NULL
	   ,movimiento INT NOT NULL
	   ,particion INT NOT NULL
	)

	-------------------------ENTRADA----------------------------------------------
	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)

	SELECT 
		 ep.codigo
		,fcd.idBodega
		,fc.fechaEmision
		,CAST(fcd.cantidad * dbo.AFTConverFracc(@idArticulo,fcd.idMedida) AS decimal(15,5)) as cantidad
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(fc.fechaEmision,@idArticulo,fcd.idBodega) as particion
	FROM dbo.FacturaCompraDetalle fcd WITH (NOLOCK)
	INNER JOIN dbo.FacturaCompra   fc WITH (NOLOCK) ON fc.idFacturaCompra = fcd.idFacturaCompra
	INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago = fc.idEstadoPago 
	WHERE fcd.idArticulo = @idArticulo 
	  AND fc.estado = 1 
	  AND fcd.estado = 1
	  AND ep.codigo NOT IN ('A')

	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)

	SELECT 
	     ep.codigo
		,ibd.idBodega
		,ib.fechaEmision
		,CAST(ibd.cantidad * dbo.AFTConverFracc(@idArticulo,ibd.idMedida) as decimal(15,5)) as cantidad
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(ib.fechaEmision,@idArticulo,ibd.idBodega) as particion
	FROM dbo.IngresoBodegaDetalle ibd WITH (NOLOCK)
	INNER JOIN dbo.IngresoBodega   ib WITH (NOLOCK) ON ib.idIngresoBodega = ibd.idIngresoBodega
	INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago    = ib.idEstadoPago 
	WHERE idArticulo = @idArticulo 
	  AND ib.estado = 1
	  AND ibd.estado = 1
	  AND ep.codigo NOT IN ('A')

	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	) 

	SELECT 
	     ep.codigo
		,lcd.idBodega
		,lc.fechaEmision
		,CAST(lcd.cantidad * dbo.AFTConverFracc(@idArticulo,lcd.idMedida) AS DECIMAL(15,5)) as cantidad
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(lc.fechaEmision,@idArticulo,lcd.idBodega) as particion
	FROM dbo.LiquidacionCompraDetalle lcd WITH (NOLOCK)
	INNER JOIN dbo.LiquidacionCompra   lc WITH (NOLOCK) ON lc.idLiquidacionCompra = lcd.idLiquidacionCompra
	INNER JOIN dbo.EstadoPago          ep WITH (NOLOCK) ON ep.idEstadoPago = lc.idEstadoPago   
	WHERE idArticulo = @idArticulo AND lc.estado = 1 AND lcd.estado = 1

	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	) 

	SELECT 
	     ep.codigo
		,ncd.idBodega
		,nc.fechaEmision
		,CAST(ncd.cantidad * dbo.AFTConverFracc(@idArticulo,ncd.idMedida)as decimal(15,5)) as cantidad
		,0 as movimiento 
		,dbo.AFTMovimientoKardex(nc.fechaEmision,@idArticulo,ncd.idBodega) as particion
	FROM dbo.NotaCreditoDetalle ncd WITH (NOLOCK)
	INNER JOIN dbo.NotaCredito   nc WITH (NOLOCK) ON nc.idNotaCredito = ncd.idNotaCredito
	INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago  = nc.idEstadoDocumento 
	WHERE idArticulo = @idArticulo 
	  AND nc.estado = 1 
	  AND ncd.estado = 1
	  AND ep.codigo NOT IN ('A')

	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)

	SELECT 
		ep.codigo,
	    tb.idBodegaDestino,
		tb.fechaEmision,
		CAST(tbd.cantidad * dbo.AFTConverFracc(@idArticulo,tbd.idMedida)AS decimal(15,5)),
		0,
		dbo.AFTMovimientoKardex(tb.fechaEmision,@idArticulo,tb.idBodegaDestino)
	FROM dbo.TransferenciaBodegaDetalle tbd WITH (NOLOCK) 
	INNER JOIN dbo.TransferenciaBodega   tb WITH (NOLOCK) ON tb.idTransferenciaBodega = tbd.idTransferenciaBodega
	INNER JOIN dbo.EstadoPago            ep WITH (NOLOCK) ON ep.idEstadoPago          = tb.idEstadoDocumento 
	WHERE tbd.idArticulo = @idArticulo
	  AND tbd.estado = 1
	  AND ep.codigo NOT IN ('A')

	------------------------------SALIDAS---------------------------
	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)

	SELECT 
	     ep.codigo
		,fd.idBodega
		,f.fechaEmision
		,CAST((fd.cantidad) * dbo.AFTConverFracc(@idArticulo,fd.idMedida) AS decimal(15,5)) as cantidad
		,1 as movimiento 
		,dbo.AFTMovimientoKardex(f.fechaEmision,@idArticulo,fd.idBodega) as particion
	FROM dbo.FacturaDetalle   fd WITH (NOLOCK)
	INNER JOIN dbo.Factura     f WITH (NOLOCK) ON f.idFactura = fd.idFactura
	INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = f.idEstadoPago 
	WHERE idArticulo = @idArticulo 
	  AND f.estado = 1
	  AND fd.estado = 1
	  AND ep.codigo NOT IN ('A')
	 
	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)

	SELECT 
 	     ep.codigo
		,ned.idBodega
		,ne.fechaEmision
		,CAST(ned.cantidad  * dbo.AFTConverFracc(@idArticulo,ned.idMedida)AS decimal(15,5)) as cantidad
		,1 as movimiento 
		,dbo.AFTMovimientoKardex(ne.fechaEmision,@idArticulo,ned.idBodega) as particion
	FROM dbo.NotaEntregaDetalle ned WITH (NOLOCK)
	INNER JOIN dbo.NotaEntrega   ne WITH (NOLOCK) ON ne.idNotaEntrega = ned.idNotaEntrega
	INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago  = ne.idEstadoPago 
	WHERE idArticulo = @idArticulo 
	  AND ne.estado = 1 
	  AND ned.estado = 1
	  AND ep.codigo NOT IN ('A','TRA')

	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	) 

	SELECT 
		 ep.codigo
		,npd.idBodega
		,np.fechaEmision
		,CAST(npd.cantidad * dbo.AFTConverFracc(@idArticulo,a.idMedida)AS decimal(15,5)) as cantidad
		,1 as movimiento 
		,dbo.AFTMovimientoKardex(np.fechaEmision,@idArticulo,npd.idBodega) as particion
	FROM dbo.NotaCreditoProveedorDetalle npd WITH (NOLOCK)
	INNER JOIN dbo.NotaCreditoProveedor   np WITH (NOLOCK) ON np.idNotaCreditoProveedor = npd.idNotaCreditoProveedor
	INNER JOIN dbo.Articulo                a WITH (NOLOCK) ON a.idArticulo              = npd.idArticulo  
	INNER JOIN dbo.EstadoPago             ep WITH (NOLOCK) ON ep.idEstadoPago           = np.idEstadoDocumento 
	WHERE npd.idArticulo = @idArticulo 
	  AND np.estado = 1 
	  AND npd.estado = 1 
	  AND ep.codigo NOT IN ('A')

	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)

	SELECT
	    ep.codigo,
		idBodegaOrigen,
		tb.fechaEmision,
		CAST(tbd.cantidad * dbo.AFTConverFracc(@idArticulo,tbd.idMedida)AS decimal(15,5)),
		1,
		dbo.AFTMovimientoKardex(tb.fechaEmision,@idArticulo,tb.idBodegaOrigen)
	FROM dbo.TransferenciaBodegaDetalle tbd WITH (NOLOCK)
	INNER JOIN dbo.TransferenciaBodega   tb WITH (NOLOCK) ON tb.idTransferenciaBodega = tbd.idTransferenciaBodega
	INNER JOIN dbo.EstadoPago            ep WITH (NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento 
	WHERE tbd.idArticulo = @idArticulo 
	  AND tbd.estado = 1 
	  AND ep.codigo  NOT IN ('A')

	--------------------OTROS MOVIMIENTOS---------------------------------------------
	INSERT INTO @table 
	(
	    
	    codDoc
	   ,idBodega
	   ,fechaEmision
	   ,cantidad
	   ,movimiento
	   ,particion
	)
	
	SELECT 
	     ed.codigo
		,idBodega
		,ci.fechaEmision
		,CAST(cid.cantidad * dbo.AFTConverFracc(@idArticulo,m.idMedida) AS decimal(15,5)) as cantidadEntrada
		,2 as movimiento 
		,ci.idConsolidacionInventario as particion
	FROM dbo.ConsolidacionInventarioDetalle cid WITH (NOLOCK)
	INNER JOIN dbo.ConsolidacionInventario ci   WITH (NOLOCK) ON ci.idConsolidacionInventario = cid.idConsolidacionInventario
	INNER JOIN dbo.Medida					m   WITH (NOLOCK) ON m.idMedida				      = cid.idMedida
	INNER JOIN dbo.EstadoPago              ed   WITH (NOLOCK) ON ed.idEstadoPago              = ci.idEstadoDocumento
	WHERE idArticulo = @idArticulo
	  AND ci.estado = 1 
	  AND cid.estado= 1 
	  AND ed.codigo NOT IN ('A')
	
	

	SELECT SUM(dbo.AFTStockBodega(@idArticulo,b.idBodega))
	FROM dbo.Bodega b WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento e ON e.codEstab = b.codEstab
	WHERE e.ruc = @ruc

	

