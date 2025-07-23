USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPAtsGetData]    Script Date: 25/9/2023 08:54:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE OR ALTER PROCEDURE FactElect.Ats_Get
	 @userRoleId INT
	,@json NVARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET LANGUAGE SPANISH;
	SET NOCOUNT ON;		
    
	DECLARE @idEntidad INT
           ,@rucReceptor VARCHAR(25)
           ,@codDoc VARCHAR(25)
           ,@fromDate DATETIME2
           ,@toDate DATETIME2
           ,@userId INT

    
    DECLARE @VentasATS TABLE (
         tpIdCliente     VARCHAR(2)
        ,idCliente       VARCHAR(13)
        ,parteRelVtas    VARCHAR(2)
        ,tipoCliente     VARCHAR(10)
        ,denoCli         VARCHAR(200)
        ,tipoComprobante VARCHAR(5)
        ,tipoEmision     VARCHAR(1)
        ,baseNoGraIva    NUMERIC(18,2)
        ,baseImponible   NUMERIC(18,2)
        ,baseImpGrav     NUMERIC(18,2)
        ,montoIva        NUMERIC(18,2)
        ,montoIce        NUMERIC(18,2)
        ,valorRetIva     NUMERIC(18,2)
        ,valorRetRenta   NUMERIC(18,2)
        ,formaPago       VARCHAR(2)
    );

    BEGIN TRY

	SELECT TOP 1 @idEntidad = idEntidad, @userId = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
	SELECT TOP 1 @rucReceptor = ruc FROM Entidad WHERE idEntidad = @idEntidad

	SELECT @fromDate  = fromDate
          ,@toDate    = toDate
    FROM OPENJSON(@json) WITH 
    (
        fromDate  DATETIME2 
       ,toDate    DATETIME2
    )


    SET @tableNames = 'header,purchases,sales,credit_notes,with_holding_taxes,establishment_sales'

	--> ENCABEZADO
    SELECT 'R'                                                                                                                      as TipoIdInformante
	       ,en.Ruc                                                                                                                  as IdInformante
	       ,en.razonSocial
	       ,YEAR(@fromDate)                                                                   as anio
	       ,(REPLICATE('0',(2-LEN(MONTH(@fromDate))))+CONVERT(NVARCHAR(10),MONTH(@fromDate))) as mes
	       ,'IVA'                                                                             as codigoOperativo
	       ,SUM(CAST(ISNULL(fe.subtotalsinImpuestos,0) AS NUMERIC(18,2)))                     as totalVentas
           ,ROW_NUMBER() OVER(PARTITION BY es.codEstab ORDER BY es.codEstab)                  as estabs
	       ,YEAR(@fromDate)                                                                                                         as anio
	       ,(REPLICATE('0',(2-LEN(MONTH(@fromDate))))+CONVERT(NVARCHAR(10),MONTH(@fromDate)))                                       as mes
	       ,'IVA'                                                                                                                   as codigoOperativo
	       ,SUM(CAST(ISNULL(fe.subtotalsinImpuestos,0)AS NUMERIC(18,2)) - CAST( ISNULL(ne.subtotalsinImpuestos,0)AS NUMERIC(18,2))) as totalVentas
           ,ROW_NUMBER() OVER(PARTITION BY es.codEstab ORDER BY es.codEstab)                                                        as estabs
	INTO #tempTotalVentas
    FROM  dbo.DocumentoElectronico      de WITH (NOLOCK) 
     LEFT JOIN dbo.Factura              fe WITH (NOLOCK) ON fe.idDocumentoElectronico = de.idDocumentoElectronico
	INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
	INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad
	WHERE es.idEntidad = @idEntidad
	  AND ss.codigo = 4 
	  AND ISNULL(fe.notaCredito,0) = 0
	  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
	  AND ISNULL(fe.estado,1) = 1
	GROUP BY en.ruc,en.razonSocial,es.codEstab

    SELECT TipoIdInformante
		  ,IdInformante
		  ,razonSocial
		  ,anio
		  ,mes
		  ,numEstabRuc = (SELECT (RIGHT('000' + Ltrim(Rtrim(SUM(estabs))),3)))
		  ,codigoOperativo
		  ,SUM(totalVentas) as totalVentas
	FROM #tempTotalVentas e
	GROUP BY TipoIdInformante
		    ,IdInformante
		    ,razonSocial
		    ,anio
		    ,mes
		    ,codigoOperativo

    --> Compras 
    SELECT  IIF(fc.codDoc = '01','FE','NC') as tipoDoc
            ,ISNULL
            ((
			    SELECT TOP 1 st.Codigo
			    FROM FactElect.RetAtsDocSustento           ds WITH (NOLOCK)
                INNER JOIN Sri.DocumentoSustentoTributario ss WITH (NOLOCK) ON ss.Id = ds.documentoSustentoTributarioId
                INNER JOIN Sri.SustentoTributario          st WITH (NOLOCK) ON st.Id = ss.SustentoTributarioId
			    WHERE ds.numAutDocSustento = fc.claveAcceso
                  AND ds.estado = 1

			),'06') as codSustento 

            ,ISNULL
            ((
                
                SELECT TOP 1 CASE ti.codigoSri WHEN '04' THEN '01'  
                                               WHEN '05' THEN '02'
                                                         ELSE '03'
                                END
                FROM dbo.Proveedor                pr WITH (NOLOCK)
                INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = pr.CustomerId
                INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId
                WHERE cu.IDCard    = fc.rucEmisor
                  AND pr.idEntidad = @idEntidad

            ),'') as tpIdProv

            ,fc.rucEmisor as idProv
            ,fc.codDoc    as tipoComprobante
            ,ISNULL
            ((

			    SELECT TOP 1 rt.parteRel
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON rt.idRetencionAts = ds.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				    AND rt.anuladaSri = 0

			), 'NO')                                                                as parteRel
            ,ISNULL(fc.fechaEmision, '')                                            as fechaRegistro
	        ,SUBSTRING(fc.serieComprobante, 1, 3)                                   as establecimiento
	        ,SUBSTRING(fc.serieComprobante, 5, 3)                                   as puntoEmision
            ,CAST(CAST(SUBSTRING(fc.serieComprobante, 9, 9) AS INT) AS VARCHAR(10)) as secuencial
	        ,fc.fechaEmision
	        ,fc.claveAcceso                                                         as autorizacion
            ,ISNULL
            ((
			    SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18, 2))
			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
			    WHERE fci.DocumentoRecibidoId = fc.idDocumento
				    AND fci.CodePercentage IN ('7','6')

			), 0) as baseNoGraIva

	        ,ISNULL
            ((
			    SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18, 2))
			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
			    WHERE fci.DocumentoRecibidoId = fc.idDocumento
				  AND fci.CodePercentage = '0'

			), 0) as baseImponible

	        ,ISNULL
            ((
			    SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18, 2))
			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
			    WHERE fci.DocumentoRecibidoId = fc.idDocumento
				    AND fci.CodePercentage IN ('2', '3', '4', '5', '8')

			), 0) as baseImpGrav

	        ,ISNULL
            ((
			    SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18, 2))
			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
			    WHERE fci.DocumentoRecibidoId = fc.idDocumento
				    AND fci.CodePercentage = '7'

			    ), 0) as baseImpExe
	        
            ,ISNULL
            ((
			    SELECT CAST(SUM(fci.TaxValue) AS NUMERIC(18, 2))
			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
			    WHERE fci.DocumentoRecibidoId = fc.idDocumento
				    AND fci.Code = '3'

			    ), 0) as montoIce

	        ,ISNULL
            ((
			    SELECT CAST(SUM(fci.TaxValue) AS NUMERIC(18, 2))
			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
			    WHERE fci.DocumentoRecibidoId = fc.idDocumento
				    AND fci.Code = '2'
			), 0) as montoIva
            
            ,ISNULL
            ((
			    SELECT CAST(ret.valorRetenido AS NUMERIC(18,2))
			    FROM FactElect.RetencionAts             rt WITH (NOLOCK)
                INNER JOIN FactElect.RetencionAtsRet   ret WITH (NOLOCK) ON ret.idRetencionAts      = rt.idRetencionAts
			    INNER JOIN FactElect.RetAtsDocSustento  ds WITH (NOLOCK) ON ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1
                  AND rt.anuladaSri = 0 
				  AND ret.codigoRetencion = '9'

			), 0) as valRetBien10

	        ,ISNULL
            ((
			    SELECT CAST(ret.valorRetenido AS NUMERIC(18,2))
			    FROM FactElect.RetencionAts             rt WITH (NOLOCK)
                INNER JOIN FactElect.RetencionAtsRet   ret WITH (NOLOCK) ON ret.idRetencionAts      = rt.idRetencionAts
			    INNER JOIN FactElect.RetAtsDocSustento  ds WITH (NOLOCK) ON ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1
                  AND rt.anuladaSri = 0 
				  AND ret.codigoRetencion = '10'

			), 0) as valRetServ20

	        ,ISNULL
            ((
			    SELECT CAST(ret.valorRetenido AS NUMERIC(18,2))
			    FROM FactElect.RetencionAts             rt WITH (NOLOCK)
                INNER JOIN FactElect.RetencionAtsRet   ret WITH (NOLOCK) ON ret.idRetencionAts      = rt.idRetencionAts
			    INNER JOIN FactElect.RetAtsDocSustento  ds WITH (NOLOCK) ON ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1
                  AND rt.anuladaSri = 0 
				  AND ret.codigoRetencion = '1'

			), 0) as valorRetBienes

	        ,ISNULL
            ((
			    SELECT CAST(ret.valorRetenido AS NUMERIC(18,2))
			    FROM FactElect.RetencionAts             rt WITH (NOLOCK)
                INNER JOIN FactElect.RetencionAtsRet   ret WITH (NOLOCK) ON ret.idRetencionAts      = rt.idRetencionAts
			    INNER JOIN FactElect.RetAtsDocSustento  ds WITH (NOLOCK) ON ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1
                  AND rt.anuladaSri = 0 
				  AND ret.codigoRetencion = '11'

			), 0) as valRetServ50

	        ,ISNULL
            ((
			    SELECT CAST(ret.valorRetenido AS NUMERIC(18,2))
			    FROM FactElect.RetencionAts             rt WITH (NOLOCK)
                INNER JOIN FactElect.RetencionAtsRet   ret WITH (NOLOCK) ON ret.idRetencionAts      = rt.idRetencionAts
			    INNER JOIN FactElect.RetAtsDocSustento  ds WITH (NOLOCK) ON ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1
                  AND rt.anuladaSri = 0 
				  AND ret.codigoRetencion = '2'

			), 0) as valorRetServicios

	        ,ISNULL
            ((
			    SELECT CAST(ret.valorRetenido AS NUMERIC(18,2))
			    FROM FactElect.RetencionAts             rt WITH (NOLOCK)
                INNER JOIN FactElect.RetencionAtsRet   ret WITH (NOLOCK) ON ret.idRetencionAts      = rt.idRetencionAts
			    INNER JOIN FactElect.RetAtsDocSustento  ds WITH (NOLOCK) ON ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1
                  AND rt.anuladaSri = 0 
				  AND ret.codigoRetencion = '3'

			), 0) as valRetServ100
            ,0.00 totbasesImpReemb
	        ,ISNULL
            ((
			    SELECT ds.pagoLocExt
			    FROM FactElect.RetAtsDocSustento ds WITH (NOLOCK)
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				    AND ds.estado = 1
			),'01') as pagoLocExt

	        ,ISNULL
            ((
			    SELECT st.Codigo
			    FROM FactElect.RetAtsDocSustento         ds WITH (NOLOCK)
                INNER JOIN Sri.TipoRegimenFiscalExterior st WITH (NOLOCK) ON st.Id = ds.tipoRegimenFiscalExteriorId
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1

            ), '00') as tipoRegi

	        ,'00000' denopagoRegFis

	        ,ISNULL
            ((
			    SELECT ds.paisEfecPago
			    FROM FactElect.RetAtsDocSustento ds WITH (NOLOCK)
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				    AND ds.estado = 1

		    ), 'NA') as paisEfecPago
	        ,ISNULL
            ((
			    SELECT ds.aplicConvDobTrib
			    FROM FactElect.RetAtsDocSustento ds WITH (NOLOCK)
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				    AND ds.estado = 1
			), 'NA') as aplicConvDobTrib

	        ,ISNULL
            ((
			    SELECT ds.pagExtSujRetNorLeg
			    FROM FactElect.RetAtsDocSustento ds WITH (NOLOCK)
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND ds.estado = 1

		    ), 'NA') as pagExtSujRetNorLeg

	        ,CASE WHEN fc.codDoc = '01' AND fc.importeTotal >= 500 THEN '20' ELSE '' END as formaPago
	        ,REPLACE(fc.serieComprobante, '-', '')                   as nroDocumento 
	      
            ,ISNULL
            ((
			    SELECT es.estab
			    FROM FactElect.RetencionAts             r WITH (NOLOCK)
                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = r.idDocumentoElectronico
                INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                INNER JOIN Sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON r.idRetencionAts          = ds.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.claveAcceso
		          AND r.anuladaSri = 0

		    ), '') as estabRetencion1 

	        ,ISNULL
            ((
			    SELECT pe.ptoEmi
			    FROM FactElect.RetencionAts             r WITH (NOLOCK)
                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = r.idDocumentoElectronico
                INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON r.idRetencionAts = ds.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				    AND r.anuladaSri = 0

			), '') as ptoEmiRetencion1 
	       
            ,ISNULL
            ((
			    SELECT de.nroDocumento
			    FROM FactElect.RetencionAts             r WITH (NOLOCK)
                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = r.idDocumentoElectronico
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON r.idRetencionAts = ds.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				    AND r.anuladaSri = 0

			), '') as secRetencion1  
	      
            ,ISNULL
            ((
			    SELECT de.claveAcceso
			    FROM FactElect.RetencionAts             r WITH (NOLOCK)
                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = r.idDocumentoElectronico
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON r.idRetencionAts = ds.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND r.anuladaSri = 0

			), '') as autRetencion1 
	      
            ,ISNULL
            ((
			    SELECT CONVERT(VARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy'), 106)
			    FROM FactElect.RetencionAts             r WITH (NOLOCK)
                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = r.idDocumentoElectronico
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON r.idRetencionAts = ds.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.claveAcceso
				  AND r.anuladaSri = 0

		    ), '') as fechaEmiRet1
    
            ,ISNULL((SELECT TOP 1 codDocSustento FROM FactElect.DocRelacionado dr WITH (NOLOCK) WHERE dr.idDocumentoRecibido = fc.idDocumento),'')                     as docModificado
	        ,ISNULL((SELECT TOP 1 LEFT(dr.numDocSustento,3) FROM FactElect.DocRelacionado dr WITH (NOLOCK) WHERE dr.idDocumentoRecibido = fc.idDocumento),'')          as estabModificado
	        ,ISNULL((SELECT TOP 1 RIGHT(LEFT(dr.numDocSustento,7),3) FROM FactElect.DocRelacionado dr WITH (NOLOCK) WHERE dr.idDocumentoRecibido = fc.idDocumento),'') as ptoEmiModificado
	        ,ISNULL((SELECT TOP 1 RIGHT(dr.numDocSustento,9) FROM FactElect.DocRelacionado dr WITH (NOLOCK) WHERE dr.idDocumentoRecibido = fc.idDocumento),'')         as secModificado

	        ,ISNULL((
                SELECT TOP 1 d.claveAcceso 
                FROM FactElect.DocRelacionado         dr WITH (NOLOCK) 
                INNER JOIN Recepcion.DocumentoRecibido d WITH (NOLOCK) ON d.idDocumento = dr.idDocumentoRecibido
			    WHERE dr.idDocumentoRecibido = fc.idDocumento

             ),'') as autModificado
    FROM Recepcion.DocumentoRecibido fc WITH (NOLOCK)
	WHERE fc.identificacionReceptor = @rucReceptor
      AND CAST(fc.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
	  AND fc.codDoc IN ('01','04','05')
      AND fc.xmlCompressed IS NOT NULL
      AND fc.estado = 1

    UNION ALL

	SELECT 'FF' 
           ,ISNULL
            ((
                SELECT TOP 1 st.Codigo
			    FROM FactElect.RetencionAts                rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento     ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.DocumentoSustentoTributario ss WITH (NOLOCK) ON ss.Id = ds.documentoSustentoTributarioId
                INNER JOIN Sri.SustentoTributario          st WITH (NOLOCK) ON st.Id = ss.SustentoTributarioId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

			),'06') as codSustento 
	        ,ISNULL((CASE WHEN ti.codigoSri IS NOT NULL THEN case when ti.codigoSri = '04' THEN '01' WHEN ti.codigoSri = '05' THEN '02' ELSE '03' END ELSE '01' END), '01') tpIdProv
	        ,cu.IDCard                                                      as idProv
	        ,'01'                                                           as tipoComprobante
	        ,ISNULL
            ((
                SELECT TOP 1 rt.parteRel
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

			),'NO')                                                         as parteRel
	        ,CONVERT(VARCHAR, FORMAT(fc.fechaEmision, 'dd/MM/yyyy'), 106)   as fechaRegistro
	        ,SUBSTRING(fc.puntoEmision, 1, 3)                               as establecimiento
	        ,SUBSTRING(fc.puntoEmision, 5, 3)                               as puntoEmision
	        ,fc.nroDocumento                                                as secuencial
	        ,CONVERT(VARCHAR, FORMAT(fc.fechaEmision, 'dd/MM/yyyy'), 106)   as fechaEmision
	        ,fc.nroAutorizacion                                             as autorizacion
	        ,ISNULL
            ((
                SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18,2)) 
                FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
                INNER JOIN dbo.TipoIva       ti WITH (NOLOCK) ON ti.idTipoIva  = fci.TaxPercentId  
			    WHERE fci.FacturaCompraId = fc.idFacturaCompra
				   AND ti.codigoPorcentaje IN ('7','6')

            ),0) as baseNoGraIva

	        ,ISNULL
            ((
                SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18,2)) 
                FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
                INNER JOIN dbo.TipoIva       ti WITH (NOLOCK) ON ti.idTipoIva  = fci.TaxPercentId
                WHERE fci.FacturaCompraId = fc.idFacturaCompra
                  AND ti.codigoPorcentaje = '0'

            ),0) as baseImponible

	        ,ISNULL
            ((
                SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18,2)) 
                FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
                INNER JOIN dbo.TipoIva       ti WITH (NOLOCK) ON ti.idTipoIva  = fci.TaxPercentId  
                WHERE fci.FacturaCompraId = fc.idFacturaCompra
                   AND ti.codigoPorcentaje IN ('2', '3', '4', '5', '8')

            ),0) as baseImpGrav

	        ,ISNULL
            ((
                SELECT CAST(SUM(fci.TaxBase) AS NUMERIC(18,2)) 
                FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
                INNER JOIN dbo.TipoIva       ti WITH (NOLOCK) ON ti.idTipoIva  = fci.TaxPercentId
                INNER JOIN dbo.Impuesto      im WITH (NOLOCK) ON im.idImpuesto = fci.TaxId  
                WHERE fci.FacturaCompraId = fc.idFacturaCompra
	               AND ti.codigoPorcentaje = '7'

            ),0) as baseImpExe

	        ,ISNULL
            ((
                SELECT CAST(SUM(fci.TaxValue) AS NUMERIC(18,2)) 
                FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
                INNER JOIN dbo.Impuesto      im WITH (NOLOCK) ON im.idImpuesto = fci.TaxId  
                WHERE fci.FacturaCompraId = fc.idFacturaCompra
	                AND im.codigo = '3'

            ),0) as montoIce
	
	        ,ISNULL
            ((
                SELECT CAST(SUM(fci.TaxValue) AS NUMERIC(18,2)) 
                FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
                INNER JOIN dbo.Impuesto      im WITH (NOLOCK) ON im.idImpuesto = fci.TaxId  
                WHERE fci.FacturaCompraId = fc.idFacturaCompra
                  AND im.codigo = '2'

            ),0) as montoIva

	    ,ISNULL
        ((
                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.ImpuestoRetencion       sr WITH (NOLOCK) ON sr.Id             = ir.impuestoRetencionId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor
                  AND ir.codigoRetencion = '9'
                  AND sr.codigo = 1

	    ),0) as valRetBien10

	    ,ISNULL
        ((
                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.ImpuestoRetencion       sr WITH (NOLOCK) ON sr.Id             = ir.impuestoRetencionId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor
                  AND ir.codigoRetencion = '10'
                  AND sr.codigo = 1

	    ),0) as valRetServ20

	    ,ISNULL
        ((
                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.ImpuestoRetencion       sr WITH (NOLOCK) ON sr.Id             = ir.impuestoRetencionId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor
                  AND sr.Codigo = 1
                  AND ir.codigoRetencion = '1'

	    ),0) as valorRetBienes

	    ,ISNULL
        ((
                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.ImpuestoRetencion       sr WITH (NOLOCK) ON sr.Id             = ir.impuestoRetencionId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor
                  AND sr.Codigo = 1
                  AND ir.codigoRetencion = '11'

	    ),0) as valRetServ50

	    ,ISNULL
        ((
                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.ImpuestoRetencion       sr WITH (NOLOCK) ON sr.Id             = ir.impuestoRetencionId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor
                  AND sr.Codigo = 1
                  AND ir.codigoRetencion = '2'

	    ),0) as valorRetServicios

	    ,ISNULL
        ((
                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.ImpuestoRetencion       sr WITH (NOLOCK) ON sr.Id             = ir.impuestoRetencionId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor
                  AND sr.Codigo = 1
                  AND ir.codigoRetencion = '3'

	    ),0) as valRetServ100

	    ,0.00 totbasesImpReemb
        ,ISNULL
         ((
                SELECT TOP 1 ds.pagoLocExt
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

	     ),'01') as pagoLocExt

        ,ISNULL
         ((
                SELECT TOP 1 st.Codigo
			    FROM FactElect.RetencionAts              rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento   ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
                INNER JOIN Sri.TipoRegimenFiscalExterior st WITH (NOLOCK) ON st.Id             = ds.tipoRegimenFiscalExteriorId
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

	     ),'00') as tipoRegi
	    ,'00000' denopagoRegFis
	    ,ISNULL
         ((
                SELECT TOP 1 ds.paisEfecPago
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

	     ),'NA') as paisEfecPago
	    ,ISNULL
         ((
                SELECT TOP 1 ds.aplicConvDobTrib
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

	     ),'NA') as aplicConvDobTrib
	    ,ISNULL
         ((
                SELECT TOP 1 ds.pagExtSujRetNorLeg
			    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			  AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
                  AND ds.estado = 1  
                  AND rt.anuladaSri = 0 
				  AND rt.idProveedor = fc.idProveedor

	     ),'NA') as pagExtSujRetNorLeg
	    ,formaPago = CASE WHEN fc.total >= 500 THEN '20'  ELSE '' END 
	    ,SUBSTRING(fc.puntoEmision, 1, 3) + SUBSTRING(fc.puntoEmision, 5, 3) +  +RIGHT('000000000'+convert(varchar(9), fc.nroDocumento),9) nroDocumento 
	    ,ISNULL
         ((
            
            SELECT TOP 1 es.estab
			FROM FactElect.RetencionAts            rt WITH (NOLOCK)
            INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
            INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            INNER JOIN Sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
			WHERE ds.numAutDocSustento = fc.nroAutorizacion
		      AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
              AND rt.anuladaSri = 0 
              AND rt.idProveedor = fc.idProveedor
              AND ds.estado = 1

         ),'') as estabRetencion1
        ,ISNULL
         ((
            
            SELECT TOP 1 pe.ptoEmi
			FROM FactElect.RetencionAts            rt WITH (NOLOCK)
            INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
            INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
			WHERE ds.numAutDocSustento = fc.nroAutorizacion
		      AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
              AND rt.anuladaSri = 0 
              AND rt.idProveedor = fc.idProveedor
              AND ds.estado = 1

         ),'') as ptoEmiRetencion1 
	    ,ISNULL
         ((
            
            SELECT TOP 1 de.nroDocumento
			FROM FactElect.RetencionAts            rt WITH (NOLOCK)
            INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			WHERE ds.numAutDocSustento = fc.nroAutorizacion
		      AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
              AND rt.anuladaSri = 0 
              AND rt.idProveedor = fc.idProveedor
              AND ds.estado = 1

         ),'') as secRetencion1
	    ,ISNULL
         ((
            
            SELECT TOP 1 de.claveAcceso
			FROM FactElect.RetencionAts            rt WITH (NOLOCK)
            INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			WHERE ds.numAutDocSustento = fc.nroAutorizacion
		      AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
              AND rt.anuladaSri = 0 
              AND rt.idProveedor = fc.idProveedor
              AND ds.estado = 1

         ),'') as autRetencion1 
        ,ISNULL
         ((
            
            SELECT TOP 1 ISNULL(CONVERT(VARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy'), 106), '')
			FROM FactElect.RetencionAts            rt WITH (NOLOCK)
            INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			WHERE ds.numAutDocSustento = fc.nroAutorizacion
		      AND ds.numDocSustento = REPLACE(fc.puntoEmision,'-','') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)),9)
              AND rt.anuladaSri = 0 
              AND rt.idProveedor = fc.idProveedor
              AND ds.estado = 1

         ),'') as fechaEmiRet1
        ,docModificado = ''
	    ,estabModificado = ''
	    ,ptoEmiModificado = ''
	    ,secModificado = ''
	    ,autModificado = ''
	FROM FacturaCompra                    fc WITH (NOLOCK) 
	INNER JOIN Proveedor                   p WITH (NOLOCK) ON fc.idProveedor          = p.idProveedor
    INNER JOIN Customer.Customer          cu WITH (NOLOCK) ON cu.Id                   = p.CustomerId
	INNER JOIN TipoIdentificacion         ti WITH (NOLOCK) on ti.idTipoIdentificacion = cu.IdTypeId
    WHERE fc.idEntidad = @idEntidad
      AND CAST(fc.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
	  AND fc.nroAutorizacion NOT IN (SELECT claveAcceso FROM Recepcion.DocumentoRecibido where identificacionReceptor = @rucReceptor)
	  AND fc.isAutomatic = 0
	  AND fc.estado = 1

    --> Ventas Facturas
    INSERT INTO @VentasATS (
          tpIdCliente
        , idCliente
        , parteRelVtas
        , tipoCliente
        , denoCli
        , tipoComprobante
        , tipoEmision
        , baseNoGraIva
        , baseImponible
        , baseImpGrav
        , montoIva
        , montoIce
        , valorRetIva
        , valorRetRenta
        , formaPago
    )
    --> Ventas facturas
    SELECT td.codigoSri                                                                         as tpIdCliente
	        ,CASE WHEN td.codigoSri = '07' THEN '9999999999999' ELSE cu.IDCard                  END as idCliente 
	        ,'NO'                                                                               as parteRelVtas
	        ,CASE WHEN td.codigoSri = '06' THEN tc.codigo END AS tipoCliente
	        ,CASE WHEN td.codigoSri = '06' THEN cu.BusinessName END   as denoCli
	        ,18       as tipoComprobante
	        ,'F'      as TipoEmision
	        ,ISNULL
            ((
                SELECT SUM(CAST(fi.TaxBase AS NUMERIC(18,2))) 
                FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva = fi.TaxPercentId
                WHERE fi.FacturaId = f.idFactura
                  AND fi.[Enabled] = 1
                  AND ti.codigoPorcentaje IN ('7','6')

			), 0) as baseNoGraIva

	        ,ISNULL
            ((   
                SELECT SUM(CAST(fi.TaxBase AS NUMERIC(18,2)))  
                FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva = fi.TaxPercentId
                WHERE fi.FacturaId = f.idFactura
                  AND fi.[Enabled] = 1
                  AND ti.codigoPorcentaje = '0' 
                  
		    ),0) as baseImponible

	        ,ISNULL
            (( 
                SELECT SUM(CAST(fi.TaxBase AS NUMERIC(18,2))) 
                FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva = fi.TaxPercentId
                WHERE fi.FacturaId = f.idFactura
                  AND fi.[Enabled] = 1
                  AND ti.codigoPorcentaje IN ('2','3','4','5','8')

			),0) as baseImpGrav

	    ,ISNULL
        ((  
            SELECT CASE 
                    WHEN SUBSTRING(CAST(sum(fi.TaxValue) AS VARCHAR),5,5) = '5' THEN cast(round(sum(fi.TaxValue), 2,1) as numeric (18,2)) ELSE cast(round(sum(fi.TaxValue), 3,1) as numeric (18,2))
                    END
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            WHERE fi.FacturaId = f.idFactura
              AND fi.[Enabled] = 1
              AND im.codigo = '2'

        ),0) as montoIva

	    ,ISNULL
        ((
            SELECT SUM(CAST(fi.TaxValue AS NUMERIC(18,2)))  
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            WHERE fi.FacturaId = f.idFactura
              AND fi.[Enabled] = 1
              AND im.codigo = '3'

		),0) as montoIce

	    ,valorRetIva =  ISNULL
                        ((
                                SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
                                FROM FactElect.DocRelacionado dr WITH (NOLOCK)
                                INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido
                                INNER JOIN Recepcion.DocumentoImpuesto di WITH (NOLOCK) ON di.DocumentoRecibidoId = dd.idDocumento
                                where dr.claveAcceso = de.claveAcceso
                                  AND dd.codDoc = '07'
                                  AND di.Code = '2'
                        ),0)
                        ,

	    valorRetRenta = ISNULL
                        ((  
                                
                                SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
                                FROM FactElect.DocRelacionado dr WITH (NOLOCK)
                                INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido
                                INNER JOIN Recepcion.DocumentoImpuesto di WITH (NOLOCK) ON di.DocumentoRecibidoId = dd.idDocumento
                                where dr.claveAcceso = de.claveAcceso
                                  AND dd.codDoc = '07'
                                  AND di.Code = '1'
                        ),0),
	    formaPago = '01'
    FROM dbo.Factura                     f WITH (NOLOCK) 
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = f.idDocumentoElectronico
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN dbo.Cliente               c WITH (NOLOCK) ON f.idCliente               = c.idCliente
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
     LEFT JOIN dbo.TipoClienteProveedor tc WITH (NOLOCK) ON tc.idTipoClienteProveedor = c.idTipoClienteProveedor
    INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = c.CustomerId
    INNER JOIN dbo.TipoIdentificacion   td WITH (NOLOCK) ON td.idTipoIdentificacion   = cu.IdTypeId	
    WHERE es.idEntidad = @idEntidad 
	  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
      AND ss.codigo = 4

    --> Ventas Notas de credito
    INSERT INTO @VentasATS (
          tpIdCliente
        , idCliente
        , parteRelVtas
        , tipoCliente
        , denoCli
        , tipoComprobante
        , tipoEmision
        , baseNoGraIva
        , baseImponible
        , baseImpGrav
        , montoIva
        , montoIce
        , valorRetIva
        , valorRetRenta
    )

      SELECT td.codigoSri                                                                           as tpIdCliente
	        ,CASE WHEN td.codigoSri = '07' THEN '9999999999999' ELSE cu.IDCard                  END as idCliente 
	        ,'NO'                                                                                   as parteRelVtas
	        ,CASE WHEN td.codigoSri = '06' THEN tc.codigo END                                       as tipoCliente
	        ,CASE WHEN td.codigoSri = '06' THEN cu.BusinessName END                                 as denoCli
	        ,'04'                                                                                   as tipoComprobante
	        ,'F'                                                                                    as TipoEmision
	        ,ISNULL
            ((
                SELECT SUM(CAST(ni.TaxBase AS NUMERIC(18,2))) 
                FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK)
                INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva = ni.TaxPercentId
                WHERE ni.NotaCreditoId = nc.idNotaCredito
                  AND ni.[Enabled] = 1
                  AND ti.codigoPorcentaje IN ('7','6')

			), 0) as baseNoGraIva

	        ,ISNULL
            ((   
                SELECT SUM(CAST(ni.TaxBase AS NUMERIC(18,2))) 
                FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK)
                INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva = ni.TaxPercentId
                WHERE ni.NotaCreditoId = nc.idNotaCredito
                  AND ni.[Enabled] = 1
                  AND ti.codigoPorcentaje = '0' 
                  
		    ),0) as baseImponible

	        ,ISNULL
            (( 
                SELECT SUM(CAST(ni.TaxBase AS NUMERIC(18,2))) 
                FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK)
                INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva = ni.TaxPercentId
                WHERE ni.NotaCreditoId = nc.idNotaCredito
                  AND ni.[Enabled] = 1
                  AND ti.codigoPorcentaje IN ('2','3','4','5','8')

			),0) as baseImpGrav

	    ,ISNULL
        ((  
            SELECT CASE 
                    WHEN SUBSTRING(CAST(sum(ni.TaxValue) AS VARCHAR),5,5) = '5' THEN cast(round(sum(ni.TaxValue), 2,1) as numeric (18,2)) ELSE cast(round(sum(ni.TaxValue), 3,1) as numeric (18,2))
                    END
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK)
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
			INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            WHERE ni.NotaCreditoId = nc.idNotaCredito
              AND ni.[Enabled] = 1
              AND im.codigo = '2'

        ),0) as montoIva

	    ,ISNULL
        ((
            SELECT SUM(CAST(ni.TaxValue AS NUMERIC(18,2)))  
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK)
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
			INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            WHERE ni.NotaCreditoId = nc.idNotaCredito
              AND ni.[Enabled] = 1
              AND im.codigo = '3'

		),0) as montoIce

	    ,valorRetIva =  ISNULL
                        ((
                                SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
                                FROM FactElect.DocRelacionado dr WITH (NOLOCK)
                                INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido
                                INNER JOIN Recepcion.DocumentoImpuesto di WITH (NOLOCK) ON di.DocumentoRecibidoId = dd.idDocumento
                                where dr.claveAcceso = de.claveAcceso
                                  AND dd.codDoc = '07'
                                  AND di.Code = '2'
                        ),0)
                        ,

	    valorRetRenta = ISNULL
                        ((  
                                
                                SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
                                FROM FactElect.DocRelacionado dr WITH (NOLOCK)
                                INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido
                                INNER JOIN Recepcion.DocumentoImpuesto di WITH (NOLOCK) ON di.DocumentoRecibidoId = dd.idDocumento
                                where dr.claveAcceso = de.claveAcceso
                                  AND dd.codDoc = '07'
                                  AND di.Code = '1'
                        ),0)
	  
    FROM dbo.NotaCredito                nc WITH (NOLOCK) 
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = nc.idDocumentoElectronico
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN dbo.Cliente               c WITH (NOLOCK) ON nc.idCliente               = c.idCliente
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
     LEFT JOIN dbo.TipoClienteProveedor tc WITH (NOLOCK) ON tc.idTipoClienteProveedor = c.idTipoClienteProveedor
    INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = c.CustomerId
    INNER JOIN dbo.TipoIdentificacion   td WITH (NOLOCK) ON td.idTipoIdentificacion   = cu.IdTypeId	
    WHERE es.idEntidad = @idEntidad 
	  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
      AND ss.codigo = 4
    
    SELECT tpIdCliente
	      ,idCliente
          ,parteRelVtas
	      ,tipoCliente
          ,denoCli
	      ,tipoComprobante
	      ,TipoEmision
	      ,COUNT(*)           as numeroComprobantes
	      ,SUM(baseNoGraIva)  as baseNoGraIva
	      ,SUM(baseImponible) as baseImponible
	      ,SUM(baseImpGrav)   as baseImpGrav
	      ,SUM(montoIva)      as montoIva
	      ,SUM(montoIce)      as montoIce
	      ,SUM(valorRetIva)   as valorRetIva
	      ,SUM(valorRetRenta) as valorRetRenta
	      ,formaPago
    FROM @VentasATS 
    GROUP BY tpIdCliente
            ,idCliente
            ,parteRelVtas
            ,tipoCliente
            ,tipoComprobante
            ,TipoEmision 
            ,formaPago
            ,denoCli
    
    --> Documento anulados
	SELECT td.codigoSri                                         as tipoComprobante
	      ,es.estab                                             as establecimiento
	      ,pe.ptoEmi                                            as puntoEmision
	      ,RIGHT('000000000' + Ltrim(Rtrim(de.nroDocumento)),9) as secuencialInicio
	      ,RIGHT('000000000' + Ltrim(Rtrim(de.nroDocumento)),9) as secuencialFin
	      ,de.claveAcceso                                       as autorizacion
	FROM dbo.DocumentoElectronico       de WITH (NOLOCK) 
	INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON de.idPuntoEmision    = pe.idPuntoEmision
	INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.idTipoDocumento   = de.idTipoDocumento
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento	
    INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio  = de.idEstadoServicio
	WHERE es.idEntidad = @idEntidad
	  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
	  AND de.fechaAutorizacion IS NOT NULL
      AND ss.codigo = 6

    --> Renteciones
	SELECT rdc.numDocSustento nroDocumento
	      ,rdc.numAutDocSustento as claveAcceso
          ,CAST(ret.codigoRetencion AS varchar(10)) codRetAir
	      ,CAST(ret.baseImponible AS numeric(18,2)) baseImpAir
	      ,CAST(ret.porcentajeRetener AS numeric(18,2)) porcentajeAir
	      ,CAST(ret.valorRetenido AS numeric(18,2)) valRetAir
	FROM FactElect.RetencionAtsRet         ret WITH (NOLOCK)
    INNER JOIN Sri.ImpuestoRetencion        sr WITH (NOLOCK) ON sr.Id                     = ret.impuestoRetencionId
	INNER JOIN FactElect.RetencionAts       rc WITH (NOLOCK) ON ret.idRetencionAts        = rc.idRetencionAts
	INNER JOIN FactElect.RetAtsDocSustento rdc WITH (NOLOCK) ON ret.idRetAtsDocSustento   = rdc.idRetAtsDocSustento
	INNER JOIN dbo.DocumentoElectronico     de WITH (NOLOCK) ON de.idDocumentoElectronico = rc.idDocumentoElectronico
    INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
    INNER JOIN Entidad                       e WITH (NOLOCK) ON e.idEntidad               = es.idEntidad
    INNER JOIN FactElect.EstadoServicio     ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
 	WHERE e.idEntidad = @idEntidad
	  AND rc.anulada = 0 
	  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
	  AND rc.anuladaSri = 0
	  AND sr.Codigo = 1
 	  AND ss.codigo = 4
    
    --> Ventas por establecimiento
	SELECT ventasEstab = CAST(SUM(f.subtotalsinImpuestos) AS NUMERIC(18,2)) - ISNULL(CAST(SUM(ne.subtotalsinImpuestos) AS NUMERIC(18,2)),0)
	      ,codEstab = s.estab
          ,ivaComp = 0.00
	FROM Factura                         f WITH (NOLOCK)
     LEFT JOIN dbo.NotaCredito          ne WITH (NOLOCK) ON ne.idFactura          = f.idFactura
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = f.idDocumentoElectronico
	INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON es.idEstadoServicio       = de.idEstadoServicio
	INNER JOIN Sri.Establecimiento       s WITH (NOLOCK) ON s.idEstablecimiento       = pe.idEstablecimiento	
	INNER JOIN dbo.Entidad               e WITH (NOLOCK) ON e.idEntidad               = s.idEntidad
	WHERE s.idEntidad = @idEntidad
	  AND f.estado = 1
	  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
      AND es.codigo = 4
	GROUP BY  s.estab

    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario], [additionalInfo])
        VALUES('Ats/Download', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), '[dbo].[ASPAtsGetData]', ERROR_LINE(), ERROR_MESSAGE(), @userId, N'{' +
        N'"userRoleId": ' + CAST(@userRoleId AS NVARCHAR) + N',' +
        N'"params": ' + @json + N'}');
        THROW;
    END CATCH
END
