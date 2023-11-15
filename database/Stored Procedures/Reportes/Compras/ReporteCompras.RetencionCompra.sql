USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPRetencionCompraReport]    Script Date: 12/8/2022 2:49:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Author: Emilio Senguana
--Date: 22 de abril del 2022
--Description: procedure for report Retencion Compra
--exec ReporteCompras.RetencionCompra '{\"versionComp\":\"2.0.0\",\"id\":475,\"codEstab\":\"ESTAB-000000069\",\"codigo\":\"RRC\",\"format\":\"pdf\"}'

IF OBJECT_ID(N'ReporteCompras.RetencionCompra', N'P') IS NOT NULL
DROP PROCEDURE ReporteCompras.RetencionCompra
GO

-- exec ReporteCompras.RetencionCompra '{"id":2, "versionComp": "1.0.0"}'
CREATE PROCEDURE ReporteCompras.RetencionCompra	@json NVARCHAR(MAX)
AS
BEGIN
 SET NOCOUNT  ON;
 SET LANGUAGE SPANISH;

 DECLARE @id BIGINT
 DECLARE @idTipoDocumento BIGINT
 DECLARE @versionComp VARCHAR(10)
 DECLARE @fechaAutorizacion DATETIME 

 SET @idTipoDocumento = (SELECT idTipoDocumento FROM dbo.TipoDocumento with (nolock) where codigoSri = '07')

	SELECT 
		 @id = id
		,@versionComp = versionComp 
	FROM OPENJSON(@json)
	WITH (
		 id INT '$.id',
		 versionComp VARCHAR(MAX) '$.versionComp'
	) AS dt 
	
	SELECT @fechaAutorizacion = fechaAutorizacion FROM DocumentoElectronico WITH (NOLOCK) WHERE idDocumento = @id AND codDoc = '07' AND versionComp = @versionComp
	
	IF @versionComp = '1.0.0'
		BEGIN

                    SELECT rc.idRetencionCompra
						,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,rc.nroDocumento) nroDocumento
						,rc.claveAcceso  as nroAutorizacion
                        ,rc.claveAcceso as codigoAutorizacion
						,fechaAutorizacion = IIF(rc.fechaAutorizacionSri=NULL, '', CONVERT(NVARCHAR, FORMAT(rc.fechaAutorizacionSri, 'dd/MM/yyyy hh:mm')))
						,tipoDocumento = 'Retención'
						,ambiente = IIF(pe.ambiente='1','PRUEBA','PRODCCIÓN')
						,CASE WHEN rc.emision = '1' THEN 'NORMAL' ELSE '' END AS emision
						,e.razonSocial as razonSocialEntidad
						,s.nombreComercial as nombreComercialEntidad
						,e.ruc as rucEntidad
						,e.telefono as telefonoEntidad
						,e.email as emailEntidad											
						,e.direccion as direccionEntidad			
						,s.dirEstablecimiento 
						,rc.claveAcceso as  claveAcceso 
						,contribuyenteRimpe = ISNULL(s.contribuyenteRimpe,'')
						      ,agenteRetencion = ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+s.agenteRetencion,'') 
						,obligadoLlevarContabilidad = s.obligadoContabilidad			 			
						,prov.numeroIdentificacion as nroIdentificacion
						,prov.nombreFiscal as nombreFiscalProveedor
						,ISNULL(prov.correo, 'S/N') as correoProveedor
						,ISNULL(prov.telefono, 'S/N') as telefonoProveedor
						,ISNULL(prov.direccion, 'S/N') as direccionProveedor								
						,CONVERT(NVARCHAR, FORMAT(rc.fechaEmision, 'dd/MM/yyyy hh:mm')) as fechaEmision 		
						,CAST((SELECT SUM(valorRetenido) FROM dbo.RetencionCompraDetalle WHERE idRetencionCompra = @id) as numeric(15, 2)) as totalValorRetenido
					FROM dbo.RetencionCompra rc WITH (NOLOCK)
					INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision       = rc.idPuntoEmision 
					INNER JOIN Sri.Establecimiento     s WITH (NOLOCK) ON s.codEstab              = pe.codEstab
					INNER JOIN dbo.Proveedor        prov WITH (NOLOCK) ON prov.idProveedor        = rc.idProveedor
					INNER JOIN dbo.Entidad             e WITH (NOLOCK) ON e.idEntidad             = rc.idEntidad	
					WHERE rc.idRetencionCompra =  @id

                    SELECT 
						 td.descripcion as comprobante
						,i.descripcion as impuesto
						,CASE WHEN i.codigo = 1 THEN (SELECT codigoAnexo FROM RetencionRenta WITH (NOLOCK) WHERE idRetencionRenta = rcd.idRetencion)
							  WHEN i.codigo = 2 THEN (SELECT codigoSri FROM RetencionIva WITH (NOLOCK) WHERE idRetencionIva = rcd.idRetencion)
						  END AS codigoRetencion
						,CONVERT(NVARCHAR, FORMAT(fc.fechaEmision, 'dd/MM/yyyy hh:mm:ss')) as fechaEmisionComprobante
						,dbo.AFTGenerarNroDocumento(fc.puntoEmision,fc.nroDocumento) nroFactura
						,CAST(rcd.porcentajeRetencion as numeric(15, 2)) as porcentajeRetencion
						,CAST(rcd.baseImponible AS numeric(15,2))  as baseImponible 
						,CAST(rcd.valorRetenido as numeric(15, 2)) as valorRetenido
						FROM dbo.RetencionCompraDetalle rcd WITH (NOLOCK)
						INNER JOIN dbo.Impuesto         i WITH (NOLOCK) ON i.idImpuesto         = rcd.idImpuesto 
						INNER JOIN dbo.RetencionCompra rc WITH (NOLOCK) ON rc.idRetencionCompra = rcd.idRetencionCompra
						INNER JOIN dbo.FacturaCompra   fc WITH (NOLOCK) ON fc.idFacturaCompra   = rc.idFacturaCompra	
						INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = fc.idTipoDocumento
						WHERE rcd.idRetencionCompra =  @id

                        SELECT nombre,valor FROM InfoAdicionalDoc WITH (NOLOCK) WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento
                    RETURN
		END
	
	IF @versionComp = '2.0.0'
		BEGIN
                    SELECT 
						    rc.idRetencionAts idRetencionCompra
						   ,dbo.AFTGenerarNroDocumento(s.estab+rc.ptoEmi,rc.secuencial) nroDocumento
						   ,rc.claveAcceso  as nroAutorizacion
                           ,rc.claveAcceso as codigoAutorizacion
						   ,fechaAutorizacion = IIF(@fechaAutorizacion=NULL, '', CONVERT(NVARCHAR, FORMAT(@fechaAutorizacion, 'dd/MM/yyyy hh:mm')))									
						   ,tipoDocumento = UPPER(td.descripcion)
						   ,CASE WHEN UPPER(rc.ambiente) =1 THEN 'PRUEBAS' ELSE 'PRODUCCIÓN' END as ambiente
						   ,CASE WHEN rc.tipoEmision = '1' THEN 'NORMAL' ELSE '' END AS emision
						   ,e.razonSocial as razonSocialEntidad
						   ,e.nombreComercial as nombreComercialEntidad
						   ,e.ruc as rucEntidad
						   ,e.telefono as telefonoEntidad
						   ,e.email as emailEntidad											
						   ,e.direccion as direccionEntidad
						   ,rc.claveAcceso as  claveAcceso 
						   ,td.codigoSri as codDoc	
						   ,s.contribuyenteEspecial
						   ,s.obligadoContabilidad obligadoLlevarContabilidad	 
						   ,s.dirEstablecimiento  
						   ,contribuyenteRimpe = ISNULL(s.contribuyenteRimpe,'')
						         ,agenteRetencion = ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+s.agenteRetencion,'') 
						   ,prov.numeroIdentificacion as nroIdentificacion
						   ,prov.nombreFiscal as nombreFiscalProveedor
						   ,ISNULL(prov.correo, 'S/N') as correoProveedor
						   ,ISNULL(prov.telefono, 'S/N') as telefonoProveedor
						   ,ISNULL(prov.direccion, 'S/N') as direccionProveedor								
						   ,CONVERT(varchar(50), FORMAT(rc.fechaEmision, 'dd/MM/yyyy'), 106) as fechaEmision 		
						   ,CAST((SELECT SUM(ret.valorRetenido) FROM FactElect.RetencionAtsRet ret WHERE ret.idRetencionAts = @id AND ret.idRetAtsDocSustento IS NOT NULL) as numeric(15, 2)) as totalValorRetenido
					FROM FactElect.RetencionAts        rc WITH (NOLOCK)
					INNER JOIN Sri.Establecimiento      s WITH (NOLOCK) ON s.codEstab              = rc.codEstab
					inner JOIN dbo.TipoDocumento       td WITH (NOLOCK) ON td.codigoSri            = '07'
					LEFT JOIN dbo.Proveedor         prov WITH (NOLOCK) ON prov.idProveedor        = rc.idProveedor
					LEFT JOIN dbo.TipoIdentificacion  ti WITH (NOLOCK) ON ti.idTipoIdentificacion = prov.idTipoIdentificacion		
					LEFT JOIN dbo.DocumentoElectronico d WITH (NOLOCK) ON s.codEstab              = d.codEstab
					AND d.codDoc = '07' 
					AND rc.idRetencionAts = d.idDocumento
					AND d.versionComp = '2.0.0'
					LEFT JOIN Entidad e WITH(NOLOCK) ON e.ruc = d.ruc 								
 					WHERE rc.idRetencionAts =  @id

                    SELECT 
						    ds.codDocSustento as comprobante
						    ,i.descripcion as impuesto
						    ,ret.codigoRetencion
						    ,CONVERT(VARCHAR, FORMAT(rcd.fechaEmisionDocSustento, 'dd/MM/yyyy'), 106) as fechaEmisionComprobante
						    ,rcd.numDocSustento nroFactura
						    ,CAST(ret.porcentajeRetener as numeric(15, 2)) as porcentajeRetencion
						    ,CAST(ret.baseImponible AS numeric(15,2))  as baseImponible 
						    ,CAST(ret.valorRetenido as numeric(15, 2)) as valorRetenido
					FROM FactElect.RetAtsDocSustento rcd WITH (NOLOCK)
					INNER JOIN Sri.DocumentoSustento      ds WITH (NOLOCK) ON rcd.codDocSustento      = ds.codDocSustento
					INNER JOIN FactElect.RetencionAtsRet ret WITH (NOLOCK) ON rcd.idRetAtsDocSustento = ret.idRetAtsDocSustento
					INNER JOIN Sri.ImpuestoRetencion       i WITH (NOLOCK) ON ret.codigo              = i.codigo
					WHERE rcd.idRetencionAts = @id

                    SELECT nombre,valor FROM FactElect.RetAtsInfoAdicional WITH (NOLOCK) WHERE idRetencionAts = @id
		END

END 

