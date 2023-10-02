
USE [AcontPlus]

IF OBJECT_ID('ReporteCompras.Detalle') IS NOT NULL
BEGIN 
	DROP PROCEDURE ReporteCompras.Detalle
END  
GO


-- exec ReporteCompras.Detalle '{"id":15767,"codEstab":"ESTAB-000000222","codigo":"RCD","codDoc":"CI","format":"excel"}'
CREATE PROCEDURE ReporteCompras.Detalle @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT
	DECLARE @id INT
	DECLARE @codDoc VARCHAR(10)

	DECLARE @isReportImport BIT
    declare @imagen VARBINARY(64)

	--Config. Decimales 
	--DECLARE @jsonConfig AS VARCHAR(MAX)
	--DECLARE @nroPrecio INT
	--DECLARE @nroCantidad INT
	--DECLARE @nroIva INT
	--DECLARE @nroDescuentoDetalle INT
	--DECLARE @nroTotalDetalle INT
	--DECLARE @nroTotalSubTotal INT
	--DECLARE @nroDescuento INT
	--DECLARE @nroIce INT

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
    IF @codDoc = 'CI'
		BEGIN 
			SELECT @idEntidad = idEntidad FROM dbo.ConsolidacionInventario  WITH(NOLOCK) WHERE idConsolidacionInventario = @id		
		END 

	--SELECT TOP 1 @jsonConfig = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD'

	--SELECT @nroPrecio           = ISNULL(nroPrecio, 2)
	--      ,@nroCantidad         = ISNULL(nroCantidad, 2)
	--      ,@nroIva              = ISNULL(nroIva, 2)
	--      ,@nroDescuentoDetalle = ISNULL(nroDescuentoDetalle, 2)
	--      ,@nroTotalDetalle     = ISNULL(nroTotalDetalle, 2)
	--      ,@nroTotalSubTotal    = ISNULL(nroTotalSubTotal, 2)
	--      ,@nroDescuento        = ISNULL(nroDescuento, 2)
	--      ,@nroIce              = ISNULL(nroIce, 2)
	--FROM OPENJSON(@jsonConfig)
	--WITH (codTransaccion VARCHAR(5) '$.codTransaccion'
	--	 ,nroPrecio             INT '$.nroPrecio'
	--	 ,nroCantidad           INT '$.nroCantidad'
	--	 ,nroIva                INT '$.nroIva'
	--	 ,nroDescuentoDetalle   INT '$.nroDescuentoDetalle'
	--	 ,nroTotalDetalle       INT '$.nroTotalDetalle'
	--	 ,nroTotalSubTotal      INT '$.nroTotalSubTotal'
	--	 ,nroDescuento          INT '$.nroDescuento'
	--	 ,nroIce                INT '$.nroIce') as dt
	--WHERE dt.codTransaccion = 'C'
	
	--PRINT @isReportImport
	IF @codDoc = '01' 
		BEGIN 
			SET @detailDs = (SELECT 
								id              = dd.idDocumentoDetalle
								,idArticulo     = dd.idArticulo
								,codigo         = ar.codigo
								,descripcion    = ar.descripcion
								,cantidad       = CAST(dd.cantidad AS NUMERIC(18,2)) 
								,medida         = me.descripcion
								,tipoIva        = ti.descripcion
								,precioUnitario =  CAST(dd.precioUnitario AS NUMERIC(18, 2)) 
								,valorDescuento = CAST(dd.descuento AS NUMERIC(18,2))
								,total          = CAST(dd.costoNeto AS NUMERIC(18,2))		
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
								,cantidad       = cast(fd.cantidad as numeric(18,2)) 
								,medida         = me.descripcion
								,tipoIva        = ti.descripcion
								,precioUnitario = cast(fd.precioCosto as numeric(18,2)) 
								,valorDescuento = cast(fd.valorDescuento as numeric(18,2))
								,total          = cast(fd.total as numeric(18,2))		
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
							,cantidad       = cast(ibd.cantidad as numeric(18,2))
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = cast(ibd.precioCosto as numeric(18,2)) 
							,valorDescuento = cast(ibd.valorDescuento as numeric(18,2))
							,total          = cast(ibd.total as numeric (18,2))		
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
							,cantidad       = cast(lcd.cantidad as numeric(18,2)) 
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = cast(lcd.precioCosto as numeric(18,2)) 
							,valorDescuento = cast(lcd.valorDescuento as numeric(18,2))
							,total          = cast(lcd.total as numeric(18,2))		
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
							,cantidad       = CAST(did.cantidad AS NUMERIC(18,2)) 
							,medida         = m.descripcion
							,tipoIva        = ti.descripcion
							,precioUnitario = cast(did.precioUnitario as numeric(18,2)) 
							,valorDescuento =  CAST(cantidad * descuento AS numeric(18,5))
							,total          = cast(did.precioTotalSinImpuesto as numeric(18,2))		
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

    IF @codDoc = 'CI'
	BEGIN 
		SET @detailDs = (SELECT 
							id              =cid.idConsolidacionInventarioDetalle
						,idArticulo     = cid.idArticulo
						,codigo         = a.codigo
						,descripcion    = cid.descripcion
						,cantidad       = CAST(cid.cantidad AS NUMERIC(18,2)) 
						,medida         = m.descripcion
						,tipoIva        = ti.descripcion
						,precioUnitario = cast(cid.precioCosto as numeric(18,2)) 
						,valorDescuento =  CAST(cantidad * 0 AS numeric(18,5))
						,total          = cast((cid.cantidad * cid.precioActual) as numeric(18,2))		
						,precioVenta    = ap.precioVenta
						,precioConIva   = ap.precioConIva
						,tarifa         = t.descripcion
						,nota           = ISNULL(a.observaciones, '')
					FROM dbo.ConsolidacionInventarioDetalle cid 
					INNER JOIN ArticuloPvP ap ON ap.idarticulo = cid.idArticulo 
					INNER JOIN Tarifa       t ON t.idTarifa    = ap.idTarifa
					INNER JOIN dbo.Medida   m ON m.idMedida    = cid.idMedida		
					INNER JOIN dbo.Articulo a ON a.idArticulo  = cid.idArticulo 
					INNER JOIN dbo.TipoIva ti ON ti.idTipoIva  = a.idTipoIva
					WHERE cid.idConsolidacionInventario = @id AND cid.estado = 1 ORDER BY cid.idConsolidacionInventario ASC
					FOR JSON PATH		
		)
	END 
	
	SET @dataSources = (SELECT detailDs = ISNULL(@detailDs, '[]') FOR JSON PATH)	
   
   SELECT  imagen = @imagen
	       ,mimeType = ''
	       ,claveAcceso = ''
		   ,rdlcParams = @rdlcParams
		   ,dataSources = @dataSources
		   ,'' as 'subject'
		   ,'' as 'cc'  
		   ,'' as 'invoiceName'
		   ,dataMail = ''
		 
END 