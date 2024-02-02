USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPGuiaRemisionReport]    Script Date: 25/11/2022 15:24:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 19 de abril del 2022
-- Description: usp para obtener el reporte de Guia de Remision 
--exec ReporteLogistica.GuiaRemision [{ "id": 14}]
-- =============================================
CREATE OR ALTER PROCEDURE Logistica.GuiaRemision_Report @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idGuiaRemision BIGINT 
    DECLARE @idTipoDocumento bigint 
    
    SELECT @idGuiaRemision = idGuiaRemision  FROM OPENJSON(@json) WITH (idGuiaRemision INT '$.id') AS dt 

    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) where codigoSri = '06'

    SELECT dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,gr.nroDocumento)               as serieComprobante
		  ,gr.claveAcceso                                                               as codigoAutorizacion
          ,gr.claveAcceso
		  ,FORMAT(gr.fechaAutorizacion, 'dd/MM/yyy hh:mm:ss')                           as fechaAutorizacion
		  ,FORMAT(gr.fechaEmision, 'dd/MM/yyy')                                         as fechaEmision
		  ,'GUIA DE REMISIÓN'                                                           as tipoDoc
		  ,CASE WHEN pe.ambiente = '1' THEN 'PRUEBA' ELSE 'PRODUCIÓN' END               as ambiente
		  ,CASE WHEN gr.emision = '1' THEN 'NORMAL' ELSE '' END                         as emision
		  ,en.razonSocial
		  ,en.ruc                                                     
		  ,es.dirEstablecimiento                                                        as dirMatriz
          ,es.telefono
          ,es.correo  
		  ,es.contribuyenteEspecial
		  ,es.obligadoContabilidad 
		  ,es.nombreComercial
		  ,es.contribuyenteRimpe
		  ,ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+es.agenteRetencion,'')         as agenteRetencion
		  ,tr.nroIdentificacion                                                         as rucTransportista
		  ,tr.nombre                                                                    as razonSocialTransportista
		  ,ve.placa
		  ,gr.ptoPartida 
		  ,FORMAT(gr.fechaInicio, 'dd/MM/yyy')                                          as fechaIniTransporte
		  ,FORMAT(gr.fechaFin, 'dd/MM/yyy')                                             as fechaFinTransporte							
		  ,gr.motivo
		  ,gr.ptoLlegada 
		  ,gr.docAduanero
		  ,gr.estableDestino
		  ,gr.ruta 
		  ,cl.nombreFiscal                                                              as razonSocialDestinatario
		  ,cl.numeroIdentificacion                                                      as identificacionDestinatario
		  ,cl.direccion                                                                 as direccionDestinatario
          ,'Factura: ' + Common.ufnGetSerieDocument(ef.estab,pf.ptoEmi,fa.nroFactura,0) as numDocSustento
	FROM dbo.GuiaRemision          gr WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision  = gr.idPuntoEmision 
	INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente       = gr.idCliente
	INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad       = gr.idEntidad
     LEFT JOIN dbo.Transportista   tr WITH (NOLOCK) ON tr.idTransportista = gr.idTransportista
     LEFT JOIN dbo.Vehiculo        ve WITH (NOLOCK) ON ve.idVehiculo      = gr.idVehiculo
     LEFT JOIN dbo.Factura         fa WITH (NOLOCK) ON fa.idFactura       = gr.idFactura
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab        = pe.codEstab
     LEFT JOIN dbo.PuntoEmision    pf WITH (NOLOCK) ON pf.idPuntoEmision  = fa.idPuntoEmision
     LEFT JOIN Sri.Establecimiento ef WITH (NOLOCK) ON ef.codEstab        = pf.codEstab
	WHERE gr.idGuiaRemision = @idGuiaRemision

    SELECT ar.codigo 
		  ,ar.codigoAuxiliar 
		  ,CAST(gr.cantidad as numeric(18,2)) as cantidad
		  ,gr.descripcion 			
	FROM GuiaRemisionDetalle gr WITH (NOLOCK)		
	INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = gr.idArticulo 
	WHERE gr.idGuiaRemision = @idGuiaRemision

    SELECT nombre,valor
	FROM dbo.InfoAdicionalDoc WITH (NOLOCK)
	WHERE idComprobante = @idGuiaRemision 
      AND idTipoDocumento = @idTipoDocumento



END
