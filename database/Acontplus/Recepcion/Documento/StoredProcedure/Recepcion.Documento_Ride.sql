USE [AcontPlus]
GO 

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Emilio Senguana 
-- Create date: 19 de abril del 2022
-- Description:	ASP Reporte Factura Compra 
-- =============================================
--exec ReporteCompras.Factura '{"id":10,"codigo":"RFC","format":"pdf", "isReportImported": false}'

CREATE OR ALTER PROCEDURE Recepcion.Documento_Ride 
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Globa
    DECLARE @idEntidad INT

    --> Json
	DECLARE @id INT ,@codDoc VARCHAR(10)  

    --> Filter
    DECLARE @xmlComp XML ,@serieComprobante VARCHAR(50) ,@fechaAutorizacin DATETIME2 ,@fechaEmision DATETIME2

    --> Recuperar variables
	SELECT @id = id FROM OPENJSON(@json)WITH (id INT) 

    SELECT @xmlComp          = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), CONVERT(XML, DECOMPRESS(dr.xmlCompressed)).query('//autorizacion/comprobante'))))
          ,@codDoc           = codDoc
          ,@serieComprobante = serieComprobante
          ,@fechaAutorizacin = fechaAutorizacion
          ,@fechaEmision     = fechaEmision
	FROM Recepcion.DocumentoRecibido dr WITH(NOLOCK)
	WHERE dr.idDocumento =  @id
      AND dr.xmlCompressed is not null 

    --> Ride Factura
	IF @codDoc = '01'
		BEGIN 
            SET @tableNames = 'headerDs,detalleDs,paymentDs,infoAdicionalDs,impuestoTotalDs,impuestoIvaTotalDs'

			SELECT @serieComprobante                                                                                 as serieComprobante 
                  ,infoTributaria.value('(claveAcceso)[1]', 'NVARCHAR(50)')                                          as claveAcceso
                  ,infoTributaria.value('(claveAcceso)[1]', 'NVARCHAR(50)')                                          as codigoAutorizacion
                  ,FORMAT(@fechaAutorizacin, 'dd/MM/yyyy HH:mm')                                                     as fechaAutorizacion
                  ,'Factura'                                                                                         as tipoDoc
                  ,CASE WHEN infoTributaria.value('(ambiente)[1]', 'INT') = '1' THEN 'Pruebas' ELSE 'Producción' END as ambiente
			      ,CASE WHEN infoTributaria.value('(tipoEmision)[1]', 'INT') ='1' THEN 'NORMAL' ELSE '' END          as emision
			      ,infoTributaria.value('(razonSocial)[1]', 'NVARCHAR(255)')                                         as razonSocial
			      ,infoTributaria.value('(nombreComercial)[1]', 'NVARCHAR(255)')                                     as nombreComercial
			      ,infoTributaria.value('(ruc)[1]', 'NVARCHAR(13)')                                                  as ruc
			      ,infoTributaria.value('(dirMatriz)[1]', 'NVARCHAR(255)')                                           as dirEstablecimiento
                  ,''                                                                                                as contribuyenteEspecial
		          ,''                                                                                                as obligadoContabilidad
                  ,''                                                                                                as contribuyenteRimpe
		          ,''                                                                                                as agenteRetencion
			      ,infoFactura.value('(fechaEmision)[1]', 'NVARCHAR(10)')                                            as fechaEmision
                  ,infoFactura.value('(razonSocialComprador)[1]', 'NVARCHAR(255)')                                   as razonSocialComprador
                  ,infoFactura.value('(identificacionComprador)[1]', 'NVARCHAR(13)')                                 as identificacionComprador
                  ,infoFactura.value('(direccionComprador)[1]', 'NVARCHAR(255)')                                     as direccionComprador
                  ,infoFactura.value('(totalSinImpuestos)[1]', 'DECIMAL(18, 2)')                                     as subTotalSinImpuestos
                  ,infoFactura.value('(totalDescuento)[1]', 'DECIMAL(18, 2)')                                        as totalDescuento
                  ,infoFactura.value('(propina)[1]', 'DECIMAL(18, 2)')                                               as propina
                  ,infoFactura.value('(importeTotal)[1]', 'DECIMAL(18, 2)')                                          as importeTotal
                  ,CAST(0 as numeric(18,2))                                                                          as irbpnr
                  ,CAST(0 as numeric(18,2))                                                                          as totalIce
		          ,CAST(0 as numeric(18,2))                                                                          as totalSubsidio
		          ,CAST(0 as numeric(18,2))                                                                          as ahorroSubsidio
			FROM @xmlComp.nodes('/comprobante/factura/infoTributaria')     AS T1(infoTributaria)
			CROSS APPLY @xmlComp.nodes('/comprobante/factura/infoFactura') AS T2(infoFactura)
			
			SELECT detalles.value('(codigoPrincipal)[1]', 'NVARCHAR(50)')          as codigo
                  ,detalles.value('(descripcion)[1]', 'NVARCHAR(255)')             as descripcion
                  ,detalles.value('(cantidad)[1]', 'DECIMAL(18, 2)')               as cantidad
			      ,detalles.value('(precioUnitario)[1]', 'DECIMAL(18, 2)')         as precioUnitario
                  ,detalles.value('(descuento)[1]', 'DECIMAL(18, 2)')              as valorDescuento
                  ,CAST(0 as numeric(18,2))                                        as subsidio 
		          ,CAST(0 as numeric(18,2))                                        as precioSinSubsidio
			      ,detalles.value('(precioTotalSinImpuesto)[1]', 'DECIMAL(18, 2)') as precioTotal
			FROM @xmlComp.nodes('/comprobante/factura/detalles/detalle') AS T(detalles)

            SELECT (SELECT TOP 1 descripcion FROM dbo.FormaPagoSri fs WITH (NOLOCK) WHERE fs.codigo = pagos.value('(formaPago)[1]', 'VARCHAR(20)')) as descripcion 
			      ,pagos.value('(total)[1]', 'DECIMAL(18, 2)')                                                                                      as valor
			FROM @xmlComp.nodes('/comprobante/factura/infoFactura/pagos/pago')AS T(pagos)
			
            SELECT campoAdicional.value('@nombre', 'NVARCHAR(50)')    as nombre
			      ,campoAdicional.value('text()[1]', 'NVARCHAR(255)') as valor
			FROM @xmlComp.nodes('/comprobante/factura/infoAdicional/campoAdicional') AS T(campoAdicional)

            SELECT 'Subtotal' + ' ' + ti.descripcion as descripcion
                  ,ISNULL
                  ((
                        SELECT CAST(SUM(di.TaxBase) as numeric(18,2)) 
                        FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK)
                        WHERE di.DocumentoRecibidoId = @id 
                          AND di.Code = '2'
                          AND di.CodePercentage = ti.codigoPorcentaje

                  ),0) as subTotal
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)


            SELECT ti.descripcion as descripcion
                  ,ISNULL
                  ((
                        SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
                        FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK)
                        WHERE di.DocumentoRecibidoId = @id
                          AND di.Code = '2'
                          AND di.CodePercentage = ti.codigoPorcentaje

                  ),0) as iva
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE ti.porcentaje > 0 
              AND CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)
			
			RETURN 
		END
       
END
