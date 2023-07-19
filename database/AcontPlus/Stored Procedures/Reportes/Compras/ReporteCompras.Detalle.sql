
USE [AcontPlus]

IF OBJECT_ID('ReporteCompras.Detalle') IS NOT NULL
BEGIN 
	DROP PROCEDURE ReporteCompras.Detalle
END  
GO


-- exec ReporteCompras.Detalle '{"isReportImport":true,"codEstab":"ESTAB-000000092","id":7992,"codigo":"RCD","codDoc":"01","format":"excel"}'
CREATE PROCEDURE ReporteCompras.Detalle @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT
	DECLARE @id INT
	DECLARE @codDoc VARCHAR(10)

	DECLARE @isReportImport BIT 

	--Config. Decimales 
	DECLARE @jsonConfig AS VARCHAR(MAX)
	DECLARE @nroPrecio INT
	DECLARE @nroCantidad INT
	DECLARE @nroIva INT
	DECLARE @nroDescuentoDetalle INT
	DECLARE @nroTotalDetalle INT
	DECLARE @nroTotalSubTotal INT
	DECLARE @nroDescuento INT
	DECLARE @nroIce INT

	--Data Report 
	DECLARE @detailDs VARCHAR(MAX)
	DECLARE @rdlcParams VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX)

	SELECT @id = id, @codDoc = codDoc, @rdlcParams = rdlcParams
	FROM OPENJSON(@json) WITH (id INT '$.id', codDoc VARCHAR(10) '$.codDoc', rdlcParams VARCHAR(MAX) '$.rdlcParams')


	IF @codDoc = '01' AND @isReportImport =1
		BEGIN
			SELECT @idEntidad = (SELECT e.idEntidad FROM Sri.Establecimiento se WITH(NOLOCK)
													 INNER JOIN Entidad e WITH(NOLOCK) ON e.ruc = se.ruc
													 WHERE se.codEstab = dr.codEstab )
			FROM Recepcion.DocumentoRecibido dr WHERE idDocumento = @id
		END 

	IF @codDoc = 'FC'
		BEGIN 
			SELECT @idEntidad = idEntidad FROM dbo.FacturaCompra WITH(NOLOCK) WHERE idFacturaCompra = @id		
		END 

	IF @codDoc = 'IB'
		BEGIN 
			SELECT @idEntidad = idEntidad FROM dbo.IngresoBodega WITH(NOLOCK) WHERE idIngresoBodega = @id		
		END 

	IF @codDoc = 'LC'
		BEGIN 
			SELECT @idEntidad = idEntidad FROM dbo.LiquidacionCompra WITH(NOLOCK) WHERE idLiquidacionCompra = @id		
		END 

	IF @codDoc = 'CNH'
		BEGIN 
			SELECT @idEntidad = idEntidad FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE idDocumentoIngreso = @id		
		END 

	SELECT TOP 1 @jsonConfig = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD'

	SELECT @nroPrecio           = ISNULL(nroPrecio, 2)
	      ,@nroCantidad         = ISNULL(nroCantidad, 2)
	      ,@nroIva              = ISNULL(nroIva, 2)
	      ,@nroDescuentoDetalle = ISNULL(nroDescuentoDetalle, 2)
	      ,@nroTotalDetalle     = ISNULL(nroTotalDetalle, 2)
	      ,@nroTotalSubTotal    = ISNULL(nroTotalSubTotal, 2)
	      ,@nroDescuento        = ISNULL(nroDescuento, 2)
	      ,@nroIce              = ISNULL(nroIce, 2)
	FROM OPENJSON(@jsonConfig)
	WITH (codTransaccion VARCHAR(5) '$.codTransaccion'
		 ,nroPrecio             INT '$.nroPrecio'
		 ,nroCantidad           INT '$.nroCantidad'
		 ,nroIva                INT '$.nroIva'
		 ,nroDescuentoDetalle   INT '$.nroDescuentoDetalle'
		 ,nroTotalDetalle       INT '$.nroTotalDetalle'
		 ,nroTotalSubTotal      INT '$.nroTotalSubTotal'
		 ,nroDescuento          INT '$.nroDescuento'
		 ,nroIce                INT '$.nroIce') as dt
	WHERE dt.codTransaccion = 'C'
	
	--PRINT @isReportImport
	IF @codDoc = '01' 
		BEGIN 
			SET @detailDs = (SELECT 
								id              = dd.idDocumentoDetalle
								,idArticulo     = dd.idArticulo
								,codigo         = ar.codigo
								,descripcion    = ar.descripcion
								,cantidad       = Herramientas.Round_Out(dd.cantidad,@nroCantidad) 
								,medida         = me.descripcion
								,tipoIva        = ti.descripcion
								,precioUnitario = Herramientas.Round_Out(dd.precioUnitario,@nroPrecio) 
								,valorDescuento = Herramientas.Round_Out(dd.descuento,@nroDescuentoDetalle)
								,total          = Herramientas.Round_Out(dd.costoNeto,@nroTotalDetalle)		
								,precioVenta    = pv.precioVenta
								,precioConIva   = pv.precioConIva
								,tarifa         = ta.descripcion
								,nota           = ISNULL(ar.observaciones, '')
							FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK)
							INNER JOIN Articulo             ar WITH (NOLOCK) ON ar.idArticulo  = dd.idArticulo
							INNER JOIN ArticuloPvP          pv WITH (NOLOCK) ON pv.idArticulo  = dd.idArticulo
							INNER JOIN TipoIva              ti WITH (NOLOCK) ON ti.idTipoIva   = ar.idTipoIva
							 LEFT JOIN Medida               me WITH (NOLOCK) ON me.idMedida    = dd.idMedida
							INNER JOIN Tarifa               ta WITH (NOLOCK) ON ta.idTarifa    = pv.idTarifa
							WHERE dd.idDocumento = @id ORDER BY dd.idDocumentoDetalle ASC 
							
							FOR JSON PATH 
						 )
		END 


	IF @codDoc='FC'
		BEGIN 
			SET @detailDs = (SELECT 
								 id             = fd.idFacturaCompraDetalle
								,idArticulo     = fd.idArticulo
								,codigo         = ar.codigo
								,descripcion    = fd.descripcion
								,cantidad       = Herramientas.Round_Out(fd.cantidad,@nroCantidad) 
								,medida         = me.descripcion
								,tipoIva        = ti.descripcion
								,precioUnitario = Herramientas.Round_Out(fd.precioCosto,@nroPrecio) 
								,valorDescuento = Herramientas.Round_Out(fd.valorDescuento,@nroDescuentoDetalle)
								,total          = Herramientas.Round_Out(fd.total,@nroTotalDetalle)		
								,precioVenta    = ap.precioVenta
								,precioConIva   = ap.precioConIva
								,tarifa         = ta.descripcion
								,nota           = ISNULL(ar.observaciones, '')
							FROM dbo.FacturaCompraDetalle fd 
							INNER JOIN ArticuloPvP  ap WITH (NOLOCK) ON ap.idarticulo = fd.idArticulo 
							INNER JOIN Tarifa       ta WITH (NOLOCK) ON ta.idTarifa   = ap.idTarifa
							INNER JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida   = fd.idMedida		
							INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = fd.idArticulo 
							INNER JOIN dbo.TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva  = ar.idTipoIva
							WHERE fd.idFacturaCompra = @id AND fd.estado = 1 ORDER BY fd.idFacturaCompraDetalle ASC
							FOR JSON PATH
							)
		END 

	IF @codDoc='IB'
	BEGIN 
		SET @detailDs = (
						SELECT 
							 id              =ibd.idIngresoBodegaDetalle
							,idArticulo     = ibd.idArticulo
							,codigo         = a.codigo
							,descripcion    = ibd.descripcion
							,cantidad       = Herramientas.Round_Out(ibd.cantidad,@nroCantidad) 
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = Herramientas.Round_Out(ibd.precioCosto,@nroPrecio) 
							,valorDescuento = Herramientas.Round_Out(ibd.valorDescuento,@nroDescuentoDetalle)
							,total          = Herramientas.Round_Out(ibd.total,@nroTotalDetalle)		
							,precioVenta    = ap.precioVenta
							,precioConIva   = ap.precioConIva
							,tarifa         = t.descripcion
							,nota           = ISNULL(a.observaciones, '')
						FROM dbo.IngresoBodegaDetalle ibd 
						INNER JOIN ArticuloPvP ap ON ap.idarticulo = ibd.idArticulo 
						INNER JOIN Tarifa       t ON t.idTarifa    = ap.idTarifa
						INNER JOIN dbo.Medida   m ON m.idMedida    = ibd.idMedida		
						INNER JOIN dbo.Articulo a ON a.idArticulo  = ibd.idArticulo 
						INNER JOIN dbo.TipoIva ti ON ti.idTipoIva  = a.idTipoIva
						WHERE ibd.idIngresoBodega = @id AND ibd.estado = 1 ORDER BY ibd.idIngresoBodegaDetalle ASC 
						FOR JSON PATH
					)
	END 

	IF @codDoc='LC'
	BEGIN 
		SET @detailDs = (
						SELECT 
							 id              =lcd.idLiquidacionCompraDetalle
							,idArticulo     = lcd.idArticulo
							,codigo         = a.codigo
							,descripcion    = lcd.descripcion
							,cantidad       = Herramientas.Round_Out(lcd.cantidad,@nroCantidad) 
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = Herramientas.Round_Out(lcd.precioCosto,@nroPrecio) 
							,valorDescuento = Herramientas.Round_Out(lcd.valorDescuento,@nroDescuentoDetalle)
							,total          = Herramientas.Round_Out(lcd.total,@nroTotalDetalle)		
							,precioVenta    = ap.precioVenta
							,precioConIva   = ap.precioConIva
							,tarifa         = t.descripcion
							,nota           = ISNULL(a.observaciones, '')
						FROM dbo.LiquidacionCompraDetalle lcd 
						INNER JOIN ArticuloPvP ap ON ap.idarticulo = lcd.idArticulo 
						INNER JOIN Tarifa       t ON t.idTarifa    = ap.idTarifa
						INNER JOIN dbo.Medida   m ON m.idMedida    = lcd.idMedida		
						INNER JOIN dbo.Articulo a ON a.idArticulo  = lcd.idArticulo 
						INNER JOIN dbo.TipoIva ti ON ti.idTipoIva  = a.idTipoIva
						WHERE lcd.idLiquidacionCompra = @id AND lcd.estado = 1 ORDER BY lcd.idLiquidacionCompraDetalle ASC
						FOR JSON PATH
					)
	END 


	IF @codDoc = 'CNH'
		BEGIN 
			SET @detailDs = (SELECT 
							 id              =did.idDocumentoIngresoDetail
							,idArticulo     = did.idArticulo
							,codigo         = a.codigo
							,descripcion    = did.descripcion
							,cantidad       = Herramientas.Round_Out(did.cantidad,@nroCantidad) 
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = Herramientas.Round_Out(did.precioUnitario,@nroPrecio) 
							,valorDescuento = Herramientas.Round_Out( CAST(cantidad * descuento AS numeric(18,5)), @nroDescuentoDetalle)
							,total          = Herramientas.Round_Out(did.precioTotalSinImpuesto,@nroTotalDetalle)		
							,precioVenta    = ap.precioVenta
							,precioConIva   = ap.precioConIva
							,tarifa         = t.descripcion
							,nota           = ISNULL(a.observaciones, '')
						FROM Compra.Documento_Ingreso_Detail did 
						INNER JOIN ArticuloPvP ap ON ap.idarticulo = did.idArticulo 
						INNER JOIN Tarifa       t ON t.idTarifa    = ap.idTarifa
						INNER JOIN dbo.Medida   m ON m.idMedida    = did.idMedida		
						INNER JOIN dbo.Articulo a ON a.idArticulo  = did.idArticulo 
						INNER JOIN dbo.TipoIva ti ON ti.idTipoIva  = a.idTipoIva
						WHERE did.idDocumentoIngreso = @id AND did.estado = 1 ORDER BY did.idDocumentoIngresoDetail ASC
						FOR JSON PATH		
			)
		END 
	
	SET @dataSources = (SELECT detailDs = ISNULL(@detailDs, '[]') FOR JSON PATH)	

	SELECT rdlcParams  = @rdlcParams,
	       dataSources = @dataSources
		 
END 