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

-- exec ReporteCompras.RetencionCompra '{"id":2, "versionComp": "1.0.0"}'
CREATE OR ALTER  PROCEDURE ReporteCompras.RetencionCompra	@json NVARCHAR(MAX)
AS
BEGIN
 SET NOCOUNT  ON;
 SET LANGUAGE SPANISH;

 DECLARE @id BIGINT ,@idTipoDocumento INT ,@versionComp VARCHAR(10) ,@idDocumentoElectronico INT

 SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) where codigoSri = '07'

 SELECT @id = id ,@versionComp = versionComp ,@idDocumentoElectronico = idDocumentoElectronico FROM OPENJSON(@json) WITH (id INT ,versionComp VARCHAR(MAX), idDocumentoElectronico INT) AS dt 

 IF @idDocumentoElectronico > 0
        BEGIN
            SELECT TOP 1 @id = idRetencionAts FROM FactElect.RetencionAts WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico
        END

	IF @versionComp = '2.0.0'
		BEGIN
            
                    SELECT  rc.idRetencionAts                                                    as idRetencionCompra
						   ,de.serieComprobante                                                  as nroDocumento
						   ,de.claveAcceso                                                       
						   ,de.claveAcceso                                                       as nroAutorizacion
                           ,de.claveAcceso                                                       as codigoAutorizacion
						   ,FORMAT(de.fechaEmision, 'dd/MM/yyyy')                                as fechaEmision 
                           ,FORMAT(de.fechaAutorizacion, 'dd/MM/yyyy hh:mm')                     as fechaAutorizacion								
						   ,'Comprobante de Retención'                                           as tipoDocumento
						   ,CASE WHEN UPPER(pe.ambiente) =1 THEN 'PRUEBAS' ELSE 'PRODUCCIÓN' END as ambiente
						   ,CASE WHEN rc.tipoEmision = '1' THEN 'NORMAL' ELSE '' END             as emision
						   ,en.razonSocial                                                       as razonSocialEntidad
						   ,en.ruc                                                               as rucEntidad
                           ,en.nombreComercial                                                   as nombreComercialEntidad
						   ,en.telefono                                                          as telefonoEntidad
						   ,en.email                                                             as emailEntidad											
						   ,en.direccion                                                         as direccionEntidad 
						   ,'07'                                                                 as codDoc	
						   ,es.contribuyenteEspecial
						   ,es.obligadoContabilidad                                              as obligadoLlevarContabilidad	 
						   ,es.dirEstablecimiento  
						   ,ISNULL(es.contribuyenteRimpe,'')                                     as contribuyenteRimpe
						   ,ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+es.agenteRetencion,'') as agenteRetencion
						   ,cu.IDCard                                                            as nroIdentificacion
						   ,cu.BusinessName                                                      as nombreFiscalProveedor
						   ,ISNULL(pv.correo, 'S/N')                                             as correoProveedor
						   ,ISNULL(pv.telefono, 'S/N')                                           as telefonoProveedor
						   ,ISNULL(pv.direccion, 'S/N')                                          as direccionProveedor	
						   ,CAST((SELECT SUM(ret.valorRetenido) FROM FactElect.RetencionAtsRet ret WHERE ret.idRetencionAts = @id AND ret.idRetAtsDocSustento IS NOT NULL) as numeric(15, 2)) as totalValorRetenido
					FROM FactElect.RetencionAts         rc WITH (NOLOCK)
					INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = rc.idDocumentoElectronico
                     LEFT JOIN dbo.Proveedor            pv WITH (NOLOCK) ON pv.idProveedor            = rc.idProveedor
                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
					INNER JOIN Entidad                  en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad
                    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = pv.CustomerId
                    INNER JOIN dbo.TipoIdentificacion   ti WITH (NOLOCK) ON ti.idTipoIdentificacion   = cu.IdTypeId
 					WHERE rc.idRetencionAts =  @id

                    SELECT ds.codDocSustento                                as comprobante
						  ,i.descripcion                                    as impuesto
						  ,ret.codigoRetencion
						  ,FORMAT(rcd.fechaEmisionDocSustento,'dd/MM/yyyy') as fechaEmisionComprobante
						  ,rcd.numDocSustento                               as nroFactura
						  ,CAST(ret.porcentajeRetener as numeric(15, 2))    as porcentajeRetencion
						  ,CAST(ret.baseImponible AS numeric(15,2))         as baseImponible 
						  ,CAST(ret.valorRetenido as numeric(15, 2))        as valorRetenido
					FROM FactElect.RetAtsDocSustento rcd WITH (NOLOCK)
					INNER JOIN Sri.DocumentoSustento      ds WITH (NOLOCK) ON rcd.codDocSustento      = ds.codDocSustento
					INNER JOIN FactElect.RetencionAtsRet ret WITH (NOLOCK) ON rcd.idRetAtsDocSustento = ret.idRetAtsDocSustento
					INNER JOIN Sri.ImpuestoRetencion       i WITH (NOLOCK) ON ret.codigo              = i.codigo
					WHERE rcd.idRetencionAts = @id

                    SELECT nombre,valor FROM FactElect.RetAtsInfoAdicional WITH (NOLOCK) WHERE idRetencionAts = @id
		END

END 

