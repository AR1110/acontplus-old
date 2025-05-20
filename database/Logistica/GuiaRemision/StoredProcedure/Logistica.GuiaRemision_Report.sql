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
--exec Logistica.GuiaRemision_Report [{ "id": 14}]
-- =============================================
CREATE OR ALTER PROCEDURE Logistica.GuiaRemision_Report @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Filters
	DECLARE @id INT ,@idTipoDocumento INT ,@idDocumentoElectronico INT
    
    SELECT @id = id ,@idDocumentoElectronico = idDocumentoElectronico FROM OPENJSON(@json) WITH (id INT, idDocumentoElectronico INT) AS dt 

    IF @idDocumentoElectronico > 0
        BEGIN
            SELECT TOP 1 @id = idGuiaRemision FROM dbo.GuiaRemision WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico
        END

    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) where codigoSri = '06'

    SELECT de.serieComprobante
		  ,de.claveAcceso                                                               as codigoAutorizacion
          ,de.claveAcceso
		  ,FORMAT(de.fechaAutorizacion, 'dd/MM/yyy hh:mm:ss')                           as fechaAutorizacion
		  ,FORMAT(de.fechaEmision, 'dd/MM/yyy')                                         as fechaEmision
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
		  ,cu.BusinessName                                                              as razonSocialDestinatario
		  ,cu.IDCard                                                                    as identificacionDestinatario
		  ,cl.direccion                                                                 as direccionDestinatario
          ,df.serieComprobante                                                          as numDocSustento
	FROM dbo.GuiaRemision               gr WITH (NOLOCK)
	INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = gr.idDocumentoElectronico
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision 
	INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = gr.idCliente
     LEFT JOIN dbo.Transportista        tr WITH (NOLOCK) ON tr.idTransportista        = gr.idTransportista
     LEFT JOIN dbo.Vehiculo             ve WITH (NOLOCK) ON ve.idVehiculo             = gr.idVehiculo
     LEFT JOIN dbo.Factura              fa WITH (NOLOCK) ON fa.idFactura              = gr.idFactura
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
    INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad
     LEFT JOIN dbo.DocumentoElectronico df WITH (NOLOCK) ON df.idDocumentoElectronico = fa.idDocumentoElectronico
    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
	WHERE gr.idGuiaRemision = @id

    SELECT ar.codigo 
		  ,ar.codigoAuxiliar 
		  ,CAST(gr.cantidad as numeric(18,2)) as cantidad
		  ,gr.descripcion 			
	FROM GuiaRemisionDetalle gr WITH (NOLOCK)		
	INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = gr.idArticulo 
	WHERE gr.idGuiaRemision = @id
      AND gr.estado = 1
    ORDER BY gr.idGuiaRemisionDetalle ASC

    SELECT nombre,valor
	FROM dbo.InfoAdicionalDoc WITH (NOLOCK)
	WHERE idComprobante = @id 
      AND idTipoDocumento = @idTipoDocumento
      AND estado = 1



END
