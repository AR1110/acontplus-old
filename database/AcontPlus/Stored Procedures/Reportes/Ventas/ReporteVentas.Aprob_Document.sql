
USE AcontPlus
GO

IF OBJECT_ID('ReporteVentas.Aprob_Document')IS NOT NULL
BEGIN 
	DROP PROCEDURE ReporteVentas.Aprob_Document
END 
GO


-- exec ReporteVentas.Aprob_Document '{"id":129,"docDestino":"NE","codigo":"P-NE","format":"pdf"}'
CREATE PROCEDURE ReporteVentas.Aprob_Document @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT;
	DECLARE @id INT;
	DECLARE @uniqueId VARCHAR(150)
	DECLARE @docDestino VARCHAR(5)

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
	DECLARE @jsonConfig AS VARCHAR(MAX)
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
	DECLARE @additional VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX)

	--Email 
	DECLARE @subject VARCHAR(100)
	DECLARE @email VARCHAR(50) = 'acontplusweb@gmail.com' --correo servidor 
	DECLARE @password VARCHAR(50) = 'guzupdzsynqgamav'  -- passwrod 
	DECLARE @nameDoc VARCHAR(150)
	DECLARE @dataMail VARCHAR(MAX)
	DECLARE @cc VARCHAR(100)
	DECLARE @idTipoDocumento INT 
	
	-- Declaración de comprobante
	DECLARE @tbComprobante TABLE (
		ruc                 varchar(50),
		razonSocial         varchar(150),
		nombreComercial     varchar(150),
		telefonoEntidad     varchar(50),
		emailEntidad        varchar(50),
		dirMatriz           varchar(100),
		contribuyenteEspecial varchar(50),
		obligadoContabilidad varchar(50),
		contribuyenteRimpe  varchar(50),
		agenteRetencion     varchar(2),
		nroDoc              varchar(50),
		claveAcceso         varchar(50),
		ambiente            varchar(50),
		emision             varchar(50),
		fechaEmision        datetime,
		fechaAutorizacion   varchar(50),
		identificacionComprador varchar(50),
		razonSocialComprador varchar(100),
		direccionComprador  varchar(100),
		telefonoComprador   varchar(50),
		emailComprador      varchar(50),
		porcentajeIva       varchar(50),
		totalSinImpuestos   decimal(18, 2),
		subTotalIva12       decimal(18, 2),
		subTotalNetoIva     decimal(18, 2),
		subtotalIva0        decimal(18, 2),
		subtotalNoObjetoIva decimal(18, 2),
		subtotalExcentoIva  decimal(18, 2),
		totalDescuento      decimal(18, 2),
		tipoIva             varchar(50),
		valorIva            decimal(18, 2),
		irbpnr              decimal(18, 2),
		propina             decimal(18, 2),
		importeTotal        decimal(18, 2),
		observacion         varchar(100)
	)

	-- Crear tabla para almacenar los detalles del documento
	DECLARE @tbDetalle AS TABLE (
		id                int primary key identity(1,1),
		codigo            varchar(50),
		codigoPrincipal   varchar(50),
		codigoAuxiliar    varchar(50),
		descripcion       varchar(150),
		medida            varchar(50),
		cantidad          decimal(18, 2),
		precioUnitario    decimal(18, 2),
		descuento         decimal(18, 2),
		precioSinImpuesto decimal(18, 2)
	)

	-- Crear tabla para almacenar los registros de InfoAdicionalDoc
	DECLARE @tbInfoAdicional AS TABLE (
		nombre varchar(100),
		valor varchar(100)
	)



	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

	SELECT @id = id, @docDestino = codDoc,  @rdlcParams = rdlcParams FROM OPENJSON(@json) WITH (id INT '$.id', codDoc VARCHAR(5), rdlcParams VARCHAR(MAX) '$.rdlcParams') AS dt 

	SELECT 	

		@uniqueId        = ad.uniqueId,
		@idEntidad       = ad.idEntidad,
		@codEstab        = pe.codEstab,
		@telefono        = en.telefono,
		@razonSocial     = en.razonSocial,
		@cc              = en.email,
		@nroDoc          = dbo.AFTGenerarNroDocumento(ad.estab+ad.ptoEmi, ad.secuencial),
		@claveAcceso     = claveAcceso,		
		@fecha           = CONVERT(NVARCHAR,FORMAT(ad.fechaEmision, 'dd/MM/yyyy HH:mm')),
		@nameDoc         = 'Prefactura' +'-'+  ad.estab+'-'+ad.ptoEmi+'-'+Helper.F_Auto_Sequential(ad.secuencial),		
		@subject         = 'Comprobante Electrónico - Acontplus N°: '+ ad.estab+'-'+ad.ptoEmi+'-'+dbo.AFTAutoComplete(ad.secuencial),		
		@importeTotal    = CAST(ad.importeTotal AS DECIMAL(15,2))				
	FROM Ventas.Aprob_Document  ad WITH (NOLOCK)
	INNER JOIN dbo.Entidad      en WITH (NOLOCK) ON en.idEntidad      = ad.idEntidad
	INNER JOIN dbo.EstadoPago   ep WITH (NOLOCK) ON ep.codigo         = ad.codEstado
	INNER JOIN dbo.Cliente      cl WITH (NOLOCK) ON cl.idCliente      = ad.idCliente
	INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = ad.idPuntoEmision
	WHERE idAprob_Document = @id

	SELECT TOP 1 @imagen = imagen, @mimeType = mimeType FROM Config.Estab_Logo WITH (NOLOCK) WHERE codEstab = @codEstab

	SELECT TOP 1 @jsonConfig = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD'
	
	--Decimales 
	SELECT 
		@nroPrecio           = ISNULL(nroPrecio, 2)
	   ,@nroCantidad         = ISNULL(nroCantidad, 2)
	   ,@nroIva              = ISNULL(nroIva, 2)
	   ,@nroDescuentoDetalle = ISNULL(nroDescuentoDetalle, 2)
	   ,@nroTotalDetalle     = ISNULL(nroTotalDetalle, 2)
	   ,@nroTotalSubTotal    = ISNULL(nroTotalSubTotal, 2)
	   ,@nroDescuento        = ISNULL(nroDescuento, 2)
	   ,@nroIce              = ISNULL(nroIce, 2)
	FROM OPENJSON(@jsonConfig)
	WITH (codTransaccion  VARCHAR(5) '$.codTransaccion'
		 ,nroPrecio              INT '$.nroPrecio'
		 ,nroCantidad            INT '$.nroCantidad'
		 ,nroIva                 INT '$.nroIva'
		 ,nroDescuentoDetalle    INT '$.nroDescuentoDetalle'
		 ,nroTotalDetalle        INT '$.nroTotalDetalle'
		 ,nroTotalSubTotal       INT '$.nroTotalSubTotal'
		 ,nroDescuento           INT '$.nroDescuento'
		 ,nroIce                 INT '$.nroIce') as dt
	WHERE dt.codTransaccion = 'V'

	INSERT INTO @tbComprobante (ruc, razonSocial, nombreComercial, telefonoEntidad, emailEntidad, dirMatriz, contribuyenteEspecial,
		obligadoContabilidad, contribuyenteRimpe, agenteRetencion, nroDoc, claveAcceso, ambiente, emision, fechaEmision,
		fechaAutorizacion, identificacionComprador, razonSocialComprador, direccionComprador, telefonoComprador, emailComprador,
		porcentajeIva, totalSinImpuestos, subTotalIva12, subTotalNetoIva, subtotalIva0, subtotalNoObjetoIva, subtotalExcentoIva,
		totalDescuento, tipoIva, valorIva, irbpnr, propina, importeTotal, observacion)
	SELECT
		ruc             = ad.ruc,
		razonSocial     = e.razonSocial,
		nombreComercial = e.nombreComercial,
		telefonoEntidad = es.telefono,
		emailEntidad    = es.correo,
		dirMatriz       = es.dirEstablecimiento,
		es.contribuyenteEspecial,
		es.obligadoContabilidad,
		contribuyenteRimpe = ISNULL(es.contribuyenteRimpe, 'SN'),
		agenteRetencion    = ISNULL(es.agenteRetencion, 'SN'),
		nroDoc = ad.estab + '-' + ad.ptoEmi + '-' + Helper.F_Auto_Sequential(ad.secuencial),
		claveAcceso = ad.claveAcceso,
		ambiente = CASE WHEN ad.ambiente = 1 THEN 'PRUEBA' ELSE 'PRODUCCIÓN' END,
		emision  = CASE WHEN ad.tipoEmision = 1 THEN 'NORMAL' ELSE '' END,
		fechaEmision = dbo.AFTConvertDate(ad.fechaEmision),
		fechaAutorizacion = '',
		identificacionComprador = ad.identificacionComprador,
		razonSocialComprador = cl.nombreFiscal,
		direccionComprador = cl.direccion,
		telefonoComprador = cl.telefono,
		emailComprador = cl.correo,
		porcentajeIva = 'SUBTOTAL IVA ' + CAST(CAST(ti.porcentaje AS numeric(15, 0)) AS nvarchar) + '%',
		totalSinImpuestos = Herramientas.Round_Out(ad.totalSinImpuestos, @nroTotalSubTotal),
		subTotalIva12 = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 2), @nroTotalSubTotal), 0.00),
		subTotalNetoIva = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.precioTotalSinImpuesto) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 2), @nroTotalSubTotal), 0.00),
		subtotalIva0 = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 0), @nroTotalSubTotal), 0.00),
		subtotalNoObjetoIva = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 6), @nroTotalSubTotal), 0.00),
		subtotalExcentoIva = ISNULL(Herramientas.Round_Out((SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 7), @nroTotalSubTotal), 0.00),
		totalDescuento = Herramientas.Round_Out(ad.totalDescuento, @nroDescuento),
		tipoIva = ti.descripcion,
		valorIva = Herramientas.Round_Out(Herramientas.Round_Out((SELECT SUM(ad_d.precioTotalSinImpuesto) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 2), @nroTotalSubTotal) * ti.porcentaje / 100, @nroIva),
		irbpnr = Herramientas.Round_Out(0, 2),
		propina = Herramientas.Round_Out(0, 2),
		importeTotal = Herramientas.Round_Out(ad.importeTotal, @nroTotalSubTotal),
		observacion = ad.observacion
	FROM Ventas.Aprob_Document ad
	INNER JOIN Entidad e ON e.idEntidad = ad.idEntidad
	INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = ad.idPuntoEmision
	INNER JOIN Sri.Establecimiento es ON es.codEstab = pe.codEstab
	INNER JOIN Cliente cl ON cl.idCliente = ad.idCliente
	INNER JOIN TipoIva ti ON ti.codigoPorcentaje = ad.codigoPorcentaje
	WHERE idAprob_Document = @id

	INSERT INTO @tbDetalle (codigo, codigoPrincipal, codigoAuxiliar, descripcion, medida, cantidad, precioUnitario, descuento, precioSinImpuesto)
	SELECT
		codigo            = ad_d.codArticulo,
		codigoPrincipal   = ad_d.codigoPrincipal,
		codigoAuxiliar    = ad_d.codigoAuxiliar,
		descripcion       = ad_d.descripcion,
		medida            = m.descripcion,
		cantidad          = Herramientas.Round_Out(ad_d.cantidad, @nroCantidad),
		precioUnitario    = Herramientas.Round_Out(ad_d.precioUnitario, @nroPrecio),
		descuento         = Herramientas.Round_Out(ad_d.descuento, @nroDescuentoDetalle),
		precioSinImpuesto = Herramientas.Round_Out(ad_d.precioTotalSinImpuesto, @nroTotalDetalle)
	FROM Ventas.Aprob_Document_Detailt ad_d
	INNER JOIN Medida m ON m.codigo = ad_d.codMedida
	WHERE ad_d.uniqueId = @uniqueId

	-- Insertar los registros de InfoAdicionalDoc en la tabla
	INSERT INTO @tbInfoAdicional (nombre, valor)
	SELECT nombre, valor
	FROM dbo.InfoAdicionalDoc
	WHERE idComprobante = @id
		AND idTipoDocumento = @idTipoDocumento

	IF @docDestino='01'
		BEGIN 
			
			SET @headerDs = (SELECT * FROM @tbComprobante FOR JSON PATH	)

			SET @detailDs = (SELECT * FROM @tbDetalle FOR JSON PATH)


			SET @paymentDs = (SELECT 
								descripcion = fp.descripcion
								,valor = CAST(@importeTotal as numeric(15,2))
								FROM Sri.FormaPago fp WHERE formaPago = 20
								FOR JSON PATH
							  )

			SET @normativeDs = (SELECT descripcion FROM Config.Normativa n WHERE n.estado = 1 AND n.idEntidad = @idEntidad FOR JSON PATH)

			SET @additional = (SELECT * FROM @tbInfoAdicional FOR JSON PATH 
						
							)

			SET @dataSources = (SELECT headerDs = @headerDs, detailDs = @detailDs, paymentDs = ISNULL(@paymentDs,'[]'), normativeDs = ISNULL(@normativeDs, '[]'), infoAdicionalDs = ISNULL(@additional,'[]') FOR JSON PATH)

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

	IF @docDestino='NE'
		BEGIN 
			SELECT c.*, 
				tipoDoc           = 'NOTA DE ENTREGA POR APROBAR',
				direccion         = c.dirMatriz,
				telefono          = telefonoEntidad,
				cliente           = c.razonSocialComprador,
				email             = c.emailEntidad,
				nroIdentificacion = c.identificacionComprador,
				direccionCliente  = c.direccionComprador,
				correoCliente     = c.emailComprador,
				telefonoCliente   = c.telefonoComprador,
				subtotalSinImpuestos = c.totalSinImpuestos, 

				totalDescuentos = c.totalDescuento, 
				ice = 0, 
				iva12 = c.valorIva,
				valorTotal = c.importeTotal FROM @tbComprobante c
			SELECT valorDescuento = dt.descuento, precioTotal = dt.precioSinImpuesto, dt.* FROM @tbDetalle dt
			SELECT * FROM @tbInfoAdicional
		END 

	


END 