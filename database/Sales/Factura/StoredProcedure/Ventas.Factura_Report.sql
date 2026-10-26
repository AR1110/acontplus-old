USE [AcontPlus]
GO
/****** Object:  StoredProcedure [ReporteVentas].[Factura]    Script Date: 23/12/2022 15:04:53 ******/
CREATE OR ALTER PROCEDURE Ventas.Factura_Report @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @id INT 
           ,@idDocumentoElectronico INT
	       ,@idTipoDocumento BIGINT
	       ,@ivaSubsidio NUMERIC(18,2)
	       ,@totalSubsidio NUMERIC(18,2)
           ,@fechaEmision DATETIME2

    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) where codigoSri = '01'

	SELECT @id = id ,@idDocumentoElectronico = idDocumentoElectronico FROM OPENJSON(@json) WITH (id INT, idDocumentoElectronico INT) AS dt 

    IF @idDocumentoElectronico > 0
        BEGIN
            SELECT TOP 1 @id = idFactura FROM Factura WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico
        END 

	SELECT @totalSubsidio = SUM((ISNULL(precioSinSubsidio,0) - precioUnitario) * cantidad) FROM dbo.FacturaDetalle WITH (NOLOCK) WHERE idFactura = @id AND precioSinSubsidio > 0 AND estado = 1

    SELECT TOP 1 @fechaEmision = fechaEmision FROM Ventas.v_Factura WITH (NOLOCK) WHERE idFactura = @id

	SELECT @ivaSubsidio = (@totalSubsidio * 0.12)

    SELECT de.serieComprobante
		  ,de.claveAcceso
		  ,de.claveAcceso                                                                                                 as codigoAutorizacion
          ,FORMAT(de.fechaAutorizacion, 'dd/MM/yyyy HH:mm:ss')                                                            as fechaAutorizacion  
		  ,'Factura'                                                                                                      as tipoDoc
		  ,CASE WHEN pe.ambiente = '1' THEN 'Pruebas' ELSE 'Producción' END                                               as ambiente
		  ,CASE WHEN fa.emision = '1' THEN 'NORMAL' ELSE '' END                                                           as emision
		  ,en.razonSocial 
		  ,en.ruc
          ,es.nombreComercial    
		  ,es.telefono                                                                                                    as telefonoEstablecimiento
		  ,es.correo                                                                                                      as emailEstablecimiento
		  ,es.dirEstablecimiento 
          ,es.contribuyenteEspecial
		  ,es.obligadoContabilidad
          ,ISNULL(es.contribuyenteRimpe,'')                                                                               as contribuyenteRimpe
		  ,ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+es.agenteRetencion,'')                                           as agenteRetencion
		  ,CONVERT(NVARCHAR,FORMAT(de.fechaEmision, 'dd/MM/yyyy HH:mm'))                                                  as fechaEmision
		  ,cu.BusinessName                                                                                                as razonSocialComprador 
		  ,cu.IDCard                                                                                                      as identificacionComprador
		  ,cl.direccion                                                                                                   as direccionComprador
          ,cl.correo                                                                                                      as emailComprador
          ,cl.telefono                                                                                                    as telefonoComprador
		  ,ISNULL(CAST(1 AS BIT),0)                                                                                       as configValorBruto
          ,CAST(fa.subTotalSinImpuestos as numeric(18,2))                                                                 as subTotalSinImpuestos 
		  ,CAST(fa.totalDescuento as numeric(18,2))                                                                       as totalDescuento
		  ,CAST(fa.propina as numeric(15,2))                                                                              as propina
		  ,CAST(fa.total as numeric(18,2))                                                                                as importeTotal
          ,CAST(0 as numeric(18,2))                                                                                       as irbpnr
          ,CAST(0 as numeric(18,2))                                                                                       as totalIce
		  ,fa.observacion
		  ,CASE WHEN @totalSubsidio > 0 THEN CAST((@totalSubsidio + @ivaSubsidio) + fa.total AS NUMERIC(18,2)) ELSE 0 END as totalSubsidio
		  ,CASE WHEN @totalSubsidio > 0 THEN CAST(@totalSubsidio + @ivaSubsidio AS NUMERIC(18,2))              ELSE 0 END as ahorroSubsidio
	FROM Factura fa WITH (NOLOCK)
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fa.idDocumentoElectronico
    INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = fa.idCliente
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
    INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad
    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
	WHERE fa.idFactura = @id

	SELECT ar.codigo 
		  ,ar.codigoAuxiliar
          ,fd.descripcion 
		  ,me.descripcion                                                                                                                         as medida
		  ,CASE WHEN ABS(ROUND(fd.cantidad, 2) - fd.cantidad) < 0.000001 THEN FORMAT(fd.cantidad, '0.00')
                                                                         ELSE FORMAT(fd.cantidad, '0.##########')
           END AS cantidad
		  ,CASE WHEN ABS(ROUND(fd.precioUnitario, 2) - fd.precioUnitario) < 0.000001 THEN FORMAT(fd.precioUnitario, '0.00')
                                                                                     ELSE FORMAT(fd.precioUnitario, '0.##########')
           END AS precioUnitario
		  ,CAST(fd.valorDescuento as numeric(18,2))                                                                                               as valorDescuento
		  ,CASE WHEN ISNULL(fd.precioSinSubsidio,0) > 0 THEN CAST(ISNULL(fd.precioSinSubsidio,0) - fd.precioUnitario as numeric(18,2)) ELSE 0 END as subsidio 
		  ,CAST(ISNULL(fd.precioSinSubsidio,0) as numeric(18,2))                                                                                  as precioSinSubsidio
		  ,CAST(fd.precioTotalSinImpuesto as numeric(18,2))                                                                                       as precioTotal
          ,nota = IIF(fd.nota='S/N', '', fd.nota)
	FROM dbo.FacturaDetalle fd WITH (NOLOCK)
	INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = fd.idArticulo
	INNER JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida   = fd.idMedida
	WHERE fd.idFactura = @id
      AND fd.estado = 1  
      AND fd.envioSri = 1
    ORDER BY fd.idFacturaDetalle ASC 

    SELECT fp.descripcion
		  ,CAST(pf.abono as numeric(15,2))            as valor
          ,CAST(tc.diasCredito as varchar) + ' días'  as plazo
	FROM dbo.FormaPagoFactura               pf
	INNER JOIN dbo.FormaPagoSri             fp ON fp.idFormaPagoSri  = pf.idFormaPagoSri
    INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idDocumento     = pf.idFactura AND cc.codDoc = '01'
    INNER JOIN dbo.TiempoCredito            tc ON tc.idTiempoCredito = cc.idTiempoCredito 
	WHERE pf.idFactura = @id
	
	SELECT nombre,valor 
	FROM dbo.InfoAdicionalDoc WITH (NOLOCK)
	WHERE idComprobante = @id
      AND idTipoDocumento = @idTipoDocumento
      AND estado = 1

    SELECT 'Subtotal' + ' ' + ti.descripcion as descripcion
          ,ISNULL
          ((
            SELECT SUM(CAST(fi.TaxBase as numeric(18,2)))
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
            where fi.FacturaId = @id 
              AND fi.TaxPercentId = ti.idTipoIva
              AND fi.[Enabled] = 1

          ),0) as subTotal
    FROM dbo.TipoIva ti WITH (NOLOCK) 
    WHERE CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)


    SELECT ti.descripcion as descripcion
          ,CAST(ISNULL
          ((
               SELECT SUM(CAST(fi.TaxBase as numeric(18,2)))
               FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
               where fi.FacturaId = @id 
                 AND fi.TaxPercentId = ti.idTipoIva
                 AND fi.[Enabled] = 1

          ),0) * porcentaje / 100 as numeric(18,2)) as iva
    FROM dbo.TipoIva ti WITH (NOLOCK) 
    WHERE ti.porcentaje > 0 
      AND CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)
END
