

IF OBJECT_ID('ReporteCompras.Detalle') IS NOT NULL
BEGIN 
	DROP PROCEDURE ReporteCompras.Detalle
END  
GO

CREATE PROCEDURE ReporteCompras.Detalle @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT
	DECLARE @id INT
	DECLARE @codDoc VARCHAR(10)

	--Config. Decimales 
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

	SELECT @id         = id, 
		   @codDoc     = codDoc,
		   @rdlcParams = rdlcParams
	FROM OPENJSON(@json) WITH (id INT '$.id', codDoc VARCHAR(10) '$.codDoc', rdlcParams VARCHAR(MAX) '$.rdlcParams')

	IF @codDoc = 'FC'
	BEGIN 
		SELECT 
			@idEntidad = idEntidad
		FROM dbo.FacturaCompra WHERE idFacturaCompra = @id		
	END 

	IF @codDoc = 'IB'
	BEGIN 
		SELECT 
			@idEntidad = idEntidad
		FROM dbo.IngresoBodega WHERE idIngresoBodega = @id		
	END 

	IF @codDoc = 'LC'
	BEGIN 
		SELECT 
			@idEntidad = idEntidad
		FROM dbo.LiquidacionCompra WHERE idLiquidacionCompra = @id		
	END 


	SELECT 
		@nroPrecio = ISNULL(nroPrecio, 2)
	   ,@nroCantidad = ISNULL(nroCantidad, 2)
	   ,@nroIva = ISNULL(nroIva, 2)
	   ,@nroDescuentoDetalle = ISNULL(nroDescuentoDetalle, 2)
	   ,@nroTotalDetalle = ISNULL(nroTotalDetalle, 2)
	   ,@nroTotalSubTotal = ISNULL(nroTotalSubTotal, 2)
	   ,@nroDescuento = ISNULL(nroDescuento, 2)
	   ,@nroIce = ISNULL(nroIce, 2)
	FROM Config.CantidadDecimal WHERE idEntidad = @idEntidad AND codTransaccion = 'C'


	IF @codDoc='FC'
	BEGIN 
		SET @detailDs = (
						SELECT 
							 id              =fcd.idFacturaCompraDetalle
							,idArticulo     = fcd.idArticulo
							,codigo         = a.codigo
							,descripcion    = fcd.descripcion
							,cantidad       = Herramientas.Round_Out(fcd.cantidad,@nroCantidad) 
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = Herramientas.Round_Out(fcd.precioCosto,@nroPrecio) 
							,valorDescuento = Herramientas.Round_Out(fcd.valorDescuento,@nroDescuentoDetalle)
							,total          = Herramientas.Round_Out(fcd.total,@nroTotalDetalle)		
							,precioVenta    = ap.precioVenta
							,precioConIva   = ap.precioConIva
							,tarifa         = t.descripcion
							,nota           = ISNULL(a.observaciones, '')
						FROM dbo.FacturaCompraDetalle fcd 
						INNER JOIN ArticuloPvP ap ON ap.idarticulo = fcd.idArticulo 
						INNER JOIN Tarifa       t ON t.idTarifa    = ap.idTarifa
						INNER JOIN dbo.Medida   m ON m.idMedida    = fcd.idMedida		
						INNER JOIN dbo.Articulo a ON a.idArticulo  = fcd.idArticulo 
						INNER JOIN dbo.TipoIva ti ON ti.idTipoIva  = a.idTipoIva
						WHERE fcd.idFacturaCompra = @id AND fcd.estado = 1 ORDER BY fcd.idFacturaCompraDetalle ASC
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
	
	SET @dataSources = (SELECT detailDs = @detailDs FOR JSON PATH)	

	SELECT rdlcParams  = @rdlcParams,
	       dataSources = @dataSources
		 
END 