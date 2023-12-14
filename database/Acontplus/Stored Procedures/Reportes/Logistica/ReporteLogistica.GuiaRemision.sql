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
IF OBJECT_ID(N'ReporteLogistica.GuiaRemision', N'P') IS NOT NULL
DROP PROCEDURE ReporteLogistica.GuiaRemision
GO
CREATE PROCEDURE ReporteLogistica.GuiaRemision @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idGuiaRemision BIGINT 
    DECLARE @idTipoDocumento bigint 
    
    SET @idTipoDocumento = (SELECT idTipoDocumento FROM dbo.TipoDocumento with (nolock) where codigoSri = '06')
	
    SELECT @idGuiaRemision = idGuiaRemision  
    FROM OPENJSON(@json) WITH (
                                idGuiaRemision INT '$.id'
                               ) AS dt 


            SELECT  nroDocumento        = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,gr.nroDocumento) 
				,codigoAutorizacion  = gr.claveAcceso 
				,fechaAutorizacion   = CONVERT(NVARCHAR, FORMAT(ISNULL(gr.fechaAutorizacion, gr.fechaEmision), 'dd/MM/yyy hh:mm:ss'))
				,tipoDoc             = 'GUIA DE REMISIÓN'
				,ambiente            = CASE WHEN pe.ambiente = '1' THEN 'PRUEBA' ELSE 'PRODUCIÓN' END 
				,emision             = CASE WHEN gr.emision = '1' THEN 'NORMAL' ELSE '' END
				,razonSocial         = e.razonSocial
				,ruc                 = e.ruc
				,entidadTelefono     = ISNULL(e.telefono, 'SN')
				,entidadEmail        = ISNULL(e.email, 'SN') 
				,claveAcceso         = gr.claveAcceso 
				,estab          
				,ptoEmi          
				,secuencial          = dbo.AFTAutoComplete(gr.nroDocumento) 
				,dirMatriz           = e.direccion 
				,fechaEmision        = dbo.AFTConvertDate(gr.fechaEmision)
				,s.dirEstablecimiento   
				,s.contribuyenteEspecial
				,s.obligadoContabilidad 
				,s.nombreComercial
				,contribuyenteRimpe = ISNULL(s.contribuyenteRimpe,'')
				,agenteRetencion = ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+s.agenteRetencion,'')
				,nroIdentificacionTransportista = t.nroIdentificacion
				,nombreTransportista       = t.nombre 
				,placa                     = v.placa
				,ptoPartida                = gr.ptoPartida 
				,fechaInicioTransporte     = gr.fechaInicio
				,fechaFinTransporte        = gr.fechaFin							
				,motivoTraslado            = gr.motivo
				,ptoLlegada                = gr.ptoLlegada 
				,docAduanero               = gr.docAduanero
				,codEstablecimientoDestino = gr.estableDestino
				,ruta                      = gr.ruta 
				,razonSocialComprador      = cl.nombreFiscal
				,nroIdentificacionCliente  = cl.numeroIdentificacion 
				,direccionComprador		   = cl.direccion
				,direccion                 = cl.direccion  
				,periodoFiscal             = CONVERT(NVARCHAR, FORMAT(gr.fechaEmision, 'MM/yyyy'),106) 
				,codigo = '20'
			FROM dbo.GuiaRemision gr WITH (NOLOCK)
			INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON pe.idPuntoEmision  = gr.idPuntoEmision 
			INNER JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab         = pe.codEstab
			INNER JOIN dbo.Cliente        cl WITH (NOLOCK) ON cl.idCliente       = gr.idCliente
			INNER JOIN dbo.Entidad         e WITH (NOLOCK) ON e.idEntidad        = gr.idEntidad
			 LEFT JOIN dbo.Transportista   t WITH (NOLOCK) ON t.idTransportista = gr.idTransportista
			 LEFT JOIN dbo.Vehiculo        v WITH (NOLOCK) ON v.idVehiculo = gr.idVehiculo
			WHERE gr.idGuiaRemision = @idGuiaRemision

            SELECT a.codigo as codigo
			    ,a.codigoAuxiliar as codigoAuxiliar
				,grd.cantidad 
				,grd.descripcion 			
			FROM GuiaRemisionDetalle grd WITH (NOLOCK)		
			INNER JOIN Articulo a WITH (NOLOCK) ON a.idArticulo = grd.idArticulo 
			WHERE grd.idGuiaRemision = @idGuiaRemision

            SELECT nombre
                ,valor
			FROM dbo.InfoAdicionalDoc WITH (NOLOCK)
			WHERE idComprobante = @idGuiaRemision 
                AND idTipoDocumento = @idTipoDocumento



END
