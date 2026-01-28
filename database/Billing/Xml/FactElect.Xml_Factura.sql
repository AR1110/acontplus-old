USE [AcontPlus]
GO
/****** Object:  StoredProcedure [FactElect].[Xml_Factura]    Script Date: 12/14/2022 9:22:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-11-25
-- Description:	SP para general la consulta que se usara en el XML para ser enviado al Sri
-- TEST : EXEC FactElect.Xml_Factura 10
--  =============================================
CREATE OR ALTER PROCEDURE FactElect.Xml_Factura @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

	DECLARE @idTipoDocumento INT
	DECLARE @totalSubsidio NUMERIC(18,2)

	SELECT @idTipoDocumento = idTipoDocumento FROM TipoDocumento WITH (NOLOCK) WHERE codigoSri = '01'

	SELECT @totalSubsidio = SUM((ISNULL(precioSinSubsidio,0) - precioUnitario) * cantidad) FROM dbo.FacturaDetalle WITH (NOLOCK) WHERE idFactura = @id AND precioSinSubsidio > 0

	--------------------------VERSION 1.1.0------------------------------------

	--> infoTributaria
	SELECT pe.ambiente
		  ,fc.emision                                as tipoEmision
		  ,en.razonSocial 
		  ,es.nombreComercial
		  ,en.ruc
		  ,de.claveAcceso 
		  ,'01'                                      as codDoc
		  ,es.estab
		  ,pe.ptoEmi
		  ,Helper.F_Auto_Sequential(de.nroDocumento) as secuencial
		  ,en.direccion                              as dirMatriz
		  ,ISNULL(es.agenteRetencion,'')             as agenteRetencion
		  ,ISNULL(es.contribuyenteRimpe,'')          as contribuyenteRimpe
	FROM dbo.Factura                    fc WITH (NOLOCK)
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fc.idDocumentoElectronico
	INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision 
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
	INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad	
	WHERE fc.idFactura = @id 


	--------------------infoFactura-----------------
	SELECT dbo.AFTConvertDate(de.fechaEmision)                                            as fechaEmision 
		  ,es.dirEstablecimiento                                                          as dirEstablecimiento
		  ,ISNULL(es.contribuyenteEspecial,'')                                            as contribuyenteEspecial
		  ,es.obligadoContabilidad
		  ,ti.codigoSri                                                                   as tipoIdentificacionComprador
		  ,ISNULL(dg.serieComprobante,'000-000-000000000')                                as guiaRemision
		  ,cu.BusinessName                                                                as razonSocialComprador
		  ,cu.IDCard                                                                      as identificacionComprador
		  ,Helper.IsNullOrEmpty(cl.direccion)                                             as direccionComprador
		  ,CAST(fc.subTotalSinImpuestos AS numeric(20,2))                                 as totalSinImpuestos
		  ,CASE WHEN @totalSubsidio > 0  THEN CAST(@totalSubsidio AS varchar) ELSE '' END as totalSubsidio
		  ,CAST(fc.totalDescuento AS numeric(20,2))                                       as totalDescuento
		  ,CAST(fc.propina AS numeric(20,2))                                              as propina
		  ,CAST(fc.total AS numeric(20,2))                                                as importeTotal
		  ,'DOLAR'                                                                        as moneda
		  ,CONVERT(NVARCHAR, FORMAT(de.fechaEmision, 'MM/yyyy'),106)                      as periodoFiscal
		  ,ISNULL(fc.placa,'')                                                            as placa
	FROM dbo.Factura fc WITH (NOLOCK)
	INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fc.idDocumentoElectronico
    INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = fc.idCliente
     LEFT JOIN dbo.GuiaRemision         gr WITH (NOLOCK) ON gr.idFactura              = fc.idFactura
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision 
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
	INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
    INNER JOIN dbo.TipoIdentificacion   ti WITH (NOLOCK) ON ti.idTipoIdentificacion   = cu.IdTypeId
     LEFT JOIN dbo.DocumentoElectronico dg WITH (NOLOCK) ON dg.idDocumentoElectronico = gr.idDocumentoElectronico
	WHERE fc.idFactura = @id 

	-------FORMA DE PAGO-----------
	SELECT 
		 formaPago    = fp.codigo
		,total        = CAST(pf.abono AS numeric(15,2))
		,plazo        = tc.diasCredito
		,unidadTiempo = 'dias'
	FROM dbo.FormaPagoFactura               pf
	INNER JOIN dbo.FormaPagoSri             fp ON fp.idFormaPagoSri  = pf.idFormaPagoSri
    INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idDocumento     = pf.idFactura AND cc.codDoc = '01'
    INNER JOIN dbo.TiempoCredito            tc ON tc.idTiempoCredito = cc.idTiempoCredito 
	WHERE pf.idFactura = @id

	-------IMPUESTOS-------------------- 
	SELECT 
		 codigo           = im.codigo
		,codigoPorcentaje = ti.codigoPorcentaje
		,baseImponible    = CAST(SUM(fd.TaxBase) AS numeric(18,2))
		,valor            = CAST(SUM(fd.TaxValue) AS numeric(18,2))
	FROM Ventas.FacturaImpuesto fd WITH (NOLOCK) 
	INNER JOIN dbo.TipoIva      ti  WITH (NOLOCK) ON ti.idTipoIva  = fd.TaxPercentId
	INNER JOIN dbo.Impuesto     im  WITH (NOLOCK) ON im.idImpuesto = fd.TaxId
	WHERE fd.FacturaId = @id 
    AND fd.[Enabled] = 1
	GROUP BY im.codigo,ti.codigoPorcentaje

	------DETALLE DEL COMPROBANTE-------
	SELECT codigoPrincipal        = Helper.IsNullOrEmpty(a.codigo)
		  ,codigoAuxiliar         = Helper.IsNullOrEmpty(a.codigoAuxiliar)
		  ,descripcion            = fd.descripcion 
		  ,unidadMedida           = me.descripcion
		  ,cantidad               = CAST(fd.cantidad AS numeric(18,6))  
		  ,precioUnitario         = CAST(fd.precioUnitario AS numeric(18,6))
		  ,precioSinSubsidio      = CASE WHEN @totalSubsidio > 0  THEN CAST(CAST(ISNULL(fd.precioSinSubsidio,0) as numeric(18,2)) AS varchar) ELSE '' END 
		  ,descuento              = CAST(fd.valorDescuento AS numeric(18,2))
		  ,precioTotalSinImpuesto = CAST(fd.precioTotalSinImpuesto AS numeric(18,2))
		  ,i.codigo
		  ,fd.codigoPorcentaje       
		  ,CAST(fd.tarifa AS numeric(15,2))                 as tarifa
		  ,CAST(fd.precioTotalSinImpuesto AS numeric(18,2)) as baseImponible
		  ,CAST(fd.valorImpuesto AS numeric(18,2))          as valor
          ,(
                SELECT IIF(LEN(LTRIM(RTRIM(nota))) > 3, 'Observación', null) as nombre 
                      ,IIF(LEN(LTRIM(RTRIM(nota))) > 3, nota, null) as valor
                FROM FacturaDetalle da WITH (NOLOCK) WHERE da.idFacturaDetalle = fd.idFacturaDetalle    
                FOR JSON PATH

           ) as detAdicional
	FROM dbo.FacturaDetalle fd WITH (NOLOCK)
	INNER JOIN dbo.Articulo  a WITH (NOLOCK) ON a.idArticulo = fd.idArticulo
	INNER JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida  = fd.idMedida
	INNER JOIN dbo.TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva = fd.idTipoIva
	INNER JOIN dbo.Impuesto  i WITH (NOLOCK) ON i.idImpuesto = ti.idImpuesto 
	WHERE fd.idFactura = @id 
      AND fd.estado = 1
      AND fd.envioSri = 1
    ORDER BY fd.idFacturaDetalle ASC

	---------INFORMACION ADICIONAL---------------
	SELECT nombre
		  ,valor
	FROM InfoAdicionalDoc WITH (NOLOCK)
	WHERE idComprobante = @id 
      AND idTipoDocumento = @idTipoDocumento
      AND estado = 1

END
