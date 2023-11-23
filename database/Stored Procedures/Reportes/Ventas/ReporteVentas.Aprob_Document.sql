USE AcontPlus
GO 
 
-- exec ReporteVentas.Aprob_Document '{"id":1164,"codEstab":"ESTAB-000000002","codDoc":"NE"}'
CREATE OR ALTER PROCEDURE ReporteVentas.Aprob_Document @json VARCHAR(MAX)
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
	DECLARE @importeTotal DECIMAL(15,5)	
	
	--Cliente 
	DECLARE @cliente VARCHAR(150) 
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
		agenteRetencion     varchar(150),
		nroDoc              varchar(50),
		claveAcceso         varchar(50),
        codigoAutorizacion         varchar(50),
		ambiente            varchar(50),
		emision             varchar(50),
		fechaEmision        datetime,
		fechaAutorizacion   varchar(50),
		identificacionComprador varchar(50),
		razonSocialComprador varchar(300),
		direccionComprador  varchar(300),
		telefonoComprador   varchar(50),
		emailComprador      varchar(300),
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
		observacion         varchar(100) NULL
	)

	-- Crear tabla para almacenar los detalles del documento
	DECLARE @tbDetalle AS TABLE (
		id                int primary key identity(1,1),
		codigo            varchar(50),
		codigoPrincipal   varchar(50),
		codigoAuxiliar    varchar(50),
		descripcion       varchar(500),
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

	SELECT @id = id, @docDestino = codDoc  FROM OPENJSON(@json) WITH (id INT '$.id', codDoc VARCHAR(5), rdlcParams VARCHAR(MAX) '$.rdlcParams') AS dt 

	SELECT 	

		@uniqueId        = ad.uniqueId,
		@idEntidad       = ad.idEntidad, 
		@telefono        = en.telefono,
		@razonSocial     = en.razonSocial,  	
		@importeTotal    = CAST(ad.importeTotal AS DECIMAL(15,2))				
	FROM Ventas.Aprob_Document  ad WITH (NOLOCK)
	INNER JOIN dbo.Entidad      en WITH (NOLOCK) ON en.idEntidad      = ad.idEntidad
	INNER JOIN dbo.EstadoPago   ep WITH (NOLOCK) ON ep.codigo         = ad.codEstado
	INNER JOIN dbo.Cliente      cl WITH (NOLOCK) ON cl.idCliente      = ad.idCliente
	INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = ad.idPuntoEmision
	WHERE idAprob_Document = @id	
 
	INSERT INTO @tbComprobante (ruc, razonSocial, nombreComercial, telefonoEntidad, emailEntidad, dirMatriz, contribuyenteEspecial,
		obligadoContabilidad, contribuyenteRimpe, agenteRetencion, nroDoc, claveAcceso, codigoAutorizacion, ambiente, emision, fechaEmision,
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
        codigoAutorizacion = ad.claveAcceso,
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
		totalSinImpuestos = CAST(ad.totalSinImpuestos as numeric(18,2)),
		subTotalIva12 = CAST(
							 ISNULL(
									(
									  SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 2
									), 0.00
									) as numeric(18, 2)
							 ),

		subTotalNetoIva = CAST(
								ISNULL(
										(
										   SELECT SUM(ad_d.precioTotalSinImpuesto) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 2
										), 0.00
									  ) as numeric(18,2)
								),
		subtotalIva0 = CAST(
							ISNULL(
									(
										SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 0
									), 0.00
								  ) AS numeric(18,2)
							),
		subtotalNoObjetoIva = CAST(
									ISNULL(
											(
												SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 6
											), 0.00
										  ) AS numeric(18,2)
									),
		subtotalExcentoIva = CAST(
									ISNULL(
											(
												SELECT SUM(ad_d.baseImponible) FROM Ventas.Aprob_Document_Detailt ad_d WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 7
											), 0.00
										  ) AS numeric(18,2)
								 ),
		totalDescuento = CAST(ad.totalDescuento AS numeric(18, 2)),
		tipoIva = ti.descripcion,
		valorIva = CAST(
						(
						 (SELECT SUM(ad_d.precioTotalSinImpuesto) 
						  FROM Ventas.Aprob_Document_Detailt ad_d 
						  WHERE ad_d.uniqueId = @uniqueId AND ad_d.codigoPorcentaje = 2
						 ) * ti.porcentaje / 100
						) as numeric(18,2)
					  ),
		irbpnr = CAST(0 AS numeric(18, 2)),
		propina = CAST(0 as numeric(18,2)),
		importeTotal = CAST(ad.importeTotal as numeric(18,2)),
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
		codigo            = ad_d.codigoPrincipal,
		codigoPrincipal   = ad_d.codigoPrincipal,
		codigoAuxiliar    = ad_d.codigoAuxiliar,
		descripcion       = ad_d.descripcion,
		medida            = m.descripcion,
		cantidad          = CAST(ad_d.cantidad as numeric(18,2)),
		precioUnitario    = CAST(ad_d.precioUnitario as numeric(18)),
		descuento         = cast(ad_d.descuento as numeric(18,2)),
		precioSinImpuesto = cast(ad_d.precioTotalSinImpuesto as numeric(18,2))
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
		    SELECT ruc, razonSocial, nombreComercial, telefonoEntidad, emailEntidad, dirMatriz, contribuyenteEspecial,
		obligadoContabilidad, contribuyenteRimpe, agenteRetencion, nroDoc, claveAcceso, codigoAutorizacion, ambiente, emision, fechaEmision,
		fechaAutorizacion, identificacionComprador, razonSocialComprador, direccionComprador, telefonoComprador, emailComprador,
		porcentajeIva, totalSinImpuestos, subTotalIva12, subTotalNetoIva, subtotalIva0, subtotalNoObjetoIva, subtotalExcentoIva,
		totalDescuento, tipoIva, valorIva, irbpnr, propina, importeTotal, observacion FROM @tbComprobante
            SELECT * FROM @tbDetalle
            SELECT  descripcion = fp.descripcion
								,valor = CAST(@importeTotal as numeric(15,2))
								FROM Sri.FormaPago fp WHERE formaPago = 20
			SELECT * FROM @tbInfoAdicional
 
		END 

	IF @docDestino='NE'
		BEGIN 
			SELECT  
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
				valorTotal = c.importeTotal,
                
                ruc, razonSocial, nombreComercial, telefonoEntidad, emailEntidad, dirMatriz, contribuyenteEspecial,
		        obligadoContabilidad, contribuyenteRimpe, agenteRetencion, nroDoc, ambiente, emision, fechaEmision,
		        fechaAutorizacion, identificacionComprador, razonSocialComprador, direccionComprador, telefonoComprador, emailComprador,
		        porcentajeIva, totalSinImpuestos, subTotalIva12, subTotalNetoIva, subtotalIva0, subtotalNoObjetoIva, subtotalExcentoIva,
		        totalDescuento, tipoIva, valorIva, irbpnr, propina, importeTotal, observacion

                FROM @tbComprobante c
			SELECT valorDescuento = dt.descuento, precioTotal = dt.precioSinImpuesto, dt.* FROM @tbDetalle dt
			SELECT * FROM @tbInfoAdicional
		END 

	


END 