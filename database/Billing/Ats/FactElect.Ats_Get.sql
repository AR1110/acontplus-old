USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPAtsGetData]    Script Date: 25/9/2023 08:54:21 ******/
SET ANSI_NULLS ON --
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
        ,parteRelVtas    VARCHAR(2) DEFAULT 'NO'
        ,tipoCliente     VARCHAR(10)
        ,denoCli         VARCHAR(200)
        ,tipoComprobante VARCHAR(5)
        ,tipoEmision     VARCHAR(1) DEFAULT 'F'
        ,baseNoGraIva    NUMERIC(18,2)
        ,baseImponible   NUMERIC(18,2)
        ,baseImpGrav     NUMERIC(18,2)
        ,montoIva        NUMERIC(18,2)
        ,montoIce        NUMERIC(18,2)
        ,valorRetIva     NUMERIC(18,2) DEFAULT 0
        ,valorRetRenta   NUMERIC(18,2) DEFAULT 0
        ,formaPago       VARCHAR(2) 
    );


    DECLARE @ComprasAts TABLE (
        tipoDoc VARCHAR(10)
       ,codSustento VARCHAR(10)
       ,tpIdProv VARCHAR(10)
       ,idProv VARCHAR(50)
       ,tipoComprobante VARCHAR(10)
       ,parteRel VARCHAR(10)
       ,fechaRegistro VARCHAR(20)
       ,establecimiento VARCHAR(10)
       ,puntoEmision VARCHAR(10)
       ,secuencial VARCHAR(20)
       ,fechaEmision VARCHAR(20)
       ,autorizacion VARCHAR(50)
       ,baseNoGraIva NUMERIC(18,2)
       ,baseImponible NUMERIC(18,2)
       ,baseImpGrav NUMERIC(18,2)
       ,baseImpExe NUMERIC(18,2)
       ,montoIce NUMERIC(18,2)
       ,montoIva NUMERIC(18,2)
       ,valRetBien10 NUMERIC(18,2)
       ,valRetServ20 NUMERIC(18,2)
       ,valorRetBienes NUMERIC(18,2)
       ,valRetServ50 NUMERIC(18,2)
       ,valorRetServicios NUMERIC(18,2)
       ,valRetServ100 NUMERIC(18,2)
       ,totbasesImpReemb NUMERIC(18,2)
       ,pagoLocExt VARCHAR(10)
       ,tipoRegi VARCHAR(10)
       ,denopagoRegFis VARCHAR(10)
       ,paisEfecPago VARCHAR(10)
       ,aplicConvDobTrib VARCHAR(10)
       ,pagExtSujRetNorLeg VARCHAR(10)
       ,formaPago VARCHAR(10)
       ,nroDocumento VARCHAR(50)
       ,estabRetencion1 VARCHAR(10)
       ,ptoEmiRetencion1 VARCHAR(10)
       ,secRetencion1 VARCHAR(20)
       ,autRetencion1 VARCHAR(50)
       ,fechaEmiRet1 VARCHAR(20)
       ,docModificado VARCHAR(10)
       ,estabModificado VARCHAR(10)
       ,ptoEmiModificado VARCHAR(10)
       ,secModificado VARCHAR(20)
       ,autModificado VARCHAR(50)
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

        SET @tableNames = 'header,purchases,sales,credit_notes,with_holding_taxes,establishment_sales';

	    --> ENCABEZADO
        WITH Devoluciones AS
        (
            SELECT es.idEntidad 
                  ,SUM(CAST(ISNULL(nc.subtotalsinImpuestos,0) AS NUMERIC(18,2))) AS totalDevoluciones
            FROM dbo.DocumentoElectronico       de WITH (NOLOCK) 
            INNER JOIN dbo.NotaCredito          nc WITH (NOLOCK) ON nc.idDocumentoElectronico = de.idDocumentoElectronico
            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND ss.codigo = 4 
              AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY es.idEntidad 
        ),
        Ventas AS 
        (
            SELECT 'R'                                                                                                                      as TipoIdInformante
                  ,en.idEntidad
                  ,en.Ruc                                                                                                                   as IdInformante
                  ,en.razonSocial
                  ,YEAR(@fromDate)                                                                                                          as anio
                  ,(REPLICATE('0',(2-LEN(MONTH(@fromDate))))+CONVERT(NVARCHAR(10),MONTH(@fromDate)))                                        as mes
                  ,'IVA'                                                                                                                    as codigoOperativo
                  ,es.codEstab
                  ,SUM(CAST(ISNULL(fe.subtotalsinImpuestos,0) AS NUMERIC(18,2)) ) as totalVentas
            FROM dbo.DocumentoElectronico       de WITH (NOLOCK) 
             LEFT JOIN dbo.Factura              fe WITH (NOLOCK) ON fe.idDocumentoElectronico = de.idDocumentoElectronico
            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
            INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad
            WHERE es.idEntidad = @idEntidad
              AND ss.codigo = 4 
              AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY en.idEntidad,en.ruc, en.razonSocial, es.codEstab
        ),
        EstablecimientosConteo AS
        (
            SELECT idEntidad
                  ,TipoIdInformante
                  ,IdInformante
                  ,razonSocial
                  ,anio
                  ,mes
                  ,codigoOperativo
                  ,COUNT(DISTINCT codEstab)  as numEstablecimientos
                  ,SUM(totalVentas)          as totalVentas
            FROM Ventas
            GROUP BY idEntidad,TipoIdInformante, IdInformante, razonSocial, anio, mes, codigoOperativo
        )
        SELECT TipoIdInformante
              ,IdInformante
              ,razonSocial
              ,anio
              ,mes
              ,RIGHT('000' + CAST(numEstablecimientos AS VARCHAR(3)), 3) as numEstabRuc
              ,codigoOperativo
              ,totalVentas - ISNULL(dv.totalDevoluciones,0)              as totalVentas
        FROM EstablecimientosConteo ec
        LEFT JOIN Devoluciones     dv ON dv.idEntidad = ec.idEntidad ;

        --> Compras Documentos Electronicos
        WITH DocumentosBase AS
        (
            SELECT fc.idDocumento
                  ,fc.codDoc
                  ,fc.rucEmisor
                  ,fc.claveAcceso
                  ,fc.fechaEmision
                  ,fc.serieComprobante
                  ,fc.importeTotal
                  ,fc.estado
                  ,ISNULL(st.Codigo, '06')							  as codSustento
                  ,REPLACE(fc.serieComprobante, '-', '')		      as nroDocumento
                  ,LEFT(fc.serieComprobante, 3)						  as establecimiento
                  ,SUBSTRING(fc.serieComprobante, 5, 3)				  as puntoEmision
                  ,CAST(RIGHT(fc.serieComprobante, 9) AS VARCHAR(10)) as secuencial
            FROM Recepcion.DocumentoRecibido          fc 
            LEFT JOIN FactElect.RetAtsDocSustento     ds ON ds.numAutDocSustento = fc.claveAcceso AND ds.estado = 1 
            LEFT JOIN Sri.DocumentoSustentoTributario ss ON ss.Id                = ds.documentoSustentoTributarioId
            LEFT JOIN FactElect.RetencionAts          rt ON rt.idRetencionAts    = ds.idRetencionAts AND ISNULL(rt.anuladaSri,0) = 0
            LEFT JOIN Sri.SustentoTributario          st ON st.Id                = ss.SustentoTributarioId
            WHERE fc.identificacionReceptor = @rucReceptor
              AND CAST(fc.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
              AND fc.codDoc IN ('01','04','05')
              AND fc.xmlCompressed IS NOT NULL
              AND fc.estado = 1
        ),
        TipoIdentificacionProveedor AS 
        (
            SELECT cu.IDCard															   as rucEmisor
                  ,CASE ti.codigoSri WHEN '04' THEN '01' WHEN '05' THEN '02' ELSE '03' END as tpIdProv
            FROM dbo.Proveedor                pr WITH (NOLOCK)
            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = pr.CustomerId
            INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId
            WHERE pr.idEntidad = @idEntidad
        ),
        ImpuestosCalculados AS 
        (
            SELECT DocumentoRecibidoId
                  ,CAST(SUM(CASE WHEN CodePercentage IN ('7','6') THEN TaxBase ELSE 0 END) AS NUMERIC(18, 2))				  as baseNoGraIva
                  ,CAST(SUM(CASE WHEN CodePercentage = '0' THEN TaxBase ELSE 0 END) AS NUMERIC(18, 2))					      as baseImponible
                  ,CAST(SUM(CASE WHEN CodePercentage IN ('2', '3', '4', '5', '8') THEN TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImpGrav
                  ,CAST(SUM(CASE WHEN CodePercentage = '7' THEN TaxBase ELSE 0 END) AS NUMERIC(18, 2))						  as baseImpExe
                  ,CAST(SUM(CASE WHEN Code = '3' THEN TaxValue ELSE 0 END) AS NUMERIC(18, 2))							      as montoIce
                  ,CAST(SUM(CASE WHEN Code = '2' THEN TaxValue ELSE 0 END) AS NUMERIC(18, 2))							      as montoIva
            FROM [Recepcion].[DocumentoImpuesto]   di 
            INNER JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento       = di.DocumentoRecibidoId
            INNER JOIN Sri.Establecimiento         es ON es.idEstablecimiento = dr.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND CAST(dr.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date) 
            GROUP BY DocumentoRecibidoId
        ),
        RetencionesAgrupadas AS
        (
            SELECT ds.numAutDocSustento
                  ,MAX(rt.parteRel)															   as parteRel
                  ,MAX(ds.pagoLocExt)														   as pagoLocExt
                  ,MAX(ISNULL(st.Codigo, '00'))												   as tipoRegi
                  ,MAX(ISNULL(ds.paisEfecPago, 'NA'))										   as paisEfecPago
                  ,MAX(ISNULL(ds.aplicConvDobTrib, 'NA'))									   as aplicConvDobTrib
                  ,MAX(ISNULL(ds.pagExtSujRetNorLeg, 'NA'))									   as pagExtSujRetNorLeg
                  ,MAX(es.estab)															   as estabRetencion1
                  ,MAX(pe.ptoEmi)															   as ptoEmiRetencion1
                  ,MAX(de.nroDocumento)														   as secRetencion1
                  ,MAX(de.claveAcceso)														   as autRetencion1
                  ,MAX(CONVERT(VARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy'), 106))           as fechaEmiRet1
                  ,SUM(CASE WHEN ret.codigoRetencion = '9'  THEN ret.valorRetenido ELSE 0 END) as valRetBien10
                  ,SUM(CASE WHEN ret.codigoRetencion = '10' THEN ret.valorRetenido ELSE 0 END) as valRetServ20
                  ,SUM(CASE WHEN ret.codigoRetencion = '1'  THEN ret.valorRetenido ELSE 0 END) as valorRetBienes
                  ,SUM(CASE WHEN ret.codigoRetencion = '11' THEN ret.valorRetenido ELSE 0 END) as valRetServ50
                  ,SUM(CASE WHEN ret.codigoRetencion = '2'  THEN ret.valorRetenido ELSE 0 END) as valorRetServicios
                  ,SUM(CASE WHEN ret.codigoRetencion = '3'  THEN ret.valorRetenido ELSE 0 END) as valRetServ100
            FROM FactElect.RetAtsDocSustento        ds 
            LEFT JOIN FactElect.RetencionAts        rt ON rt.idRetencionAts         = ds.idRetencionAts AND rt.anuladaSri = 0
            LEFT JOIN FactElect.RetencionAtsRet    ret ON ret.idRetAtsDocSustento   = ds.idRetAtsDocSustento
            LEFT JOIN dbo.DocumentoElectronico      de ON de.idDocumentoElectronico = rt.idDocumentoElectronico
            LEFT JOIN dbo.PuntoEmision              pe ON pe.idPuntoEmision         = de.idPuntoEmision
            LEFT JOIN FactElect.EstadoServicio      ss ON ss.idEstadoServicio       = de.idEstadoServicio
            LEFT JOIN Sri.Establecimiento           es ON es.idEstablecimiento      = pe.idEstablecimiento
            LEFT JOIN Sri.TipoRegimenFiscalExterior st ON st.Id                     = ds.tipoRegimenFiscalExteriorId
            WHERE es.idEntidad = @idEntidad
              AND ss.codigo = 4
              AND ds.estado = 1
              --AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY ds.numAutDocSustento
        ),
        DocumentosModificados AS 
        (
            SELECT dr.idDocumentoRecibido
                  ,MAX(dr.codDocSustento)					 as docModificado
                  ,MAX(LEFT(dr.numDocSustento, 3))           as estabModificado
                  ,MAX(SUBSTRING(dr.numDocSustento, 4, 3))   as ptoEmiModificado
			      ,MAX(RIGHT(dr.numDocSustento, 9))          as secModificado
				  ,(
						SELECT TOP 1 sd.claveAcceso FROM Recepcion.DocumentoRecibido sd
						INNER JOIN Sri.Establecimiento								 se ON se.idEstablecimiento = sd.idEstablecimiento
						WHERE sd.customerId = d.customerId 
						  AND REPLACE(sd.serieComprobante,'-','') = dr.numDocSustento
						  AND se.idEntidad = es.idEntidad
				   
				   ) as autModificado
            FROM FactElect.DocRelacionado        dr 
            LEFT JOIN Recepcion.DocumentoRecibido d ON d.idDocumento        = dr.idDocumentoRecibido
			INNER JOIN Sri.Establecimiento		 es ON es.idEstablecimiento = d.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND CAST(d.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date) 
            GROUP BY dr.idDocumentoRecibido,d.customerId,dr.numDocSustento,es.idEntidad
            
        )
        INSERT INTO @ComprasAts
        SELECT IIF(db.codDoc = '01', 'FE', 'NC')										   as tipoDoc
              ,db.codSustento
              ,ISNULL(tip.tpIdProv, '')													   as tpIdProv
              ,db.rucEmisor as idProv
              ,db.codDoc as tipoComprobante
              ,ISNULL(ra.parteRel, 'NO')												   as parteRel
              ,ISNULL(db.fechaEmision, '')												   as fechaRegistro
              ,db.establecimiento
              ,db.puntoEmision
              ,db.secuencial
              ,db.fechaEmision
              ,db.claveAcceso															   as autorizacion
              ,ISNULL(ic.baseNoGraIva, 0)												   as baseNoGraIva
              ,ISNULL(ic.baseImponible, 0)												   as baseImponible
              ,ISNULL(ic.baseImpGrav, 0)												   as baseImpGrav
              ,ISNULL(ic.baseImpExe, 0)													   as baseImpExe
              ,ISNULL(ic.montoIce, 0)													   as montoIce
              ,ISNULL(ic.montoIva, 0)													   as montoIva
              ,ISNULL(ra.valRetBien10, 0)												   as valRetBien10
              ,ISNULL(ra.valRetServ20, 0)												   as valRetServ20
              ,ISNULL(ra.valorRetBienes, 0)												   as valorRetBienes
              ,ISNULL(ra.valRetServ50, 0)												   as valRetServ50
              ,ISNULL(ra.valorRetServicios, 0)											   as valorRetServicios
              ,ISNULL(ra.valRetServ100, 0)												   as valRetServ100
              ,0.00 as totbasesImpReemb
              ,ISNULL(ra.pagoLocExt, '01')												   as pagoLocExt
              ,ISNULL(ra.tipoRegi, '00')												   as tipoRegi
              ,'00000'																	   as denopagoRegFis
              ,ISNULL(ra.paisEfecPago, 'NA')											   as paisEfecPago
              ,ISNULL(ra.aplicConvDobTrib, 'NA')										   as aplicConvDobTrib
              ,ISNULL(ra.pagExtSujRetNorLeg, 'NA')										   as pagExtSujRetNorLeg
              ,CASE WHEN db.codDoc = '01' AND db.importeTotal >= 500 THEN '20' ELSE '' END as formaPago
              ,db.nroDocumento
              ,ISNULL(ra.estabRetencion1, '')											   as estabRetencion1
              ,ISNULL(ra.ptoEmiRetencion1, '')											   as ptoEmiRetencion1
              ,ISNULL(ra.secRetencion1, '')												   as secRetencion1
              ,ISNULL(ra.autRetencion1, '')												   as autRetencion1
              ,ISNULL(ra.fechaEmiRet1, '')												   as fechaEmiRet1
              ,ISNULL(dm.docModificado, '')												   as docModificado
              ,ISNULL(dm.estabModificado, '')											   as estabModificado
              ,ISNULL(dm.ptoEmiModificado, '')											   as ptoEmiModificado
              ,ISNULL(dm.secModificado, '')												   as secModificado
              ,ISNULL(dm.autModificado, '')												   as autModificado
        FROM DocumentosBase db
        LEFT JOIN TipoIdentificacionProveedor tip ON tip.rucEmisor          = db.rucEmisor
        LEFT JOIN ImpuestosCalculados          ic ON ic.DocumentoRecibidoId = db.idDocumento
        LEFT JOIN RetencionesAgrupadas         ra ON ra.numAutDocSustento   = db.claveAcceso
        LEFT JOIN DocumentosModificados        dm ON dm.idDocumentoRecibido = db.idDocumento;

        --> Compras Nota de Ventas
        WITH DocumentosBase AS
        (
            SELECT fc.idFacturaCompra
                  ,fc.idProveedor
                  ,cu.IDCard as rucEmisor
                  ,fc.nroAutorizacion as claveAcceso
                  ,fc.fechaEmision
                  ,fc.puntoEmision
                  ,fc.total as importeTotal
                  ,fc.nroDocumento
                  ,SUBSTRING(fc.puntoEmision, 1, 3) as establecimiento
                  ,SUBSTRING(fc.puntoEmision, 5, 3) as puntoEmision_cod
                  ,SUBSTRING(fc.puntoEmision, 1, 3) + SUBSTRING(fc.puntoEmision, 5, 3) + RIGHT('000000000' + CONVERT(VARCHAR(9), fc.nroDocumento), 9) as nroDocumentoCompleto
                  ,REPLACE(fc.puntoEmision, '-', '') + RIGHT('000000000' + CAST(fc.nroDocumento AS VARCHAR(9)), 9) as numDocSustento
            FROM FacturaCompra fc WITH (NOLOCK)
            INNER JOIN Proveedor p WITH (NOLOCK) ON fc.idProveedor = p.idProveedor
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id = p.CustomerId
            WHERE fc.idEntidad = @idEntidad
              AND CAST(fc.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
              AND fc.nroAutorizacion NOT IN (
                  SELECT claveAcceso 
                  FROM Recepcion.DocumentoRecibido 
                  WHERE identificacionReceptor = @rucReceptor
              )
              AND fc.isAutomatic = 0
              AND fc.estado = 1
        ),
        TipoIdentificacionProveedor AS
        (
            SELECT cu.IDCard as rucEmisor
                  ,CASE ti.codigoSri 
                       WHEN '04' THEN '01' 
                       WHEN '05' THEN '02' 
                       ELSE '03' 
                   END as tpIdProv
            FROM Proveedor p WITH (NOLOCK)
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id = p.CustomerId
            INNER JOIN TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId
            WHERE p.idEntidad = @idEntidad
        ),
        ImpuestosCalculados AS
        (
            SELECT fci.FacturaCompraId
                  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje IN ('7','6') THEN fci.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseNoGraIva
                  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje = '0' THEN fci.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImponible
                  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje IN ('2', '3', '4', '5', '8') THEN fci.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImpGrav
                  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje = '7' THEN fci.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImpExe
                  ,CAST(SUM(CASE WHEN im.codigo = '3' THEN fci.TaxValue ELSE 0 END) AS NUMERIC(18, 2)) as montoIce
                  ,CAST(SUM(CASE WHEN im.codigo = '2' THEN fci.TaxValue ELSE 0 END) AS NUMERIC(18, 2)) as montoIva
            FROM Compra.FacturaImpuesto fci WITH (NOLOCK)
            INNER JOIN dbo.TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = fci.TaxPercentId
            LEFT JOIN dbo.Impuesto im WITH (NOLOCK) ON im.idImpuesto = fci.TaxId
            INNER JOIN FacturaCompra fc WITH (NOLOCK) ON fc.idFacturaCompra = fci.FacturaCompraId
            WHERE fc.idEntidad = @idEntidad
              AND CAST(fc.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY fci.FacturaCompraId
        ),
        RetencionesAgrupadas AS
        (
            SELECT ds.numAutDocSustento
                  ,ds.numDocSustento
                  ,db.idProveedor
                  ,MAX(rt.parteRel) as parteRel
                  ,MAX(ds.pagoLocExt) as pagoLocExt
                  ,MAX(ISNULL(st.Codigo, '00')) as tipoRegi
                  ,MAX(ISNULL(ds.paisEfecPago, 'NA')) as paisEfecPago
                  ,MAX(ISNULL(ds.aplicConvDobTrib, 'NA')) as aplicConvDobTrib
                  ,MAX(ISNULL(ds.pagExtSujRetNorLeg, 'NA')) as pagExtSujRetNorLeg
                  ,MAX(es.estab) as estabRetencion1
                  ,MAX(pe.ptoEmi) as ptoEmiRetencion1
                  ,MAX(de.nroDocumento) as secRetencion1
                  ,MAX(de.claveAcceso) as autRetencion1
                  ,MAX(CONVERT(VARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy'), 106)) as fechaEmiRet1
                  ,MAX(ISNULL(sts.Codigo, '06')) as codSustento
                  ,SUM(CASE WHEN ret.codigoRetencion = '9' AND sr.codigo = 1 THEN ret.valorRetenido ELSE 0 END) as valRetBien10
                  ,SUM(CASE WHEN ret.codigoRetencion = '10' AND sr.codigo = 1 THEN ret.valorRetenido ELSE 0 END) as valRetServ20
                  ,SUM(CASE WHEN ret.codigoRetencion = '1' AND sr.Codigo = 1 THEN ret.valorRetenido ELSE 0 END) as valorRetBienes
                  ,SUM(CASE WHEN ret.codigoRetencion = '11' AND sr.Codigo = 1 THEN ret.valorRetenido ELSE 0 END) as valRetServ50
                  ,SUM(CASE WHEN ret.codigoRetencion = '2' AND sr.Codigo = 1 THEN ret.valorRetenido ELSE 0 END) as valorRetServicios
                  ,SUM(CASE WHEN ret.codigoRetencion = '3' AND sr.Codigo = 1 THEN ret.valorRetenido ELSE 0 END) as valRetServ100
            FROM DocumentosBase                       db
            INNER JOIN FactElect.RetAtsDocSustento    ds WITH (NOLOCK) ON ds.numAutDocSustento      = db.claveAcceso AND ds.numDocSustento = db.numDocSustento AND ds.estado = 1
            INNER JOIN FactElect.RetencionAts         rt WITH (NOLOCK) ON rt.idRetencionAts         = ds.idRetencionAts AND rt.anuladaSri = 0 AND rt.idProveedor = db.idProveedor
            LEFT JOIN FactElect.RetencionAtsRet      ret WITH (NOLOCK) ON ret.idRetencionAts        = rt.idRetencionAts
            LEFT JOIN Sri.ImpuestoRetencion           sr WITH (NOLOCK) ON sr.Id                     = ret.impuestoRetencionId
            LEFT JOIN dbo.DocumentoElectronico        de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
            LEFT JOIN dbo.PuntoEmision                pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            LEFT JOIN Sri.Establecimiento             es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
            LEFT JOIN Sri.TipoRegimenFiscalExterior   st WITH (NOLOCK) ON st.Id                     = ds.tipoRegimenFiscalExteriorId
            LEFT JOIN Sri.DocumentoSustentoTributario ss WITH (NOLOCK) ON ss.Id                     = ds.documentoSustentoTributarioId
            LEFT JOIN Sri.SustentoTributario         sts WITH (NOLOCK) ON sts.Id                    = ss.SustentoTributarioId
            GROUP BY ds.numAutDocSustento, ds.numDocSustento, db.idProveedor
        )
        INSERT INTO @ComprasAts
        SELECT 'FF'                                                         as tipoDoc
              ,ISNULL(ra.codSustento, '06')                                 as codSustento
              ,ISNULL(tip.tpIdProv, '01')                                   as tpIdProv
              ,db.rucEmisor                                                 as idProv
              ,'02'                                                         as tipoComprobante
              ,ISNULL(ra.parteRel, 'NO')                                    as parteRel
              ,CONVERT(VARCHAR, FORMAT(db.fechaEmision, 'dd/MM/yyyy'), 106) as fechaRegistro
              ,db.establecimiento
              ,db.puntoEmision_cod as puntoEmision
              ,db.nroDocumento as secuencial
              ,CONVERT(VARCHAR, FORMAT(db.fechaEmision, 'dd/MM/yyyy'), 106) as fechaEmision
              ,db.claveAcceso                                               as autorizacion
              ,ISNULL(ic.baseNoGraIva, 0)                                   as baseNoGraIva
              ,ISNULL(ic.baseImponible, 0)                                  as baseImponible
              ,ISNULL(ic.baseImpGrav, 0)                                    as baseImpGrav
              ,ISNULL(ic.baseImpExe, 0)                                     as baseImpExe
              ,ISNULL(ic.montoIce, 0)                                       as montoIce
              ,ISNULL(ic.montoIva, 0)                                       as montoIva
              ,ISNULL(ra.valRetBien10, 0)                                   as valRetBien10
              ,ISNULL(ra.valRetServ20, 0)                                   as valRetServ20
              ,ISNULL(ra.valorRetBienes, 0)                                 as valorRetBienes
              ,ISNULL(ra.valRetServ50, 0)                                   as valRetServ50
              ,ISNULL(ra.valorRetServicios, 0)                              as valorRetServicios
              ,ISNULL(ra.valRetServ100, 0)                                  as valRetServ100
              ,0.00                                                         as totbasesImpReemb
              ,ISNULL(ra.pagoLocExt, '01')                                  as pagoLocExt
              ,ISNULL(ra.tipoRegi, '00')                                    as tipoRegi
              ,'00000' as denopagoRegFis
              ,ISNULL(ra.paisEfecPago, 'NA')                                as paisEfecPago
              ,ISNULL(ra.aplicConvDobTrib, 'NA')                            as aplicConvDobTrib
              ,ISNULL(ra.pagExtSujRetNorLeg, 'NA')                          as pagExtSujRetNorLeg
              ,CASE WHEN db.importeTotal >= 500 THEN '20' ELSE '' END       as formaPago
              ,db.nroDocumentoCompleto                                      as nroDocumento
              ,ISNULL(ra.estabRetencion1, '')                               as estabRetencion1
              ,ISNULL(ra.ptoEmiRetencion1, '')                              as ptoEmiRetencion1
              ,ISNULL(ra.secRetencion1, '')                                 as secRetencion1
              ,ISNULL(ra.autRetencion1, '')                                 as autRetencion1
              ,ISNULL(ra.fechaEmiRet1, '')                                  as fechaEmiRet1
              ,''                                                           as docModificado
              ,''                                                           as estabModificado
              ,''                                                           as ptoEmiModificado
              ,''                                                           as secModificado
              ,''                                                           as autModificado
        FROM DocumentosBase db
        LEFT JOIN TipoIdentificacionProveedor tip ON tip.rucEmisor        = db.rucEmisor
        LEFT JOIN ImpuestosCalculados          ic ON ic.FacturaCompraId   = db.idFacturaCompra
        LEFT JOIN RetencionesAgrupadas         ra ON ra.numAutDocSustento = db.claveAcceso AND ra.numDocSustento = db.numDocSustento AND ra.idProveedor = db.idProveedor

       
        SELECT  tipoDoc
               ,codSustento
               ,tpIdProv
               ,idProv
               ,tipoComprobante
               ,parteRel
               ,fechaRegistro
               ,establecimiento
               ,puntoEmision
               ,secuencial
               ,fechaEmision
               ,autorizacion
               ,baseNoGraIva
               ,baseImponible
               ,baseImpGrav
               ,baseImpExe
               ,montoIce
               ,montoIva
               ,valRetBien10
               ,valRetServ20
               ,valorRetBienes
               ,valRetServ50
               ,valorRetServicios
               ,valRetServ100
               ,totbasesImpReemb
               ,pagoLocExt
               ,tipoRegi
               ,denopagoRegFis
               ,ISNULL(NULLIF(RTRIM(paisEfecPago), ''), 'NA')       as paisEfecPago
               ,ISNULL(NULLIF(RTRIM(aplicConvDobTrib), ''), 'NA')   as aplicConvDobTrib
               ,ISNULL(NULLIF(RTRIM(pagExtSujRetNorLeg), ''), 'NA') as pagExtSujRetNorLeg
               ,formaPago
               ,nroDocumento
               ,estabRetencion1
               ,ptoEmiRetencion1
               ,secRetencion1
               ,autRetencion1
               ,fechaEmiRet1
               ,docModificado
               ,estabModificado
               ,ptoEmiModificado
               ,secModificado
               ,autModificado
        FROM @ComprasAts;

        --> Ventas facturas
        WITH Ventas as 
		(
			SELECT fa.idFactura
			      ,de.claveAcceso
			      ,td.codigoSri                                                          as tpIdCliente
	              ,CASE WHEN td.codigoSri = '07' THEN '9999999999999' ELSE cu.IDCard END as idCliente 
	              ,CASE WHEN td.codigoSri = '06' THEN tc.codigo END						 as tipoCliente
	              ,CASE WHEN td.codigoSri = '06' THEN cu.BusinessName END				 as denoCli
	              ,18																     as tipoComprobante
				  ,pa.codigo															 as formaPago
			FROM dbo.Factura                    fa 
			INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = fa.idDocumentoElectronico
			INNER JOIN dbo.Cliente              cl ON cl.idCliente              = fa.idCliente
			INNER JOIN dbo.FormaPago            fp ON fa.idFactura			    = fa.idFactura
			INNER JOIN dbo.PuntoEmision         pe ON pe.idPuntoEmision         = de.idPuntoEmision
			INNER JOIN FactElect.EstadoServicio ss ON ss.idEstadoServicio       = de.idEstadoServicio
			INNER JOIN Sri.Establecimiento      es ON es.idEstablecimiento      = pe.idEstablecimiento
			 LEFT JOIN dbo.TipoClienteProveedor tc ON tc.idTipoClienteProveedor = cl.idTipoClienteProveedor
			INNER JOIN Customer.Customer        cu ON cu.Id                     = cl.CustomerId
			INNER JOIN dbo.TipoIdentificacion   td ON td.idTipoIdentificacion   = cu.IdTypeId	
			INNER JOIN dbo.FormaPagoSri         pa ON pa.idFormaPagoSri         = fp.idFormaPago
			WHERE es.idEntidad = @idEntidad 
			  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
			  AND ss.codigo = 4

		),
		Impuestos as
		(
			SELECT fi.FacturaId
			      ,CAST(SUM(CASE WHEN ti.codigoPorcentaje IN ('7','6')			       THEN fi.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseNoGraIva
				  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje = '0'					       THEN fi.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImponible
				  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje IN ('2', '3', '4', '5', '8') THEN fi.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImpGrav
				  ,CAST(SUM(CASE WHEN im.codigo = '3'								   THEN fi.TaxValue ELSE 0 END) AS NUMERIC(18, 2))as montoIce
                  ,CAST(SUM(CASE WHEN im.codigo = '2'								   THEN fi.TaxValue ELSE 0 END) AS NUMERIC(18, 2))as montoIva
            FROM Ventas.FacturaImpuesto         fi 
            INNER JOIN dbo.TipoIva              ti ON ti.idTipoIva              = fi.TaxPercentId
			INNER JOIN dbo.Factura              fa ON fa.idFactura              = fi.FacturaId
			INNER JOIN dbo.Impuesto             im ON im.idImpuesto             = ti.idImpuesto
			INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = fa.idDocumentoElectronico
			INNER JOIN dbo.PuntoEmision         pe ON pe.idPuntoEmision			= de.idPuntoEmision
			INNER JOIN FactElect.EstadoServicio ss ON ss.idEstadoServicio       = de.idEstadoServicio
			INNER JOIN Sri.Establecimiento      es ON es.idEstablecimiento      = pe.idEstablecimiento
            WHERE fi.[Enabled] = 1
			  AND es.idEntidad = @idEntidad 
			  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
			  AND ss.codigo = 4
			GROUP BY fi.FacturaId
		),
		Retenciones as 
		(
			SELECT dr.claveAcceso
			      ,CAST(SUM(CASE WHEN di.Code = '2' THEN di.TaxValue ELSE 0 END) AS NUMERIC(18, 2)) as valorRetIva
			      ,CAST(SUM(CASE WHEN di.Code = '1' THEN di.TaxValue ELSE 0 END) AS NUMERIC(18, 2)) as valorRetRenta
            FROM FactElect.DocRelacionado		   dr
            INNER JOIN Recepcion.DocumentoRecibido dd ON dd.idDocumento			= dr.idDocumentoRecibido
            INNER JOIN Recepcion.DocumentoImpuesto di ON di.DocumentoRecibidoId = dd.idDocumento
			INNER JOIN Sri.Establecimiento         es ON es.idEstablecimiento   = dd.idEstablecimiento
			WHERE dd.codDoc = '07'
			  AND es.idEntidad = @idEntidad
			  --AND TRY_CAST(dd.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
			GROUP BY dr.claveAcceso
		)
        INSERT INTO @VentasATS
        (
             tpIdCliente
            ,idCliente
            ,tipoCliente
            ,denoCli
            ,tipoComprobante
            ,formaPago
            ,baseNoGraIva
            ,baseImponible
            ,baseImpGrav
            ,montoIva
            ,montoIce
            ,valorRetIva
            ,valorRetRenta
        )
		SELECT ve.tpIdCliente
              ,ve.idCliente
              ,ve.tipoCliente
              ,ve.denoCli
              ,ve.tipoComprobante
              ,ve.formaPago
              ,im.baseNoGraIva
              ,im.baseImponible
              ,im.baseImpGrav
              ,im.montoIva
              ,im.montoIce
              ,ISNULL(re.valorRetIva,0)
              ,ISNULL(re.valorRetRenta,0)
		FROM Ventas ve
		INNER JOIN Impuestos   im ON im.FacturaId   = ve.idFactura
		 LEFT JOIN Retenciones re ON re.claveAcceso = ve.claveAcceso;

        --> Ventas Notas de credito
        WITH Devoluciones as 
		(
				
			SELECT nc.idNotaCredito 
			      ,td.codigoSri                                                          as tpIdCliente
			      ,CASE WHEN td.codigoSri = '07' THEN '9999999999999' ELSE cu.IDCard END as idCliente 
			      ,CASE WHEN td.codigoSri = '06' THEN tc.codigo END                      as tipoCliente
			      ,CASE WHEN td.codigoSri = '06' THEN cu.BusinessName END                as denoCli
			      ,'04'                                                                  as tipoComprobante
			FROM dbo.NotaCredito                nc 
			INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = nc.idDocumentoElectronico
			INNER JOIN dbo.PuntoEmision         pe ON pe.idPuntoEmision         = de.idPuntoEmision
			INNER JOIN FactElect.EstadoServicio ss ON ss.idEstadoServicio       = de.idEstadoServicio
			INNER JOIN dbo.Cliente              cl ON nc.idCliente              = cl.idCliente
			 LEFT JOIN dbo.TipoClienteProveedor tc ON tc.idTipoClienteProveedor = cl.idTipoClienteProveedor
			INNER JOIN Customer.Customer        cu ON cu.Id                     = cl.CustomerId
			INNER JOIN Sri.Establecimiento      es ON es.idEstablecimiento      = pe.idEstablecimiento
			INNER JOIN dbo.TipoIdentificacion   td ON td.idTipoIdentificacion   = cu.IdTypeId	
			WHERE es.idEntidad = @idEntidad 
			AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
			AND ss.codigo = 4

		),
		Impuestos as
		(
			SELECT ni.NotaCreditoId
			      ,CAST(SUM(CASE WHEN ti.codigoPorcentaje IN ('7','6')			       THEN ni.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseNoGraIva
				  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje = '0'					       THEN ni.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImponible
				  ,CAST(SUM(CASE WHEN ti.codigoPorcentaje IN ('2', '3', '4', '5', '8') THEN ni.TaxBase ELSE 0 END) AS NUMERIC(18, 2)) as baseImpGrav
				  ,CAST(SUM(CASE WHEN im.codigo = '3'								   THEN ni.TaxValue ELSE 0 END) AS NUMERIC(18, 2))as montoIce
                  ,CAST(SUM(CASE WHEN im.codigo = '2'								   THEN ni.TaxValue ELSE 0 END) AS NUMERIC(18, 2))as montoIva
            FROM Ventas.NotaCreditoImpuesto     ni 
            INNER JOIN dbo.TipoIva              ti ON ti.idTipoIva              = ni.TaxPercentId
			INNER JOIN dbo.NotaCredito          nc ON nc.idNotaCredito          = ni.NotaCreditoId
			INNER JOIN dbo.Impuesto             im ON im.idImpuesto             = ti.idImpuesto
			INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = nc.idDocumentoElectronico
			INNER JOIN dbo.PuntoEmision         pe ON pe.idPuntoEmision			= de.idPuntoEmision
			INNER JOIN FactElect.EstadoServicio ss ON ss.idEstadoServicio       = de.idEstadoServicio
			INNER JOIN Sri.Establecimiento      es ON es.idEstablecimiento      = pe.idEstablecimiento
            WHERE ni.[Enabled] = 1
			  AND es.idEntidad = @idEntidad 
			  AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
			  AND ss.codigo = 4
			GROUP BY ni.NotaCreditoId
		)
        INSERT INTO @VentasATS (
             tpIdCliente
            ,idCliente
            ,tipoCliente
            ,denoCli
            ,tipoComprobante
            ,baseNoGraIva
            ,baseImponible
            ,baseImpGrav
            ,montoIva
            ,montoIce
        )
		SELECT dv.tpIdCliente
              ,dv.idCliente
              ,dv.tipoCliente
              ,dv.denoCli
              ,dv.tipoComprobante
              ,im.baseNoGraIva
              ,im.baseImponible
              ,im.baseImpGrav
              ,im.montoIva
              ,im.montoIce
		FROM Devoluciones    dv 
		INNER JOIN Impuestos im ON im.NotaCreditoId = dv.idNotaCredito

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
 	      AND ss.codigo = 4;


        --> Ventas por establecimiento
        WITH Devoluciones AS
        (
            SELECT es.idEstablecimiento
                  ,CAST(ISNULL(nc.subtotalsinImpuestos,0) AS NUMERIC(18,2)) AS totalDevolucion
            FROM dbo.DocumentoElectronico       de WITH (NOLOCK) 
            INNER JOIN dbo.NotaCredito          nc WITH (NOLOCK) ON nc.idDocumentoElectronico = de.idDocumentoElectronico
            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND ss.codigo = 4 
              AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
        ),
        Ventas AS 
        (
            SELECT es.idEstablecimiento
                  ,es.estab as codEstab
                  ,0.00     as ivaComp
                  ,SUM(CAST(ISNULL(fe.subtotalsinImpuestos,0) AS NUMERIC(18,2)) ) as totalVentas
            FROM dbo.DocumentoElectronico       de WITH (NOLOCK) 
             LEFT JOIN dbo.Factura              fe WITH (NOLOCK) ON fe.idDocumentoElectronico = de.idDocumentoElectronico
            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio       = de.idEstadoServicio
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND ss.codigo = 4 
              AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY es.idEstablecimiento,es.estab
        )
        SELECT ve.totalVentas - ISNULL(dv.totalDevolucion,0) as ventasEstab
	          ,ve.codEstab
              ,ve.ivaComp
	    FROM Ventas            ve
        LEFT JOIN Devoluciones dv ON dv.idEstablecimiento = ve.idEstablecimiento

    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario], [additionalInfo])
        VALUES('Ats/Download', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), '[dbo].[ASPAtsGetData]', ERROR_LINE(), ERROR_MESSAGE(), @userId, N'{' +
        N'"userRoleId": ' + CAST(@userRoleId AS NVARCHAR) + N',' +
        N'"params": ' + @json + N'}');
        THROW;
    END CATCH
END
