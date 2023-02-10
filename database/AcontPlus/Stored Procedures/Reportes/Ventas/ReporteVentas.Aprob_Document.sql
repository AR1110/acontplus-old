
USE AcontPlus
GO

IF OBJECT_ID('ReporteVentas.Aprob_Document')IS NOT NULL
BEGIN 
	DROP PROCEDURE ReporteVentas.Aprob_Document
END 
GO


-- exec ReporteVentas.Aprob_Document '{"id":2}'
CREATE PROCEDURE ReporteVentas.Aprob_Document @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT;
	DECLARE @id INT;
	DECLARE @uniqueId VARCHAR(150)

	--Entidad--
	DECLARE @telefono VARCHAR(50)
	DECLARE @razonSocial VARCHAR(200)	
	
	--Comprobante
	DECLARE @codEstab VARCHAR(100)
	DECLARE @mimeType VARCHAR(100)
	DECLARE @nroDoc VARCHAR(20)
	DECLARE @claveAcceso VARCHAR(50)
	DECLARE @fecha VARCHAR(100)	
	DECLARE @importeTotal DECIMAL(15,5)	
	
	--Cliente 
	DECLARE @cliente VARCHAR(150)

	--Decimales 
	DECLARE @nroPrecio INT
	DECLARE @nroCantidad INT 
	DECLARE @nroIva INT 
	DECLARE @nroDescuentoDetalle INT 
	DECLARE @nroTotalDetalle INT 
	DECLARE @nroTotalSubTotal INT 
	DECLARE @nroDescuento INT 
	DECLARE @nroIce INT 

	--Report 
	DECLARE @imagen VARBINARY(MAX)
	DECLARE @rdlcParams VARCHAR(MAX)
	DECLARE @headerDs VARCHAR(MAX)
	DECLARE @detailDs VARCHAR(MAX)
	DECLARE @paymentDs VARCHAR(MAX)
	DECLARE @normativeDs VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX)

	--Email 
	DECLARE @subject VARCHAR(100)
	DECLARE @email VARCHAR(50) = 'acontplusweb@gmail.com' --correo servidor 
	DECLARE @password VARCHAR(50) = 'guzupdzsynqgamav'  -- passwrod 
	DECLARE @nameDoc VARCHAR(150)
	DECLARE @dataMail VARCHAR(MAX)
	DECLARE @cc VARCHAR(100)

	SELECT @id = id, @rdlcParams = rdlcParams FROM OPENJSON(@json) WITH (id INT '$.id',rdlcParams VARCHAR(MAX) '$.rdlcParams') AS dt 
	
	SELECT 	

		@uniqueId        = ad.uniqueId,
		@idEntidad       = ad.idEntidad,
		@codEstab        = pe.codEstab,
		@telefono        = e.telefono,
		@razonSocial     = e.razonSocial,
		@cc              = e.email,
		@nroDoc          = dbo.AFTGenerarNroDocumento(ad.estab+ad.ptoEmi, ad.secuencial),
		@claveAcceso     = claveAcceso,		
		@fecha           = CONVERT(NVARCHAR,FORMAT(ad.fechaEmision, 'dd/MM/yyyy HH:mm')),
		@nameDoc         = 'Prefactura' +'-'+  ad.estab+'-'+ad.ptoEmi+'-'+Helper.F_Auto_Sequential(ad.secuencial),		
		@subject         = 'Comprobante Electrónico - Acontplus N°: '+ ad.estab+'-'+ad.ptoEmi+'-'+dbo.AFTAutoComplete(ad.secuencial),		
		@importeTotal    = CAST(ad.importeTotal AS DECIMAL(15,2))				
	FROM Ventas.Aprob_Document ad
	INNER JOIN Entidad           e ON e.idEntidad = ad.idEntidad
	INNER JOIN dbo.EstadoPago   ep ON ep.codigo = ad.codEstado
	INNER JOIN dbo.Cliente      cl ON cl.idCliente = ad.idCliente
	INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = ad.idPuntoEmision
	WHERE idAprob_Document = @id

	SELECT @imagen = imagen, @mimeType = mimeType FROM Config.Estab_Logo WHERE codEstab = @codEstab

	--Decimales 
	SELECT 
		@nroPrecio = ISNULL(nroPrecio, 2)
	   ,@nroCantidad = ISNULL(nroCantidad, 2)
	   ,@nroIva = ISNULL(nroIva, 2)
	   ,@nroDescuentoDetalle = ISNULL(nroDescuentoDetalle, 2)
	   ,@nroTotalDetalle = ISNULL(nroTotalDetalle, 2)
	   ,@nroTotalSubTotal = ISNULL(nroTotalSubTotal, 2)
	   ,@nroDescuento = ISNULL(nroDescuento, 2)
	   ,@nroIce = ISNULL(nroIce, 2)
	FROM Config.CantidadDecimal WHERE idEntidad = @idEntidad AND codTransaccion = 'V'
	

	SET @headerDs = (SELECT 
						     ruc             = ad.ruc
							,razonSocial     = e.razonSocial
							,nombreComercial = e.nombreComercial 
							,telefonoEntidad = e.telefono
							,emailEntidad    = e.email
							,dirMatriz       = e.direccion
						 	--,dirEstablecimiento = s.direccion
							,es.contribuyenteEspecial 
							,es.obligadoContabilidad 
							,contribuyenteRimpe = ISNULL(es.contribuyenteRimpe,'SN')
							,agenteRetencion    = ISNULL(es.agenteRetencion,'SN')
							,nroDoc = ad.estab+'-'+ad.ptoEmi+'-'+Helper.F_Auto_Sequential(ad.secuencial)
							,claveAcceso = ad.claveAcceso
							,ambiente = CASE WHEN ad.ambiente =1 THEN 'PRUEBA' ELSE 'PRODUCCIÓN' END 
							,emision  = CASE WHEN ad.tipoEmision = 1 THEN 'NORMAL' ELSE '' END 
							,fechaEmision = dbo.AFTConvertDate(ad.fechaEmision)
							,fechaAutorizacion = ''
							,identificacionComprador = ad.identificacionComprador
							,razonSocialComprador = cl.nombreFiscal  
							,direccionComprador = cl.direccion  
							,telefonoComprador = cl.telefono 
							,emailComprador = cl.correo 

							,porcentajeIva       = 'SUBTOTAL IVA '+CAST(CAST(ti.porcentaje AS numeric(15,0)) AS nvarchar)+'%'
							,totalSinImpuestos   = Herramientas.Round_Out(ad.totalSinImpuestos, @nroTotalSubTotal) 
							,subTotalIva12       = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje=2), @nroTotalSubTotal), 0.00) 
							,subTotalNetoIva     = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.precioTotalSinImpuesto) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje=2), @nroTotalSubTotal), 0.00)
							,subtotalIva0        = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje=0), @nroTotalSubTotal), 0.00)
							,subtotalNoObjetoIva = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje=6), @nroTotalSubTotal), 0.00) 
							,subtotalExcentoIva  = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje=7), @nroTotalSubTotal), 0.00)
							,totalDescuento      = Herramientas.Round_Out(ad.totalDescuento,@nroDescuento)						
							,tipoIva             = ti.descripcion
							,valorIva            = Herramientas.Round_Out(Herramientas.Round_Out((SELECT SUM(ad_d.precioTotalSinImpuesto) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje=2), @nroTotalSubTotal) * ti.porcentaje / 100, @nroIva)  
							,irbpnr              = Herramientas.Round_Out(0,2)
							,propina             = Herramientas.Round_Out(0,2)
							,importeTotal        = Herramientas.Round_Out(ad.importeTotal,@nroTotalSubTotal)  
							,observacion         = ad.observacion
					FROM Ventas.Aprob_Document ad 
					INNER JOIN Entidad                   e ON e.idEntidad         = ad.idEntidad
					INNER JOIN dbo.PuntoEmision         pe ON pe.idPuntoEmision   = ad.idPuntoEmision 
					INNER JOIN Sri.Establecimiento      es ON es.codEstab         = pe.codEstab
					INNER JOIN Cliente                  cl ON cl.idCliente        = ad.idCliente
					INNER JOIN TipoIva                  ti ON ti.codigoPorcentaje = ad.codigoPorcentaje
					WHERE idAprob_Document = @id 
					FOR JSON PATH	
				)

	SET @detailDs = (SELECT 
						 codigo            = ad_d.codArticulo
						,codigoPrincipal   = ad_d.codigoPrincipal						
						,codigoAuxiliar    = ad_d.codigoAuxiliar
						,descripcion       = ad_d.descripcion
						,medida            = m.descripcion
						,cantidad          = Herramientas.Round_Out(ad_d.cantidad,@nroCantidad)
						,precioUnitario    = Herramientas.Round_Out(ad_d.precioUnitario ,@nroPrecio) 
						,descuento         = Herramientas.Round_Out(ad_d.descuento,@nroDescuentoDetalle)  
						,precioSinImpuesto = Herramientas.Round_Out(ad_d.precioTotalSinImpuesto,@nroTotalDetalle) 
					 FROM Ventas.Aprob_Document_Detailt ad_d
					 INNER JOIN Medida m On m.codigo = ad_d.codMedida
					 WHERE ad_d.uniqueId = @uniqueId
					 FOR JSON PATH
					)


	SET @paymentDs = (SELECT 
						descripcion = fp.descripcion
						,valor = CAST(@importeTotal as numeric(15,2))
						FROM Sri.FormaPago fp WHERE formaPago = 20
						FOR JSON PATH
					  )

	SET @normativeDs = (
						SELECT descripcion FROM Config.Normativa n WHERE n.estado = 1 AND n.idEntidad = @idEntidad FOR JSON PATH
					   )

	SET @dataSources = (SELECT headerDs = @headerDs, detailDs = @detailDs, paymentDs = ISNULL(@paymentDs,'[]'), normativeDs = ISNULL(@normativeDs, '[]') FOR JSON PATH)

	SET @dataMail = (SELECT 'Prefactura Nro. '+@nroDoc documento, @fecha fechaEmision,  @cliente cliente, @importeTotal importeTotal,
						@razonSocial razonSocial,
						@telefono telefono
						 FOR JSON path )

	SELECT  imagen = @imagen
			,mimeType =  @mimeType
	       ,claveAcceso = @claveAcceso
		   ,rdlcParams = @rdlcParams
		   ,dataSources = @dataSources
		   ,ISNULL(@email,'') as 'from'
		   ,ISNULL(@password,'') as 'password'
		   ,ISNULL(@subject,'') as 'subject'
		   ,ISNULL(@cc,'') as 'cc'  
		   ,ISNULL(@nameDoc,'') as 'invoiceName'
		   ,'logoAcontPlus.jpg' logo
		   ,'smtp.gmail.com' host
		   ,587 as 'port'
		   ,1 EnableSsl
		   ,dataMail = @dataMail
	


END 